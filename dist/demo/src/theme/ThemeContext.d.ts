import * as React from "react";
import { IThemeContext, GlobalState, InternalThemeContext as internalThemeContext, StyleContextType } from "../Typse";
export declare const ThemeContext: React.Context<IThemeContext>;
export declare const StyleContext: React.Context<StyleContextType>;
export declare const InternalThemeContext: React.Context<internalThemeContext>;
export declare const globalData: import("react-smart-state").ReturnState<GlobalState> & GlobalState;
