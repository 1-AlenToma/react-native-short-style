var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var cachedCss = new Map();
import reactnativeStyles from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
var styleKeys = Object.keys(reactnativeStyles);
/*[
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
];*/
var shortCss = undefined;
var buildShortCss = function () {
    if (shortCss)
        return shortCss;
    shortCss = [];
    for (var _i = 0, styleKeys_1 = styleKeys; _i < styleKeys_1.length; _i++) {
        var k = styleKeys_1[_i];
        var shortKey = null;
        for (var _a = 0, k_1 = k; _a < k_1.length; _a++) {
            var s = k_1[_a];
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
        shortCss.push({ key: k, short: shortKey });
    }
    return shortCss;
};
var splitSafe = function (item, char, index) {
    var vs = item.split(char);
    if (vs.length > index)
        return vs[index].trim();
    return "";
};
var has = function (s, char) {
    return (s &&
        char &&
        s
            .toString()
            .toUpperCase()
            .indexOf(char.toString().toUpperCase()) !==
            -1);
};
var checkNumber = function (value) {
    if (/^(-?)((\d)|((\d)?\.\d))+$/.test(value))
        return eval(value);
    return value;
};
var checkObject = function (value) {
    try {
        if (/\{|\}|\[|\]/g.test(value))
            return eval(value);
    }
    catch (e) { }
    return value;
};
var cleanStyle = function (style, propStyle) {
    var item = __assign({}, style);
    for (var k in style) {
        if (k.trim().startsWith("$") ||
            has(k, ".") ||
            (propStyle && !propStyle[k]))
            delete item[k];
    }
    return item;
};
var cleanKey = function (k, string) {
    return has(k, "$") ? k.substring(1) : k;
};
var serilizedCssStyle = new Map();
var serilizeCssStyle = function (style) {
    if (serilizedCssStyle.has(style))
        return serilizedCssStyle.get(style);
    var sItem = {};
    var fn = function (s, parentKey) {
        var item = {};
        if (typeof s !== "object" ||
            typeof s === "string" ||
            Array.isArray(s))
            return s;
        for (var k in s) {
            if (has(k, "$")) {
                var pKey = parentKey + "." + cleanKey(k);
                sItem[pKey] = fn(s[k], pKey);
                continue;
            }
            item[k] = s[k];
        }
        return item;
    };
    for (var k in style) {
        var ck = cleanKey(k);
        sItem[ck] = fn(style[k], ck);
    }
    serilizedCssStyle.set(style, sItem);
    return sItem;
};
var css_translator = function (css, styleFile, propStyle) {
    if (!css || css.length <= 0)
        return {};
    if (cachedCss.has(css))
        return cachedCss.get(css);
    var shortk = buildShortCss();
    var CSS = {};
    if (styleFile)
        CSS = serilizeCssStyle(styleFile);
    var cssItem = {};
    var _loop_1 = function (c) {
        if (has(c, ":")) {
            var k_2 = splitSafe(c, ":", 0);
            var value = checkObject(checkNumber(splitSafe(c, ":", 1)));
            if (has(value, "undefined") ||
                has(value, "null"))
                value = undefined;
            var short = shortk.find(function (x) {
                return (has(x.key, k_2) &&
                    k_2.length === x.key.length) ||
                    x.short.toUpperCase() == k_2.toUpperCase();
            });
            if (short) {
                if (!propStyle || propStyle[short.key])
                    cssItem[short.key] = value;
            }
            return "continue";
        }
        var style = CSS[c];
        if (typeof style === "string")
            style = css_translator(style, styleFile);
        if (style) {
            cssItem = __assign(__assign({}, cssItem), cleanStyle(style, propStyle));
            return "continue";
        }
    };
    for (var _i = 0, _a = css
        .split(" ")
        .filter(function (x) { return x.trim().length > 0; }); _i < _a.length; _i++) {
        var c = _a[_i];
        _loop_1(c);
    }
    cachedCss.set(css, cssItem);
    /*console.error(
      JSON.stringify({ css, cssItem, CSS }, null, 4)
    );*/
    return cssItem;
};
export default css_translator;
//# sourceMappingURL=cssTranslator.js.map