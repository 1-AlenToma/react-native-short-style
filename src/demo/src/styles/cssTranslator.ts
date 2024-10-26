const cachedCss = new Map();
import { StylesAttributes } from "./validStyles";


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
    marginHorizontal: "maHo"
  };
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
    shortCss.push(item);
  }
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
    if (k.trim().startsWith("$") || k.indexOf(".") != -1 || (propStyle && !propStyle[k]))
      delete item[k];
  }
  return item;
};

const cleanKey = (k: string) => {
  return (k ?? "").indexOf("$") != -1 ? k.substring(1) : k;
}

const newId=()=> Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)


let serilizedCssStyle = new Map();
export const serilizeCssStyle = (style: any) => {
  let key = "styleId" in style ? style["styleId"] : (style["styleId"] = newId())
  key += Object.keys(style).length;

  if (serilizedCssStyle.has(key)) {
    return serilizedCssStyle.get(key);
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
  serilizedCssStyle.set(key, sItem);
  return sItem;
};

export const clearCss = (id: string) => {
  cachedCss.delete(id)
}

export const clearAll = () => {
  cachedCss.clear();
}

const css_translator = (
  css?: string,
  styleFile?: any,
  propStyle?: any,
  id?: string
) => {
  if (!css || css.length <= 0) return {};
  id = id ?? css;
  css = css.replace(/( )?(\:)( )?/gmi, ":").trim();
  if (!css || css.length <= 0) return {};

  if (cachedCss.has(id))
    return cachedCss.get(id);
  let shortk = buildShortCss();
  let CSS = {};
  if (styleFile)
    CSS = serilizeCssStyle(styleFile);

  let cssItem = {};
  let items = css.match(/((\(|\)).*?(\(|\))|[^(\(|\))\s]+)+(?=\s*|\s*$)/g)?.filter(x => x && x.trim().length > 0);
  for (let c of items) {
    if (has(c, ":")) {
      let k = splitSafe(c, ":", 0);
      let value = checkObject(checkNumber(splitSafe(c, ":", 1)));

      if (has(value, "undefined") || has(value, "null"))
        value = undefined;
      let short = shortk.find(x => x[k.toLowerCase()] !== undefined);
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
      cssItem = {
        ...cssItem,
        ...cleanStyle(style, propStyle)
      };
      continue;
    }
  }
  cachedCss.set(id, cssItem);
  return cssItem;
};

export default css_translator;
