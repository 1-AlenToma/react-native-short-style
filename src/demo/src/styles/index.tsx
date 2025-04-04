import cssTranslator, { serilizeCssStyle, clearCss } from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as React from "react";
import * as reactNative from "react-native";
import { ifSelector, newId, currentTheme, refCreator, setRef, hasString, eqString } from "../config";
import { ThemeContext, globalData } from "../theme/ThemeContext";
import { ButtonProps, DomPath, InternalStyledProps, StyledProps } from "../Typse";
import { CSSStyle, CSSProps } from "./CSSStyle";
import { extractProps, ValueIdentity } from "../config/CSSMethods";

function advancedSplit(input) {
  const result = [];
  let current = '';
  let inBracket = false;
  let inParen = false;
  let quoteChar = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (quoteChar) {
      current += char;
      if (char === quoteChar) {
        quoteChar = null;
      }
    } else if (char === '"' || char === "'") {
      current += char;
      quoteChar = char;
    } else if (char === '[') {
      inBracket = true;
      current += char;
    } else if (char === ']') {
      inBracket = false;
      current += char;
    } else if (char === '(') {
      inParen = true;
      current += char;
    } else if (char === ')') {
      inParen = false;
      current += char;
    } else if (char === ',' && !inBracket && !inParen && !quoteChar) {
      if (current.trim()) result.push(current.trim());
      result.push('or');
      current = '';
    } else if (char === ' ' && !inBracket && !inParen && !quoteChar) {
      if (current.trim()) {
        result.push(current.trim());
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) result.push(current.trim());

  return result;
}


function parseAttributes(selector) {
  const attrPattern = /\[([a-zA-Z0-9_-]+)\s*(\*?=)\s*(['"])(.*?)\3\]/g;
  const pseudoPattern = /:contains\s*\(\s*(['"])(.*?)\1\s*\)/g;

  const result = {};
  let match;

  // Extract attributes like [href='value'] or [name*='value']
  while ((match = attrPattern.exec(selector)) !== null) {
    const [, key, operator, , value] = match;
    result[key] = { text: value, valid: operator };
  }

  // Extract pseudo-class :contains('value')
  while ((match = pseudoPattern.exec(selector)) !== null) {
    const [, , value] = match;
    result["contains"] = { text: value, valid: "*=" };
  }

  return result;
}


function attrIsValid(item: DomPath<any, InternalStyledProps>, attr: any) {
  let res = true;

  for (let k in attr) {

    if (res == false)
      break;

    let value = attr[k].text;
    let validator = attr[k].valid;
    if (k == "contains")
      k = "children";
    let kValue = item._elemntsProps[k];
    const getText = () => {
      if (!kValue)
        return kValue;

      if (k == "children" && typeof kValue != "string") {
        kValue = kValue["props"]?.["children"];
        return getText();
      }
      return kValue;
    }

    switch (validator) {
      case "*=":
        res = hasString(getText(), value);
        break;
      case "!=":
        res = !eqString(getText(), value);
        break;
      default:
        res = eqString(getText(), value);
        break;
    }
  }

  return res;
}




function assignRf(item: DomPath<any, InternalStyledProps>, props: InternalStyledProps): DomPath<any, any> {
  item._elemntsProps = props;
  if (!item._elementsChildren)
    item._elementsChildren = [];

  if (reactNative.Platform.OS == "web")
    return item; // those methods already exist.
  item.querySelector = function (selector: string, parentItems?: any[]) {
    try {
      let res = this;
      let sl: string[] = advancedSplit(selector);

      for (let str of sl) {
        if (str == "or") {
          if (res != undefined && (!parentItems || !parentItems.includes(res)))
            return res; // already found the first search.
          continue;
        }

        const char = str.startsWith(".") || str.startsWith("#") ? str[0] : undefined;
        let select = char ? str.substring(1) : str;
        const attibutes = parseAttributes(select);
        if (select.indexOf(":") != -1)
          select = select.substring(0, select.indexOf(":")).trim();
        if (select.indexOf("[") != -1)
          select = select.substring(0, select.indexOf("[")).trim();
        let tItem = res;
        switch (char) {
          case "#":
            res = tItem._elementsChildren?.find(x => eqString(x._elemntsProps.viewId, select) && attrIsValid(x, attibutes) && (!parentItems || !parentItems.includes(x)));
            break;
          case ".":
            res = tItem._elementsChildren?.find(x => hasString(x._elemntsProps.css, select) && attrIsValid(x, attibutes) && (!parentItems || !parentItems.includes(x)));
            break;
          default:
            console.log(select)
            res = tItem._elementsChildren?.find(x => eqString(x._elemntsProps.viewPath, select) && attrIsValid(x, attibutes) && (!parentItems || !parentItems.includes(x)));
            break;
        }

        if (res == undefined) {
          for (let x of tItem._elementsChildren) {
            res = x.querySelector(str, parentItems);
            if (res)
              break;
          }
        }

        if (res == undefined) {
          break;
        }

      }
      return res && res !== this && (!parentItems || !parentItems.includes(res)) ? res : undefined;
    } catch (e) {
      console.error(e)
      return undefined;
    }
  }

  item.querySelectorAll = function (selector: string) {
    let results: DomPath<any, any>[] = [];
    let temp = undefined;
    let sl: string[] = advancedSplit(selector);
    const selectors = [""];
    for (let str of sl) {
      if (str != "or")
        selectors[selectors.length - 1] += ` ${str}`;
      else selectors.push("")
    }
    for (let s of selectors.filter(x => x.trim().length > 0))
      while ((temp = this.querySelector(s, results))) {
        results.push(temp);
      }
    return results;
  }
  item.querySelector = item.querySelector.bind(item);
  item.querySelectorAll = item.querySelectorAll.bind(item);
  return item;
}

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

  append(css: string) {
    if (css && css.length > 0) {
      console.log(css, "this", this.css)
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
    init: boolean
  }



  componentDidMount() {
    this.refItem.init = true;
  }

  shouldComponentUpdate(nextProps, _) {
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


    // delete props.ifTrue


    for (let k in props) {
      let v1 = props[k];
      let v2 = this.props[k];

      if (v1 !== v2) {
        return true;
      }
    }
    return false
  }

  constructor(props) {
    super(props);
    this.refItem = {
      id: newId(),
      contextValue: new InternalStyledContext(this.props.viewPath),
      style: undefined,
      selectedThemeIndex: this.props.themeContext.selectedIndex,
      currentStyle: currentTheme(props.themeContext),
      init: false
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

  render() {
    let context: any = this.context;
    context?.register?.(this.refItem.id);
    const isText = this.props.View.displayName && this.props.View.displayName == "Text" && reactNative.Platform.OS == "web";
    this.update(this.props);
    if ((this.refItem.currentStyle && this.refItem.style == undefined)) {
      let sArray = [];
      let cpyCss = this.refItem.contextValue.join();
      let tCss = cssTranslator(
        cpyCss,
        this.refItem.currentStyle,
        undefined
      );
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

    if (ifSelector(rProps.ifTrue) === false) {
      return null;
    }

    return (
      <CSSContext.Provider value={this.refItem.contextValue}>
        <this.props.View
          dataSet={{ css: reactNative.Platform.OS == "web" && this.refItem.contextValue.cpyCss && __DEV__ ? "__DEV__ CSS:" + this.refItem.contextValue.cpyCss : "" }}
          viewPath={this.props.viewPath}
          {...rProps}
          ref={(c) => {
            try {
              if (c) {
                let item = assignRf((c ?? {}) as DomPath<any, any>, { ...rProps, css: this.refItem.contextValue.getCss() });
                this.refItem.contextValue.setViews(item);
                context?.registerView?.(item);// to parent
                setRef(this.props.cRef, item);
              } else setRef(this.props.cRef, null);
            } catch (e) {
              console.error(e)
            }
          }}
        />
      </CSSContext.Provider>
    );
  }
}



class StyledItem {
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

    return (
      <StyledComponent {...props} activePan={isText ? globalData.activePan : undefined} View={View} viewPath={viewPath} themeContext={themecontext} cRef={ref} />
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
  return refCreator<T & StyledProps>(item.render.bind(item), identifier, View);
};

export {
  Styleable,
  NestedStyleSheet,
  cssTranslator
};

export * from "./CSSStyle";
