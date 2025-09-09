import { View, Text, TouchableOpacity } from "./ReactNativeComponents";
import { useTimer } from "../hooks";
import StateBuilder from "../States";
import * as React from "react";
import { ButtonGroupProps, Size, VirtualScrollerViewRefProps } from "../Typse";
import { VirtualScroller } from "./VirtualScroller";


export const ButtonGroup = (props: ButtonGroupProps) => {
    const state = StateBuilder({
        selectedIndex: props.selectedIndex,
        scrollView: undefined as VirtualScrollerViewRefProps | undefined,
        sizes: new Map<number, Size>()
    }).ignore("scrollView", "selectedIndex", "sizes").build();
    const timer = useTimer(500);


    const select = (index: number) => {
        if (!props.selectMultiple)
            state.selectedIndex = [index];
        else {
            if (state.selectedIndex.includes(index))
                state.selectedIndex = state.selectedIndex.filter(x => x !== index);
            else state.selectedIndex = [...state.selectedIndex, index]
        }

        props.onPress?.(state.selectedIndex, props.buttons.filter((x, i) => state.selectedIndex.includes(i)));
    }

    const scrollToItem = () => {
        timer(() => {
            if (state.scrollView && state.sizes.size > 0 && state.selectedIndex.length == 1) {
                state.scrollView.scrollToIndex(state.selectedIndex[0]);
            }
        });
    }

    React.useEffect(() => {
        state.selectedIndex = props.selectedIndex;
        scrollToItem();
        //state.scrollView = undefined;
    }, [props.selectedIndex])

    state.useEffect(() => {
        scrollToItem();
    }, "scrollView", "selectedIndex")

    const getItem = (item: string, index: number) => {
        const itemStyle = props.itemStyle?.(item, index);

        return (
            <TouchableOpacity
                onLayout={({ nativeEvent }) => state.sizes.set(index, nativeEvent.layout)}
                onPress={() => select(index)}
                style={[props.scrollable ? { height: "auto" } : { flex: 1 }]} key={index}
                css={x => x.cls("_buttonGroupButton", "ButtonGroupButton").if(props.isVertical == true, c => c.wi("100%")).if(state.selectedIndex.includes(index), c => c.cls("selectedValue").joinRight(props.selectedStyle)).joinRight(itemStyle?.container)}>
                {
                    props.render ? props.render(item, index) : <Text css={x => x.joinRight(itemStyle?.text).if(state.selectedIndex.includes(index), c => c.joinRight(props.selectedStyle))}>{item}</Text>
                }
            </TouchableOpacity>
        )
    }


    const cProps = props.scrollable ? { contentContainerStyle: { flex: 0, flexGrow: 1 }, ref: c => state.scrollView = c } : { style: { flex: 1, backgroundColor: "transparent" } }
    let numColumns = props.numColumns;
    if (numColumns === 0)
        numColumns = 1;
    return (
        <View ifTrue={props.ifTrue} css={x => x.cls("_buttonGroup", "ButtonGroup").joinRight(props.css)} style={props.style}>
            {props.scrollable ? (
                <VirtualScroller
                    {...cProps}
                    numColumns={numColumns}
                    itemSize={props.itemSize}
                    items={props.buttons}
                    renderItem={({ item, index }) => getItem(item, index)}
                    horizontal={!props.isVertical}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ref={c => state.scrollView = c}
                    updateOn={[...state.selectedIndex, ...(props.updateOn ?? [])]}
                />
            ) : (<View {...cProps}>
                <View style={props.style} css={x => x.cls("_buttonGroupCenter").if(props.isVertical, c => c.flD("column"), c => c.flD("row")).joinRight(props.css)}>
                    {
                        props.buttons.map((x, index) => getItem(x, index))
                    }
                </View>
            </View>)}

        </View >
    )
}