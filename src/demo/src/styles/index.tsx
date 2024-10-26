import cssTranslator, { serilizeCssStyle, clearCss } from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as allowedKeys from "./ValidViewStylesAttributes";
import * as React from "react";
import * as reactNative from "react-native";
import { getClasses, ifSelector, newId, currentTheme } from "../config/Methods"
import buildState from 'react-smart-state';
import { ThemeContext } from "../theme";
import { ICSSContext, StyledProps } from "../Typse";

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
      ...this.css.split(" ")
    );
    return items.css;
  }

  toString() {
    return this.distinct();
  }
}



let CSSContext = React.createContext<ICSSContext>({} as any);
let StyledWrapper = React.forwardRef(
  (
    {
      View,
      parentName,
      style,
      css,
      ...props
    }: any,
    ref
  ) => {
    let ec = React.useContext(CSSContext);
    let themecontext = React.useContext(ThemeContext);
    const styleFile = currentTheme(themecontext);
    const state = buildState({
      updater: "",
      id: newId(),
      refItem: {
        style: undefined,
        css: css,
        newCss: css,
        pk: undefined,
        selectedThemeIndex: themecontext.selectedIndex,
        childrenIds: []
      }
    }).ignore("refItem").build();


    const validKeyStyle = View.displayName
      ? allowedKeys[View.displayName]
      : undefined;
    const position = ec.registerChild?.(state.id, View.displayName ?? parentName) ?? undefined;
 
    React.useEffect(() => {
      if (state.refItem.css != css || state.refItem.selectedThemeIndex != themecontext.selectedIndex) {
        state.refItem.style = undefined;
        state.refItem.selectedThemeIndex = themecontext.selectedIndex;
        state.updater = newId();
      }

      return () => {
        clearCss(state.id);

      }
    }, [css, themecontext.selectedIndex]);

    React.useEffect(() => {
      () => {
        ec.deleteChild?.(state.id);
      }
    });

    let pk = "";
    pk = ec.parentKey ? ec.parentKey() : "";
    if (pk.length > 0 && !pk.endsWith("."))
      pk += ".";
    pk += parentName;
    if (styleFile && state.refItem.style == undefined) {
      let sArray = [];

      let cpyCss = new CSS(styleFile, css);
      if (position != undefined && pk.length > 0) {
        // console.warn(`${pk}[${position}]`)
        cpyCss.prepend(`${pk}[${position}]`);

      }
      cpyCss.prepend(parentName, pk);
      if (ec.parentClassNames) {
        cpyCss.add(
          ec.parentClassNames(
            parentName,
            cpyCss.toString(),
            position
          )
        );
        state.refItem.newCss = cpyCss.toString();
      }
      let tCss = cssTranslator(
        cpyCss.toString(),
        styleFile,
        validKeyStyle,
        state.id
      );
      if (tCss) sArray.push(tCss);
      state.refItem.style = sArray;
      state.refItem.pk = pk;
    }

    const cValue = {
      parentKey: () => {
        return pk;
      },
      registerChild: (id: string, name: string) => {
        if (!state.refItem.childrenIds.find(x => x.id == id && x.name == name))
          state.refItem.childrenIds.push({ id, name })
        return { index: state.refItem.childrenIds.findIndex(x => x.id == id && x.name == name) + 1, name };
      },
      deleteChild: (id: string) => delete state.refItem.childrenIds[id],
      parentClassNames: (
        name: string,
        pk: string,
        elementPosition: { index: number, name: string }
      ) => {
        let ss = new CSS(styleFile, state.refItem.newCss).add(pk);
        if (!css) return "";
        let c = new CSS(styleFile);

        for (let s of ss.classes()) {
          let m = ` ${s}.${name}`;
          c.add(m);
         /* if (elementPosition != undefined) {
            c.add(`${s}.${name}[${elementPosition.index}]`)
          }*/ // not sure how to implement this yet 
        }
        return c.toString();
      }
    };

    return (
      <CSSContext.Provider value={cValue}>
        <View
          {...props}
          ref={ref}
          parentName={pk}
          style={[
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
    if (ifSelector((props as any).ifTrue) === false)
      return null;
    let pr = {
      View,
      parentName: identifier
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
