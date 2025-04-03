import * as React from "react";
import { CSS_String } from "../Typse";
import { ViewStyle } from 'react-native';
import * as NativeSlider from '@miblanchard/react-native-slider';
export declare const SliderView: (props: NativeSlider.SliderProps & {
    enableButtons?: boolean;
    buttonCss?: CSS_String;
    ifTrue?: () => boolean | boolean;
    style?: ViewStyle;
    css?: string;
}) => React.JSX.Element;
