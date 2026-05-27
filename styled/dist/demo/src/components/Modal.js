import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatedView, View } from "./ReactNativeComponents";
import { globalData } from "../theme/ThemeContext";
import { useAnimate, useLocalMemo } from "../hooks";
import StateBuilder from "../States";
import { Easing, Platform } from "react-native";
import { newId } from "../config";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Blur } from "./Blur";
import { Portal } from "./Portal";
export const Modal = (props) => {
    const transform = React.useRef({}).current;
    const { mem } = useLocalMemo();
    const { animate, animateX, animateY } = useAnimate({
        speed: props.speed ?? 200,
        easing: props.easing ?? Easing.bounce
    });
    const state = StateBuilder(() => ({
        isVisible: undefined,
        id: newId()
    })).build();
    let toggle = async (show) => {
        if (show && !state.isVisible) {
            state.isVisible = show;
        }
        animateY(!show ? 0 : .5);
        animateX(!show ? 0 : 1, () => {
            try {
                if (!show && props.isVisible)
                    props.onHide();
                if (show != state.isVisible) {
                    state.isVisible = show;
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    };
    React.useEffect(() => {
        if (!state.isVisible || props.isVisible)
            state.isVisible = props.isVisible;
        else
            toggle(props.isVisible);
    }, [props.isVisible]);
    React.useEffect(() => {
        toggle(state.isVisible);
    }, [state.isVisible]);
    if (!transform[props.animationStyle == "Opacity" ? "opacity" : "scale"])
        transform[props.animationStyle == "Opacity" ? "opacity" : "scale"] = animate.x.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp"
        });
    let style = Array.isArray(props.style) ? props.style : [props.style];
    let zIndex = globalData.portals.elems.has(state.id) ? globalData.portals.keys.indexOf(state.id) : globalData.portals.totalItems;
    return (_jsx(Portal, { visible: state.isVisible, children: _jsxs(View, { inspectDisplayName: "ModalContainer", css: "_blur op:1 bac:transparent fl:1 ModalContainer", style: mem({ zIndex: zIndex + 300 }, zIndex), children: [_jsx(Blur, { style: mem({
                        opacity: animate.y
                    }, animate.y), onPress: mem(props.disableBlurClick ? undefined : () => {
                        state.isVisible = false;
                    }, props.disableBlurClick), css: "_blur zi:1" }), _jsxs(AnimatedView, { inspectDisplayName: "Modal", ...props, css: mem(x => x.cls("_modalDefaultStyle zi:2 _modal sh-sm _overflow Modal").joinRight(props.css), props.css), style: mem([...style,
                        {
                            transform: transform.scale ? [transform] : undefined,
                            opacity: transform.opacity ? transform.opacity : undefined
                        }
                    ], props.style), children: [_jsx(View, { ifTrue: props.addCloser == true, css: mem(x => x.cls("_modalClose").baC(".co-transparent")), children: _jsx(Button, { onPress: mem(() => state.isVisible = false), css: mem(x => x.cls("sh-none", "_center").size(25, 25).baC(".co-transparent").juC("flex-end").pa(0).paL(1).boW(0)), icon: mem(_jsx(Icon, { type: "AntDesign", name: "close", size: 15 })) }) }), _jsx(View, { inspectDisplayName: "ModalContent", css: mem(x => x.fillView().cls("ModalContent").zI(1).baC(".co-transparent").if(props.addCloser == true, x => x.maT(Platform.OS == "web" ? 5 : 10)), props.addCloser), children: props.children })] })] }) }));
};
//# sourceMappingURL=Modal.js.map