import { globalData } from "../theme/ThemeContext";
export const flatStyle = (style) => {
    if (style && Array.isArray(style) && typeof style == "object")
        style = style.reduce((a, v) => {
            if (v)
                a = Object.assign(Object.assign({}, a), v);
            return a;
        }, {});
    return style !== null && style !== void 0 ? style : {};
};
export const removeProps = (item, ...props) => {
    item = item !== null && item !== void 0 ? item : {};
    for (let p of props) {
        if (p in item)
            delete item[p];
    }
    return item;
};
export const hasString = (a, b) => {
    a = a !== null && a !== void 0 ? a : "kjhasdjkh kjashdjhkyua8weqdljmnaksjchzx cisuhdihwsdk";
    b = b !== null && b !== void 0 ? b : "klhaksjhdnkjbhjhb iuasydouiwd qwiudhwqhebdmhwbvsnjbzliuchasdiaöoij";
    return a.toLowerCase().indexOf(b.toLowerCase()) != -1;
};
export const eqString = (a, b) => {
    a = a !== null && a !== void 0 ? a : "kjhasdjkh kjashdjhkyua8weqdljmnaksjchzx cisuhdihwsdk";
    b = b !== null && b !== void 0 ? b : "klhaksjhdnkjbhjhb iuasydouiwd qwiudhwqhebdmhwbvsnjbzliuchasdiaöoij";
    return a.toLowerCase() == b.toLowerCase();
};
export const parseKeys = (key) => {
    let path = "";
    let keys = [];
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
            path += ".";
            splitter = false;
            continue;
        }
        if (char == "$" && nKey == "$") {
            if (!keys.includes(path))
                keys.push(path);
            if (!splitter)
                path = path.split(".").slice(0, -1).join(".");
            splitter = true;
        }
    }
    keys.push(path);
    return keys.filter(x => x && x.length > 0);
};
export const extractProps = (css) => {
    let result = { css, _hasValue: false };
    if (!css)
        return result;
    if (/(props\:)( )?(\{)(.*)(\})/g.test(css)) {
        result._hasValue = true;
        let value = css.match(/((props\:)( )?(\{)(.*)(\}))/g);
        if (value && value.length > 0) {
            let items = [];
            for (let item of value) {
                let pItem = JSON.parse(item.replace(/(props:)/g, ""));
                if (pItem.css) {
                    css = css.replace(item, pItem.css);
                    delete pItem.css;
                }
                else
                    css = css.replace(item, "");
                items.push(pItem);
            }
            if (items.length > 0)
                result = Object.assign(Object.assign({}, result), flatStyle(items));
        }
    }
    result.css = css;
    return result;
};
let ids = new Map();
let lastDate = new Date();
export const newId = (inc) => {
    if (lastDate.getMinutes() - new Date().getMinutes() > 1) {
        ids = new Map();
        lastDate = new Date();
    }
    let id = (inc !== null && inc !== void 0 ? inc : "") + Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36);
    if (ids.has(id)) {
        return newId(id);
    }
    if (ids.size >= 2000)
        ids = new Map();
    ids.set(id, id);
    return id;
};
export const ValueIdentity = {
    chars: [":", "-"],
    has: (value) => {
        return value && typeof value == "string" && ValueIdentity.chars.find(x => value.indexOf(x) !== -1);
    },
    isClass: (value) => {
        return value && typeof value == "string" && (value.trim().startsWith("."));
    },
    keyValue: (value) => {
        value = value.trim();
        let isClassName = false;
        let parts = value.split(":");
        // Fallback to '-' if ':' is not present
        if (parts.length < 2) {
            parts = value.split("-");
        }
        const key = parts[0];
        const rest = parts.slice(1).join("-");
        let parsedValue = rest;
        let important = false;
        // Check for $className notation
        if (!(/^(\.( +)?(\d))/g.test(parsedValue.trim())) && parsedValue.trim().startsWith(".")) {
            //  console.log(parsedValue)
            isClassName = true;
            parsedValue = parsedValue.slice(1); // remove the .
            // value = value.slice(1);
        }
        if (/-!important/gi.test(parsedValue)) {
            parsedValue = parsedValue.replace(/-!important/gi, "");
            important = true;
            //console.log(parsedValue)
        }
        else if (parsedValue == "!important") {
            important = true;
            isClassName = true;
            parsedValue = key;
        }
        return {
            key,
            value: parsedValue,
            kvalue: value,
            isClassName,
            important
        };
    },
    cleanCss: (css) => {
        if (!css || typeof css !== "string")
            return "";
        const cleanedCss = css.replace(/\s*(:|-)\s*/g, "$1");
        return cleanedCss.replace(/(?:^|\s)(?!\w+[:\-]-?\d+(?:\.\d+)?)(\S+)/g, "").trim();
    },
    splitCss: (css) => {
        if (!css || typeof css !== "string")
            return [];
        const cacheKey = `${css}_splitCss_Result`;
        if (globalData.tStorage.has(cacheKey)) {
            return globalData.tStorage.get(cacheKey);
        }
        // Remove spaces around ':' and '-' only
        const cleanedCss = css.replace(/\s*(:|-)\s*/g, "$1");
        // Match space-separated tokens, keeping groups like 'func(arg1, arg2)' intact
        const result = [];
        let current = '';
        let depth = 0;
        for (let char of cleanedCss) {
            if (char === '(') {
                depth++;
            }
            else if (char === ')') {
                depth--;
            }
            if (char === ' ' && depth === 0) {
                if (current) {
                    result.push(current);
                    current = '';
                }
            }
            else {
                current += char;
            }
        }
        if (current) {
            result.push(current);
        }
        globalData.tStorage.set(cacheKey, result);
        return result;
    },
    getClasses: (css, globalStyle, itemIndex) => {
        let items = ValueIdentity.splitCss(css);
        let props = {};
        for (let item of items) {
            if (item === null)
                continue;
            if (/\-!important/gi.test(item))
                item = item.replace(/\-!important/g, "");
            if (/!important/gi.test(item))
                continue;
            const isClass = ValueIdentity.isClass(item);
            if (isClass)
                item = item.trim().substring(1);
            if (item && (!ValueIdentity.has(item) || isClass || (globalStyle == undefined || item in globalStyle)) && !(item in props)) {
                props[item] = item;
            }
            if (item && itemIndex != undefined) {
                item = `${item}_${itemIndex}`;
                if (item in globalStyle)
                    props[item] = item;
            }
        }
        return Object.keys(props).filter(x => x && x !== null && x.length > 0);
    }
};
//# sourceMappingURL=CSSMethods.js.map