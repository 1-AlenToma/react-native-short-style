import * as NativeSlider from '@miblanchard/react-native-slider';
import { View, AnimatedView, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import * as React from "react";
import {
    useAnimate,
    useTimer
} from "../hooks";
import { ifSelector, optionalStyle, proc, readAble } from "../config/Methods";
import { CSS_String, Size, StyledProps } from "../Typse";
import { Button } from "./Button";
import { Icon } from './Icon';
import StateBuilder from 'react-smart-state';
import { ViewStyle } from 'react-native';

export const Slider = (props: NativeSlider.SliderProps & {
    enableButtons?: boolean,
    buttonCss?: CSS_String,
    ifTrue?: () => boolean | boolean,
    style?: ViewStyle,
    css?: string
}) => {
    if (ifSelector(props.ifTrue) == false)
        return null;
    const state = StateBuilder({
        value: props.value,
        sliding: false
    }).build();
    const timer = useTimer(800)

    let btnValue = typeof state.value == "number" ? state.value : ((state.value as []).length <= 1 ? state.value[0] : undefined);
    let step = props.step != undefined ? props.step : 1;

    const onChange = (value: any, index?: number) => {
        state.value = btnValue = value;
        timer(() => {
            state.sliding = false;
        });
        (props.onSlidingComplete || props.onValueChange)?.(typeof value == "number" ? [value] : value, index ?? 0)
    }

    React.useEffect(() => {
        if (props.value !== state.value)
            state.value = props.value;
    }, [props.value])



    return (
        <View css={`di:flex fld:row juc:space-between ali:center wi:100% mih:20 ${optionalStyle(props.css).c}`} style={props.style}>
            <Button css={`wi:15% he:25 ${optionalStyle(props.buttonCss).c}`}
                icon={<Icon type="AntDesign" size={15} color="white" name="minus" />}
                ifTrue={props.enableButtons && btnValue != undefined}
                onPressIn={() => state.sliding = true}
                whilePressed={() => {
                    if (btnValue - step >= props.minimumValue)
                        onChange(btnValue - step)
                    else if (btnValue > props.minimumValue)
                        onChange(props.minimumValue)
                }}></Button>

            <NativeSlider.Slider
                renderAboveThumbComponent={!state.sliding ? undefined : () => <Text css="fos-sm mal:-37% bor:5 fow:bold mat:-35px bow:1 boc:#CCC miw:50 pat:2 pab:2 tea:center zi:100">{`${readAble(state.value as number, 1)}/${props.maximumValue}`}</Text>}
                {...props}
                onSlidingStart={(event, index: number) => {
                    props.onSlidingStart?.(event, index);
                    state.sliding = true;
                }}
                value={state.value}
                containerStyle={{ ...props.containerStyle, width: props.enableButtons ? "60%" : props.containerStyle?.width ?? "100%" }}
                onSlidingComplete={onChange} />
            <Button css={x => x.size("15%", 25).joinRight(props.buttonCss)}
                icon={<Icon type="AntDesign" size={15} color="white" name="plus" />}
                ifTrue={props.enableButtons && btnValue != undefined}
                onPressIn={() => state.sliding = true}
                whilePressed={() => {
                    if (btnValue + step <= props.maximumValue)
                        onChange(btnValue + step)
                    else if (btnValue < props.maximumValue)
                        onChange(props.maximumValue);
                }}></Button>
        </View>)
}
