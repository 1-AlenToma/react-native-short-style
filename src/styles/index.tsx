import cssTranslator, { serilizeCssStyle } from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as allowedKeys from "./ValidViewStylesAttributes";
import * as React from "react";
import * as reactNative from "react-native";
import { getClasses } from "../config/Methods"
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
    let translatedStyle = serilizeCssStyle(this.styleFile);
    for (let k of keys) {
      if (k.trim().endsWith(".") || k.trim().length == 0)
        continue;

      if (this.css.indexOf(` ${k} `) === -1 && k in translatedStyle)
        this.css += `${k.trim()} `;
    }
    return this;
  }

  classes() {
    return getClasses(this.css, this.styleFile);
  }

  distinct() {
    let items = new CSS("").add(
      ...this.css.split(" ")
    );
    return items.css;
  }

  toString() {
    return this.distinct();
  }
}
let CSSContext = React.createContext({});
let StyledWrapper = React.forwardRef(
  (
    {
      View,
      styleFile,
      name,
      style,
      css,
      ...props
    }: any,
    ref
  ) => {
    let ec = React.useContext(CSSContext) as any;
    let [_, setUpdater] = React.useState(0);
    let parsedData = React.useRef({
      style: undefined,
      pk: undefined
    }).current;
    const validKeyStyle = View.displayName
      ? allowedKeys[View.displayName]
      : undefined;

    React.useEffect(() => {
      parsedData.style = undefined;
      setUpdater(x => (x > 1000 ? 1 : x) + 1);
    }, [css]);

    if (
      styleFile &&
      parsedData.style == undefined
    ) {
      let sArray = [];
      let pk = "";
      let cpyCss = new CSS(styleFile, css);
      pk = ec.parentKey ? ec.parentKey() : "";
      if (pk.length > 0 && !pk.endsWith("."))
        pk += ".";
      pk += name;
      cpyCss.add(name, pk);
      if (ec.parentClassNames) {
        cpyCss.add(
          ec.parentClassNames(
            name,
            cpyCss.toString()
          )
        );
        css = cpyCss.toString();
      }
      let tCss = cssTranslator(
        cpyCss.toString(),
        styleFile,
        validKeyStyle
      );
      if (tCss) sArray.push(tCss);
      parsedData.style = sArray;
      parsedData.pk = pk;
    }

    let cValue = {
      parentKey: () => parsedData.pk,
      parentClassNames: (
        name: string,
        pk: string
      ) => {
        let ss = new CSS(css).add(pk);
        if (!css) return "";
        let c = new CSS(styleFile);
        for (let s of ss.classes()) {
          let m = ` ${s}.${name}`;
          c.add(m, styleFile);
        }
        return c.toString();
      }
    };
    return (
      <CSSContext.Provider value={cValue}>
        <View
          {...props}
          ref={ref}
          name={parsedData.pk}
          style={[
            ...toArray(parsedData.style),
            ...toArray(style)
          ]}
        />
      </CSSContext.Provider>
    );
  }
);

export type Styled = {
  css?: string;
  ifTrue?: (()=> boolean | boolean)
};

const Styleable = function <T>(
  View: T,
  styleFile: any,
  identifier?: string
) {
  identifier = identifier ?? (View as any).displayName;
  if (!identifier || identifier.trim().length<=1)
      throw "react-native-short-style needs an identifier"
  let fn = React.forwardRef((props, ref) => {
    let pr = {
      View,
      name: identifier,
      styleFile
    };
    return (
      <StyledWrapper
        {...props}
        {...pr}
        ref={ref}
      />
    );
  });
  return fn as any as T & Styled;
};

export {
  Styleable,
  NestedStyleSheet,
  cssTranslator
};
