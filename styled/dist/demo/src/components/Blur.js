import { jsx as _jsx } from "react/jsx-runtime";
import { AnimatedTouchableOpacity, AnimatedView } from "./ReactNativeComponents";
import { useLocalMemo } from "../hooks";
export const Blur = (props) => {
    let hProps = { ...props };
    const { mem } = useLocalMemo();
    const Component = props.onPress ? AnimatedTouchableOpacity : AnimatedView;
    const onPress = mem((event) => {
        props?.onPress?.(event);
    }, props.onPress);
    if (!hProps.onPress && hProps.activeOpacity === undefined)
        hProps.activeOpacity = 1;
    if (props.onPress)
        hProps.onPress = onPress;
    return (_jsx(Component, { inspectDisplayName: "Blur", ...hProps, css: mem(x => x.cls("_blur").joinRight(hProps.css), hProps.css) }));
};
//# sourceMappingURL=Blur.js.map