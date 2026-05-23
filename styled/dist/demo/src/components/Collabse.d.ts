import * as React from "react";
import { DropdownRefItem } from "../Typse";
export declare const Collabse: React.ForwardRefExoticComponent<import("..").StyledProps & {
    defaultActive?: boolean;
    text?: string | React.ReactNode;
    icon?: React.ReactNode;
    headerStyle?: import("..").CSS_String | import("..").ViewStyle;
    children: React.ReactNode;
    onActiveStateChange?: (isActive: boolean) => void;
    lazyLoading?: boolean;
} & React.RefAttributes<DropdownRefItem>>;
