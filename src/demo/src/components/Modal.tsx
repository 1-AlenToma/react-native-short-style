import * as React from "react";
import { AnimatedView, TouchableOpacity, View } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "react-smart-state";
import { Platform, ViewStyle } from "react-native";
import { newId, optionalStyle } from "../config/Methods";
import { ModalProps } from "../Typse";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Blur } from "./Blur";


export const Modal = (props: ModalProps) => {
    const context = React.useContext(InternalThemeContext);
    const { animate, animateX } = useAnimate({
        x: 0,
        y: 0,
        speed: props.speed ?? 200,
        useNativeDriver: false
    });
    const state = StateBuilder({
        isVisible: undefined,
        id: newId()
    }).build();

    let toggle = async (
        show: boolean
    ) => {
        if (show && !state.isVisible) {
            state.isVisible = show;
        }
        render();
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

    const render = () => {
        let style = Array.isArray(props.style) ? props.style : [props.style];
        if (state.isVisible) {
            context.add(state.id,
                <Blur key={state.id} css="op:1 bac:transparent fl:1" style={{ zIndex: context.totalItems() + 300 }}>
                    <Blur onPress={() => {
                        if (!props.disableBlurClick)
                            toggle(false);
                    }} css="zi:1" />
                    <AnimatedView {...props} css={`_modalDefaultStyle sh-sm _overflow ${optionalStyle(props.css).c}`} style={[...style,
                    {
                        transform: [
                            {
                                scale: animate.x.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                    extrapolate: "clamp"
                                })
                            }
                        ]

                    }
                    ]}>
                        <View css={x => x.cls("_abc").he(30).wi(30).ri(0).zI(3).alI("flex-end").baC("$baC-transparent")}>
                            <Button onPress={() => toggle(false)} css={
                                x => x.cls("sh-none", "_center").size(30, 30).baC("$baC-transparent").paL(1).boW(0)
                            } icon={<Icon type="AntDesign" name="close" size={15} />} />
                        </View>
                        <View css={x => x.fillView().zI(1).if(props.addCloser == true, x => x.maT(Platform.OS == "web" ? 5 : 10))}>
                            {props.children}
                        </View>
                    </AnimatedView>
                </Blur>
            )
        } else {
            context.remove(state.id);
        }

    }

    return null;

}
