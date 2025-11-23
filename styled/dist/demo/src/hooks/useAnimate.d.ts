import { Animated } from "react-native";
export declare const useAnimate: ({ y, x, speed, easing, delay, useNativeDriver }?: any) => {
    animateY: (value: any, onFinished?: Function, sp?: any) => void;
    animateX: (value: any, onFinished?: Function, sp?: number) => void;
    run: (value: number, animObject: Animated.Value, key: "x" | "y", onFinished?: Function, sp?: number) => void;
    animate: Animated.ValueXY;
    currentValue: {
        x: any;
        y: any;
    };
    animating: any;
};
