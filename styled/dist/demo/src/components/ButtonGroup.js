import { jsx as _jsx } from "react/jsx-runtime";
import { View, Text, TouchableOpacity } from "./ReactNativeComponents";
import { useTimer } from "../hooks";
import StateBuilder from "../States";
import * as React from "react";
import { VirtualScroller } from "./VirtualScroller";
export const ButtonGroup = (props) => {
    var _a;
    const state = StateBuilder({
        selectedIndex: props.selectedIndex,
        scrollView: undefined,
        sizes: new Map()
    }).ignore("scrollView", "selectedIndex", "sizes").build();
    const timer = useTimer(500);
    const select = (index) => {
        var _a;
        if (!props.selectMultiple)
            state.selectedIndex = [index];
        else {
            if (state.selectedIndex.includes(index))
                state.selectedIndex = state.selectedIndex.filter(x => x !== index);
            else
                state.selectedIndex = [...state.selectedIndex, index];
        }
        (_a = props.onPress) === null || _a === void 0 ? void 0 : _a.call(props, state.selectedIndex, props.buttons.filter((x, i) => state.selectedIndex.includes(i)));
    };
    const scrollToItem = () => {
        timer(() => {
            if (state.scrollView && state.sizes.size > 0 && state.selectedIndex.length == 1) {
                state.scrollView.scrollToIndex(state.selectedIndex[0]);
            }
        });
    };
    React.useEffect(() => {
        state.selectedIndex = props.selectedIndex;
        scrollToItem();
        //state.scrollView = undefined;
    }, [props.selectedIndex]);
    state.useEffect(() => {
        scrollToItem();
    }, "scrollView", "selectedIndex");
    const getItem = (item, index) => {
        var _a;
        const itemStyle = (_a = props.itemStyle) === null || _a === void 0 ? void 0 : _a.call(props, item, index);
        return (_jsx(TouchableOpacity, { onLayout: ({ nativeEvent }) => state.sizes.set(index, nativeEvent.layout), onPress: () => select(index), style: [props.scrollable ? { height: "auto" } : { flex: 1 }], css: x => x.cls("_buttonGroupButton", "ButtonGroupButton").if(props.isVertical == true, c => c.wi("100%")).if(state.selectedIndex.includes(index), c => c.cls("selectedValue").joinRight(props.selectedStyle)).joinRight(itemStyle === null || itemStyle === void 0 ? void 0 : itemStyle.container), children: props.render ? props.render(item, index) : _jsx(Text, { css: x => x.joinRight(itemStyle === null || itemStyle === void 0 ? void 0 : itemStyle.text).if(state.selectedIndex.includes(index), c => c.joinRight(props.selectedStyle)), children: item }) }, index));
    };
    const cProps = props.scrollable ? { contentContainerStyle: { flex: 0, flexGrow: 1 }, ref: c => state.scrollView = c } : { style: { flex: 1, backgroundColor: "transparent" } };
    let numColumns = props.numColumns;
    if (numColumns === 0)
        numColumns = 1;
    return (_jsx(View, { ifTrue: props.ifTrue, css: x => x.cls("_buttonGroup", "ButtonGroup").joinRight(props.css), style: props.style, children: props.scrollable ? (_jsx(VirtualScroller, Object.assign({}, cProps, { numColumns: numColumns, itemSize: props.itemSize, items: props.buttons, renderItem: ({ item, index }) => getItem(item, index), horizontal: !props.isVertical, showsHorizontalScrollIndicator: false, showsVerticalScrollIndicator: false, ref: c => state.scrollView = c, updateOn: [...state.selectedIndex, ...((_a = props.updateOn) !== null && _a !== void 0 ? _a : [])] }))) : (_jsx(View, Object.assign({}, cProps, { children: _jsx(View, { style: props.style, css: x => x.cls("_buttonGroupCenter").if(props.isVertical, c => c.flD("column"), c => c.flD("row")).joinRight(props.css), children: props.buttons.map((x, index) => getItem(x, index)) }) }))) }));
};
//# sourceMappingURL=ButtonGroup.js.map