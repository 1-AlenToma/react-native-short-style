import * as React from "react";
import { View, Text, AnimatedView } from "./ReactNativeComponents";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "react-smart-state";
import { newId } from "../config";
import { useAnimate, useTimer } from "../hooks";
import { ProgressBar } from "./ProgressBar";
import { Icon } from "./Icon";
import { Platform, StatusBar, TouchableOpacity } from 'react-native';
export const ToastView = () => {
    var _a, _b, _c;
    globalData.hook("screen", "alertViewData.toastData");
    const { animate, animateY, currentValue } = useAnimate();
    const data = (_a = globalData.alertViewData.toastData) !== null && _a !== void 0 ? _a : {};
    data.position = (_b = data.position) !== null && _b !== void 0 ? _b : "Top";
    const context = React.useContext(InternalThemeContext);
    const timer = useTimer(100);
    const state = StateBuilder({
        size: undefined,
        id: newId(),
        counter: 0,
        visible: false
    }).ignore("id").build();
    let fn = data.message ? context.add.bind(context) : context.remove.bind(context);
    let interpolate = [0, 1];
    const startCounter = () => {
        var _a;
        if (data.loader == false)
            return;
        state.counter += (_a = data.loaderCounter) !== null && _a !== void 0 ? _a : .01;
        if (state.counter < 1)
            timer(() => startCounter());
        else
            state.visible = false;
    };
    if (state.size) {
        if (data.position == "Top") {
            interpolate = [-state.size.height, Platform.OS == "web" ? 5 : StatusBar.currentHeight];
        }
        else {
            interpolate = [globalData.window.height + state.size.height, (globalData.window.height - state.size.height) - 30];
        }
    }
    const animateTop = () => {
        const v = state.visible ? 1 : 0;
        if (currentValue.y == v || !state.size)
            return;
        timer.clear();
        animateY(v, () => {
            if (state.visible) {
                state.counter = 0;
                startCounter();
            }
            if (!state.visible) {
                state.counter = 0;
                state.size = undefined;
                globalData.alertViewData.toastData = undefined;
                timer.clear();
            }
        });
    };
    globalData.useEffect(() => {
        state.counter = 0;
        state.visible = globalData.alertViewData.toastData != undefined;
    }, "alertViewData.toastData");
    state.useEffect(() => {
        if (state.size)
            animateTop();
    }, "visible", "size");
    let typeInfo = {
        css: undefined,
        icon: undefined
    };
    switch (data.type) {
        case "Error":
            typeInfo = {
                css: `_${data.type.toLowerCase()}`,
                icon: (React.createElement(Icon, { type: "MaterialIcons", name: "error", size: 30, css: "co:white" }))
            };
            break;
        case "Info":
            typeInfo = {
                css: `_${data.type.toLowerCase()}`,
                icon: (React.createElement(Icon, { type: "AntDesign", name: "infocirlce", size: 30, css: "co:white" }))
            };
            break;
        case "Warning":
            typeInfo = {
                css: `_${data.type.toLowerCase()}`,
                icon: (React.createElement(Icon, { type: "FontAwesome", name: "warning", size: 30, css: "co:white" }))
            };
            break;
        case "Success":
            typeInfo = {
                css: `_${data.type.toLowerCase()}`,
                icon: (React.createElement(Icon, { type: "Entypo", name: "check", size: 30, css: "co:white" }))
            };
            break;
    }
    fn(state.id, React.createElement(AnimatedView, { key: state.id, onLayout: ({ nativeEvent }) => {
            if (!state.size)
                state.size = nativeEvent.layout;
        }, style: {
            left: state.size ? (globalData.window.width - state.size.width) / 2 : 0,
            top: !state.size ? (data.position == "Bottom" ? "100%" : "-100%") : 0,
            transform: [{
                    translateY: animate.y.interpolate({
                        inputRange: [0, 1],
                        outputRange: interpolate,
                        extrapolate: "clamp"
                    })
                }]
        }, css: x => x.cls("_toast").joinRight(typeInfo.css).zI(10000).joinRight(data.css) },
        React.createElement(View, null,
            React.createElement(View, { css: x => x.cls("_abc").fl(1).fillView().pos(0, 0).zI(3).alI("flex-end").baC("$co-transparent") },
                React.createElement(TouchableOpacity, { onPress: () => state.visible = false },
                    React.createElement(Icon, { type: "AntDesign", css: "co:white", name: "close", size: 15 }))),
            React.createElement(View, { ifTrue: data.icon != undefined || typeInfo.icon != undefined, css: "fl:1 maw:40 zi:1 bac:transparent" }, (_c = data.icon) !== null && _c !== void 0 ? _c : typeInfo.icon),
            React.createElement(View, { css: "fl:1 zi:1 bac:transparent" },
                React.createElement(Text, { ifTrue: data.title != undefined, css: x => x.joinLeft("fos-lg maw:90% fow:bold").joinRight(typeInfo.css) }, data.title),
                React.createElement(Text, { css: x => x.joinLeft(`fos-sm maw:90% pab:5`).joinRight(typeInfo.css) }, data.message))),
        React.createElement(ProgressBar, { ifTrue: data.loader !== false, color: data.loaderBg, children: null, value: state.counter, css: "_toastProgressView" })), true);
    return null;
};
//# sourceMappingURL=ToastView.js.map