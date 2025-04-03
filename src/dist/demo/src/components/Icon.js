import * as React from "react";
import * as Icons from "@expo/vector-icons";
import { CreateView } from "./ReactNativeComponents";
import { useTimer } from "../hooks";
import { flatStyle } from "../config";
let styledItems = {};
export const Icon = (props) => {
    var _a;
    const [flash, setFlash] = React.useState(undefined);
    const timer = useTimer(1000);
    let TypeIcon = Icons[props.type];
    TypeIcon.displayName = props.type;
    let Ico = (_a = styledItems[props.type]) !== null && _a !== void 0 ? _a : (styledItems[props.type] = CreateView(TypeIcon, "Icon"));
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
    return (React.createElement(Ico, Object.assign({}, props, { style: stl })));
};
//# sourceMappingURL=Icon.js.map