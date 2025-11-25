import { extractProps } from "../config/CSSMethods";
import { Storage, TStorage } from "../config/Storage";
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
const cleanKey = (k) => {
    return (k !== null && k !== void 0 ? k : "").indexOf(".") != -1 ? k.substring(1) : k;
};
const newId = () => Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36);
export const serilizeCssStyle = (style) => {
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
    return sItem;
};
export const clearCss = (id) => {
    Storage.delete(id);
};
export const clearAll = () => {
    Storage.clear();
};
const css_translator = (css, styleFile, id) => {
    var _a, _b, _c;
    try {
        let important = {};
        let cssItem = { _props: {} };
        if (!css || css.trim().length <= 0)
            return cssItem;
        if (id !== undefined && Storage.has(id))
            return Object.assign({}, Storage.get(id));
        else if (TStorage.has(css))
            return Object.assign({}, TStorage.get(css));
        let CSS = styleFile !== null && styleFile !== void 0 ? styleFile : {};
        let translatedItem = extractProps(css);
        if (translatedItem._hasValue) {
            css = translatedItem.css;
            delete translatedItem.css;
            delete translatedItem._hasValue;
            cssItem._props = Object.assign({}, translatedItem);
        }
        let items = ValueIdentity.splitCss(css);
        let isImportant = /(^|[^-])!important\b/.test(css);
        if (items && items.length > 0) {
            for (let c of items) {
                if (!c || c.trim().length <= 0 || c.indexOf(" !important") !== -1)
                    continue;
                if (ValueIdentity.isClass(c)) {
                    //   console.log(c)
                    c = c.trim().substring(1);
                }
                let style = (_a = CSS[c]) !== null && _a !== void 0 ? _a : CSS[c.toLowerCase()];
                let _isImportend = isImportant;
                if (style === undefined && (ValueIdentity.has(c))) {
                    let kValue = ValueIdentity.keyValue(c);
                    if (kValue.important) {
                        _isImportend = true;
                    }
                    let k = kValue.key;
                    let value = kValue.isClassName ? kValue.value : checkObject(checkNumber(kValue.value));
                    if (typeof value == "string" && /(undefined)|(null)/gi.test(value))
                        value = undefined;
                    else if (kValue.isClassName) {
                        if (value in CSS || value.toLowerCase() in CSS) {
                            let tValue = (_b = CSS[value]) !== null && _b !== void 0 ? _b : CSS[value.toLowerCase()];
                            if (typeof tValue === "object")
                                value = Object.values(tValue)[0];
                            else
                                value = tValue;
                        }
                        else
                            continue; // its a class that is not used in this context
                    }
                    let short = ((_c = ShortCSS[k]) !== null && _c !== void 0 ? _c : ShortCSS[k.toLowerCase()]);
                    if (!kValue.isClassName || short) {
                        if (short) {
                            (_isImportend ? important : cssItem)[short] = value;
                        }
                        else {
                            (_isImportend ? important : cssItem)[k] = value;
                            if (__DEV__)
                                console.warn(kValue, value, "not found in react-native style props, but we will still add it");
                        }
                        continue;
                    }
                    else
                        style = value;
                }
                if (style && typeof style === "string") {
                    style = css_translator(style, styleFile);
                    CSS[c] = Object.assign({}, style); // so as to not parse it again
                }
                if (typeof style == "object")
                    style = Object.assign({}, style);
                if (style) {
                    if (style._props) {
                        Object.assign(cssItem._props, style._props);
                        delete style._props;
                    }
                    important = Object.assign(Object.assign({}, important), style.important);
                    //Object.assign(important, style);
                    Object.assign(cssItem, style);
                    continue;
                }
            }
        }
        if (id !== undefined)
            Storage.set(id, Object.assign(Object.assign({}, cssItem), { important: Object.assign({}, important) }));
        else
            TStorage.set(css, Object.assign(Object.assign({}, cssItem), { important: Object.assign({}, important) }));
        return Object.assign(Object.assign({}, cssItem), { important: Object.assign({}, important) });
    }
    catch (e) {
        console.error("css translator error", css, e);
        throw e;
    }
};
export default css_translator;
//# sourceMappingURL=cssTranslator.js.map