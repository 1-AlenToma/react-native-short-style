var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import css_translator, { serilizeCssStyle, clearAll } from "../styles/cssTranslator";
import { defaultTheme, ComponentsStyles } from "../theme/DefaultStyle";
import { globalData } from "../theme/ThemeContext";
import { StyledKey } from "../Typse";
import { CSSStyle } from "../styles/CSSStyle";
import { PlatformStyleSheet } from "../theme/PlatformStyles";
import React from "react";
export const toArray = (item) => {
    if (!item)
        return [];
    if (Array.isArray(item))
        return item;
    return [item];
};
export const RemoveProps = (props, ...items) => {
    items.forEach(x => {
        if (x in props)
            delete props[x];
    });
    return props;
};
export const readAble = function (nr, total = 2) {
    var _a;
    if (Array.isArray(nr))
        nr = nr[0];
    let nrs = (_a = nr === null || nr === void 0 ? void 0 : nr.toString().split(".")) !== null && _a !== void 0 ? _a : [];
    if (nrs.length <= 1)
        return nr;
    return parseFloat(nr === null || nr === void 0 ? void 0 : nr.toFixed(total));
};
export const optionalStyle = (style) => {
    if (style && Array.isArray(style) && typeof style == "object")
        style = style.reduce((a, v) => {
            if (v)
                a = Object.assign(Object.assign({}, a), v);
            return a;
        }, {});
    if (style && typeof style == "function")
        style = style(new CSSStyle()).toString();
    let item = {
        o: typeof style == "object" ? style !== null && style !== void 0 ? style : null : null,
        c: typeof style == "string" ? style !== null && style !== void 0 ? style : "" : ""
    };
    return item;
};
export const renderCss = (css, style) => {
    return css_translator(css, style);
};
export const currentTheme = (context) => {
    const key = `${StyledKey}${context.selectedIndex}`;
    const themes = React.useRef({}).current;
    if (__DEV__ || !globalData.storage.has(key)) {
        if (!themes[context.selectedIndex] && context.themes.length > 0 && context.defaultTheme) {
            let thisTheme = themeStyle();
            let selectedTheme = serilizeCssStyle(Object.assign(Object.assign({}, context.defaultTheme), context.themes[context.selectedIndex]));
            themes[context.selectedIndex] = Object.assign(Object.assign(Object.assign({}, thisTheme), selectedTheme), ComponentsStyles);
        }
        globalData.storage.set(key, themes[context.selectedIndex]);
    }
    return globalData.storage.get(key);
};
export const clearAllCss = () => {
    clearAll();
};
let serilizeTheme = undefined;
export const themeStyle = () => {
    if (serilizeTheme)
        return serilizeTheme;
    let style = PlatformStyleSheet();
    for (let key in defaultTheme) {
        let value = defaultTheme[key];
        let key0 = key;
        let key1 = key.split("").filter((x, i) => i <= 1 || x == x.toUpperCase()).join("").toLocaleLowerCase();
        if (typeof value === "object") {
            for (let sKey in value) {
                let o = {};
                o[key] = value[sKey];
                if (typeof value[sKey] === "object")
                    o = value[sKey];
                style[`${key0}-${sKey}`] = o;
                style[`${key1}-${sKey}`] = o;
            }
        }
    }
    serilizeTheme = style;
    return style;
};
export const ifSelector = (item) => {
    if (item === undefined || item === null)
        return undefined;
    if (typeof item == "function")
        item = item();
    return item;
};
export const proc = (partialValue, totalValue) => {
    return (partialValue / 100) * totalValue;
};
export class AlertDialog {
    static alert(props) {
        globalData.alertViewData.alert(props);
    }
    static toast(props) {
        globalData.alertViewData.toast(props);
    }
    static confirm(props) {
        return __awaiter(this, void 0, void 0, function* () {
            return globalData.alertViewData.confirm(props);
        });
    }
}
export const setRef = (ref, item) => {
    if (!ref)
        return;
    if (typeof ref === "function")
        ref(item);
    else if ("current" in ref)
        ref.current = item;
    else if (ref && typeof ref === "object")
        Object.assign(ref, item);
};
export const refCreator = function (forwardRef, name, view) {
    name = view.displayName || name;
    forwardRef.displayName = `StyledItem(${name})`;
    //(forwardRef as any).name = `StyledItem(${name})`;
    return React.forwardRef(forwardRef);
};
//# sourceMappingURL=Methods.js.map