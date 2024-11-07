import * as React from "react";
import { AnimatedView, TouchableOpacity, View, Text, ScrollView, TextInput } from "./ReactNativeComponents";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "react-smart-state";
import { ViewStyle } from "react-native";
import { ifSelector, newId, optionalStyle, setRef } from "../config/Methods";
import { CollabseProps, DropdownItem, DropdownListProps, DropdownRefItem, ModalProps } from "../Typse";
import { Modal } from "./Modal";
import { ActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import * as ReactNtive from "react-native";

export const Collabse = React.forwardRef<DropdownRefItem, CollabseProps>((props, ref) => {
    if (ifSelector(props.ifTrue) == false)
        return null;
    const state = StateBuilder({
        visible: props.defaultActive ?? false,
        prefix: props.defaultActive ? "minus" : "plus"
    }).build();

    const { animate, animateY } = useAnimate({ speed: 500 });
    const show = () => {
        animateY(state.visible ? 1 : 0, () => {
            state.prefix = state.visible ? "minus" : "plus"
        })
    }

    setRef(ref, {
        open: () => state.visible = true,
        close: () => state.visible = false,
        selectedValue: state.visible
    });

    React.useEffect(() => {
        show();
    }, [])

    state.useEffect(() => show(), "visible")


    return (
        <View style={props.style} css={`bor:5 wi:100% mih:30 bow:.5 boc:#CCC _overflow pa:5 ${optionalStyle(props.css).c}`}>
            <TouchableOpacity onPress={() => state.visible = !state.visible} css="wi:100% he:30 ali:center fld:row">
                {props.icon}
                <Text css="fos-lg fow:bold">{props.text}</Text>
                <Icon type="AntDesign" css="_abc ri:2" size={20} name={state.prefix} />
            </TouchableOpacity>
            <AnimatedView css="wi:100% pal:10" style={{
                overflow: "hidden",
                maxHeight: animate.y.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, globalData.window.height],
                    extrapolate: "clamp"
                })
            }}>
                {props.children}
            </AnimatedView>
        </View>
    )

})