import * as React from "react";
import StateBuilder from "react-smart-state";
import { ifSelector, newId, optionalStyle, setRef } from "../config";
import { Size, VirtualScrollerViewRefProps, VirtualScrollerViewProps, ViewStyle } from "../Typse";
import { useTimer, useDeferredMemo, useSubscriber } from "../hooks";
import { globalData } from "../theme/ThemeContext";
import { LayoutChangeEvent, View, ScrollView, TouchableOpacity } from "react-native";
// Context used to share scroll state and layout handling

type ScrollSettings = {
    scrollToIndex: number | undefined,
    scrollCallBack: ((index: number) => void) | undefined,
}
const ScrollContext = React.createContext<{
    parentState: any;
    itemSize?: number;
    props: VirtualScrollerViewProps;
    itemRows: Map<number, any[]>;

}>(null!);

const ScrollIsVisibleView = ({ startIndex, children }: { startIndex: number, children: any }) => {
    const context = React.useContext(ScrollContext);

    //const scrollOffset = context.subscribers.scrollOffset.listen();

    context.parentState.localBind("refItems.scrollOffset");
    const scrollOffset = context.parentState.refItems.scrollOffset;
    const numColumns = context.props.numColumns ?? 1;
    const rowIndex = Math.floor(startIndex / numColumns);
    const isHorizontal = context.props.horizontal;
    const itemSize = context.itemSize;
    const itemSizes = context.parentState.itemSizes;
    const scrollSettings = context.parentState.scrollSettings;
    const isVisible = () => {
        const {
            estimatedItemSize,
            itemSizes,
            containerSize,
        } = context.parentState;
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


        let render = !(containerSize == undefined || (!visible && (scrollSettings.scrollToIndex === undefined || rowIndex > scrollSettings.scrollToIndex)));

        return { visible, render };
    };

    const style = useDeferredMemo(() => ([optionalStyle(context.props.itemStyle).o, {
        flexDirection: isHorizontal ? "column" : "row",
        width: isHorizontal ? itemSize : context.parentState.containerSize.width,
        height: isHorizontal ? undefined : itemSize,
        position: itemSize != undefined ? "absolute" : undefined,
        left: isHorizontal && itemSize != undefined ? itemSize * rowIndex : undefined,
        top: !isHorizontal && itemSize != undefined ? itemSize * rowIndex : undefined
    }] as ViewStyle), [context.props.itemStyle, itemSize]);

    const validateTrigger = () => {
        if (!itemSizes[startIndex] && itemSize != undefined)
            itemSizes[startIndex] = { width: itemSize, height: itemSize };
        if (itemSizes[startIndex] && rowIndex === scrollSettings.scrollToIndex) {
            scrollSettings.scrollCallBack?.(startIndex);
        }
    }
    validateTrigger();
    const onLayout = React.useCallback(({ nativeEvent }: LayoutChangeEvent) => {
        const size = nativeEvent.layout;
        if (context.parentState.estimatedItemSize <= 2) {
            context.parentState.estimatedItemSize = isHorizontal ? size.width : size.height;

        }
        itemSizes[startIndex] = size;
        validateTrigger();
    }, [context.itemRows, scrollSettings.scrollToIndex, ...(context.props.updateOn ?? [])]);

    const state = isVisible();

    if (!state.render) return null;

    return (state.visible || rowIndex == context.parentState.scrollToIndex || context.itemSize == undefined ? (
        <View
            onLayout={onLayout}
            style={style}>
            {children}
        </View>) : null);
}


// Each row view component that conditionally renders visible rows
const VirtualScrollerView = React.memo(({ startIndex }: { startIndex: number }) => {
    const context = React.useContext(ScrollContext);

    const isHorizontal = context.props.horizontal;
    const onItemPress = context.props.onItemPress;
    const onItemLayout = context.props.onItemLayout;
    const renderedItems = useDeferredMemo(() => {
        const isView = context.props.onItemLayout || (context.props.numColumns && context.props.numColumns > 1 && !isHorizontal);
        const Container: any = onItemPress ? TouchableOpacity : (isView ? View : React.Fragment);
        const containerProps: any = isView || onItemPress ? { style: { flex: 1, backgroundColor: "transparent" } as ViewStyle } : undefined;
        const rows = context.itemRows.get(startIndex)
        return rows.map((item, i) => {
            const index = startIndex + i;
            const interalProps = onItemPress ? { onPress: () => onItemPress({ item, index }) } : undefined;
            const layoutProps = isView && onItemLayout ? { onLayout: ((event: LayoutChangeEvent) => onItemLayout(event, item)) } : undefined
            return <Container {...containerProps} {...interalProps} {...layoutProps} key={context.props.keyExtractor?.(item, index) ?? index}>{context.props.renderItem({ item, index })}</Container>;
        })

    }, [context.itemRows, ...(context.props.updateOn ?? [])])

    return (
        <ScrollIsVisibleView startIndex={startIndex}>
            {renderedItems}
        </ScrollIsVisibleView>
    );
});

export const VirtualScroller = React.forwardRef<VirtualScrollerViewRefProps, VirtualScrollerViewProps>((props, ref) => {
    const timer = useTimer(props.contentSizeTimer ?? 0);
    const endReachedTimer = useTimer(200);
    const scrollToIndexTimer = useTimer(10);
    const numColumns = props.numColumns ?? 1;

    const state = StateBuilder(() => ({
        containerSize: undefined as Size | undefined,
        estimatedItemSize: props.itemSize?.size != undefined && typeof props.itemSize?.size == "number" ? props.itemSize.size : 0,
        itemSizes: {} as Record<number, Size>,
        scrollSettings: {} as ScrollSettings,
        id: newId(),
        refItems: {
            scrollView: undefined as ScrollView | undefined,
            scrollOffset: 0
        }
    })).ignore("refItems", "containerSize", "scrollSettings", "itemSizes").build();


    globalData.useEffect(() => {
        state.containerSize = undefined;
        state.estimatedItemSize = 0;
        state.itemSizes = {}
        state.id = newId();
    }, "screen")

    const itemSize = React.useMemo(() => {
        if (props.itemSize?.size == "EstimatedItemSize") {
            if (state.estimatedItemSize > 0)
                return state.estimatedItemSize;
        }
        return props.itemSize?.size as number | undefined;
    }, [props.itemSize, state.estimatedItemSize])


    React.useEffect(() => {
        if (state.estimatedItemSize > 0) {
            setRef(ref, {
                scrollToIndex: (index: number, animated?: boolean) => {
                    if (!state.refItems.scrollView || !state.containerSize || props.items.length <= index) return;

                    const rowIndex = Math.floor(index / numColumns)
                    state.scrollSettings = ({
                        scrollToIndex: rowIndex,
                        scrollCallBack: () => {
                            state.scrollSettings = {} as any;
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
                        }
                    })
                }
            });
        }
    }, [state.estimatedItemSize, state.containerSize]);

    // Slice items for measurement when we don't have an estimate yet
    const effectiveItems = state.estimatedItemSize === 0 ? props.items.slice(0, numColumns) : props.items;

    const itemRows = useDeferredMemo(() => {
        const rows = { children: [], rows: new Map<number, any[]>() }

        for (let i = 0; i < effectiveItems.length; i += numColumns) {
            rows.rows.set(i, effectiveItems.slice(i, i + numColumns));
            rows.children.push(<VirtualScrollerView key={i} startIndex={i} />);
        }
        return rows;
    }, [effectiveItems]);


    const rowCount = Math.ceil(props.items.length / numColumns);
    const contentContainerStyle = React.useMemo(() => ({
        minHeight: !props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
        minWidth: props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
        flexDirection: props.horizontal ? "row" : "column",
    } as ViewStyle), [state.estimatedItemSize, rowCount, props.horizontal]);
    if (ifSelector(props.ifTrue) == false)
        return null;
    return (
        <ScrollContext.Provider value={{
            parentState: state,
            itemRows: itemRows?.rows ?? new Map(),
            props,
            itemSize
        }}>
            <ScrollView
                key={state.id}
                showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
                showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
                horizontal={props.horizontal}
                ref={c => state.refItems.scrollView = c as any}
                scrollEventThrottle={props.scrollEventThrottle ?? 16}
                contentContainerStyle={contentContainerStyle}
                pagingEnabled={props.pagingEnabled}
                onScroll={event => {
                    const { nativeEvent } = event;
                    if (state.containerSize) {
                        const scrollValue = props.horizontal ? nativeEvent.contentOffset.x : nativeEvent.contentOffset.y;
                        state.refItems.scrollOffset = scrollValue;
                        props.onScroll?.(event);
                        const {
                            contentSize,
                            layoutMeasurement,
                        } = nativeEvent;
                        endReachedTimer(() => {
                            const contentLength = props.horizontal
                                ? contentSize.width
                                : contentSize.height;
                            const containerLength = props.horizontal
                                ? layoutMeasurement.width
                                : layoutMeasurement.height;

                            if (contentLength <= containerLength) return;

                            const distanceFromEnd = contentLength - scrollValue - containerLength;
                            if (distanceFromEnd <= (props.onEndReachedThreshold ?? 100)) {
                                props.onEndReached?.();
                            }
                        });

                    }
                }}
                style={props.style}
                id={props.id}
                onLayout={({ nativeEvent }) => {
                    timer(() => {
                        const { layout } = nativeEvent;
                        if (
                            !state.containerSize ||
                            layout.width !== state.containerSize.width ||
                            layout.height !== state.containerSize.height
                        ) {
                            state.containerSize = layout;
                        }
                    });
                }}
            >
                {state.containerSize && itemRows?.children}
            </ScrollView>
        </ScrollContext.Provider>
    );
});
