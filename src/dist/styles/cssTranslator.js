const cachedCss = new Map();
import reactnativeStyles from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
let styleKeys = Object.keys(reactnativeStyles);
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
        marginHorizontal: "maHo"
    };
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
        shortCss.push(item);
    }
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
    return (s &&
        char &&
        s
            .toString()
            .toUpperCase()
            .indexOf(char.toString().toUpperCase()) !==
            -1);
};
const checkNumber = (value) => {
    if (/^(-?)((\d)|((\d)?\.\d))+$/.test(value))
        return eval(value);
    return value;
};
const checkObject = (value) => {
    try {
        if (/\{|\}|\[|\]/g.test(value))
            return eval(value);
    }
    catch (e) { }
    return value;
};
const cleanStyle = (style, propStyle) => {
    let item = Object.assign({}, style);
    for (let k in style) {
        if (k.trim().startsWith("$") ||
            has(k, ".") ||
            (propStyle && !propStyle[k]))
            delete item[k];
    }
    return item;
};
const cleanKey = (k) => {
    return has(k, "$") ? k.substring(1) : k;
};
let serilizedCssStyle = new Map();
export const serilizeCssStyle = (style) => {
    if (serilizedCssStyle.has(style))
        return serilizedCssStyle.get(style);
    let sItem = {};
    let fn = (s, parentKey) => {
        let item = {};
        if (typeof s !== "object" ||
            typeof s === "string" ||
            Array.isArray(s))
            return s;
        for (let k in s) {
            if (has(k, "$")) {
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
    serilizedCssStyle.set(style, sItem);
    return sItem;
};
const css_translator = (css, styleFile, propStyle) => {
    if (!css || css.length <= 0)
        return {};
    if (cachedCss.has(css))
        return cachedCss.get(css);
    let shortk = buildShortCss();
    let CSS = {};
    if (styleFile)
        CSS = serilizeCssStyle(styleFile);
    let cssItem = {};
    for (let c of css
        .split(" ")
        .filter(x => x.trim().length > 0)) {
        if (has(c, ":")) {
            let k = splitSafe(c, ":", 0);
            let value = checkObject(checkNumber(splitSafe(c, ":", 1)));
            if (has(value, "undefined") ||
                has(value, "null"))
                value = undefined;
            let short = shortk.find(x => x[k.toLowerCase()] !== undefined);
            //if (k == "mab")
            // console.log(k, value, short);
            if (short) {
                if (!propStyle || propStyle[short.key])
                    cssItem[short.key] = value;
            }
            continue;
        }
        let style = CSS[c];
        if (typeof style === "string")
            style = css_translator(style, styleFile, propStyle);
        if (style) {
            cssItem = Object.assign(Object.assign({}, cssItem), cleanStyle(style, propStyle));
            continue;
        }
    }
    cachedCss.set(css, cssItem);
    /*console.error(
      JSON.stringify({ css, cssItem, CSS }, null, 4)
    );*/
    return cssItem;
};
export default css_translator;
//# sourceMappingURL=cssTranslator.js.map