import * as React from "react";
import { Animated, Platform, Easing, } from "react-native";
import { useLocalMemo } from "./useLocalMemo";
export const useAnimate = ({ y, x, speed, easing, delay, useNativeDriver = Platform.OS != "web" } = {}) => {
    const currentValue = React.useRef({
        x: undefined,
        y: undefined
    }).current;
    const { mem } = useLocalMemo();
    const animate = React.useRef(new Animated.ValueXY({
        y: y ?? 0,
        x: x ?? 0
    })).current;
    const animating = React.useRef({ x: undefined, y: undefined, isAnimating: false }).current;
    const animateY = mem((value, onFinished, sp) => {
        if (animate.y == currentValue.y) {
            onFinished?.();
            animating.isAnimating = false;
            return;
        }
        currentValue.y = value;
        run(value, animate.y, "y", () => {
            animate.y.setValue(value);
            animate.y.flattenOffset();
            onFinished?.();
        }, sp);
    });
    const animateX = mem((value, onFinished, sp) => {
        if (value == currentValue.x) {
            onFinished?.();
            animating.isAnimating = false;
            return;
        }
        currentValue.x = value;
        run(value, animate.x, "x", () => {
            animate.x.setValue(value);
            animate.x.flattenOffset();
            onFinished?.();
        }, sp);
    });
    const run = mem((value, animObject, key, onFinished, sp) => {
        try {
            animating.isAnimating = true;
            animating[key]?.stop?.();
            // If speed is 0, set value immediately
            if (sp === 0) {
                animObject.setValue(value);
                animating.isAnimating = false;
                onFinished?.();
                return;
            }
            animating[key] = Animated.timing(animObject, {
                toValue: value,
                duration: sp ?? speed ?? 300,
                easing: easing ?? Easing.linear,
                delay,
                useNativeDriver: useNativeDriver
            });
            animating[key].start(() => {
                animating.isAnimating = false;
                onFinished?.();
            });
        }
        catch (e) {
            console.error("animObject", e);
        }
    });
    return {
        animateY,
        animateX,
        run,
        animate,
        currentValue,
        animating
    };
};
//# sourceMappingURL=useAnimate.js.map