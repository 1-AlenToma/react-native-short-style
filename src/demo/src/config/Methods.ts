import css_translator, { serilizeCssStyle, clearAll } from "../styles/cssTranslator";
import { defaultTheme, ComponentsStyles } from "../theme/DefaultStyle";
import { globalData } from "../theme/ThemeContext";
import { AlertViewAlertProps, AlertViewProps, IThemeContext, ToastProps } from "../Typse";
import { CSSStyle } from "../styles/CSSStyle"
import { PlatformStyleSheet } from "../theme/PlatformStyles";
import React from "react";

export const readAble = function (nr: number | string, total?: number) {
    let nrs = nr?.toString().split(".") ?? [];
    if (nrs.length <= 1) return nr;
    if (/[1-9]/g.test(nrs[1])) return `${nrs[0]}.${nrs[1].substring(0, total ?? 2)}`;
    return nr;
};

export const optionalStyle = (style: any) => {
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
    }

    return item as { c: string, o: any };
}

export const renderCss = (css: string, style: any) => {
    return css_translator(css, style);
}

export const currentTheme = (context: IThemeContext) => {
    let thisTheme = themeStyle();
    let selectedTheme = serilizeCssStyle({ ...context.defaultTheme, ...context.themes[context.selectedIndex] });
    return {
        ...thisTheme, ...selectedTheme, ...ComponentsStyles
    }

}

export const clearAllCss = () => {
    clearAll();
}

let serilizeTheme = undefined;

export const themeStyle = () => {
    if (serilizeTheme)
        return serilizeTheme;
    let style: any = PlatformStyleSheet();
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
}


export const ifSelector = (item?: boolean | Function) => {
    if (item === undefined || item === null)
        return undefined;
    if (typeof item == "function")
        item = item();
    return item;
}

export const getCssArray = (css: string) => {
    css = css.replace(/( )?(\:)( )?/gmi, ":").trim();
    return css.match(/((\(|\)).*?(\(|\))|[^(\(|\))\s]+)+(?=\s*|\s*$)/g)?.filter(x => x && x.trim().length > 0) ?? [];
}

export const getClasses = (css: string, globalStyle: any, itemIndex?: number) => {
    let items = getCssArray(css) ?? [];
    let props: any = {};
    for (let item of items) {
        if (item && item.indexOf(":") == -1 && !(item in props) && item in globalStyle) {
            props[item] = item;
        }
        if (item && itemIndex != undefined) {
            item = `${item}_${itemIndex}`;
            if (item in globalStyle)
                props[item] = item;
        }
    }

    return Object.keys(props);
}

export const proc = (partialValue, totalValue) => {
    return (partialValue / 100) * totalValue;
}

export class AlertDialog {
    static alert(props: AlertViewAlertProps | string) {
        globalData.alertViewData.alert(props);
    }

    static toast(props: ToastProps | string) {
        globalData.alertViewData.toast(props);
    }

    static async confirm(props: AlertViewProps | string) {
        return globalData.alertViewData.confirm(props);
    }
}

export const setRef = (ref: any, item: any) => {
    if (!ref)
        return;
    if (typeof ref == "function")
        ref(item);
    else if ("current" in ref)
        ref.current = item;
}

export const refCreator = function <T>(forwardRef: (props: any, ref: any) => React.ReactNode, name: string, view: any) {
    name = view.displayName || name;
    (forwardRef as any).displayName = `StyledItem(${name})`;
    (forwardRef as any).name = `StyledItem(${name})`;
    return React.forwardRef(forwardRef) as T;
}