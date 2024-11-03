import * as React from "react";
import { View, Text, AnimatedView } from "./ReactNativeComponents";
import { Button } from "./Button";
import { AlertViewFullProps, AlertViewProps, Size, ToastProps } from "../Typse";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "react-smart-state";
import { newId } from "../config/Methods";
import { useAnimate, useTimer } from "../hooks";
import { ProgressBar } from "./ProgressBar";
import { Icon } from "./Icon";

export const ToastView = () => {
    globalData.hook("screen");
    const { animate, animateY } = useAnimate();
    const data = globalData.alertViewData.toastData ?? {} as ToastProps;
    data.position = data.position ?? "Top";
    const context = React.useContext(InternalThemeContext);
    const timer = useTimer(100);
    const state = StateBuilder({
        size: undefined as Size,
        id: newId(),
        counter: 0,
        visible: false
    }).ignore("id").build();
    let fn = data.message ? context.add.bind(context) : context.remove.bind(context);
    let interpolate = [0, 1];
    const startCounter = () => {
        if (data.loader == false)
            return;
        state.counter += .01;
        if (state.counter < 1)
            timer(() => startCounter());
        else state.visible = false;
    }


    if (state.size) {
        if (data.position == "Top") {
            interpolate = [-state.size.height, 5];
        } else {
            interpolate = [globalData.window.height + state.size.height, (globalData.window.height - state.size.height) - 30];
        }
    }

    const animateTop = () => {
        animateY(state.visible ? 1 : 0, () => {
            if (state.visible)
                startCounter();
            else state.counter = 0;

            if (!state.visible && state.size) {
                state.size = undefined;
                globalData.alertViewData.toastData = undefined;
            }
        });
    }

    globalData.useEffect(() => {
        state.visible = globalData.alertViewData.toastData != undefined;
    }, "alertViewData.toastData")

    state.useEffect(() => {
        if (state.size)
            animateTop();

    }, "visible", "size")

    fn(state.id, <AnimatedView key={state.id} onLayout={({ nativeEvent }) => {
        state.size = nativeEvent.layout;
    }} style={{
        left: state.size ? (globalData.window.width - state.size.width) / 2 : 0,
        top: !state.size ? (data.position == "Bottom" ? "100%" : "-100%") : 0,
        transform: [{
            translateY: animate.y.interpolate({
                inputRange: [0, 1],
                outputRange: interpolate,
                extrapolate: "clamp"
            })
        }]
    }} css="zi:2 miw:50% bor:5 bow:.5 boc:gray overflow pa:5 maw:80% mih:30 abc fld:row juc:center ali:center sh-sm">
        <Button onPress={() => state.visible = false} css="abc ri:5 to:5 wi:15 he:15 zi:2 bac-transparent pa:0 pal:1 bow:0 sh-none" icon={<Icon type="AntDesign" name="close" color={"red"} size={15} />} />
        <View ifTrue={data.icon != undefined} css="fl:1 maw:40 zi:1">
            {data.icon}
        </View>
        <View css="fl:1 zi:1">
            <Text ifTrue={() => data.title != undefined} css="fos-lg maw:90% fow:bold">{data.title}</Text>
            <Text css="fos-sm maw:90% pab:5">{data.message}</Text>
        </View>
        <ProgressBar ifTrue={() => data.loader !== false} color={data.loaderBg} children={null} value={state.counter} css="abc bo:0 le:0 he:5 zi:2" />
    </AnimatedView>, true)

    return null;
}