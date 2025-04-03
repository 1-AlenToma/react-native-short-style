import { View, Text, Slider } from "./ReactNativeComponents";
import * as React from "react";
import { useTimer } from "../hooks";
import { ifSelector, readAble } from "../config";
import { Button } from "./Button";
import { Icon } from './Icon';
import StateBuilder from 'react-smart-state';
import { globalData } from "../theme/ThemeContext";
export const SliderView = (props) => {
    if (ifSelector(props.ifTrue) == false)
        return null;
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
        timer(() => {
            state.sliding = false;
        });
        (_a = (props.onSlidingComplete || props.onValueChange)) === null || _a === void 0 ? void 0 : _a(typeof value == "number" ? [value] : value, index !== null && index !== void 0 ? index : 0);
    };
    React.useEffect(() => {
        if (props.value !== state.value)
            state.value = props.value;
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
    return (React.createElement(View, { css: x => x.cls("_slider juc:space-between").joinRight(props.css), style: props.style },
        React.createElement(Button, { css: x => x.cls("_sliderButton").joinRight(props.buttonCss), icon: React.createElement(Icon, { type: "AntDesign", size: 15, color: "white", name: "minus" }), ifTrue: props.enableButtons && btnValue != undefined, onPressIn: () => state.sliding = true, whilePressed: minus, onPress: minus }),
        React.createElement(Slider, Object.assign({ onStartShouldSetResponder: event => false, renderAboveThumbComponent: !state.sliding ? undefined : () => React.createElement(Text, { css: "_sliderThump" }, `${readAble(btnValue, 1)}/${props.maximumValue}`) }, props, { onSlidingStart: (event, index) => {
                var _a;
                (_a = props.onSlidingStart) === null || _a === void 0 ? void 0 : _a.call(props, event, index);
                state.sliding = true;
            }, onTouchStart: e => {
                globalData.panEnabled = false;
            }, onTouchEnd: e => {
                globalData.panEnabled = true;
            }, value: state.value, containerStyle: Object.assign(Object.assign({}, props.containerStyle), { flex: 1, width: "100%" }), onSlidingComplete: onChange })),
        React.createElement(Button, { css: x => x.cls("_sliderButton").joinRight(props.buttonCss), icon: React.createElement(Icon, { type: "AntDesign", size: 15, color: "white", name: "plus" }), ifTrue: props.enableButtons && btnValue != undefined, onPressIn: () => state.sliding = true, whilePressed: plus, onPress: plus })));
};
//# sourceMappingURL=SlidersView.js.map