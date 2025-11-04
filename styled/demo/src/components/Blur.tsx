import * as React from "react";
import { BlurProps } from "../Typse";
import { AnimatedTouchableOpacity, AnimatedView } from "./ReactNativeComponents";

export const Blur = (props: BlurProps) => {
    let hProps = { ...props };
    const Component = props.onPress ? AnimatedTouchableOpacity : AnimatedView;
    const onPress = (event: any) => {
        props?.onPress?.(event);
    }
    if (!hProps.onPress && hProps.activeOpacity === undefined)
        hProps.activeOpacity = 1;
    if (props.onPress)
        hProps.onPress = onPress;

    return (<Component inspectDisplayName="Blur" {...hProps} css={x => x.cls("_blur").joinRight(hProps.css)} />)
}