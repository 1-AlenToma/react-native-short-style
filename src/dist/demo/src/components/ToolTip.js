import * as React from "react";
import { View, Text, TouchableOpacity } from "./ReactNativeComponents";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "react-smart-state";
import { ifSelector, newId, optionalStyle, setRef } from "../config";
import { Blur } from "./Blur";
import { useTimer } from "../hooks";
export const ToolTip = React.forwardRef((props, ref) => {
    var _a, _b;
    if (ifSelector(props.ifTrue) == false)
        return null;
    const context = React.useContext(InternalThemeContext);
    globalData.hook("window");
    const state = StateBuilder({
        visible: false,
        id: newId(),
        ref: undefined,
        pos: undefined,
        toolTipSize: undefined
    }).ignore("ref", "pos", "toolTipSize").build();
    const timer = useTimer(100);
    const fn = state.visible && state.pos ? context.add.bind(context) : context.remove.bind(context);
    setRef(ref, {
        visible: (value) => state.visible = value
    });
    state.useEffect(() => {
        timer(() => {
            if (state.ref && !state.pos && state.visible)
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
        });
    }, "ref", "visible");
    globalData.useEffect(() => {
        if (state.visible)
            state.visible = false;
    }, "window");
    state.useEffect(() => {
        if (!state.visible)
            state.pos = undefined;
    }, "visible");
    let left = (_a = state.pos) === null || _a === void 0 ? void 0 : _a.px;
    let top = (_b = state.pos) === null || _b === void 0 ? void 0 : _b.py;
    if (state.toolTipSize && state.pos) {
        left = left - (state.toolTipSize.width / 2);
        top = top + state.pos.height;
        if (left + state.toolTipSize.width > globalData.window.width)
            left = globalData.window.width - (state.toolTipSize.width);
        else if (left < 0)
            left = 5;
        if (!props.postion || props.postion == "Top") {
            top -= state.toolTipSize.height + state.pos.height;
            if (top < 0)
                top = 5;
        }
    }
    fn(state.id, (React.createElement(View, { key: state.id, css: x => x.fillView().maW("95%").cls("_abc").pos(0, 0).baC("$co-transparent") },
        React.createElement(Blur, { css: "zi:1 bac:transparent", onPress: () => state.visible = false }),
        React.createElement(View, { onLayout: ({ nativeEvent }) => {
                state.toolTipSize = nativeEvent.layout;
            }, style: [{
                    left: left,
                    top: top
                }], css: x => x.joinLeft(`zi:2 bow:.5 pa:5 bor:5 flg:1 boc:#CCC mar:5`).cls("_abc", "ToolTip") }, typeof props.text == "string" ? React.createElement(Text, { selectable: true, css: "fos-sm" }, props.text) : props.text))));
    const style = optionalStyle(props.containerStyle);
    return (React.createElement(TouchableOpacity, { ref: c => state.ref = c, onPress: () => {
            state.visible = !state.visible;
        }, style: [style.o], css: x => x.joinRight(style.c) }, props.children));
});
//# sourceMappingURL=ToolTip.js.map