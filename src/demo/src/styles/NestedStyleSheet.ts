import * as ReactNative from "react-native";
import { serilizeCssStyle } from "./cssTranslator";
type NamedStyles<T> = { [P in keyof T]: ReactNative.ViewStyle | ReactNative.TextStyle | ReactNative.ImageStyle | string };
class NestedStyleSheet {
  static create<T extends NamedStyles<T> | NamedStyles<any>>(obj: T & NamedStyles<any>): { [key: string]: number } {
    for (let key in obj) {
      if (key.indexOf("[") != -1 && key.split(".").length > 1) {
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
    var result = serilizeCssStyle(obj);
    return result;
  }
};

export default NestedStyleSheet;