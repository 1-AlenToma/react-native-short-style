import * as React from "react";
import { IThemeContext, GlobalState, InternalThemeContext as internalThemeContext, StyleContextType } from "../Typse";
import StateBuilder from "react-smart-state";
import { Dimensions } from "react-native";

export const ThemeContext = React.createContext({
    selectedIndex: 0,
    themes: []
} as IThemeContext);

// --- Context ---
export const StyleContext = React.createContext<StyleContextType>({
    rules: [],
    path: [],
});

export const InternalThemeContext = React.createContext({
    add: (id: string, element: React.ReactNode, isStattic?: boolean) => { },
    remove: (id: string) => { },
    totalItems: () => 1
} as internalThemeContext)


export const globalData = StateBuilder<GlobalState>({
    storage: new Map() as any,
    tStorage: new Map() as any,
    activePan: false,
    panEnabled: true,
    icons: undefined,
    containerSize: { height: 0, width: 0 },
    alertViewData: {
        data: undefined,
        toastData: undefined,
        toast: (props) => {
            if (typeof props == "object")
                globalData.alertViewData.toastData = props;
            else globalData.alertViewData.toastData = {
                message: props
            }
        },
        alert: (props) => {
            if (typeof props == "object")
                globalData.alertViewData.data = props;
            else globalData.alertViewData.data = {
                message: props
            }
        },
        confirm: (props) => {
            if (typeof props == "object")
                globalData.alertViewData.data = props;
            else globalData.alertViewData.data = {
                message: props
            }
            return new Promise<boolean>((r) => {
                globalData.alertViewData.data.callBack = r;
            });
        }
    },
    screen: Dimensions.get("screen"),
    window: Dimensions.get("window"),
    appStart: () => {
        let timer = undefined;
        const $this: GlobalState = globalData as any;
        let onSizeChanged = ({ window, screen }) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                $this.window = window;
                $this.screen = screen;
            }, 1);

        }

        let windowChangeEvent = Dimensions.addEventListener("change", onSizeChanged);

        return [
            windowChangeEvent
        ]
    }
}).timeout(undefined).ignore(
    "alertViewData.data",
    "alertViewData.toastData",
    "storage",
    "tStorage",
    "icons").globalBuild();
