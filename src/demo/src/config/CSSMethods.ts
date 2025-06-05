import { globalData } from "../theme/ThemeContext";

export const flatStyle = (style: any) => {
    if (style && Array.isArray(style) && typeof style == "object")
        style = style.reduce((a, v) => {
            if (v)
                a = { ...a, ...v };
            return a;
        }, {});

    return style ?? {};
}

export const removeProps = (item: any, ...props: string[]) => {
    item = item ?? {};
    for (let p of props) {
        if (p in item)
            delete item[p];
    }

    return item;
}

export const hasString = (a: string, b: string) => {
    a = a ?? "kjhasdjkh kjashdjhkyua8weqdljmnaksjchzx cisuhdihwsdk";
    b = b ?? "klhaksjhdnkjbhjhb iuasydouiwd qwiudhwqhebdmhwbvsnjbzliuchasdiaöoij";
    return a.toLowerCase().indexOf(b.toLowerCase()) != -1;
}

export const eqString = (a: string, b: string) => {
    a = a ?? "kjhasdjkh kjashdjhkyua8weqdljmnaksjchzx cisuhdihwsdk";
    b = b ?? "klhaksjhdnkjbhjhb iuasydouiwd qwiudhwqhebdmhwbvsnjbzliuchasdiaöoij";
    return a.toLowerCase() == b.toLowerCase();
}

export const parseKeys = (key: string) => {
    let path = "";
    let keys: string[] = [];
    let splitter = false;
    for (let i = 0; i < key.length; i++) {
        let char = key[i];
        let nKey = key[i + 1];


        if (char != "$") {
            path += char;
            continue;
        }

        if (char == "$" && nKey != "$") {
            if (!keys.includes(path)) {
                keys.push(path);
            }
            path += "."
            splitter = false;
            continue
        }

        if (char == "$" && nKey == "$") {
            if (!keys.includes(path))
                keys.push(path);
            if (!splitter)
                path = path.split(".").slice(0, -1).join(".")
            splitter = true;
        }
    }

    keys.push(path);
    return keys.filter(x => x && x.length > 0)
}

export const extractProps = (css?: string) => {
    let result = { css, _hasValue: false };
    if (!css)
        return result
    if (/(props\:)( )?(\{)(.*)(\})/g.test(css)) {
        result._hasValue = true;
        let value = css.match(/((props\:)( )?(\{)(.*)(\}))/g);
        if (value && value.length > 0) {
            let items = [];
            for (let item of value) {
                let pItem = JSON.parse(item.replace(/(props:)/g, ""));
                if (pItem.css) {
                    css = css.replace(item, pItem.css);
                    delete pItem.css
                }
                else css = css.replace(item, "")
                items.push(pItem)
            }
            if (items.length > 0)
                result = { ...result, ...flatStyle(items) };
        }
    }

    result.css = css;

    return result;
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

    if (ids.size >= 1000)
        ids = new Map();
    ids.set(id, id);
    return id;
}


export const ValueIdentity = {
    chars: [":", "-"] as const,
    has: (value: any) => {
        return value && typeof value == "string" && ValueIdentity.chars.find(x => value.indexOf(x) !== -1)
    },
    keyValue: (value: string) => {
        value = value.trim();
        let parts = value.split(":");

        // Fallback to '-' if ':' is not present
        if (parts.length < 2) {
            parts = value.split("-");
        }

        const key = parts[0];
        const rest = parts.slice(1).join("-");

        let isClassName = false;
        let parsedValue = rest;

        // Check for $className notation
        if (parsedValue.startsWith("$")) {
            isClassName = true;
            parsedValue = parsedValue.slice(1); // remove the $
        }

        return {
            key,
            value: parsedValue,
            kvalue: value,
            isClassName
        };
    },
    splitCss: (css: string) => {
        if (!css || typeof css !== "string") return [];

        const cacheKey = `${css}_splitCss_Result`;
        if (globalData.tStorage.has(cacheKey)) {
            return globalData.tStorage.get(cacheKey);
        }

        // Remove spaces around ':' and '-' only
        const cleanedCss = css.replace(/\s*(:|-)\s*/g, "$1");

        // Match space-separated tokens, keeping groups like 'func(arg1, arg2)' intact
        const result: string[] = [];
        let current = '';
        let depth = 0;

        for (let i = 0; i < cleanedCss.length; i++) {
            const char = cleanedCss[i];

            if (char === '(') {
                depth++;
            } else if (char === ')') {
                depth--;
            }

            if (char === ' ' && depth === 0) {
                if (current) {
                    result.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }

        if (current) {
            result.push(current);
        }

        globalData.tStorage.set(cacheKey, result);
        return result;
    },
    getClasses: (css: string, globalStyle: any, itemIndex?: number) => {
        let items = ValueIdentity.splitCss(css);
        let props: any = {};
        for (let item of items) {
            if (item && !ValueIdentity.has(item) && !(item in props) && item in globalStyle) {
                props[item] = item;
            }
            if (item && itemIndex != undefined) {
                item = `${item}_${itemIndex}`;
                if (item in globalStyle)
                    props[item] = item;
            }
        }
        return Object.keys(props)
    }
}