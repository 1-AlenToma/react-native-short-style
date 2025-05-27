import * as React from "react";
import { View, ScrollView } from "./ReactNativeComponents";
import StateBuilder from "react-smart-state";
import { newId, setRef } from "../config";
import { Size, VirtualScrollerViewRefProps, VirtualScrollerViewProps } from "../Typse";
import { useTimer } from "../hooks";

const ScrollContext = React.createContext({} as {
    onLayout: (size: Size, index: number) => void;
    parentState: any;
    props: VirtualScrollerViewProps;
});



const VirtualScrollerView = React.memo((props: { index: number }) => {
    const renderdItem = React.useRef<React.ReactNode>(undefined);
    const [update, setUpdate] = React.useState("");
    const context = React.useContext(ScrollContext);

    // context.parentState.bind("refItems.scrollOffset");

    React.useEffect(() => {
        if (renderdItem.current)
            renderdItem.current = undefined; // Reset the rendered item when items change
        setUpdate(newId()); // Trigger a re-render when items change
    }, [context.props.items])



    const isVisible = () => {
        const {
            estimatedItemSize,
            itemSizes,
            containerSize,
            refItems: { scrollOffset },
        } = context.parentState;

        const itemIndex = props.index;

        if (estimatedItemSize === 0) {
            return itemIndex === 0;
        }

        const isHorizontal = context.props.horizontal;

        // Calculate item start position by summing all previous items' sizes
        let itemStart = 0;
        for (let i = 0; i < itemIndex - 2; i++) {
            const prevSize = itemSizes[i] || {
                width: estimatedItemSize,
                height: estimatedItemSize,
            };
            itemStart += isHorizontal ? prevSize.width : prevSize.height;
        }

        const itemSize = itemSizes[itemIndex] || {
            width: estimatedItemSize,
            height: estimatedItemSize,
        };

        const itemLength = isHorizontal ? itemSize.width : itemSize.height;
        const itemEnd = itemStart + itemLength;

        const viewportStart = scrollOffset;
        const viewportEnd = scrollOffset + (isHorizontal ? containerSize.width : containerSize.height);

        return (itemEnd > viewportStart && itemStart < viewportEnd) || (itemStart < viewportEnd);
    };

    let isVisibleFlag = isVisible();

    if (!isVisibleFlag && renderdItem.current == undefined && (context.parentState.scrollToIndex == undefined || props.index > context.parentState.scrollToIndex))
        return null; // If the item is not visible, do not render it
    if (!renderdItem.current)
        renderdItem.current = (context.props.renderItem({ item: context.props.items[props.index], index: props.index }))

    if (context.parentState.itemSizes[props.index] && props.index === context.parentState.scrollToIndex)
        context.parentState.scrollCallBack?.(props.index);
    return (
        <View onLayout={({ nativeEvent }) => {
            context.onLayout(nativeEvent.layout, props.index);
        }} css={c => c.joinRight(context.props.itemCss)}>
            {renderdItem.current}
        </View>
    );

});

export const VirtualScroller = React.forwardRef<VirtualScrollerViewRefProps, VirtualScrollerViewProps>((props, ref) => {
    const timer = useTimer(props.contentSizeTimer ?? 0);
    const endReachedTimer = useTimer(200);
    const state = StateBuilder({
        containerSize: undefined as Size | undefined,
        estimatedItemSize: 0, // Default estimated item size
        itemSizes: {} as Record<number, Size>,
        scrollToIndex: undefined as number | undefined,
        scrollCallBack: undefined as ((index: number) => void) | undefined,
        refItems: {
            scrollView: undefined as typeof ScrollView | undefined,
            scrollOffset: 0
        }
    }).ignore("refItems", "containerSize", "itemSizes").bind("refItems.scrollOffset").timeout(undefined).build();

    React.useEffect(() => {
        if (state.estimatedItemSize > 0)
            setRef(ref, {
                scrollToIndex: (index: number, animated?: boolean) => {
                    if (state.refItems.scrollView && state.containerSize) {
                        if (props.items.length < index)
                            return;
                        state.scrollToIndex = index;
                        state.scrollCallBack = (index) => {
                            state.scrollCallBack = undefined; // Clear the callback after scrolling
                            const offset = Object.keys(state.itemSizes).filter(x => parseInt(x) < index).reduce((a, v) => {
                                let size = state.itemSizes[parseInt(v)];
                                a += props.horizontal ? size.width : size.height;
                                return a;
                            }, 0);

                            if (props.horizontal)
                                state.refItems.scrollView.scrollTo({ x: offset, animated: animated ?? false });
                            else
                                state.refItems.scrollView.scrollTo({ y: offset, animated: animated ?? false });


                            state.scrollToIndex = undefined; // Reset scrollToIndex after scrolling
                            state.scrollCallBack = undefined; // Reset scrollCallBack after scrolling
                        }
                    }
                }
            });
    }, [state.estimatedItemSize, props.items])

    let items = props.items;

    if (state.estimatedItemSize === 0 && items.length > 0) {
        items = items.slice(0, 1); // Limit the number of items to estimate size
    }

    return (
        <ScrollContext.Provider value={{
            parentState: state, props, onLayout: (size, index) => {
                if (state.estimatedItemSize === 0) {
                    state.estimatedItemSize = props.horizontal ? size.width : size.height; // Set the estimated item size on the first item
                }
                state.itemSizes[index] = size; // Store the size of the item
            }
        }}>
            <ScrollView
                showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
                showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
                horizontal={props.horizontal}
                ref={c => state.refItems.scrollView = c as any}
                scrollEventThrottle={props.scrollEventThrottle ?? 16}
                contentContainerStyle={{
                    minHeight: state.estimatedItemSize > 0 && !props.horizontal ? state.estimatedItemSize * items.length : undefined,
                    minWidth: state.estimatedItemSize > 0 && props.horizontal ? state.estimatedItemSize * items.length : undefined,
                    flexDirection: props.horizontal ? "row" : "column",

                }}
                pagingEnabled={props.pagingEnabled}
                onScroll={(event) => {
                    const { nativeEvent } = event;
                    if (state.containerSize) {
                        const scrollOffset = props.horizontal ? nativeEvent.contentOffset.x : nativeEvent.contentOffset.y;
                        state.refItems.scrollOffset = scrollOffset;
                        props.onScroll?.(event);
                        endReachedTimer(() => {
                            // === Check for end reached ===
                            const contentSize = props.horizontal
                                ? nativeEvent.contentSize.width
                                : nativeEvent.contentSize.height;


                            const containerLength = props.horizontal
                                ? nativeEvent.layoutMeasurement.width
                                : nativeEvent.layoutMeasurement.height;
                            const isScrollable = contentSize > containerLength;
                            if (!isScrollable)
                                return;

                            const distanceFromEnd = contentSize - scrollOffset - containerLength;
                            const threshold = props.onEndReachedThreshold ?? 100;

                            if (
                                distanceFromEnd <= threshold &&
                                typeof props.onEndReached === 'function'
                            ) {
                                props.onEndReached();
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
                }}>
                {
                    state.containerSize ? items.map((item, index) => {
                        return (
                            <VirtualScrollerView index={index} key={props.keyExtractor ? props.keyExtractor(item) : index} />
                        );
                    }) : null
                }
            </ScrollView>
        </ScrollContext.Provider>
    )

});