const cachedCss = new Map();
let styleKeys = [
  "alignContent",
  "alignItems",
  "alignSelf",
  "aspectRatio",
  "borderBottomWidth",
  "borderEndWidth",
  "borderLeftWidth",
  "borderRightWidth",
  "borderStartWidth",
  "borderTopWidth",
  "borderWidth",
  "bottom",
  "columnGap",
  "direction",
  "display",
  "end",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "gap",
  "height",
  "inset",
  "insetBlock",
  "insetBlockEnd",
  "insetBlockStart",
  "insetInline",
  "insetInlineEnd",
  "insetInlineStart",
  "justifyContent",
  "left",
  "margin",
  "marginBlock",
  "marginBlockEnd",
  "marginBlockStart",
  "marginBottom",
  "marginEnd",
  "marginHorizontal",
  "marginInline",
  "marginInlineEnd",
  "marginInlineStart",
  "marginLeft",
  "marginRight",
  "marginStart",
  "marginTop",
  "marginVertical",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "overflow",
  "padding",
  "paddingBlock",
  "paddingBlockEnd",
  "paddingBlockStart",
  "paddingBottom",
  "paddingEnd",
  "paddingHorizontal",
  "paddingInline",
  "paddingInlineEnd",
  "paddingInlineStart",
  "paddingLeft",
  "paddingRight",
  "paddingStart",
  "paddingTop",
  "paddingVertical",
  "position",
  "right",
  "rowGap",
  "start",
  "top",
  "width",
  "zIndex",
  "shadowColor",
  "shadowOffset",
  "shadowOpacity",
  "shadowRadius",
  "transform",
  "backfaceVisibility",
  "backgroundColor",
  "borderBottomColor",
  "borderBottomEndRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomStartRadius",
  "borderColor",
  "borderCurve",
  "borderEndColor",
  "borderEndEndRadius",
  "borderEndStartRadius",
  "borderLeftColor",
  "borderRadius",
  "borderRightColor",
  "borderStartColor",
  "borderStartEndRadius",
  "borderStartStartRadius",
  "borderStyle",
  "borderTopColor",
  "borderTopEndRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderTopStartRadius",
  "elevation",
  "opacity",
  "pointerEvents",
  "color",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "includeFontPadding",
  "letterSpacing",
  "lineHeight",
  "textAlign",
  "textAlignVertical",
  "textDecorationColor",
  "textDecorationLine",
  "textDecorationStyle",
  "textShadowColor",
  "textShadowOffset",
  "textShadowRadius",
  "textTransform",
  "userSelect",
  "verticalAlign",
  "writingDirection"
];

let shortCss = undefined;
const buildShortCss = () => {
  if (shortCss) return shortCss;
  shortCss = [];
  for (let k of styleKeys) {
    let shortKey = null;
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
    shortCss.push({ key: k, short: shortKey });
  }
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
  return (
    s &&
    char &&
    s
      .toString()
      .toUpperCase()
      .indexOf(char.toString().toUpperCase()) !==
      -1
  );
};

const checkNumber = (value: string) => {
  if (/^(-?)((\d)|(\d\.\d))+$/.test(value))
    return eval(value);
  return value;
};

const checkObject = (value: string) => {
  try {
    if (/\{|\}|\[|\]/g.test(value))
      return eval(value);
  } catch (e) {}
  return value;
};

const cleanStyle = (style: any) => {
  let item = { ...style };
  for (let k in style) {
    if (k.trim().startsWith("$") || has(k, "."))
      delete item[k];
  }
  return item;
};
let serilizedCssStyle = new Map();
const serilizeCssStyle = (style: any) => {
  if (serilizedCssStyle.has(style))
    return serilizedCssStyle.get(style);
  let sItem = {};
  let fn = (s: any, parentKey: string) => {
    let item = {};
    if (
      typeof s !== "object" ||
      typeof s === "string"
    )
      return s;
    for (let k in s) {
      if (has(k, "$")) {
        let pKey = `${parentKey}.${k.substring(
          1
        )}`;
        sItem[pKey] = fn(s[k], pKey);
        continue;
      }
      item[k] = s[k];
    }
    return item;
  };

  for (let k in style) sItem[k] = fn(style[k], k);
  serilizedCssStyle.set(style, sItem);
  return sItem;
};

const css_translator =(css?: string, styleFile: any) => {
  if (!css || css.length <= 0) return {};
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
      let value = checkObject(
        checkNumber(splitSafe(c, ":", 1))
      );
      let short = shortk.find(
        x =>
          (has(x.key, k) &&
            k.length === x.key.length) ||
          x.short.toUpperCase()== k.toUpperCase()
      );
      if (short) cssItem[short.key] = value;
      continue;
    }

    let style = CSS[c];
    if(typeof style === "string")
       style = css_translator(style,styleFile);
    if (style) {
      cssItem = {
        ...cssItem,
        ...cleanStyle(style)
      };
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
