import { Animated } from "react-native";
export declare const useAnimate: ({ y, x, speed, easing, delay, useNativeDriver }?: any) => {
    animateY: (value: any, onFinished?: Function, sp?: any) => void;
    animateX: (value: any, onFinished?: Function, sp?: any) => void;
    run: (value: any, animObject: any, key: "x" | "y", onFinished?: Function, sp?: any) => void;
    animate: Animated.ValueXY;
    currentValue: {
        x: any;
        y: any;
    };
    animating: any;
};
