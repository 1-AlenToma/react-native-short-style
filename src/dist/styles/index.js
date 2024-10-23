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
import cssTranslator, { serilizeCssStyle } from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as allowedKeys from "./ValidViewStylesAttributes";
import * as React from "react";
import { getClasses } from "../config/Methods";
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
    add(...keys) {
        let translatedStyle = serilizeCssStyle(this.styleFile);
        for (let k of keys) {
            if (k.trim().endsWith(".") || k.trim().length == 0)
                continue;
            if (this.css.indexOf(` ${k} `) === -1 && k in translatedStyle)
                this.css += `${k.trim()} `;
        }
        return this;
    }
    classes() {
        return getClasses(this.css, this.styleFile);
    }
    distinct() {
        let items = new CSS("").add(...this.css.split(" "));
        return items.css;
    }
    toString() {
        return this.distinct();
    }
}
let CSSContext = React.createContext({});
let StyledWrapper = React.forwardRef((_a, ref) => {
    var { View, styleFile, name, style, css } = _a, props = __rest(_a, ["View", "styleFile", "name", "style", "css"]);
    let ec = React.useContext(CSSContext);
    let [_, setUpdater] = React.useState(0);
    let parsedData = React.useRef({
        style: undefined,
        pk: undefined
    }).current;
    const validKeyStyle = View.displayName
        ? allowedKeys[View.displayName]
        : undefined;
    React.useEffect(() => {
        parsedData.style = undefined;
        setUpdater(x => (x > 1000 ? 1 : x) + 1);
    }, [css]);
    if (styleFile &&
        parsedData.style == undefined) {
        let sArray = [];
        let pk = "";
        let cpyCss = new CSS(styleFile, css);
        pk = ec.parentKey ? ec.parentKey() : "";
        if (pk.length > 0 && !pk.endsWith("."))
            pk += ".";
        pk += name;
        cpyCss.add(name, pk);
        if (ec.parentClassNames) {
            cpyCss.add(ec.parentClassNames(name, cpyCss.toString()));
            css = cpyCss.toString();
        }
        let tCss = cssTranslator(cpyCss.toString(), styleFile, validKeyStyle);
        if (tCss)
            sArray.push(tCss);
        parsedData.style = sArray;
        parsedData.pk = pk;
    }
    let cValue = {
        parentKey: () => parsedData.pk,
        parentClassNames: (name, pk) => {
            let ss = new CSS(css).add(pk);
            if (!css)
                return "";
            let c = new CSS(styleFile);
            for (let s of ss.classes()) {
                let m = ` ${s}.${name}`;
                c.add(m, styleFile);
            }
            return c.toString();
        }
    };
    return (React.createElement(CSSContext.Provider, { value: cValue },
        React.createElement(View, Object.assign({}, props, { ref: ref, name: parsedData.pk, style: [
                ...toArray(parsedData.style),
                ...toArray(style)
            ] }))));
});
const Styleable = function (View, styleFile, identifier) {
    identifier = identifier !== null && identifier !== void 0 ? identifier : View.displayName;
    if (!identifier || identifier.trim().length <= 1)
        throw "react-native-short-style needs an identifier";
    let fn = React.forwardRef((props, ref) => {
        let pr = {
            View,
            name: identifier,
            styleFile
        };
        return (React.createElement(StyledWrapper, Object.assign({}, props, pr, { ref: ref })));
    });
    return fn;
};
export { Styleable, NestedStyleSheet, cssTranslator };
//# sourceMappingURL=index.js.map