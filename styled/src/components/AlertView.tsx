import * as React from "react";
import { View, Text } from "./ReactNativeComponents";
import { Button } from "./Button";
import { AlertViewFullProps, AlertViewProps } from "../Typse";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { Modal } from "./Modal";
import { useLocalMemo } from "../hooks";

export const AlertView = () => {

    globalData.hook("alertViewData.data");
    globalData.bind("alertViewData.data.callBack");
    const state = StateBuilder({
        size: undefined
    }).build();
    const { mem, memo } = useLocalMemo();
    globalData.useEffect(() => {
        if (state.size)
            state.size = undefined;
    }, "window", "alertViewData.data")

    const answer = mem((a) => {
        globalData.alertViewData.data.callBack?.(a);
        globalData.alertViewData.data = undefined;
    })

    const data: AlertViewFullProps = globalData.alertViewData.data ?? {} as any;

    return (
        <Modal css={memo(() => x => x.joinLeft(data.css).joinRight("pa-0 ma-0"), data.css)}
            style={mem({ minHeight: state.size?.height, minWidth: state.size?.width }, state.size)}
            disableBlurClick={data.callBack != undefined}
            isVisible={globalData.alertViewData.data != undefined}
            onHide={mem(() => globalData.alertViewData.data = undefined)}>
            <View css="fl:1 pa-0">
                <View css="fl:1 pa-10" style={mem({ height: data.callBack ? "90%" : "100%" }, data.callBack)}
                    onLayout={mem(({ nativeEvent }) => {
                        if (!state.size) {
                            state.size = nativeEvent.layout;
                            state.size.height += data.callBack ? 30 : 0;
                            state.size.height = Math.max(state.size.height, 200)
                        }
                    })}>
                    <Text css={`fos-md fow:bold`} ifTrue={data.title != undefined}>{data.title}</Text>
                    <Text css={`fos-${data.size ?? "sm"} co:gray pal:2`}>{data.message ?? ""}</Text>
                </View>
                <View ifTrue={data.callBack != undefined} css="alertViewButtonContainer">
                    <Button text={data.yesText ?? "Yes"} onPress={mem(() => answer(true))} />
                    <Button text={data.cancelText ?? "No"} onPress={mem(() => answer(false))} />
                </View>
                <View ifTrue={data.callBack == undefined} css="alertViewButtonContainer">
                    <Button text={data.okText ?? "Ok"} onPress={mem(() => answer(false))} />
                </View>
            </View>
        </Modal>)
}