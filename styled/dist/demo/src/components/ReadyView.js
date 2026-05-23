import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { View } from "./ReactNativeComponents";
import createState from "../States";
export const ReadyView = (props) => {
    const state = createState(() => ({
        size: undefined
    })).ignore("size").timeout(props.timeout ?? 100).build();
    React.useEffect(() => {
    }, [state.size]);
    return (_jsx(View, { ...props, css: x => x.fl(1).joinRight(props.css), onLayout: (event) => {
            state.size = event.nativeEvent.layout;
            props.onLayout?.(event);
        }, children: state.size ? props.children : null }));
};
//# sourceMappingURL=ReadyView.js.map