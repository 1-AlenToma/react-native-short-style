import * as React from "react";
import { ToolTipRef } from "../Typse";
export declare const ToolTip: React.ForwardRefExoticComponent<import("../Typse").StyledProps & {
    text: string | React.ReactNode;
    children: React.ReactNode;
    containerStyle?: import("../Typse").ViewStyle | string;
    postion?: "Top" | "Bottom";
} & React.RefAttributes<ToolTipRef>>;
