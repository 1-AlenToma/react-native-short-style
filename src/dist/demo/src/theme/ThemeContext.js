import * as React from "react";
import StateBuilder from "react-smart-state";
import { Dimensions } from "react-native";
export const ThemeContext = React.createContext({
    selectedIndex: 0,
    themes: []
});
export const InternalThemeContext = React.createContext({
    add: (id, element, isStattic) => { },
    remove: (id) => { },
    totalItems: () => 1
});
var timer = undefined;
export const globalData = StateBuilder({
    storage: new Map(),
    tStorage: new Map(),
    activePan: false,
    panEnabled: true,
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
        const $this = globalData;
        let onSizeChanged = ({ window, screen }) => {
            $this.window = window;
            $this.screen = screen;
        };
        let windowChangeEvent = Dimensions.addEventListener("change", onSizeChanged);
        return [
            windowChangeEvent
        ];
    }
}).ignore("alertViewData.data", "alertViewData.toastData", "storage", "tStorage").globalBuild();
//# sourceMappingURL=ThemeContext.js.map