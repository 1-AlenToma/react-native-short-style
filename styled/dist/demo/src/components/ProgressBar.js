import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, AnimatedView } from "./ReactNativeComponents";
import * as React from "react";
import { useAnimate } from "../hooks";
import { proc } from "../config";
import { Blur } from "./Blur";
export const ProgressBar = ({ value, ifTrue, color, speed, css, style, children }) => {
    var _a;
    const [size, setSize] = React.useState();
    const { animate, animateX } = useAnimate({
        speed: speed !== null && speed !== void 0 ? speed : 50
    });
    const applyProc = () => {
        if (size)
            animateX(Math.round(proc(Math.round(value * 100), size.width)));
    };
    React.useEffect(() => {
        applyProc();
    }, [value]);
    React.useEffect(() => {
        applyProc();
    }, [size]);
    let bound = [];
    for (let i = 0; i <= 100; i++) {
        bound.push(Math.round(proc(i, (_a = size === null || size === void 0 ? void 0 : size.width) !== null && _a !== void 0 ? _a : 100)));
    }
    return (_jsxs(View, { ifTrue: ifTrue, inspectDisplayName: "ProgressBar", onLayout: e => {
            setSize(e.nativeEvent.layout);
        }, style: style, css: x => x.cls("_progressBar", "ProgressBar").joinRight(css), children: [_jsx(Blur, { css: "zi:1" }), _jsx(View, { css: "zi:3 bac:transparent wi-100% juc-center ali-center fld-row", children: children }), _jsx(AnimatedView, { css: "_progressBarAnimatedView", style: {
                    backgroundColor: color !== null && color !== void 0 ? color : "green",
                    transform: [
                        {
                            translateX: animate.x.interpolate({
                                inputRange: bound,
                                outputRange: bound,
                                extrapolate: "clamp"
                            })
                        }
                    ]
                } })] }));
};
//# sourceMappingURL=ProgressBar.js.map