import { optionalStyle } from "../config";
import { BlurProps } from "../Typse";
import { AnimatedTouchableOpacity, AnimatedView } from "./ReactNativeComponents";

export const Blur = (props: BlurProps) => {
    let hProps = {...props};
    if (!hProps.onPress && hProps.activeOpacity === undefined)
        props.activeOpacity = 1;
    
    return (<AnimatedTouchableOpacity {...hProps} onPress={hProps.onPress} css={x => x.cls("_blur").joinRight(hProps.css)} />)
}