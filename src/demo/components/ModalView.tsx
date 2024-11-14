import StateBuilder from "react-smart-state";
import { ActionSheet, AlertDialog, Button, Modal, ScrollView, Text, TouchableOpacity } from "../src";
import { Block } from "./Block";
import { BlockContainer } from "./BlockContainer";
import { Platform } from "react-native";




export const ModalView = () => {
    const state = StateBuilder({
        modal1: false,
        modal2: false,
        actionSheet: {
            position: undefined,
            visible: false
        }
    }).build();


    const Alert = () => {
        AlertDialog.alert({ message: "This a test Text for alert dialog", title: "Success", css: x => x.wi(Platform.OS == "web" ? "30%" : "80%") });
    }

    const Toast = (type: any) => {
        AlertDialog.toast({
            message: "Loaders are enabled by default. Use `loader`, `loaderBg` to change the default behavior",
            title: type,
            position: "Top",
            loader: false,
            type: type
        });
    }


    const Confirm = async () => {
        let answer = await AlertDialog.confirm({
            message: "Deleting the post will remove it permanently and cannot be undone. Please confirm if you want to proceed.",
            title: "Are you sure you want to delete this post?",
            yesText: "Delete"
        });

        alert(answer)
    }

    let info = `wi:${Platform.OS == "web" ? "30%" : "80%"}`

    return (
        <BlockContainer>
            <Block title="Modal Example">
                <Button onPress={() => state.modal1 = true} text="Show Modal" />
                <Modal animationStyle="Opacity" isVisible={state.modal1} addCloser={true} onHide={() => state.modal1 = false}>
                    <Text>this is modal 1</Text>
                    <Button onPress={() => state.modal2 = true} text="Show Modal 2" />
                </Modal>
                <Modal css={info} isVisible={state.modal2} onHide={() => state.modal2 = false}>
                    <Text css={x => x.foS(12).co("red")}>this is modal 2</Text>
                </Modal>
            </Block>

            <Block title="ActionSheet">
                <Button onPress={() => {
                    state.actionSheet.position = "Bottom";
                    state.actionSheet.visible = true
                }} text="ActionSheet Bottom" />

                <Button onPress={() => {
                    state.actionSheet.position = "Top";
                    state.actionSheet.visible = true
                }} text="ActionSheet Top" />

                <Button onPress={() => {
                    state.actionSheet.position = "Left";
                    state.actionSheet.visible = true
                }} text="ActionSheet Left" />

                <Button onPress={() => {
                    state.actionSheet.position = "Right";
                    state.actionSheet.visible = true
                }} text="ActionSheet Right" />

                <ActionSheet position={state.actionSheet.position} size={Platform.OS == "web" ? "30%" : "50%"} isVisible={state.actionSheet.visible} onHide={() => state.actionSheet.visible = false}>
                    <ScrollView style={{ maxHeight: "95%" }}>
                        {

                            ["Play", "Share", "Delete", "Favorit", "Cancel"].map(x => (
                                <TouchableOpacity onPress={() => state.actionSheet.visible = false} css="actionButton" key={x} >
                                    <Text>{x}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </ActionSheet>
            </Block>
            <Block title="AlertDiaLog">
                <Button onPress={Alert} text="Show alert" />
            </Block>
            <Block title="ConfirmDialog">
                <Button onPress={Confirm} text="Show confirm" />
            </Block>
            <Block title="ToastDialog">
                <Button onPress={() => Toast("Error")} text="Show Toast Error" />
                <Button onPress={() => Toast("Warning")} text="Show Toast Warning" />
                <Button onPress={() => Toast("Success")} text="Show Toast Success" />
                <Button onPress={() => Toast("Info")} text="Show Toast Info" />
            </Block>

        </BlockContainer>
    )
}