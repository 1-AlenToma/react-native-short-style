import { jsx as _jsx } from "react/jsx-runtime";
import { AnimatedTouchableOpacity, AnimatedView } from "./ReactNativeComponents";
export const Blur = (props) => {
    let hProps = { ...props };
    const Component = props.onPress ? AnimatedTouchableOpacity : AnimatedView;
    const onPress = (event) => {
        props?.onPress?.(event);
    };
    if (!hProps.onPress && hProps.activeOpacity === undefined)
        hProps.activeOpacity = 1;
    if (props.onPress)
        hProps.onPress = onPress;
    return (_jsx(Component, { inspectDisplayName: "Blur", ...hProps, css: x => x.cls("_blur").joinRight(hProps.css) }));
};
//# sourceMappingURL=Blur.js.map