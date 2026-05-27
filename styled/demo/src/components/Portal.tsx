import { View } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { ifSelector, newId, optionalStyle } from "../config";
import * as React from "react";
import { PortalProps } from "../Typse";
import { globalData } from "../theme/ThemeContext";
import { useId } from "../hooks";

export const Portal = (props: PortalProps) => {
    const id = useId();
    globalData.portals.addElem(props.id ?? id, { visible: props.visible ?? true, children: props.children });
    React.useEffect(() => {
        return () => globalData.portals.clean(id);
    }, [])


    return null;

}