import * as React from "react";
import { TouchableOpacity, View, Text, TextInput } from "./ReactNativeComponents";
import StateBuilder from "../States";
import { ifSelector, optionalStyle, setRef } from "../config";
import { DropdownItem, DropdownListProps, DropdownRefItem, Size } from "../Typse";
import { Modal } from "./Modal";
import { ActionSheet } from "./ActionSheet";
import { Icon } from "./Icon";
import { TabBar, TabView } from "./TabBar";
import { VirtualScroller } from "./VirtualScroller";
import { useLocalMemo } from "../hooks";
import { Platform } from "react-native";

const DropDownItemController = ({ item, index, state, props }: { props: DropdownListProps, item: DropdownItem, index: number, state: any }) => {
    const localState = StateBuilder({ selected: undefined as number | undefined }).build();
    const { mem, memo } = useLocalMemo()
    return (
        <View
            onMouseEnter={mem(() => {
                if (Platform.OS == "web" || Platform.OS == "windows" || Platform.OS == "macos")
                    localState.selected = index;
            })}
            onMouseLeave={mem(() => {
                if (Platform.OS == "web" || Platform.OS == "windows" || Platform.OS == "macos")
                    localState.selected = undefined;
            })}
            css={mem(`mih:30 pa:5 wi:100% juc:center bobw:.5 boc:#CCC DropDownListItem ${item.value === state.selectedValue || index == localState.selected ? props.selectedItemCss ?? "selectedValue" : ""}`, localState.selected, props.selectedItemCss)}>
            {
                props.render ? props.render(item) : (
                    <Text css={`fos-sm ${item.value === state.selectedValue || index == localState.selected ? props.selectedItemCss ?? "selectedValue" : ""}`}>{item.label}</Text>
                )
            }
        </View>
    )
}

export const DropdownList = React.forwardRef<DropdownRefItem, DropdownListProps>((props, ref) => {
    const state = StateBuilder({
        visible: false,
        shadow: "",
        text: "",
        index: 0,
        selectedValue: props.selectedValue,
        propsSize: undefined as Size | undefined,
    }).ignore("propsSize").build();
    const { mem , memo} = useLocalMemo();

    const mode = props.mode ?? "Modal";

    const items = props.items.filter((item) => (state.text == "" || props.onSearch?.(item, state.text) || item.label.toLowerCase().indexOf(state.text.toLowerCase()) != -1))
    let selectedIndex = items.findIndex(x => x.value == state.selectedValue);

    state.useEffect(() => {
        if (!state.visible && state.text != "")
            state.text = "";
    }, "visible")

    React.useEffect(() => {
        if (state.selectedValue != props.selectedValue)
            state.selectedValue = props.selectedValue;
    }, [props.selectedValue])

    setRef(ref, {
        open: () => state.visible = true,
        close: () => state.visible = false,
        selectedValue: state.selectedValue
    } as DropdownRefItem);


    const Component = mem(mode == "Modal" ? Modal : mode == "ActionSheet" ? ActionSheet : TabView, mode);
    const selectedText = props.items.find(x => x.value == state.selectedValue)?.label;
    let componentsProps: any = { css: `he:${props.size ?? "50%"} DropDownListItems`, addCloser: true, size: props.size ?? "50%", isVisible: state.visible, onHide: () => state.visible = false }
    if (mode == "Fold") {
        componentsProps = {
        }
    }

    const Container: any = mode == "Fold" ? TabBar : React.Fragment;
    const Selector = mode == "Fold" ? TabView : React.Fragment;
    const containerProps = mem(mode == "Fold" ? {
        disableScrolling: true,
        onTabChange: (index) => state.index = index,
        style: { flex: null, flexBasis: state.index == 1 ? undefined : 38 },
        selectedTabIndex: state.visible ? 1 : 0,
        css: props.css
    } : {}, mode, props.css, state.visible, state.index);


    if (ifSelector(props.ifTrue) == false)
        return null;
    return (
        <Container {...containerProps}>
            <Selector>
                <TouchableOpacity onLayout={mem(({ nativeEvent }) => {
                    state.propsSize = nativeEvent.layout;
                })} onMouseEnter={mem(() => state.shadow = "sh-sm")}
                    onMouseLeave={mem(() => state.shadow = "")}
                    onPress={mem(() => state.visible = !state.visible)}
                    css={memo(()=> `wi:95% he:30 fld:row ali:center bow:.5 bor:5 _overflow boc:#CCC DropdownList ${state.shadow} ${optionalStyle(props.css).c}`, state.shadow, props.css)}>
                    <View css="fl:1 wi:85% he:100% borw:.5 juc:center pal:5 boc:#CCC bac-transparent">
                        <Text style={mem(selectedText ? undefined : { color: "#CCC" }, selectedText)} css="fos-sm">
                            {selectedText ?? props.placeHolder}
                        </Text>
                    </View>
                    <View css="fl:1 _center wi:30 maw:30 he:100% bac-transparent">
                        <Icon style={mem({
                            transform: [{
                                rotateX: (mode == "Fold" ? "0deg" : (state.visible ? "180deg" : "0deg"))
                            }]
                        }, state.visible)} type="AntDesign" name={mode == "Fold" ? "caretright" : "caret-down"} />
                    </View>
                </TouchableOpacity>
            </Selector>
            <Component {...componentsProps}>
                <Text css="fos-lg fow:bold co:#CCC mab:5" ifTrue={props.placeHolder != undefined}>{props.placeHolder}</Text>
                <View css="_formItemCenter _formItemCenterLeft mat-10 maw-95% mah-40 fld-row ali-center" ifTrue={props.enableSearch == true}>
                    <Icon type="Ionicons" name="search" css="co-#ccc fos-25" />
                    <TextInput
                        css="mab:5 pa:5 bow:.5 boc:#CCC wi-90%"
                        placeholderTextColor={"#CCC"}
                        placeholder={props.textInputPlaceHolder ?? "Search here..."}
                        defaultValue={state.text}
                        onChangeText={mem(txt => state.text = txt)} />
                </View>
                <VirtualScroller
                    updateOn={props.updateOn}
                    initializeIndex={selectedIndex}
                    contentSizeTimer={200}
                    horizontal={false}
                    onItemPress={mem(({ item }) => {
                        state.selectedValue = item.value;
                        props.onSelect?.(item);
                        state.visible = false;
                    }, props.onSelect)}
                    numColumns={props.numColumns}
                    itemSize={props.itemSize}
                    scrollEventThrottle={16}
                    keyExtractor={mem((item) => item.value)}
                    style={mem({ marginTop: !props.enableSearch ? 15 : 5, maxHeight: mode == "Fold" ? Math.min(props.items.length * (35), 200) - (props.items.length > 10 ? state.propsSize?.height ?? 0 : 0) - 10 : undefined }, props.enableSearch, props.items.length, state.propsSize?.height)}
                    renderItem={mem(({ item, index }) => (<DropDownItemController item={item} index={index} props={props} state={state} />))}
                    items={items}
                />
            </Component>
        </Container>
    )

});