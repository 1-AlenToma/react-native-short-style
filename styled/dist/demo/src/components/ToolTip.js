import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { View, Text, TouchableOpacity } from "./ReactNativeComponents";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { ifSelector, newId, optionalStyle, setRef } from "../config";
import { Blur } from "./Blur";
import { Platform } from "react-native";
export const ToolTip = React.forwardRef((props, ref) => {
    const context = React.useContext(InternalThemeContext);
    globalData.hook("window");
    const state = StateBuilder(() => ({
        visible: false,
        id: newId(),
        ref: undefined,
        pos: undefined,
        toolTipSize: undefined,
        mounted: false,
    })).ignore("ref", "pos", "toolTipSize").build();
    setRef(ref, {
        visible: (value) => state.visible = value
    });
    const setPostion = () => {
        if (state.ref) {
            state.ref.measureInWindow((x, y, w, h) => {
                state.pos = {
                    x: x,
                    y: y,
                    px: x,
                    py: y,
                    width: w,
                    height: h
                };
            });
        }
    };
    globalData.useEffect(() => {
        if (state.visible)
            state.visible = false;
    }, "window");
    state.useEffect(() => {
        if (!state.visible)
            state.pos = undefined;
        else
            setPostion();
    }, "visible");
    const show = () => {
        var _a, _b;
        let left = (_a = state.pos) === null || _a === void 0 ? void 0 : _a.x;
        let top = (_b = state.pos) === null || _b === void 0 ? void 0 : _b.y;
        if (state.toolTipSize && state.pos) {
            left = left - (state.toolTipSize.width / 2);
            top = top + state.pos.height;
            if (left + state.toolTipSize.width > globalData.window.width)
                left = globalData.window.width - (state.toolTipSize.width);
            else if (left < 0)
                left = 5;
            if (!props.postion || props.postion == "Top") {
                top -= state.toolTipSize.height + (Platform.OS == "web" ? state.pos.height : 0);
                if (top < 0)
                    top = 5;
            }
        }
        const fn = state.visible && state.pos ? context.add.bind(context) : context.remove.bind(context);
        fn(state.id, (_jsxs(View, { css: x => x.fillView().maW("95%").cls("_abc").pos(0, 0).baC(".co-transparent"), children: [_jsx(Blur, { css: "zi:1 bac:transparent", onPress: () => state.visible = false }), _jsx(View, { onLayout: ({ nativeEvent }) => {
                        if (!state.toolTipSize && state.visible) {
                            state.toolTipSize = nativeEvent.layout;
                            show();
                        }
                    }, style: [{
                            left: left,
                            top: top,
                        }], css: x => x.joinLeft(`zi:2 bow:.5 pa:5 bor:5 flg:1 boc:#CCC mar:5`).cls("_abc", "ToolTip"), children: typeof props.text == "string" ? _jsx(Text, { selectable: true, css: ".fos-sm", children: props.text }) : props.text })] }, state.id)));
    };
    React.useEffect(() => {
        show();
        return () => context.remove(state.id);
    });
    React.useEffect(() => {
        return () => context.remove(state.id);
    }, []);
    if (ifSelector(props.ifTrue) == false)
        return null;
    const style = optionalStyle(props.containerStyle);
    return (_jsx(TouchableOpacity, { onLayout: setPostion, ref: c => {
            if (c !== state.ref)
                state.ref = c;
        }, onPress: () => {
            state.visible = !state.visible;
        }, style: [style.o], css: x => x.joinRight(style.c), children: props.children }));
});
//# sourceMappingURL=ToolTip.js.map