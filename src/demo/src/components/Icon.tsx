import * as React from "react";
import * as Icons from "@expo/vector-icons";
import { IConProps } from "../Typse";
import { ifSelector } from "../config/Methods";
import { CreateView } from "./ReactNativeComponents";

let styledItems = {};
export const Icon =(props: IConProps) => {
    Icons[props.type].displayName = props.type;
    let Ico : (props: IConProps)=> React.ReactNode = styledItems[props.type] ? styledItems[props.type] : (styledItems[props.type] = CreateView<any, any>(Icons[props.type], "Icon"))
    

    return (
        <Ico {...props} />
    );
};