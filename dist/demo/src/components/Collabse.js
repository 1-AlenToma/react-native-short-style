import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { AnimatedView, TouchableOpacity, View, Text } from "./ReactNativeComponents";
import { globalData } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "../States";
import { ifSelector, setRef } from "../config";
import { Icon } from "./Icon";
export const Collabse = React.forwardRef((props, ref) => {
    var _a;
    const state = StateBuilder({
        visible: (_a = props.defaultActive) !== null && _a !== void 0 ? _a : false,
        prefix: props.defaultActive ? "minus" : "plus"
    }).build();
    const { animate, animateY, animateX } = useAnimate({ speed: 300, useNativeDriver: false });
    const show = () => {
        animateX(state.visible ? 1 : 0, () => {
        }, 1000);
        animateY(state.visible ? 1 : 0, () => {
            state.prefix = state.visible ? "minus" : "plus";
        });
    };
    setRef(ref, {
        open: () => state.visible = true,
        close: () => state.visible = false,
        selectedValue: state.visible
    });
    React.useEffect(() => {
        show();
    }, []);
    state.useEffect(() => show(), "visible");
    if (ifSelector(props.ifTrue) == false)
        return null;
    return (_jsxs(View, { style: props.style, css: x => x.joinRight(`bor:5 wi:100% mih:30 bow:.5 boc:#CCC _overflow pa:5`).joinRight(props.css), children: [_jsxs(TouchableOpacity, { onPress: () => state.visible = !state.visible, css: "wi:100% he:30 ali:center fld:row", children: [props.icon, _jsx(Text, { css: "fos-lg fow:bold", children: props.text }), _jsx(Icon, { type: "AntDesign", css: "_abc ri:2", size: 20, name: state.prefix })] }), _jsx(AnimatedView, { css: "wi:100% pal:10", style: {
                    overflow: "hidden",
                    maxHeight: animate.y.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, globalData.window.height],
                        extrapolate: "clamp"
                    })
                }, children: _jsx(AnimatedView, { style: {
                        flex: 0,
                        flexGrow: 1,
                        opacity: animate.x.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: "clamp"
                        })
                    }, children: props.children }) })] }));
});
//# sourceMappingURL=Collabse.js.map