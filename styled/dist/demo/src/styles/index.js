var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { Platform, } from "react-native";
import { devToolsHandlerContext, globalData, StyleContext, ThemeContext } from "../theme/ThemeContext";
import { CSSStyle } from "./CSSStyle";
import { ifSelector, newId, refCreator, setRef, ValueIdentity, flatStyle } from "../config";
import NestedStyleSheet from "./NestedStyleSheet";
import cssTranslator, { clearCss } from "./cssTranslator";
import { IParent } from "../Typse";
import { useStyled, PositionContext, useLocalRef } from "../hooks";
export class CMBuilder {
    constructor(name, view) {
        this.myRef = undefined;
        this.Component = undefined;
        this.__name = name;
        this.__View = view;
        //  console.log(view)
    }
    setRef(cRef, c) {
        if (c === null)
            return;
        if (c === this.myRef) {
            return;
        }
        try {
            setRef(cRef, c);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            this.myRef = c;
        }
    }
    fn() {
        const bound = this.renderFirst.bind(this);
        this.Component = this.render.bind(this);
        this.Component.__name = this.__name;
        this.Component.displayName = `Styled(${this.__name})`;
        bound.__name = this.__name; // attach __name to the bound function
        return refCreator(bound, this.__name, this.__View);
    }
    renderFirst(props, ref) {
        const css = React.useMemo(() => {
            if (props && typeof props.css === "function") {
                return props.css(new CSSStyle()).toString();
            }
            return (props === null || props === void 0 ? void 0 : props.css) || "";
        }, [props === null || props === void 0 ? void 0 : props.css]);
        const ifTrue = props && ifSelector(props.ifTrue);
        if (ifSelector(ifTrue) === false)
            return null;
        return _jsx(this.Component, Object.assign({}, props, { ifTrue: true, css: css, cRef: (c) => setRef(ref, c) }));
    }
    render(_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j;
        var { children, variant, cRef, style, css, ifTrue, noneDevtools } = _a, props = __rest(_a, ["children", "variant", "cRef", "style", "css", "ifTrue", "noneDevtools"]);
        let internalProps = Object.assign({}, props);
        const id = useLocalRef(newId);
        const context = React.useContext(StyleContext);
        const themeContext = React.useContext(ThemeContext);
        const positionContext = React.useContext(PositionContext);
        const [changedProps, setChangedProps] = React.useState(undefined);
        const isDev = __DEV__ && !noneDevtools;
        const inspect = isDev && devToolsHandlerContext.data.isOpened;
        if (isDev) {
            devToolsHandlerContext.useEffect(() => {
                if (devToolsHandlerContext.data.changedProps.has(id)) {
                    const item = devToolsHandlerContext.data.changedProps.get(id);
                    if (!(item === null || item === void 0 ? void 0 : item.handled) || !changedProps) {
                        setChangedProps(Object.assign({}, item));
                        if (item)
                            item.handled = true;
                    }
                }
                else if (changedProps) {
                    setChangedProps(undefined); // clear it as reload has been triggered
                }
            }, "data.propsUpdated");
        }
        if (inspect && changedProps) {
            try {
                let item = changedProps;
                style = (_b = item.style) !== null && _b !== void 0 ? _b : {};
                if ("ifTrue" in item)
                    ifTrue = (_c = item.ifTrue) !== null && _c !== void 0 ? _c : ifTrue;
                internalProps = Object.assign(Object.assign(Object.assign({}, internalProps), item), { _viewId: undefined, _elementIndex: undefined, _parent_viewId: undefined });
                if (item.children && typeof children == "string")
                    children = item.children;
                // console.log("internal", changedProps);
            }
            catch (e) {
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
        const dataSet = __DEV__ && Platform.OS === "web" && _css
            ? { css: "__DEV__ CSS:" + _css, type: this.__name, classNames: className }
            : undefined;
        if (isTextWeb) {
            globalData.hook("activePan");
        }
        const current = variant ? `${this.__name}.${variant}` : this.__name;
        const fullPath = React.useMemo(() => [...context.path, current], [context.path, current]);
        const componentParent = new IParent();
        componentParent.index = (_d = positionContext.index) !== null && _d !== void 0 ? _d : 0;
        //  prt.total = posContext.total ?? context.parent?.total ?? 1;
        componentParent.classPath = classNames;
        componentParent.type = this.__name;
        componentParent.props = Object.assign(Object.assign({ className, type: this.__name }, internalProps), { children });
        (_e = context.parent) === null || _e === void 0 ? void 0 : _e.reg(this.__name, componentParent.index);
        componentParent.classPath.forEach((x) => { var _a; return (_a = context.parent) === null || _a === void 0 ? void 0 : _a.reg(x, componentParent.index); });
        // Parent info
        componentParent.parent = context.parent;
        const regChild = (child, idx) => {
            var _a, _b, _c;
            let typeName = ((_a = child.type) === null || _a === void 0 ? void 0 : _a.__name) ||
                ((_b = child.type) === null || _b === void 0 ? void 0 : _b.displayName) ||
                ((_c = child.type) === null || _c === void 0 ? void 0 : _c.name) ||
                "unknown";
            if (typeName.startsWith("Styled(")) {
                typeName = typeName.replace(/((Styled)|(\()|(\)))/gi, "");
            }
            classNames.forEach((x) => componentParent.reg(x, idx));
            componentParent.reg(typeName, idx);
            return typeName;
        };
        const cloneChild = (children) => {
            var _a, _b;
            const queue = React.Children.toArray(children);
            const result = [];
            let idx = 0;
            let fragmentDatas = [];
            while (queue.length > 0 || fragmentDatas.length > 0) {
                const frag = fragmentDatas[fragmentDatas.length - 1];
                const child = frag ? frag.childs.shift() : queue.shift();
                if (frag && frag.childs.length === 0) {
                    fragmentDatas.pop();
                }
                if (React.isValidElement(child)) {
                    if (child.type === React.Fragment) {
                        const fragmentChildren = React.Children.toArray(child.props.children);
                        if (child.key)
                            fragmentDatas.push({ key: child.key, childs: fragmentChildren });
                        else
                            queue.unshift(...fragmentChildren); // insert at front to preserve order
                        continue;
                    }
                    regChild(child, idx);
                    const childKey = `styled-child-${(_a = frag === null || frag === void 0 ? void 0 : frag.key) !== null && _a !== void 0 ? _a : ''}:${(_b = child.key) !== null && _b !== void 0 ? _b : idx}`;
                    result.push(_jsx(PositionContext.Provider, { value: { index: idx, parentId: id }, children: child }, `styled-wrapper-${childKey}`));
                }
                else {
                    result.push(child); // non-element nodes
                }
                idx++;
                childTotal++;
            }
            return result;
        };
        const mappedChildren = cloneChild(childrenArray);
        componentParent.total = (_g = (_f = context.parent) === null || _f === void 0 ? void 0 : _f.total) !== null && _g !== void 0 ? _g : childTotal;
        const [_styles, keySelectors] = useStyled(id, context, this.__name, componentParent.index, componentParent.total, variant, componentParent, themeContext.systemThemes);
        let cssStyle = (_h = React.useMemo(() => {
            if (!_css || _css.trim().length === 0)
                return undefined;
            return cssTranslator(_css, themeContext.systemThemes);
        }, [_css, themeContext.systemThemes])) !== null && _h !== void 0 ? _h : {};
        //**
        // style.important override cssStyle and cssStyle.important override the style.important
        // and style tag override all */
        if (_styles && _styles.important)
            cssStyle = Object.assign(cssStyle, _styles.important);
        if (cssStyle.important)
            Object.assign(cssStyle, cssStyle.important);
        let styles = changedProps ? [style] : (Array.isArray(style)
            ? [_styles, cssStyle, ...style]
            : [_styles, cssStyle, style]).filter(Boolean);
        if (isTextWeb && globalData.activePan) {
            styles.push({ userSelect: "none" });
        }
        if (inspect && ifTrue != false) {
            //styles = flatStyle(styles);
            if (changedProps && ((_j = changedProps._deletedItems) === null || _j === void 0 ? void 0 : _j.style))
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
            };
        }, []);
        const patch = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (inspect && ifTrue != false) {
                if (internalProps === null || internalProps === void 0 ? void 0 : internalProps.inspectDisplayName)
                    delete internalProps.inspectDisplayName;
                devToolsHandlerContext.patch({
                    name: (_a = props.inspectDisplayName) !== null && _a !== void 0 ? _a : this.__name,
                    children: [],
                    props: Object.assign(Object.assign(Object.assign({ ifTrue }, devToolsHandlerContext.cleanProps(Object.assign(Object.assign({}, internalProps), { style: Object.assign({}, flatStyle(styles, "_props", "transforms", "important")), css }))), { classes: devToolsHandlerContext.withKeysOnly(keySelectors), _viewId: id, _elementIndex: positionContext.index, _parent_viewId: (_b = positionContext.parentId) !== null && _b !== void 0 ? _b : "__0__" }), (typeof children == "string" ? { children } : {}))
                });
            }
            else if (inspect) {
                devToolsHandlerContext.delete(id);
                devToolsHandlerContext.components.delete(id);
            }
            ;
        });
        if (inspect)
            patch();
        if (ifTrue == false)
            return null;
        return (_jsx(StyleContext.Provider, { value: {
                rules: context.rules,
                path: fullPath,
                parent: componentParent,
            }, children: _jsx(CM, Object.assign({ dataSet: dataSet }, internalProps, { ref: (c) => {
                    this.setRef(cRef, c);
                    if (inspect)
                        c ? devToolsHandlerContext.components.set(id, c) : devToolsHandlerContext.components.delete(id);
                }, style: styles, children: mappedChildren.length > 0 ? mappedChildren : null })) }));
    }
}
export { NestedStyleSheet, cssTranslator };
//# sourceMappingURL=index.js.map