import { Icon } from "./Icon";
import { View, AnimatedView, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import { InternalThemeContext, globalData } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "react-smart-state";
import { Platform } from "react-native";
import { newId, proc } from "../config/Methods";
import * as React from "react";
import Constants from "expo-constants";


import {
    useContext
} from "react";
import {
    Animated,
    PanResponder
} from "react-native";
import { ActionSheetProps } from "../Typse";
export const ActionSheet = (props: ActionSheetProps) => {
    let getHeight = () => {
        let h = props.height;
        if ((typeof h === "string")) {
            h = proc(parseFloat((h?.toString() ?? "0").replace(/%/g, "").trim()), globalData.screen.height);
        }

        return Math.min(h, proc(context.containerSize().height, 80));

    };

    let context = useContext(InternalThemeContext);
    globalData.hook("screen")
    const { animateY, animate } = useAnimate({
        y: -getHeight(),
        speed: props.speed
    });

    const state = StateBuilder({
        id: newId(),
        refItem: {
            startValue: 0,
            isVisible: false,
            panResponse: undefined,
            isTouched: false,
            interpolate: [],
            show: false
        }
    }).ignore("refItem").build();

    const setSize = () => {
        let containerHeight = Math.min(globalData.screen.height, context.containerSize().height)
        let sheetHeight = Math.abs(containerHeight - getHeight())
        state.refItem.interpolate = [containerHeight, sheetHeight].reverse();
    };
    setSize();

    let toggle = async (show: boolean) => {

        if (!state.refItem.isVisible && show) {
            state.refItem.isVisible = props.isVisible;
            renderUpdate();
        }

        animateY(
            state.refItem.interpolate[!show ? 1 : 0],
            () => {
                state.refItem.panResponse = undefined;
                state.refItem.show = show;
                state.refItem.isVisible = props.isVisible;
                if (state.refItem.isVisible && !show) {
                    props.onHide?.();
                }
                renderUpdate();
            }
        );
    };

    globalData.useEffect(() => {
        setSize();
        if (state.refItem.isVisible) {
            state.refItem.panResponse = undefined;
            renderUpdate();
            //animate.flattenOffset();
            animateY(
                state.refItem.interpolate[0],
                () => { },
                0
            );
        }
    }, "screen");


    React.useEffect(() => {
        toggle(props.isVisible);
    }, [props.isVisible]);

    React.useEffect(() => {
        return () => {
            context.remove(state.id);
        };
    }, []);

    const renderUpdate = () => {


        if (!state.refItem.panResponse) {
            state.refItem.panResponse =
                PanResponder.create({
                    onMoveShouldSetPanResponder: (
                        evt,
                        gestureState
                    ) => {
                        const { dx, dy } = gestureState;
                        return (
                            (state.refItem.isTouched) &&
                            (dx > 2 ||
                                dx < -2 ||
                                dy > 2 ||
                                dy < -2)
                        );
                    },
                    onPanResponderGrant: (
                        e,
                        gestureState
                    ) => {
                        state.refItem.startValue = gestureState.dy;
                        animate.setValue({
                            x: 0,
                            y: state.refItem.interpolate[0]
                        });
                        animate.extractOffset();
                        return true;
                    },
                    onPanResponderMove: Animated.event(
                        [
                            null,
                            { dx: animate.x, dy: animate.y }
                        ],
                        { useNativeDriver: false }
                    ),
                    onPanResponderRelease: (
                        evt,
                        gestureState
                    ) => {
                        let old = state.refItem.interpolate[0];
                        let newValue = gestureState.dy;
                        let diff = newValue - state.refItem.startValue;
                        if (Math.abs(diff) > getHeight() / 3) {
                            toggle(false);
                        } else {
                            animate.flattenOffset();
                            animateY(old); // reset to start value
                        }
                        return false;
                    }
                });
        }
        let inputRange = [
            ...state.refItem.interpolate
        ].sort((a, b) => a - b);
        let fn = state.refItem.isVisible ? context.add.bind(context) : context.remove.bind(context);
        let Handle = Platform.OS == "web" ? TouchableOpacity : View;
        fn(state.id,
            <View key={state.id} css="blur op:1 bac:transparent" style={{ zIndex: context.totalItems() + 300 }}>
                <TouchableOpacity onPress={() => {
                    if (!props.disableBlurClick)
                        toggle(false);
                }} css="blur zi:1" />
                <AnimatedView

                    onTouchEnd={() => {

                        state.refItem.isTouched = false;

                    }}
                    css="zi:2 overflow abc mah:80% le:.5% overflow wi:99% juc:flex-start botlw:.5 botrw:.5 boTLR:15 botrr:15"
                    style={[
                        {
                            height: getHeight(),
                            transform: [
                                {
                                    translateY:
                                        animate.y.interpolate({
                                            inputRange: inputRange,
                                            outputRange: state.refItem.interpolate,
                                            extrapolate: "clamp"
                                        })
                                }
                            ]
                        },
                    ]}  {...state.refItem.panResponse.panHandlers}>
                    <View
                        css="clearboth pa:10 flex:1">
                        <Handle
                            activeOpacity={1}
                            onPressIn={() => state.refItem.isTouched = true}
                            onPressOut={() => state.refItem.isTouched = false}
                            css="he:10 zi:1 fg:1 overflow"
                            onTouchStart={() => {
                                state.refItem.isTouched = true;
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    toggle(false);
                                }}
                                css="juc:center ali:center bor:5 zi:1 to:0 wi:40 he:10 bac:gray overflow juc:center ali:center absolute le:45%">

                                <Icon
                                    css="bold"
                                    type="Entypo"
                                    name="chevron-small-down"
                                    size={14}
                                    color={"#fff"}
                                />
                            </TouchableOpacity>
                        </Handle>
                        <View ifTrue={() => state.refItem.show || !props.lazyLoading} css="flex:1 fg:1 zi:5 maw:99% overflow mat:5">
                            {props.children}
                        </View>
                    </View>
                </AnimatedView >
            </View>,
        );
    };

    React.useEffect(() => {
        renderUpdate();
    }, [props.children, props.isVisible, props.height, props.css, props.disableBlurClick, props.style]);

    return null;
};