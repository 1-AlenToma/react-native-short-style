import * as React from "react";
import { AnimatedView, TouchableOpacity, View, Text, ScrollView, TextInput } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "react-smart-state";
import { ViewStyle } from "react-native";
import { ifSelector, newId, optionalStyle, setRef } from "../config/Methods";
import { DropdownItem, DropdownListProps, DropdownRefItem, ModalProps, Size } from "../Typse";
import { Modal } from "./Modal";
import { ActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import * as ReactNtive from "react-native";
import { FormItem } from "./FormItem";
import { TabBar, TabView } from "./TabBar";

export const DropdownList = React.forwardRef<DropdownRefItem, DropdownListProps>((props, ref) => {
    if (ifSelector(props.ifTrue) == false)
        return null;
    const state = StateBuilder({
        visible: false,
        shadow: "",
        text: "",
        index: 0,
        tempSelection: undefined,
        propsSize: undefined as Size | undefined,
        refItems: {
            scrollView: undefined as ReactNtive.ScrollView | undefined
        }
    }).ignore("refItems.scrollView").build();
    const mode = props.mode ?? "Modal";

    state.useEffect(() => {
        if (state.refItems.scrollView) {
            state.refItems.scrollView.scrollTo({
                y: props.items.findIndex(x => x.value == props.selectedValue) * 30,
                animated: false
            })
        }
    }, "refItems.scrollView")

    state.useEffect(() => {
        if (!state.visible)
            state.text = "";
    }, "visible")

    setRef(ref, {
        open: () => state.visible = true,
        close: () => state.visible = false,
        selectedValue: props.selectedValue
    } as DropdownRefItem);

    const getItem = (item: DropdownItem, index: number) => {
        return (
            <TouchableOpacity onPress={() => {
                props.onSelect?.(item);
                state.visible = false;
            }} key={index}
                onMouseEnter={() => state.tempSelection = index}
                onMouseLeave={() => state.tempSelection = undefined}
                css={`mih:30 pa:5 wi:100% juc:center bobw:.5 boc:#CCC ${item.value === props.selectedValue || index == state.tempSelection ? props.selectedItemCss ?? "_selectedValue" : ""}`}>
                {
                    props.render ? props.render(item) : (
                        <Text css={`fos-sm ${item.value === props.selectedValue || index == state.tempSelection ? props.selectedItemCss ?? "_selectedValue" : ""}`}>{item.label}</Text>
                    )
                }
            </TouchableOpacity>
        )
    }

    const Component = mode == "Modal" ? Modal : mode == "ActionSheet" ? ActionSheet : TabView;
    const selectedText = props.items.find(x => x.value == props.selectedValue)?.label;
    let componentsProps: any = { css: `he:${props.size ?? "50%"}`, size: props.size ?? "50%", isVisible: state.visible, onHide: () => state.visible = false }
    if (mode == "Fold") {
        componentsProps = {
        }
    }

    const Container = mode == "Fold" ? TabBar : React.Fragment;
    const Selector = mode == "Fold" ? TabView : React.Fragment;


    return (
        <Container disableScrolling={true} onTabChange={(index) => state.index = index} style={{ flex: null, flexBasis: state.index == 1 ? undefined : 38 }} css={`maw:200`} selectedTabIndex={state.visible ? 1 : 0}>
            <Selector>
                <TouchableOpacity onLayout={({ nativeEvent }) => {
                    state.propsSize = nativeEvent.layout;
                }} onMouseEnter={() => state.shadow = "sh-sm"} onMouseLeave={() => state.shadow = ""}
                    onPress={() => state.visible = !state.visible}
                    css={`wi:95% he:30 fld:row ali:center bow:.5 bor:5 _overflow boc:#CCC ${state.shadow} ${optionalStyle(props.css).c}`}>
                    <View css="wi:80% he:100% borw:.5 juc:center pal:5 boc:#CCC">
                        <Text style={{
                            color: selectedText ? undefined : "#CCC"
                        }} css="fos-sm">{selectedText ?? props.placeHolder}</Text>
                    </View>
                    <View css="juc:center ali:center wi:20% he:100%">
                        <Icon style={{
                            transform: [{
                                rotateX: mode == "Fold" ? undefined : state.visible ? "180deg" : "0deg"
                            }]
                        }} type="AntDesign" name={mode == "Fold" ? "caretright" : "caretdown"} />
                    </View>
                </TouchableOpacity>
            </Selector>
            <Component {...componentsProps}>
                <Text css="fos-lg fow:bold co:#CCC mab:5" ifTrue={props.placeHolder != undefined}>{props.placeHolder}</Text>
                <FormItem ifTrue={props.enableSearch == true} icon={{ type: "Ionicons", name: "search", css: "co:#CCC" }}>
                    <TextInput css="mab:5 pa:5 bow:.5 boc:#CCC" placeholderTextColor={"#CCC"} placeholder={props.textInputPlaceHolder ?? "Search here..."} defaultValue={state.text}
                        onChangeText={txt => state.text = txt} />
                </FormItem>
                <ScrollView style={{ marginTop: !props.enableSearch ? 15 : 5, maxHeight: mode == "Fold" ? Math.min(props.items.length * (35), 200) - (props.items.length > 10 ? state.propsSize?.height ?? 0 : 0) - 10 : undefined }} ref={c => state.refItems.scrollView = c}>
                    {
                        props.items.filter(x => state.text == "" || x.label.toLowerCase().indexOf(state.text.toLowerCase()) != -1)
                            .map(getItem)
                    }
                </ScrollView>
            </Component>
        </Container>
    )

});