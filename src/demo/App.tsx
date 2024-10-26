import { StatusBar } from 'expo-status-bar';

import {
  ThemeContext,
  ScrollView,
  ThemeContainer,
  Text, View,
  Button,
  Icon,
  NestedStyleSheet,
  Modal,
  ActionSheet,
  TouchableOpacity,
  AlertDialog,
  CheckBox,
  CheckBoxList
} from './src';
import buildState from "react-smart-state";
import GlobalStyles from './components/GlobalStyles';
import { Block, BlockContainer } from './components';
import { newId } from './src/config/Methods';

const themes = [
  NestedStyleSheet.create({
    AnimatedView: {
      backgroundColor: "#fff"
    },
    View: {
      backgroundColor: "#fff"
    },
    Text: {
      color: "#000"
    }
  }),
  NestedStyleSheet.create({
    AnimatedView: {
      backgroundColor: "rgb(70 70 70)"
    },
    View: {
      backgroundColor: "rgb(70 70 70)"
    },
    Text: {
      color: "#fff"
    }
  })
]

export default function App() {
  const state = buildState({
    id: newId(),
    selectedTheme: 0,
    modal1: false,
    modal2: false,
    actionSheet: false,
    checkBoxes: [true, false]
  }).build();

  const update = () => state.id = newId();

  const Alert = () => {
    AlertDialog.alert({ message: "This a test Text for alert dialog", title: "Success" });
  }


  const Confirm = async () => {
    let answer = await AlertDialog.confirm({
      message: "Deleting the post will remove it permanently and cannot be undone. Please confirm if you want to proceed.",
      title: "Are you sure you want to delete this post?",
      yesText: "Delete"
    });

    alert(answer)
  }

  return (
    <ThemeContainer selectedIndex={state.selectedTheme} themes={themes} defaultTheme={GlobalStyles}>
      <View css="container flex:1 juc:center ali:center">
        <BlockContainer>
          <Block title="Theme Example">
            <Button icon={<Icon type="AntDesign" name="adduser" color="red" />} disabled={false} onPress={() => state.selectedTheme = state.selectedTheme == 0 ? 1 : 0} text="Toggle Theme" />
            <Text css="fos-xs">Text Themed</Text>
          </Block>
        </BlockContainer>
        <BlockContainer>
          <Block title="CheckBox Example">
            <CheckBox label='checkit' checked={state.checkBoxes[0]} onChange={(checked) => {
              state.checkBoxes[0] = checked;
            }} />
          </Block>
          <Block title="CheckBoxList Example">
            <CheckBoxList disabled={true} onChange={(changes) => {

              state.checkBoxes = changes.map(x => x.checked)
            }} checkBoxType="CheckBox" selectionType="CheckBox">
              {
                state.checkBoxes.map((x, i) => (
                  <CheckBox key={i} label='checkit' checked={x} />
                ))
              }
            </CheckBoxList>
          </Block>
          <Block title="RadioButton Example">
            <CheckBoxList labelPostion="Left"  onChange={(changes) => {

              state.checkBoxes = changes.map(x => x.checked)
            }} checkBoxType="RadioButton" selectionType="Radio">
              {
                state.checkBoxes.map((x, i) => (
                  <CheckBox key={i} label='checkit' checked={x} />
                ))
              }
            </CheckBoxList>
          </Block>
          <Block title="Switch Example">
            <CheckBoxList  onChange={(changes) => {

              state.checkBoxes = changes.map(x => x.checked)
            }} checkBoxType="Switch" selectionType="CheckBox">
              {
                state.checkBoxes.map((x, i) => (
                  <CheckBox key={i} checked={x} />
                ))
              }
            </CheckBoxList>
          </Block>
        </BlockContainer>

        <BlockContainer>
          <Block title="Modal Example">
            <Button onPress={() => state.modal1 = true} text="Show Modal" />
            <Modal isVisible={state.modal1} onHide={() => state.modal1 = false}>
              <Text>this is modal 1</Text>
              <Button onPress={() => state.modal2 = true} text="Show Modal 2" />
            </Modal>
            <Modal css="wi:30%" isVisible={state.modal2} onHide={() => state.modal2 = false}>
              <Text>this is modal 2</Text>
            </Modal>
          </Block>

          <Block title="ActionSheet">
            <Button onPress={() => state.actionSheet = true} text="ActionSheet" />
            <ActionSheet height={"50%"} isVisible={state.actionSheet} onHide={() => state.actionSheet = false}>
              <ScrollView style={{ maxHeight: "95%" }}>
                {

                  ["Play", "Share", "Delete", "Favorit", "Cancel"].map(x => (
                    <TouchableOpacity onPress={() => state.actionSheet = false} css="actionButton" key={x} >
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
          <StatusBar style="auto" />
        </BlockContainer>
      </View>
    </ThemeContainer>
  );
}

