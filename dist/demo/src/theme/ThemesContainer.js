import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemeContext, globalData, InternalThemeContext, StyleContext } from "./ThemeContext";
import * as React from "react";
import StateBuilder from "../States";
import { newId, currentTheme } from "../config";
import { View, AlertView, ToastView } from "../components";
import { Platform } from "react-native";
import { parseSelector } from "../config/CssSelectorParser";
const StaticItem = ({ onMounted, id, item }) => {
    const state = StateBuilder({
        item: item
    }).ignore("item").build();
    onMounted(x => state.item = x);
    return state.item;
};
const StaticFullView = () => {
    const context = React.useContext(InternalThemeContext);
    const state = StateBuilder({
        updater: ""
    }).build();
    context.onItemsChange = () => {
        state.updater = newId();
    };
    const items = [...context.items().items.entries()];
    return (_jsx(View, { css: x => x.cls("_topPostion").zI(".zi-lg"), ifTrue: items.length > 0, children: items.map(([key, value], i) => (_jsx(React.Fragment, { children: value.el }, key))) }));
};
const StaticView = () => {
    const context = React.useContext(InternalThemeContext);
    const state = StateBuilder({
        updater: ""
    }).build();
    context.onStaticItemsChange = () => {
        state.updater = newId();
    };
    const items = [...context.items().staticItems.entries()];
    return (items.map(([key, value], i) => (_jsx(React.Fragment, { children: value.el }, key))));
};
function parseStyles(obj, selectedIndex) {
    const parsedTheme = React.useRef({}).current;
    if (!parsedTheme[selectedIndex] && obj)
        parsedTheme[selectedIndex] = Object.entries(obj).map(([selector, style]) => ({
            selectors: selector.split(",").map((s) => s.trim()),
            parsedSelector: selector.split(",").map(x => parseSelector(x.trim())),
            style,
        }));
    return parsedTheme[selectedIndex];
}
const ThemeInternalContainer = ({ children }) => {
    const state = StateBuilder({
        items: new Map(),
        staticItems: new Map(),
        containerSize: { height: 0, width: 0, y: 0, x: 0 }
    }).ignore("items", "containerSize", "staticItems").build();
    const contextValue = {
        add: (id, element, isStattic) => {
            var _a, _b, _c;
            let item = !isStattic ? state.items.get(id) : state.staticItems.get(id);
            if (!item) {
                item = { onchange: undefined, el: undefined };
                item.el = (_jsx(StaticItem, { id: id, item: element, onMounted: (fn) => item.onchange = fn }));
                if (!isStattic)
                    state.items.set(id, item);
                else
                    state.staticItems.set(id, item);
                if (!isStattic)
                    (_a = contextValue.onItemsChange) === null || _a === void 0 ? void 0 : _a.call(contextValue);
                else
                    (_b = contextValue.onStaticItemsChange) === null || _b === void 0 ? void 0 : _b.call(contextValue);
            }
            else
                (_c = item.onchange) === null || _c === void 0 ? void 0 : _c.call(item, element);
        },
        remove: (id) => {
            var _a, _b;
            let hasItems = state.items.has(id);
            let hasStatic = state.staticItems.has(id);
            if (hasItems)
                state.items.delete(id);
            if (hasStatic)
                state.staticItems.delete(id);
            if (hasItems)
                (_a = contextValue.onItemsChange) === null || _a === void 0 ? void 0 : _a.call(contextValue);
            if (hasStatic)
                (_b = contextValue.onStaticItemsChange) === null || _b === void 0 ? void 0 : _b.call(contextValue);
        },
        totalItems: () => state.items.size,
        items: () => {
            return { items: state.items, staticItems: state.staticItems };
        },
        staticItems: () => state.staticItems,
        onItemsChange: () => { },
        onStaticItemsChange: () => { },
        containerSize: () => state.containerSize
    };
    return (_jsx(InternalThemeContext.Provider, { value: contextValue, children: _jsxs(View, { onLayout: (event) => {
                if (Platform.OS !== "web") {
                    event.target.measure((x, y, width, height) => {
                        state.containerSize.height = height;
                        state.containerSize.width = width;
                        state.containerSize.y = y;
                        state.containerSize.x = x;
                        globalData.containerSize = state.containerSize;
                    });
                }
                else {
                    state.containerSize.height = event.nativeEvent.layout.height;
                    state.containerSize.width = event.nativeEvent.layout.width;
                    state.containerSize.y = event.nativeEvent.layout.y;
                    state.containerSize.x = event.nativeEvent.layout.x;
                    globalData.containerSize = state.containerSize;
                }
            }, style: { backgroundColor: "transparent", flex: 1, width: "100%", height: "100%" }, children: [_jsx(StaticFullView, {}), _jsx(StaticView, {}), _jsx(ToastView, {}), _jsx(AlertView, {}), _jsx(View, { style: {
                        width: "100%",
                        height: "100%",
                        zIndex: 1
                    }, children: children })] }) }));
};
export const ThemeContainer = (props) => {
    var _a;
    globalData.hook("window");
    React.useEffect(() => {
        let events = globalData.appStart();
        if (props.storage)
            globalData.storage = props.storage;
        return () => events.forEach(x => { var _a; return (_a = x === null || x === void 0 ? void 0 : x.remove) === null || _a === void 0 ? void 0 : _a.call(x); });
    }, []);
    if (props.storage && globalData.storage !== props.storage)
        globalData.storage = props.storage;
    if (globalData.themeIndex !== props.selectedIndex)
        globalData.themeIndex = props.selectedIndex;
    if (!globalData.icons)
        globalData.icons = (_a = props.icons) !== null && _a !== void 0 ? _a : {};
    const theme = currentTheme(props);
    // console.log(theme)
    const rules = parseStyles(theme, props.selectedIndex);
    // console.log(rules.filter(x => x.selectors.find(f => f.indexOf("container> Text") != -1)));
    //  console.log(rules.length)
    return (_jsx(StyleContext.Provider, { value: { rules: rules !== null && rules !== void 0 ? rules : [], path: [], parent: undefined }, children: _jsx(ThemeContext.Provider, { value: Object.assign(Object.assign({}, props), { systemThemes: theme }), children: _jsx(ThemeInternalContainer, { children: props.children }) }) }));
};
//# sourceMappingURL=ThemesContainer.js.map