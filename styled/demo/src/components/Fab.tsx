
import { View, AnimatedView, Text, TouchableOpacity } from "./ReactNativeComponents";
import * as React from "react";
import {
    useAnimate,
    useLocalMemo
} from "../hooks";
import { newId } from "../config";
import { CSS_String, FabProps, Size } from "../Typse";
import StateBuilder from "../States";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import { Platform, StatusBar, ViewStyle } from "react-native";
import { Blur } from "./Blur";
import { Portal } from "./Portal";

export const Fab = (props: FabProps) => {
    const { animateY, animate, currentValue } = useAnimate();
    const { mem } = useLocalMemo();
    const state = StateBuilder(() => ({
        visible: false,
        id: newId(),
        size: undefined as Size | undefined
    })).ignore("size").build();

    if (props.follow == "Window")
        globalData.hook("window");


    const animateState = () => {
        let value = state.visible ? 1 : 0;
        if (currentValue.y == value)
            return;
        animateY(value, () => {

        })
    }

    state.useEffect(() => {
        animateState();
    }, "visible")

    React.useEffect(() => {
        animateState();
    }, [])



    const itemStyle = React.useMemo(() => {

        let style = {} as ViewStyle;
        let animatedItemPosition = undefined as CSS_String;

        let leftDefault = 15;
        let defaultTop = Platform.OS == "web" || props.follow == "Parent" ? 10 : StatusBar.currentHeight ?? 10;
        switch (props.position) {
            case "RightBottom":
                style = {
                    bottom: defaultTop,
                    right: leftDefault
                }
                if (state.size) {
                    animatedItemPosition = x => x.ri(leftDefault).maT(-state.size.height)
                }

                break;
            case "LeftBottom":
                style = {
                    bottom: defaultTop,
                    left: leftDefault
                }

                if (state.size) {
                    animatedItemPosition = x => x.le(leftDefault).maT(-state.size.height)
                }


                break;
            case "LeftTop":
                style = {
                    top: defaultTop,
                    left: leftDefault
                }

                if (state.size) {
                    animatedItemPosition = x => x.le(leftDefault).maT(state.size.height)
                }
                break;
            case "RightTop":
                style = {
                    top: defaultTop,
                    right: leftDefault
                }

                if (state.size) {
                    animatedItemPosition = x => x.ri(leftDefault).maT(state.size.height)
                }

                break;
        }

        return { style, animatedItemPosition }
    }, [props.position, props.follow, state.size, StatusBar.currentHeight])

    const animatedIItem = !state.visible ? null : (
        <AnimatedView onLayout={mem(({ nativeEvent }) => {
            state.size = nativeEvent.layout;
        })} style={mem({
            transform: [
                {
                    scaleY: animate.y.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolate: "clamp"
                    })
                }]
        }, animate.y)} css={mem(x => x.joinRight("mat:10 bac:transparent overflow:hidden miw:100 zi:1 _abc").joinRight(itemStyle.animatedItemPosition), itemStyle.animatedItemPosition)} key={state.id + "View"} >
                {
                    props.children
                }
        </AnimatedView >
    )



    const view = (
        <React.Fragment key={state.id}>
            <View css={mem(x => x.cls("_fab").joinRight(itemStyle.style).joinRight(props.css), props.css, itemStyle.style)} style={props.style}>
                {!["LeftTop", "RightTop"].includes(props.position) ? animatedIItem : null}
                <TouchableOpacity style={typeof props.prefixContainerStyle == "object" ? props.prefixContainerStyle : undefined} onPress={mem(() => state.visible = !state.visible)}
                    css={mem(x => x.cls("_fabCenter").if(props.prefixContainerStyle && ["string", "function"].includes(typeof props.prefixContainerStyle), c => c.joinRight(props.prefixContainerStyle)), props.prefixContainerStyle)}>
                    {typeof props.prefix == "string" ? <Text css="fos-xs">{props.prefix}</Text> : props.prefix}
                </TouchableOpacity>
                {!["LeftBottom", "RightBottom"].includes(props.position) ? animatedIItem : null}
            </View>
            <Blur onPress={mem(() => state.visible = false)} ifTrue={state.visible && props.blureScreen !== false} />
        </React.Fragment>
    )

    if (props.follow == "Parent")
        return view as React.ReactNode;
    return (<Portal>
        {view}
    </Portal>)
}