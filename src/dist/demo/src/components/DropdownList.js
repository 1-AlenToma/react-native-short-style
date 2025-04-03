import * as React from "react";
import { TouchableOpacity, View, Text, ScrollView, TextInput } from "./ReactNativeComponents";
import StateBuilder from "react-smart-state";
import { ifSelector, optionalStyle, setRef } from "../config";
import { Modal } from "./Modal";
import { ActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import { FormItem } from "./FormGroup";
import { TabBar, TabView } from "./TabBar";
const DropDownItemController = ({ item, index, state, props }) => {
    var _a, _b, _c;
    const itemState = StateBuilder({
        selected: undefined
    }).ignore("selected").build();
    if (!(state.text == "" || ((_a = props.onSearch) === null || _a === void 0 ? void 0 : _a.call(props, item, state.text)) || item.label.toLowerCase().indexOf(state.text.toLowerCase()) != -1))
        return null;
    return (React.createElement(TouchableOpacity, { onPress: () => {
            var _a;
            state.selectedValue = item.value;
            (_a = props.onSelect) === null || _a === void 0 ? void 0 : _a.call(props, item);
            state.visible = false;
        }, onMouseEnter: () => itemState.selected = index, onMouseLeave: () => itemState.selected = undefined, css: `mih:30 pa:5 wi:100% juc:center bobw:.5 boc:#CCC DropDownListItem ${item.value === state.selectedValue || index == itemState.selected ? (_b = props.selectedItemCss) !== null && _b !== void 0 ? _b : "_selectedValue" : ""}` }, props.render ? props.render(item) : (React.createElement(Text, { css: `fos-sm ${item.value === state.selectedValue || index == itemState.selected ? (_c = props.selectedItemCss) !== null && _c !== void 0 ? _c : "_selectedValue" : ""}` }, item.label))));
};
export const DropdownList = React.forwardRef((props, ref) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const state = StateBuilder({
        visible: false,
        shadow: "",
        text: "",
        index: 0,
        selectedValue: props.selectedValue,
        propsSize: undefined,
        refItems: {
            scrollView: undefined
        }
    }).ignore("refItems.scrollView").build();
    const mode = (_a = props.mode) !== null && _a !== void 0 ? _a : "Modal";
    state.useEffect(() => {
        if (state.refItems.scrollView) {
            state.refItems.scrollView.scrollTo({
                y: props.items.findIndex(x => x.value == props.selectedValue) * 30,
                animated: false
            });
        }
    }, "refItems.scrollView");
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
    const selectedText = (_b = props.items.find(x => x.value == state.selectedValue)) === null || _b === void 0 ? void 0 : _b.label;
    let componentsProps = { css: `he:${(_c = props.size) !== null && _c !== void 0 ? _c : "50%"} DropDownListItems`, addCloser: true, size: (_d = props.size) !== null && _d !== void 0 ? _d : "50%", isVisible: state.visible, onHide: () => state.visible = false };
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
    return (React.createElement(Container, Object.assign({}, containerProps),
        React.createElement(Selector, null,
            React.createElement(TouchableOpacity, { onLayout: ({ nativeEvent }) => {
                    state.propsSize = nativeEvent.layout;
                }, onMouseEnter: () => state.shadow = "sh-sm", onMouseLeave: () => state.shadow = "", onPress: () => state.visible = !state.visible, css: `wi:95% he:30 fld:row ali:center bow:.5 bor:5 _overflow boc:#CCC DropdownList ${state.shadow} ${optionalStyle(props.css).c}` },
                React.createElement(View, { css: "fl:1 wi:85% he:100% borw:.5 juc:center pal:5 boc:#CCC bac-transparent" },
                    React.createElement(Text, { style: selectedText ? undefined : {
                            color: "#CCC"
                        }, css: "fos-sm" }, selectedText !== null && selectedText !== void 0 ? selectedText : props.placeHolder)),
                React.createElement(View, { css: "fl:1 _center wi:30 maw:30 he:100% bac-transparent" },
                    React.createElement(Icon, { style: {
                            transform: [{
                                    rotateX: (mode == "Fold" ? "0deg" : (state.visible ? "180deg" : "0deg"))
                                }]
                        }, type: "AntDesign", name: mode == "Fold" ? "caretright" : "caretdown" })))),
        React.createElement(Component, Object.assign({}, componentsProps),
            React.createElement(Text, { css: "fos-lg fow:bold co:#CCC mab:5", ifTrue: props.placeHolder != undefined }, props.placeHolder),
            React.createElement(FormItem, { css: "mat-10", ifTrue: props.enableSearch == true, labelPosition: "Left", icon: { type: "Ionicons", name: "search", css: "co:#CCC" } },
                React.createElement(TextInput, { css: "mab:5 pa:5 bow:.5 boc:#CCC", placeholderTextColor: "#CCC", placeholder: (_e = props.textInputPlaceHolder) !== null && _e !== void 0 ? _e : "Search here...", defaultValue: state.text, onChangeText: txt => state.text = txt })),
            React.createElement(ScrollView, { nestedScrollEnabled: true, style: { marginTop: !props.enableSearch ? 15 : 5, maxHeight: mode == "Fold" ? Math.min(props.items.length * (35), 200) - (props.items.length > 10 ? (_g = (_f = state.propsSize) === null || _f === void 0 ? void 0 : _f.height) !== null && _g !== void 0 ? _g : 0 : 0) - 10 : undefined }, ref: c => state.refItems.scrollView = c }, props.items.map((x, index) => (React.createElement(DropDownItemController, { key: index, item: x, index: index, props: props, state: state })))))));
});
//# sourceMappingURL=DropdownList.js.map