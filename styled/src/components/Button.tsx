import { TouchableOpacity, Text } from "./ReactNativeComponents";
import * as React from "react";
import { ButtonProps } from "../Typse";
import { ifSelector, RemoveProps } from "../config";
import { useLocalMemo, useTimer } from "../hooks";
import { Platform } from "react-native";

export const Button = (props: ButtonProps) => {
    const [shadow, setShadow] = React.useState("sh-sm");
    const disabled = ifSelector(props.disabled);
    const timer = useTimer(props.whilePressedDelay ?? 300);
    const pressableProps = { ...props };
    const { mem, memo } = useLocalMemo();
    const onPress = mem((event: any) => {
        timer.clear();
        event.preventDefault();
        event.stopPropagation();
        props.onPress(event);
    }, props.onPress)

    const onLongPress = mem((event: any) => {
        props.onLongPress?.(event);
        const fn = () => {
            props.whilePressed();
            timer(fn);
        }
        fn();
    }, props.onLongPress, props.whilePressed);

    const onPressOut = mem((event) => {
        props.onPressOut?.(event);
        timer.clear();
    }, props.onPressOut);


    if (disabled === true) {
        RemoveProps(pressableProps, "onPress", "onLongPress", "onPressIn", "onPressOut");
        pressableProps.activeOpacity = 0.5;
    } else if (props.whilePressed) {
        delete pressableProps.whilePressed;
        pressableProps.onPress = onPress;
        pressableProps.onLongPress = onLongPress;
        pressableProps.onPressOut = onPressOut;
    }
    const onMouseEnter = mem((event: any) => {
        if (Platform.OS == "web" || Platform.OS == "windows" || Platform.OS == "macos")
            setShadow("sh-md")
        props.onMouseEnter?.(event)
    }, props.onMouseEnter, shadow);

    const onMouseLeave = mem((event: any) => {
        if (Platform.OS == "web" || Platform.OS == "windows" || Platform.OS == "macos")
            setShadow("sh-sm");
        props.onMouseLeave?.(event);
    }, props.onMouseLeave, shadow);



    return (
        <TouchableOpacity inspectDisplayName={"Button"} {...pressableProps}
            onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} css={memo(()=> x => x.cls(shadow, "_button button").joinRight(props.css).if(disabled, x => x.cls("disabled")), props.css, shadow, disabled)}>
            {props.icon}
            <Text ifTrue={props.text != undefined} css={memo(()=> x => x.cls("fos-xs").joinRight(props.textCss), props.textCss)}>{props.text}</Text>
        </TouchableOpacity>
    )

}