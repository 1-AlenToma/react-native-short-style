import { Icon } from "./Icon";
import { View, AnimatedView, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import { InternalThemeContext, globalData } from "../theme/ThemeContext";
import { useAnimate, useTimer } from "../hooks";
import StateBuilder from "react-smart-state";
import { Platform } from "react-native";
import { ifSelector, newId, optionalStyle, proc } from "../config";
import * as React from "react";
import { FormItemProps } from "../Typse";
import { ToolTip } from "./ToolTip";

export const FormItem = (props: FormItemProps) => {
    if (ifSelector(props.ifTrue) == false)
        return null;

    const icon: any = props.icon;
    const css = "mar:5";

    return (
        <View style={props.style} css={x => x.cls("_formItem", "FormItem").joinRight(props.css)}>
            <View>
                <View ifTrue={() => icon != undefined} css={css}>
                    {icon && icon.type ? <Icon size={15} color={"white"} {...icon} /> : icon}
                </View>
                <View ifTrue={() => props.title != undefined} css={css}>
                    {props.title && typeof props.title == "string" ? <Text css="fos-sm fow:bold">{props.title}</Text> : props.title}
                </View>
                <View css="_formItemCenter">
                    {props.children}
                </View>
                <ToolTip postion="Top" containerStyle={"po:relative le:1"} ifTrue={() => props.info != undefined} text={props.info}>
                    <Icon type="AntDesign" name="infocirlce" size={15} />
                </ToolTip>
            </View>
            <View ifTrue={() => props.message != undefined} css="fl:1 pal:10 pab:5">
                {props.message}
            </View>

        </View>
    )
}