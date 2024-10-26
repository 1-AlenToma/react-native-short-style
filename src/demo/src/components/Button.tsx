import { TouchableOpacity, Text } from "./ReactNativeComponents";
import * as React from "react";
import { ButtonProps } from "../Typse";
import { ifSelector } from "../config/Methods";

export const Button = ({ ...props }: ButtonProps) => {
    const disabled = ifSelector(props.disabled);
    const pressableProps = { ...props };
    if (disabled === true) {
        pressableProps.onPress = undefined;
        pressableProps.onLongPress = undefined;
        pressableProps.activeOpacity = 0.5;

    }
    return (
        <TouchableOpacity {...props} css={`fld:row pa:5 mab:5 ${props.icon ? "pal:5 juc:space-between": "pal:8"} par:8 bor:5 bac-blue900 sh-lg ${props.css} ${disabled ? "op:0.8" : ""}`}>
            {props.icon}
            <Text css={`fos-xs ${props.textCss ?? ""}`}>{props.text}</Text>
        </TouchableOpacity>
    )

}