import { extractProps } from "../config/CSSMethods";
import { Storage } from "../config/Storage";
import { StylesAttributes, ShortCSS } from "./validStyles";
import { ValueIdentity } from "../config/CSSMethods";

let styleKeys = [...StylesAttributes]

let shortCss: (any[] | undefined) = undefined;
const buildShortCss = () => {
  if (shortCss) return shortCss;
  shortCss = [];
  let keyExceptions: any = {
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
    let shortKey: string | null = null;
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

        if (s === s.toUpperCase()) shortKey += s;
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
     }\n`
    className += `${shortKey}(value?: ValueType["${k}"] | null) {
        return this.add(ShortStyles.${k}, value);
     }\n`
    shortCss.push(item);
  }

  console.dir(shortCss)
  // console.error([shortCss].niceJson());
  return shortCss;
};

const splitSafe = (
  item: string,
  char: string,
  index: number
) => {
  let vs = item.split(char);
  if (vs.length > index) return vs[index].trim();
  return "";
};
const has = (s: string, char: string) => {
  return (s && char && s.toString().toUpperCase().indexOf(char.toString().toUpperCase()) !== -1);
};

const checkNumber = (value: string): any => {
  if (/^(-?)((\d)|((\d)?\.\d))+$/.test(value)) {
    return parseFloat(value);

  }
  return value;
};

const checkObject = (value: string) => {
  try {
    if (typeof value == "string" && /\{|\}|\[|\]/g.test(value)) {
      return eval(value);
    }
  } catch (e) { }
  return value;
};

const cleanStyle = (
  style: any,
  propStyle: any
) => {
  let item = { ...style };
  for (let k in style) {
    if (k.trim().startsWith("$") || k.indexOf(".") != -1 || (propStyle && !propStyle[k])) {
      delete item[k];
    }
  }
  return item;
};

const cleanKey = (k: string) => {
  return (k ?? "").indexOf("$") != -1 ? k.substring(1) : k;
}

const newId = () => Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)



export const serilizeCssStyle = (style: any) => {
  let key = "styleId" in style ? style["styleId"] : (style["styleId"] = newId())
  key += Object.keys(style).length;

  if (Storage.has(key)) {
    return Storage.get(key);
  }

  let sItem = {};
  let fn = (s: any, parentKey: string) => {
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

export const clearCss = (id: string) => {
  Storage.delete(id)
}

export const clearAll = () => {
  Storage.clear();
}


const css_translator = (
  css?: string,
  styleFile?: any,
  id?: string
): object & { _props: any, important?: any } => {
  let important = {};
  let cssItem = { _props: {} };
  if (!css || css.trim().length <= 0) return cssItem;
  id = id ?? css;

  if (Storage.has(id))
    return { ...Storage.get(id) };

  const assign = (a: any, b: any) => {
    let important = { ...a.important ?? {} };
    Object.assign(a, b)
    Object.assign(a.important, important);
  }

  let CSS = styleFile;
  let translatedItem = extractProps(css);
  if (translatedItem._hasValue) {
    css = translatedItem.css;
    delete translatedItem.css;
    delete translatedItem._hasValue;
    cssItem._props = { ...translatedItem }
  }

  let items = ValueIdentity.splitCss(css);
  let isImportant = /(^|[^-])!important\b/.test(css);
  if (items && items.length > 0) {
    for (let c of items) {
      if (!c || c.trim().length <= 0 || c.indexOf(" !important") !== -1)
        continue;
      let style = CSS[c] ?? CSS[c.toLowerCase()];
      let _isImportend = isImportant;
      if (style === undefined && ValueIdentity.has(c)) {
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
            value = Object.values(CSS[value] ?? CSS[value.toLowerCase()])[0];
          }
        }


        let short = (ShortCSS[k] ?? ShortCSS[k.toLowerCase()]);

        if (short) {
          (_isImportend ? important : cssItem)[short] = value;
        } else {
          (_isImportend ? important : cssItem)[k] = value;
          if (__DEV__)
            console.warn(kValue, "not found in react-native style props, but we will still add it")
        }
        continue;
      }


      if (style && typeof style === "string") {
        style = css_translator(style, styleFile);
        CSS[c] = { ...style } // so as to not parse it again
      }

      if (style) {
        if (style._props) {
          Object.assign(cssItem._props, style._props)
          delete style._props;
        }

        important = { ...important, ...style.important }
        //Object.assign(important, style);
        Object.assign(cssItem, style)
        continue;
      }
    }
  }

  Storage.set(id, { ...cssItem, important: { ...important } });
  return { ...cssItem, important: { ...important } }
};

export default css_translator;
