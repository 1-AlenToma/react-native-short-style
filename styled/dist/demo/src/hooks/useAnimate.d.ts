import { Animated } from "react-native";
export declare const useAnimate: ({ y, x, speed, easing, delay, useNativeDriver }?: any) => {
    animateY: any;
    animateX: any;
    run: any;
    animate: Animated.ValueXY;
    currentValue: {
        x: any;
        y: any;
    };
    animating: {
        x: any;
        y: any;
        isAnimating: boolean;
    };
};
