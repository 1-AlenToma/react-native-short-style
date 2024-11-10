
import { View, AnimatedView, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import * as React from "react";
import {
    useAnimate
} from "../hooks";
import { ifSelector, newId, optionalStyle, proc, readAble } from "../config";
import { CSS_String, FabProps, ProgressBarProps, Size } from "../Typse";
import StateBuilder from "react-smart-state";
import { Button } from "./Button";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import { ViewStyle } from "react-native";
import { Blur } from "./Blur";

export const Fab = (props: FabProps) => {
    let context = React.useContext(InternalThemeContext);
    const { animateY, animate, currentValue } = useAnimate();
    const state = StateBuilder({
        visible: false,
        id: newId(),
        size: undefined as Size | undefined
    }).ignore("size").build();

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

    let style = {} as ViewStyle;
    let animatedItemPosition = undefined as CSS_String;




    switch (props.position) {
        case "RightBottom":
            style = {
                bottom: 10,
                right: 5
            }
            if (state.size) {
                animatedItemPosition = x => x.le((-(state.size.width / 2)))
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

            if (state.size) {
                animatedItemPosition = x => x.le((-(state.size.width / 2)))
            }

            break;
    }


    const animatedIItem = (
        <AnimatedView onLayout={({ nativeEvent }) => {

            state.size = nativeEvent.layout;
        }} style={{
            transform: [
                {
                    scaleY: animate.y.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolate: "clamp"
                    })
                }]
        }} css={x => x.joinRight("mat:10 bac:transparent po:relative overflow:hidden miw:100 zi:1").joinRight(animatedItemPosition)} key={state.id + "View"} >
            <>
                {
                    props.children
                }
            </>
        </AnimatedView >
    )



    const view = (
        <React.Fragment key={state.id}>
            <View css={x => x.cls("_fab").joinRight(style).joinRight(props.css)} style={props.style}>
                {!["LeftTop", "RightTop"].includes(props.position) ? animatedIItem : null}
                <TouchableOpacity style={typeof props.prefixContainerStyle == "object" ? props.prefixContainerStyle : undefined} onPress={() => state.visible = !state.visible}
                    css={x => x.cls("_fabCenter").if(props.prefixContainerStyle && ["string", "function"].includes(typeof props.prefixContainerStyle), c => c.joinRight(props.prefixContainerStyle))}>
                    {typeof props.prefix == "string" ? <Text css="fos-xs">{props.prefix}</Text> : props.prefix}
                </TouchableOpacity>
                {!["LeftBottom", "RightBottom"].includes(props.position) ? animatedIItem : null}
            </View>
            <Blur onPress={() => state.visible = false} ifTrue={() => state.visible && props.blureScreen !== false} />
        </React.Fragment>
    )

    if (props.follow == "Parent")
        return view as React.ReactNode;
    else {
        context.add(state.id, view, true);
    }
    //context.add(state.id, view, true);

    return null as React.ReactNode;
}