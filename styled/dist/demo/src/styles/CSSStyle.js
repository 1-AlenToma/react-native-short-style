import { flatStyle } from "../config/CSSMethods";
import { ShortStyles } from "./validStyles";
;
export class ExtraCssStyle {
    constructor() {
        this.value = "";
        this.type = "CSSStyled";
    }
    /** Add classNames  eg container*/
    classNames(...cls) {
        cls.forEach(x => {
            if (x)
                this.value += ` ${x.trim().startsWith(".") ? "" : "."}${x}`;
        });
        return this;
    }
    /** Add classNames  eg container*/
    cls(...cls) {
        cls.forEach(x => {
            if (x)
                this.value += ` ${x.trim().startsWith(".") ? "" : "."}${x}`;
        });
        return this;
    }
    /** Add unknown prop eg color, #FFF */
    add(key, value) {
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
    size(width, height) {
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
    padding(v1, v2, v3, v4) {
        if (v1 != undefined && v2 == undefined && v3 == undefined && v4 == undefined)
            return this.add(ShortStyles.padding, v1);
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
    pa(v1, v2, v3, v4) {
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
    margin(v1, v2, v3, v4) {
        if (v1 != undefined && v2 == undefined && v3 == undefined && v4 == undefined)
            return this.add(ShortStyles.margin, v1);
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
    ma(v1, v2, v3, v4) {
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
    positions(v1, v2, v3, v4) {
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
    pos(v1, v2, v3, v4) {
        return this.positions(v1, v2, v3, v4);
    }
    /** Add css value with conditions */
    if(value, $this, $else) {
        if (value && typeof value == "function")
            value = value();
        if (value)
            return this.joinRight($this);
        else if ($else)
            return this.joinRight($else);
        return this;
    }
    joinLeft(value) {
        if (value && typeof value == "function") {
            value(this);
            return this;
        }
        if (value && typeof value == "object" && value.type == this.type) {
            this.value = `${value.value} ${this.value}`;
        }
        else if (value && typeof value == "object") {
            let css = "";
            let style = flatStyle(value);
            for (let key in style) {
                let v = style[key];
                if (v == undefined)
                    css += ` ${key}:undefined`;
                else if (v === null)
                    css += ` ${key}:null`;
                else if (typeof v === "object") {
                    console.warn("CSSStyle cannot join object, value", v);
                    continue;
                }
                else
                    css += ` ${key}:${v}`;
            }
            value = css;
        }
        if (value && typeof value == "string") {
            this.value = `${value} ${this.value}`;
        }
        return this;
    }
    joinRight(value) {
        if (value && typeof value == "function") {
            value(this);
            return this;
        }
        if (value && typeof value == "object" && value.type == this.type) {
            this.value = `${value.value} ${this.value}`;
        }
        else if (value && typeof value == "object") {
            let css = "";
            let style = flatStyle(value);
            for (let key in style) {
                let v = style[key];
                if (v == undefined)
                    this.add(key, undefined);
                else if (v === null)
                    this.add(key, null);
                else if (typeof v === "object") {
                    console.warn("CSSStyle cannot join object, value", v);
                    continue;
                }
                else
                    this.add(key, v);
            }
            return this;
        }
        if (value && typeof value == "string") {
            this.value = `${this.value} ${value}`;
        }
        return this;
    }
}
export class CSSStyle extends ExtraCssStyle {
    constructor() {
        super(...arguments);
        this.toString = () => {
            var _a;
            return (_a = this.value) !== null && _a !== void 0 ? _a : "";
        };
    }
    pointerEvents(value) {
        return this.add(ShortStyles.pointerEvents, value);
    }
    poE(value) {
        return this.add(ShortStyles.pointerEvents, value);
    }
    textTransform(value) {
        return this.add(ShortStyles.textTransform, value);
    }
    tt(value) {
        return this.textTransform(value);
    }
    alignContent(value) {
        return this.add(ShortStyles.alignContent, value);
    }
    /** Add alignContent */
    alC(value) {
        return this.add(ShortStyles.alignContent, value);
    }
    alignItems(value) {
        return this.add(ShortStyles.alignItems, value);
    }
    /** Add alignItems */
    alI(value) {
        return this.add(ShortStyles.alignItems, value);
    }
    alignSelf(value) {
        return this.add(ShortStyles.alignSelf, value);
    }
    /** Add alignSelf */
    alS(value) {
        return this.add(ShortStyles.alignSelf, value);
    }
    aspectRatio(value) {
        return this.add(ShortStyles.aspectRatio, value);
    }
    /** Add aspectRatio */
    asR(value) {
        return this.add(ShortStyles.aspectRatio, value);
    }
    backfaceVisibility(value) {
        return this.add(ShortStyles.backfaceVisibility, value);
    }
    /** Add backfaceVisibility */
    baV(value) {
        return this.add(ShortStyles.backfaceVisibility, value);
    }
    backgroundColor(value) {
        return this.add(ShortStyles.backgroundColor, value);
    }
    /** Add backgroundColor */
    baC(value) {
        return this.backgroundColor(value);
    }
    borderBottomColor(value) {
        return this.add(ShortStyles.borderBottomColor, value);
    }
    /** Add borderBottomColor */
    boBC(value) {
        return this.borderBottomColor(value);
    }
    borderBottomLeftRadius(value) {
        return this.add(ShortStyles.borderBottomLeftRadius, value);
    }
    /** Add borderBottomLeftRadius */
    boBLR(value) {
        return this.add(ShortStyles.borderBottomLeftRadius, value);
    }
    borderBottomRightRadius(value) {
        return this.add(ShortStyles.borderBottomRightRadius, value);
    }
    /** Add borderBottomRightRadius */
    boBRR(value) {
        return this.add(ShortStyles.borderBottomRightRadius, value);
    }
    borderBottomWidth(value) {
        return this.add(ShortStyles.borderBottomWidth, value);
    }
    /** Add borderBottomWidth */
    boBW(value) {
        return this.add(ShortStyles.borderBottomWidth, value);
    }
    borderColor(value) {
        return this.add(ShortStyles.borderColor, value);
    }
    /** Add borderColor */
    boC(value) {
        return this.borderColor(value);
    }
    borderLeftColor(value) {
        return this.add(ShortStyles.borderLeftColor, value);
    }
    /** Add borderLeftColor */
    boLC(value) {
        return this.borderLeftColor(value);
    }
    borderLeftWidth(value) {
        return this.add(ShortStyles.borderLeftWidth, value);
    }
    /** Add borderLeftWidth */
    boLW(value) {
        return this.add(ShortStyles.borderLeftWidth, value);
    }
    borderRadius(value) {
        if (value && typeof value == "string" && value.startsWith("."))
            return this.classNames(value.substring(1));
        return this.add(ShortStyles.borderRadius, value);
    }
    /** Add borderRadius */
    boR(value) {
        return this.borderRadius(value);
    }
    borderRightColor(value) {
        return this.add(ShortStyles.borderRightColor, value);
    }
    /** Add borderRightColor */
    boRC(value) {
        return this.borderRightColor(value);
    }
    borderRightWidth(value) {
        return this.add(ShortStyles.borderRightWidth, value);
    }
    /** Add borderRightWidth */
    boRW(value) {
        return this.add(ShortStyles.borderRightWidth, value);
    }
    borderStyle(value) {
        return this.add(ShortStyles.borderStyle, value);
    }
    /** Add borderStyle */
    boS(value) {
        return this.add(ShortStyles.borderStyle, value);
    }
    borderTopColor(value) {
        return this.add(ShortStyles.borderTopColor, value);
    }
    /** Add borderTopColor */
    boTC(value) {
        return this.borderTopColor(value);
    }
    borderTopLeftRadius(value) {
        return this.add(ShortStyles.borderTopLeftRadius, value);
    }
    /** Add borderTopLeftRadius */
    boTLR(value) {
        return this.add(ShortStyles.borderTopLeftRadius, value);
    }
    borderTopRightRadius(value) {
        return this.add(ShortStyles.borderTopRightRadius, value);
    }
    /** Add borderTopRightRadius */
    boTRR(value) {
        return this.add(ShortStyles.borderTopRightRadius, value);
    }
    borderTopWidth(value) {
        return this.add(ShortStyles.borderTopWidth, value);
    }
    /** Add borderTopWidth */
    boTW(value) {
        return this.add(ShortStyles.borderTopWidth, value);
    }
    borderWidth(value) {
        return this.add(ShortStyles.borderWidth, value);
    }
    /** Add borderWidth */
    boW(value) {
        return this.add(ShortStyles.borderWidth, value);
    }
    bottom(value) {
        return this.add(ShortStyles.bottom, value);
    }
    /** Add bottom */
    bo(value) {
        return this.add(ShortStyles.bottom, value);
    }
    color(value) {
        return this.add(ShortStyles.color, value);
    }
    /** Add color */
    co(value) {
        return this.color(value);
    }
    direction(value) {
        return this.add(ShortStyles.direction, value);
    }
    /** Add direction */
    dir(value) {
        return this.add(ShortStyles.direction, value);
    }
    display(value) {
        return this.add(ShortStyles.display, value);
    }
    /** Add display */
    di(value) {
        return this.add(ShortStyles.display, value);
    }
    elevation(value) {
        return this.add(ShortStyles.elevation, value);
    }
    /** Add elevation */
    el(value) {
        return this.add(ShortStyles.elevation, value);
    }
    flex(value) {
        return this.add(ShortStyles.flex, value);
    }
    /** Add Flex */
    fl(value) {
        return this.add(ShortStyles.flex, value);
    }
    flexBasis(value) {
        return this.add(ShortStyles.flexBasis, value);
    }
    /** Add flexBasis */
    flB(value) {
        return this.add(ShortStyles.flexBasis, value);
    }
    flexDirection(value) {
        return this.add(ShortStyles.flexDirection, value);
    }
    /** Add flexDirection */
    flD(value) {
        return this.add(ShortStyles.flexDirection, value);
    }
    flexGrow(value) {
        return this.add(ShortStyles.flexGrow, value);
    }
    /** Add flexGrow */
    flG(value) {
        return this.add(ShortStyles.flexGrow, value);
    }
    flexShrink(value) {
        return this.add(ShortStyles.flexShrink, value);
    }
    /** Add flexShrink */
    flS(value) {
        return this.add(ShortStyles.flexShrink, value);
    }
    flexWrap(value) {
        return this.add(ShortStyles.flexWrap, value);
    }
    /** Add flexWrap */
    flW(value) {
        return this.add(ShortStyles.flexWrap, value);
    }
    fontFamily(value) {
        return this.add(ShortStyles.fontFamily, value);
    }
    /** Add fontFamily */
    foF(value) {
        return this.add(ShortStyles.fontFamily, value);
    }
    fontSize(value) {
        if (typeof value == "string" && value.startsWith("."))
            return this.classNames(value.substring(1));
        return this.add(ShortStyles.fontSize, value);
    }
    /** Add fontSize */
    foS(value) {
        return this.fontSize(value);
    }
    fontStyle(value) {
        return this.add(ShortStyles.fontStyle, value);
    }
    fontVariant(value) {
        return this.add(ShortStyles.fontVariant, value);
    }
    /** Add fontVariant */
    foV(value) {
        return this.add(ShortStyles.fontVariant, value);
    }
    fontWeight(value) {
        return this.add(ShortStyles.fontWeight, value);
    }
    /** Add fontWeight */
    foW(value) {
        return this.add(ShortStyles.fontWeight, value);
    }
    height(value) {
        return this.add(ShortStyles.height, value);
    }
    /** Add height */
    he(value) {
        return this.height(value);
    }
    includeFontPadding(value) {
        return this.add(ShortStyles.includeFontPadding, value);
    }
    /** Add includeFontPadding */
    inFP(value) {
        return this.add(ShortStyles.includeFontPadding, value);
    }
    justifyContent(value) {
        return this.add(ShortStyles.justifyContent, value);
    }
    /** Add justifyContent */
    juC(value) {
        return this.add(ShortStyles.justifyContent, value);
    }
    left(value) {
        return this.add(ShortStyles.left, value);
    }
    /** Add left */
    le(value) {
        return this.add(ShortStyles.left, value);
    }
    letterSpacing(value) {
        if (typeof value == "string" && value.startsWith("."))
            return this.classNames(value.substring(1));
        return this.add(ShortStyles.letterSpacing, value);
    }
    /** Add letterSpacing */
    leS(value) {
        return this.letterSpacing(value);
    }
    lineHeight(value) {
        return this.add(ShortStyles.lineHeight, value);
    }
    /** Add lineHeight */
    liH(value) {
        return this.add(ShortStyles.lineHeight, value);
    }
    marginBottom(value) {
        return this.add(ShortStyles.marginBottom, value);
    }
    /** Add marginBottom */
    maB(value) {
        return this.add(ShortStyles.marginBottom, value);
    }
    marginHorizontal(value) {
        return this.add(ShortStyles.marginHorizontal, value);
    }
    /** Add marginHorizontal */
    maHo(value) {
        return this.add(ShortStyles.marginHorizontal, value);
    }
    marginLeft(value) {
        return this.add(ShortStyles.marginLeft, value);
    }
    /** Add marginLeft */
    maL(value) {
        return this.add(ShortStyles.marginLeft, value);
    }
    marginRight(value) {
        return this.add(ShortStyles.marginRight, value);
    }
    /** Add marginRight */
    maR(value) {
        return this.add(ShortStyles.marginRight, value);
    }
    marginTop(value) {
        return this.add(ShortStyles.marginTop, value);
    }
    /** Add marginTop */
    maT(value) {
        return this.add(ShortStyles.marginTop, value);
    }
    marginVertical(value) {
        return this.add(ShortStyles.marginVertical, value);
    }
    /** Add marginVertical */
    maV(value) {
        return this.add(ShortStyles.marginVertical, value);
    }
    maxHeight(value) {
        return this.add(ShortStyles.maxHeight, value);
    }
    /** Add maxHeight */
    maH(value) {
        return this.maxHeight(value);
    }
    maxWidth(value) {
        return this.add(ShortStyles.maxWidth, value);
    }
    /** Add maxWidth */
    maW(value) {
        return this.maxWidth(value);
    }
    minHeight(value) {
        return this.add(ShortStyles.minHeight, value);
    }
    /** Add minHeight */
    miH(value) {
        return this.minHeight(value);
    }
    minWidth(value) {
        return this.add(ShortStyles.minWidth, value);
    }
    /** Add minWidth */
    miW(value) {
        return this.miW(value);
    }
    opacity(value) {
        return this.add(ShortStyles.opacity, value);
    }
    /** Add opacity */
    op(value) {
        return this.add(ShortStyles.opacity, value);
    }
    overflow(value) {
        return this.add(ShortStyles.overflow, value);
    }
    /** Add overflow */
    ov(value) {
        return this.add(ShortStyles.overflow, value);
    }
    overlayColor(value) {
        return this.add(ShortStyles.overlayColor, value);
    }
    /** Add overlayColor */
    ovC(value) {
        return this.add(ShortStyles.overlayColor, value);
    }
    paddingBottom(value) {
        return this.add(ShortStyles.paddingBottom, value);
    }
    /** Add paddingBottom */
    paB(value) {
        return this.add(ShortStyles.paddingBottom, value);
    }
    paddingHorizontal(value) {
        return this.add(ShortStyles.paddingHorizontal, value);
    }
    /** Add paddingHorizontal */
    paH(value) {
        return this.add(ShortStyles.paddingHorizontal, value);
    }
    paddingLeft(value) {
        return this.add(ShortStyles.paddingLeft, value);
    }
    /** Add paddingLeft */
    paL(value) {
        return this.add(ShortStyles.paddingLeft, value);
    }
    paddingRight(value) {
        return this.add(ShortStyles.paddingRight, value);
    }
    /** Add paddingRight */
    paR(value) {
        return this.add(ShortStyles.paddingRight, value);
    }
    paddingTop(value) {
        return this.add(ShortStyles.paddingTop, value);
    }
    /** Add paddingTop */
    paT(value) {
        return this.add(ShortStyles.paddingTop, value);
    }
    paddingVertical(value) {
        return this.add(ShortStyles.paddingVertical, value);
    }
    /** Add paddingVertical */
    paV(value) {
        return this.add(ShortStyles.paddingVertical, value);
    }
    position(value) {
        return this.add(ShortStyles.position, value);
    }
    /** Add position */
    po(value) {
        return this.add(ShortStyles.position, value);
    }
    resizeMode(value) {
        return this.add(ShortStyles.resizeMode, value);
    }
    /** Add resizeMode */
    reM(value) {
        return this.add(ShortStyles.resizeMode, value);
    }
    right(value) {
        return this.add(ShortStyles.right, value);
    }
    /** Add right */
    ri(value) {
        return this.add(ShortStyles.right, value);
    }
    shadowColor(value) {
        return this.add(ShortStyles.shadowColor, value);
    }
    /** Add shadowColor */
    shC(value) {
        return this.add(ShortStyles.shadowColor, value);
    }
    shadowOffset(value) {
        return this.add(ShortStyles.shadowOffset, value);
    }
    shadowOpacity(value) {
        return this.add(ShortStyles.shadowOpacity, value);
    }
    /** Add shadowOpacity */
    shO(value) {
        return this.add(ShortStyles.shadowOpacity, value);
    }
    shadowRadius(value) {
        return this.add(ShortStyles.shadowRadius, value);
    }
    /** Add shadowRadius */
    shR(value) {
        return this.add(ShortStyles.shadowRadius, value);
    }
    textAlign(value) {
        return this.add(ShortStyles.textAlign, value);
    }
    /** Add textAlign */
    teA(value) {
        return this.add(ShortStyles.textAlign, value);
    }
    textAlignVertical(value) {
        return this.add(ShortStyles.textAlignVertical, value);
    }
    /** Add textAlignVertical */
    teAV(value) {
        return this.add(ShortStyles.textAlignVertical, value);
    }
    textDecorationColor(value) {
        return this.add(ShortStyles.textDecorationColor, value);
    }
    /** Add textDecorationColor */
    teDC(value) {
        return this.add(ShortStyles.textDecorationColor, value);
    }
    textDecorationLine(value) {
        return this.add(ShortStyles.textDecorationLine, value);
    }
    /** Add textDecorationLine */
    teDL(value) {
        return this.add(ShortStyles.textDecorationLine, value);
    }
    textDecorationStyle(value) {
        return this.add(ShortStyles.textDecorationStyle, value);
    }
    /** Add textDecorationStyle */
    teDS(value) {
        return this.add(ShortStyles.textDecorationStyle, value);
    }
    textShadowColor(value) {
        return this.add(ShortStyles.textShadowColor, value);
    }
    /** Add textShadowColor */
    teSC(value) {
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
    textShadowRadius(value) {
        return this.add(ShortStyles.textShadowRadius, value);
    }
    /** Add textShadowRadius */
    teSR(value) {
        return this.add(ShortStyles.textShadowRadius, value);
    }
    tintColor(value) {
        return this.add(ShortStyles.tintColor, value);
    }
    /** Add tintColor */
    tiC(value) {
        return this.tintColor(value);
    }
    top(value) {
        return this.add(ShortStyles.top, value);
    }
    /** Add top */
    to(value) {
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
    width(value) {
        return this.add(ShortStyles.width, value);
    }
    /** Add width */
    wi(value) {
        return this.width(value);
    }
    writingDirection(value) {
        return this.add(ShortStyles.writingDirection, value);
    }
    /** Add writingDirection */
    wrD(value) {
        return this.add(ShortStyles.writingDirection, value);
    }
    zIndex(value) {
        return this.add(ShortStyles.zIndex, value);
    }
    /** Add zIndex */
    zI(value) {
        return this.add(ShortStyles.zIndex, value);
    }
    //** override all css with this class styles*/
    importantAll() {
        if (this.value.indexOf(" !important") == -1)
            this.value += " !important";
        return this;
    }
    // make value !important eg bac-red-!important
    importantValue() {
        this.value += "-!important";
        return this;
    }
}
// specific only for nested StyleSheet
export class CSSStyleSheetStyle extends CSSStyle {
    constructor() {
        super(...arguments);
        this.eqs = [];
    }
    //** override all css with this class styles*/
    importantAll() {
        if (this.value.indexOf(" !important") == -1)
            this.value += " !important";
        return this;
    }
    // make value !important eg bac-red-!important
    importantValue() {
        this.value += "-!important";
        return this;
    }
    /** Used in NestedStyleSheet */
    getEqs(parentKey, item) {
        let items = [];
        for (let value of (item !== null && item !== void 0 ? item : this).eqs) {
            let k = `${parentKey}_${value.index}`;
            if (typeof value.index == "string" && value.index != "last")
                k = `${parentKey} > ${value.index}`;
            let css = value.css;
            if (value.css instanceof CSSStyleSheetStyle) {
                if (value.css.eqs && value.css.eqs.length > 0)
                    items = [...items, ...this.getEqs(k, value.css)];
            }
            items.push({ key: k, css: css.toString() });
        }
        return items;
    }
}
//# sourceMappingURL=CSSStyle.js.map