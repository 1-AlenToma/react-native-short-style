import * as ReactNative from "react-native";
import { CSSStyle, CSSStyleSheetStyle } from "./CSSStyle";

type NamedStyles<T> = { [P in keyof T]: ReactNative.ViewStyle | ReactNative.TextStyle | ReactNative.ImageStyle | string | ((x: CSSStyleSheetStyle) => CSSStyle) };

const validKeys = (key: string) => {
  if (key.startsWith("."))
    throw `style key(${key}) cannot start with ${key[0]}`;

  if (key.startsWith("#"))
    console.warn(`style key(${key}) cannot start with ${key[0]}`);
}

export const tryFunc = (value: any, toStr?: boolean) => {
  try {
    value = value(new CSSStyleSheetStyle()) as any;
    if (toStr && value)
      return value.toString().trim();
    return value;
  } catch {
    console.warn("failed to parse", value.toString());
    return value
  }
}

class NestedStyleSheet {
  static create<T extends NamedStyles<T> | NamedStyles<any>>(obj: T & NamedStyles<any>): { [key: string]: number } {
    let keysItems = Object.keys(obj);
    let oItem: any = obj;

    while (keysItems.length > 0) {
      let key = keysItems.shift();
      validKeys(key);
      let value = oItem[key];
      delete oItem[key];
      key = key.replace(
        /\s*(\*=|~=|\^=|\$=|\|=|[>:,|!^~,$*]|=)\s*/g,
        (_, operator, index) => {

          let f = typeof index == "number" && key.charAt(index - 2);
          let s = typeof index == "number" && key.charAt(index + 1);
          // only add spaces around combinators like >, +, ~
          const needsSpace = [">", "~=", "*=", "^=", "|=", "$=", "!=", "=", "*"].includes(operator);
          return needsSpace ? (`${f !== " " ? " " : ""}${operator}${s !== " " ? " " : ""}`) : operator;
        }
      ).trim();

      if (value && typeof value == "string")
        value = value.trim();
      oItem[key] = value;
      if (value && typeof value == "function") {
        value = tryFunc(value);
      }

      if (value && value instanceof CSSStyleSheetStyle) {
        let eqs = value.getEqs(key);
        oItem[key] = value = value.toString().trim();
        for (let v of eqs) {
          if (!oItem[v.key]) {
            oItem[v.key] = v.css;
            keysItems.push(v.key);
          }
        }
      }

      if (value && typeof value == "function") {
        oItem[key] = value = tryFunc(value, true);
      }
    }

    return oItem;
  }
};

class CssStyleSheet {
  static create<T extends NamedStyles<T> | NamedStyles<any>>(path: `${string}.css`): { [key: string]: number } {
    return path as any;
  }

}


export default NestedStyleSheet;