import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, Slider } from "./ReactNativeComponents";
import * as React from "react";
import { useTimer } from "../hooks";
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
    const timer = useTimer(800);
    let btnValue = typeof state.value == "number" ? state.value : (state.value.length <= 1 ? state.value[0] : undefined);
    let step = props.step != undefined ? props.step : 1;
    const onChange = (value, index) => {
        var _a;
        state.value = btnValue = value;
        (_a = (props.onSlidingComplete || props.onValueChange)) === null || _a === void 0 ? void 0 : _a(typeof value == "number" ? [value] : value, index !== null && index !== void 0 ? index : 0);
    };
    React.useEffect(() => {
        if (props.value !== state.value)
            state.value = props.value;
        timer(() => {
            state.sliding = false;
        });
        state.sliding = true;
    }, [props.value]);
    const minus = () => {
        if (btnValue - step >= props.minimumValue)
            onChange(btnValue - step);
        else if (btnValue > props.minimumValue)
            onChange(props.minimumValue);
    };
    const plus = () => {
        if (btnValue + step <= props.maximumValue)
            onChange(btnValue + step);
        else if (btnValue < props.maximumValue)
            onChange(props.maximumValue);
    };
    return (_jsxs(View, { ifTrue: props.ifTrue, css: x => x.cls("_slider juc:space-between").joinRight(props.css), style: props.style, children: [_jsx(Button, { css: x => x.cls("_sliderButton").joinRight(props.buttonCss), icon: _jsx(Icon, { type: "AntDesign", size: 15, color: "white", name: "minus" }), ifTrue: props.enableButtons && btnValue != undefined, onPressIn: () => state.sliding = true, whilePressed: minus, onPress: minus }), _jsx(Slider, Object.assign({ onStartShouldSetResponder: event => false, renderAboveThumbComponent: () => _jsx(Text, { style: { display: !state.sliding ? "none" : "flex" }, css: "_sliderThump", children: `${readAble(btnValue, 1)}/${props.maximumValue}` }) }, props, { onSlidingStart: (event, index) => {
                    var _a;
                    (_a = props.onSlidingStart) === null || _a === void 0 ? void 0 : _a.call(props, event, index);
                    state.sliding = true;
                }, onTouchStart: (e => {
                    globalData.panEnabled = false;
                }), onTouchEnd: e => {
                    globalData.panEnabled = true;
                }, value: state.value, containerStyle: Object.assign(Object.assign({}, props.containerStyle), { flex: 1, width: "100%", overflow: props.enableButtons ? "hidden" : undefined, maxWidth: props.enableButtons ? (Platform.OS == "web" ? "50%" : "75%") : undefined }), onSlidingComplete: onChange })), _jsx(Button, { css: x => x.cls("_sliderButton").joinRight(props.buttonCss), icon: _jsx(Icon, { type: "AntDesign", size: 15, color: "white", name: "plus" }), ifTrue: props.enableButtons && btnValue != undefined, onPressIn: () => state.sliding = true, whilePressed: plus, onPress: plus })] }));
};
//# sourceMappingURL=SlidersView.js.map