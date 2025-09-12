import { jsx as _jsx } from "react/jsx-runtime";
import { AnimatedTouchableOpacity, AnimatedView } from "./ReactNativeComponents";
export const Blur = (props) => {
    let hProps = Object.assign({}, props);
    const Component = props.onPress ? AnimatedTouchableOpacity : AnimatedView;
    const onPress = (event) => {
        var _a;
        (_a = props === null || props === void 0 ? void 0 : props.onPress) === null || _a === void 0 ? void 0 : _a.call(props, event);
    };
    if (!hProps.onPress && hProps.activeOpacity === undefined)
        props.activeOpacity = 1;
    if (props.onPress)
        hProps.onPress = onPress;
    return (_jsx(Component, Object.assign({}, hProps, { css: x => x.cls("_blur").joinRight(hProps.css) })));
};
//# sourceMappingURL=Blur.js.map