import * as React from "react";
import { StyledKey } from "../Typse";
import StateBuilder from "react-smart-state";
import { Dimensions, Platform } from "react-native";
export const ThemeContext = React.createContext({
    selectedIndex: 0,
    themes: []
});
// --- Context ---
export const StyleContext = React.createContext({
    rules: [],
    path: [],
});
export const InternalThemeContext = React.createContext({
    add: (id, element, isStattic) => { },
    remove: (id) => { },
    totalItems: () => 1
});
// detect hard reload of the web
const detectHardReload = () => {
    var _a, _b;
    if (window.performance) {
        if (String((_b = (_a = window.performance.getEntriesByType("navigation")[0]) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : "") === "reload") {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
// load and clear the cach if needed
const getWebStorage = () => {
    try {
        if (!__DEV__ && Platform.OS == "web" && typeof window !== "undefined" && window.sessionStorage) {
            let storage = window.sessionStorage;
            let item = {
                delete: (key) => storage.removeItem(key),
                get: (key) => JSON.parse(storage.getItem(key)),
                set: (key, item) => storage.setItem(key, JSON.stringify(item)),
                clear: () => storage.clear(),
                has: (key) => storage.getItem(key) !== null
            };
            if (detectHardReload())
                Object.keys(storage).filter(x => {
                    if (x.startsWith(StyledKey))
                        storage.removeItem(x);
                });
            return item;
        }
        return new Map();
    }
    catch (e) {
        console.warn("Platform Web detected, sessionStorage could not be loaded from window. will be using local object(map) instead", e);
        return new Map();
    }
};
export const globalData = StateBuilder({
    storage: getWebStorage(),
    tStorage: new Map(),
    activePan: false,
    panEnabled: true,
    icons: undefined,
    themeIndex: 0,
    containerSize: { height: 0, width: 0 },
    alertViewData: {
        data: undefined,
        toastData: undefined,
        toast: (props) => {
            if (typeof props == "object")
                globalData.alertViewData.toastData = props;
            else
                globalData.alertViewData.toastData = {
                    message: props
                };
        },
        alert: (props) => {
            if (typeof props == "object")
                globalData.alertViewData.data = props;
            else
                globalData.alertViewData.data = {
                    message: props
                };
        },
        confirm: (props) => {
            if (typeof props == "object")
                globalData.alertViewData.data = props;
            else
                globalData.alertViewData.data = {
                    message: props
                };
            return new Promise((r) => {
                globalData.alertViewData.data.callBack = r;
            });
        }
    },
    screen: Dimensions.get("screen"),
    window: Dimensions.get("window"),
    appStart: () => {
        let timer = undefined;
        const $this = globalData;
        let onSizeChanged = ({ window, screen }) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                $this.window = window;
                $this.screen = screen;
            }, 1);
        };
        let windowChangeEvent = Dimensions.addEventListener("change", onSizeChanged);
        return [
            windowChangeEvent
        ];
    }
}).timeout(undefined).ignore("alertViewData.data", "alertViewData.toastData", "storage", "tStorage", "icons").globalBuild();
//# sourceMappingURL=ThemeContext.js.map