import { Icon } from "./Icon";
import { View, AnimatedView, Text, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from "./ReactNativeComponents";
import { InternalThemeContext, globalData } from "../theme/ThemeContext";
import { useAnimate, useTimer } from "../hooks";
import StateBuilder from "react-smart-state";
import * as Native from "react-native";
import { ifSelector, newId, optionalStyle, proc, setRef } from "../config/Methods";
import * as React from "react";
import { PagerProps, PageRef, Size } from "../Typse";
import { ButtonGroup } from "./ButtonGroup";

const RenderItem = ({ item, index, props, state, onload }: { onload: (size: Size) => void, item: any, index: number, props: PagerProps, state: any }) => {
    const itemState = StateBuilder({
        selected: false
    }).build()
    const Component = props.onSelect ? TouchableOpacity : View;

    const css = itemState.selected || state.selectedIndex == index ? "_selectedValue " + (props.selectedStyle ?? "") : ""
    return (
        <Component onLayout={({ nativeEvent }) => {
            onload(nativeEvent.layout)
        }} style={{
            width: state.itemSize?.width,
            height: state.itemSize?.height,
            maxHeight: "100%",
            maxWidth: "100%"
        }} css={`fld:row ali:center juc:space-between`} onMouseEnter={() => itemState.selected = true}
            onMouseLeave={() => itemState.selected = false}
            onPress={() => {
                state.selectedIndex = index;
                props.onSelect?.(item, index);
            }}>
            {
                props.render(item, index, css)
            }
        </Component>
    )
}


export const Pager = React.forwardRef<PageRef, PagerProps>((props, ref) => {

    const state = StateBuilder({
        buttons: [],
        size: undefined as Size | undefined,
        page: -1,
        itemPerPage: 0,
        itemSize: undefined as Size | undefined,
        items: [],
        flatList: undefined as Native.FlatList | undefined,
        selectedIndex: props.selectedIndex != undefined ? Math.max(props.selectedIndex, 0) : undefined,
    }).ignore("size", "items", "itemSize", "flatList").build();
    const timer = useTimer(500);
    const endReachedTimer = useTimer(100)

    const setSelectedItem = () => {
        if (props.selectedIndex != undefined && state.itemPerPage > 0) {
            if (props.items.length > props.selectedIndex)
                return Math.max(parseInt((props.selectedIndex / state.itemPerPage).toString()), 0)
        }
        return undefined;
    }

    const totalPages = () => {
        return Math.ceil(props.items.length / state.itemPerPage);
    }

    const refItem = {
        selectItem(itemIndex) {
            state.selectedIndex = Math.max(itemIndex, 0);
            state.page = setSelectedItem() ?? 0;
            state.flatList = undefined;
        },
        totalPages: totalPages(),
        refresh: () => state.page = 0
    } as PageRef

    setRef(ref, refItem);

    const loadButtons = () => {
        state.buttons = props.renderHeader && state.itemPerPage > 0 && state.page >= 0 ? [...Array(totalPages())].reduce((c, v, index) => {
            let end = (index + 1) * state.itemPerPage;
            end = end > props.items.length - 1 ? props.items.length - 1 : end;
            let start = (index * state.itemPerPage) + 1;
            c.push(`${start}-${end}`)
            return c;
        }, []) : []
    }

    const load = () => {
        let total = Math.ceil((state.page + 1) * state.itemPerPage);
        if (state.itemPerPage > 0 && state.page >= 0) {
            if (state.items.length < total) {
                const items = props.items.slice(0, total)
                state.items = items;
            }
        } else if (props.items.length > 0)
            state.items = [props.items[0]]
        loadButtons();
    }

    const scroll = (offset: number) => {
        timer(() => {
            state.flatList?.scrollToOffset({ offset: offset, animated: false });
        })
    }

    state.useEffect(() => {
        try {
            if (state.flatList && state.items.length > state.selectedIndex && state.itemSize) {
                const pageIndex = Math.ceil((state.page) * state.itemPerPage);
                if (Math.ceil(state.selectedIndex / state.itemPerPage) == state.page + 1) {
                    scroll(state.selectedIndex * state.itemSize.height);
                } else if (state.items.length > pageIndex && props.renderHeader) {
                    scroll(pageIndex * state.itemSize.height);
                }
            }
        } catch (e) {
            console.error(e);
        }

    }, "flatList")


    React.useEffect(() => {
        if (state.page >= 0) {
            if (state.items.length < props.items.length)
                state.page++;
            else if (state.items.length > props.items.length)
                state.page = 0; // reset
            else load();
        } else load();

    }, [props.items])

    state.useEffect(() => {
        if (state.items.length <= 0)
            load();
    }, "size")

    state.useEffect(() => {
        load();
        if (state.page >= 0)
            props.onChange?.(state.page, totalPages());
    }, "page")

    state.useEffect(() => {
        if (state.itemPerPage > 0) {
            state.page = state.page == -1 ? setSelectedItem() ?? 0 : 0;

        }
    }, "itemSize")

    React.useEffect(() => {
        if ((props.selectedIndex != state.selectedIndex || props.renderHeader) && state.page >= 0) {
            refItem.selectItem(props.selectedIndex)
        }
    }, [props.selectedIndex])



    return (
        <View style={props.style} ifTrue={props.ifTrue} css={`wi:100% fl:1 ${optionalStyle(props.css).c}`} onLayout={({ nativeEvent }) => {
            if (!state.size)
                state.size = nativeEvent.layout;
        }}>
        
                
            <ButtonGroup
                scrollable={true}
                ifTrue={props.renderHeader}
                buttons={state.buttons}
                selectedIndex={[state.page]}
                isVertical={false}
                onPress={page => {
                    state.flatList = undefined;
                    state.page = page[0]
                }} />
            
            <FlatList
                scrollEnabled={props.scrollEnabled}
                ref={f => {
                    state.flatList = f
                }}
                horizontal={props.horizontal}
                style={{
                    flex:1,
                    maxHeight: state.size?.height,
                    maxWidth: "100%",
                }}
                ifTrue={state.size != undefined == true}
                data={state.items}
                showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator}
                showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <RenderItem state={state} index={index} item={item} props={props} onload={(size) => {
                        if (state.itemPerPage == 0) {
                            state.itemPerPage = Math.ceil(!props.horizontal ? state.size.height / size.height : state.size.width / size.width) + 1
                            state.itemSize = size;
                        }
                    }} />)}
                onEndReachedThreshold={props.onEndReachedThreshold ?? .5}
                onEndReached={({ distanceFromEnd }) => {

                    endReachedTimer(() => {
                        if (state.itemPerPage > 0) {
                            if (!props.renderHeader && state.page < totalPages()) {
                                state.page++;
                            }
                            if (!props.renderHeader && state.page == totalPages()) {
                                props.onEndReached?.();
                            }
                        }
                    });
                }}
            />

        </View>
    )
})