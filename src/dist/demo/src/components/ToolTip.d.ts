import * as React from "react";
import { ToolTipRef } from "../Typse";
import * as Native from "react-native";
export declare const ToolTip: React.ForwardRefExoticComponent<import("../Typse").StyledProps & {
    text: string | React.ReactNode;
    children: React.ReactNode;
    containerStyle?: (false | Native.ViewStyle | Native.RegisteredStyle<Native.ViewStyle> | Native.RecursiveArray<false | Native.ViewStyle | Native.RegisteredStyle<Native.ViewStyle>>) | string;
    postion?: "Top" | "Bottom";
} & React.RefAttributes<ToolTipRef>>;
