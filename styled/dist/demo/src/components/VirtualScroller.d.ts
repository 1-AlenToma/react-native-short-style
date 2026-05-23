import * as React from "react";
import { VirtualScrollerViewRefProps, ViewStyle } from "../Typse";
import { LayoutChangeEvent } from "react-native";
export declare const VirtualScroller: React.ForwardRefExoticComponent<{
    items: any[];
    renderItem?: (item: {
        item: any;
        index: number;
    }) => React.ReactNode;
    onItemPress?: (item: {
        item: any;
        index: number;
    }) => void | Promise<void>;
    onItemLayout?: (nativeEvent: LayoutChangeEvent, item: any) => void;
    initializeIndex?: number;
    itemStyle?: import("..").CSS_String | ViewStyle;
    horizontal?: boolean;
    numColumns?: number;
    itemSize?: import("..").VirtualItemSize;
    showsVerticalScrollIndicator?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    onEndReached?: () => void;
    onScroll?: (event: import("react-native").NativeSyntheticEvent<import("react-native").NativeScrollEvent>) => void;
    onEndReachedThreshold?: number;
    keyExtractor?: (item: any, index: number) => string;
    pagingEnabled?: boolean;
    scrollEventThrottle?: number;
    contentSizeTimer?: number;
    updateOn?: any[];
} & import("..").StyledProps & React.RefAttributes<VirtualScrollerViewRefProps>>;
