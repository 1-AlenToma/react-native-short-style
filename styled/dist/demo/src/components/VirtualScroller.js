import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import StateBuilder from "../States";
import { newId, setRef } from "../config";
import { useTimer, useDeferredMemo, useLocalMemo } from "../hooks";
import { View, TouchableOpacity, ScrollView } from "./ReactNativeComponentsMems";
import { SmartScheduler } from "../constant";
const ScrollContext = React.createContext(null);
const ScrollIsVisibleView = ({ startIndex, children }) => {
    const context = React.useContext(ScrollContext);
    context.parentState.localBind("refItems.scrollOffset");
    const numColumns = context.props.numColumns ?? 1;
    const rowIndex = Math.floor(startIndex / numColumns);
    const isHorizontal = context.props.horizontal;
    const itemSize = context.itemSize;
    const itemSizes = context.parentState.itemSizes;
    const scrollSettings = context.parentState.scrollSettings;
    const { mem } = useLocalMemo();
    const isVisible = mem(() => {
        const { estimatedItemSize, itemSizes, containerSize, } = context.parentState;
        const overscanCount = context.props.itemSize?.overscanCount ?? 30;
        const isHorizontal = context.props.horizontal;
        const itemSize = context.itemSize;
        const numColumns = context.props.numColumns ?? 1;
        const rowIndex = Math.floor(startIndex / numColumns);
        if (!containerSize || estimatedItemSize === 0) {
            return { visible: startIndex === 0, render: !(containerSize == undefined || (!(startIndex === 0) && (scrollSettings.scrollToIndex === undefined || rowIndex > scrollSettings.scrollToIndex))) };
        }
        // Calculate row start offset
        let rowStart = 0;
        if (itemSize == undefined) {
            for (let i = 0; i < rowIndex; i++) {
                const itemIndex = i * numColumns;
                const size = itemSizes[itemIndex] ?? {
                    width: estimatedItemSize,
                    height: estimatedItemSize
                };
                rowStart += isHorizontal ? size.width : size.height;
            }
        }
        else
            rowStart = itemSize * rowIndex;
        const rowSize = itemSizes[startIndex] ?? {
            width: estimatedItemSize,
            height: estimatedItemSize
        };
        const rowLength = isHorizontal ? rowSize.width : rowSize.height;
        const rowEnd = rowStart + rowLength;
        const viewportStart = context.parentState.refItems.scrollOffset;
        const viewportEnd = context.parentState.refItems.scrollOffset + ((isHorizontal ? containerSize.width : containerSize.height));
        const overscanPixels = (itemSize ?? estimatedItemSize) * overscanCount;
        const overscannedStartRow = Math.max(0, rowStart - overscanPixels);
        const overscannedEndRow = rowEnd + overscanPixels;
        let visible = false;
        if (itemSize == undefined)
            visible = (overscannedEndRow > viewportStart && overscannedStartRow < viewportEnd) || (rowStart - (context.props.scrollEventThrottle ?? 16) < viewportEnd);
        else
            visible = (overscannedEndRow > viewportStart && overscannedStartRow < viewportEnd);
        let render = !(containerSize == undefined || (!visible && (scrollSettings.scrollToIndex === undefined || rowIndex > scrollSettings.scrollToIndex)));
        return { visible, render };
    }, scrollSettings);
    const style = useDeferredMemo(() => [{
            flexDirection: isHorizontal ? "column" : "row",
            width: isHorizontal ? itemSize : context.parentState.containerSize.width,
            height: isHorizontal ? undefined : itemSize,
            position: itemSize != undefined ? "absolute" : undefined,
            left: isHorizontal && itemSize != undefined ? itemSize * rowIndex : undefined,
            top: !isHorizontal && itemSize != undefined ? itemSize * rowIndex : undefined
        }], [itemSize, context.parentState.containerSize.width]);
    const validateTrigger = mem(() => {
        if (!itemSizes[startIndex] && itemSize != undefined)
            itemSizes[startIndex] = { width: itemSize, height: itemSize };
        if (itemSizes[startIndex] && rowIndex === scrollSettings.scrollToIndex) {
            scrollSettings.scrollCallBack?.(startIndex);
        }
    }, itemSizes, startIndex, scrollSettings);
    let state = isVisible();
    React.useEffect(() => {
        if (state.render)
            validateTrigger();
    });
    const visibility = () => {
        return (state.render && (state.visible || rowIndex == context.parentState.scrollToIndex || context.itemSize == undefined));
    };
    return (_jsx(View, { ifTrue: visibility, onLayout: mem(({ nativeEvent }) => {
            const size = nativeEvent.layout;
            if (context.parentState.estimatedItemSize <= 2) {
                context.parentState.estimatedItemSize = isHorizontal ? size.width : size.height;
            }
            itemSizes[startIndex] = size;
            //  validateTrigger();
        }, itemSizes), css: mem(x => x.joinLeft(context.props.itemStyle).cls("virtualItemSelector"), context.props.itemStyle), style: style, children: children }));
};
// Each row view component that conditionally renders visible rows
const VirtualScrollerView = React.memo(({ startIndex }) => {
    const context = React.useContext(ScrollContext);
    const isHorizontal = context.props.horizontal;
    const onItemPress = context.props.onItemPress;
    const onItemLayout = context.props.onItemLayout;
    const renderedItems = useDeferredMemo(() => {
        const isView = context.props.onItemLayout || (context.props.numColumns && context.props.numColumns > 1 && !isHorizontal);
        const Container = onItemPress ? TouchableOpacity : (isView ? View : React.Fragment);
        const containerProps = isView || onItemPress ? ({ style: { flex: 1, backgroundColor: "transparent" } }) : undefined;
        const rows = context.itemRows.get(startIndex);
        return rows.map((item, i) => {
            const index = startIndex + i;
            const interalProps = onItemPress ? { onPress: () => onItemPress({ item, index }) } : undefined;
            const layoutProps = isView && onItemLayout ? { onLayout: ((event) => onItemLayout(event, item)) } : undefined;
            return _createElement(Container, { ...containerProps, ...interalProps, ...layoutProps, key: context.props.keyExtractor?.(item, index) ?? index }, context.props.renderItem({ item, index }));
        });
    }, [context.itemRows, ...(context.props.updateOn ?? [])]);
    return (_jsx(ScrollIsVisibleView, { startIndex: startIndex, children: renderedItems }, "starter" + startIndex));
});
export const VirtualScroller = React.forwardRef((props, ref) => {
    const timer = useTimer(props.contentSizeTimer ?? 0);
    const endReachedTimer = useTimer(200);
    const scrollToIndexTimer = useTimer(10);
    const numColumns = props.numColumns ?? 1;
    const { mem } = useLocalMemo();
    const state = StateBuilder(() => ({
        containerSize: undefined,
        estimatedItemSize: props.itemSize?.size != undefined && typeof props.itemSize?.size == "number" ? props.itemSize.size : 0,
        itemSizes: {},
        scrollSettings: {},
        items: {},
        id: newId(),
        refItems: {
            scrollView: undefined,
            scrollOffset: 0,
            init: false,
            ref: {
                scrollToIndex: (index, animated) => {
                    if (!state.refItems.scrollView || !state.containerSize || props.items.length <= index)
                        return;
                    const rowIndex = Math.floor(index / numColumns);
                    state.scrollSettings = ({
                        scrollToIndex: rowIndex,
                        scrollCallBack: () => {
                            state.scrollSettings = {};
                            scrollToIndexTimer(() => {
                                const offset = Object.keys(state.itemSizes)
                                    .map(Number)
                                    .filter(i => Math.floor(i / numColumns) < rowIndex)
                                    .reduce((acc, i) => {
                                    const size = state.itemSizes[i];
                                    return acc + (props.horizontal ? size.width : size.height);
                                }, 0);
                                const scrollParams = props.horizontal ? { x: offset, animated: animated ?? false } : { y: offset, animated: animated ?? false };
                                state.refItems.scrollView?.scrollTo?.(scrollParams);
                            });
                        }
                    });
                }
            }
        }
    })).ignore("refItems", "containerSize", "scrollSettings", "itemSizes").build();
    const renderTimer = useTimer(100);
    const effectiveItems = mem(state.estimatedItemSize === 0 ? props.items.slice(0, numColumns) : props.items, state.estimatedItemSize, props.items);
    const prepaireItems = mem(async () => {
        renderTimer(async () => {
            SmartScheduler.run(() => {
                const rows = { children: [], rows: new Map() };
                for (let i = 0; i < effectiveItems.length; i += numColumns) {
                    rows.rows.set(i, effectiveItems.slice(i, i + numColumns));
                    rows.children.push(_jsx(VirtualScrollerView, { startIndex: i }, i));
                }
                state.items = rows;
            });
        }, effectiveItems.length <= 5 ? 0 : undefined);
    }, effectiveItems);
    React.useEffect(() => {
        prepaireItems();
    }, [effectiveItems]);
    const itemSize = React.useMemo(() => {
        if (props.itemSize?.size == "EstimatedItemSize") {
            if (state.estimatedItemSize > 0)
                return state.estimatedItemSize;
        }
        return props.itemSize?.size;
    }, [props.itemSize, state.estimatedItemSize]);
    React.useEffect(() => {
        if (state.estimatedItemSize > 0 && state.containerSize) {
            setRef(ref, (state.refItems.ref = { ...state.refItems.ref }));
            if (!state.refItems.init && props.initializeIndex != undefined)
                state.refItems.ref.scrollToIndex(props.initializeIndex);
            state.refItems.init = true;
        }
    }, [state.estimatedItemSize, state.containerSize, props.initializeIndex]);
    React.useEffect(() => {
        if (props.initializeIndex != undefined) {
            state.refItems.ref.scrollToIndex(props.initializeIndex);
        }
    }, [props.initializeIndex, state.containerSize]);
    const rowCount = Math.ceil(props.items.length / numColumns);
    return (_jsx(ScrollContext.Provider, { value: mem({
            parentState: state,
            itemRows: state.items?.rows ?? new Map(),
            props,
            itemSize
        }, itemSize, props, state.items?.rows, state.refItems.ref), children: _jsx(ScrollView, { ifTrue: props.ifTrue, css: props.css, showsVerticalScrollIndicator: props.showsVerticalScrollIndicator, showsHorizontalScrollIndicator: props.showsHorizontalScrollIndicator, horizontal: props.horizontal, ref: mem(c => {
                state.refItems.scrollView = c;
            }), scrollEventThrottle: props.scrollEventThrottle ?? 16, contentContainerStyle: mem({
                minHeight: !props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
                minWidth: props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
                flexDirection: props.horizontal ? "row" : "column",
            }, props.horizontal, state.estimatedItemSize, rowCount), pagingEnabled: props.pagingEnabled, onScroll: mem(event => {
                const { nativeEvent } = event;
                if (state.containerSize) {
                    const scrollValue = props.horizontal ? nativeEvent.contentOffset.x : nativeEvent.contentOffset.y;
                    state.refItems.scrollOffset = scrollValue;
                    props.onScroll?.(event);
                    const { contentSize, layoutMeasurement, } = nativeEvent;
                    endReachedTimer(() => {
                        const contentLength = props.horizontal
                            ? contentSize.width
                            : contentSize.height;
                        const containerLength = props.horizontal
                            ? layoutMeasurement.width
                            : layoutMeasurement.height;
                        if (contentLength <= containerLength)
                            return;
                        const distanceFromEnd = contentLength - scrollValue - containerLength;
                        if (distanceFromEnd <= (props.onEndReachedThreshold ?? 100)) {
                            props.onEndReached?.();
                        }
                    });
                }
            }, props.onScroll, props.onEndReachedThreshold, props.onEndReached), style: props.style, id: props.id, onLayout: mem(({ nativeEvent }) => {
                timer(() => {
                    const { layout } = nativeEvent;
                    if (!state.containerSize ||
                        layout.width !== state.containerSize.width ||
                        layout.height !== state.containerSize.height) {
                        state.containerSize = layout;
                    }
                });
            }, props.initializeIndex), children: state.containerSize && state.items?.children }, state.id) }));
});
//# sourceMappingURL=VirtualScroller.js.map