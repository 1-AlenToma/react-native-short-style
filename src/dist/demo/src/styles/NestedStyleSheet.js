import { CSSStyleSheetStyle } from "./CSSStyle";
import { parseKeys, newId } from "../config/CSSMethods";
class NestedStyleSheet {
    static create(obj) {
        let keysItems = Object.keys(obj);
        let oItem = obj;
        while (keysItems.length > 0) {
            let key = keysItems.shift();
            let value = obj[key];
            if (value && typeof value == "function") {
                value = value(new CSSStyleSheetStyle());
            }
            if (value && value instanceof CSSStyleSheetStyle) {
                let eqs = value.getEqs(key);
                oItem[key] = value = value.toString();
                for (let v of eqs) {
                    if (!oItem[v.key]) {
                        oItem[v.key] = v.css;
                        keysItems.push(v.key);
                    }
                }
            }
            if (value && typeof value == "function") {
                oItem[key] = value = value(new CSSStyleSheetStyle()).toString();
            }
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
            }
            else if (key.indexOf("$") != -1) {
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
            }
        }
        return oItem;
    }
}
;
export default NestedStyleSheet;
//# sourceMappingURL=NestedStyleSheet.js.map