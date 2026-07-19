import css_translator, { serilizeCssStyle, clearAll } from "../styles/cssTranslator";
import { defaultTheme, ComponentsStyles } from "../theme/DefaultStyle";
import { globalData } from "../theme/ThemeContext";
import { StyledKey } from "../Typse";
import { CSSStyle } from "../styles/CSSStyle";
import { PlatformStyleSheet } from "../theme/PlatformStyles";
import React from "react";
export const measure = function (item) {
    return new Promise(r => {
        if (item.measure) {
            item.measure((x, y, width, height, py, px) => {
                r({ x, y, width, px, py, height });
            });
        }
        else
            r(undefined);
    });
};
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
    if (Array.isArray(nr))
        nr = nr[0];
    let nrs = nr?.toString().split(".") ?? [];
    if (nrs.length <= 1)
        return nr;
    return parseFloat(nr?.toFixed(total));
};
export const optionalStyle = (style) => {
    if (style && Array.isArray(style) && typeof style == "object")
        style = style.reduce((a, v) => {
            if (v)
                a = { ...a, ...v };
            return a;
        }, {});
    if (style && typeof style == "function")
        style = style(new CSSStyle()).toString();
    let item = {
        o: typeof style == "object" ? style ?? null : null,
        c: typeof style == "string" ? style ?? "" : ""
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
        if ((!themes[context.selectedIndex] || __DEV__) && context.themes.length > 0 && context.defaultTheme) {
            let thisTheme = themeStyle();
            let selectedTheme = serilizeCssStyle({ ...context.defaultTheme, ...context.themes[context.selectedIndex] });
            themes[context.selectedIndex] = {
                ...thisTheme, ...selectedTheme, ...ComponentsStyles
            };
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
    static async confirm(props) {
        return globalData.alertViewData.confirm(props);
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
export const refCreator = function (useMem, forwardRef, name, view, compare) {
    name = view.displayName || name;
    const Component = React.forwardRef(forwardRef);
    Component.displayName = `StyledItem(${name})`;
    return (useMem ? React.memo(Component, compare) : Component);
};
//# sourceMappingURL=Methods.js.map