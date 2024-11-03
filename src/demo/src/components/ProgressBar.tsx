
import { View, AnimatedView, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import * as React from "react";
import {
    useAnimate
} from "../hooks";
import { ifSelector, proc, readAble } from "../config/Methods";
import { ProgressBarProps, Size } from "../Typse";


export const ProgressBar = ({
    value,
    ifTrue,
    color,
    speed,
    css,
    style,
    children
}: ProgressBarProps) => {
    if (ifSelector(ifTrue) === false) return null;
    const [size, setSize] = React.useState<Size>();
    const { animate, animateX } = useAnimate({
        speed: speed ?? 50
    });
    const applyProc = () => {
        if (size)
            animateX(
                Math.round(
                    proc(
                        Math.round(value * 100),
                        size.width
                    )
                )
            );
    };
    React.useEffect(() => {
        applyProc();
    }, [value]);

    React.useEffect(() => {
        applyProc();
    }, [size]);

    let bound: number[] = [];
    for (let i = 0; i <= 100; i++) {
        bound.push(
            Math.round(
                proc(i, size?.width ?? 100)
            )
        );
    }

    return (
        <View
            onLayout={e => {
                setSize(e.nativeEvent.layout);
            }}
            style={style}
            css={`progressBar ${css ?? ""}`}>
            <View css="blur zi:1" />
            <View
                css="zi:3 bac:transparent">
                {children}
            </View>
            <AnimatedView
                css="progressBarAnimatedView"
                style={{
                    backgroundColor: color ?? "green",
                    transform: [
                        {
                            translateX: animate.x.interpolate({
                                inputRange: bound,
                                outputRange: bound,
                                extrapolate: "clamp"
                            })
                        }
                    ]
                }}
            />
        </View>
    );
};
