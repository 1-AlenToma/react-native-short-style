import { serilizeCssStyle } from "../styles/cssTranslator";
import { defaultTheme, ComponentsStyles } from "../theme/DefaultStyle";
import { IThemeContext } from "../Typse";

export const currentTheme = (context: IThemeContext) => {
    let thisTheme = themeStyle();
    let selectedTheme = serilizeCssStyle(context.themes[context.selectedIndex]);
    return {
        ...thisTheme, ...serilizeCssStyle(context.defaultTheme), ...selectedTheme, ...ComponentsStyles
    }

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

export const newId = () => {
    let id = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)
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
    globalStyle = serilizeCssStyle(globalStyle);
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