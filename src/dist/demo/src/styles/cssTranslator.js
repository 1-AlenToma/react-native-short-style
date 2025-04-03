import { extractProps } from "../config/CSSMethods";
import { Storage } from "../config/Storage";
import { StylesAttributes, ShortCSS } from "./validStyles";
import { ValueIdentity } from "../config/CSSMethods";
let styleKeys = [...StylesAttributes];
let shortCss = undefined;
const buildShortCss = () => {
    if (shortCss)
        return shortCss;
    shortCss = [];
    let keyExceptions = {
        marginBlock: "maBl",
        paddingBlock: "paBl",
        borderBlockColor: "boBCo",
        borderCurve: "boCu",
        direction: "dir",
        marginHorizontal: "maHo",
        shadowOffset: "shadowOffset",
        fontStyle: "fontStyle"
    };
    let className = "";
    for (let k of styleKeys) {
        let shortKey = null;
        if (keyExceptions[k])
            shortKey = keyExceptions[k];
        else
            for (let s of k) {
                if (!shortKey) {
                    shortKey = s;
                    continue;
                }
                if (shortKey.length == 1) {
                    shortKey += s;
                    continue;
                }
                if (s === s.toUpperCase())
                    shortKey += s;
            }
        while (shortCss.find(x => x[shortKey])) {
            shortKey += k[shortKey.length];
        }
        let item = { key: k };
        item[k] = k;
        item[k.toLowerCase()] = k;
        item[shortKey.toLowerCase()] = k;
        className += `${k}(value?: ValueType["${k}"] | null) {
        return this.add(ShortStyles.${k}, value);
     }\n`;
        className += `${shortKey}(value?: ValueType["${k}"] | null) {
        return this.add(ShortStyles.${k}, value);
     }\n`;
        shortCss.push(item);
    }
    console.dir(shortCss);
    // console.error([shortCss].niceJson());
    return shortCss;
};
const splitSafe = (item, char, index) => {
    let vs = item.split(char);
    if (vs.length > index)
        return vs[index].trim();
    return "";
};
const has = (s, char) => {
    return (s && char && s.toString().toUpperCase().indexOf(char.toString().toUpperCase()) !== -1);
};
const checkNumber = (value) => {
    if (/^(-?)((\d)|((\d)?\.\d))+$/.test(value)) {
        return parseFloat(value);
    }
    return value;
};
const checkObject = (value) => {
    try {
        if (typeof value == "string" && /\{|\}|\[|\]/g.test(value)) {
            return eval(value);
        }
    }
    catch (e) { }
    return value;
};
const cleanStyle = (style, propStyle) => {
    let item = Object.assign({}, style);
    for (let k in style) {
        if (k.trim().startsWith("$") || k.indexOf(".") != -1 || (propStyle && !propStyle[k])) {
            delete item[k];
        }
    }
    return item;
};
const cleanKey = (k) => {
    return (k !== null && k !== void 0 ? k : "").indexOf("$") != -1 ? k.substring(1) : k;
};
const newId = () => Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36);
export const serilizeCssStyle = (style) => {
    let key = "styleId" in style ? style["styleId"] : (style["styleId"] = newId());
    key += Object.keys(style).length;
    if (Storage.has(key)) {
        return Storage.get(key);
    }
    let sItem = {};
    let fn = (s, parentKey) => {
        let item = {};
        if (typeof s !== "object" || typeof s === "string" || Array.isArray(s))
            return s;
        for (let k in s) {
            if (k && k.indexOf("$") != -1) {
                let pKey = `${parentKey}.${cleanKey(k)}`;
                sItem[pKey] = fn(s[k], pKey);
                continue;
            }
            item[k] = s[k];
        }
        return item;
    };
    for (let k in style) {
        let ck = cleanKey(k);
        sItem[ck] = fn(style[k], ck);
    }
    Storage.set(key, sItem);
    return sItem;
};
export const clearCss = (id) => {
    Storage.delete(id);
};
export const clearAll = () => {
    Storage.clear();
};
const css_translator = (css, styleFile, propStyle, id) => {
    var _a, _b, _c, _d;
    let cssItem = { _props: {}, important: {} };
    if (!css || css.trim().length <= 0)
        return cssItem;
    id = id !== null && id !== void 0 ? id : css;
    if (Storage.has(id))
        return Object.assign({}, Storage.get(id));
    let CSS = styleFile;
    let translatedItem = extractProps(css);
    if (translatedItem._hasValue) {
        css = translatedItem.css;
        delete translatedItem.css;
        delete translatedItem._hasValue;
        cssItem._props = Object.assign({}, translatedItem);
    }
    let items = ValueIdentity.splitCss(css);
    if (items && items.length > 0)
        for (let c of items) {
            if (!c || c.trim().length <= 0)
                continue;
            let style = (_a = CSS[c]) !== null && _a !== void 0 ? _a : CSS[c.toLowerCase()];
            let important = (_b = CSS[`${c}.important`]) !== null && _b !== void 0 ? _b : CSS[`${c.toLowerCase()}.important`];
            if (style === undefined && ValueIdentity.has(c)) {
                let kValue = ValueIdentity.keyValue(c);
                let k = kValue.key;
                let value = kValue.isClassName ? kValue.value : checkObject(checkNumber(kValue.value));
                if (typeof value == "string" && /(undefined)|(null)/gi.test(value))
                    value = undefined;
                else if (kValue.isClassName) {
                    if (value in CSS || value.toLowerCase() in CSS) {
                        value = Object.values((_c = CSS[value]) !== null && _c !== void 0 ? _c : CSS[value.toLowerCase()])[0];
                    }
                }
                let short = ((_d = ShortCSS[k]) !== null && _d !== void 0 ? _d : ShortCSS[k.toLowerCase()]);
                if (short) {
                    if (!propStyle || propStyle[short])
                        cssItem[short] = value;
                }
                else {
                    cssItem[k] = value;
                    if (__DEV__)
                        console.warn(kValue, "not found in react-native style props, but we will still add it");
                }
                continue;
            }
            if (style && typeof style === "string") {
                style = css_translator(style, styleFile, propStyle);
                CSS[c] = Object.assign({}, style); // so as to not parse it again
            }
            if (style) {
                if (style._props) {
                    style = Object.assign({}, style); // this so CSS retains the props property
                    cssItem._props = Object.assign(Object.assign({}, cssItem._props), style._props);
                    delete style._props;
                }
                if (important) {
                    cssItem.important = Object.assign(Object.assign({}, cssItem.important), style);
                }
                else {
                    cssItem = Object.assign(Object.assign({}, cssItem), style);
                }
                continue;
            }
        }
    if (cssItem.important) {
        cssItem = Object.assign(Object.assign({}, cssItem), cssItem.important);
        delete cssItem.important;
    }
    Storage.set(id, cssItem);
    return Object.assign({}, cssItem);
};
export default css_translator;
//# sourceMappingURL=cssTranslator.js.map