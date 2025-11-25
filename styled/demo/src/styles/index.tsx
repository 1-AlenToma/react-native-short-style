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
import { useStyled, PositionContext, useLocalRef, useTimer } from "../hooks";



export class CMBuilder {
    __name: string;
    __View: any;
    myRef: any = undefined;
    Component: any = undefined;
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
        this.Component = this.render.bind(this) as any;
        this.Component.__name = this.__name;
        this.Component.displayName = `Styled(${this.__name})`;
        bound.__name = this.__name; // attach __name to the bound function

        return refCreator(bound, this.__name, this.__View);
    }



    renderFirst(props: CSSProps<any>, ref: any) {
        const css = React.useMemo(() => {
            if (props && typeof props.css === "function") {
                return props.css(new CSSStyle()).toString();
            }
            return props?.css || "";
        }, [props?.css]);

        const ifTrue = props && ifSelector(props.ifTrue);

        if (ifSelector(ifTrue) === false)
            return null;


        return <this.Component {...props} ifTrue={true} css={css} cRef={(c) => setRef(ref, c)} />
    }

    render({ children, variant, cRef, style, css, ifTrue, noneDevtools, ...props }: CSSProps<any>) {
        let internalProps = Object.assign({}, props)
        const id = useLocalRef(newId);
        const context = React.useContext(StyleContext);
        const themeContext = React.useContext(ThemeContext);
        const positionContext = React.useContext(PositionContext);
        const [changedProps, setChangedProps] = React.useState<any>(undefined);
        const isDev = __DEV__ && !noneDevtools;
        const inspect = isDev && devToolsHandlerContext.data.isOpened;
        if (isDev) {
            devToolsHandlerContext.useEffect(() => {
                if (devToolsHandlerContext.data.changedProps.has(id)) {
                    const item: any = devToolsHandlerContext.data.changedProps.get(id);
                    if (!item?.handled || !changedProps) {
                        setChangedProps({ ...item });
                        if (item)
                            item.handled = true;
                    }
                } else if (changedProps) {
                    setChangedProps(undefined) // clear it as reload has been triggered
                }
            }, "data.propsUpdated");
        }

        if (inspect && changedProps) {
            try {
                let item = changedProps;
                style = item.style ?? {};
                if ("ifTrue" in item)
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

        const componentParent = new IParent();
        componentParent.index = positionContext.index ?? 0;
        //  prt.total = posContext.total ?? context.parent?.total ?? 1;
        componentParent.classPath = classNames;
        componentParent.type = this.__name;
        componentParent.props = { className, type: this.__name, ...internalProps, children };
        context.parent?.reg(this.__name, componentParent.index);
        componentParent.classPath.forEach((x: string) => context.parent?.reg(x, componentParent.index));
        // Parent info
        componentParent.parent = context.parent;


        const regChild = (child: any, idx: number) => {
            let typeName: string =
                (child.type as any)?.__name ||
                (child.type as any)?.displayName ||
                (child.type as any)?.name ||
                "unknown";

            if (typeName.startsWith("Styled(")) {
                typeName = typeName.replace(/((Styled)|(\()|(\)))/gi, "");
            }

            classNames.forEach((x) => componentParent.reg(x, idx));
            componentParent.reg(typeName, idx);
            return typeName;
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
                        <PositionContext.Provider key={`styled-wrapper-${childKey}`} value={{ index: idx, parentId: id }}>
                            {child}
                        </PositionContext.Provider>
                    );

                } else {
                    result.push(child); // non-element nodes
                }

                idx++;
                childTotal++;
            }

            return result;
        };


        const mappedChildren = cloneChild(childrenArray)
        componentParent.total = context.parent?.total ?? childTotal

        const [_styles, keySelectors] = useStyled(
            id,
            context,
            this.__name,
            componentParent.index,
            componentParent.total,
            variant,
            componentParent,
            themeContext.systemThemes
        );

        let cssStyle = {...(React.useMemo(() => {
            if (!_css || _css.trim().length === 0) return undefined;
            return cssTranslator(_css, themeContext.systemThemes);
        }, [_css, themeContext.systemThemes]) ?? {} as any)};

        //**
        // style.important override cssStyle and cssStyle.important override the style.important
        // and style tag override all */
        if (_styles && _styles.important)
            cssStyle = Object.assign(cssStyle, _styles.important)
        if (cssStyle.important)
            Object.assign(cssStyle, cssStyle.important)

        let styles = changedProps ? [style] : (Array.isArray(style)
            ? [_styles, cssStyle, ...style]
            : [_styles, cssStyle, style]
        ).filter(Boolean);

        if (isTextWeb && globalData.activePan) {
            styles.push({ userSelect: "none" });
        }

        if (inspect && ifTrue != false) {
            //styles = flatStyle(styles);
            if (changedProps && changedProps._deletedItems?.style)
                devToolsHandlerContext.cleanDeletedItemsStyle(styles, changedProps._deletedItems.style);
        }

        useEffect(() => {
            return () => {
                clearCss(id);
                // clear it
                if (inspect) {
                    devToolsHandlerContext.components.delete(id);
                    devToolsHandlerContext.delete(id);

                }
            }
        }, [])


        const patch = async () => {
            if (inspect && ifTrue != false) {
                if (internalProps?.inspectDisplayName)
                    delete internalProps.inspectDisplayName;
                devToolsHandlerContext.patch({
                    name: props.inspectDisplayName ?? this.__name,
                    children: [],
                    props: {
                        ifTrue,
                        ...devToolsHandlerContext.cleanProps({ ...internalProps, style: { ...flatStyle(styles, "_props", "transforms", "important") }, css }),
                        classes: devToolsHandlerContext.withKeysOnly(keySelectors),
                        _viewId: id,
                        _elementIndex: positionContext.index,
                        _parent_viewId: positionContext.parentId ?? "__0__",
                        ...(typeof children == "string" ? { children } : {})
                    }
                });
            } else if (inspect) {
                devToolsHandlerContext.delete(id);
                devToolsHandlerContext.components.delete(id);
            };
        }

        if (inspect)
            patch();

        if (ifTrue == false)
            return null;


        return (
            <StyleContext.Provider
                value={{
                    rules: context.rules,
                    path: fullPath,
                    parent: componentParent,
                }}
            >
                <CM
                    dataSet={dataSet}
                    {...internalProps}
                    ref={(c) => {
                        this.setRef(cRef, c);
                        if (inspect)
                            c ? devToolsHandlerContext.components.set(id, c) : devToolsHandlerContext.components.delete(id);
                    }}
                    style={styles}>
                    {mappedChildren.length > 0 ? mappedChildren : null}
                </CM>
            </StyleContext.Provider>
        );
    }

}


export {
    NestedStyleSheet,
    cssTranslator
};