import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { View, Text, AnimatedView, TouchableOpacity } from "./ReactNativeComponents";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { newId } from "../config";
import { useAnimate, useTimer } from "../hooks";
import { ProgressBar } from "./ProgressBar";
import { Icon } from "./Icon";
import { Platform, StatusBar } from 'react-native';
export const ToastView = () => {
    var _a, _b;
    globalData.hook("screen", "alertViewData.toastData");
    const { animate, animateY, currentValue } = useAnimate();
    const data = (_a = globalData.alertViewData.toastData) !== null && _a !== void 0 ? _a : {};
    data.position = (_b = data.position) !== null && _b !== void 0 ? _b : "Top";
    const context = React.useContext(InternalThemeContext);
    const timer = useTimer(100);
    const state = StateBuilder(() => ({
        size: undefined,
        id: newId(),
        counter: 0,
        visible: false
    })).ignore("id").build();
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
                icon: (_jsx(Icon, { type: "MaterialIcons", name: "error", size: 30, css: "co:white" }))
            };
            break;
        case "Info":
            typeInfo = {
                css: `_${data.type.toLowerCase()}`,
                icon: (_jsx(Icon, { type: "AntDesign", name: "info-circle", size: 30, css: "co:white" }))
            };
            break;
        case "Warning":
            typeInfo = {
                css: `_${data.type.toLowerCase()}`,
                icon: (_jsx(Icon, { type: "FontAwesome", name: "warning", size: 30, css: "co:white" }))
            };
            break;
        case "Success":
            typeInfo = {
                css: `_${data.type.toLowerCase()}`,
                icon: (_jsx(Icon, { type: "Entypo", name: "check", size: 30, css: "co:white" }))
            };
            break;
    }
    React.useEffect(() => {
        var _a;
        fn(state.id, _jsxs(AnimatedView, { onLayout: ({ nativeEvent }) => {
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
            }, css: x => x.cls("_toast").joinRight(typeInfo.css).zI(999).joinRight(data.css), children: [_jsxs(View, { children: [_jsx(View, { css: x => x.cls("_abc").fl(1).fillView().pos(0, 0).zI(3).juC("flex-start").alI("flex-end").baC(".co-transparent"), children: _jsx(TouchableOpacity, { onPress: () => state.visible = false, css: "wi-15", children: _jsx(Icon, { type: "AntDesign", css: "co:white", name: "close", size: 15 }) }) }), _jsx(View, { ifTrue: data.icon != undefined || typeInfo.icon != undefined, css: "fl:1 maw:40 zi:1 bac:transparent", children: (_a = data.icon) !== null && _a !== void 0 ? _a : typeInfo.icon }), _jsxs(View, { css: "fl:1 zi:1 bac:transparent", children: [_jsx(Text, { ifTrue: data.title != undefined, css: x => x.joinLeft("fos-lg maw:90% fow:bold").joinRight(typeInfo.css), children: data.title }), _jsx(Text, { css: x => x.joinLeft(`fos-sm maw:90% pab:5`).joinRight(typeInfo.css), children: data.message })] })] }), _jsx(ProgressBar, { ifTrue: data.loader !== false, color: data.loaderBg, children: null, value: state.counter, css: "_toastProgressView" })] }, state.id), true);
    });
    React.useEffect(() => {
        return () => context.remove(state.id);
    }, []);
    return null;
};
//# sourceMappingURL=ToastView.js.map