import * as React from "react";
import { DropdownItem, DropdownRefItem } from "../Typse";
export declare const DropdownList: React.ForwardRefExoticComponent<import("../Typse").StyledProps & {
    items: DropdownItem[];
    render?: (item: DropdownItem) => React.ReactNode;
    onSelect?: (item: DropdownItem) => void;
    selectedValue?: any;
    mode?: "Modal" | "ActionSheet" | "Fold";
    placeHolder?: string;
    selectedItemCss?: string;
    size?: number | `${number}%`;
    enableSearch?: boolean;
    textInputPlaceHolder?: string;
    onSearch?: (items: DropdownItem, txt: string) => boolean;
} & React.RefAttributes<DropdownRefItem>>;
