import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TouchableOpacity, Text } from "./ReactNativeComponents";
import * as React from "react";
import { ifSelector, RemoveProps } from "../config";
import { useTimer } from "../hooks";
export const Button = (props) => {
    var _a;
    const [shadow, setShadow] = React.useState("sh-sm");
    const disabled = ifSelector(props.disabled);
    const timer = useTimer((_a = props.whilePressedDelay) !== null && _a !== void 0 ? _a : 300);
    const pressableProps = Object.assign({}, props);
    const onPress = (event) => {
        timer.clear();
        event.preventDefault();
        event.stopPropagation();
        props.onPress(event);
    };
    const onLongPress = (event) => {
        var _a;
        (_a = props.onLongPress) === null || _a === void 0 ? void 0 : _a.call(props, event);
        const fn = () => {
            props.whilePressed();
            timer(fn);
        };
        fn();
    };
    const onPressOut = (event) => {
        var _a;
        (_a = props.onPressOut) === null || _a === void 0 ? void 0 : _a.call(props, event);
        timer.clear();
    };
    if (disabled === true) {
        RemoveProps(pressableProps, "onPress", "onLongPress", "onPressIn", "onPressOut");
        pressableProps.activeOpacity = 0.5;
    }
    else if (props.whilePressed) {
        delete pressableProps.whilePressed;
        pressableProps.onPress = onPress;
        pressableProps.onLongPress = onLongPress;
        pressableProps.onPressOut = onPressOut;
    }
    const onMouseEnter = (event) => {
        var _a;
        setShadow("sh-md");
        (_a = props.onMouseEnter) === null || _a === void 0 ? void 0 : _a.call(props, event);
    };
    const onMouseLeave = (event) => {
        var _a;
        setShadow("sh-sm");
        (_a = props.onMouseLeave) === null || _a === void 0 ? void 0 : _a.call(props, event);
    };
    return (_jsxs(TouchableOpacity, Object.assign({}, pressableProps, { onMouseLeave: onMouseLeave, onMouseEnter: onMouseEnter, css: x => x.cls(shadow, "_button button").joinRight(props.css).if(disabled, x => x.cls("disabled")), children: [props.icon, _jsx(Text, { ifTrue: props.text != undefined, css: x => x.cls("fos-xs").joinRight(props.textCss), children: props.text })] })));
};
//# sourceMappingURL=Button.js.map