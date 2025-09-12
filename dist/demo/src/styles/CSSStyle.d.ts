import { ViewStyle, TextStyle, ImageStyle, StyleProp } from "react-native";
import { defaultTheme } from "../theme/DefaultStyle";
import { CSS_String, StyledProps } from "../Typse";
type ValueType = ViewStyle & TextStyle & ImageStyle;
type Sizes = 5 | 10 | 20 | 30 | 40 | 60 | 70 | 80 | 90 | 100;
type Colors<K extends string> = `${K}-${keyof typeof defaultTheme.color}` | (string & {});
type FontSizes = `.fos-${keyof typeof defaultTheme.fontSize}` | (ValueType["fontSize"] & {}) | (string & {});
type zIndex = `.zi-${keyof typeof defaultTheme.zIndex}` | (ValueType["zIndex"] & {}) | (string & {});
type BorderRadius = `.bor-${keyof typeof defaultTheme.borderRadius}` | (number & {});
type Spacing = `.sp-${keyof typeof defaultTheme.spacing}` | (ValueType["letterSpacing"] & {});
type SizeValue<K extends string> = `${Sizes}${K}` | number | (string & {});
type Display = "block" | "inline" | "run-in" | "flow" | "flow-root" | "flex" | "inline-flex" | "grid" | "inline-grid" | "table" | "inline-table" | "table-row-group" | "table-header-group" | "table-footer-group" | "table-row" | "table-cell" | "table-column-group" | "table-column" | "table-caption" | "ruby" | "ruby-base" | "ruby-text" | "ruby-base-container" | "ruby-text-container" | "contents" | "none" | "list-item" | "inline-block" | "inherit" | "initial" | "unset";
type DisplayValue = Display | (string & {});
export type CSSProps<T extends object> = T & StyledProps & {
    refererId?: string;
};
type classNames = (`.sh-${keyof typeof defaultTheme.shadow}` | `.sp-${keyof typeof defaultTheme.spacing}`) | (string & {});
export declare abstract class ExtraCssStyle {
    value: string;
    type: string;
    /** Add classNames  eg container*/
    classNames(...cls: classNames[]): this;
    /** Add classNames  eg container*/
    cls(...cls: classNames[]): this;
    /** Add unknown prop eg color, #FFF */
    add(key: string, value?: any | null): this;
    /** height and width = 100% */
    fillView(): this;
    /** Add with and height of the View */
    size(width: SizeValue<"%"> | SizeValue<"vw">, height?: SizeValue<"%"> | SizeValue<"vh">): this;
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
    padding(v1: ValueType["padding"], v2?: ValueType["padding"], v3?: ValueType["padding"], v4?: ValueType["padding"]): this;
    /**
   * read https://www.w3schools.com/css/css_padding.asp on how this is used
   */
    pa(v1: ValueType["padding"], v2?: ValueType["padding"], v3?: ValueType["padding"], v4?: ValueType["padding"]): this;
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
    margin(v1: ValueType["margin"], v2?: ValueType["margin"], v3?: ValueType["margin"], v4?: ValueType["margin"]): this;
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
    ma(v1: ValueType["margin"], v2?: ValueType["margin"], v3?: ValueType["margin"], v4?: ValueType["margin"]): this;
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
    positions(v1: ValueType["top"], v2: ValueType["top"], v3?: ValueType["top"], v4?: ValueType["top"]): this;
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
    pos(v1: ValueType["top"], v2: ValueType["top"], v3?: ValueType["top"], v4?: ValueType["top"]): this;
    /** Add css value with conditions */
    if(value: boolean | Function | undefined | null, $this: CSS_String, $else?: CSS_String): this;
    joinLeft(value: CSSStyle | string | StyleProp<ViewStyle> | StyleProp<ImageStyle> | StyleProp<TextStyle> | ((x: CSSStyle) => CSSStyle)): this;
    joinRight(value: CSSStyle | string | StyleProp<ViewStyle> | StyleProp<ImageStyle> | StyleProp<TextStyle> | ((x: CSSStyle) => CSSStyle)): this;
}
export declare class CSSStyle extends ExtraCssStyle {
    textTransform(value: ValueType["textTransform"]): this;
    tt(value: ValueType["textTransform"]): this;
    toString: () => string;
    alignContent(value?: ValueType["alignContent"] | null): this;
    /** Add alignContent */
    alC(value?: ValueType["alignContent"] | null): this;
    alignItems(value?: ValueType["alignItems"] | null): this;
    /** Add alignItems */
    alI(value?: ValueType["alignItems"] | null): this;
    alignSelf(value?: ValueType["alignSelf"] | null): this;
    /** Add alignSelf */
    alS(value?: ValueType["alignSelf"] | null): this;
    aspectRatio(value?: ValueType["aspectRatio"] | null): this;
    /** Add aspectRatio */
    asR(value?: ValueType["aspectRatio"] | null): this;
    backfaceVisibility(value?: ValueType["backfaceVisibility"] | null): this;
    /** Add backfaceVisibility */
    baV(value?: ValueType["backfaceVisibility"] | null): this;
    backgroundColor(value?: Colors<".co"> | null): this;
    /** Add backgroundColor */
    baC(value?: Colors<".co"> | null): this;
    borderBottomColor(value?: Colors<".co"> | null): this;
    /** Add borderBottomColor */
    boBC(value?: Colors<".co"> | null): this;
    borderBottomLeftRadius(value?: ValueType["borderBottomLeftRadius"] | null): this;
    /** Add borderBottomLeftRadius */
    boBLR(value?: ValueType["borderBottomLeftRadius"] | null): this;
    borderBottomRightRadius(value?: ValueType["borderBottomRightRadius"] | null): this;
    /** Add borderBottomRightRadius */
    boBRR(value?: ValueType["borderBottomRightRadius"] | null): this;
    borderBottomWidth(value?: ValueType["borderBottomWidth"] | null): this;
    /** Add borderBottomWidth */
    boBW(value?: ValueType["borderBottomWidth"] | null): this;
    borderColor(value?: Colors<".co"> | null): this;
    /** Add borderColor */
    boC(value?: Colors<".co"> | null): this;
    borderLeftColor(value?: Colors<".co"> | null): this;
    /** Add borderLeftColor */
    boLC(value?: Colors<".co"> | null): this;
    borderLeftWidth(value?: ValueType["borderLeftWidth"] | null): this;
    /** Add borderLeftWidth */
    boLW(value?: ValueType["borderLeftWidth"] | null): this;
    borderRadius(value?: BorderRadius | null): this;
    /** Add borderRadius */
    boR(value?: BorderRadius | null): this;
    borderRightColor(value?: Colors<".co"> | null): this;
    /** Add borderRightColor */
    boRC(value?: Colors<".co"> | null): this;
    borderRightWidth(value?: ValueType["borderRightWidth"] | null): this;
    /** Add borderRightWidth */
    boRW(value?: ValueType["borderRightWidth"] | null): this;
    borderStyle(value?: ValueType["borderStyle"] | null): this;
    /** Add borderStyle */
    boS(value?: ValueType["borderStyle"] | null): this;
    borderTopColor(value?: Colors<".co"> | null): this;
    /** Add borderTopColor */
    boTC(value?: Colors<".co"> | null): this;
    borderTopLeftRadius(value?: ValueType["borderTopLeftRadius"] | null): this;
    /** Add borderTopLeftRadius */
    boTLR(value?: ValueType["borderTopLeftRadius"] | null): this;
    borderTopRightRadius(value?: ValueType["borderTopRightRadius"] | null): this;
    /** Add borderTopRightRadius */
    boTRR(value?: ValueType["borderTopRightRadius"] | null): this;
    borderTopWidth(value?: ValueType["borderTopWidth"] | null): this;
    /** Add borderTopWidth */
    boTW(value?: ValueType["borderTopWidth"] | null): this;
    borderWidth(value?: ValueType["borderWidth"] | null): this;
    /** Add borderWidth */
    boW(value?: ValueType["borderWidth"] | null): this;
    bottom(value?: ValueType["bottom"] | null): this;
    /** Add bottom */
    bo(value?: ValueType["bottom"] | null): this;
    color(value?: Colors<".co"> | null): this;
    /** Add color */
    co(value?: Colors<".co"> | null): this;
    direction(value?: ValueType["direction"] | null): this;
    /** Add direction */
    dir(value?: ValueType["direction"] | null): this;
    display(value?: ValueType["display"] | null): this;
    /** Add display */
    di(value?: DisplayValue | null): this;
    elevation(value?: ValueType["elevation"] | null): this;
    /** Add elevation */
    el(value?: ValueType["elevation"] | null): this;
    flex(value?: ValueType["flex"] | null): this;
    /** Add Flex */
    fl(value?: ValueType["flex"] | null): this;
    flexBasis(value?: ValueType["flexBasis"] | null): this;
    /** Add flexBasis */
    flB(value?: ValueType["flexBasis"] | null): this;
    flexDirection(value?: ValueType["flexDirection"] | null): this;
    /** Add flexDirection */
    flD(value?: ValueType["flexDirection"] | null): this;
    flexGrow(value?: ValueType["flexGrow"] | null): this;
    /** Add flexGrow */
    flG(value?: ValueType["flexGrow"] | null): this;
    flexShrink(value?: ValueType["flexShrink"] | null): this;
    /** Add flexShrink */
    flS(value?: ValueType["flexShrink"] | null): this;
    flexWrap(value?: ValueType["flexWrap"] | null): this;
    /** Add flexWrap */
    flW(value?: ValueType["flexWrap"] | null): this;
    fontFamily(value?: ValueType["fontFamily"] | null): this;
    /** Add fontFamily */
    foF(value?: ValueType["fontFamily"] | null): this;
    fontSize(value?: FontSizes | null): this;
    /** Add fontSize */
    foS(value?: FontSizes | null): this;
    fontStyle(value?: ValueType["fontStyle"] | null): this;
    fontVariant(value?: ValueType["fontVariant"] | null): this;
    /** Add fontVariant */
    foV(value?: ValueType["fontVariant"] | null): this;
    fontWeight(value?: ValueType["fontWeight"] | null): this;
    /** Add fontWeight */
    foW(value?: ValueType["fontWeight"] | null): this;
    height(value?: SizeValue<"%"> | SizeValue<"vh"> | null): this;
    /** Add height */
    he(value?: SizeValue<"%"> | SizeValue<"vh"> | null): this;
    includeFontPadding(value?: ValueType["includeFontPadding"] | null): this;
    /** Add includeFontPadding */
    inFP(value?: ValueType["includeFontPadding"] | null): this;
    justifyContent(value?: ValueType["justifyContent"] | null): this;
    /** Add justifyContent */
    juC(value?: ValueType["justifyContent"] | null): this;
    left(value?: ValueType["left"] | null): this;
    /** Add left */
    le(value?: ValueType["left"] | null): this;
    letterSpacing(value?: Spacing | null): this;
    /** Add letterSpacing */
    leS(value?: Spacing | null): this;
    lineHeight(value?: ValueType["lineHeight"] | null): this;
    /** Add lineHeight */
    liH(value?: ValueType["lineHeight"] | null): this;
    marginBottom(value?: ValueType["marginBottom"] | null): this;
    /** Add marginBottom */
    maB(value?: ValueType["marginBottom"] | null): this;
    marginHorizontal(value?: ValueType["marginHorizontal"] | null): this;
    /** Add marginHorizontal */
    maHo(value?: ValueType["marginHorizontal"] | null): this;
    marginLeft(value?: ValueType["marginLeft"] | null): this;
    /** Add marginLeft */
    maL(value?: ValueType["marginLeft"] | null): this;
    marginRight(value?: ValueType["marginRight"] | null): this;
    /** Add marginRight */
    maR(value?: ValueType["marginRight"] | null): this;
    marginTop(value?: ValueType["marginTop"] | null): this;
    /** Add marginTop */
    maT(value?: ValueType["marginTop"] | null): this;
    marginVertical(value?: ValueType["marginVertical"] | null): this;
    /** Add marginVertical */
    maV(value?: ValueType["marginVertical"] | null): this;
    maxHeight(value?: SizeValue<"%"> | SizeValue<"vh"> | null): this;
    /** Add maxHeight */
    maH(value?: SizeValue<"%"> | SizeValue<"vh"> | null): this;
    maxWidth(value?: SizeValue<"%"> | SizeValue<"vw"> | null): this;
    /** Add maxWidth */
    maW(value?: SizeValue<"%"> | SizeValue<"vw"> | null): this;
    minHeight(value?: SizeValue<"%"> | SizeValue<"vh"> | null): this;
    /** Add minHeight */
    miH(value?: SizeValue<"%"> | SizeValue<"vh"> | null): this;
    minWidth(value?: SizeValue<"%"> | SizeValue<"vw"> | null): this;
    /** Add minWidth */
    miW(value?: SizeValue<"%"> | SizeValue<"vw"> | null): any;
    opacity(value?: ValueType["opacity"] | null): this;
    /** Add opacity */
    op(value?: ValueType["opacity"] | null): this;
    overflow(value?: ValueType["overflow"] | null): this;
    /** Add overflow */
    ov(value?: ValueType["overflow"] | null): this;
    overlayColor(value?: Colors<".co"> | null): this;
    /** Add overlayColor */
    ovC(value?: Colors<".co"> | null): this;
    paddingBottom(value?: ValueType["paddingBottom"] | null): this;
    /** Add paddingBottom */
    paB(value?: ValueType["paddingBottom"] | null): this;
    paddingHorizontal(value?: ValueType["paddingHorizontal"] | null): this;
    /** Add paddingHorizontal */
    paH(value?: ValueType["paddingHorizontal"] | null): this;
    paddingLeft(value?: ValueType["paddingLeft"] | null): this;
    /** Add paddingLeft */
    paL(value?: ValueType["paddingLeft"] | null): this;
    paddingRight(value?: ValueType["paddingRight"] | null): this;
    /** Add paddingRight */
    paR(value?: ValueType["paddingRight"] | null): this;
    paddingTop(value?: ValueType["paddingTop"] | null): this;
    /** Add paddingTop */
    paT(value?: ValueType["paddingTop"] | null): this;
    paddingVertical(value?: ValueType["paddingVertical"] | null): this;
    /** Add paddingVertical */
    paV(value?: ValueType["paddingVertical"] | null): this;
    position(value?: ValueType["position"] | null): this;
    /** Add position */
    po(value?: ValueType["position"] | null): this;
    resizeMode(value?: ValueType["resizeMode"] | null): this;
    /** Add resizeMode */
    reM(value?: ValueType["resizeMode"] | null): this;
    right(value?: ValueType["right"] | null): this;
    /** Add right */
    ri(value?: ValueType["right"] | null): this;
    shadowColor(value?: Colors<".co"> | null): this;
    /** Add shadowColor */
    shC(value?: Colors<".co"> | null): this;
    shadowOffset(value?: ValueType["shadowOffset"] | null): this;
    shadowOpacity(value?: ValueType["shadowOpacity"] | null): this;
    /** Add shadowOpacity */
    shO(value?: ValueType["shadowOpacity"] | null): this;
    shadowRadius(value?: ValueType["shadowRadius"] | null): this;
    /** Add shadowRadius */
    shR(value?: ValueType["shadowRadius"] | null): this;
    textAlign(value?: ValueType["textAlign"] | null): this;
    /** Add textAlign */
    teA(value?: ValueType["textAlign"] | null): this;
    textAlignVertical(value?: ValueType["textAlignVertical"] | null): this;
    /** Add textAlignVertical */
    teAV(value?: ValueType["textAlignVertical"] | null): this;
    textDecorationColor(value?: Colors<".co"> | null): this;
    /** Add textDecorationColor */
    teDC(value?: Colors<".co"> | null): this;
    textDecorationLine(value?: ValueType["textDecorationLine"] | null): this;
    /** Add textDecorationLine */
    teDL(value?: ValueType["textDecorationLine"] | null): this;
    textDecorationStyle(value?: ValueType["textDecorationStyle"] | null): this;
    /** Add textDecorationStyle */
    teDS(value?: ValueType["textDecorationStyle"] | null): this;
    textShadowColor(value?: Colors<".co"> | null): this;
    /** Add textShadowColor */
    teSC(value?: Colors<".co"> | null): this;
    textShadowRadius(value?: ValueType["textShadowRadius"] | null): this;
    /** Add textShadowRadius */
    teSR(value?: ValueType["textShadowRadius"] | null): this;
    tintColor(value?: Colors<".co"> | null): this;
    /** Add tintColor */
    tiC(value?: Colors<".co"> | null): this;
    top(value?: ValueType["top"] | null): this;
    /** Add top */
    to(value?: ValueType["top"] | null): this;
    width(value?: SizeValue<"%"> | SizeValue<"vw"> | null): this;
    /** Add width */
    wi(value?: SizeValue<"%"> | SizeValue<"vw"> | null): this;
    writingDirection(value?: ValueType["writingDirection"] | null): this;
    /** Add writingDirection */
    wrD(value?: ValueType["writingDirection"] | null): this;
    zIndex(value?: zIndex | null): this;
    /** Add zIndex */
    zI(value?: zIndex | null): this;
    importantAll(): this;
    importantValue(): this;
}
export declare class CSSStyleSheetStyle extends CSSStyle {
    private eqs;
    importantAll(): this;
    importantValue(): this;
    /** Used in NestedStyleSheet */
    getEqs(parentKey: any, item?: CSSStyleSheetStyle): {
        key: string;
        css: string;
    }[];
}
export {};
