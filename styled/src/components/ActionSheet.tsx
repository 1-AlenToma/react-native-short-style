import { View, AnimatedView, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import { InternalThemeContext, globalData } from "../theme/ThemeContext";
import { useAnimate, useLocalMemo, useTimer } from "../hooks";
import StateBuilder from "../States";
import { Easing, Platform } from "react-native";
import { newId, proc } from "../config";
import * as React from "react";

import {
    useContext
} from "react";
import {
    Animated,
    PanResponder
} from "react-native";
import { ActionSheetProps, Size } from "../Typse";
import { Blur } from "./Blur";
import { Portal } from "./Portal";
export const ActionSheet = (props: ActionSheetProps) => {
    globalData.hook("containerSize")
    let position = props.position ?? "Bottom";
    const isVertical = ["Top", "Bottom"].includes(position);
    const state = StateBuilder(() => ({
        id: newId(),
        size: undefined as Size | undefined,
        isVisible: false,
        refItem: {
            startValue: 0,
            panResponse: undefined,
            isTouched: false,
            interpolate: [],
            show: false
        }
    })).ignore("refItem").build();

    const { mem } = useLocalMemo();
    let getHeight = () => {
        let h: any = props.size ?? "50%";
        if (props.size == "content") {
            h = (isVertical ? state.size?.height : state.size.width) ?? 1;
        }


        if ((typeof h === "string")) {
            h = proc(parseFloat((h?.toString() ?? "0").replace(/%/g, "").trim()), (isVertical ? globalData.containerSize.height : globalData.containerSize.width));
        }
        let value = Math.min(h, proc(isVertical ? globalData.containerSize.height : globalData.containerSize.width, 90));
        return value;
    }

    const timer = useTimer(100);
    const { animateY, animateX, animate, animating, currentValue } = useAnimate({
        y: 0,
        x: 0,
        speed: props.speed,
        easing: Easing.bounce
    });

    const blurAnimation = useAnimate({
        speed: 20
    });
    const setSize = () => {
        let size = globalData.containerSize;
        let containerHeight = size.height;
        let sheetHeight = Math.abs(containerHeight - getHeight());

        if (position == "Top") {
            containerHeight = 0
            sheetHeight = -(getHeight() - size.y);
        }

        if (position == "Left") {
            containerHeight = -getHeight();
            sheetHeight = 0;
        }

        if (position == "Right") {
            containerHeight = Math.min(globalData.containerSize.width, size.width)
            sheetHeight = Math.abs(containerHeight - getHeight());
        }

        state.refItem.interpolate = [containerHeight, sheetHeight]

    };
    setSize();

    const firstValue = (show?: boolean) => {
        let index = 1;
        if (position == "Bottom" || position == "Right")
            index = 0;
        if (position == "Top" || position == "Left")
            index = 1;
        if (show == false && (position == "Bottom" || position == "Right"))
            index = 1;
        if (show == false && (position == "Top" || position == "Left"))
            index = 0;
        return state.refItem.interpolate[index]
    }

    let toggle = async (show: boolean) => {
        //  if (animating.isAnimating)
        //    return;
        //if (!state.isVisible && show) {
        //    state.isVisible = props.isVisible;
        //}
        setSize();
        const fn = !isVertical ? animateX : animateY;
        blurAnimation.animateX(show ? 1 : 0, undefined, 20)
        fn(
            firstValue(show),
            () => {

                state.refItem.panResponse = undefined;
                state.refItem.show = show;
                if (!show && props.isVisible) {
                    props.onHide?.();
                } else if (state.isVisible != props.isVisible && !show)
                    state.isVisible = props.isVisible;
            }
        );
    };

    const screenSizeUpdated = () => {
        timer(() => {
            setSize();

            if (state.isVisible) {
                state.refItem.panResponse = undefined;
                //animate.flattenOffset();
                toggle(true)
            }
        })
    }

    React.useEffect(() => {
        animate.flattenOffset();
        state.refItem.panResponse = undefined;
        screenSizeUpdated();
    }, [position]);

    globalData.useEffect(() => {
        screenSizeUpdated();
    }, "screen");

    state.useEffect(() => {
        screenSizeUpdated();
    }, "size")


    React.useEffect(() => {
        state.isVisible = props.isVisible;
    }, [props.isVisible]);

    // Run the animation whenever the internal visibility actually shifts
    React.useEffect(() => {
        toggle(state.isVisible);
    }, [state.isVisible]);


    const handleStyle: any = {};
    if (!isVertical && position == "Left")
        handleStyle.right = 8;
    if (!isVertical && position == "Right")
        handleStyle.left = 8;
    if (isVertical && position == "Top")
        handleStyle.bottom = 8;
    if (isVertical && position == "Bottom")
        handleStyle.top = 8;

    const _css: any = React.useMemo(() => {
        return x => x.joinLeft("zi-5 maw-99% ._overflow mat-5 bac-transparent").joinRight(props.css).zI(5).importantValue();
    }, [props.css]);

    let Handle = Platform.OS == "web" ? TouchableOpacity : View;
    const handle = (<Handle
        activeOpacity={1}
        onPressIn={mem(() => state.refItem.isTouched = true)}
        onPressOut={mem(() => state.refItem.isTouched = false)}
        style={mem({
            backgroundColor: "transparent",
            ...handleStyle
        }, position, isVertical)}
        css={!isVertical ? "_actionSheet_horizontal_handle" : "_actionSheet_vertical_handle"}
        onTouchStart={mem((e) => {
            state.refItem.isTouched = true;
        })}>
        <TouchableOpacity
            onPress={mem(() => {
                toggle(false);
                // state.isVisible = false;
            })}
            css={!isVertical ? "_actionSheet_horizontal_handle_Button" : "_actionSheet_vertical_handle_Button"}>
        </TouchableOpacity>
    </Handle>)

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
                    if (!isVertical)
                        state.refItem.startValue = gestureState.dx;
                    else
                        state.refItem.startValue = gestureState.dy;
                    animate.setValue({
                        x: isVertical ? 0 : firstValue(),
                        y: isVertical ? firstValue() : 0
                    });
                    animate.extractOffset();
                    return true;
                },
                onPanResponderMove: (e, gestureState) => {
                    if (!isVertical) {
                        if (position == "Left")
                            animate.x.setValue(gestureState.dx);
                        else animate.x.setValue(-gestureState.dx)
                    }
                    else
                        animate.y.setValue(-gestureState.dy);
                },
                onPanResponderRelease: (
                    evt,
                    gestureState
                ) => {

                    let old = firstValue();
                    let newValue = !isVertical ? gestureState.dx : gestureState.dy;
                    let diff = newValue - state.refItem.startValue;
                    if (Math.abs(diff) > getHeight() / 3) {
                        animate.flattenOffset();
                        toggle(false);
                    } else {
                        //   animate.flattenOffset();
                        animateY(old); // reset to start value
                    }
                    return false;
                }
            });
    }
    let inputRange = [...state.refItem.interpolate].sort((a, b) => a - b);
    let transform: any = {};
    if (isVertical) {
        transform.translateY = animate.y.interpolate({
            inputRange: inputRange,
            outputRange: state.refItem.interpolate,
            extrapolate: "clamp"
        })
    } else {
        transform.translateX = animate.x.interpolate({
            inputRange: inputRange,
            outputRange: state.refItem.interpolate,
            extrapolate: "clamp"
        })
    }
    let zIndex = globalData.portals.elems.has(state.id) ? globalData.portals.keys.indexOf(state.id) : globalData.portals.totalItems;

    return (
        <Portal visible={state.isVisible}>
            <View inspectDisplayName="ActionSheetContainer" css={`co-transparent _topPostion ActionSheetContainer zi-${zIndex + 300}`}>
                <Blur style={mem({
                    opacity: blurAnimation.animate.x.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, .5]
                    })
                }, blurAnimation.animate.x)} onPress={mem(() => {
                    if (!props.disableBlurClick)
                        toggle(false);
                    // state.isVisible= false;
                }, props.disableBlurClick)} css="zi:1" />
                <AnimatedView
                    inspectDisplayName="ActionSheet"
                    onTouchEnd={mem((event) => {
                        state.refItem.isTouched = false;
                    })}
                    css={`_actionSheet _actionSheet_${position} zi-2 ActionSheet`}
                    style={[
                        {
                            width: !isVertical ? getHeight() : "99%",
                            height: isVertical ? getHeight() : "100%",
                            transform: [transform]
                        },
                    ]}  {...state.refItem.panResponse.panHandlers}>
                    <View
                        inspectDisplayName="ActionSheetContent"
                        style={mem({
                            flexDirection: !isVertical ? "row" : undefined
                        }, isVertical)}
                        css="wi:100% he:100% pa:10 flex:1 ActionSheetContent">
                        {position == "Bottom" || position == "Right" ? handle : null}
                        <View ifTrue={state.refItem.show || !props.lazyLoading}
                            css={_css}
                            style={mem([(props.size != "content" ? {
                                flex: 1,
                                flexGrow: 1
                            } : undefined)], props.size)} onLayout={mem(({ nativeEvent }) => {
                                if (props.size == "content") {
                                    state.batch(() => {
                                        state.size = nativeEvent.layout;
                                        state.size.height += 50 as any;
                                        state.size.width += 50 as any;
                                    })
                                }
                            })}>
                            {props.children}
                        </View>
                        {position == "Top" || position == "Left" ? handle : null}
                    </View>
                </AnimatedView >
            </View>
        </Portal>
    );
}