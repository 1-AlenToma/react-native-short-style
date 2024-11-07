
import { View, AnimatedView, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import * as React from "react";
import {
    useAnimate
} from "../hooks";
import { ifSelector, newId, optionalStyle, proc, readAble } from "../config/Methods";
import { FabProps, ProgressBarProps, Size } from "../Typse";
import StateBuilder from "react-smart-state";
import { Button } from "./Button";
import { InternalThemeContext } from "../theme/ThemeContext";
import { ViewStyle } from "react-native";
import { Blur } from "./Blur";

export const Fab = (props: FabProps) => {
    let context = React.useContext(InternalThemeContext);
    const { animateY, animate, currentValue } = useAnimate();
    const state = StateBuilder({
        visible: false,
        id: newId(),

    }).build();

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

    const children = Array.isArray(props.children) ? props.children : [props.children]
    let style = {} as ViewStyle;
    switch (props.position) {
        case "RightBottom":
            style = {
                bottom: 10,
                right: 5
            }
            break;
        case "LeftBottom":
            style = {
                bottom: 10,
                left: 5
            }
            break;
        case "LeftTop":
            style = {
                top: 10,
                left: 5
            }
            break;
        case "RightTop":
            style = {
                top: 10,
                right: 5
            }
            break;
    }

    const styles = Array.isArray(props.style) ? props.style : [props.style];
    const animatedIItem = (
        <AnimatedView style={{
            transform: [
                {
                    scaleY: animate.y.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolate: "clamp"
                    })
                }]
        }} css="mat:10 bac-transparent overflow:hidden miw:100 zi:1" key={state.id + "View"} >
            <>
                {
                    props.children
                }
            </>
        </AnimatedView >
    )

    const view = (
        <React.Fragment key={state.id}>
            <Blur onPress={() => state.visible = false} ifTrue={state.visible} />
            <View css={`zi:100 overflow:visible _abc bac-transparent ${optionalStyle(props.css).c}`} style={[style, ...styles]}>
                {!["LeftTop", "RightTop"].includes(props.position) ? animatedIItem : null}
                <TouchableOpacity style={props.prefixContainerStyle} onPress={() => state.visible = !state.visible}
                    css="bac-transparent zi:2 fl:1 bac:blue bor:25 he:60 wi:50 pa:10 juc:center ali:center">
                    {typeof props.prefix == "string" ? <Text css="fos-xs">{props.prefix}</Text> : props.prefix}
                </TouchableOpacity>
                {!["LeftBottom", "RightBottom"].includes(props.position) ? animatedIItem : null}
            </View>
        </React.Fragment>
    )
    //context.add(state.id, view, true);

    return view as React.ReactNode;
}