import * as React from "react";
import { AnimatedView, TouchableOpacity, View } from "./ReactNativeComponents";
import { globalData, InternalThemeContext } from "../theme/ThemeContext";
import { useAnimate, useLocalMemo, useTimer } from "../hooks";
import StateBuilder from "../States";
import { Easing, Platform, ViewStyle } from "react-native";
import { newId, optionalStyle } from "../config";
import { ModalProps } from "../Typse";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Blur } from "./Blur";
import { Portal } from "./Portal";


export const Modal = (props: ModalProps) => {
    const transform = React.useRef<any>({}).current;
    const {mem, memo} = useLocalMemo();
    const { animate, animateX, animateY } = useAnimate({
        speed: props.speed ?? 200,
        easing: props.easing ?? Easing.bounce
    });

    const state = StateBuilder(() => ({
        isVisible: undefined,
        id: newId()
    })).build();

    let toggle = async (
        show: boolean
    ) => {
        if (show && !state.isVisible) {
            state.isVisible = show;
        }
        animateY(!show ? 0 : .5)
        animateX(!show ? 0 : 1, () => {
            try {
                if (!show && props.isVisible)
                    props.onHide();
                if (show != state.isVisible) {
                    state.isVisible = show;
                }
            } catch (e) {
                console.error(e)
            }
        });
    }

    React.useEffect(() => {
        if (!state.isVisible || props.isVisible)
            state.isVisible = props.isVisible;
        else toggle(props.isVisible);
    }, [props.isVisible])

    React.useEffect(() => {
        toggle(state.isVisible)
    }, [state.isVisible])



    if (!transform[props.animationStyle == "Opacity" ? "opacity" : "scale"])
        transform[props.animationStyle == "Opacity" ? "opacity" : "scale"] = animate.x.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp"
        });
    let style = Array.isArray(props.style) ? props.style : [props.style];
    let zIndex = globalData.portals.elems.has(state.id) ? globalData.portals.keys.indexOf(state.id) : globalData.portals.totalItems;
    return (
        <Portal visible={state.isVisible}>
            <View inspectDisplayName="ModalContainer" css="_blur op:1 bac:transparent fl:1 ModalContainer" style={mem({ zIndex: zIndex + 300 }, zIndex)}>
                <Blur style={mem({
                    opacity: animate.y
                }, animate.y)} onPress={mem(props.disableBlurClick ? undefined : () => {
                    state.isVisible = false
                }, props.disableBlurClick)} css="_blur zi:1" />
                <AnimatedView inspectDisplayName="Modal" {...props}
                    css={memo(()=> x => x.cls("_modalDefaultStyle zi:2 _modal sh-sm _overflow Modal").joinRight(props.css), props.css)}
                    style={mem([...style,
                    {
                        transform: transform.scale ? [transform] : undefined,
                        opacity: transform.opacity ? transform.opacity : undefined
                    }
                    ], props.style)}>
                    <View ifTrue={props.addCloser == true} css={mem(x => x.cls("_modalClose").baC(".co-transparent"))}>
                        <Button
                            onPress={mem(() => state.isVisible = false)}
                            css={
                                mem(x => x.cls("sh-none", "_center").size(25, 25).baC(".co-transparent").juC("flex-end").pa(0).paL(1).boW(0))
                            } icon={memo(()=> <Icon type="AntDesign" name="close" size={15} />)} />
                    </View>
                    <View inspectDisplayName="ModalContent" css={mem(x => x.fillView().cls("ModalContent").zI(1).baC(".co-transparent").if(props.addCloser == true, x => x.maT(Platform.OS == "web" ? 5 : 10)), props.addCloser)}>
                        {props.children}
                    </View>
                </AnimatedView>
            </View>
        </Portal>);
}
