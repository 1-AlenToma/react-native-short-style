import * as React from "react";
import { AnimatedView, TouchableOpacity, View } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "react-smart-state";
import { ViewStyle } from "react-native";
import { newId } from "../config/Methods";
import { ModalProps } from "../Typse";


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
                <View key={state.id} css="blur op:1 bac:transparent" style={{ zIndex: context.totalItems() + 300 }}>
                    <TouchableOpacity onPress={() => {
                        if (!props.disableBlurClick)
                            toggle(false);
                    }} css="blur zi:1" />
                    <AnimatedView {...props} css={`modalDefaultStyle ${props.css ?? ""}`} style={[...style,
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
                    </AnimatedView>
                </View>
            )
        } else {
            context.remove(state.id);
        }

    }

    return null;

}
