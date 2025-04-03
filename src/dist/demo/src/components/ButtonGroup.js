import { View, Text, TouchableOpacity, ScrollView } from "./ReactNativeComponents";
import { useTimer } from "../hooks";
import StateBuilder from "react-smart-state";
import * as React from "react";
export const ButtonGroup = (props) => {
    const state = StateBuilder({
        selectedIndex: props.selectedIndex,
        scrollView: undefined,
        sizes: new Map()
    }).ignore("scrollView", "selectedIndex", "sizes").build();
    const timer = useTimer(200);
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
                if (props.isVertical)
                    state.scrollView.scrollTo({ y: [...state.sizes.values()].reduce((a, b, index) => a + (index < state.selectedIndex[0] ? b.height : 0), 0), animated: false });
                else
                    state.scrollView.scrollTo({ x: [...state.sizes.values()].reduce((a, b, index) => a + (index < state.selectedIndex[0] ? b.width : 0), 0), animated: false });
            }
        });
    };
    React.useEffect(() => {
        state.selectedIndex = props.selectedIndex;
        //state.scrollView = undefined;
    }, [props.selectedIndex]);
    state.useEffect(() => {
        scrollToItem();
    }, "scrollView", "selectedIndex");
    const getItem = (item, index) => {
        var _a;
        const itemStyle = (_a = props.itemStyle) === null || _a === void 0 ? void 0 : _a.call(props, item, index);
        return (React.createElement(TouchableOpacity, { onLayout: ({ nativeEvent }) => state.sizes.set(index, nativeEvent.layout), onPress: () => select(index), style: [props.scrollable ? undefined : { flex: 1 }], key: index, css: x => x.cls("_buttonGroupButton", "ButtonGroupButton").if(props.isVertical == true, c => c.wi("100%")).if(state.selectedIndex.includes(index), c => c.cls("selectedValue").joinRight(props.selectedStyle)).joinRight(itemStyle === null || itemStyle === void 0 ? void 0 : itemStyle.container) }, props.render ? props.render(item, index) : React.createElement(Text, { css: x => x.joinRight(itemStyle === null || itemStyle === void 0 ? void 0 : itemStyle.text).if(state.selectedIndex.includes(index), c => c.cls("selectedValue").joinRight(props.selectedStyle)) }, item)));
    };
    const Component = props.scrollable ? ScrollView : View;
    const cProps = props.scrollable ? { contentContainerStyle: { flex: 0 }, ref: c => state.scrollView = c } : { style: { flex: 1, backgroundColor: "transparent" } };
    return (React.createElement(View, { ifTrue: props.ifTrue, css: x => x.cls("_buttonGroup", "ButtonGroup").joinRight(props.css), style: props.style },
        React.createElement(Component, Object.assign({ horizontal: !props.isVertical }, cProps),
            React.createElement(View, { style: props.style, css: x => x.cls("_buttonGroupCenter").if(props.isVertical, c => c.flD("column"), c => c.flD("row")).joinRight(props.css) }, props.buttons.map((x, index) => getItem(x, index))))));
};
//# sourceMappingURL=ButtonGroup.js.map