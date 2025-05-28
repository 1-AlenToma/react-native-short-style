import * as React from "react";
import { View, ScrollView, TouchableOpacity } from "./ReactNativeComponents";
import StateBuilder from "react-smart-state";
import { newId, setRef } from "../config";
import { Size, VirtualScrollerViewRefProps, VirtualScrollerViewProps, ViewStyle } from "../Typse";
import { useTimer, useAsyncMemo, useSubscriber } from "../hooks";
import { globalData } from "../theme/ThemeContext";
import { LayoutChangeEvent } from "react-native";

const useScrollIsVisible = (startIndex: number) => {
    const context = React.useContext(ScrollContext);
    const scrollOffset = context.scrollOffset.listen();
    const state = StateBuilder({
        visible: false,
        render: false
    }).build();

    const isVisible = (scrollValue?: number) => {
        const {
            estimatedItemSize,
            itemSizes,
            containerSize,
            scrollToIndex
        } = context.parentState;
        const overscanCount = context.props.itemSize?.overscanCount ?? 30;
        const isHorizontal = context.props.horizontal;
        const itemSize = context.props.itemSize?.size ?? undefined;
        const numColumns = context.props.numColumns ?? 1;
        const rowIndex = Math.floor(startIndex / numColumns);
        scrollValue = scrollValue ?? scrollOffset;
        if (!containerSize || estimatedItemSize === 0) {
            state.visible = startIndex === 0;
            state.render = !(containerSize == undefined || (!state.visible && (scrollToIndex === undefined || rowIndex > scrollToIndex)));
            return;
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
        } else rowStart = itemSize * rowIndex;

        const rowSize = itemSizes[startIndex] ?? {
            width: estimatedItemSize,
            height: estimatedItemSize
        };
        const rowLength = isHorizontal ? rowSize.width : rowSize.height;
        const rowEnd = rowStart + rowLength;

        const viewportStart = scrollOffset;
        const viewportEnd = scrollOffset + ((isHorizontal ? containerSize.width : containerSize.height));
        const overscanPixels = (itemSize ?? estimatedItemSize) * overscanCount;

        const overscannedStartRow = Math.max(0, rowStart - overscanPixels);
        const overscannedEndRow = rowEnd + overscanPixels;


        let visible = false;
        if (itemSize == undefined)
            visible = (overscannedEndRow > viewportStart && overscannedStartRow < viewportEnd) || (rowStart - (context.props.scrollEventThrottle ?? 16) < viewportEnd);
        else
            visible = (overscannedEndRow > viewportStart && overscannedStartRow < viewportEnd);


        let render = !(containerSize == undefined || (!visible && (scrollToIndex === undefined || rowIndex > scrollToIndex)));
        if (state.visible != visible) {
            state.visible = visible;
        }
        if (state.render != render) {
            state.render = render;
        }
        return visible;
    };

    React.useEffect(() => {
        isVisible();
    }, [scrollOffset, context.parentState.containerSize])

    return state;
}


// Context used to share scroll state and layout handling
const ScrollContext = React.createContext<{
    parentState: any;
    props: VirtualScrollerViewProps;
    itemRows: { startIndex: number, items: any[] }[];
    scrollOffset: { listen: (validator?: (newValue: number) => boolean) => number }
}>(null!);

// Each row view component that conditionally renders visible rows
const VirtualScrollerView = React.memo(({ startIndex }: { startIndex: number }) => {
    const context = React.useContext(ScrollContext);
    const visible = useScrollIsVisible(startIndex);


    const {
        estimatedItemSize,
        itemSizes,
        containerSize,
        //  refItems: { scrollOffset },
        scrollToIndex,
        scrollCallBack,
    } = context.parentState;

    const isHorizontal = context.props.horizontal;
    let itemSize = context.props.itemSize?.size
    const numColumns = context.props.numColumns ?? 1;
    const onItemPress = context.props.onItemPress;
    const onItemLayout = context.props.onItemLayout;
    const rowIndex = Math.floor(startIndex / numColumns);


    const validateTrigger = () => {
        if (!itemSizes[startIndex] && itemSize != undefined)
            itemSizes[startIndex] = { width: itemSize, height: itemSize };
        if (itemSizes[startIndex] && rowIndex === scrollToIndex) {
            scrollCallBack?.(startIndex);
        }
    }
    validateTrigger();
    const onLayout = React.useCallback(({ nativeEvent }: LayoutChangeEvent) => {
        const size = nativeEvent.layout;
        if (estimatedItemSize <= 2) {
            context.parentState.estimatedItemSize = isHorizontal ? size.width : size.height;

        }
        itemSizes[startIndex] = size;
        validateTrigger();
    }, [context.itemRows, scrollToIndex, ...(context.props.updateOn ?? [])]);

    const style = React.useMemo(() => ({
        flexDirection: isHorizontal ? "column" : "row",
        width: isHorizontal ? itemSize : containerSize.width,
        height: isHorizontal ? undefined : itemSize,
        position: itemSize != undefined ? "absolute" : undefined,
        left: isHorizontal && itemSize != undefined ? itemSize * rowIndex : undefined,
        top: !isHorizontal && itemSize != undefined ? itemSize * rowIndex : undefined
    } as ViewStyle), [context.itemRows, itemSize, ...(context.props.updateOn ?? [])]);

    const renderedItems = useAsyncMemo(() => {
        const isView = context.props.onItemLayout || (context.props.numColumns && context.props.numColumns > 1 && !isHorizontal);
        const Container = onItemPress ? TouchableOpacity : (isView ? View : React.Fragment);
        const containerProps: any = isView || onItemPress ? { style: { flex: 1, backgroundColor: "transparent" } as ViewStyle } : undefined;

        const row = context.itemRows.find(r => r.startIndex === startIndex);
        return row?.items.map((item, i) => {
            const index = startIndex + i;
            const interalProps = onItemPress ? { onPress: () => onItemPress({ item, index }) } : undefined;
            const layoutProps = isView && onItemLayout ? { onLayout: ((event: LayoutChangeEvent) => onItemLayout(event, item)) } : undefined
            return <Container {...containerProps} {...interalProps} {...layoutProps} key={context.props.keyExtractor?.(item, index) ?? index}>{context.props.renderItem({ item, index })}</Container>;
        });
    }, [context.itemRows, ...(context.props.updateOn ?? [])])

    // If item is not visible and we're not waiting to scroll to it, skip render
    if (!visible.render) return null;

    return (
        <View
            onLayout={onLayout}
            css={context.props.itemCss}
            style={style}>
            {visible.visible || rowIndex == scrollToIndex || itemSize == undefined ? renderedItems : null}
        </View>
    );
});

export const VirtualScroller = React.forwardRef<VirtualScrollerViewRefProps, VirtualScrollerViewProps>((props, ref) => {
    const timer = useTimer(props.contentSizeTimer ?? 0);
    const endReachedTimer = useTimer(200);
    const scrollToIndexTimer = useTimer(10);
    const numColumns = props.numColumns ?? 1;
    const scrollOffset = useSubscriber(0);
    const state = StateBuilder({
        containerSize: undefined as Size | undefined,
        estimatedItemSize: props.itemSize?.size ?? 0,
        itemSizes: {} as Record<number, Size>,
        scrollToIndex: undefined as number | undefined,
        scrollCallBack: undefined as ((index: number) => void) | undefined,
        id: newId(),
        refItems: {
            scrollView: undefined as typeof ScrollView | undefined
        }
    }).ignore("refItems", "containerSize", "itemSizes")
        //.bind("refItems.scrollOffset")
        .timeout(2)
        .build();


    globalData.useEffect(() => {
        state.containerSize = undefined;
        state.estimatedItemSize = 0;
        state.itemSizes = {}
        state.id = newId();
    }, "screen")


    React.useEffect(() => {
        if (state.estimatedItemSize > 0) {
            setRef(ref, {
                scrollToIndex: (index: number, animated?: boolean) => {
                    if (!state.refItems.scrollView || !state.containerSize || props.items.length <= index) return;

                    const rowIndex = Math.floor(index / numColumns)
                    state.scrollToIndex = rowIndex;

                    state.scrollCallBack = () => {
                        state.scrollToIndex = undefined;
                        state.scrollCallBack = undefined;
                        scrollToIndexTimer(() => {
                            const offset = Object.keys(state.itemSizes)
                                .map(Number)
                                .filter(i => Math.floor(i / numColumns) < rowIndex)
                                .reduce((acc, i) => {
                                    const size = state.itemSizes[i];
                                    return acc + (props.horizontal ? size.width : size.height);
                                }, 0);

                            const scrollParams = props.horizontal ? { x: offset, animated } : { y: offset, animated };
                            state.refItems.scrollView?.scrollTo?.(scrollParams);
                        });
                    };
                }
            });
        }
    }, [state.estimatedItemSize, state.containerSize]);

    // Slice items for measurement when we don't have an estimate yet
    const effectiveItems = state.estimatedItemSize === 0 ? props.items.slice(0, numColumns) : props.items;

    const itemRows = useAsyncMemo(() => {
        const rows = { children: [], rows: [] as { startIndex: number, items: any[] }[] }
        for (let i = 0; i < effectiveItems.length; i += numColumns) {
            rows.rows.push({
                startIndex: i,
                items: effectiveItems.slice(i, i + numColumns)
            });
        }

        rows.children = rows.rows.map((row) => (
            <VirtualScrollerView key={row.startIndex} startIndex={row.startIndex} />
        ))
        return rows;
    }, [state.estimatedItemSize, state.containerSize, numColumns, effectiveItems]);

    const rowCount = Math.ceil(props.items.length / numColumns);
    return (
        <ScrollContext.Provider value={{
            parentState: state,
            itemRows: itemRows?.rows ?? [],
            props,
            scrollOffset: scrollOffset as any
        }}>
            <ScrollView
                key={state.id}
                showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
                showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
                horizontal={props.horizontal}
                ref={c => state.refItems.scrollView = c as any}
                scrollEventThrottle={props.scrollEventThrottle ?? 16}
                contentContainerStyle={React.useMemo(() => ({
                    minHeight: !props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
                    minWidth: props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
                    flexDirection: props.horizontal ? "row" : "column",
                }), [state.estimatedItemSize, rowCount, props.horizontal])}
                pagingEnabled={props.pagingEnabled}
                onScroll={event => {

                    const { nativeEvent } = event;
                    if (state.containerSize) {
                        const scrollValue = props.horizontal ? nativeEvent.contentOffset.x : nativeEvent.contentOffset.y;
                        scrollOffset.setValue(scrollValue)
                        props.onScroll?.(event);

                        endReachedTimer(() => {
                            const contentLength = props.horizontal
                                ? nativeEvent.contentSize.width
                                : nativeEvent.contentSize.height;
                            const containerLength = props.horizontal
                                ? nativeEvent.layoutMeasurement.width
                                : nativeEvent.layoutMeasurement.height;

                            if (contentLength <= containerLength) return;

                            const distanceFromEnd = contentLength - scrollValue - containerLength;
                            if (distanceFromEnd <= (props.onEndReachedThreshold ?? 100)) {
                                props.onEndReached?.();
                            }
                        });

                    }
                }}
                style={props.style}
                css={props.css}
                ifTrue={props.ifTrue}
                id={props.id}
                onLayout={({ nativeEvent }) => {
                    timer(() => {
                        state.containerSize = nativeEvent.layout;
                    });
                }}
            >
                {state.containerSize && itemRows?.children}
            </ScrollView>
        </ScrollContext.Provider>
    );
});
