import * as React from "react";
import { IConProps } from "../Typse";
import { CreateView } from "./ReactNativeComponents";
import { useTimer } from "../hooks";
import { flatStyle } from "../config";
import { globalData } from "../theme/ThemeContext";

let styledItems = {};
export const Icon = (props: IConProps) => {
    const [flash, setFlash] = React.useState<any>(undefined);
    const timer = useTimer(1000);
    let TypeIcon = globalData.icons[props.type];
    if (TypeIcon == undefined) {
        console.warn(`Icon type ${props.type} not found`, "please set ThemeContainer.icons to your exported icons");
        return null;
    }
    TypeIcon.displayName = props.type;
    let Ico: (props: IConProps) => React.ReactNode = styledItems[props.type] ?? (styledItems[props.type] = CreateView<any, any>(TypeIcon, "Icon"));
    if (props.flash)
        timer(() => {
            if (flash != props.flash)
                setFlash(props.flash)
            else setFlash(props.color)
        })

    let stl: any = flatStyle(props.style);
    if (flash)
        stl.color = flash;
    return (
        <Ico {...props} style={stl} />
    );
};