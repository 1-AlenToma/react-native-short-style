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
        state.counter += data.loaderCounter ?? .01;
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
                timer.clear();
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

    let typeInfo = {
        css: "",
        icon: undefined
    }

    switch (data.type) {
        case "Error":
            typeInfo = {
                css: "bac:#a94442 co:white",
                icon: (<Icon type="MaterialIcons" name="error" size={30} css="co:white" />)
            }
            break;
        case "Info":
            typeInfo = {
                css: "bac:#31708f co:white",
                icon: (<Icon type="AntDesign" name="infocirlce" size={30} css="co:white" />)
            }
            break;
        case "Warning":
            typeInfo = {
                css: "bac:#8a6d3b co:white",
                icon: (<Icon type="FontAwesome" name="warning" size={30} css="co:white" />)
            }
            break;
        case "Success":
            typeInfo = {
                css: "bac:#3c763d co:white",
                icon: (<Icon type="Entypo" name="check" size={30} css="co:white" />)
            }
            break;
    }

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
    }} css={`zi:2 miw:50% bor:5 bow:.5 boc:gray _overflow pa:5 maw:80% mih:30 _abc fld:row juc:center ali:center sh-sm ${typeInfo.css}`}>
        <Button onPress={() => state.visible = false} css="_abc ri:5 to:5 wi:15 he:15 zi:2 bac-transparent pa:0 pal:1 bow:0 sh-none" icon={<Icon type="AntDesign" name="close" color={"red"} size={15} />} />
        <View ifTrue={data.icon != undefined || typeInfo.icon != undefined} css="fl:1 maw:40 zi:1 bac-transparent">
            {data.icon ?? typeInfo.icon}
        </View>
        <View css="fl:1 zi:1 bac-transparent">
            <Text ifTrue={() => data.title != undefined} css={`fos-lg maw:90% fow:bold ${typeInfo.css}`}>{data.title}</Text>
            <Text css={`fos-sm maw:90% pab:5 ${typeInfo.css}`}>{data.message}</Text>
        </View>
        <ProgressBar ifTrue={() => data.loader !== false} color={data.loaderBg} children={null} value={state.counter} css="_abc bo:0 le:0 he:5 zi:2" />
    </AnimatedView>, true)

    return null;
}