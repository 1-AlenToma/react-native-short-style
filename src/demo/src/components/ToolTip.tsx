import * as React from "react";
import { View, Text, TouchableOpacity } from "./ReactNativeComponents";
import { Size, ToolTipProps, ToolTipRef } from "../Typse";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { ifSelector, newId, optionalStyle, setRef } from "../config";
import { Blur } from "./Blur";
import { ReadyView } from "./ReadyView";
import { Platform } from "react-native";

export const ToolTip = React.forwardRef<ToolTipRef, ToolTipProps>((props, ref) => {

    const context = React.useContext(InternalThemeContext);
    globalData.hook("window")
    const state = StateBuilder(() => ({
        visible: false,
        id: newId(),
        ref: undefined as typeof View | undefined,
        pos: undefined as Size | undefined,
        toolTipSize: undefined as Size | undefined,
        mounted: false,
    })).ignore("ref", "pos", "toolTipSize").build();

    setRef(ref, {
        visible: (value) => state.visible = value
    } as ToolTipRef);

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
                }
            });
        }

    }




    globalData.useEffect(() => {
        if (state.visible)
            state.visible = false;
    }, "window")

    state.useEffect(() => {
        if (!state.visible)
            state.pos = undefined;
        else setPostion();

    }, "visible")

    const show = () => {

        let left = state.pos?.x;
        let top = state.pos?.y;
        if (state.toolTipSize && state.pos) {
            left = left - (state.toolTipSize.width / 2)
            top = top + state.pos.height
            if (left + state.toolTipSize.width > globalData.window.width)
                left = globalData.window.width - (state.toolTipSize.width)
            else if (left < 0)
                left = 5
            if (!props.postion || props.postion == "Top") {
                top -= state.toolTipSize.height + (Platform.OS == "web" ? state.pos.height : 0);
                if (top < 0)
                    top = 5
            }

        }

        const fn = state.visible && state.pos ? context.add.bind(context) : context.remove.bind(context);
        fn(state.id, (
            <View key={state.id} css={x => x.fillView().maW("95%").cls("_abc").pos(0, 0).baC(".co-transparent")}>
                <Blur css="zi:1 bac:transparent" onPress={() => state.visible = false} />
                <View onLayout={({ nativeEvent }) => {
                    if (!state.toolTipSize && state.visible) {
                        state.toolTipSize = nativeEvent.layout;
                        show();
                    }
                }} style={[{
                    left: left,
                    top: top,
                }]} css={x => x.joinLeft(`zi:2 bow:.5 pa:5 bor:5 flg:1 boc:#CCC mar:5`).cls("_abc", "ToolTip")}>
                    {
                        typeof props.text == "string" ? <Text selectable={true} css=".fos-sm">{props.text}</Text> : props.text
                    }
                </View>
            </View>
        ))

    }


    React.useEffect(() => {
        show();
        return () => context.remove(state.id);
    })

    React.useEffect(() => {
        return () => context.remove(state.id)
    }, [])

    if (ifSelector(props.ifTrue) == false)
        return null;
    const style = optionalStyle(props.containerStyle);
    return (
        <TouchableOpacity onLayout={setPostion} ref={c => {
            if (c !== state.ref as any)
                state.ref = c as any
        }} onPress={() => {
            state.visible = !state.visible;
        }} style={[style.o]} css={x => x.joinRight(style.c)}>
            {props.children}
        </TouchableOpacity>
    )
});