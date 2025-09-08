import React, { useRef } from "react";
import {
    View as RNView,
    Text as RNText,
    TouchableOpacity,
    Platform,
} from "react-native";
import { globalData, StyleContext, ThemeContext } from "../theme/ThemeContext";
import { CSSProps, CSSStyle } from "./CSSStyle";
import { currentTheme, ifSelector, newId, refCreator, setRef, ValueIdentity } from "../config";
import NestedStyleSheet from "./NestedStyleSheet";
import cssTranslator from "./cssTranslator";
import { IParent } from "../Typse";
import { cleanStyle, useStyled } from "../hooks";

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
            /* const props = this.getNextProps();
             if (reactNative.Platform.OS != "web") {
                 let item = assignRf((c ?? {}) as DomPath<any, any>, { ...props, css: this.refItem.contextValue.getCss() });
                 this.refItem.contextValue.setViews(item);
                 (this.context as any)?.registerView?.(item);// to parent
                 setRef(props.cRef, item);
             } else*/
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
        const RN = useRef<any>(this.render.bind(this)).current;
        const css = React.useMemo(() => {
            if (props && typeof props.css === "function") {
                return props.css(new CSSStyle()).toString();
            }
            return props?.css || "";
        }, [props?.css]);

        const ifTrue = props && ifSelector(props.ifTrue)
        if (ifSelector(ifTrue) === false)
            return null;


        RN.__name = this.__name;
        return <RN {...props} ifTrue={true} css={css} cRef={(c) => setRef(ref, c)} />
    }

    render({ children, __styleIndex, __styleTotal, variant, cRef, ...props }: CSSProps<any>) {
        const context = React.useContext(StyleContext);
        const themeContext = React.useContext(ThemeContext);
        const systemTheme = currentTheme(themeContext);
        //const id = useRef(newId()).current;
        const CM = this.__View;
        const childrenArray = React.Children.toArray(children).filter((c) => c != null);
        const childTotal = childrenArray.length;
        const isTextWeb = CM.displayName === "Text" && Platform.OS === "web";
        const dataSet = __DEV__ && Platform.OS == "web" && props.css ? { css: "__DEV__ CSS:" + props.css, type: this.__name } : undefined;
        const classNames = ValueIdentity.getClasses(props.css);
        const className = classNames.join(" ");
        //const css = ValueIdentity.cleanCss(props.css);
        const css = props.css;


        // console.log(context)
        if (isTextWeb) {
            globalData.hook("activePan");
        }
        const current = variant ? `${this.__name}.${variant}` : this.__name;
        const fullPath = [...context.path, current];

        const prt = new IParent();
        prt.index = __styleIndex ?? 0;
        prt.total = __styleTotal ?? context.parent?.total ?? 1;
        prt.classPath = classNames.filter(Boolean);
        prt.parent = context.parent;
        prt.props = { className: classNames.join(" "), type: this.__name, ...props };
        // console.log(prt.props)
        context.parent?.reg(this.__name, __styleIndex ?? 0);
        prt.classPath.forEach((x: string) => context.parent?.reg(x, __styleIndex ?? 0));

        const regChild = (child: any, idx: number) => {
            const typeName =
                (child.type as any)?.__name ||
                (child.type as any)?.displayName ||
                (child.type as any)?.name ||
                "unknown";

            const classNames = ValueIdentity.getClasses(props.css);
            classNames.forEach(x => prt.reg(x, idx))
            prt.reg(typeName, idx);
        }

        const cloneChild = (childrens: any[]) => {
            return React.Children.map(childrens, ((child, idx) => {
                if (React.isValidElement(child as any) && child.type !== React.Fragment) {
                    regChild(child, idx)
                    return (React.cloneElement(child as any, {
                        __styleIndex: idx,
                        __styleTotal: childTotal,
                    }));
                }

                if (React.isValidElement(child as any) && child.type === React.Fragment) {
                    return (
                        <React.Fragment key={idx}>
                            {cloneChild(child.props.children)}
                        </React.Fragment>
                    );
                }

                return child;
            }
            ));
        }

        const mappedChildren = cloneChild(childrenArray)

        let cssStyle = undefined
        const style = useStyled(context, this.__name, __styleIndex ?? 0, __styleTotal ?? context.parent?.total ?? 1, variant, prt, systemTheme);

        if (css && css.trim().length > 0)
            cssStyle = cleanStyle(cssTranslator(css, systemTheme), true);



        const styles = (Array.isArray(props.style) ? [style, cssStyle, ...props.style] : [style, cssStyle, props.style]).filter(Boolean);
        if (isTextWeb && globalData.activePan)
            styles.push({ userSelect: "none" });



        if (childTotal === 0) return <CM dataSet={dataSet} {...props} ref={c => this.setRef(cRef, c)} style={styles} />

        return (
            <StyleContext.Provider
                value={{
                    rules: context.rules,
                    path: fullPath,
                    parent: prt,
                }}>
                <CM dataSet={dataSet} {...props} ref={c => this.setRef(cRef, c)} style={styles}>{mappedChildren}</CM>
            </StyleContext.Provider>
        );
    };
}


export {
    NestedStyleSheet,
    cssTranslator
};