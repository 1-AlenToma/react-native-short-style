import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { CreateView } from "./helper";
import { useTimer } from "../hooks";
import { flatStyle } from "../config";
import { globalData } from "../theme/ThemeContext";
let styledItems = {};
export const Icon = (props) => {
    const [flash, setFlash] = React.useState(undefined);
    const timer = useTimer(1000);
    let TypeIcon = globalData.icons[props.type];
    if (TypeIcon == undefined) {
        console.warn(`Icon type ${props.type} not found`, "please set ThemeContainer.icons to your exported icons");
        return null;
    }
    TypeIcon.displayName = props.type;
    let Ico = styledItems[props.type] ?? (styledItems[props.type] = CreateView(TypeIcon, "Icon"));
    // console.log(Ico, props.type)
    if (props.flash)
        timer(() => {
            if (flash != props.flash)
                setFlash(props.flash);
            else
                setFlash(props.color);
        });
    let stl = flatStyle(props.style);
    if (flash)
        stl.color = flash;
    return (_jsx(Ico, { ...props, style: stl }));
};
//# sourceMappingURL=Icon.js.map