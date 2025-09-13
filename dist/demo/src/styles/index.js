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
import { globalData, StyleContext, ThemeContext } from "../theme/ThemeContext";
import { CSSStyle } from "./CSSStyle";
import { ifSelector, newId, refCreator, setRef, ValueIdentity } from "../config";
import NestedStyleSheet from "./NestedStyleSheet";
import cssTranslator, { clearCss } from "./cssTranslator";
import { IParent } from "../Typse";
import { useStyled, positionContext, useLocalRef } from "../hooks";
export class CMBuilder {
    constructor(name, view) {
        this.myRef = undefined;
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
        bound.__name = this.__name; // attach __name to the bound function
        return refCreator(bound, this.__name, this.__View);
    }
    renderFirst(props, ref) {
        const RN = useLocalRef(() => {
            let item = this.render.bind(this);
            item.__name = this.__name;
            item.displayName = `Styled(${this.__name})`;
            return item;
        });
        const css = React.useMemo(() => {
            if (props && typeof props.css === "function") {
                return props.css(new CSSStyle()).toString();
            }
            return (props === null || props === void 0 ? void 0 : props.css) || "";
        }, [props === null || props === void 0 ? void 0 : props.css]);
        const ifTrue = props && ifSelector(props.ifTrue);
        if (ifSelector(ifTrue) === false)
            return null;
        return _jsx(RN, Object.assign({}, props, { ifTrue: true, css: css, cRef: (c) => setRef(ref, c) }));
    }
    render(_a) {
        var _b, _c, _d, _e;
        var { children, variant, cRef } = _a, props = __rest(_a, ["children", "variant", "cRef"]);
        const id = useLocalRef(newId);
        const context = React.useContext(StyleContext);
        const themeContext = React.useContext(ThemeContext);
        const posContext = React.useContext(positionContext);
        const CM = this.__View;
        const childrenArray = React.Children.toArray(children).filter(Boolean);
        let childTotal = 0;
        const isTextWeb = CM.displayName === "Text" && Platform.OS === "web";
        // Memoized values
        const classNames = React.useMemo(() => {
            const cls = ValueIdentity.getClasses(props.css, themeContext.systemThemes);
            //   if (cls.length > 0)
            //  console.log(cls.join(","));
            return cls;
        }, [props.css]);
        const className = React.useMemo(() => classNames.join(" "), [classNames]);
        const css = props.css;
        const dataSet = __DEV__ && Platform.OS === "web" && css
            ? { css: "__DEV__ CSS:" + css, type: this.__name, classNames: className }
            : undefined;
        if (isTextWeb) {
            globalData.hook("activePan");
        }
        const current = variant ? `${this.__name}.${variant}` : this.__name;
        const fullPath = React.useMemo(() => [...context.path, current], [context.path, current]);
        // Parent info
        const prt = new IParent();
        prt.index = (_b = posContext.index) !== null && _b !== void 0 ? _b : 0;
        //  prt.total = posContext.total ?? context.parent?.total ?? 1;
        prt.classPath = classNames;
        prt.type = this.__name;
        prt.parent = context.parent;
        prt.props = Object.assign(Object.assign({ className, type: this.__name }, props), { children });
        (_c = context.parent) === null || _c === void 0 ? void 0 : _c.reg(this.__name, prt.index);
        prt.classPath.forEach((x) => { var _a; return (_a = context.parent) === null || _a === void 0 ? void 0 : _a.reg(x, prt.index); });
        const regChild = (child, idx) => {
            var _a, _b, _c;
            let typeName = ((_a = child.type) === null || _a === void 0 ? void 0 : _a.__name) ||
                ((_b = child.type) === null || _b === void 0 ? void 0 : _b.displayName) ||
                ((_c = child.type) === null || _c === void 0 ? void 0 : _c.name) ||
                "unknown";
            if (typeName.startsWith("Styled(")) {
                typeName = typeName.replace(/((Styled)|(\()|(\)))/gi, "");
            }
            classNames.forEach((x) => prt.reg(x, idx));
            prt.reg(typeName, idx);
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
                    const posValue = { index: idx };
                    const childKey = `styled-child-${(_a = frag === null || frag === void 0 ? void 0 : frag.key) !== null && _a !== void 0 ? _a : ''}:${(_b = child.key) !== null && _b !== void 0 ? _b : idx}`;
                    result.push(_jsx(positionContext.Provider, { value: posValue, children: child }, `styled-wrapper-${childKey}`));
                }
                else {
                    result.push(child); // non-element nodes
                }
                idx++;
                childTotal++;
            }
            return result;
        };
        prt.total = (_e = (_d = context.parent) === null || _d === void 0 ? void 0 : _d.total) !== null && _e !== void 0 ? _e : childTotal;
        const mappedChildren = cloneChild(childrenArray);
        const style = useStyled(id, context, this.__name, prt.index, prt.total, variant, prt, themeContext.systemThemes);
        let cssStyle = React.useMemo(() => {
            if (!css || css.trim().length === 0)
                return undefined;
            return cssTranslator(css, themeContext.systemThemes);
        }, [css, themeContext.systemThemes]);
        //**
        // style.important override cssStyle and cssStyle.important override the style.important
        // and style tag override all */
        if (style && style.important)
            cssStyle = Object.assign(Object.assign({}, cssStyle), style.important);
        if (cssStyle.important)
            cssStyle = Object.assign(Object.assign({}, cssStyle), cssStyle.important);
        const styles = (Array.isArray(props.style)
            ? [style, cssStyle, ...props.style]
            : [style, cssStyle, props.style]).filter(Boolean);
        //  if (classNames.includes("virtualItemSelector"))
        //    console.log(style)
        if (isTextWeb && globalData.activePan) {
            styles.push({ userSelect: "none" });
        }
        useEffect(() => {
            return () => clearCss(id);
        }, []);
        if (childTotal === 0) {
            return _jsx(CM, Object.assign({ dataSet: dataSet }, props, { ref: (c) => this.setRef(cRef, c), style: styles }));
        }
        return (_jsx(StyleContext.Provider, { value: {
                rules: context.rules,
                path: fullPath,
                parent: prt,
            }, children: _jsx(CM, Object.assign({ dataSet: dataSet }, props, { ref: (c) => this.setRef(cRef, c), style: styles, children: mappedChildren })) }));
    }
}
export { NestedStyleSheet, cssTranslator };
//# sourceMappingURL=index.js.map