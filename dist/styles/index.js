var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import cssTranslator from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import * as allowedKeys from "./ValidViewStylesAttributes";
import * as React from "react";
var toArray = function (item) {
    if (!item)
        return [];
    if (Array.isArray(item))
        return item;
    return [item];
};
var CSS = /** @class */ (function () {
    function CSS(css) {
        this.css = " " + (css || "").trim() + " ";
    }
    CSS.prototype.add = function () {
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var k = keys_1[_a];
            if (k.trim().endsWith(".") ||
                k.trim().length == 0)
                continue;
            if (this.css.indexOf(" " + k + " ") === -1)
                this.css += k.trim() + " ";
        }
        return this;
    };
    Object.defineProperty(CSS.prototype, "classes", {
        get: function () {
            var items = [];
            var _loop_1 = function (s) {
                if (s.indexOf(":") === -1 &&
                    s.indexOf("$") === -1 &&
                    !items.find(function (x) { return x == s; })) {
                    items.push(s);
                }
            };
            for (var _i = 0, _a = this.css
                .split(" ")
                .filter(function (x) { return x.trim().length > 0; }); _i < _a.length; _i++) {
                var s = _a[_i];
                _loop_1(s);
            }
            return items;
        },
        enumerable: false,
        configurable: true
    });
    CSS.prototype.distinct = function () {
        var _a;
        var items = (_a = new CSS("")).add.apply(_a, this.css.split(" "));
        return items.css;
    };
    CSS.prototype.toString = function () {
        return this.distinct();
    };
    return CSS;
}());
var CSSContext = React.createContext({});
var StyledWrapper = function (_a) {
    var View = _a.View, styleFile = _a.styleFile, name = _a.name, style = _a.style, css = _a.css, props = __rest(_a, ["View", "styleFile", "name", "style", "css"]);
    var ec = React.useContext(CSSContext);
    var _b = React.useState(0), _ = _b[0], setUpdater = _b[1];
    var parsedData = React.useRef({
        style: undefined,
        pk: undefined
    }).current;
    var validKeyStyle = View.displayName ? allowedKeys[View.displayName] : undefined;
    React.useEffect(function () {
        parsedData.style = undefined;
        setUpdater(function (x) { return (x > 1000 ? 1 : x) + 1; });
    }, [style, css]);
    if (styleFile &&
        parsedData.style == undefined) {
        var sArray = toArray(style);
        var pk = "";
        var cpyCss = new CSS(css);
        pk = ec.parentKey ? ec.parentKey() : "";
        if (pk.length > 0 && !pk.endsWith("."))
            pk += ".";
        pk += name;
        cpyCss.add(name, pk);
        if (ec.parentClassNames) {
            cpyCss.add(ec.parentClassNames(name, cpyCss.toString()));
            css = cpyCss.toString();
        }
        var tCss = cssTranslator(cpyCss.toString(), styleFile, validKeyStyle);
        if (tCss)
            sArray.push(tCss);
        parsedData.style = sArray;
        parsedData.pk = pk;
    }
    var cValue = {
        parentKey: function () { return parsedData.pk; },
        parentClassNames: function (name, pk) {
            var ss = new CSS(css).add(pk);
            if (!css)
                return "";
            var c = new CSS();
            for (var _i = 0, _a = ss.classes; _i < _a.length; _i++) {
                var s = _a[_i];
                var m = " " + s + "." + name;
                c.add(m);
            }
            return c.toString();
        }
    };
    return (React.createElement(CSSContext.Provider, { value: cValue },
        React.createElement(View, __assign({}, props, { name: parsedData.pk, style: parsedData.style }))));
};
var Styleable = function (View, identifier, styleFile) {
    var fn = function (_a) {
        var props = __rest(_a, []);
        var pr = {
            View: View,
            name: identifier,
            styleFile: styleFile
        };
        return (React.createElement(StyledWrapper, __assign({}, props, pr)));
    };
    return fn;
};
export { Styleable, NestedStyleSheet, cssTranslator };
//# sourceMappingURL=index.js.map