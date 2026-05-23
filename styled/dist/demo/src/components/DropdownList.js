import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { TouchableOpacity, View, Text, TextInput } from "./ReactNativeComponents";
import StateBuilder from "../States";
import { ifSelector, optionalStyle, setRef } from "../config";
import { Modal } from "./Modal";
import { ActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import { TabBar, TabView } from "./TabBar";
import { VirtualScroller } from "./VirtualScroller";
const DropDownItemController = ({ item, index, state, props }) => {
    const [selected, setSelected] = React.useState(undefined);
    return (_jsx(View, { onMouseEnter: () => setSelected(index), onMouseLeave: () => setSelected(undefined), css: `mih:30 pa:5 wi:100% juc:center bobw:.5 boc:#CCC DropDownListItem ${item.value === state.selectedValue || index == selected ? props.selectedItemCss ?? "selectedValue" : ""}`, children: props.render ? props.render(item) : (_jsx(Text, { css: `fos-sm ${item.value === state.selectedValue || index == selected ? props.selectedItemCss ?? "selectedValue" : ""}`, children: item.label })) }));
};
export const DropdownList = React.forwardRef((props, ref) => {
    const state = StateBuilder({
        visible: false,
        shadow: "",
        text: "",
        index: 0,
        selectedValue: props.selectedValue,
        propsSize: undefined,
    }).ignore("propsSize").build();
    const mode = props.mode ?? "Modal";
    const items = props.items.filter((item) => (state.text == "" || props.onSearch?.(item, state.text) || item.label.toLowerCase().indexOf(state.text.toLowerCase()) != -1));
    let selectedIndex = items.findIndex(x => x.value == state.selectedValue);
    state.useEffect(() => {
        if (!state.visible && state.text != "")
            state.text = "";
    }, "visible");
    React.useEffect(() => {
        if (state.selectedValue != props.selectedValue)
            state.selectedValue = props.selectedValue;
    }, [props.selectedValue]);
    setRef(ref, {
        open: () => state.visible = true,
        close: () => state.visible = false,
        selectedValue: state.selectedValue
    });
    const Component = mode == "Modal" ? Modal : mode == "ActionSheet" ? ActionSheet : TabView;
    const selectedText = props.items.find(x => x.value == state.selectedValue)?.label;
    let componentsProps = { css: `he:${props.size ?? "50%"} DropDownListItems`, addCloser: true, size: props.size ?? "50%", isVisible: state.visible, onHide: () => state.visible = false };
    if (mode == "Fold") {
        componentsProps = {};
    }
    const Container = mode == "Fold" ? TabBar : React.Fragment;
    const Selector = mode == "Fold" ? TabView : React.Fragment;
    const containerProps = mode == "Fold" ? {
        disableScrolling: true,
        onTabChange: (index) => state.index = index,
        style: { flex: null, flexBasis: state.index == 1 ? undefined : 38 },
        selectedTabIndex: state.visible ? 1 : 0,
        css: props.css
    } : {};
    if (ifSelector(props.ifTrue) == false)
        return null;
    return (_jsxs(Container, { ...containerProps, children: [_jsx(Selector, { children: _jsxs(TouchableOpacity, { onLayout: ({ nativeEvent }) => {
                        state.propsSize = nativeEvent.layout;
                    }, onMouseEnter: () => state.shadow = "sh-sm", onMouseLeave: () => state.shadow = "", onPress: () => state.visible = !state.visible, css: `wi:95% he:30 fld:row ali:center bow:.5 bor:5 _overflow boc:#CCC DropdownList ${state.shadow} ${optionalStyle(props.css).c}`, children: [_jsx(View, { css: "fl:1 wi:85% he:100% borw:.5 juc:center pal:5 boc:#CCC bac-transparent", children: _jsx(Text, { style: selectedText ? undefined : { color: "#CCC" }, css: "fos-sm", children: selectedText ?? props.placeHolder }) }), _jsx(View, { css: "fl:1 _center wi:30 maw:30 he:100% bac-transparent", children: _jsx(Icon, { style: {
                                    transform: [{
                                            rotateX: (mode == "Fold" ? "0deg" : (state.visible ? "180deg" : "0deg"))
                                        }]
                                }, type: "AntDesign", name: mode == "Fold" ? "caretright" : "caret-down" }) })] }) }), _jsxs(Component, { ...componentsProps, children: [_jsx(Text, { css: "fos-lg fow:bold co:#CCC mab:5", ifTrue: props.placeHolder != undefined, children: props.placeHolder }), _jsxs(View, { css: "_formItemCenter _formItemCenterLeft mat-10 maw-95% mah-40 fld-row ali-center", ifTrue: props.enableSearch == true, children: [_jsx(Icon, { type: "Ionicons", name: "search", css: "co-#ccc fos-25" }), _jsx(TextInput, { css: "mab:5 pa:5 bow:.5 boc:#CCC wi-90%", placeholderTextColor: "#CCC", placeholder: props.textInputPlaceHolder ?? "Search here...", defaultValue: state.text, onChangeText: txt => state.text = txt })] }), _jsx(VirtualScroller, { updateOn: props.updateOn, initializeIndex: selectedIndex, contentSizeTimer: 200, horizontal: false, onItemPress: ({ item }) => {
                            state.selectedValue = item.value;
                            props.onSelect?.(item);
                            state.visible = false;
                        }, numColumns: props.numColumns, itemSize: props.itemSize, scrollEventThrottle: 16, keyExtractor: (item) => item.value, style: { marginTop: !props.enableSearch ? 15 : 5, maxHeight: mode == "Fold" ? Math.min(props.items.length * (35), 200) - (props.items.length > 10 ? state.propsSize?.height ?? 0 : 0) - 10 : undefined }, renderItem: ({ item, index }) => (_jsx(DropDownItemController, { item: item, index: index, props: props, state: state })), items: items })] })] }));
});
//# sourceMappingURL=DropdownList.js.map