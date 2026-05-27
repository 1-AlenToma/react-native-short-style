import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StateBuilder from "react-smart-state";
import { ActionSheet, AlertDialog, Button, Modal, ScrollView, Text, TouchableOpacity, useLocalMemo, View } from "../src";
import { Block } from "./Block";
import { BlockContainer } from "./BlockContainer";
import { Platform } from "react-native";
export const ModalView = () => {
    const state = StateBuilder({
        modal1: false,
        modal2: false,
        actionSheet: {
            position: undefined,
            visible: false,
            childVis: false
        }
    }).build();
    const { mem } = useLocalMemo();
    const Alert = mem(() => {
        AlertDialog.alert({ message: "This a test Text for alert dialog", title: "Success", css: x => x.wi(Platform.OS == "web" ? "30%" : "80%") });
    });
    const Toast = mem((type) => {
        AlertDialog.toast({
            message: "Loaders are enabled by default. Use `loader`, `loaderBg` to change the default behavior",
            title: type,
            position: "Top",
            loader: true,
            type: type
        });
    });
    const Confirm = mem(async () => {
        let answer = await AlertDialog.confirm({
            message: "Deleting the post will remove it permanently and cannot be undone. Please confirm if you want to proceed.",
            title: "Are you sure you want to delete this post?",
            yesText: "Delete"
        });
        alert(answer);
    });
    let info = `wi:${Platform.OS == "web" ? "30%" : "80%"}`;
    return (_jsxs(BlockContainer, { children: [_jsxs(Block, { title: "Modal Example", children: [_jsx(Button, { onPress: mem(() => state.modal1 = true), text: "Show Modal" }), _jsxs(Modal, { animationStyle: "Opacity", isVisible: state.modal1, addCloser: true, onHide: mem(() => state.modal1 = false), children: [_jsx(Text, { children: "this is modal 1" }), _jsx(Button, { onPress: mem(() => state.modal2 = true), text: "Show Modal 2" })] }), _jsx(Modal, { css: info, isVisible: state.modal2, onHide: () => state.modal2 = false, children: _jsx(Text, { css: mem(x => x.foS(12).co("red")), children: "this is modal 2" }) })] }), _jsxs(Block, { title: "ActionSheet", children: [_jsx(Button, { onPress: mem(() => {
                            state.actionSheet.position = "Bottom";
                            state.actionSheet.visible = true;
                        }), text: "ActionSheet Bottom" }), _jsx(Button, { onPress: mem(() => {
                            state.actionSheet.position = "Top";
                            state.actionSheet.visible = true;
                        }), text: "ActionSheet Top" }), _jsx(Button, { onPress: mem(() => {
                            state.actionSheet.position = "Left";
                            state.actionSheet.visible = true;
                        }), text: "ActionSheet Left" }), _jsx(Button, { onPress: mem(() => {
                            state.actionSheet.position = "Right";
                            state.actionSheet.visible = true;
                        }), text: "ActionSheet Right" }), _jsx(Modal, { css: "he-80% wi-80% dialogtest", isVisible: state.actionSheet.childVis, onHide: mem(() => state.actionSheet.childVis = false), children: _jsx(Text, { children: "this is a test" }) }), _jsx(ActionSheet, { position: state.actionSheet.position, size: Platform.OS == "web" ? "30%" : "50%", isVisible: state.actionSheet.visible, onHide: mem(() => state.actionSheet.visible = false), children: _jsx(View, { css: "fl-1", children: _jsx(ScrollView, { style: mem({ maxHeight: "95%" }), children: mem(["Play", "Share", "Delete", "Favorit", "Cancel"].map(x => (_jsx(TouchableOpacity, { onPress: async () => {
                                        if (await AlertDialog.confirm("Close ActionSheet"))
                                            state.actionSheet.visible = false;
                                        else
                                            state.actionSheet.childVis = true;
                                    }, css: "actionButton", children: _jsx(Text, { children: x }) }, x)))) }) }) })] }), _jsx(Block, { title: "AlertDiaLog", children: _jsx(Button, { onPress: Alert, text: "Show alert" }) }), _jsx(Block, { title: "ConfirmDialog", children: _jsx(Button, { onPress: Confirm, text: "Show confirm" }) }), _jsxs(Block, { title: "ToastDialog", children: [_jsx(Button, { onPress: () => Toast("Error"), text: "Show Toast Error" }), _jsx(Button, { onPress: () => Toast("Warning"), text: "Show Toast Warning" }), _jsx(Button, { onPress: () => Toast("Success"), text: "Show Toast Success" }), _jsx(Button, { onPress: () => Toast("Info"), text: "Show Toast Info" })] })] }));
};
//# sourceMappingURL=ModalView.js.map