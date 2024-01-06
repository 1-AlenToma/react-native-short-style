var StyleSheet = require('react-native').StyleSheet;
var NestedStyleSheet = /** @class */ (function () {
    function NestedStyleSheet() {
    }
    NestedStyleSheet.create = function (obj) {
        var result = {};
        for (var key in obj) {
            var styleObj = obj[key];
            var styleObjKeys = Object.keys(styleObj);
            result[key] = StyleSheet.create(styleObj);
        }
        return result;
    };
    return NestedStyleSheet;
}());
export default NestedStyleSheet;
//# sourceMappingURL=NestedStyleSheet.js.map