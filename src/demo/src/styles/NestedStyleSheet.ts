import * as ReactNative from "react-native";
import { CSSStyle, CSSStyleSheetStyle } from "./CSSStyle";

type NamedStyles<T> = { [P in keyof T]: ReactNative.ViewStyle | ReactNative.TextStyle | ReactNative.ImageStyle | string | ((x: CSSStyleSheetStyle) => CSSStyle) };

const validKeys = (key: string) => {
  if (key.startsWith("."))
    throw `style key(${key}) cannot start with .`;
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
      key = key.replace(/((( )?)+)?([>:,*|!^~=\[\]])((( )?)+)/g, (_, __, ___, g1: any, g2: any, g3: any) => {
        //console.log(g1, g2, g3)
        return `${(g1?.length ?? 0) >= 0 && [">", "*"].includes(g2) ? " " : ""}${g2}${(g3?.length ?? 0) >= 0 && [">", "*"].includes(g2) ? " " : ""}`
      }).trim()// clean key, remove space etc when needed

      if (value && typeof value == "string")
        value = value.trim();
      oItem[key] = value;
      if (value && typeof value == "function") {
        value = value(new CSSStyleSheetStyle()) as any;
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
        oItem[key] = value = value(new CSSStyleSheetStyle()).toString().trim();
      }


      /*
            if (key.indexOf("$$") != -1) {
              let keys = parseKeys(key);
              let randomKey = newId();
              delete obj[key];
              key = randomKey;
              oItem[randomKey] = value;
              keys.forEach(x => {
                if (!oItem[x])
                  oItem[x] = randomKey;
              });
            } else if (key.indexOf("$") != -1) {
              value = obj[key];
              delete obj[key];
              key = key.replace(/\$/g, ".");
              oItem[key] = value;
            }
      
      
            if (key.indexOf("[") != -1 || key.split(".").length > 1) {
              let sKey = "";
              for (let k of key.split(".")) {
                sKey += "." + k;
                if (sKey.startsWith("."))
                  sKey = sKey.substring(1);
                if (!(sKey in obj))
                  oItem[sKey] = "";
              }
            }
      
      if (value && typeof value == "string" && value.indexOf("!important") !== -1) {
        oItem[key] = value.replace("!important", "");
        let newKey = `${key}.important`;
        oItem[newKey] = true;
      }*/
    }

    return oItem;
  }
};

export default NestedStyleSheet;