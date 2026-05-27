import { jsx as _jsx } from "react/jsx-runtime";
import { View } from "./ReactNativeComponents";
import createState from "../States";
import { useLocalMemo } from "../hooks";
export const ReadyView = (props) => {
    const state = createState(() => ({
        size: undefined
    })).ignore("size").timeout(props.timeout ?? 100).build();
    const { mem } = useLocalMemo();
    return (_jsx(View, { ...props, css: x => x.fl(1).joinRight(props.css), onLayout: mem((event) => {
            state.size = event.nativeEvent.layout;
            props.onLayout?.(event);
        }, props.onLayout), children: state.size ? props.children : null }));
};
//# sourceMappingURL=ReadyView.js.map