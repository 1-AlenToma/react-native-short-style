import * as React from "react";
import { Animated, Platform, Easing, } from "react-native";
export const useAnimate = ({ y, x, speed, easing, delay, useNativeDriver = Platform.OS != "web" } = {}) => {
    const currentValue = React.useRef({
        x: undefined,
        y: undefined
    }).current;
    const animate = React.useRef(new Animated.ValueXY({
        y: y !== null && y !== void 0 ? y : 0,
        x: x !== null && x !== void 0 ? x : 0
    })).current;
    const animating = React.useRef({ x: undefined, y: undefined, isAnimating: false }).current;
    const animateY = (value, onFinished, sp) => {
        if (animate.y == currentValue.y) {
            onFinished === null || onFinished === void 0 ? void 0 : onFinished();
            return;
        }
        currentValue.y = value;
        run(value, animate.y, "y", () => {
            animate.y.setValue(value);
            animate.y.flattenOffset();
            onFinished === null || onFinished === void 0 ? void 0 : onFinished();
        }, sp);
    };
    const animateX = (value, onFinished, sp) => {
        if (value == currentValue.x) {
            onFinished === null || onFinished === void 0 ? void 0 : onFinished();
            return;
        }
        currentValue.x = value;
        run(value, animate.x, "x", () => {
            animate.x.setValue(value);
            animate.x.flattenOffset();
            onFinished === null || onFinished === void 0 ? void 0 : onFinished();
        }, sp);
    };
    const run = (value, animObject, key, onFinished, sp) => {
        var _a, _b, _c;
        try {
            animating.isAnimating = true;
            (_b = (_a = animating[key]) === null || _a === void 0 ? void 0 : _a.stop) === null || _b === void 0 ? void 0 : _b.call(_a);
            // If speed is 0, set value immediately
            if (sp === 0) {
                animObject.setValue(value);
                animating.isAnimating = false;
                onFinished === null || onFinished === void 0 ? void 0 : onFinished();
                return;
            }
            animating[key] = Animated.timing(animObject, {
                toValue: value,
                duration: (_c = sp !== null && sp !== void 0 ? sp : speed) !== null && _c !== void 0 ? _c : 300,
                easing: easing !== null && easing !== void 0 ? easing : Easing.linear,
                delay,
                useNativeDriver: useNativeDriver
            });
            animating[key].start(() => {
                animating.isAnimating = false;
                onFinished === null || onFinished === void 0 ? void 0 : onFinished();
            });
        }
        catch (e) {
            console.error("animObject", e);
        }
    };
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