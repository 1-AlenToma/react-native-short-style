import { serilizeCssStyle,  clearAll } from "../styles/cssTranslator";
import { defaultTheme, ComponentsStyles } from "../theme/DefaultStyle";
import { globalData } from "../theme/ThemeContext";
import { AlertViewAlertProps, AlertViewProps, IThemeContext } from "../Typse";

export const currentTheme = (context: IThemeContext) => {
    let thisTheme = themeStyle();
    let selectedTheme = serilizeCssStyle({ ...context.defaultTheme, ...context.themes[context.selectedIndex] });
    return {
        ...thisTheme, ...selectedTheme, ...ComponentsStyles
    }

}

export const clearAllCss=()=> {
    clearAll();
}

let serilizeTheme = undefined;

export const themeStyle = () => {
    if (serilizeTheme)
        return serilizeTheme;
    let style = {};
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
let ids = new Map();
let lastDate = new Date();
export const newId = (inc?: string): string => {
    if (lastDate.getMinutes() - new Date().getMinutes() > 1) {
        ids = new Map();
        lastDate = new Date();
    }
    let id: string = (inc ?? "") + Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)
    if (ids.has(id)) {
        return (newId(id) as string);
    }
    ids.set(id, id);
    return id;
}

export const ifSelector = (item?: boolean | Function) => {
    if (item === undefined || item === null)
        return undefined;
    if (typeof item == "function")
        item = item();
    return item;
}

export const getClasses = (css: string, globalStyle: any) => {
    globalStyle = globalStyle;

    let items = css.split(" ").filter(x => x && x.length > 0);
    let props: string[] = [];
    for (let item of items) {
        if (item.indexOf(":") == -1 && item.indexOf(":") == -1 && !props.find(x => x == item) && globalStyle[item]) {
            props.push(item)
        }
    }

    return props;
}

export const proc = (partialValue, totalValue) => {
    return (partialValue / 100) * totalValue;
}

export class AlertDialog {
    static alert(props: AlertViewAlertProps) {
        globalData.alertViewData.alert(props);
    }

    static async confirm(props: AlertViewProps) {
        return globalData.alertViewData.confirm(props);
    }
}