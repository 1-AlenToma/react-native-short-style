import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { View, AnimatedView, SliderView, ProgressBar, FormItem } from "../src";
import StateBuilder from 'react-smart-state';
const colorCls = Object.keys({
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    info: '#17a2b8',
    warning: '#ffc107',
    error: '#dc3545',
    dark: '#343a40',
});
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const MovingBall = () => {
    const ballSize = 50;
    const speed = 200; // pixels per second
    const updateInterval = 60; // min ms between updates
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const state = StateBuilder({
        container: undefined,
        vx: speed,
        vy: speed,
        x: 0,
        y: 0,
        lastTime: 0,
        bacIndex: 0,
        sliderValue: speed
    }).build();
    useEffect(() => {
        let animationFrame;
        if (state.container) {
            const animate = (time) => {
                if (!state.lastTime)
                    state.lastTime = time;
                const delta = (time - state.lastTime) / 1000; // seconds
                if (time - state.lastTime >= updateInterval) {
                    let { x, y, vx, vy } = state;
                    // compute step from velocity & delta
                    x += vx * delta;
                    y += vy * delta;
                    // Bounce on edges
                    if (x + ballSize >= state.container.width) {
                        x = state.container.width - ballSize;
                        vx = -vx;
                    }
                    else if (x <= 0) {
                        x = 0;
                        vx = -vx;
                    }
                    if (y + ballSize >= state.container.height) {
                        y = state.container.height - ballSize;
                        vy = -vy;
                    }
                    else if (y <= 0) {
                        y = 0;
                        vy = -vy;
                    }
                    state.batch(() => {
                        state.vx = vx;
                        state.vy = vy;
                        state.x = x;
                        state.y = y;
                        state.lastTime = time;
                        state.bacIndex = x % 10 == 0 ? randomInt(0, colorCls.length - 1) : state.bacIndex;
                        position.setValue({ x, y });
                    });
                }
                animationFrame = requestAnimationFrame(animate);
            };
            animationFrame = requestAnimationFrame(animate);
        }
        return () => {
            if (animationFrame !== undefined)
                cancelAnimationFrame(animationFrame);
        };
    }, [state.container]);
    //console.log(`co-${colorCls[state.bacIndex]}`)
    return (_jsxs(View, { css: "bac-black fl-1 juc-center ali-center", onLayout: ({ nativeEvent }) => {
            state.container = nativeEvent.layout;
        }, children: [_jsxs(FormItem, { title: "Speed", css: "he-100 wi-200 op-0.5", children: [_jsx(ProgressBar, { value: state.sliderValue }), _jsx(SliderView, { css: "mat:30", animationType: "spring", minimumValue: 100, value: state.sliderValue, onValueChange: (v) => state.sliderValue = state.vx = state.vy = v[0], maximumValue: 2000, step: 50, enableButtons: true })] }), _jsx(AnimatedView, { css: x => x.joinLeft("_abc to-0 le-0").baC(`.co-${colorCls[state.bacIndex]}`), style: Object.assign({ width: ballSize, height: ballSize, borderRadius: ballSize / 2 }, position.getLayout()) })] }));
};
//# sourceMappingURL=AnimationBlock.js.map