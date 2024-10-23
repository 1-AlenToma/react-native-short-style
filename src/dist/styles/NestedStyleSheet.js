import * as ReactNative from "react-native";
console.warn(ReactNative.StyleSheet);
class NestedStyleSheet {
    static create(obj) {
        var result = {};
        for (var key in obj) {
            var styleObj = obj[key];
            var styleObjKeys = Object.keys(styleObj);
            result[key] = ReactNative.StyleSheet.create(styleObj);
        }
        return result;
    }
}
export default NestedStyleSheet;
//# sourceMappingURL=NestedStyleSheet.js.map