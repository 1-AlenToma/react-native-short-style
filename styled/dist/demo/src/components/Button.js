import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TouchableOpacity, Text } from "./ReactNativeComponents";
import * as React from "react";
import { ifSelector, RemoveProps } from "../config";
import { useLocalMemo, useTimer } from "../hooks";
import { Platform } from "react-native";
export const Button = (props) => {
    const [shadow, setShadow] = React.useState("sh-sm");
    const disabled = ifSelector(props.disabled);
    const timer = useTimer(props.whilePressedDelay ?? 300);
    const pressableProps = { ...props };
    const { mem } = useLocalMemo();
    const onPress = mem((event) => {
        timer.clear();
        event.preventDefault();
        event.stopPropagation();
        props.onPress(event);
    }, props.onPress);
    const onLongPress = mem((event) => {
        props.onLongPress?.(event);
        const fn = () => {
            props.whilePressed();
            timer(fn);
        };
        fn();
    }, props.onLongPress, props.whilePressed);
    const onPressOut = mem((event) => {
        props.onPressOut?.(event);
        timer.clear();
    }, props.onPressOut);
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
    const onMouseEnter = mem((event) => {
        if (Platform.OS == "web" || Platform.OS == "windows" || Platform.OS == "macos")
            setShadow("sh-md");
        props.onMouseEnter?.(event);
    }, props.onMouseEnter, shadow);
    const onMouseLeave = mem((event) => {
        if (Platform.OS == "web" || Platform.OS == "windows" || Platform.OS == "macos")
            setShadow("sh-sm");
        props.onMouseLeave?.(event);
    }, props.onMouseLeave, shadow);
    return (_jsxs(TouchableOpacity, { inspectDisplayName: "Button", ...pressableProps, onMouseLeave: onMouseLeave, onMouseEnter: onMouseEnter, css: mem(x => x.cls(shadow, "_button button").joinRight(props.css).if(disabled, x => x.cls("disabled")), props.css, shadow, disabled), children: [props.icon, _jsx(Text, { ifTrue: props.text != undefined, css: mem(x => x.cls("fos-xs").joinRight(props.textCss), props.textCss), children: props.text })] }));
};
//# sourceMappingURL=Button.js.map