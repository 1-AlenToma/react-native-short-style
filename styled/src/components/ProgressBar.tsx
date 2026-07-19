
import { View, AnimatedView } from "./ReactNativeComponents";
import * as React from "react";
import {
    useAnimate,
    useLocalMemo
} from "../hooks";
import { proc } from "../config";
import { ProgressBarProps, Size } from "../Typse";
import { Blur } from "./Blur";


export const ProgressBar = ({
    value,
    ifTrue,
    color,
    speed,
    css,
    style,
    children
}: ProgressBarProps) => {
    const [size, setSize] = React.useState<Size>();
    const { animate, animateX } = useAnimate({
        speed: speed ?? 50
    });
    const { mem } = useLocalMemo();
    const applyProc = mem(() => {
        if (size)
            animateX(
                Math.round(
                    proc(
                        Math.round(value * 100),
                        size.width
                    )
                )
            );
    }, size, value)
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
            ifTrue={ifTrue}
            inspectDisplayName="ProgressBar"
            onLayout={mem(e => {
                setSize(e.nativeEvent.layout);
            }, size)}
            style={style}
            css={mem(x => x.cls("_progressBar", "ProgressBar").joinRight(css), css)}>
            <Blur css="zi:1" />
            <View
                css="zi:3 bac:transparent wi-100% juc-center ali-center fld-row">
                {children}
            </View>
            <AnimatedView
                css="_progressBarAnimatedView"
                style={mem({
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
                }, animate.x, bound)}
            />
        </View>
    );
};
