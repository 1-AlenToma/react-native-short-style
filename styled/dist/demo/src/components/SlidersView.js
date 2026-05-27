import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, Slider } from "./ReactNativeComponents";
import * as React from "react";
import { useLocalMemo, useTimer } from "../hooks";
import { readAble } from "../config";
import { Button } from "./Button";
import { Icon } from './Icon';
import StateBuilder from '../States';
import { Platform } from 'react-native';
import { globalData } from "../theme/ThemeContext";
export const SliderView = (props) => {
    const state = StateBuilder({
        value: props.value,
        sliding: false
    }).build();
    const timer = useTimer(props.msTimeout ?? 800);
    const { mem } = useLocalMemo();
    let btnValue = typeof state.value == "number" ? state.value : (state.value.length <= 1 ? state.value[0] : undefined);
    let step = props.step != undefined ? props.step : 1;
    const onChange = mem((value, index) => {
        state.value = btnValue = value;
        (props.onSlidingComplete || props.onValueChange)?.(typeof value == "number" ? [value] : value, index ?? 0);
    }, props.onSlidingComplete, props.onValueChange, state.value);
    React.useEffect(() => {
        if (props.value !== state.value)
            state.value = props.value;
        timer(() => {
            state.sliding = false;
        });
        state.sliding = true;
    }, [props.value]);
    const minus = mem(() => {
        if (btnValue - step >= props.minimumValue)
            onChange(btnValue - step);
        else if (btnValue > props.minimumValue)
            onChange(props.minimumValue);
    }, onChange, props.minimumValue, state.value);
    const plus = mem(() => {
        if (btnValue + step <= props.maximumValue)
            onChange(btnValue + step);
        else if (btnValue < props.maximumValue)
            onChange(props.maximumValue);
    }, onchange, props.maximumValue, state.value);
    return (_jsxs(View, { ifTrue: props.ifTrue, css: mem(x => x.cls("_slider juc:space-between").joinRight(props.css), props.css), style: props.style, children: [_jsx(Button, { css: mem(x => x.cls("_sliderButton").joinRight(props.buttonCss), props.buttonCss), icon: mem(_jsx(Icon, { type: "AntDesign", size: 15, color: "white", name: "minus" })), ifTrue: props.enableButtons && btnValue != undefined, onPressIn: mem(() => state.sliding = true), disabled: btnValue != undefined && props.minimumValue >= btnValue, whilePressed: minus, onPress: minus }), _jsx(Slider, { onStartShouldSetResponder: mem(event => false), renderAboveThumbComponent: mem(() => _jsx(Text, { style: mem({ display: !state.sliding ? "none" : "flex" }), css: "_sliderThump pointerEvents-none", children: `${readAble(btnValue, 1)}/${props.maximumValue}` }), props.maximumValue, btnValue, state.sliding), ...props, onSlidingStart: mem((event, index) => {
                    props.onSlidingStart?.(event, index);
                    state.sliding = true;
                }, props.onSlidingStart), onTouchStart: mem((e => {
                    globalData.panEnabled = false;
                })), onTouchEnd: mem(e => {
                    globalData.panEnabled = true;
                }), value: state.value, containerStyle: mem({ ...props.containerStyle, flex: 1, width: "100%", overflow: props.enableButtons ? "hidden" : undefined, maxWidth: props.enableButtons ? (Platform.OS == "web" ? "50%" : "75%") : undefined }, props.containerStyle, props.enableButtons), onSlidingComplete: onChange }), _jsx(Button, { css: mem(x => x.cls("_sliderButton").joinRight(props.buttonCss), props.buttonCss), icon: mem(_jsx(Icon, { type: "AntDesign", size: 15, color: "white", name: "plus" })), ifTrue: props.enableButtons && btnValue != undefined, disabled: btnValue != undefined && props.maximumValue <= btnValue, onPressIn: mem(() => state.sliding = true), whilePressed: plus, onPress: plus })] }));
};
//# sourceMappingURL=SlidersView.js.map