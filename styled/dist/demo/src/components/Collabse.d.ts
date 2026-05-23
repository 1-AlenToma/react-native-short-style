import * as React from "react";
import { DropdownRefItem } from "../Typse";
export declare const Collabse: React.ForwardRefExoticComponent<import("../Typse").StyledProps & {
    defaultActive?: boolean;
    text?: string | React.ReactNode;
    icon?: React.ReactNode;
    headerStyle?: import("../Typse").CSS_String | import("../Typse").ViewStyle;
    children: React.ReactNode;
    onActiveStateChange?: (isActive: boolean) => void;
    lazyLoading?: boolean;
} & React.RefAttributes<DropdownRefItem>>;
