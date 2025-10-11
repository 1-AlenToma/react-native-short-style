import { jsx as _jsx } from "react/jsx-runtime";
import { View } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { ifSelector, newId, optionalStyle } from "../config";
import * as React from "react";
export const Portal = (props) => {
    const state = StateBuilder(() => ({
        id: newId()
    })).build();
    const context = React.useContext(InternalThemeContext);
    React.useEffect(() => {
        let fn = ifSelector(props.ifTrue) !== false ? context.add.bind(context) : context.remove.bind(context);
        fn(state.id, (_jsx(View, { css: `zi:1 ${optionalStyle(props.css).c}`, style: props.style, children: props.children }, state.id)), true);
        return () => context.remove(state.id);
    });
    return null;
};
//# sourceMappingURL=Portal.js.map