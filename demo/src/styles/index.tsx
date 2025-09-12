import React, { useEffect, useRef } from "react";
import {
    View as RNView,
    Text as RNText,
    TouchableOpacity,
    Platform,
} from "react-native";
import { globalData, StyleContext, ThemeContext } from "../theme/ThemeContext";
import { CSSProps, CSSStyle } from "./CSSStyle";
import { ifSelector, newId, refCreator, setRef, ValueIdentity } from "../config";
import NestedStyleSheet from "./NestedStyleSheet";
import cssTranslator, { clearCss } from "./cssTranslator";
import { IParent } from "../Typse";
import { cleanStyle, useStyled, positionContext, useLocalRef } from "../hooks";

export class CMBuilder {
    __name: string;
    __View: any;
    myRef: any = undefined;
    constructor(name: string, view: any) {
        this.__name = name;
        this.__View = view;
        //  console.log(view)
    }

    setRef(cRef: any, c: any) {
        if (c === null)
            return;
        if (c === this.myRef) {
            return;
        }
        try {
            setRef(cRef, c);
        } catch (e) {
            console.error(e)
        } finally {
            this.myRef = c;
        }
    }

    fn() {
        const bound: any = this.renderFirst.bind(this);
        bound.__name = this.__name; // attach __name to the bound function

        return refCreator(bound, this.__name, this.__View);
    }

    renderFirst(props: CSSProps<any>, ref: any) {
        const RN = useLocalRef<any>(() => {
            let item = this.render.bind(this) as any;
            item.__name = this.__name;
            item.displayName = `Styled(${this.__name})`;

            return item;
        });
        const css = React.useMemo(() => {
            if (props && typeof props.css === "function") {
                return props.css(new CSSStyle()).toString();
            }
            return props?.css || "";
        }, [props?.css]);

        const ifTrue = props && ifSelector(props.ifTrue)





        if (ifSelector(ifTrue) === false)
            return null;
        return <RN {...props} ifTrue={true} css={css} cRef={(c) => setRef(ref, c)} />
    }

    render({ children, variant, cRef, ...props }: CSSProps<any>) {
        const id = useLocalRef(newId)
        const context = React.useContext(StyleContext);
        const themeContext = React.useContext(ThemeContext);
        const posContext = React.useContext(positionContext);

        const CM = this.__View;
        const childrenArray = React.Children.toArray(children).filter(Boolean);
        const childTotal = childrenArray.length;
        const isTextWeb = CM.displayName === "Text" && Platform.OS === "web";

        // Memoized values
        const classNames = React.useMemo(() => {
            const cls = ValueIdentity.getClasses(props.css, themeContext.systemThemes);
            // if (cls.length > 0)
            //   console.log(cls.join(","));
            return cls;
        }, [props.css]);
        const className = React.useMemo(() => classNames.join(" "), [classNames]);
        const css = props.css;
        const dataSet =
            __DEV__ && Platform.OS === "web" && css
                ? { css: "__DEV__ CSS:" + css, type: this.__name, classNames: className }
                : undefined;

        if (isTextWeb) {
            globalData.hook("activePan");
        }

        const current = variant ? `${this.__name}.${variant}` : this.__name;
        const fullPath = React.useMemo(() => [...context.path, current], [context.path, current]);

        // Parent info
        const prt = new IParent();
        prt.index = posContext.index ?? 0;
        prt.total = posContext.total ?? context.parent?.total ?? 1;
        prt.classPath = classNames;
        prt.type = this.__name;
        prt.parent = context.parent;
        prt.props = { className, type: this.__name, ...props };

        context.parent?.reg(this.__name, prt.index);
        prt.classPath.forEach((x: string) => context.parent?.reg(x, prt.index));



        const regChild = (child: any, idx: number) => {
            let typeName: string =
                (child.type as any)?.__name ||
                (child.type as any)?.displayName ||
                (child.type as any)?.name ||
                "unknown";

            if (typeName.startsWith("Styled(")) {
                typeName = typeName.replace(/((Styled)|(\()|(\)))/gi, "");
            }

            classNames.forEach((x) => prt.reg(x, idx));
            prt.reg(typeName, idx);
        };

        const cloneChild = (childrens: any[]) => {
            let chlds = React.Children.toArray(childrens);
            let idx = 0;
            let result: any[] = [];
            while (chlds.length > 0) {
                let child: any = chlds.shift();
                if (child) {
                    if (React.isValidElement(child as any)) {
                        if (child.type === React.Fragment) {
                          
                            chlds.splice(idx +1,0, ...React.Children.toArray(child.props.children));
                        } else {
                            regChild(child, idx);
                            const posValue = { index: idx, total: childTotal };
                            result.push((
                                <positionContext.Provider key={idx} value={posValue}>
                                    {child}
                                </positionContext.Provider>));
                        }

                    } else result.push(child);
                    idx++;
                }
            }

            return result;
        }

        const mappedChildren = cloneChild(childrenArray);

        const style = useStyled(
            id,
            context,
            this.__name,
            prt.index,
            prt.total,
            variant,
            prt,
            themeContext.systemThemes
        );

        let cssStyle = React.useMemo(() => {
            if (!css || css.trim().length === 0) return undefined;
            return cssTranslator(css, themeContext.systemThemes);
        }, [css, themeContext.systemThemes]);

        //**
        // style.important override cssStyle and cssStyle.important override the style.important
        // and style tag override all */
        if (style && style.important)
            cssStyle = { ...cssStyle, ...style.important };
        if (cssStyle.important)
            cssStyle = { ...cssStyle, ...cssStyle.important };

        const styles = (Array.isArray(props.style)
            ? [style, cssStyle, ...props.style]
            : [style, cssStyle, props.style]
        ).filter(Boolean);

        //  if (classNames.includes("virtualItemSelector"))
        //    console.log(style)

        if (isTextWeb && globalData.activePan) {
            styles.push({ userSelect: "none" });
        }

        useEffect(() => {
            return () => clearCss(id);
        }, [])

        if (childTotal === 0) {
            return <CM dataSet={dataSet} {...props} ref={(c) => this.setRef(cRef, c)} style={styles} />;
        }

        return (
            <StyleContext.Provider
                value={{
                    rules: context.rules,
                    path: fullPath,
                    parent: prt,
                }}
            >
                <CM
                    dataSet={dataSet}
                    {...props}
                    ref={(c) => this.setRef(cRef, c)}
                    style={styles}
                >
                    {mappedChildren}
                </CM>
            </StyleContext.Provider>
        );
    }

}


export {
    NestedStyleSheet,
    cssTranslator
};