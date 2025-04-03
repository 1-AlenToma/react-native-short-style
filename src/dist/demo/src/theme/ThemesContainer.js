import { ThemeContext, globalData, InternalThemeContext } from "./ThemeContext";
import * as React from "react";
import StateBuilder from "react-smart-state";
import { newId, clearAllCss } from "../config";
import { View, AlertView, ToastView } from "../components";
import { Platform } from "react-native";
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
    return (React.createElement(View, { css: x => x.cls("_topPostion").zI("$zi-lg"), ifTrue: items.length > 0 }, items.map(([key, value], i) => (React.createElement(React.Fragment, { key: key }, value.el)))));
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
    return (items.map(([key, value], i) => (React.createElement(React.Fragment, { key: key }, value.el))));
};
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
                item.el = (React.createElement(StaticItem, { id: id, item: element, onMounted: (fn) => item.onchange = fn }));
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
    return (React.createElement(InternalThemeContext.Provider, { value: contextValue },
        React.createElement(View, { onLayout: (event) => {
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
            }, style: { backgroundColor: "transparent", flex: 1, width: "100%", height: "100%" } },
            React.createElement(StaticFullView, null),
            React.createElement(StaticView, null),
            React.createElement(ToastView, null),
            React.createElement(AlertView, null),
            React.createElement(View, { style: {
                    width: "100%",
                    height: "100%",
                    zIndex: 1
                } }, children))));
};
export const ThemeContainer = (props) => {
    globalData.hook("window");
    const state = StateBuilder({
        selectedIndex: props.selectedIndex
    }).build();
    React.useEffect(() => {
        let events = globalData.appStart();
        if (props.storage)
            globalData.storage = props.storage;
        return () => events.forEach(x => x.remove());
    }, []);
    React.useEffect(() => {
        if (props.storage)
            globalData.storage = props.storage;
    }, [props.storage]);
    if (state.selectedIndex != props.selectedIndex) {
        clearAllCss();
        state.selectedIndex = props.selectedIndex;
    }
    return (React.createElement(ThemeContext.Provider, { value: props },
        React.createElement(ThemeInternalContainer, null, props.children)));
};
//# sourceMappingURL=ThemesContainer.js.map