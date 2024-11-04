import * as React from "react";
import { AnimatedView, TouchableOpacity, View, Text, ScrollView, TextInput } from "./ReactNativeComponents";
import { InternalThemeContext } from "../theme/ThemeContext";
import { useAnimate } from "../hooks";
import StateBuilder from "react-smart-state";
import { ViewStyle } from "react-native";
import { ifSelector, newId, setRef } from "../config/Methods";
import { DropdownItem, DropdownListProps, DropdownRefItem, ModalProps } from "../Typse";
import { Modal } from "./Modal";
import { ActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import * as ReactNtive from "react-native";

export const DropdownList = React.forwardRef<DropdownRefItem, DropdownListProps>((props, ref) => {
    if (ifSelector(props.ifTrue) == false)
        return null;
    const state = StateBuilder({
        visible: false,
        shadow: "",
        text: "",
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
            }} key={index} css={`mih:30 pa:5 wi:100% juc:center bobw:.5 boc:#CCC ${item.value === props.selectedValue ? props.selectedItemCss ?? "selectedValue" : ""}`}>
                {
                    props.render ? props.render(item) : (
                        <Text css={`fos-sm ${item.value === props.selectedValue ? props.selectedItemCss ?? "selectedValue" : ""}`}>{item.label}</Text>
                    )
                }
            </TouchableOpacity>
        )
    }

    const Component = mode == "Modal" ? Modal : ActionSheet;
    const selectedText = props.items.find(x => x.value == props.selectedValue)?.label;



    return (
        <>
            <TouchableOpacity onMouseEnter={() => state.shadow = "sh-sm"} onMouseLeave={() => state.shadow = ""}
                onPress={() => state.visible = !state.visible}
                css={`wi:100% he:30 fld:row ali:center bow:.5 bor:5 overflow boc:#CCC ${state.shadow} ${props.css ?? ""}`}>
                <View css="wi:80% he:100% borw:.5 juc:center pal:5 boc:#CCC">
                    <Text style={{
                        color: selectedText ? undefined : "#CCC"
                    }} css="fos-sm">{selectedText ?? props.placeHolder}</Text>
                </View>
                <View css="juc:center ali:center wi:20% he:100%">
                    <Icon style={{
                        transform: [{
                            rotateX: state.visible ? "180deg" : "0deg"
                        }]
                    }} type="AntDesign" name="caretdown" />
                </View>
            </TouchableOpacity>
            <Component css={`he:${props.size ?? "50%"}`} size={props.size ?? "50%"} isVisible={state.visible} onHide={() => state.visible = false}>
                <Text css="fos-lg fow:bold co:#CCC mab:5" ifTrue={props.placeHolder != undefined}>{props.placeHolder}</Text>
                <TextInput css="mab:5 pa:5 bow:.5 boc:#CCC" ifTrue={props.enableSearch == true} placeholder={props.textInputPlaceHolder ?? "Search here..."} defaultValue={state.text}
                    onChangeText={txt => state.text = txt} />
                <ScrollView ref={c => state.refItems.scrollView = c}>
                    {
                        props.items.filter(x => state.text == "" || x.label.toLowerCase().indexOf(state.text) != -1)
                            .map(getItem)
                    }
                </ScrollView>
            </Component>
        </>
    )

});