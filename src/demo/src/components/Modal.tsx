import * as React from "react";
import { AnimatedView, TouchableOpacity, View } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "react-smart-state";
import { Easing, Platform, ViewStyle } from "react-native";
import { newId, optionalStyle } from "../config";
import { ModalProps } from "../Typse";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Blur } from "./Blur";


export const Modal = (props: ModalProps) => {
    const context = React.useContext(InternalThemeContext);
    const { animate, animateX, animateY } = useAnimate({
        speed: props.speed ?? 200,
    });

    const state = StateBuilder({
        isVisible: undefined,
        id: newId()
    }).timeout(undefined).build();

    let toggle = async (
        show: boolean
    ) => {
        if (show && !state.isVisible) {
            state.isVisible = show;
        }
        render();
        animateY(!show ? 0 : .5)
        animateX(!show ? 0 : 1, () => {
            if (!show && props.isVisible)
                props.onHide();
            if (show != state.isVisible) {
                state.isVisible = show;
                render();
            }
        });
    };

    React.useEffect(() => {
        toggle(props.isVisible);
    }, [props.isVisible])

    React.useEffect(() => {
        render();
    }, [props.children])

    React.useEffect(() => {
        state.isVisible = props.isVisible;
        return () => context.remove(state.id)
    }, [])

    const transform = { scale: undefined, opacity: undefined };
    transform[props.animationStyle == "Opacity" ? "opacity" : "scale"] = animate.x.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp"
    });

    const render = () => {
        let style = Array.isArray(props.style) ? props.style : [props.style];
        if (state.isVisible) {
            context.add(state.id,
                <View key={state.id} css="_blur op:1 bac:transparent fl:1" style={{ zIndex: context.totalItems() + 300 }}>
                    <Blur style={{
                        opacity: animate.y
                    }} onPress={props.disableBlurClick ? undefined : () => {
                        toggle(false);
                    }} css="_blur zi:1" />
                    <AnimatedView {...props} css={x => x.cls("_modalDefaultStyle zi:2 _modal sh-sm _overflow Modal").joinRight(props.css)} style={[...style,
                    {
                        transform: transform.scale ? [transform] : undefined,
                        opacity: transform.opacity ? transform.opacity : undefined
                    }
                    ]}>
                        <View css={x => x.cls("_modalClose")}>
                            <Button onPress={() => toggle(false)} css={
                                x => x.cls("sh-none", "_center").size(30, 30).baC("$co-transparent").paL(1).boW(0)
                            } icon={<Icon type="AntDesign" name="close" size={15} />} />
                        </View>
                        <View css={x => x.fillView().zI(1).if(props.addCloser == true, x => x.maT(Platform.OS == "web" ? 5 : 10))}>
                            {props.children}
                        </View>
                    </AnimatedView>
                </View>)
        } else {
            context.remove(state.id);
        }

    }

    return null;

}
