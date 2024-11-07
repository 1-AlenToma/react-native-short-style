import { optionalStyle } from "../config/Methods";
import { BlurProps } from "../Typse";
import { TouchableOpacity, View } from "./ReactNativeComponents";

export const Blur = (props: BlurProps) => {
    if (!props.onPress && props.activeOpacity === undefined)
            props.activeOpacity=1;

    return (<TouchableOpacity {...props} css={`_blur ${optionalStyle(props.css).c}`} style={props.style} />)
}