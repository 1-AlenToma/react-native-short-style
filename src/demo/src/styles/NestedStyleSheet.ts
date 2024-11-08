import * as ReactNative from "react-native";
import { CSSStyle, CSSStyleSheetStyle } from "./CSSStyle";
type NamedStyles<T> = { [P in keyof T]: ReactNative.ViewStyle | ReactNative.TextStyle | ReactNative.ImageStyle | string | ((x: CSSStyleSheetStyle) => CSSStyle) };

class NestedStyleSheet {
  static create<T extends NamedStyles<T> | NamedStyles<any>>(obj: T & NamedStyles<any>): { [key: string]: number } {
    for (let key in obj) {
      let value = obj[key];
      if (value && typeof value == "function") {
        (obj as any)[key] = value(new CSSStyleSheetStyle()).toString();
      }

      if (key.indexOf("$") != -1) {
        value = obj[key];
        delete obj[key];
        key = key.replace(/\$/g, ".");
        (obj as any)[key] = value;
      }


      if (key.indexOf("[") != -1 || key.split(".").length > 1) {
        let sKey = "";
        for (let k of key.split(".")) {
          sKey += "." + k;
          if (sKey.startsWith("."))
            sKey = sKey.substring(1);
          if (!(sKey in obj))
            (obj as any)[sKey] = "";
        }
      }
    }
    var result = obj as any;
    return result;
  }
};

export default NestedStyleSheet;