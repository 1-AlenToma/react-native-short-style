import { View, Text, Slider } from "./ReactNativeComponents";
import * as React from "react";
import {
    useLocalMemo,
    useTimer
} from "../hooks";
import { ifSelector, readAble } from "../config";
import { CSS_String } from "../Typse";
import { Button } from "./Button";
import { Icon } from './Icon';
import StateBuilder from '../States';
import { Platform, ViewStyle } from 'react-native';
import * as NativeSlider from '@miblanchard/react-native-slider';
import { globalData } from "../theme/ThemeContext";

export const SliderView = (props: NativeSlider.SliderProps & {
    enableButtons?: boolean,
    buttonCss?: CSS_String,
    ifTrue?: () => boolean | boolean,
    style?: ViewStyle,
    css?: string;
    msTimeout?: number
}) => {

    const state = StateBuilder({
        value: props.value,
        sliding: false
    }).build();
    const timer = useTimer(props.msTimeout ?? 800);
    const { mem } = useLocalMemo();

    let btnValue = typeof state.value == "number" ? state.value : ((state.value as []).length <= 1 ? state.value[0] : undefined);
    let step = props.step != undefined ? props.step : 1;

    const onChange = mem((value: any, index?: number) => {
        state.value = btnValue = value;

        (props.onSlidingComplete || props.onValueChange)?.(typeof value == "number" ? [value] : value, index ?? 0)
    }, props.onSlidingComplete, props.onValueChange, state.value)

    React.useEffect(() => {
        if (props.value !== state.value)
            state.value = props.value;
        timer(() => {
            state.sliding = false;
        });
        state.sliding = true;
    }, [props.value])

    const minus = mem(() => {
        if (btnValue - step >= props.minimumValue)
            onChange(btnValue - step)
        else if (btnValue > props.minimumValue)
            onChange(props.minimumValue)
    }, onChange, props.minimumValue, state.value);

    const plus = mem(() => {
        if (btnValue + step <= props.maximumValue)
            onChange(btnValue + step)
        else if (btnValue < props.maximumValue)
            onChange(props.maximumValue);
    }, onChange, props.maximumValue, state.value)



    return (
        <View ifTrue={props.ifTrue} css={mem(x => x.cls("_slider juc:space-between").joinRight(props.css), props.css)} style={props.style}>
            <Button css={mem(x => x.cls("_sliderButton").joinRight(props.buttonCss), props.buttonCss)}
                icon={mem(<Icon type="AntDesign" size={15} color="white" name="minus" />)}
                ifTrue={props.enableButtons && btnValue != undefined}
                onPressIn={mem(() => state.sliding = true)}
                disabled={btnValue != undefined && props.minimumValue >= btnValue}
                whilePressed={minus} onPress={minus}></Button>

            <Slider
                onStartShouldSetResponder={mem(event =>
                    false
                )}
                renderAboveThumbComponent={mem(() => <Text style={mem({ display: !state.sliding ? "none" : "flex" })} css="_sliderThump pointerEvents-none">{`${readAble(btnValue as number, 1)}/${props.maximumValue}`}</Text>, props.maximumValue, btnValue, state.sliding)}
                {...props}
                onSlidingStart={mem((event, index: number) => {
                    props.onSlidingStart?.(event, index);
                    state.sliding = true;
                }, props.onSlidingStart)}
                onTouchStart={mem((e => {
                    globalData.panEnabled = false;
                }) as any)}
                onTouchEnd={mem(e => {
                    globalData.panEnabled = true;
                })}
                value={state.value}
                containerStyle={mem({ ...props.containerStyle, flex: 1, width: "100%", overflow: props.enableButtons ? "hidden" : undefined, maxWidth: props.enableButtons ? (Platform.OS == "web" ? "50%" : "75%") : undefined }, props.containerStyle, props.enableButtons)}
                onSlidingComplete={onChange} />
            <Button css={mem(x => x.cls("_sliderButton").joinRight(props.buttonCss), props.buttonCss)}
                icon={mem(<Icon type="AntDesign" size={15} color="white" name="plus" />)}
                ifTrue={props.enableButtons && btnValue != undefined}
                disabled={btnValue != undefined && props.maximumValue <= btnValue}
                onPressIn={mem(() => state.sliding = true)}
                whilePressed={plus} onPress={plus}></Button>
        </View>)
}
