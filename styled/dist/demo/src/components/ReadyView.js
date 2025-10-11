import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { View } from "./ReactNativeComponents";
import createState from "../States";
export const ReadyView = (props) => {
    var _a;
    const state = createState(() => ({
        size: undefined
    })).ignore("size").timeout((_a = props.timeout) !== null && _a !== void 0 ? _a : 100).build();
    React.useEffect(() => {
    }, [state.size]);
    return (_jsx(View, Object.assign({}, props, { css: x => x.fl(1).joinRight(props.css), onLayout: (event) => {
            var _a;
            state.size = event.nativeEvent.layout;
            (_a = props.onLayout) === null || _a === void 0 ? void 0 : _a.call(props, event);
        }, children: state.size ? props.children : null })));
};
//# sourceMappingURL=ReadyView.js.map