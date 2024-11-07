import cssTranslator, { serilizeCssStyle, clearCss } from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as React from "react";
import * as reactNative from "react-native";
import { getClasses, ifSelector, newId, currentTheme, getCssArray } from "../config/Methods"
import buildState from 'react-smart-state';
import { ThemeContext, globalData } from "../theme/ThemeContext";
import { ICSSContext, InternalStyledProps, IThemeContext, StyledProps } from "../Typse";
import { CSSStyle } from "./validStyles";

let toArray = (item: any) => {
  if (!item) return [];
  if (Array.isArray(item)) return item;
  return [item];
};
class CSS {
  css: string;
  styleFile: any;
  constructor(styleFile: any, css?: string) {
    this.css = ` ${(css || "").trim()} `;
    this.styleFile = styleFile;
  }

  add(...keys: string[]) {
    for (let k of keys) {
      if (!k || k == "undefined")
        continue;
      if (k.trim().endsWith(".") || k.trim().length == 0)
        continue;
      k = k.trim();
      if (this.css.indexOf(` ${k} `) === -1 && (k in this.styleFile || k.indexOf(":") != -1 || k.indexOf("-") != -1))
        this.css += `${k.trim()} `;
    }

    return this;
  }

  prepend(...keys: string[]) {
    for (let k of keys) {
      if (!k || k == "undefined")
        continue;
      if (k.trim().endsWith(".") || k.trim().length == 0)
        continue;
      k = k.trim();
      if (this.css.indexOf(` ${k} `) === -1 && (k in this.styleFile || k.indexOf(":") != -1 || k.indexOf("-") != -1))
        this.css = `${k.trim()} ` + this.css;
    }

    return this;
  }

  classes() {
    return getClasses(this.css, this.styleFile);
  }

  distinct() {
    let items = new CSS(this.styleFile, "").add(
      ...getCssArray(this.css)
    );
    return items.css;
  }

  toString() {
    return this.distinct();
  }
}


class InternalStyledContext {
  props: InternalStyledProps;
  prevContext: InternalStyledContext;
  styleFile: any;
  elementposition: number = 0;
  generatedStyle: any;
  prevCSS?: string;
  cpyCss: string;

  getCss() {
    if (this.props.css && typeof this.props.css == "function")
      return this.props.css(new CSSStyle()).toString();
    return (this.props.css ?? "") as string;
  }

  update(props: InternalStyledProps, styleFile: any, prevContext?: InternalStyledContext) {
    this.props = props;
    this.prevContext = prevContext;
    this.styleFile = styleFile;
  }

  changed() {
    return this.getCss() !== this.prevCSS || this.prevContext.changed?.();
  }

  position() {
    let name = this.viewPath();
  }

  viewName() {
    return this.props.viewPath;
  }

  viewPath() {
    let pk = this.prevContext?.viewPath ? this.prevContext.viewPath() ?? "" : "";
    if (pk.length > 0 && !pk.endsWith("."))
      pk += ".";
    pk += this.props.viewPath ?? "";
    return pk;
  }

  classNames() {
    let classNames = getClasses(this.getCss(), this.styleFile);
    return classNames;
  }

  join() {
    if (!this.changed())
      if (this.prevCSS != undefined)
        return this.cpyCss;
    let name = this.viewName();
    let parent = new CSS(this.styleFile, this.prevContext.join?.());
    let cpyCss = new CSS(this.styleFile, this.getCss()).prepend(name, this.viewPath());
    for (let s of parent.classes()) {
      let m = ` ${s}.${name}`;
      cpyCss.add(m);
    }

    this.prevCSS = this.getCss();

    return (this.cpyCss = cpyCss.toString());
  }
}


let CSSContext = React.createContext<InternalStyledContext>({} as any);
let StyledWrapper = React.forwardRef(
  (props: InternalStyledProps, ref) => {
    if (!props.css)
      props.css = "";
    const {
      View,
      viewPath,
      fullParentPath,
      style,
      css,
      classNames
    } = props;
    let ec = React.useContext(CSSContext);
    let themecontext = React.useContext(ThemeContext);
    const styleFile = currentTheme(themecontext);
    const state = buildState({
      id: newId(),
      contextValue: new InternalStyledContext(),
      refItem: {
        style: undefined,
        selectedThemeIndex: themecontext.selectedIndex,
        childrenIds: [],
      }
    }).ignore("refItem", "contextValue").build();

    state.contextValue.update(props, styleFile, ec)
    const isText = View.displayName && View.displayName == "Text" && reactNative.Platform.OS == "web";
    if (isText)
      globalData.hook("activePan")

    if (state.contextValue.changed() || state.refItem.selectedThemeIndex != themecontext.selectedIndex) {
      state.refItem.style = undefined;
      state.contextValue.prevCSS = undefined;
      state.refItem.selectedThemeIndex = themecontext.selectedIndex;
    }

    if (styleFile && state.refItem.style == undefined) {
      let sArray = [];
      let cpyCss = state.contextValue.join();

      let tCss = cssTranslator(
        cpyCss,
        styleFile,
        undefined
      );
      if (tCss) sArray.push(tCss);
      state.refItem.style = sArray;
    }

    if (ifSelector((props as any).ifTrue) === false)
      return null;

    return (
      <CSSContext.Provider value={state.contextValue}>
        <View
          {...props}
          ref={ref}
          style={[
            isText && globalData.activePan ? { userSelect: "none" } : {},
            ...toArray(state.refItem.style),
            ...toArray(style)
          ]}
        />
      </CSSContext.Provider>
    );
  }
);



const Styleable = function <T>(
  View: T,
  identifier: string
) {
  if (!identifier || identifier.trim().length <= 1)
    throw "react-native-short-style needs an identifier"
  let fn = React.forwardRef((props, ref) => {
    let pr = {
      View,
      viewPath: identifier
    };

    return (
      <StyledWrapper
        {...props}
        {...pr}
        ref={ref}
      />
    );
  });
  return fn as any as T & StyledProps;
};

export {
  Styleable,
  NestedStyleSheet,
  cssTranslator
};
