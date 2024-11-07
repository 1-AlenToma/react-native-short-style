import * as React from "react";
import { View, Text, AnimatedView, TouchableOpacity } from "./ReactNativeComponents";
import { Button } from "./Button";
import { AlertViewFullProps, AlertViewProps, Size, ToastProps, ToolTipProps, ToolTipRef } from "../Typse";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "react-smart-state";
import { ifSelector, newId, optionalStyle, setRef } from "../config/Methods";
import { useAnimate, useTimer } from "../hooks";
import { ProgressBar } from "./ProgressBar";
import { Icon } from "./Icon";
import * as Native from "react-native"
import { Blur } from "./Blur";

export const ToolTip = React.forwardRef<ToolTipRef, ToolTipProps>((props, ref) => {
    if (ifSelector(props.ifTrue) == false)
        return null;
    const context = React.useContext(InternalThemeContext);
    globalData.hook("window")
    const state = StateBuilder({
        visible: false,
        id: newId(),
        ref: undefined as Native.TouchableOpacity | undefined,
        pos: undefined as Size | undefined,
        toolTipSize: undefined as Size | undefined
    }).ignore("ref", "pos", "toolTipSize").build();

    const fn = state.visible ? context.add.bind(context) : context.remove.bind(context);

    setRef(ref, {
        visible: (value) => state.visible = value
    } as ToolTipRef);

    state.useEffect(() => {
        if (state.ref)
            state.ref.measureInWindow((x, y, w, h) => {
                state.pos = {
                    x: x,
                    y: y,
                    px: x,
                    py: y,
                    width: w,
                    height: h
                }
            })
        /* state.ref.measureInWindow((x, y, w, h, px, py) => {
             state.pos = {
                 x: x,
                 y: y,
                 px: px,
                 py: py,
                 width: w,
                 height: h
             }
         })*/
    }, "ref")

    let left = state.pos?.px ?? 0;
    let top = ((state.pos?.py ?? 0) + (state.pos?.height ?? 0))
    if (state.toolTipSize) {
        if (left + state.toolTipSize.width > globalData.window.width)
            left = globalData.window.width - state.toolTipSize.width;
        if (!props.postion || props.postion == "Top")
            top -= state.toolTipSize.height + state.pos.height;
    }

    fn(state.id, (
        <View key={state.id} css={`_abc wi:100% he:100% le:0 to:0 bac-transparent ${optionalStyle(props.css).c}`}>
            <Blur css="zi:1 bac-transparent" onPress={() => state.visible = false} />
            <View onLayout={({ nativeEvent }) => state.toolTipSize = nativeEvent.layout} style={[optionalStyle(props.style).o, {
                left: left,
                top: top
            }]} css={`zi:2 bow:.5 pa:5 bor:5 boc:#CCC ${optionalStyle(props.css).c} _abc`}>
                {
                    typeof props.text == "string" ? <Text css="fos-sm">{props.text}</Text> : props.text
                }
            </View>
        </View>
    ))
    const style = optionalStyle(props.containerStyle);
    return (
        <TouchableOpacity ref={c => state.ref = c} onPress={() => {
            state.visible = !state.visible;
        }} style={[style.o]} css={style.c}>
            {props.children}
        </TouchableOpacity>
    )
});