import * as React from "react";
import * as Icons from "@expo/vector-icons";
import { IConProps } from "../Typse";
import { CreateView, View } from "./ReactNativeComponents";

let styledItems = {};
export const Icon = (props: IConProps) => {
    let TypeIcon = Icons[props.type]
    TypeIcon.displayName = props.type;
    let Ico: (props: IConProps) => React.ReactNode = styledItems[props.type] ?? (styledItems[props.type] = CreateView<any, any>(TypeIcon, "Icon"));

    return (
        <Ico {...props} />
    );
};