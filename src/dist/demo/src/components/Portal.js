import { View } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "react-smart-state";
import { ifSelector, newId, optionalStyle } from "../config";
import * as React from "react";
export const Portal = (props) => {
    const state = StateBuilder({
        id: newId()
    }).build();
    const context = React.useContext(InternalThemeContext);
    React.useEffect(() => {
        let fn = ifSelector(props.ifTrue) !== false ? context.add.bind(context) : context.remove.bind(context);
        fn(state.id, (React.createElement(View, { key: state.id, css: `zi:1 ${optionalStyle(props.css).c}`, style: props.style }, props.children)), true);
        return () => context.remove(state.id);
    });
    return null;
};
//# sourceMappingURL=Portal.js.map