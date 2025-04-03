import { View, AnimatedView, Text, TouchableOpacity } from "./ReactNativeComponents";
import * as React from "react";
import { useAnimate } from "../hooks";
import { newId } from "../config";
import StateBuilder from "react-smart-state";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import { Platform, StatusBar } from "react-native";
import { Blur } from "./Blur";
export const Fab = (props) => {
    var _a;
    let context = React.useContext(InternalThemeContext);
    const { animateY, animate, currentValue } = useAnimate();
    const state = StateBuilder({
        visible: false,
        id: newId(),
        size: undefined
    }).ignore("size").build();
    if (props.follow == "Window")
        globalData.hook("window");
    const animateState = () => {
        let value = state.visible ? 1 : 0;
        if (currentValue.y == value)
            return;
        animateY(value, () => {
        });
    };
    state.useEffect(() => {
        animateState();
    }, "visible");
    React.useEffect(() => {
        animateState();
    }, []);
    let style = {};
    let animatedItemPosition = undefined;
    let leftDefault = 15;
    let defaultTop = Platform.OS == "web" || props.follow == "Parent" ? 10 : (_a = StatusBar.currentHeight) !== null && _a !== void 0 ? _a : 10;
    switch (props.position) {
        case "RightBottom":
            style = {
                bottom: defaultTop,
                right: leftDefault
            };
            if (state.size) {
                animatedItemPosition = x => x.ri(leftDefault).maT(-state.size.height);
            }
            break;
        case "LeftBottom":
            style = {
                bottom: defaultTop,
                left: leftDefault
            };
            if (state.size) {
                animatedItemPosition = x => x.le(leftDefault).maT(-state.size.height);
            }
            break;
        case "LeftTop":
            style = {
                top: defaultTop,
                left: leftDefault
            };
            if (state.size) {
                animatedItemPosition = x => x.le(leftDefault).maT(state.size.height);
            }
            break;
        case "RightTop":
            style = {
                top: defaultTop,
                right: leftDefault
            };
            if (state.size) {
                animatedItemPosition = x => x.ri(leftDefault).maT(state.size.height);
            }
            break;
    }
    const animatedIItem = !state.visible ? null : (React.createElement(AnimatedView, { onLayout: ({ nativeEvent }) => {
            state.size = nativeEvent.layout;
        }, style: {
            transform: [
                {
                    scaleY: animate.y.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolate: "clamp"
                    })
                }
            ]
        }, css: x => x.joinRight("mat:10 bac:transparent overflow:hidden miw:100 zi:1 _abc").joinRight(animatedItemPosition), key: state.id + "View" },
        React.createElement(React.Fragment, null, props.children)));
    const view = (React.createElement(React.Fragment, { key: state.id },
        React.createElement(View, { css: x => x.cls("_fab").joinRight(style).joinRight(props.css), style: props.style },
            !["LeftTop", "RightTop"].includes(props.position) ? animatedIItem : null,
            React.createElement(TouchableOpacity, { style: typeof props.prefixContainerStyle == "object" ? props.prefixContainerStyle : undefined, onPress: () => state.visible = !state.visible, css: x => x.cls("_fabCenter").if(props.prefixContainerStyle && ["string", "function"].includes(typeof props.prefixContainerStyle), c => c.joinRight(props.prefixContainerStyle)) }, typeof props.prefix == "string" ? React.createElement(Text, { css: "fos-xs" }, props.prefix) : props.prefix),
            !["LeftBottom", "RightBottom"].includes(props.position) ? animatedIItem : null),
        React.createElement(Blur, { onPress: () => state.visible = false, ifTrue: state.visible && props.blureScreen !== false })));
    if (props.follow == "Parent")
        return view;
    else {
        context.add(state.id, view, true);
    }
    //context.add(state.id, view, true);
    return null;
};
//# sourceMappingURL=Fab.js.map