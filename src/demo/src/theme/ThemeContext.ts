import * as React from "react";
import { IThemeContext, GlobalState, InternalThemeContext as internalThemeContext } from "../Typse";
import StateBuilder from "react-smart-state";
import { Dimensions } from "react-native";

export const ThemeContext = React.createContext({
    selectedIndex: 0,
    themes: []
} as IThemeContext);

export const InternalThemeContext = React.createContext({
    add: (id: string, element: React.ReactNode) => { },
    remove: (id: string) => { },
    totalItems:()=> 1
} as internalThemeContext)


export const globalData = StateBuilder<GlobalState>({
    screen: Dimensions.get("screen"),
    window: Dimensions.get("window"),
    appStart: () => {
        const $this: GlobalState = globalData as any;
        let onSizeChanged = ({ window, screen }) => {
            $this.window = window;
            $this.screen = screen;
        }

        let windowChangeEvent = Dimensions.addEventListener("change", onSizeChanged);

        return [
            windowChangeEvent
        ]
    }
}).globalBuild();