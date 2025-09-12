var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatedView, View } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "../States";
import { Easing, Platform } from "react-native";
import { newId } from "../config";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Blur } from "./Blur";
export const Modal = (props) => {
    var _a;
    const context = React.useContext(InternalThemeContext);
    const { animate, animateX, animateY } = useAnimate({
        speed: (_a = props.speed) !== null && _a !== void 0 ? _a : 200,
        easing: Easing.bounce
    });
    const state = StateBuilder(() => ({
        isVisible: undefined,
        id: newId()
    })).build();
    let toggle = (show) => __awaiter(void 0, void 0, void 0, function* () {
        if (show && !state.isVisible) {
            state.isVisible = show;
        }
        render();
        animateY(!show ? 0 : .5);
        animateX(!show ? 0 : 1, () => {
            if (!show && props.isVisible)
                props.onHide();
            if (show != state.isVisible) {
                state.isVisible = show;
                render();
            }
        });
    });
    React.useEffect(() => {
        toggle(props.isVisible);
    }, [props.isVisible]);
    React.useEffect(() => {
        render();
    }, [props.children, props.style]);
    React.useEffect(() => {
        state.isVisible = props.isVisible;
        return () => context.remove(state.id);
    }, []);
    const render = () => {
        const transform = {};
        transform[props.animationStyle == "Opacity" ? "opacity" : "scale"] = animate.x.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp"
        });
        let style = Array.isArray(props.style) ? props.style : [props.style];
        let zIndex = context.items().items.has(state.id) ? [...context.items().items.keys()].indexOf(state.id) : context.items().items.size;
        if (state.isVisible) {
            context.add(state.id, _jsxs(View, { css: "_blur op:1 bac:transparent fl:1", style: { zIndex: zIndex + 300 }, children: [_jsx(Blur, { style: {
                            opacity: animate.y
                        }, onPress: props.disableBlurClick ? undefined : () => {
                            toggle(false);
                        }, css: "_blur zi:1" }), _jsxs(AnimatedView, Object.assign({}, props, { css: x => x.cls("_modalDefaultStyle zi:2 _modal sh-sm _overflow Modal").joinRight(props.css), style: [...style,
                            {
                                transform: transform.scale ? [transform] : undefined,
                                opacity: transform.opacity ? transform.opacity : undefined
                            }
                        ], children: [_jsx(View, { ifTrue: props.addCloser == true, css: x => x.cls("_modalClose").baC(".co-transparent"), children: _jsx(Button, { onPress: () => toggle(false), css: x => x.cls("sh-none", "_center").size(25, 25).baC(".co-transparent").juC("flex-end").pa(0).paL(1).boW(0), icon: _jsx(Icon, { type: "AntDesign", name: "close", size: 15 }) }) }), _jsx(View, { css: x => x.fillView().zI(1).baC(".co-transparent").if(props.addCloser == true, x => x.maT(Platform.OS == "web" ? 5 : 10)), children: props.children })] }))] }, state.id));
        }
        else {
            context.remove(state.id);
        }
    };
    return null;
};
//# sourceMappingURL=Modal.js.map