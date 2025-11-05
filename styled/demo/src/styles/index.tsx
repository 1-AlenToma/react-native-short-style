import React, { useEffect, useRef } from "react";
import {
    View as RNView,
    Text as RNText,
    TouchableOpacity,
    Platform,
} from "react-native";
import { devToolsHandlerContext, globalData, StyleContext, ThemeContext } from "../theme/ThemeContext";
import { CSSProps, CSSStyle } from "./CSSStyle";
import { ifSelector, newId, refCreator, setRef, ValueIdentity, flatStyle } from "../config";
import NestedStyleSheet from "./NestedStyleSheet";
import cssTranslator, { clearCss } from "./cssTranslator";
import { IParent } from "../Typse";
import { cleanStyle, useStyled, positionContext, useLocalRef, useTimer } from "../hooks";

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

    render({ children, variant, cRef, style, css, ifTrue, onPress, ...props }: CSSProps<any>) {
        let internalProps = { ...props };
        const id = useLocalRef(newId);
        const context = React.useContext(StyleContext);
        const themeContext = React.useContext(ThemeContext);
        const posContext = React.useContext(positionContext);
        const [changedProps, setChangedProps] = React.useState<any>(undefined);
        const timer = useTimer(0);
        const inspect = __DEV__ && devToolsHandlerContext.data.isOpened;
        if (__DEV__) {
            devToolsHandlerContext.useEffect(() => {
                if (devToolsHandlerContext.data.changedProps.has(id)) {
                    setChangedProps(devToolsHandlerContext.data.changedProps.get(id));
                } else if (changedProps) {
                    setChangedProps(undefined) // clear it as reload has been triggered
                }
            }, "data.propsUpdated")
        }

        if (inspect && changedProps) {

            /**
             * remove 
             *  _viewId: id,
                        _elementIndex: posContext.index,
                        _parent_viewId: posContext.parentId ?? "__0__",
             */
            try {
                let item = changedProps;
                style = item.style ?? {};
                console.log(item)
                ifTrue = item.ifTrue ?? ifTrue;
                internalProps = { ...internalProps, ...item, _viewId: undefined, _elementIndex: undefined, _parent_viewId: undefined }
                if (item.children && typeof children == "string")
                    children = item.children;
                // console.log("internal", changedProps);
            } catch (e) {
                console.error(e);
            }

        }

        const CM = this.__View;
        const childrenArray = React.Children.toArray(children).filter(Boolean);
        let childTotal = 0;
        const isTextWeb = CM.displayName === "Text" && Platform.OS === "web";

        // Memoized values
        const classNames = React.useMemo(() => {
            const cls = ValueIdentity.getClasses(css, themeContext.systemThemes);
            //   if (cls.length > 0)
            //  console.log(cls.join(","));
            return cls;
        }, [css]);
        const className = React.useMemo(() => classNames.join(" "), [classNames]);
        const _css = css;
        const dataSet =
            __DEV__ && Platform.OS === "web" && _css
                ? { css: "__DEV__ CSS:" + _css, type: this.__name, classNames: className }
                : undefined;

        if (isTextWeb) {
            globalData.hook("activePan");
        }

        const current = variant ? `${this.__name}.${variant}` : this.__name;
        const fullPath = React.useMemo(() => [...context.path, current], [context.path, current]);

        // Parent info
        const prt = new IParent();
        prt.index = posContext.index ?? 0;
        //  prt.total = posContext.total ?? context.parent?.total ?? 1;
        prt.classPath = classNames;
        prt.type = this.__name;
        prt.parent = context.parent;
        prt.props = { className, type: this.__name, ...internalProps, children };

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
        const cloneChild = (children: React.ReactNode): React.ReactNode[] => {
            const queue = React.Children.toArray(children);
            const result: React.ReactNode[] = [];
            let idx = 0;
            let fragmentDatas = [] as { key: any, childs: any[] }[];

            while (queue.length > 0 || fragmentDatas.length > 0) {
                const frag = fragmentDatas[fragmentDatas.length - 1];
                const child = frag ? frag.childs.shift() : queue.shift();
                if (frag && frag.childs.length === 0) {
                    fragmentDatas.pop();
                }


                if (React.isValidElement(child)) {
                    if (child.type === React.Fragment) {
                        const fragmentChildren = React.Children.toArray((child.props as any).children);
                        if (child.key)
                            fragmentDatas.push({ key: child.key, childs: fragmentChildren });
                        else
                            queue.unshift(...fragmentChildren); // insert at front to preserve order
                        continue;
                    }

                    regChild(child, idx);

                    const childKey = `styled-child-${frag?.key ?? ''}:${child.key ?? idx}`;
                    result.push(
                        <positionContext.Provider key={`styled-wrapper-${childKey}`} value={{ index: idx, parentId: id }}>
                            {child}
                        </positionContext.Provider>
                    );

                } else {
                    result.push(child); // non-element nodes
                }

                idx++;
                childTotal++;
            }

            return result;
        };

        prt.total = context.parent?.total ?? childTotal;
        const mappedChildren = cloneChild(childrenArray);

        const [_styles, keySelectors] = useStyled(
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
            if (!_css || _css.trim().length === 0) return undefined;
            return cssTranslator(_css, themeContext.systemThemes);
        }, [_css, themeContext.systemThemes]);

        //**
        // style.important override cssStyle and cssStyle.important override the style.important
        // and style tag override all */
        if (_styles && _styles.important)
            cssStyle = { ...cssStyle, ..._styles.important };
        if (cssStyle.important)
            cssStyle = { ...cssStyle, ...cssStyle.important };

        let styles = (Array.isArray(style)
            ? [_styles, cssStyle, ...style]
            : [_styles, cssStyle, style]
        ).filter(Boolean);

        if (isTextWeb && globalData.activePan) {
            styles.push({ userSelect: "none" });
        }

        if (inspect && changedProps && __DEV__ && changedProps._deletedItems?.style) {
            styles = (flatStyle(styles));
            devToolsHandlerContext.cleanDeletedItemsStyle(styles, changedProps._deletedItems.style);
        }

        //  if (classNames.includes("virtualItemSelector"))
        //    console.log(style)



        useEffect(() => {
            return () => {
                clearCss(id);
                // clear it
                if (inspect)
                    devToolsHandlerContext.delete(id);
            }
        }, [])


        const patch = async () => {
            if (inspect && ifTrue) {
                if (internalProps?.inspectDisplayName)
                    delete internalProps.inspectDisplayName;
                devToolsHandlerContext.patch({
                    name: props.inspectDisplayName ?? this.__name,
                    children: [],
                    props: {
                        ifTrue,
                        ...devToolsHandlerContext.cleanProps({ ...internalProps, style: { ...(flatStyle(styles)), _props: undefined, transform: undefined, important: undefined }, css }),
                        classes: devToolsHandlerContext.withKeysOnly(keySelectors),
                        _viewId: id,
                        _elementIndex: posContext.index,
                        _parent_viewId: posContext.parentId ?? "__0__",
                        ...(typeof children == "string" ? { children } : {})
                    }
                });
            } else if (inspect) devToolsHandlerContext.delete(id);
        }


        const pressed = (e) => {
            if (devToolsHandlerContext.data.elementSelection === true) {
                e.preventDefault(); // stops default browser behavior (like form submission)
                e.stopPropagation(); // stops bubbling up to parent elements
                devToolsHandlerContext.data.elementSelection = false;
                devToolsHandlerContext.sendProp("elementSelection");
                devToolsHandlerContext.select(id);
                alert("Element is Selected")
            } else {
                onPress?.(e);
            }
        }

        if (ifTrue) {
            if (onPress || (inspect && devToolsHandlerContext.data.elementSelection === true))
                internalProps.onPress = (e) => {
                    pressed(e);
                }
        }
        if (inspect)
            timer(patch);

        if (ifTrue == false)
            return null;

        if (childTotal === 0) {
            return <CM dataSet={dataSet} {...internalProps} ref={(c) => this.setRef(cRef, c)} style={styles} />;
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
                    {...internalProps}
                    ref={(c) => this.setRef(cRef, c)}
                    style={styles}>
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