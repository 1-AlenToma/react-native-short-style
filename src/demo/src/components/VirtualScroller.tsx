import * as React from "react";
import { View, ScrollView } from "./ReactNativeComponents";
import StateBuilder from "react-smart-state";
import { newId, setRef } from "../config";
import { Size, VirtualScrollerViewRefProps, VirtualScrollerViewProps } from "../Typse";
import { useTimer } from "../hooks";
import { globalData } from "../theme/ThemeContext";


// Context used to share scroll state and layout handling
const ScrollContext = React.createContext<{
    onLayout: (size: Size, index: number) => void;
    parentState: any;
    props: VirtualScrollerViewProps;
    itemRows: { startIndex: number, items: any[] }[];
}>(null!);

// Each row view component that conditionally renders visible rows
const VirtualScrollerView = React.memo(({ startIndex }: { startIndex: number }) => {
    const context = React.useContext(ScrollContext);
    const renderedItem = React.useRef(undefined);
    const [update, setUpdate] = React.useState("");
    const {
        estimatedItemSize,
        itemSizes,
        containerSize,
        refItems: { scrollOffset },
        scrollToIndex,
        scrollCallBack,
    } = context.parentState;


    React.useEffect(() => {
        renderedItem.current = undefined;
        setUpdate(newId());
    }, [context.props.items, ...(context.props.updateOn ?? [])])



    const isHorizontal = context.props.horizontal;
    const numColumns = context.props.numColumns ?? 1;
    const rowIndex = Math.floor(startIndex / numColumns);
    const isVisible = () => {
        if (!containerSize || estimatedItemSize === 0) return startIndex === 0;
        // Calculate row start offset
        let rowStart = 0;
        for (let i = 0; i < rowIndex; i++) {
            const itemIndex = i * numColumns;
            const size = itemSizes[itemIndex] ?? {
                width: estimatedItemSize,
                height: estimatedItemSize
            };
            rowStart += isHorizontal ? size.width : size.height;
        }

        const rowSize = itemSizes[startIndex] ?? {
            width: estimatedItemSize,
            height: estimatedItemSize
        };
        const rowLength = isHorizontal ? rowSize.width : rowSize.height;
        const rowEnd = rowStart + rowLength;

        const viewportStart = scrollOffset;
        const viewportEnd = scrollOffset + (isHorizontal ? containerSize.width : containerSize.height);

        return (rowEnd > viewportStart && rowStart < viewportEnd) || (rowStart - (context.props.scrollEventThrottle ?? 16) < viewportEnd);

        //  return (itemEnd > viewportStart && itemStart < viewportEnd) || (itemStart < viewportEnd);
    };

    let isVisibleFlag = isVisible();

    // If item is not visible and we're not waiting to scroll to it, skip render
    if (containerSize == undefined || (!isVisibleFlag && (scrollToIndex === undefined || rowIndex > scrollToIndex))) return null;

    const row = context.itemRows.find(r => r.startIndex === startIndex);

    if (!row) return null;

    const validateTrigger = () => {
        if (itemSizes[startIndex] && rowIndex === scrollToIndex) {
            scrollCallBack?.(startIndex);
        }
    }
    validateTrigger();

    const isView = context.props.numColumns && context.props.numColumns > 1 && !isHorizontal;
    const Container = isView ? View : React.Fragment;
    const containerProps = isView ? { style: { flex: 1 } } : undefined;

    if (!renderedItem.current)
        renderedItem.current = row.items.map((item, i) => {
            const index = startIndex + i;
            return <Container {...containerProps} key={index}>{context.props.renderItem({ item, index })}</Container>;
        })

    return (
        <View
            onLayout={({ nativeEvent }) => {
                context.onLayout(nativeEvent.layout, startIndex);
            }}
            css={context.props.itemCss}
            style={{ flexDirection: isHorizontal ? "column" : "row", width: isHorizontal ? undefined : containerSize.width }}
        >
            {renderedItem.current}
        </View>
    );
});

export const VirtualScroller = React.forwardRef<VirtualScrollerViewRefProps, VirtualScrollerViewProps>((props, ref) => {
    const timer = useTimer(props.contentSizeTimer ?? 0);
    const endReachedTimer = useTimer(200);
    const numColumns = props.numColumns ?? 1;

    const state = StateBuilder({
        containerSize: undefined as Size | undefined,
        estimatedItemSize: 0,
        itemSizes: {} as Record<number, Size>,
        scrollToIndex: undefined as number | undefined,
        scrollCallBack: undefined as ((index: number) => void) | undefined,
        id: newId(),
        refItems: {
            scrollView: undefined as typeof ScrollView | undefined,
            scrollOffset: 0,
        }
    }).ignore("refItems", "containerSize", "itemSizes")
        .bind("refItems.scrollOffset")
        .timeout(1)
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

                        const offset = Object.keys(state.itemSizes)
                            .map(Number)
                            .filter(i => Math.floor(i / numColumns) < rowIndex)
                            .reduce((acc, i) => {
                                const size = state.itemSizes[i];
                                return acc + (props.horizontal ? size.width : size.height);
                            }, 0);

                        const scrollParams = props.horizontal ? { x: offset, animated } : { y: offset, animated };
                        state.refItems.scrollView?.scrollTo?.(scrollParams);
                    };
                }
            });
        }
    }, [state.estimatedItemSize]);

    // Slice items for measurement when we don't have an estimate yet
    const effectiveItems = state.estimatedItemSize === 0 ? props.items.slice(0, numColumns) : props.items;

    const itemRows = React.useMemo(() => {
        const rows = [];
        for (let i = 0; i < effectiveItems.length; i += numColumns) {
            rows.push({
                startIndex: i,
                items: effectiveItems.slice(i, i + numColumns)
            });
        }
        return rows;
    }, [state.estimatedItemSize, state.containerSize, numColumns, effectiveItems]);

    const rowCount = Math.ceil(props.items.length / numColumns);

    return (
        <ScrollContext.Provider value={{
            parentState: state,
            itemRows,
            props,
            onLayout: (size, startIndex) => {
                if (state.estimatedItemSize <= 2) {
                    state.estimatedItemSize = props.horizontal ? size.width : size.height;

                }
                state.itemSizes[startIndex] = size;
            }
        }}>
            <ScrollView
                key={state.id}
                showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
                showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
                horizontal={props.horizontal}
                ref={c => state.refItems.scrollView = c as any}
                scrollEventThrottle={props.scrollEventThrottle ?? 16}
                contentContainerStyle={{
                    minHeight: !props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
                    minWidth: props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
                    flexDirection: props.horizontal ? "row" : "column",
                }}
                pagingEnabled={props.pagingEnabled}
                onScroll={event => {
                    const { nativeEvent } = event;
                    if (state.containerSize) {
                        state.refItems.scrollOffset = props.horizontal ? nativeEvent.contentOffset.x : nativeEvent.contentOffset.y;
                        props.onScroll?.(event);

                        endReachedTimer(() => {
                            const contentLength = props.horizontal
                                ? nativeEvent.contentSize.width
                                : nativeEvent.contentSize.height;
                            const containerLength = props.horizontal
                                ? nativeEvent.layoutMeasurement.width
                                : nativeEvent.layoutMeasurement.height;

                            if (contentLength <= containerLength) return;

                            const distanceFromEnd = contentLength - state.refItems.scrollOffset - containerLength;
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
                {state.containerSize &&
                    itemRows.map(row => (
                        <VirtualScrollerView key={row.startIndex} startIndex={row.startIndex} />
                    ))}
            </ScrollView>
        </ScrollContext.Provider>
    );
});
