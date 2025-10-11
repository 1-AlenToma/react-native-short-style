import { jsx as _jsx } from "react/jsx-runtime";
import StateBuilder from "../States";
import { View, AnimatedScrollView } from "./ReactNativeComponents";
import * as React from "react";
import { useTimer } from "../hooks";
import { globalData } from "../theme/ThemeContext";
import { ReadyView } from "./ReadyView";
export const ScrollMenu = React.memo((props) => {
    var _a;
    const state = StateBuilder({
        selectedIndex: (_a = props.selectedIndex) !== null && _a !== void 0 ? _a : 0,
        size: undefined,
        scrollView: undefined,
        private: {
            scrollEnabled: true
        },
    }).ignore("size", "scrollView", "private").build();
    const timer = useTimer(300);
    const scrollToTimer = useTimer(100);
    const onScroll = (event) => {
        var _a, _b;
        if (!state.scrollView || !state.private.scrollEnabled)
            return;
        const { contentOffset } = event.nativeEvent;
        (_b = (_a = props.scrollViewProps) === null || _a === void 0 ? void 0 : _a.onScroll) === null || _b === void 0 ? void 0 : _b.call(_a, event);
        timer(() => {
            const offset = contentOffset;
            const containerSize = props.horizontal ? state.size.width : state.size.height;
            if (!containerSize || containerSize <= 0)
                return;
            const rawIndex = props.horizontal ? offset.x / containerSize : offset.y / containerSize;
            const selectedIndex = Math.round(rawIndex); // or Math.round(rawIndex) for more intuitive snapping
            if (state.selectedIndex !== selectedIndex) {
                state.selectedIndex = selectedIndex;
            }
            scrollto();
        });
    };
    const scrollto = (animate = true) => {
        //   state.private.scrollEnabled = false;
        scrollToTimer(() => {
            if (!state.scrollView)
                return;
            let size = state.size;
            if (size) {
                if (props.horizontal)
                    state.scrollView.scrollTo({ x: size.width * state.selectedIndex, animated: animate });
                else
                    state.scrollView.scrollTo({ y: size.height * state.selectedIndex, animated: animate });
                // state.scrollEnabled = true;
            }
        });
    };
    React.useEffect(() => {
        if (state.selectedIndex != props.selectedIndex)
            state.selectedIndex = props.selectedIndex;
    }, [props.selectedIndex]);
    state.useEffect(() => {
        var _a;
        scrollto();
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, state.selectedIndex);
    }, "selectedIndex");
    globalData.useEffect(() => {
        scrollToTimer(() => {
            scrollto(false);
        });
    }, "screen");
    return (_jsx(ReadyView, { ifTrue: props.ifTrue, onLayout: ({ nativeEvent }) => {
            //  if (!state.size)
            state.size = nativeEvent.layout;
        }, css: x => x.joinLeft("wi-100% he-100% fl-1").joinRight(props.css), style: props.style, children: _jsx(AnimatedScrollView, Object.assign({}, props.scrollViewProps, { onScrollBeginDrag: () => state.private.scrollEnabled = false, onScrollEndDrag: () => state.private.scrollEnabled = true, horizontal: props.horizontal, decelerationRate: .5, disableIntervalMomentum: false, contentContainerStyle: [{
                    height: props.horizontal ? undefined : `${(props.children.length * 100)}%`,
                    width: !props.horizontal ? undefined : `${(props.children.length * 100)}%`,
                }], onScroll: onScroll, ref: c => {
                state.scrollView = c;
                if (state.selectedIndex > 0)
                    scrollto();
            }, children: props.children.map((x, i) => {
                var _a, _b, _c, _d;
                return (_jsx(View, { style: {
                        minWidth: (_a = state.size) === null || _a === void 0 ? void 0 : _a.width,
                        minHeight: (_b = state.size) === null || _b === void 0 ? void 0 : _b.height,
                        maxHeight: (_c = state.size) === null || _c === void 0 ? void 0 : _c.height,
                        maxWidth: (_d = state.size) === null || _d === void 0 ? void 0 : _d.width
                    }, css: "fl-1 scrollMenuItem", children: x }, i));
            }) })) }));
});
//# sourceMappingURL=ScrollMenu.js.map