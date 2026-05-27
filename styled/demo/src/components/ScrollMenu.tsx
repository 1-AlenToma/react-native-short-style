import StateBuilder from "../States";
import { ScrollMenuProps, Size } from "../Typse";
import { View, AnimatedScrollView } from "./ReactNativeComponents";
import * as React from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useLocalMemo, useTimer } from "../hooks";
import { globalData } from "../theme/ThemeContext";
import { ReadyView } from "./ReadyView";

export const ScrollMenu = React.memo<ScrollMenuProps>((props) => {
    const state = StateBuilder({
        selectedIndex: props.selectedIndex ?? 0,
        size: undefined as Size | undefined,
        scrollView: undefined as typeof AnimatedScrollView | undefined,
        private: {
            scrollEnabled: true
        },
    }).ignore("size", "scrollView", "private").build();
    const { mem } = useLocalMemo();
    const timer = useTimer(300);
    const scrollToTimer = useTimer(100);
    const onScroll = mem((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!state.scrollView || !state.private.scrollEnabled) return;

        const { contentOffset } = event.nativeEvent;
        props.scrollViewProps?.onScroll?.(event);

        timer(() => {
            const offset = contentOffset;
            const containerSize = props.horizontal ? state.size.width : state.size.height;
            if (!containerSize || containerSize <= 0) return;

            const rawIndex = props.horizontal ? offset.x / containerSize : offset.y / containerSize;
            const selectedIndex = Math.round(rawIndex); // or Math.round(rawIndex) for more intuitive snapping

            if (state.selectedIndex !== selectedIndex) {
                state.selectedIndex = selectedIndex;
            }
            scrollto();
        });
    }, props.scrollViewProps?.onScroll, props.horizontal);

    const scrollto = mem((animate: boolean = true) => {
        //   state.private.scrollEnabled = false;
        scrollToTimer(() => {
            if (!state.scrollView)
                return;
            let size = state.size
            if (size) {
                if (props.horizontal)
                    state.scrollView.scrollTo({ x: size.width * state.selectedIndex, animated: animate });
                else state.scrollView.scrollTo({ y: size.height * state.selectedIndex, animated: animate });
                // state.scrollEnabled = true;
            }
        });
    }, onScroll)

    React.useEffect(() => {
        if (state.selectedIndex != props.selectedIndex)
            state.selectedIndex = props.selectedIndex;
    }, [props.selectedIndex]);

    state.useEffect(() => {
        scrollto();
        props.onChange?.(state.selectedIndex);
    }, "selectedIndex")

    globalData.useEffect(() => {
        scrollToTimer(() => {
            scrollto(false);
        });
    }, "screen")
    const itemStyle = mem({
        minWidth: state.size?.width,
        minHeight: state.size?.height,
        maxHeight: state.size?.height,
        maxWidth: state.size?.width
    }, state.size, state.size);
    return (
        <ReadyView ifTrue={props.ifTrue}
            onLayout={mem(({ nativeEvent }) => {
                //  if (!state.size)
                state.size = nativeEvent.layout;
            })}
            css={mem(x => x.joinLeft("wi-100% he-100% fl-1").joinRight(props.css), props.css)}
            style={props.style}>
            <AnimatedScrollView
                {...(props.scrollViewProps as any)}
                onScrollBeginDrag={mem(() => state.private.scrollEnabled = false)}
                onScrollEndDrag={mem(() => state.private.scrollEnabled = true)}
                horizontal={props.horizontal}
                decelerationRate={.5}
                disableIntervalMomentum={false}
                contentContainerStyle={mem([{
                    height: props.horizontal ? undefined : `${(props.children.length * 100)}%`,
                    width: !props.horizontal ? undefined : `${(props.children.length * 100)}%`,
                }], props.horizontal, props.children.length)}
                onScroll={onScroll} ref={mem(c => {
                    state.scrollView = c as any;
                    if (state.selectedIndex > 0)
                        scrollto();
                }, scrollto)}>
                {
                    props.children.map((x, i) => (
                        <View key={i} style={itemStyle} css="fl-1 scrollMenuItem">
                            {x}
                        </View>
                    ))
                }
            </AnimatedScrollView>
        </ReadyView>
    )
})