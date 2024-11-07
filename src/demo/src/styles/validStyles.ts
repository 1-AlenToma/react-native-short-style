import { StyleSheet, ViewStyle, TextStyle, ImageStyle, ColorValue, Animated } from "react-native";
import { flatStyle } from "../config/CSSMethods";
import { defaultTheme } from "../theme/DefaultStyle";
type ValueType = ViewStyle & TextStyle & ImageStyle;
type Colors<K extends string> = `${K}-${keyof typeof defaultTheme.color}` | (string & {})
type BackgroundColors<K extends string> = `${K}-${keyof typeof defaultTheme.backgroundColor}` | (string & {})
type FontSizes = `$fos-${keyof typeof defaultTheme.fontSize}` | (ValueType["fontSize"] & {}) | (string & {})
type BorderRadius = `$bor-${keyof typeof defaultTheme.borderRadius}` | (number & {});
type Spacing = `$sp-${keyof typeof defaultTheme.spacing}` | (ValueType["letterSpacing"] & {})

//let test: BorderRadius =98

type classNames = (`sh-${keyof typeof defaultTheme.shadow}` | `sp-${keyof typeof defaultTheme.spacing}`) | (string & {})

export const StylesAttributes = [
  "alignContent",
  "alignItems",
  "alignSelf",
  "aspectRatio",
  "backfaceVisibility",
  "backgroundColor",
  "borderBottomColor",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderBottomWidth",
  "borderColor",
  "borderLeftColor",
  "borderLeftWidth",
  "borderRadius",
  "borderRightColor",
  "borderRightWidth",
  "borderStyle",
  "borderTopColor",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderTopWidth",
  "borderWidth",
  "bottom",
  "color",
  "decomposedMatrix",
  "direction",
  "display",
  "elevation",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "height",
  "includeFontPadding",
  "justifyContent",
  "left",
  "letterSpacing",
  "lineHeight",
  "margin",
  "marginBottom",
  "marginHorizontal",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marginVertical",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "opacity",
  "overflow",
  "overlayColor",
  "padding",
  "paddingBottom",
  "paddingHorizontal",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingVertical",
  "position",
  "resizeMode",
  "right",
  "rotation",
  "scaleX",
  "scaleY",
  "shadowColor",
  "shadowOffset",
  "shadowOpacity",
  "shadowRadius",
  "textAlign",
  "textAlignVertical",
  "textDecorationColor",
  "textDecorationLine",
  "textDecorationStyle",
  "textShadowColor",
  "textShadowOffset",
  "textShadowRadius",
  "tintColor",
  "top",
  "transform",
  "transformMatrix",
  "translateX",
  "translateY",
  "width",
  "writingDirection",
  "zIndex"
]

export const ShortCSS = [
  {
    "key": "alignContent",
    "alignContent": "alignContent",
    "aligncontent": "alignContent",
    "alc": "alignContent"
  },
  {
    "key": "alignItems",
    "alignItems": "alignItems",
    "alignitems": "alignItems",
    "ali": "alignItems"
  },
  {
    "key": "alignSelf",
    "alignSelf": "alignSelf",
    "alignself": "alignSelf",
    "als": "alignSelf"
  },
  {
    "key": "aspectRatio",
    "aspectRatio": "aspectRatio",
    "aspectratio": "aspectRatio",
    "asr": "aspectRatio"
  },
  {
    "key": "backfaceVisibility",
    "backfaceVisibility": "backfaceVisibility",
    "backfacevisibility": "backfaceVisibility",
    "bav": "backfaceVisibility"
  },
  {
    "key": "backgroundColor",
    "backgroundColor": "backgroundColor",
    "backgroundcolor": "backgroundColor",
    "bac": "backgroundColor"
  },
  {
    "key": "borderBottomColor",
    "borderBottomColor": "borderBottomColor",
    "borderbottomcolor": "borderBottomColor",
    "bobc": "borderBottomColor"
  },
  {
    "key": "borderBottomLeftRadius",
    "borderBottomLeftRadius": "borderBottomLeftRadius",
    "borderbottomleftradius": "borderBottomLeftRadius",
    "boblr": "borderBottomLeftRadius"
  },
  {
    "key": "borderBottomRightRadius",
    "borderBottomRightRadius": "borderBottomRightRadius",
    "borderbottomrightradius": "borderBottomRightRadius",
    "bobrr": "borderBottomRightRadius"
  },
  {
    "key": "borderBottomWidth",
    "borderBottomWidth": "borderBottomWidth",
    "borderbottomwidth": "borderBottomWidth",
    "bobw": "borderBottomWidth"
  },
  {
    "key": "borderColor",
    "borderColor": "borderColor",
    "bordercolor": "borderColor",
    "boc": "borderColor"
  },
  {
    "key": "borderLeftColor",
    "borderLeftColor": "borderLeftColor",
    "borderleftcolor": "borderLeftColor",
    "bolc": "borderLeftColor"
  },
  {
    "key": "borderLeftWidth",
    "borderLeftWidth": "borderLeftWidth",
    "borderleftwidth": "borderLeftWidth",
    "bolw": "borderLeftWidth"
  },
  {
    "key": "borderRadius",
    "borderRadius": "borderRadius",
    "borderradius": "borderRadius",
    "bor": "borderRadius"
  },
  {
    "key": "borderRightColor",
    "borderRightColor": "borderRightColor",
    "borderrightcolor": "borderRightColor",
    "borc": "borderRightColor"
  },
  {
    "key": "borderRightWidth",
    "borderRightWidth": "borderRightWidth",
    "borderrightwidth": "borderRightWidth",
    "borw": "borderRightWidth"
  },
  {
    "key": "borderStyle",
    "borderStyle": "borderStyle",
    "borderstyle": "borderStyle",
    "bos": "borderStyle"
  },
  {
    "key": "borderTopColor",
    "borderTopColor": "borderTopColor",
    "bordertopcolor": "borderTopColor",
    "botc": "borderTopColor"
  },
  {
    "key": "borderTopLeftRadius",
    "borderTopLeftRadius": "borderTopLeftRadius",
    "bordertopleftradius": "borderTopLeftRadius",
    "botlr": "borderTopLeftRadius"
  },
  {
    "key": "borderTopRightRadius",
    "borderTopRightRadius": "borderTopRightRadius",
    "bordertoprightradius": "borderTopRightRadius",
    "botrr": "borderTopRightRadius"
  },
  {
    "key": "borderTopWidth",
    "borderTopWidth": "borderTopWidth",
    "bordertopwidth": "borderTopWidth",
    "botw": "borderTopWidth"
  },
  {
    "key": "borderWidth",
    "borderWidth": "borderWidth",
    "borderwidth": "borderWidth",
    "bow": "borderWidth"
  },
  {
    "key": "bottom",
    "bottom": "bottom",
    "bo": "bottom"
  },
  {
    "key": "color",
    "color": "color",
    "co": "color"
  },
  {
    "key": "decomposedMatrix",
    "decomposedMatrix": "decomposedMatrix",
    "decomposedmatrix": "decomposedMatrix",
    "dem": "decomposedMatrix"
  },
  {
    "key": "direction",
    "direction": "direction",
    "dir": "direction"
  },
  {
    "key": "display",
    "display": "display",
    "di": "display"
  },
  {
    "key": "elevation",
    "elevation": "elevation",
    "el": "elevation"
  },
  {
    "key": "flex",
    "flex": "flex",
    "fl": "flex"
  },
  {
    "key": "flexBasis",
    "flexBasis": "flexBasis",
    "flexbasis": "flexBasis",
    "flb": "flexBasis"
  },
  {
    "key": "flexDirection",
    "flexDirection": "flexDirection",
    "flexdirection": "flexDirection",
    "fld": "flexDirection"
  },
  {
    "key": "flexGrow",
    "flexGrow": "flexGrow",
    "flexgrow": "flexGrow",
    "flg": "flexGrow"
  },
  {
    "key": "flexShrink",
    "flexShrink": "flexShrink",
    "flexshrink": "flexShrink",
    "fls": "flexShrink"
  },
  {
    "key": "flexWrap",
    "flexWrap": "flexWrap",
    "flexwrap": "flexWrap",
    "flw": "flexWrap"
  },
  {
    "key": "fontFamily",
    "fontFamily": "fontFamily",
    "fontfamily": "fontFamily",
    "fof": "fontFamily"
  },
  {
    "key": "fontSize",
    "fontSize": "fontSize",
    "fontsize": "fontSize",
    "fos": "fontSize"
  },
  {
    "key": "fontStyle",
    "fontStyle": "fontStyle",
    "fontstyle": "fontStyle"
  },
  {
    "key": "fontVariant",
    "fontVariant": "fontVariant",
    "fontvariant": "fontVariant",
    "fov": "fontVariant"
  },
  {
    "key": "fontWeight",
    "fontWeight": "fontWeight",
    "fontweight": "fontWeight",
    "fow": "fontWeight"
  },
  {
    "key": "height",
    "height": "height",
    "he": "height"
  },
  {
    "key": "includeFontPadding",
    "includeFontPadding": "includeFontPadding",
    "includefontpadding": "includeFontPadding",
    "infp": "includeFontPadding"
  },
  {
    "key": "justifyContent",
    "justifyContent": "justifyContent",
    "justifycontent": "justifyContent",
    "juc": "justifyContent"
  },
  {
    "key": "left",
    "left": "left",
    "le": "left"
  },
  {
    "key": "letterSpacing",
    "letterSpacing": "letterSpacing",
    "letterspacing": "letterSpacing",
    "les": "letterSpacing"
  },
  {
    "key": "lineHeight",
    "lineHeight": "lineHeight",
    "lineheight": "lineHeight",
    "lih": "lineHeight"
  },
  {
    "key": "margin",
    "margin": "margin",
    "ma": "margin"
  },
  {
    "key": "marginBottom",
    "marginBottom": "marginBottom",
    "marginbottom": "marginBottom",
    "mab": "marginBottom"
  },
  {
    "key": "marginHorizontal",
    "marginHorizontal": "marginHorizontal",
    "marginhorizontal": "marginHorizontal",
    "maho": "marginHorizontal"
  },
  {
    "key": "marginLeft",
    "marginLeft": "marginLeft",
    "marginleft": "marginLeft",
    "mal": "marginLeft"
  },
  {
    "key": "marginRight",
    "marginRight": "marginRight",
    "marginright": "marginRight",
    "mar": "marginRight"
  },
  {
    "key": "marginTop",
    "marginTop": "marginTop",
    "margintop": "marginTop",
    "mat": "marginTop"
  },
  {
    "key": "marginVertical",
    "marginVertical": "marginVertical",
    "marginvertical": "marginVertical",
    "mav": "marginVertical"
  },
  {
    "key": "maxHeight",
    "maxHeight": "maxHeight",
    "maxheight": "maxHeight",
    "mah": "maxHeight"
  },
  {
    "key": "maxWidth",
    "maxWidth": "maxWidth",
    "maxwidth": "maxWidth",
    "maw": "maxWidth"
  },
  {
    "key": "minHeight",
    "minHeight": "minHeight",
    "minheight": "minHeight",
    "mih": "minHeight"
  },
  {
    "key": "minWidth",
    "minWidth": "minWidth",
    "minwidth": "minWidth",
    "miw": "minWidth"
  },
  {
    "key": "opacity",
    "opacity": "opacity",
    "op": "opacity"
  },
  {
    "key": "overflow",
    "overflow": "overflow",
    "ov": "overflow"
  },
  {
    "key": "overlayColor",
    "overlayColor": "overlayColor",
    "overlaycolor": "overlayColor",
    "ovc": "overlayColor"
  },
  {
    "key": "padding",
    "padding": "padding",
    "pa": "padding"
  },
  {
    "key": "paddingBottom",
    "paddingBottom": "paddingBottom",
    "paddingbottom": "paddingBottom",
    "pab": "paddingBottom"
  },
  {
    "key": "paddingHorizontal",
    "paddingHorizontal": "paddingHorizontal",
    "paddinghorizontal": "paddingHorizontal",
    "pah": "paddingHorizontal"
  },
  {
    "key": "paddingLeft",
    "paddingLeft": "paddingLeft",
    "paddingleft": "paddingLeft",
    "pal": "paddingLeft"
  },
  {
    "key": "paddingRight",
    "paddingRight": "paddingRight",
    "paddingright": "paddingRight",
    "par": "paddingRight"
  },
  {
    "key": "paddingTop",
    "paddingTop": "paddingTop",
    "paddingtop": "paddingTop",
    "pat": "paddingTop"
  },
  {
    "key": "paddingVertical",
    "paddingVertical": "paddingVertical",
    "paddingvertical": "paddingVertical",
    "pav": "paddingVertical"
  },
  {
    "key": "position",
    "position": "position",
    "po": "position"
  },
  {
    "key": "resizeMode",
    "resizeMode": "resizeMode",
    "resizemode": "resizeMode",
    "rem": "resizeMode"
  },
  {
    "key": "right",
    "right": "right",
    "ri": "right"
  },
  {
    "key": "rotation",
    "rotation": "rotation",
    "ro": "rotation"
  },
  {
    "key": "scaleX",
    "scaleX": "scaleX",
    "scalex": "scaleX",
    "scx": "scaleX"
  },
  {
    "key": "scaleY",
    "scaleY": "scaleY",
    "scaley": "scaleY",
    "scy": "scaleY"
  },
  {
    "key": "shadowColor",
    "shadowColor": "shadowColor",
    "shadowcolor": "shadowColor",
    "shc": "shadowColor"
  },
  {
    "key": "shadowOffset",
    "shadowOffset": "shadowOffset",
    "shadowoffset": "shadowOffset"
  },
  {
    "key": "shadowOpacity",
    "shadowOpacity": "shadowOpacity",
    "shadowopacity": "shadowOpacity",
    "sho": "shadowOpacity"
  },
  {
    "key": "shadowRadius",
    "shadowRadius": "shadowRadius",
    "shadowradius": "shadowRadius",
    "shr": "shadowRadius"
  },
  {
    "key": "textAlign",
    "textAlign": "textAlign",
    "textalign": "textAlign",
    "tea": "textAlign"
  },
  {
    "key": "textAlignVertical",
    "textAlignVertical": "textAlignVertical",
    "textalignvertical": "textAlignVertical",
    "teav": "textAlignVertical"
  },
  {
    "key": "textDecorationColor",
    "textDecorationColor": "textDecorationColor",
    "textdecorationcolor": "textDecorationColor",
    "tedc": "textDecorationColor"
  },
  {
    "key": "textDecorationLine",
    "textDecorationLine": "textDecorationLine",
    "textdecorationline": "textDecorationLine",
    "tedl": "textDecorationLine"
  },
  {
    "key": "textDecorationStyle",
    "textDecorationStyle": "textDecorationStyle",
    "textdecorationstyle": "textDecorationStyle",
    "teds": "textDecorationStyle"
  },
  {
    "key": "textShadowColor",
    "textShadowColor": "textShadowColor",
    "textshadowcolor": "textShadowColor",
    "tesc": "textShadowColor"
  },
  {
    "key": "textShadowOffset",
    "textShadowOffset": "textShadowOffset",
    "textshadowoffset": "textShadowOffset",
    "teso": "textShadowOffset"
  },
  {
    "key": "textShadowRadius",
    "textShadowRadius": "textShadowRadius",
    "textshadowradius": "textShadowRadius",
    "tesr": "textShadowRadius"
  },
  {
    "key": "tintColor",
    "tintColor": "tintColor",
    "tintcolor": "tintColor",
    "tic": "tintColor"
  },
  {
    "key": "top",
    "top": "top",
    "to": "top"
  },
  {
    "key": "transform",
    "transform": "transform",
    "tr": "transform"
  },
  {
    "key": "transformMatrix",
    "transformMatrix": "transformMatrix",
    "transformmatrix": "transformMatrix",
    "trm": "transformMatrix"
  },
  {
    "key": "translateX",
    "translateX": "translateX",
    "translatex": "translateX",
    "trx": "translateX"
  },
  {
    "key": "translateY",
    "translateY": "translateY",
    "translatey": "translateY",
    "try": "translateY"
  },
  {
    "key": "width",
    "width": "width",
    "wi": "width"
  },
  {
    "key": "writingDirection",
    "writingDirection": "writingDirection",
    "writingdirection": "writingDirection",
    "wrd": "writingDirection"
  },
  {
    "key": "zIndex",
    "zIndex": "zIndex",
    "zindex": "zIndex",
    "zi": "zIndex"
  },
  {
    "key": "textTransform",
    "textTransform": "textTransform",
    "texttransform": "textTransform",
    "tt": "textTransform"
  }
]

export const ShortStyles = {
  "textTransform": "textTransform",
  "alignContent": " alignContent:",
  "alC": " alignContent:",
  "alignItems": " alignItems:",
  "alI": " alignItems:",
  "alignSelf": " alignSelf:",
  "alS": " alignSelf:",
  "aspectRatio": " aspectRatio:",
  "asR": " aspectRatio:",
  "backfaceVisibility": " backfaceVisibility:",
  "baV": " backfaceVisibility:",
  "backgroundColor": " backgroundColor:",
  "baC": " backgroundColor:",
  "borderBottomColor": " borderBottomColor:",
  "boBC": " borderBottomColor:",
  "borderBottomLeftRadius": " borderBottomLeftRadius:",
  "boBLR": " borderBottomLeftRadius:",
  "borderBottomRightRadius": " borderBottomRightRadius:",
  "boBRR": " borderBottomRightRadius:",
  "borderBottomWidth": " borderBottomWidth:",
  "boBW": " borderBottomWidth:",
  "borderColor": " borderColor:",
  "boC": " borderColor:",
  "borderLeftColor": " borderLeftColor:",
  "boLC": " borderLeftColor:",
  "borderLeftWidth": " borderLeftWidth:",
  "boLW": " borderLeftWidth:",
  "borderRadius": " borderRadius:",
  "boR": " borderRadius:",
  "borderRightColor": " borderRightColor:",
  "boRC": " borderRightColor:",
  "borderRightWidth": " borderRightWidth:",
  "boRW": " borderRightWidth:",
  "borderStyle": " borderStyle:",
  "boS": " borderStyle:",
  "borderTopColor": " borderTopColor:",
  "boTC": " borderTopColor:",
  "borderTopLeftRadius": " borderTopLeftRadius:",
  "boTLR": " borderTopLeftRadius:",
  "borderTopRightRadius": " borderTopRightRadius:",
  "boTRR": " borderTopRightRadius:",
  "borderTopWidth": " borderTopWidth:",
  "boTW": " borderTopWidth:",
  "borderWidth": " borderWidth:",
  "boW": " borderWidth:",
  "bottom": " bottom:",
  "bo": " bottom:",
  "color": " color:",
  "co": " color:",
  "decomposedMatrix": " decomposedMatrix:",
  "deM": " decomposedMatrix:",
  "direction": " direction:",
  "dir": " direction:",
  "display": " display:",
  "di": " display:",
  "elevation": " elevation:",
  "el": " elevation:",
  "flex": " flex:",
  "fl": " flex:",
  "flexBasis": " flexBasis:",
  "flB": " flexBasis:",
  "flexDirection": " flexDirection:",
  "flD": " flexDirection:",
  "flexGrow": " flexGrow:",
  "flG": " flexGrow:",
  "flexShrink": " flexShrink:",
  "flS": " flexShrink:",
  "flexWrap": " flexWrap:",
  "flW": " flexWrap:",
  "fontFamily": " fontFamily:",
  "foF": " fontFamily:",
  "fontSize": " fontSize:",
  "foS": " fontStyle:",
  "fontStyle": " fontStyle:",
  "fontVariant": " fontVariant:",
  "foV": " fontVariant:",
  "fontWeight": " fontWeight:",
  "foW": " fontWeight:",
  "height": " height:",
  "he": " height:",
  "includeFontPadding": " includeFontPadding:",
  "inFP": " includeFontPadding:",
  "justifyContent": " justifyContent:",
  "juC": " justifyContent:",
  "left": " left:",
  "le": " left:",
  "letterSpacing": " letterSpacing:",
  "leS": " letterSpacing:",
  "lineHeight": " lineHeight:",
  "liH": " lineHeight:",
  "margin": " margin:",
  "ma": " margin:",
  "marginBottom": " marginBottom:",
  "maB": " marginBottom:",
  "marginHorizontal": " marginHorizontal:",
  "maHo": " marginHorizontal:",
  "marginLeft": " marginLeft:",
  "maL": " marginLeft:",
  "marginRight": " marginRight:",
  "maR": " marginRight:",
  "marginTop": " marginTop:",
  "maT": " marginTop:",
  "marginVertical": " marginVertical:",
  "maV": " marginVertical:",
  "maxHeight": " maxHeight:",
  "maH": " maxHeight:",
  "maxWidth": " maxWidth:",
  "maW": " maxWidth:",
  "minHeight": " minHeight:",
  "miH": " minHeight:",
  "minWidth": " minWidth:",
  "miW": " minWidth:",
  "opacity": " opacity:",
  "op": " opacity:",
  "overflow": " overflow:",
  "ov": " overflow:",
  "overlayColor": " overlayColor:",
  "ovC": " overlayColor:",
  "padding": " padding:",
  "pa": " padding:",
  "paddingBottom": " paddingBottom:",
  "paB": " paddingBottom:",
  "paddingHorizontal": " paddingHorizontal:",
  "paH": " paddingHorizontal:",
  "paddingLeft": " paddingLeft:",
  "paL": " paddingLeft:",
  "paddingRight": " paddingRight:",
  "paR": " paddingRight:",
  "paddingTop": " paddingTop:",
  "paT": " paddingTop:",
  "paddingVertical": " paddingVertical:",
  "paV": " paddingVertical:",
  "position": " position:",
  "po": " position:",
  "resizeMode": " resizeMode:",
  "reM": " resizeMode:",
  "right": " right:",
  "ri": " right:",
  "rotation": " rotation:",
  "ro": " rotation:",
  "scaleX": " scaleX:",
  "scX": " scaleX:",
  "scaleY": " scaleY:",
  "scY": " scaleY:",
  "shadowColor": " shadowColor:",
  "shC": " shadowColor:",
  "shadowOffset": " shadowOffset:",
  "shO": " shadowOpacity:",
  "shadowOpacity": " shadowOpacity:",
  "shadowRadius": " shadowRadius:",
  "shR": " shadowRadius:",
  "textAlign": " textAlign:",
  "teA": " textAlign:",
  "textAlignVertical": " textAlignVertical:",
  "teAV": " textAlignVertical:",
  "textDecorationColor": " textDecorationColor:",
  "teDC": " textDecorationColor:",
  "textDecorationLine": " textDecorationLine:",
  "teDL": " textDecorationLine:",
  "textDecorationStyle": " textDecorationStyle:",
  "teDS": " textDecorationStyle:",
  "textShadowColor": " textShadowColor:",
  "teSC": " textShadowColor:",
  "textShadowOffset": " textShadowOffset:",
  "teSO": " textShadowOffset:",
  "textShadowRadius": " textShadowRadius:",
  "teSR": " textShadowRadius:",
  "tintColor": " tintColor:",
  "tiC": " tintColor:",
  "top": " top:",
  "to": " top:",
  "transform": " transform:",
  "tr": " transform:",
  "transformMatrix": " transformMatrix:",
  "trM": " transformMatrix:",
  "translateX": " translateX:",
  "trX": " translateX:",
  "translateY": " translateY:",
  "trY": " translateY:",
  "width": " width:",
  "wi": " width:",
  "writingDirection": " writingDirection:",
  "wrD": " writingDirection:",
  "zIndex": " zIndex:",
  "zI": " zIndex:"
}



export abstract class ExtraCssStyle {
  value: string = "";
  type: string = "CSSStyled";

  /** Add classNames  eg container*/
  classNames(...cls: classNames[]) {
    cls.forEach(x => {
      if (x)
        this.value += ` ${x}`;
    });

    return this;
  }

  /** Add classNames  eg container*/
  cls(...cls: classNames[]) {

    cls.forEach(x => {
      if (x)
        this.value += ` ${x}`;
    });

    return this;
  }

  /** Add unknown prop eg color, #FFF */
  add(key: string, value?: any | null) {
    if (value == undefined)
      value = "undefined";
    if (value === null)
      value = "null";

    this.value += ` ${key.trim()}${key.endsWith(":") ? "" : ":"}${value}`;
    return this;
  }
  /** height and width = 100% */
  fillView() {
    return this.size("100%", "100%");
  }

  /** Add with and height of the View */
  size(width: ValueType["width"], height?: ValueType["height"]) {
    this.add(ShortStyles.width, width);
    if (height != undefined)
      this.add(ShortStyles.height, height);

    return this;
  }

  /**
    * 
    * x: 25px 50px 75px 100px;
  -----------------
      top x is 25px
  
      right x is 50px
  
      bottom x is 75px
  
      left x is 100px
  
    * x: 25px 50px 75px;
  -----------------
      top x is 25px
  
      right and left x are 50px
  
      bottom x is 75px
  
    * x: 25px 50px;
  -----------------
      top and bottom x are 25px
  
      right and left x are 50px
    */
  padding(v1: ValueType["paddingLeft"], v2?: ValueType["paddingLeft"], v3?: ValueType["paddingLeft"], v4?: ValueType["paddingLeft"]) {
    if (v1 != undefined && v2 == undefined && v3 == undefined && v4 == undefined)
      return this.add(ShortStyles.padding, v1)
    if (v1 != undefined && v2 != undefined && v3 != undefined && v4 != undefined)
      return this.add(ShortStyles.paddingTop, v1).add(ShortStyles.paddingRight, v2).add(ShortStyles.paddingBottom, v3).add(ShortStyles.paddingLeft, v4);
    if (v1 != undefined && v2 != undefined && v3 != undefined)
      return this.add(ShortStyles.paddingTop, v1).add(ShortStyles.paddingRight, v2).add(ShortStyles.paddingBottom, v3).add(ShortStyles.paddingLeft, v2);

    if (v1 != undefined && v2 != undefined)
      return this.add(ShortStyles.paddingTop, v1).add(ShortStyles.paddingRight, v2).add(ShortStyles.paddingBottom, v1).add(ShortStyles.paddingLeft, v2);
    return this;
  }

  /**
 * read https://www.w3schools.com/css/css_padding.asp on how this is used
 */
  pa(v1: ValueType["paddingLeft"], v2?: ValueType["paddingLeft"], v3?: ValueType["paddingLeft"], v4?: ValueType["paddingLeft"]) {
    return this.padding(v1, v2, v3, v4);
  }


  /**
    * 
    * x: 25px 50px 75px 100px;
  -----------------
      top x is 25px
  
      right x is 50px
  
      bottom x is 75px
  
      left x is 100px
  
    * x: 25px 50px 75px;
  -----------------
      top x is 25px
  
      right and left x are 50px
  
      bottom x is 75px
  
    * x: 25px 50px;
  -----------------
      top and bottom x are 25px
  
      right and left x are 50px
    */
  margin(v1: ValueType["margin"], v2?: ValueType["margin"], v3?: ValueType["margin"], v4?: ValueType["margin"]) {
    if (v1 != undefined && v2 == undefined && v3 == undefined && v4 == undefined)
      return this.add(ShortStyles.margin, v1)
    if (v1 != undefined && v2 != undefined && v3 != undefined && v4 != undefined)
      return this.add(ShortStyles.marginTop, v1).add(ShortStyles.marginRight, v2).add(ShortStyles.marginBottom, v3).add(ShortStyles.marginLeft, v4);
    if (v1 != undefined && v2 != undefined && v3 != undefined)
      return this.add(ShortStyles.marginTop, v1).add(ShortStyles.marginRight, v2).add(ShortStyles.marginBottom, v3).add(ShortStyles.marginLeft, v2);

    if (v1 != undefined && v2 != undefined)
      return this.add(ShortStyles.marginTop, v1).add(ShortStyles.marginRight, v2).add(ShortStyles.marginBottom, v1).add(ShortStyles.marginLeft, v2);
    return this;
  }

  /**
    * 
    * x: 25px 50px 75px 100px;
  -----------------
      top x is 25px
  
      right x is 50px
  
      bottom x is 75px
  
      left x is 100px
  
    * x: 25px 50px 75px;
  -----------------
      top x is 25px
  
      right and left x are 50px
  
      bottom x is 75px
  
    * x: 25px 50px;
  -----------------
      top and bottom x are 25px
  
      right and left x are 50px
    */
  ma(v1: ValueType["margin"], v2?: ValueType["margin"], v3?: ValueType["margin"], v4?: ValueType["margin"]) {
    return this.margin(v1, v2, v3, v4);
  }


  /**
  * 
  * x: 25px 50px 75px 100px;
-----------------
    top x is 25px

    right x is 50px

    bottom x is 75px

    left x is 100px

  * x: 25px 50px 75px;
-----------------
    top x is 25px

    right and left x are 50px

    bottom x is 75px

  * x: 25px 50px;
-----------------
    top and bottom x are 25px

    right and left x are 50px
  */
  positions(v1: ValueType["top"], v2: ValueType["top"], v3?: ValueType["top"], v4?: ValueType["top"]) {
    if (v1 != undefined && v2 != undefined && v3 != undefined && v4 != undefined)
      return this.add(ShortStyles.top, v1).add(ShortStyles.right, v2).add(ShortStyles.bottom, v3).add(ShortStyles.left, v4);
    if (v1 != undefined && v2 != undefined && v3 != undefined)
      return this.add(ShortStyles.top, v1).add(ShortStyles.right, v2).add(ShortStyles.bottom, v3).add(ShortStyles.left, v2);

    if (v1 != undefined && v2 != undefined)
      return this.add(ShortStyles.top, v1).add(ShortStyles.right, v2).add(ShortStyles.bottom, v1).add(ShortStyles.left, v2);
    return this;
  }

  /**
  * 
  * x: 25px 50px 75px 100px;
-----------------
    top x is 25px

    right x is 50px

    bottom x is 75px

    left x is 100px

  * x: 25px 50px 75px;
-----------------
    top x is 25px

    right and left x are 50px

    bottom x is 75px

  * x: 25px 50px;
-----------------
    top and bottom x are 25px

    right and left x are 50px
  */
  pos(v1: ValueType["top"], v2: ValueType["top"], v3?: ValueType["top"], v4?: ValueType["top"]) {
    return this.positions(v1, v2, v3, v4);
  }


  /** Add css value with conditions */
  if(value: boolean | Function | undefined | null, $this: ((x: CSSStyle) => CSSStyle), $else?: ((x: CSSStyle) => CSSStyle)) {
    if (value && typeof value == "function")
      value = value();
    if (value)
      return $this(this as any as CSSStyle);
    else if ($else)
      return $else(this as any as CSSStyle);
    return this;
  }

  joinLeft(value: CSSStyle | string | ViewStyle | ImageStyle | TextStyle | ((x: CSSStyle) => CSSStyle)) {
    if (value && typeof value == "function") {
      value = (value as Function)(new CSSStyle());
    }
    if (value && typeof value == "object" && (value as CSSStyle).type == this.type) {
      this.value = `${(value as CSSStyle).value} ${this.value}`;
    } else if (value && typeof value == "object") {
      let css = ""
      let style = flatStyle(value);
      for (let key in style) {
        let v = style[key]
        if (v == undefined)
          css += ` ${key}:undefined`;
        else if (v === null)
          css += ` ${key}:null`;
        else if (typeof v === "object") {
          console.warn("CSSStyle cannot join object, value", v)
          continue;
        } else
          css += ` ${key}:${v}`;
      }

      value = css;
    }

    if (value && typeof value == "string") {
      this.value = `${value} ${this.value}`;
    }

    return this;
  }

  joinRight(value: CSSStyle | string | ViewStyle | ImageStyle | TextStyle | ((x: CSSStyle) => CSSStyle)) {
    if (value && typeof value == "function") {
      value = (value as Function)(new CSSStyle());
    }

    if (value && typeof value == "object" && (value as CSSStyle).type == this.type) {
      this.value = `${(value as CSSStyle).value} ${this.value}`;
    } else if (value && typeof value == "object") {
      let css = ""
      let style = flatStyle(value);
      for (let key in style) {
        let v = style[key]
        if (v == undefined)
          css += ` ${key}:undefined`;
        else if (v === null)
          css += ` ${key}:null`;
        else if (typeof v === "object") {
          console.warn("CSSStyle cannot join object, value", v)
          continue;
        } else
          css += ` ${key}:${v}`;
      }

      value = css;
    }


    if (value && typeof value == "string") {
      this.value = `${this.value} ${value}`;
    }

    return this;
  }

}

export class CSSStyle extends ExtraCssStyle {

  textTransform(value: ValueType["textTransform"]) {
    return this.add(ShortStyles.textTransform, value);
  }

  tt(value: ValueType["textTransform"]) {
    return this.textTransform(value);
  }

  public toString = (): string => {
    return this.value;
  }


  alignContent(value?: ValueType["alignContent"] | null) {
    return this.add(ShortStyles.alignContent, value);
  }

  /** Add alignContent */
  alC(value?: ValueType["alignContent"] | null) {
    return this.add(ShortStyles.alignContent, value);
  }

  alignItems(value?: ValueType["alignItems"] | null) {
    return this.add(ShortStyles.alignItems, value);
  }

  /** Add alignItems */
  alI(value?: ValueType["alignItems"] | null) {
    return this.add(ShortStyles.alignItems, value);
  }

  alignSelf(value?: ValueType["alignSelf"] | null) {
    return this.add(ShortStyles.alignSelf, value);
  }

  /** Add alignSelf */
  alS(value?: ValueType["alignSelf"] | null) {
    return this.add(ShortStyles.alignSelf, value);
  }

  aspectRatio(value?: ValueType["aspectRatio"] | null) {
    return this.add(ShortStyles.aspectRatio, value);
  }

  /** Add aspectRatio */
  asR(value?: ValueType["aspectRatio"] | null) {
    return this.add(ShortStyles.aspectRatio, value);
  }

  backfaceVisibility(value?: ValueType["backfaceVisibility"] | null) {
    return this.add(ShortStyles.backfaceVisibility, value);
  }

  /** Add backfaceVisibility */
  baV(value?: ValueType["backfaceVisibility"] | null) {
    return this.add(ShortStyles.backfaceVisibility, value);
  }

  backgroundColor(value?: BackgroundColors<"$baC"> | null) {
    return this.add(ShortStyles.backgroundColor, value);
  }

  /** Add backgroundColor */
  baC(value?: BackgroundColors<"$baC"> | null) {
    return this.backgroundColor(value);
  }

  borderBottomColor(value?: Colors<"$bobc"> | null) {
    return this.add(ShortStyles.borderBottomColor, value);
  }

  /** Add borderBottomColor */
  boBC(value?: Colors<"$bobc"> | null) {
    return this.borderBottomColor(value)
  }

  borderBottomLeftRadius(value?: ValueType["borderBottomLeftRadius"] | null) {
    return this.add(ShortStyles.borderBottomLeftRadius, value);
  }

  /** Add borderBottomLeftRadius */
  boBLR(value?: ValueType["borderBottomLeftRadius"] | null) {
    return this.add(ShortStyles.borderBottomLeftRadius, value);
  }

  borderBottomRightRadius(value?: ValueType["borderBottomRightRadius"] | null) {
    return this.add(ShortStyles.borderBottomRightRadius, value);
  }

  /** Add borderBottomRightRadius */
  boBRR(value?: ValueType["borderBottomRightRadius"] | null) {
    return this.add(ShortStyles.borderBottomRightRadius, value);
  }

  borderBottomWidth(value?: ValueType["borderBottomWidth"] | null) {
    return this.add(ShortStyles.borderBottomWidth, value);
  }

  /** Add borderBottomWidth */
  boBW(value?: ValueType["borderBottomWidth"] | null) {
    return this.add(ShortStyles.borderBottomWidth, value);
  }

  borderColor(value?: Colors<"$boc"> | null) {
    return this.add(ShortStyles.borderColor, value);
  }

  /** Add borderColor */
  boC(value?: Colors<"$boc"> | null) {
    return this.borderColor(value)
  }

  borderLeftColor(value?: Colors<"$bolc"> | null) {
    return this.add(ShortStyles.borderLeftColor, value);
  }

  /** Add borderLeftColor */
  boLC(value?: Colors<"$bolc"> | null) {
    return this.borderLeftColor(value)
  }

  borderLeftWidth(value?: ValueType["borderLeftWidth"] | null) {
    return this.add(ShortStyles.borderLeftWidth, value);
  }

  /** Add borderLeftWidth */
  boLW(value?: ValueType["borderLeftWidth"] | null) {
    return this.add(ShortStyles.borderLeftWidth, value);
  }

  borderRadius(value?: BorderRadius | null) {
    if (value && typeof value == "string" && value.startsWith("$"))
      return this.classNames(value.substring(1))
    return this.add(ShortStyles.borderRadius, value);
  }

  /** Add borderRadius */
  boR(value?: BorderRadius | null) {
    return this.borderRadius(value);
  }

  borderRightColor(value?: Colors<"$boRc"> | null) {
    return this.add(ShortStyles.borderRightColor, value);
  }

  /** Add borderRightColor */
  boRC(value?: Colors<"$boRc"> | null) {
    return this.borderRightColor(value)
  }

  borderRightWidth(value?: ValueType["borderRightWidth"] | null) {
    return this.add(ShortStyles.borderRightWidth, value);
  }

  /** Add borderRightWidth */
  boRW(value?: ValueType["borderRightWidth"] | null) {
    return this.add(ShortStyles.borderRightWidth, value);
  }

  borderStyle(value?: ValueType["borderStyle"] | null) {
    return this.add(ShortStyles.borderStyle, value);
  }

  /** Add borderStyle */
  boS(value?: ValueType["borderStyle"] | null) {
    return this.add(ShortStyles.borderStyle, value);
  }

  borderTopColor(value?: Colors<"$boTC"> | null) {
    return this.add(ShortStyles.borderTopColor, value);
  }

  /** Add borderTopColor */
  boTC(value?: Colors<"$boTC"> | null) {
    return this.add(ShortStyles.borderTopColor, value);
  }

  borderTopLeftRadius(value?: ValueType["borderTopLeftRadius"] | null) {
    return this.add(ShortStyles.borderTopLeftRadius, value);
  }

  /** Add borderTopLeftRadius */
  boTLR(value?: ValueType["borderTopLeftRadius"] | null) {
    return this.add(ShortStyles.borderTopLeftRadius, value);
  }

  borderTopRightRadius(value?: ValueType["borderTopRightRadius"] | null) {
    return this.add(ShortStyles.borderTopRightRadius, value);
  }

  /** Add borderTopRightRadius */
  boTRR(value?: ValueType["borderTopRightRadius"] | null) {
    return this.add(ShortStyles.borderTopRightRadius, value);
  }

  borderTopWidth(value?: ValueType["borderTopWidth"] | null) {
    return this.add(ShortStyles.borderTopWidth, value);
  }

  /** Add borderTopWidth */
  boTW(value?: ValueType["borderTopWidth"] | null) {
    return this.add(ShortStyles.borderTopWidth, value);
  }

  borderWidth(value?: ValueType["borderWidth"] | null) {
    return this.add(ShortStyles.borderWidth, value);
  }

  /** Add borderWidth */
  boW(value?: ValueType["borderWidth"] | null) {
    return this.add(ShortStyles.borderWidth, value);
  }

  bottom(value?: ValueType["bottom"] | null) {
    return this.add(ShortStyles.bottom, value);
  }

  /** Add bottom */
  bo(value?: ValueType["bottom"] | null) {
    return this.add(ShortStyles.bottom, value);
  }

  color(value?: Colors<"$co"> | null) {
    return this.add(ShortStyles.color, value);
  }

  /** Add color */
  co(value?: Colors<"$co"> | null) {
    return this.color(value);
  }

  direction(value?: ValueType["direction"] | null) {
    return this.add(ShortStyles.direction, value);
  }

  /** Add direction */
  dir(value?: ValueType["direction"] | null) {
    return this.add(ShortStyles.direction, value);
  }

  display(value?: ValueType["display"] | null) {
    return this.add(ShortStyles.display, value);
  }

  /** Add display */
  di(value?: ValueType["display"] | null) {
    return this.add(ShortStyles.display, value);
  }

  elevation(value?: ValueType["elevation"] | null) {
    return this.add(ShortStyles.elevation, value);
  }

  /** Add elevation */
  el(value?: ValueType["elevation"] | null) {
    return this.add(ShortStyles.elevation, value);
  }

  flex(value?: ValueType["flex"] | null) {
    return this.add(ShortStyles.flex, value);
  }

  /** Add Flex */
  fl(value?: ValueType["flex"] | null) {
    return this.add(ShortStyles.flex, value);
  }

  flexBasis(value?: ValueType["flexBasis"] | null) {
    return this.add(ShortStyles.flexBasis, value);
  }

  /** Add flexBasis */
  flB(value?: ValueType["flexBasis"] | null) {
    return this.add(ShortStyles.flexBasis, value);
  }

  flexDirection(value?: ValueType["flexDirection"] | null) {
    return this.add(ShortStyles.flexDirection, value);
  }

  /** Add flexDirection */
  flD(value?: ValueType["flexDirection"] | null) {
    return this.add(ShortStyles.flexDirection, value);
  }

  flexGrow(value?: ValueType["flexGrow"] | null) {
    return this.add(ShortStyles.flexGrow, value);
  }

  /** Add flexGrow */
  flG(value?: ValueType["flexGrow"] | null) {
    return this.add(ShortStyles.flexGrow, value);
  }

  flexShrink(value?: ValueType["flexShrink"] | null) {
    return this.add(ShortStyles.flexShrink, value);
  }

  /** Add flexShrink */
  flS(value?: ValueType["flexShrink"] | null) {
    return this.add(ShortStyles.flexShrink, value);
  }

  flexWrap(value?: ValueType["flexWrap"] | null) {
    return this.add(ShortStyles.flexWrap, value);
  }

  /** Add flexWrap */
  flW(value?: ValueType["flexWrap"] | null) {
    return this.add(ShortStyles.flexWrap, value);
  }

  fontFamily(value?: ValueType["fontFamily"] | null) {
    return this.add(ShortStyles.fontFamily, value);
  }

  /** Add fontFamily */
  foF(value?: ValueType["fontFamily"] | null) {
    return this.add(ShortStyles.fontFamily, value);
  }

  fontSize(value?: FontSizes | null) {
    if (typeof value == "string" && value.startsWith("$"))
      return this.classNames(value.substring(1))
    return this.add(ShortStyles.fontSize, value);
  }

  /** Add fontSize */
  foS(value?: FontSizes | null) {
    return this.fontSize(value);
  }

  fontStyle(value?: ValueType["fontStyle"] | null) {
    return this.add(ShortStyles.fontStyle, value);
  }

  fontVariant(value?: ValueType["fontVariant"] | null) {
    return this.add(ShortStyles.fontVariant, value);
  }

  /** Add fontVariant */
  foV(value?: ValueType["fontVariant"] | null) {
    return this.add(ShortStyles.fontVariant, value);
  }

  fontWeight(value?: ValueType["fontWeight"] | null) {
    return this.add(ShortStyles.fontWeight, value);
  }

  /** Add fontWeight */
  foW(value?: ValueType["fontWeight"] | null) {
    return this.add(ShortStyles.fontWeight, value);
  }

  height(value?: ValueType["height"] | null) {
    return this.add(ShortStyles.height, value);
  }

  /** Add height */
  he(value?: ValueType["height"] | null) {
    return this.add(ShortStyles.height, value);
  }

  includeFontPadding(value?: ValueType["includeFontPadding"] | null) {
    return this.add(ShortStyles.includeFontPadding, value);
  }

  /** Add includeFontPadding */
  inFP(value?: ValueType["includeFontPadding"] | null) {
    return this.add(ShortStyles.includeFontPadding, value);
  }

  justifyContent(value?: ValueType["justifyContent"] | null) {
    return this.add(ShortStyles.justifyContent, value);
  }

  /** Add justifyContent */
  juC(value?: ValueType["justifyContent"] | null) {
    return this.add(ShortStyles.justifyContent, value);
  }

  left(value?: ValueType["left"] | null) {
    return this.add(ShortStyles.left, value);
  }

  /** Add left */
  le(value?: ValueType["left"] | null) {
    return this.add(ShortStyles.left, value);
  }

  letterSpacing(value?: Spacing | null) {
    if (typeof value == "string" && value.startsWith("$"))
      return this.classNames(value.substring(1))
    return this.add(ShortStyles.letterSpacing, value);
  }

  /** Add letterSpacing */
  leS(value?: Spacing | null) {
    return this.letterSpacing(value);
  }

  lineHeight(value?: ValueType["lineHeight"] | null) {
    return this.add(ShortStyles.lineHeight, value);
  }

  /** Add lineHeight */
  liH(value?: ValueType["lineHeight"] | null) {
    return this.add(ShortStyles.lineHeight, value);
  }

  marginBottom(value?: ValueType["marginBottom"] | null) {
    return this.add(ShortStyles.marginBottom, value);
  }

  /** Add marginBottom */
  maB(value?: ValueType["marginBottom"] | null) {
    return this.add(ShortStyles.marginBottom, value);
  }

  marginHorizontal(value?: ValueType["marginHorizontal"] | null) {
    return this.add(ShortStyles.marginHorizontal, value);
  }

  /** Add marginHorizontal */
  maHo(value?: ValueType["marginHorizontal"] | null) {
    return this.add(ShortStyles.marginHorizontal, value);
  }

  marginLeft(value?: ValueType["marginLeft"] | null) {
    return this.add(ShortStyles.marginLeft, value);
  }

  /** Add marginLeft */
  maL(value?: ValueType["marginLeft"] | null) {
    return this.add(ShortStyles.marginLeft, value);
  }

  marginRight(value?: ValueType["marginRight"] | null) {
    return this.add(ShortStyles.marginRight, value);
  }

  /** Add marginRight */
  maR(value?: ValueType["marginRight"] | null) {
    return this.add(ShortStyles.marginRight, value);
  }

  marginTop(value?: ValueType["marginTop"] | null) {
    return this.add(ShortStyles.marginTop, value);
  }

  /** Add marginTop */
  maT(value?: ValueType["marginTop"] | null) {
    return this.add(ShortStyles.marginTop, value);
  }

  marginVertical(value?: ValueType["marginVertical"] | null) {
    return this.add(ShortStyles.marginVertical, value);
  }

  /** Add marginVertical */
  maV(value?: ValueType["marginVertical"] | null) {
    return this.add(ShortStyles.marginVertical, value);
  }

  maxHeight(value?: ValueType["maxHeight"] | null) {
    return this.add(ShortStyles.maxHeight, value);
  }

  /** Add maxHeight */
  maH(value?: ValueType["maxHeight"] | null) {
    return this.add(ShortStyles.maxHeight, value);
  }

  maxWidth(value?: ValueType["maxWidth"] | null) {
    return this.add(ShortStyles.maxWidth, value);
  }

  /** Add maxWidth */
  maW(value?: ValueType["maxWidth"] | null) {
    return this.add(ShortStyles.maxWidth, value);
  }

  minHeight(value?: ValueType["minHeight"] | null) {
    return this.add(ShortStyles.minHeight, value);
  }

  /** Add minHeight */
  miH(value?: ValueType["minHeight"] | null) {
    return this.add(ShortStyles.minHeight, value);
  }

  minWidth(value?: ValueType["minWidth"] | null) {
    return this.add(ShortStyles.minWidth, value);
  }

  /** Add minWidth */
  miW(value?: ValueType["minWidth"] | null) {
    return this.add(ShortStyles.minWidth, value);
  }

  opacity(value?: ValueType["opacity"] | null) {
    return this.add(ShortStyles.opacity, value);
  }

  /** Add opacity */
  op(value?: ValueType["opacity"] | null) {
    return this.add(ShortStyles.opacity, value);
  }

  overflow(value?: ValueType["overflow"] | null) {
    return this.add(ShortStyles.overflow, value);
  }

  /** Add overflow */
  ov(value?: ValueType["overflow"] | null) {
    return this.add(ShortStyles.overflow, value);
  }

  overlayColor(value?: Colors<"$ovC"> | null) {
    return this.add(ShortStyles.overlayColor, value);
  }

  /** Add overlayColor */
  ovC(value?: Colors<"$ovC"> | null) {
    return this.add(ShortStyles.overlayColor, value);
  }

  paddingBottom(value?: ValueType["paddingBottom"] | null) {
    return this.add(ShortStyles.paddingBottom, value);
  }

  /** Add paddingBottom */
  paB(value?: ValueType["paddingBottom"] | null) {
    return this.add(ShortStyles.paddingBottom, value);
  }

  paddingHorizontal(value?: ValueType["paddingHorizontal"] | null) {
    return this.add(ShortStyles.paddingHorizontal, value);
  }

  /** Add paddingHorizontal */
  paH(value?: ValueType["paddingHorizontal"] | null) {
    return this.add(ShortStyles.paddingHorizontal, value);
  }

  paddingLeft(value?: ValueType["paddingLeft"] | null) {
    return this.add(ShortStyles.paddingLeft, value);
  }

  /** Add paddingLeft */
  paL(value?: ValueType["paddingLeft"] | null) {
    return this.add(ShortStyles.paddingLeft, value);
  }

  paddingRight(value?: ValueType["paddingRight"] | null) {
    return this.add(ShortStyles.paddingRight, value);
  }

  /** Add paddingRight */
  paR(value?: ValueType["paddingRight"] | null) {
    return this.add(ShortStyles.paddingRight, value);
  }

  paddingTop(value?: ValueType["paddingTop"] | null) {
    return this.add(ShortStyles.paddingTop, value);
  }

  /** Add paddingTop */
  paT(value?: ValueType["paddingTop"] | null) {
    return this.add(ShortStyles.paddingTop, value);
  }

  paddingVertical(value?: ValueType["paddingVertical"] | null) {
    return this.add(ShortStyles.paddingVertical, value);
  }

  /** Add paddingVertical */
  paV(value?: ValueType["paddingVertical"] | null) {
    return this.add(ShortStyles.paddingVertical, value);
  }

  position(value?: ValueType["position"] | null) {
    return this.add(ShortStyles.position, value);
  }

  /** Add position */
  po(value?: ValueType["position"] | null) {
    return this.add(ShortStyles.position, value);
  }

  resizeMode(value?: ValueType["resizeMode"] | null) {
    return this.add(ShortStyles.resizeMode, value);
  }

  /** Add resizeMode */
  reM(value?: ValueType["resizeMode"] | null) {
    return this.add(ShortStyles.resizeMode, value);
  }

  right(value?: ValueType["right"] | null) {
    return this.add(ShortStyles.right, value);
  }

  /** Add right */
  ri(value?: ValueType["right"] | null) {
    return this.add(ShortStyles.right, value);
  }

  shadowColor(value?: Colors<"$shC"> | null) {
    return this.add(ShortStyles.shadowColor, value);
  }

  /** Add shadowColor */
  shC(value?: Colors<"$shC"> | null) {
    return this.add(ShortStyles.shadowColor, value);
  }

  shadowOffset(value?: ValueType["shadowOffset"] | null) {
    return this.add(ShortStyles.shadowOffset, value);
  }

  shadowOpacity(value?: ValueType["shadowOpacity"] | null) {
    return this.add(ShortStyles.shadowOpacity, value);
  }

  /** Add shadowOpacity */
  shO(value?: ValueType["shadowOpacity"] | null) {
    return this.add(ShortStyles.shadowOpacity, value);
  }

  shadowRadius(value?: ValueType["shadowRadius"] | null) {
    return this.add(ShortStyles.shadowRadius, value);
  }

  /** Add shadowRadius */
  shR(value?: ValueType["shadowRadius"] | null) {
    return this.add(ShortStyles.shadowRadius, value);
  }

  textAlign(value?: ValueType["textAlign"] | null) {
    return this.add(ShortStyles.textAlign, value);
  }

  /** Add textAlign */
  teA(value?: ValueType["textAlign"] | null) {
    return this.add(ShortStyles.textAlign, value);
  }

  textAlignVertical(value?: ValueType["textAlignVertical"] | null) {
    return this.add(ShortStyles.textAlignVertical, value);
  }

  /** Add textAlignVertical */
  teAV(value?: ValueType["textAlignVertical"] | null) {
    return this.add(ShortStyles.textAlignVertical, value);
  }

  textDecorationColor(value?: Colors<"$teDC"> | null) {
    return this.add(ShortStyles.textDecorationColor, value);
  }

  /** Add textDecorationColor */
  teDC(value?: Colors<"$teDC"> | null) {
    return this.add(ShortStyles.textDecorationColor, value);
  }

  textDecorationLine(value?: ValueType["textDecorationLine"] | null) {
    return this.add(ShortStyles.textDecorationLine, value);
  }

  /** Add textDecorationLine */
  teDL(value?: ValueType["textDecorationLine"] | null) {
    return this.add(ShortStyles.textDecorationLine, value);
  }

  textDecorationStyle(value?: ValueType["textDecorationStyle"] | null) {
    return this.add(ShortStyles.textDecorationStyle, value);
  }

  /** Add textDecorationStyle */
  teDS(value?: ValueType["textDecorationStyle"] | null) {
    return this.add(ShortStyles.textDecorationStyle, value);
  }

  textShadowColor(value?: Colors<"$teSC"> | null) {
    return this.add(ShortStyles.textShadowColor, value);
  }

  /** Add textShadowColor */
  teSC(value?: Colors<"$teSC"> | null) {
    return this.add(ShortStyles.textShadowColor, value);
  }

  /*
    use style insted
    textShadowOffset(value?: ValueType["textShadowOffset"] | null) {
      return this.add(ShortStyles.textShadowOffset, value);
    }
  
    teSO(value?: ValueType["textShadowOffset"] | null) {
      return this.add(ShortStyles.textShadowOffset, value);
    }
   */

  textShadowRadius(value?: ValueType["textShadowRadius"] | null) {
    return this.add(ShortStyles.textShadowRadius, value);
  }

  /** Add textShadowRadius */
  teSR(value?: ValueType["textShadowRadius"] | null) {
    return this.add(ShortStyles.textShadowRadius, value);
  }

  tintColor(value?: Colors<"$tiC"> | null) {
    return this.add(ShortStyles.tintColor, value);
  }

  /** Add tintColor */
  tiC(value?: Colors<"$tiC"> | null) {
    return this.tintColor(value)
  }

  top(value?: ValueType["top"] | null) {
    return this.add(ShortStyles.top, value);
  }

  /** Add top */
  to(value?: ValueType["top"] | null) {
    return this.add(ShortStyles.top, value);
  }

  /*
   dose not handle objects, use style insted
   transform(value?: ValueType["transform"] | null) {
     return this.add(ShortStyles.transform, value);
   }
 
   tr(value?: ValueType["transform"] | null) {
     return this.add(ShortStyles.transform, value);
   }*/

  width(value?: ValueType["width"] | null) {
    return this.add(ShortStyles.width, value);
  }

  /** Add width */
  wi(value?: ValueType["width"] | null) {
    return this.add(ShortStyles.width, value);
  }

  writingDirection(value?: ValueType["writingDirection"] | null) {
    return this.add(ShortStyles.writingDirection, value);
  }

  /** Add writingDirection */
  wrD(value?: ValueType["writingDirection"] | null) {
    return this.add(ShortStyles.writingDirection, value);
  }

  zIndex(value?: ValueType["zIndex"] | null) {
    return this.add(ShortStyles.zIndex, value);
  }

  /** Add zIndex */
  zI(value?: ValueType["zIndex"] | null) {
    return this.add(ShortStyles.zIndex, value);
  }
}