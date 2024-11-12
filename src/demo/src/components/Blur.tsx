import { optionalStyle } from "../config";
import { BlurProps } from "../Typse";
import { AnimatedTouchableOpacity } from "./ReactNativeComponents";

export const Blur = (props: BlurProps) => {
    let hProps = { ...props };
    const onPress = (event: any) => {
        props?.onPress?.(event);
    }
    if (!hProps.onPress && hProps.activeOpacity === undefined)
        props.activeOpacity = 1;

    return (<AnimatedTouchableOpacity {...hProps} onPress={onPress} css={x => x.cls("_blur").joinRight(hProps.css)} />)
}