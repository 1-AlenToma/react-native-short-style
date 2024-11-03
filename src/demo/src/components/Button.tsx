import { TouchableOpacity, Text } from "./ReactNativeComponents";
import * as React from "react";
import { ButtonProps } from "../Typse";
import { ifSelector } from "../config/Methods";
import { useTimer } from "../hooks";

export const Button = (props: ButtonProps) => {
    const [shadow, setShadow] = React.useState("sh-sm");
    const disabled = ifSelector(props.disabled);
    const timer = useTimer(props.whilePressedDelay ?? 100);
    const pressableProps = { ...props };
    if (disabled === true) {
        pressableProps.onPress = undefined;
        pressableProps.onLongPress = undefined;
        pressableProps.activeOpacity = 0.5;
    }

    if (props.whilePressed) {
        pressableProps.onPressIn = (event) => {
            props.onPressIn?.(event);
            const fn = () => {
                props.whilePressed();
                timer(fn);
            }
            fn();
        }

        /*  pressableProps.onPress = (event) => {
              props.onPress?.(event);
          }*/

        pressableProps.onPressOut = (event) => {
            props.onPressOut?.(event);
            timer.clear();
        }
    }



    return (
        <TouchableOpacity {...pressableProps} onMouseLeave={(event) => {
            setShadow("sh-sm");
            props.onMouseLeave?.(event);
        }} onMouseEnter={(event) => {
            setShadow("sh-md")
            props.onMouseEnter?.(event)
        }} css={`fld:row pa:5 mab:5 ${props.icon ? "pal:5 juc:space-between" : "pal:8"} par:8 bor:5 bac-blue900 ${shadow} ${props.css} ${disabled ? "op:0.8" : ""}`}>
            {props.icon}
            <Text ifTrue={() => props.text != undefined} css={`fos-xs ${props.textCss ?? ""}`}>{props.text}</Text>
        </TouchableOpacity>
    )

}