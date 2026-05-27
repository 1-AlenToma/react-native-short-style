import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { CreateView } from "./helper";
import { useTimer } from "../hooks";
import { flatStyle } from "../config";
import { globalData } from "../theme/ThemeContext";
let styledItems = {};
export const Icon = (props) => {
    const [flash, setFlash] = React.useState(undefined);
    const timer = useTimer(props.flashSpeed ?? 1000);
    let TypeIcon = globalData.icons[props.type];
    if (props.flash && TypeIcon)
        timer(() => {
            if (flash != props.flash)
                setFlash(props.flash);
            else
                setFlash(props.color);
        });
    let stl = React.useMemo(() => {
        let d = flatStyle(props.style);
        if (flash)
            d.color = flash;
        return d;
    }, [props.style, flash]);
    if (TypeIcon == undefined) {
        console.warn(`Icon type ${props.type} not found`, "please set ThemeContainer.icons to your exported icons");
        return null;
    }
    TypeIcon.displayName = props.type;
    let Ico = styledItems[props.type] ?? (styledItems[props.type] = CreateView(TypeIcon, "Icon"));
    // console.log(Ico, props.type)
    return (_jsx(Ico, { ...props, style: stl }));
};
//# sourceMappingURL=Icon.js.map