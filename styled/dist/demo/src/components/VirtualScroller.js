var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import StateBuilder from "../States";
import { newId, setRef } from "../config";
import { useTimer, useDeferredMemo } from "../hooks";
import { View, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import { SmartScheduler } from "../constant";
const ScrollContext = React.createContext(null);
const ScrollIsVisibleView = ({ startIndex, children }) => {
    var _a;
    const context = React.useContext(ScrollContext);
    context.parentState.localBind("refItems.scrollOffset");
    const scrollOffset = context.parentState.refItems.scrollOffset;
    const numColumns = (_a = context.props.numColumns) !== null && _a !== void 0 ? _a : 1;
    const rowIndex = Math.floor(startIndex / numColumns);
    const isHorizontal = context.props.horizontal;
    const itemSize = context.itemSize;
    const itemSizes = context.parentState.itemSizes;
    const scrollSettings = context.parentState.scrollSettings;
    const isVisible = () => {
        var _a, _b, _c, _d, _e, _f;
        const { estimatedItemSize, itemSizes, containerSize, } = context.parentState;
        const overscanCount = (_b = (_a = context.props.itemSize) === null || _a === void 0 ? void 0 : _a.overscanCount) !== null && _b !== void 0 ? _b : 30;
        const isHorizontal = context.props.horizontal;
        const itemSize = context.itemSize;
        const numColumns = (_c = context.props.numColumns) !== null && _c !== void 0 ? _c : 1;
        const rowIndex = Math.floor(startIndex / numColumns);
        if (!containerSize || estimatedItemSize === 0) {
            return { visible: startIndex === 0, render: !(containerSize == undefined || (!(startIndex === 0) && (scrollSettings.scrollToIndex === undefined || rowIndex > scrollSettings.scrollToIndex))) };
        }
        // Calculate row start offset
        let rowStart = 0;
        if (itemSize == undefined) {
            for (let i = 0; i < rowIndex; i++) {
                const itemIndex = i * numColumns;
                const size = (_d = itemSizes[itemIndex]) !== null && _d !== void 0 ? _d : {
                    width: estimatedItemSize,
                    height: estimatedItemSize
                };
                rowStart += isHorizontal ? size.width : size.height;
            }
        }
        else
            rowStart = itemSize * rowIndex;
        const rowSize = (_e = itemSizes[startIndex]) !== null && _e !== void 0 ? _e : {
            width: estimatedItemSize,
            height: estimatedItemSize
        };
        const rowLength = isHorizontal ? rowSize.width : rowSize.height;
        const rowEnd = rowStart + rowLength;
        const viewportStart = scrollOffset;
        const viewportEnd = scrollOffset + ((isHorizontal ? containerSize.width : containerSize.height));
        const overscanPixels = (itemSize !== null && itemSize !== void 0 ? itemSize : estimatedItemSize) * overscanCount;
        const overscannedStartRow = Math.max(0, rowStart - overscanPixels);
        const overscannedEndRow = rowEnd + overscanPixels;
        let visible = false;
        if (itemSize == undefined)
            visible = (overscannedEndRow > viewportStart && overscannedStartRow < viewportEnd) || (rowStart - ((_f = context.props.scrollEventThrottle) !== null && _f !== void 0 ? _f : 16) < viewportEnd);
        else
            visible = (overscannedEndRow > viewportStart && overscannedStartRow < viewportEnd);
        let render = !(containerSize == undefined || (!visible && (scrollSettings.scrollToIndex === undefined || rowIndex > scrollSettings.scrollToIndex)));
        return { visible, render };
    };
    const style = useDeferredMemo(() => [{
            flexDirection: isHorizontal ? "column" : "row",
            width: isHorizontal ? itemSize : context.parentState.containerSize.width,
            height: isHorizontal ? undefined : itemSize,
            position: itemSize != undefined ? "absolute" : undefined,
            left: isHorizontal && itemSize != undefined ? itemSize * rowIndex : undefined,
            top: !isHorizontal && itemSize != undefined ? itemSize * rowIndex : undefined
        }], [itemSize, context.parentState.containerSize.width]);
    const validateTrigger = () => {
        var _a;
        if (!itemSizes[startIndex] && itemSize != undefined)
            itemSizes[startIndex] = { width: itemSize, height: itemSize };
        if (itemSizes[startIndex] && rowIndex === scrollSettings.scrollToIndex) {
            (_a = scrollSettings.scrollCallBack) === null || _a === void 0 ? void 0 : _a.call(scrollSettings, startIndex);
        }
    };
    let state = isVisible();
    React.useEffect(() => {
        if (state.render)
            validateTrigger();
    });
    const visibility = () => {
        return (state.render && (state.visible || rowIndex == context.parentState.scrollToIndex || context.itemSize == undefined));
    };
    return (_jsx(View, { ifTrue: visibility, onLayout: React.useCallback(({ nativeEvent }) => {
            const size = nativeEvent.layout;
            if (context.parentState.estimatedItemSize <= 2) {
                context.parentState.estimatedItemSize = isHorizontal ? size.width : size.height;
            }
            itemSizes[startIndex] = size;
            //  validateTrigger();
        }, []), css: React.useMemo(() => x => x.joinLeft(context.props.itemStyle).cls("virtualItemSelector"), [context.props.itemStyle]), style: style, children: children }));
};
// Each row view component that conditionally renders visible rows
const VirtualScrollerView = React.memo(({ startIndex }) => {
    var _a;
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
            var _a, _b, _c;
            const index = startIndex + i;
            const interalProps = onItemPress ? { onPress: () => onItemPress({ item, index }) } : undefined;
            const layoutProps = isView && onItemLayout ? { onLayout: ((event) => onItemLayout(event, item)) } : undefined;
            return _createElement(Container, Object.assign({}, containerProps, interalProps, layoutProps, { key: (_c = (_b = (_a = context.props).keyExtractor) === null || _b === void 0 ? void 0 : _b.call(_a, item, index)) !== null && _c !== void 0 ? _c : index }), context.props.renderItem({ item, index }));
        });
    }, [context.itemRows, ...((_a = context.props.updateOn) !== null && _a !== void 0 ? _a : [])]);
    return (_jsx(ScrollIsVisibleView, { startIndex: startIndex, children: renderedItems }, "starter" + startIndex));
});
export const VirtualScroller = React.forwardRef((props, ref) => {
    var _a, _b, _c, _d, _e, _f;
    const timer = useTimer((_a = props.contentSizeTimer) !== null && _a !== void 0 ? _a : 0);
    const endReachedTimer = useTimer(200);
    const scrollToIndexTimer = useTimer(10);
    const numColumns = (_b = props.numColumns) !== null && _b !== void 0 ? _b : 1;
    const state = StateBuilder(() => {
        var _a, _b;
        return ({
            containerSize: undefined,
            estimatedItemSize: ((_a = props.itemSize) === null || _a === void 0 ? void 0 : _a.size) != undefined && typeof ((_b = props.itemSize) === null || _b === void 0 ? void 0 : _b.size) == "number" ? props.itemSize.size : 0,
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
                                    var _a, _b;
                                    const offset = Object.keys(state.itemSizes)
                                        .map(Number)
                                        .filter(i => Math.floor(i / numColumns) < rowIndex)
                                        .reduce((acc, i) => {
                                        const size = state.itemSizes[i];
                                        return acc + (props.horizontal ? size.width : size.height);
                                    }, 0);
                                    const scrollParams = props.horizontal ? { x: offset, animated: animated !== null && animated !== void 0 ? animated : false } : { y: offset, animated: animated !== null && animated !== void 0 ? animated : false };
                                    (_b = (_a = state.refItems.scrollView) === null || _a === void 0 ? void 0 : _a.scrollTo) === null || _b === void 0 ? void 0 : _b.call(_a, scrollParams);
                                });
                            }
                        });
                    }
                }
            }
        });
    }).ignore("refItems", "containerSize", "scrollSettings", "itemSizes").build();
    const renderTimer = useTimer(100);
    const effectiveItems = state.estimatedItemSize === 0 ? props.items.slice(0, numColumns) : props.items;
    const prepaireItems = () => __awaiter(void 0, void 0, void 0, function* () {
        renderTimer(() => __awaiter(void 0, void 0, void 0, function* () {
            SmartScheduler.run(() => {
                const rows = { children: [], rows: new Map() };
                for (let i = 0; i < effectiveItems.length; i += numColumns) {
                    rows.rows.set(i, effectiveItems.slice(i, i + numColumns));
                    rows.children.push(_jsx(VirtualScrollerView, { startIndex: i }, i));
                }
                state.items = rows;
            });
        }), effectiveItems.length <= 5 ? 0 : undefined);
    });
    React.useEffect(() => {
        prepaireItems();
    }, [effectiveItems]);
    /*globalData.useEffect(() => {
        state.containerSize = undefined;
        state.estimatedItemSize = 0;
        state.itemSizes = {}
        state.id = newId();
    }, "screen")*/
    const itemSize = React.useMemo(() => {
        var _a, _b;
        if (((_a = props.itemSize) === null || _a === void 0 ? void 0 : _a.size) == "EstimatedItemSize") {
            if (state.estimatedItemSize > 0)
                return state.estimatedItemSize;
        }
        return (_b = props.itemSize) === null || _b === void 0 ? void 0 : _b.size;
    }, [props.itemSize, state.estimatedItemSize]);
    React.useEffect(() => {
        if (state.estimatedItemSize > 0 && state.containerSize) {
            setRef(ref, (state.refItems.ref = Object.assign({}, state.refItems.ref)));
            if (!state.refItems.init && props.initializeIndex != undefined)
                state.refItems.ref.scrollToIndex(props.initializeIndex);
            state.refItems.init = true;
        }
    }, [state.estimatedItemSize, state.containerSize, props.initializeIndex]);
    React.useEffect(() => {
        if (props.initializeIndex != undefined) {
            state.refItems.ref.scrollToIndex(props.initializeIndex);
        }
    }, [props.initializeIndex]);
    const rowCount = Math.ceil(props.items.length / numColumns);
    return (_jsx(ScrollContext.Provider, { value: {
            parentState: state,
            itemRows: (_d = (_c = state.items) === null || _c === void 0 ? void 0 : _c.rows) !== null && _d !== void 0 ? _d : new Map(),
            props,
            itemSize
        }, children: _jsx(ScrollView, { ifTrue: props.ifTrue, css: props.css, showsVerticalScrollIndicator: props.showsVerticalScrollIndicator, showsHorizontalScrollIndicator: props.showsHorizontalScrollIndicator, horizontal: props.horizontal, ref: c => state.refItems.scrollView = c, scrollEventThrottle: (_e = props.scrollEventThrottle) !== null && _e !== void 0 ? _e : 16, contentContainerStyle: {
                minHeight: !props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
                minWidth: props.horizontal && state.estimatedItemSize > 0 ? state.estimatedItemSize * rowCount : undefined,
                flexDirection: props.horizontal ? "row" : "column",
            }, pagingEnabled: props.pagingEnabled, onScroll: event => {
                var _a;
                const { nativeEvent } = event;
                if (state.containerSize) {
                    const scrollValue = props.horizontal ? nativeEvent.contentOffset.x : nativeEvent.contentOffset.y;
                    state.refItems.scrollOffset = scrollValue;
                    (_a = props.onScroll) === null || _a === void 0 ? void 0 : _a.call(props, event);
                    const { contentSize, layoutMeasurement, } = nativeEvent;
                    endReachedTimer(() => {
                        var _a, _b;
                        const contentLength = props.horizontal
                            ? contentSize.width
                            : contentSize.height;
                        const containerLength = props.horizontal
                            ? layoutMeasurement.width
                            : layoutMeasurement.height;
                        if (contentLength <= containerLength)
                            return;
                        const distanceFromEnd = contentLength - scrollValue - containerLength;
                        if (distanceFromEnd <= ((_a = props.onEndReachedThreshold) !== null && _a !== void 0 ? _a : 100)) {
                            (_b = props.onEndReached) === null || _b === void 0 ? void 0 : _b.call(props);
                        }
                    });
                }
            }, style: props.style, id: props.id, onLayout: ({ nativeEvent }) => {
                timer(() => {
                    state.batch(() => {
                        const { layout } = nativeEvent;
                        if (!state.containerSize ||
                            layout.width !== state.containerSize.width ||
                            layout.height !== state.containerSize.height) {
                            state.containerSize = layout;
                        }
                    });
                });
            }, children: state.containerSize && ((_f = state.items) === null || _f === void 0 ? void 0 : _f.children) }, state.id) }));
});
//# sourceMappingURL=VirtualScroller.js.map