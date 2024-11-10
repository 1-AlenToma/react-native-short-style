import cssTranslator, { serilizeCssStyle, clearCss } from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as React from "react";
import * as reactNative from "react-native";
import { getClasses, ifSelector, newId, currentTheme, getCssArray, refCreator } from "../config";
import buildState from 'react-smart-state';
import { ThemeContext, globalData } from "../theme/ThemeContext";
import { ICSSContext, InternalStyledProps, IThemeContext, StyledProps } from "../Typse";
import { CSSStyle, CSSProps } from "./CSSStyle";
import { extractProps } from "../config/CSSMethods";

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
  cssProps: any = {};
  items: Map<string, string> = new Map();
  id: string = newId();
  viewName: string;
  css: any = undefined;
  constructor(viewName) {
    this.viewName = viewName;
  }
  register(id: string) {
    this.items.set(id, id);
  }

  remove(id: string) {
    this.items.delete(id);
  }

  indexOf(id: string) {
    return [...this.items.values()].indexOf(id);
  }

  isLast(id: string) {
    let items = [...this.items.values()];
    return items.indexOf(id) == items.length - 1;
  }


  getCss() {
    if (this.css && typeof this.css == "function")
      return this.css(new CSSStyle()).toString();
    return (this.css ?? "") as string;
  }

  cleanCss() {
    return this.getCss();
    let item = extractProps(this.getCss());
    if (item._hasValue) {
      this.cssProps = { ...item }
      delete this.cssProps.css;
    }

    return item.css;
  }

  update(id: string, css: any, props: InternalStyledProps, styleFile: any, prevContext?: InternalStyledContext) {
    this.id = id;
    this.props = props;
    this.prevContext = prevContext;
    this.styleFile = styleFile;
    this.css = css;
  }

  changed() {
    return this.getCss() !== this.prevCSS || this.prevContext.changed?.();
  }

  position() {
    let name = this.viewPath();
  }

  viewPath() {
    let pk = this.prevContext?.viewPath ? this.prevContext.viewPath() ?? "" : "";
    if (pk.length > 0 && !pk.endsWith("."))
      pk += ".";
    pk += this.viewName ?? "";
    return pk ?? "";
  }

  classNames() {
    let classNames = getClasses(this.cleanCss(), this.styleFile, this.prevContext?.indexOf?.(this.id) ?? undefined);
    return classNames;
  }

  join() {
    if (!this.changed())
      if (this.prevCSS != undefined)
        return this.cpyCss;

    let itemIndex = this.prevContext?.indexOf?.(this.id);
    let isLast = this.prevContext?.isLast?.(this.id);
    //  console.log(itemIndex, this.prevContext?.isLast?.(this.id))
    let name = this.viewName;
    let parent = new CSS(this.styleFile, this.prevContext.join?.());
    let cpyCss = new CSS(this.styleFile, this.cleanCss())
    for (let s of this.classNames()) {
      cpyCss.prepend(` ${s}_${itemIndex}`);
      if (isLast)
        cpyCss.add(` ${s}_last`);
    }

    for (let s of parent.classes()) {
      cpyCss.prepend(` ${s}.${name}_${itemIndex}`);
      cpyCss.add(` ${s}.${name}`);

      if (isLast)
        cpyCss.add(` ${s}_last`);
    }

    cpyCss.prepend(name, `${name}_${itemIndex}`, this.viewPath());

    this.prevCSS = this.getCss();

    return (this.cpyCss = cpyCss.toString());
  }
}


let CSSContext = React.createContext<InternalStyledContext>({} as any);


class StyledItem {
  view: any;
  viewPath: string;

  render(props: CSSProps<InternalStyledProps>, ref: any) {
    let css = props.css ?? "";
    const View = this.view;
    const viewPath = this.viewPath;
    const {
      style
    } = props;

    let ec = React.useContext(CSSContext);
    let themecontext = React.useContext(ThemeContext);
    const styleFile = currentTheme(themecontext);
    const state = buildState({
      id: newId(),
      contextValue: new InternalStyledContext(viewPath),
      refItem: {
        style: undefined,
        selectedThemeIndex: themecontext.selectedIndex,
        childrenIds: [],
      }
    }).ignore("refItem", "contextValue").build();
    ec?.register?.(state.id);
    const update = () => {
      css = props.css ?? "";
      state.contextValue.update(state.id, css, props, styleFile, ec);
    }

    update();
    const isText = View.displayName && View.displayName == "Text" && reactNative.Platform.OS == "web";

    if (isText)
      globalData.hook("activePan")

    if (state.contextValue.changed() || state.refItem.selectedThemeIndex != themecontext.selectedIndex) {
      state.refItem.style = undefined;
      state.contextValue.prevCSS = undefined;
      state.refItem.selectedThemeIndex = themecontext.selectedIndex;
    }

    React.useEffect(() => {
      () => ec?.remove?.(state.id);
    }, [])

    React.useEffect(() => {
      update();
      if (state.contextValue.changed() || state.refItem.selectedThemeIndex != themecontext.selectedIndex) {
        state.refItem.style = undefined;
        state.contextValue.prevCSS = undefined;

      }
    }, [props.css])

    /*  React.useEffect(() => {
  
        console.log(state.id, viewPath, css)
      })*/

    if ((styleFile && state.refItem.style == undefined)) {
      let sArray = [];
      let cpyCss = state.contextValue.join();
      let tCss = cssTranslator(
        cpyCss,
        styleFile,
        undefined
      );
      if (tCss._props)
        state.contextValue.cssProps = { ...tCss._props }
      else state.contextValue.cssProps = {};
      delete tCss._props;
      if (tCss) sArray.push(tCss);
      state.refItem.style = sArray;
    }

    let styles = [
      isText && globalData.activePan ? { userSelect: "none" } : {},
      ...toArray(state.refItem.style),
      ...toArray(style),
      ...toArray(state.contextValue.cssProps?.style)
    ];

    if (state.contextValue.cssProps?.style) {
      delete state.contextValue.cssProps.style;
    }

    let rProps = { ...props, ...state.contextValue.cssProps, style: styles };
    const refererId = state.contextValue.cssProps?.refererId ?? props.refererId;
    if (refererId && themecontext.referers) {
      let ref = themecontext.referers.find(x => x.id == refererId);
      if (!ref) {
        if (__DEV__)
          console.warn("referer with id", refererId, "could not be found");
      }
      else {
        if (ref.func) {
          try {
            rProps = ref.func(rProps);
          } catch (e) {
            if (__DEV__)
              console.error(e);
          }
        }
      }

    }



    if (ifSelector(rProps.ifTrue) === false) {
      return null;
    }

    return (
      <CSSContext.Provider value={state.contextValue}>
        <View
          dataSet={{ css: reactNative.Platform.OS == "web" && state.contextValue.cpyCss && __DEV__ ? "__DEV__ CSS:" + state.contextValue.cpyCss : "" }}
          viewPath={viewPath}
          {...rProps}
          ref={ref}
        />
      </CSSContext.Provider>
    );
  }
}



const Styleable = function <T>(
  View: T,
  identifier: string
) {
  if (!identifier || identifier.trim().length <= 1)
    throw "react-native-short-style needs an identifier"
  let pr = {
    View,
    viewPath: identifier
  };
  let item = new StyledItem();
  item.view = View;
  item.viewPath = identifier;


  return refCreator<T & StyledProps>(item.render.bind(item), identifier, View);
};

export {
  Styleable,
  NestedStyleSheet,
  cssTranslator
};

export * from "./CSSStyle";
