import StateBuilder from "react-smart-state"
import { ActionSheet, Button, Icon, ScrollMenu, Text, View } from "../src";



export const ScrollMenuView = () => {
    const state = StateBuilder({
        selectedIndex: 0,
        visible: false
    }).build();

    return (
        <View css="fl-1">
            <Button onPress={() => state.visible = true} icon={<Icon type="Entypo" name="menu" size={20} />} />
            <ActionSheet position="Right" size={"40%"} isVisible={state.visible} onHide={() => state.visible = false}>
                <Button onPress={() => state.selectedIndex = 0} text="View 1" css={`${state.selectedIndex == 0 ? "bac-red" : ""}`} />
                <Button onPress={() => state.selectedIndex = 1} text="View 2" css={`${state.selectedIndex == 1 ? "bac-red" : ""}`} />
                <Button onPress={() => state.selectedIndex = 2} text="View 3" css={`${state.selectedIndex == 2 ? "bac-red" : ""}`} />

            </ActionSheet>
            <ScrollMenu
                style={{ padding: 10 }}
                horizontal={false}
                onChange={index => state.selectedIndex = index}
                selectedIndex={state.selectedIndex}>
                <View>
                    <Text>view 1</Text>
                </View>
                <View>
                    <Text>view 2</Text>
                </View>
                <View>
                    <Text>view 3</Text>
                </View>
            </ScrollMenu>
        </View>
    )
}