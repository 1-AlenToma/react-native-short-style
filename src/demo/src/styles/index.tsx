import cssTranslator from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as React from "react";
import * as reactNative from "react-native";
import { ifSelector, newId, currentTheme, refCreator, setRef, HElement, toArray } from "../config";
import { ThemeContext, globalData } from "../theme/ThemeContext";
import { ButtonProps, DomPath, InternalStyledProps, StyledProps } from "../Typse";
import { CSSStyle, CSSProps } from "./CSSStyle";
import { ValueIdentity } from "../config/CSSMethods";

const eventKeys: Record<string, boolean> = {
  cRef: true,
  // Touch and gesture
  onPress: true,
  onLongPress: true,
  onPressIn: true,
  onPressOut: true,
  onStartShouldSetResponder: true,
  onMoveShouldSetResponder: true,
  onResponderGrant: true,
  onResponderMove: true,
  onResponderRelease: true,
  onResponderTerminate: true,
  onTouchStart: true,
  onTouchMove: true,
  onTouchEnd: true,
  onTouchCancel: true,

  // Layout
  onLayout: true,

  // Focus and accessibility
  onFocus: true,
  onBlur: true,
  onAccessibilityTap: true,
  onMagicTap: true,
  onAccessibilityEscape: true,

  // ScrollView / FlatList
  onScroll: true,
  onMomentumScrollBegin: true,
  onMomentumScrollEnd: true,
  onScrollBeginDrag: true,
  onScrollEndDrag: true,
  onContentSizeChange: true,

  // Text Input
  onChangeText: true,
  onChange: true,
  onEndEditing: true,
  onSelectionChange: true,
  onSubmitEditing: true,
  onKeyPress: true,
  onTextInput: true,

  // Image
  onLoad: true,
  onLoadEnd: true,
  onLoadStart: true,
  onError: true,
  onPartialLoad: true,
  onProgress: true,

  // Animation
  onAnimationEnd: true,
  onLayoutAnimationEnd: true,

  // Keyboard (native Android/iOS or web)
  onKeyDown: true,
  onKeyUp: true,
};


function assignRf(item: DomPath<any, InternalStyledProps>, props: InternalStyledProps): DomPath<any, any> {
  item._elemntsProps = props;
  if (!item._elementsChildren)
    item._elementsChildren = [];
  item.___HTMLELEMENT = new HElement(item);
  item.querySelector = item.___HTMLELEMENT.querySelector.bind(item.___HTMLELEMENT);
  item.querySelectorAll = item.___HTMLELEMENT.querySelectorAll.bind(item.___HTMLELEMENT);
  return item;
}

class CSS {
  css: string;
  styleFile: any;
  constructor(styleFile: any, css?: string) {
    this.css = ` ${(css || "").trim()} `;
    this.styleFile = styleFile;
  }

  append(css: string) {
    if (css && css.length > 0) {
      //    console.log(css, "this", this.css)
      this.css = this.css.replace(css, "");
    }
    this.add(css)
    return this;
  }

  add(...keys: string[]) {
    for (let k of keys) {
      if (!k || k == "undefined")
        continue;
      if (k.trim().endsWith(".") || k.trim().length == 0)
        continue;
      k = k.trim();
      if (this.css.indexOf(` ${k} `) === -1 && (k in this.styleFile || ValueIdentity.has(k)))
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
      if (this.css.indexOf(` ${k} `) === -1 && (k in this.styleFile || ValueIdentity.has(k)))
        this.css = `${k.trim()} ` + this.css;
    }

    return this;
  }

  classes() {
    return ValueIdentity.getClasses(this.css, this.styleFile);
  }

  distinct() {
    let items = new CSS(this.styleFile, "").add(
      ...ValueIdentity.splitCss(this.css)
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
  views: DomPath<any, any> = {
    _elementsChildren: []
  }
  constructor(viewName) {
    this.viewName = viewName;
  }

  setViews(item: DomPath<any, any>) {
    let children = this.views._elementsChildren;
    this.views = item;
    this.views._elementsChildren = children;
  }

  registerView(item: DomPath<any, any>) {
    if (!this.views._elementsChildren.includes(item))
      this.views._elementsChildren.push(item);
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
    let classNames = ValueIdentity.getClasses(this.cleanCss(), this.styleFile, this.prevContext?.indexOf?.(this.id) ?? undefined);
    return classNames;
  }

  join() {
    if (!this.changed())
      if (this.prevCSS != undefined)
        return this.cpyCss;

    let itemIndex = this.prevContext?.indexOf?.(this.id);
    let isLast = this.prevContext?.isLast?.(this.id);
    let name = this.viewName;
    let parent = new CSS(this.styleFile, this.prevContext.join?.());
    let cpyCss = new CSS(this.styleFile, this.cleanCss())
    if (itemIndex != undefined)
      for (let s of this.classNames()) {
        cpyCss.prepend(` ${s}_${itemIndex}`);
        if (isLast)
          cpyCss.prepend(` ${s}_last`);
      }

    for (let s of parent.classes()) {
      if (itemIndex != undefined)
        cpyCss.prepend(` ${s}.${name}_${itemIndex}`);
      cpyCss.prepend(` ${s}.${name}`);

      if (isLast)
        cpyCss.prepend(` ${s}_last`);
    }

    cpyCss.prepend(name, itemIndex != undefined ? `${name}_${itemIndex}` : "", this.viewPath()).add(this.cleanCss());

    this.prevCSS = this.getCss();

    return (this.cpyCss = cpyCss.toString());
  }
}



let CSSContext = React.createContext<InternalStyledContext>({} as any);

class StyledComponent extends React.Component<CSSProps<InternalStyledProps> & { cRef: any, themeContext: any, activePan?: boolean }, {}> {
  static contextType = CSSContext;
  refItem: {
    id: string,
    contextValue: InternalStyledContext,
    style: any[],
    selectedThemeIndex: number,
    currentStyle: any,
    init: boolean,
    nextProps: any,
  }


  getExtraProps() {
    let keys = Object.keys(this.props ?? {});
    let data = {};
    for (let k of keys) {
      if (k in eventkeys && this[k])
        data[k] = this[k].bind(this);
    }
    return data;
  }

  getNextProps() {
    return this.refItem.nextProps ?? this.props ?? {};
  }

  componentDidMount() {
    this.refItem.init = true;
  }


  validateProps(a: any, b: any) {
    for (let k in a) {
      let v1 = a[k];
      let v2 = b[k];
      if (eventKeys[k]) {
        // console.log("no need to check", k)
        continue;
      }

      if (v1 !== v2) {
        return true;
      }
    }

    return false;
  }


  shouldComponentUpdate(nextProps: Readonly<StyledProps & { readonly View: any; readonly viewPath: string; readonly fullParentPath?: string; readonly classNames?: string[]; } & { refererId?: string; } & { cRef: (c) => void; themeContext: any; activePan?: boolean; }>, nextState: Readonly<{}>, nextContext: any): boolean {
    return this.validateUpdate(nextProps);
  }

  validateUpdate(nextProps) {
    let props: CSSProps<InternalStyledProps> & { cRef: any, themeContext: any } = { ...nextProps }
    if (props?.themeContext != undefined) {
      if (props.themeContext.selectedIndex !== this.props.themeContext.selectedIndex) {
        this.refItem.currentStyle = currentTheme(props.themeContext);
        return true;
      }
      delete props.themeContext;
    }


    if ("css" in props) {
      if (this.update({ ...this.props, ...nextProps })) {
        return true;
      }
      delete props.css;
    }

    if (this.validateProps(this.props, nextProps))
      return true;
    if (this.refItem.nextProps)
      Object.assign(this.refItem.nextProps, nextProps);
    else this.refItem.nextProps = nextProps;
    return false;

  }

  constructor(props) {
    super(props);
    this.refItem = {
      id: newId(),
      contextValue: new InternalStyledContext(this.props.viewPath),
      style: undefined,
      selectedThemeIndex: this.props.themeContext.selectedIndex,
      currentStyle: currentTheme(props.themeContext),
      init: false,
      nextProps: {}
    }
  }

  getContext() {
    return this.context as any;
  }

  componentWillUnmount() {
    this.refItem.init = false;
    this.getContext().remove?.(this.refItem.id);
  }

  update(props: any) {
    let css = props?.css ?? "";
    this.refItem.contextValue.update(this.refItem.id, css, props, this.refItem.currentStyle, this.context as any);
    if (this.refItem.contextValue.changed() || this.refItem.selectedThemeIndex != this.props.themeContext.selectedIndex) {
      this.refItem.style = undefined;
      this.refItem.contextValue.prevCSS = undefined;
      this.refItem.selectedThemeIndex = this.props.themeContext.selectedIndex;
      return true;
    }
    return false;
  }
  myRef = null;
  cRef(c: any) {
    if (c === null)
      return;
    if (c === this.myRef) {
      return;
    }
    try {
      const props = this.getNextProps();
      if (reactNative.Platform.OS != "web") {
        let item = assignRf((c ?? {}) as DomPath<any, any>, { ...props, css: this.refItem.contextValue.getCss() });
        this.refItem.contextValue.setViews(item);
        (this.context as any)?.registerView?.(item);// to parent
        setRef(props.cRef, item);
      } else setRef(props.cRef, c);
    } catch (e) {
      console.error(e)
    } finally {
      this.myRef = c;
    }
  }

  render() {
    let context: any = this.context;
    context?.register?.(this.refItem.id);
    const isText = this.props.View.displayName && this.props.View.displayName == "Text" && reactNative.Platform.OS == "web";
    this.update(this.props);
    if ((this.refItem.currentStyle && this.refItem.style == undefined)) {
      let sArray = [];
      let cpyCss = this.refItem.contextValue.join();
      let tCss = cssTranslator(cpyCss, this.refItem.currentStyle, undefined);
      if (tCss._props)
        this.refItem.contextValue.cssProps = { ...tCss._props }
      else this.refItem.contextValue.cssProps = {};
      delete tCss._props;
      if (tCss) sArray.push(tCss);
      this.refItem.style = sArray;
    }


    let styles = [
      isText && this.props.activePan ? { userSelect: "none" } : {},
      ...toArray(this.refItem.style),
      ...toArray(this.props.style),
      ...toArray(this.refItem.contextValue.cssProps?.style)
    ];

    if (this.refItem.contextValue.cssProps?.style) {
      delete this.refItem.contextValue.cssProps.style;
    }

    let rProps = { ...this.props, ...this.refItem.contextValue.cssProps, style: styles };
    const refererId = this.refItem.contextValue.cssProps?.refererId ?? this.props.refererId;
    if (refererId && this.props.themeContext.referers) {
      let ref = this.props.themeContext.referers.find(x => x.id == refererId);
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
    this.refItem.nextProps = { ...rProps };
    if (ifSelector(rProps.ifTrue) === false) {
      return null;
    }

    const dataSet = __DEV__ && reactNative.Platform.OS == "web" && this.refItem.contextValue.cpyCss ? { css: "__DEV__ CSS:" + this.refItem.contextValue.cpyCss } : undefined;

    return (
      <CSSContext.Provider value={this.refItem.contextValue}>
        <this.props.View
          dataSet={dataSet}
          viewPath={this.props.viewPath}
          {...rProps}
          {...this.getExtraProps()}
          ref={this.cRef.bind(this)}
        />
      </CSSContext.Provider>
    );
  }
}

for (let eventKey in eventKeys) {
  if (eventKey !== "cRef")
    StyledComponent.prototype[eventKey] = function (...args: any[]) {
      return this.getNextProps()?.[eventKey]?.(...args); // Or this.refItem.nextProps[eventKey], if defined
    };
}

export class StyledItem {
  view: any;
  viewPath: string;

  render(props: CSSProps<InternalStyledProps> & ButtonProps & reactNative.TouchableOpacityProps & reactNative.ViewProps, ref: any) {
    const View = this.view;
    const viewPath = this.viewPath;
    let themecontext = React.useContext(ThemeContext);

    const isText = View.displayName && View.displayName == "Text" && reactNative.Platform.OS == "web";
    if (isText)
      globalData.hook("activePan")

    if (themecontext == undefined)
      throw "Error ThemeContext must be provided with its themes and default style";

    const activePan = isText ? globalData.activePan : undefined;


    return (
      <StyledComponent {...props} activePan={activePan} View={View} viewPath={viewPath} themeContext={themecontext} cRef={(c) => setRef(ref, c)} />
    )

  }
}



const Styleable = function <T>(
  View: T,
  identifier: string
) {
  if (!identifier || identifier.trim().length <= 1)
    throw "react-native-short-style needs an identifier"

  let item = new StyledItem();
  item.view = View;
  item.viewPath = identifier;
  const memView = refCreator<T & StyledProps>(item.render.bind(item), identifier, View);
  return memView;
};

export {
  Styleable,
  NestedStyleSheet,
  cssTranslator
};

export * from "./CSSStyle";
