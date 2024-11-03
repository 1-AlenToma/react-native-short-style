import { Slider as SliderView, SliderProps } from '@miblanchard/react-native-slider';
import { View, AnimatedView, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import * as React from "react";
import {
    useAnimate
} from "../hooks";
import { ifSelector, proc, readAble } from "../config/Methods";
import { Size, StyledProps } from "../Typse";
import { Button } from "./Button";
import { Icon } from './Icon';
import StateBuilder from 'react-smart-state';

export const Slider = (props: SliderProps & { enableButtons?: boolean, buttonCss?: string, ifTrue?: () => boolean | boolean }) => {
    if (ifSelector(props.ifTrue) == false)
        return null;
    const state = StateBuilder({
        value: props.value
    }).build();

    let btnValue = typeof state.value == "number" ? state.value : undefined;
    let step = props.step != undefined ? props.step : 1;

    const onChange = (value: any, index?: number) => {
        state.value = btnValue = value;
        (props.onSlidingComplete || props.onValueChange)?.(typeof value == "number" ? [value] : value, index ?? 0)
    }

    React.useEffect(() => {
        if (props.value !== state.value)
            state.value = props.value;
    }, [props.value])



    return (
        <View css={`di:flex fld:row juc:space-between ali:center wi:100% mih:20`}>
            <Button css={`wi:15% he:25 ${props.buttonCss}`}
                icon={<Icon type="AntDesign" size={15} color="white" name="minus" />}
                ifTrue={props.enableButtons && btnValue != undefined}
                whilePressed={() => {
                    if (btnValue - step >= props.minimumValue)
                        onChange(btnValue - step)
                    else if (btnValue > props.minimumValue)
                        onChange(props.minimumValue)
                }}></Button>
            <SliderView {...props} value={state.value} containerStyle={{ ...props.containerStyle, width: props.enableButtons ? "60%" : props.containerStyle?.width ?? "100%" }} onSlidingComplete={btnValue != undefined ? onChange : props.onSlidingComplete} />
            <Button css={`wi:15% he:25 ${props.buttonCss}`}
                icon={<Icon type="AntDesign" size={15} color="white" name="plus" />}
                ifTrue={props.enableButtons && btnValue != undefined}
                whilePressed={() => {
                    if (btnValue + step <= props.maximumValue)
                        onChange(btnValue + step)
                    else if (btnValue < props.maximumValue)
                        onChange(props.maximumValue);
                }}></Button>
        </View>)
}
