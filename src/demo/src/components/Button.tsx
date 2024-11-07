import { TouchableOpacity, Text } from "./ReactNativeComponents";
import * as React from "react";
import { ButtonProps } from "../Typse";
import { ifSelector, optionalStyle } from "../config/Methods";
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
        }} css={x => x.flD("row")
            .pa(5)
            .maB(5)
            .if(props.icon != undefined, x => x.paL(5).juC("space-between"), x => x.paL(8))
            .paR(8)
            .boR(5)
            .baC("#4b48f5")
            .classNames(shadow)
            .joinRight(props.css)
            .if(disabled, x => x.op(.8))}>
            {props.icon}
            <Text ifTrue={() => props.text != undefined} css={x => x.classNames("fos-xs").joinRight(props.textCss)}>{props.text}</Text>
        </TouchableOpacity>
    )

}