import * as React from "react";
import { View, Text } from "./ReactNativeComponents";
import { Button } from "./Button";
import { AlertViewFullProps, AlertViewProps } from "../Typse";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "react-smart-state";
import { Modal } from "./Modal";

export const AlertView = () => {

    globalData.hook("alertViewData.data");
    globalData.bind("alertViewData.data.callBack");
    const state = StateBuilder({
        size: undefined
    }).build();

    const answer = (a) => {
        globalData.alertViewData.data.callBack?.(a);
        globalData.alertViewData.data = undefined;
    }

    const data: AlertViewFullProps = globalData.alertViewData.data ?? {} as any;

    return (
        <Modal css={data.css} style={{ minHeight: state.size?.height, minWidth: state.size?.width }} disableBlurClick={data.callBack != undefined} isVisible={globalData.alertViewData.data != undefined} onHide={() => globalData.alertViewData.data = undefined}>
            <View css="fl:1">
                <View css="fl:1" style={{ height: data.callBack ? "90%" : "100%" }} onLayout={({ nativeEvent }) => {
                    state.size = nativeEvent.layout;
                }}>
                    <Text css={`fos-md fow:bold`} ifTrue={() => data.title != undefined}>{data.title}</Text>
                    <Text css={`fos-${data.size ?? "sm"} co:gray pal:2`}>{data.message}</Text>
                </View>
                <View ifTrue={() => data.callBack != undefined} css="fld:row juc:flex-end ali:center">
                    <Button css="mar:5" text={data.yesText ?? "Yes"} onPress={() => answer(true)} />
                    <Button text={data.cancelText ?? "No"} onPress={() => answer(false)} />
                </View>
                <View ifTrue={() => data.callBack == undefined} css="fld:row juc:flex-end ali:center">
                    <Button css="mar:5" text={data.okText ?? "Ok"} onPress={() => answer(false)} />
                </View>
            </View>
        </Modal>)
}