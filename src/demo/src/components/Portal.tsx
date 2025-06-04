import { View } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { ifSelector, newId, optionalStyle } from "../config";
import * as React from "react";
import { PortalProps } from "../Typse";

export const Portal = (props: PortalProps) => {
    const state = StateBuilder(() => ({
        id: newId()
    })).build();
    const context = React.useContext(InternalThemeContext);


    React.useEffect(() => {
        let fn = ifSelector(props.ifTrue) !== false ? context.add.bind(context) : context.remove.bind(context);
        fn(state.id, (
            <View key={state.id} css={`zi:1 ${optionalStyle(props.css).c}`} style={props.style}>
                {props.children}
            </View>
        ), true);

        return () => context.remove(state.id);
    })


    return null;

}