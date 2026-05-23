import * as React from "react";
import { ToolTipRef } from "../Typse";
export declare const ToolTip: React.ForwardRefExoticComponent<import("..").StyledProps & {
    text: string | React.ReactNode;
    children: React.ReactNode;
    containerStyle?: import("..").ViewStyle | string;
    postion?: "Top" | "Bottom";
} & React.RefAttributes<ToolTipRef>>;
