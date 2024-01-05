import cssTranslator from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as React from "react";
let toArray = (item: any) => {
  if (!item) return [];
  if (Array.isArray(item)) return item;
  return [item];
};
let context = React.createContext({});
let StyledWrapper = ({
  View,
  styleFile,
  name,
  children,
  style,
  css,
  ...props
}: any) => {
  let ec = React.useContext(context);
  let [_, setUpdater] = React.useState(0);
  let parsedData = React.useRef({
    style: undefined,
    pk: undefined
  }).current;

  React.useEffect(() => {
    parsedData.current.style = undefined;
    setUpdater(x => x + 1);
  }, [style, css]);

  if (
    styleFile &&
    parsedData.current.style == undefined
  ) {
    let sArray = toArray(style);
    let pk = "";
    let cpyCss = css;
    pk = ec.parentKey ? ec.parentKey() : "";
    if (pk.length > 0 && !pk.endsWith("."))
      pk += ".";
    pk += name;
    if (!cpyCss) cpyCss = "";
    if (pk !== name)
      cpyCss = "$" + `${pk} ${name} ${cpyCss}`;
    else cpyCss = `${name} ${cpyCss}`;
    if (ec.parentClassNames) {
      cpyCss += ec.parentClassNames(name, cpyCss);
      css = cpyCss;
    }
    let tCss = cssTranslator(cpyCss, styleFile);
    if (tCss) sArray.push(tCss);
    parsedData.current.style = sArray;
    parsedData.current.pk = pk;
  }

  let cValue = {
    parentKey: () => pk,
    parentClassNames: (
      name: string,
      pk: string
    ) => {
      let ss = (css || "") + " " + pk;
      if (!css) return "";
      let c = "";
      for (let s of ss
        .split(" ")
        .filter(x => x.trim().length > 0)) {
        if (
          s.indexOf(":") === -1 &&
          s.indexOf("$") === -1
        ) {
          let m = ` ${s}.${name}`;
          c += ` ${m}.${pk}`;
          c += m;
        }
      }
      return c;
    }
  };

  return (
    <context.Provider value={cValue}>
      <View
        {...props}
        name={parsedData.current.pk}
        style={parsedData.current.style}>
        {children}
      </View>
    </context.Provider>
  );
};

type Styled = {
  css?: string;
};

const Styleable = function <T>(
  View: T,
  identifier: string,
  styleFile: any
) {
  let fn = function ({ ...props }: any) {
    let pr = {
      View,
      name: identifier,
      styleFile
    };
    return (
      <StyledWrapper
        {...props}
        {...pr}
      />
    );
  };
  return fn as any as T & T<Styled>;
};

export { Styleable, NestedStyleSheet };
