import cssTranslator from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as React from "react";
import * as reactNative from "react-native";
import { ifSelector, newId, currentTheme, refCreator } from "../config";
import { ThemeContext, globalData } from "../theme/ThemeContext";
import { CSSStyle } from "./CSSStyle";
import { extractProps, ValueIdentity } from "../config/CSSMethods";
let toArray = (item) => {
    if (!item)
        return [];
    if (Array.isArray(item))
        return item;
    return [item];
};
class CSS {
    constructor(styleFile, css) {
        this.css = ` ${(css || "").trim()} `;
        this.styleFile = styleFile;
    }
    append(css) {
        if (css && css.length > 0) {
            console.log(css, "this", this.css);
            this.css = this.css.replace(css, "");
        }
        this.add(css);
        return this;
    }
    add(...keys) {
        for (let k of keys) {
            if (!k || k == "undefined")
                continue;
            if (k.trim().endsWith(".") || k.trim().length == 0)
                continue;
            k = k.trim();
            if (this.css.indexOf(` ${k} `) === -1 && (k in this.styleFile || ValueIdentity.has(k)))
                this.css += `${k.trim()} `;
        }
        return this;
    }
    prepend(...keys) {
        for (let k of keys) {
            if (!k || k == "undefined")
                continue;
            if (k.trim().endsWith(".") || k.trim().length == 0)
                continue;
            k = k.trim();
            if (this.css.indexOf(` ${k} `) === -1 && (k in this.styleFile || ValueIdentity.has(k)))
                this.css = `${k.trim()} ` + this.css;
        }
        return this;
    }
    classes() {
        return ValueIdentity.getClasses(this.css, this.styleFile);
    }
    distinct() {
        let items = new CSS(this.styleFile, "").add(...ValueIdentity.splitCss(this.css));
        return items.css;
    }
    toString() {
        return this.distinct();
    }
}
class InternalStyledContext {
    constructor(viewName) {
        this.elementposition = 0;
        this.cssProps = {};
        this.items = new Map();
        this.id = newId();
        this.css = undefined;
        this.viewName = viewName;
    }
    register(id) {
        this.items.set(id, id);
    }
    remove(id) {
        this.items.delete(id);
    }
    indexOf(id) {
        return [...this.items.values()].indexOf(id);
    }
    isLast(id) {
        let items = [...this.items.values()];
        return items.indexOf(id) == items.length - 1;
    }
    getCss() {
        var _a;
        if (this.css && typeof this.css == "function")
            return this.css(new CSSStyle()).toString();
        return ((_a = this.css) !== null && _a !== void 0 ? _a : "");
    }
    cleanCss() {
        return this.getCss();
        let item = extractProps(this.getCss());
        if (item._hasValue) {
            this.cssProps = Object.assign({}, item);
            delete this.cssProps.css;
        }
        return item.css;
    }
    update(id, css, props, styleFile, prevContext) {
        this.id = id;
        this.props = props;
        this.prevContext = prevContext;
        this.styleFile = styleFile;
        this.css = css;
    }
    changed() {
        var _a, _b;
        return this.getCss() !== this.prevCSS || ((_b = (_a = this.prevContext).changed) === null || _b === void 0 ? void 0 : _b.call(_a));
    }
    position() {
        let name = this.viewPath();
    }
    viewPath() {
        var _a, _b, _c;
        let pk = ((_a = this.prevContext) === null || _a === void 0 ? void 0 : _a.viewPath) ? (_b = this.prevContext.viewPath()) !== null && _b !== void 0 ? _b : "" : "";
        if (pk.length > 0 && !pk.endsWith("."))
            pk += ".";
        pk += (_c = this.viewName) !== null && _c !== void 0 ? _c : "";
        return pk !== null && pk !== void 0 ? pk : "";
    }
    classNames() {
        var _a, _b, _c;
        let classNames = ValueIdentity.getClasses(this.cleanCss(), this.styleFile, (_c = (_b = (_a = this.prevContext) === null || _a === void 0 ? void 0 : _a.indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, this.id)) !== null && _c !== void 0 ? _c : undefined);
        return classNames;
    }
    join() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.changed())
            if (this.prevCSS != undefined)
                return this.cpyCss;
        let itemIndex = (_b = (_a = this.prevContext) === null || _a === void 0 ? void 0 : _a.indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, this.id);
        let isLast = (_d = (_c = this.prevContext) === null || _c === void 0 ? void 0 : _c.isLast) === null || _d === void 0 ? void 0 : _d.call(_c, this.id);
        let name = this.viewName;
        let parent = new CSS(this.styleFile, (_f = (_e = this.prevContext).join) === null || _f === void 0 ? void 0 : _f.call(_e));
        let cpyCss = new CSS(this.styleFile, this.cleanCss());
        if (itemIndex != undefined)
            for (let s of this.classNames()) {
                cpyCss.prepend(` ${s}_${itemIndex}`);
                if (isLast)
                    cpyCss.prepend(` ${s}_last`);
            }
        for (let s of parent.classes()) {
            if (itemIndex != undefined)
                cpyCss.prepend(` ${s}.${name}_${itemIndex}`);
            cpyCss.prepend(` ${s}.${name}`);
            if (isLast)
                cpyCss.prepend(` ${s}_last`);
        }
        cpyCss.prepend(name, itemIndex != undefined ? `${name}_${itemIndex}` : "", this.viewPath()).add(this.cleanCss());
        this.prevCSS = this.getCss();
        return (this.cpyCss = cpyCss.toString());
    }
}
let CSSContext = React.createContext({});
class StyledComponent extends React.Component {
    componentDidMount() {
        this.refItem.init = true;
    }
    shouldComponentUpdate(nextProps, _) {
        let props = Object.assign({}, nextProps);
        if ((props === null || props === void 0 ? void 0 : props.themeContext) != undefined) {
            if (props.themeContext.selectedIndex !== this.props.themeContext.selectedIndex) {
                this.refItem.currentStyle = currentTheme(props.themeContext);
                return true;
            }
            delete props.themeContext;
        }
        if ("css" in props) {
            if (this.update(Object.assign(Object.assign({}, this.props), nextProps))) {
                return true;
            }
            delete props.css;
        }
        // delete props.ifTrue
        for (let k in props) {
            let v1 = props[k];
            let v2 = this.props[k];
            if (v1 !== v2) {
                return true;
            }
        }
        return false;
    }
    constructor(props) {
        super(props);
        this.refItem = {
            id: newId(),
            contextValue: new InternalStyledContext(this.props.viewPath),
            style: undefined,
            selectedThemeIndex: this.props.themeContext.selectedIndex,
            currentStyle: currentTheme(props.themeContext),
            init: false
        };
    }
    getContext() {
        return this.context;
    }
    componentWillUnmount() {
        var _a, _b;
        this.refItem.init = false;
        (_b = (_a = this.getContext()).remove) === null || _b === void 0 ? void 0 : _b.call(_a, this.refItem.id);
    }
    update(props) {
        var _a;
        let css = (_a = props === null || props === void 0 ? void 0 : props.css) !== null && _a !== void 0 ? _a : "";
        this.refItem.contextValue.update(this.refItem.id, css, props, this.refItem.currentStyle, this.context);
        if (this.refItem.contextValue.changed() || this.refItem.selectedThemeIndex != this.props.themeContext.selectedIndex) {
            this.refItem.style = undefined;
            this.refItem.contextValue.prevCSS = undefined;
            this.refItem.selectedThemeIndex = this.props.themeContext.selectedIndex;
            return true;
        }
        return false;
    }
    render() {
        var _a, _b, _c, _d, _e;
        let context = this.context;
        (_a = context === null || context === void 0 ? void 0 : context.register) === null || _a === void 0 ? void 0 : _a.call(context, this.refItem.id);
        const isText = this.props.View.displayName && this.props.View.displayName == "Text" && reactNative.Platform.OS == "web";
        this.update(this.props);
        if ((this.refItem.currentStyle && this.refItem.style == undefined)) {
            let sArray = [];
            let cpyCss = this.refItem.contextValue.join();
            let tCss = cssTranslator(cpyCss, this.refItem.currentStyle, undefined);
            if (tCss._props)
                this.refItem.contextValue.cssProps = Object.assign({}, tCss._props);
            else
                this.refItem.contextValue.cssProps = {};
            delete tCss._props;
            if (tCss)
                sArray.push(tCss);
            this.refItem.style = sArray;
        }
        let styles = [
            isText && this.props.activePan ? { userSelect: "none" } : {},
            ...toArray(this.refItem.style),
            ...toArray(this.props.style),
            ...toArray((_b = this.refItem.contextValue.cssProps) === null || _b === void 0 ? void 0 : _b.style)
        ];
        if ((_c = this.refItem.contextValue.cssProps) === null || _c === void 0 ? void 0 : _c.style) {
            delete this.refItem.contextValue.cssProps.style;
        }
        let rProps = Object.assign(Object.assign(Object.assign({}, this.props), this.refItem.contextValue.cssProps), { style: styles });
        const refererId = (_e = (_d = this.refItem.contextValue.cssProps) === null || _d === void 0 ? void 0 : _d.refererId) !== null && _e !== void 0 ? _e : this.props.refererId;
        if (refererId && this.props.themeContext.referers) {
            let ref = this.props.themeContext.referers.find(x => x.id == refererId);
            if (!ref) {
                if (__DEV__)
                    console.warn("referer with id", refererId, "could not be found");
            }
            else {
                if (ref.func) {
                    try {
                        rProps = ref.func(rProps);
                    }
                    catch (e) {
                        if (__DEV__)
                            console.error(e);
                    }
                }
            }
        }
        if (ifSelector(rProps.ifTrue) === false) {
            return null;
        }
        return (React.createElement(CSSContext.Provider, { value: this.refItem.contextValue },
            React.createElement(this.props.View, Object.assign({ dataSet: { css: reactNative.Platform.OS == "web" && this.refItem.contextValue.cpyCss && __DEV__ ? "__DEV__ CSS:" + this.refItem.contextValue.cpyCss : "" }, viewPath: this.props.viewPath }, rProps, { ref: this.props.cRef }))));
    }
}
StyledComponent.contextType = CSSContext;
class StyledItem {
    render(props, ref) {
        const View = this.view;
        const viewPath = this.viewPath;
        let themecontext = React.useContext(ThemeContext);
        const isText = View.displayName && View.displayName == "Text" && reactNative.Platform.OS == "web";
        if (isText)
            globalData.hook("activePan");
        if (themecontext == undefined)
            throw "Error ThemeContext must be provided with its themes and default style";
        return (React.createElement(StyledComponent, Object.assign({}, props, { activePan: isText ? globalData.activePan : undefined, View: View, viewPath: viewPath, themeContext: themecontext, cRef: ref })));
    }
}
const Styleable = function (View, identifier) {
    if (!identifier || identifier.trim().length <= 1)
        throw "react-native-short-style needs an identifier";
    let pr = {
        View,
        viewPath: identifier
    };
    let item = new StyledItem();
    item.view = View;
    item.viewPath = identifier;
    return refCreator(item.render.bind(item), identifier, View);
};
export { Styleable, NestedStyleSheet, cssTranslator };
export * from "./CSSStyle";
//# sourceMappingURL=index.js.map