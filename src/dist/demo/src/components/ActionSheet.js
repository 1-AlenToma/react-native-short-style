var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { View, AnimatedView, TouchableOpacity } from "./ReactNativeComponents";
import { InternalThemeContext, globalData } from "../theme/ThemeContext";
import { useAnimate, useTimer } from "../hooks";
import StateBuilder from "react-smart-state";
import { Easing, Platform } from "react-native";
import { newId, optionalStyle, proc } from "../config";
import * as React from "react";
import { useContext } from "react";
import { PanResponder } from "react-native";
import { Blur } from "./Blur";
export const ActionSheet = (props) => {
    var _a;
    globalData.hook("containerSize");
    let position = (_a = props.position) !== null && _a !== void 0 ? _a : "Bottom";
    const isVertical = ["Top", "Bottom"].includes(position);
    const state = StateBuilder({
        id: newId(),
        size: undefined,
        refItem: {
            startValue: 0,
            isVisible: false,
            panResponse: undefined,
            isTouched: false,
            interpolate: [],
            show: false
        }
    }).ignore("refItem").build();
    let getHeight = () => {
        var _a, _b, _c, _d;
        let h = (_a = props.size) !== null && _a !== void 0 ? _a : "50%";
        if (props.size == "content") {
            h = (_c = (isVertical ? (_b = state.size) === null || _b === void 0 ? void 0 : _b.height : state.size.width)) !== null && _c !== void 0 ? _c : 1;
        }
        if ((typeof h === "string")) {
            h = proc(parseFloat(((_d = h === null || h === void 0 ? void 0 : h.toString()) !== null && _d !== void 0 ? _d : "0").replace(/%/g, "").trim()), (isVertical ? globalData.containerSize.height : globalData.containerSize.width));
        }
        let value = Math.min(h, proc(isVertical ? globalData.containerSize.height : globalData.containerSize.width, 90));
        return value;
    };
    let context = useContext(InternalThemeContext);
    const timer = useTimer(100);
    const { animateY, animateX, animate, animating, currentValue } = useAnimate({
        y: 0,
        x: 0,
        speed: props.speed,
        easing: Easing.bounce
    });
    const blurAnimation = useAnimate();
    const setSize = () => {
        let size = globalData.containerSize;
        let containerHeight = size.height;
        let sheetHeight = Math.abs(containerHeight - getHeight());
        if (position == "Top") {
            containerHeight = 0;
            sheetHeight = -(getHeight() - size.y);
        }
        if (position == "Left") {
            containerHeight = -getHeight();
            sheetHeight = 0;
        }
        if (position == "Right") {
            containerHeight = Math.min(globalData.containerSize.width, size.width);
            sheetHeight = Math.abs(containerHeight - getHeight());
        }
        state.refItem.interpolate = [containerHeight, sheetHeight];
    };
    setSize();
    const firstValue = (show) => {
        let index = 1;
        if (position == "Bottom" || position == "Right")
            index = 0;
        if (position == "Top" || position == "Left")
            index = 1;
        if (show == false && (position == "Bottom" || position == "Right"))
            index = 1;
        if (show == false && (position == "Top" || position == "Left"))
            index = 0;
        return state.refItem.interpolate[index];
    };
    let toggle = (show) => __awaiter(void 0, void 0, void 0, function* () {
        if (animating.isAnimating)
            return;
        if (!state.refItem.isVisible && show) {
            state.refItem.isVisible = props.isVisible;
            renderUpdate();
        }
        setSize();
        const fn = !isVertical ? animateX : animateY;
        fn(firstValue(show), () => {
            var _a;
            blurAnimation.animateX(show ? 1 : 0, undefined, 1);
            state.refItem.panResponse = undefined;
            state.refItem.show = show;
            state.refItem.isVisible = props.isVisible;
            if (state.refItem.isVisible && !show) {
                (_a = props.onHide) === null || _a === void 0 ? void 0 : _a.call(props);
            }
            renderUpdate();
        });
    });
    const screenSizeUpdated = () => {
        timer(() => {
            setSize();
            if (state.refItem.isVisible) {
                state.refItem.panResponse = undefined;
                renderUpdate();
                //animate.flattenOffset();
                toggle(true);
            }
        });
    };
    globalData.useEffect(() => {
        screenSizeUpdated();
    }, "screen");
    state.useEffect(() => {
        screenSizeUpdated();
    }, "size");
    React.useEffect(() => {
        toggle(props.isVisible);
    }, [props.isVisible]);
    React.useEffect(() => {
        return () => {
            context.remove(state.id);
        };
    }, []);
    const renderUpdate = () => {
        let Handle = Platform.OS == "web" ? TouchableOpacity : View;
        const handle = (React.createElement(Handle, { activeOpacity: 1, onPressIn: () => state.refItem.isTouched = true, onPressOut: () => state.refItem.isTouched = false, style: {
                backgroundColor: "transparent"
            }, css: !isVertical ? "_actionSheet_horizontal_handle" : "_actionSheet_vertical_handle", onTouchStart: (e) => {
                state.refItem.isTouched = true;
            } },
            React.createElement(TouchableOpacity, { onPress: () => {
                    toggle(false);
                }, css: !isVertical ? "_actionSheet_horizontal_handle_Button" : "_actionSheet_vertical_handle_Button" })));
        if (!state.refItem.panResponse) {
            state.refItem.panResponse =
                PanResponder.create({
                    onMoveShouldSetPanResponder: (evt, gestureState) => {
                        const { dx, dy } = gestureState;
                        return ((state.refItem.isTouched) &&
                            (dx > 2 ||
                                dx < -2 ||
                                dy > 2 ||
                                dy < -2));
                    },
                    onPanResponderGrant: (e, gestureState) => {
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
                            else
                                animate.x.setValue(-gestureState.dx);
                        }
                        else
                            animate.y.setValue(-gestureState.dy);
                    },
                    onPanResponderRelease: (evt, gestureState) => {
                        let old = firstValue();
                        let newValue = !isVertical ? gestureState.dx : gestureState.dy;
                        let diff = newValue - state.refItem.startValue;
                        if (Math.abs(diff) > getHeight() / 3) {
                            animate.flattenOffset();
                            toggle(false);
                        }
                        else {
                            //   animate.flattenOffset();
                            animateY(old); // reset to start value
                        }
                        return false;
                    }
                });
        }
        let inputRange = [...state.refItem.interpolate].sort((a, b) => a - b);
        let fn = state.refItem.isVisible ? context.add.bind(context) : context.remove.bind(context);
        let transform = {};
        if (isVertical) {
            transform.translateY = animate.y.interpolate({
                inputRange: inputRange,
                outputRange: state.refItem.interpolate,
                extrapolate: "clamp"
            });
        }
        else {
            transform.translateX = animate.x.interpolate({
                inputRange: inputRange,
                outputRange: state.refItem.interpolate,
                extrapolate: "clamp"
            });
        }
        let zIndex = context.items().items.has(state.id) ? [...context.items().items.keys()].indexOf(state.id) : context.items().items.size;
        fn(state.id, React.createElement(View, { key: state.id, css: "co-transparent _topPostion", style: { zIndex: zIndex + 300 } },
            React.createElement(Blur, { style: {
                    opacity: blurAnimation.animate.x.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, .5]
                    })
                }, onPress: () => {
                    if (!props.disableBlurClick)
                        toggle(false);
                }, css: "zi:1" }),
            React.createElement(AnimatedView, Object.assign({ onTouchStart: () => {
                    //state.refItem.isTouched = true;
                }, onTouchEnd: (event) => {
                    state.refItem.isTouched = false;
                }, css: `_actionSheet _actionSheet_${position} zi-2 ActionSheet`, style: [
                    {
                        width: !isVertical ? getHeight() : "99%",
                        height: isVertical ? getHeight() : "100%",
                        transform: [transform]
                    },
                ] }, state.refItem.panResponse.panHandlers),
                React.createElement(View, { style: {
                        flexDirection: !isVertical ? "row" : undefined
                    }, css: "wi:100% he:100% pa:10 flex:1" },
                    position == "Bottom" || position == "Right" ? handle : null,
                    React.createElement(View, { ifTrue: state.refItem.show || !props.lazyLoading, style: [optionalStyle(props.css).o, (props.size != "content" ? {
                                flex: 1,
                                flexGrow: 1
                            } : undefined)], onLayout: ({ nativeEvent }) => {
                            if (props.size == "content") {
                                state.size = nativeEvent.layout;
                                state.size.height += 50;
                                state.size.width += 50;
                            }
                        }, css: `zi:5 maw:99% _overflow mat:5 bac-transparent ${optionalStyle(props.css).c}` }, props.children),
                    position == "Top" || position == "Left" ? handle : null))));
    };
    React.useEffect(() => {
        renderUpdate();
    }, [props.children, props.isVisible, props.size, props.position, props.css, props.disableBlurClick, props.style]);
    return null;
};
//# sourceMappingURL=ActionSheet.js.map