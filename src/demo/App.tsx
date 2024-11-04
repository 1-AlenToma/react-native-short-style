import { StatusBar } from 'expo-status-bar';

import {
  ThemeContext,
  ScrollView,
  ThemeContainer,
  Text,
  View,
  Button,
  Icon,
  NestedStyleSheet,
  Modal,
  ActionSheet,
  TouchableOpacity,
  AlertDialog,
  CheckBox,
  CheckBoxList,
  TabBar,
  TabView,
  ProgressBar,
  Fab,
  Slider,
  Collabse,
  DropdownList,
  Loader
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
    },
    TextInput: {
      color: "#000"
    },
    Icon: {
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
    },
    TextInput: {
      color: "#fff"
    },
    Icon: {
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
    checkBoxes: [true, false],
    sliderValue: .5,
    selectedValue: "item1"
  }).build();

  const update = () => state.id = newId();

  const Alert = () => {
    AlertDialog.alert({ message: "This a test Text for alert dialog", title: "Success" });
  }

  const Toast = () => {
    AlertDialog.toast({
      message: "Loaders are enabled by default. Use `loader`, `loaderBg` to change the default behavior",
      title: "Information",
      position: "Top",
      loader: true,
      type: "Warning"
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

  const items = [...Array(30)].map((_, x) => {
    return {
      label: `item ${x}`,
      value: `item${x}`
    }
  });

  return (
    <ThemeContainer selectedIndex={state.selectedTheme} themes={themes} defaultTheme={GlobalStyles}>
      <TabBar position='Bottom' header={{
        selectedIconStyle: "color:red",
        style: "bac:white"
      }}>
        <TabView title='Themes' icon={{ type: "AntDesign", name: "home", size: 20, css:"co:#000"}}>
          <Fab position="RightBottom" prefixContainerStyle={{ backgroundColor: "red" }} style={{ bottom: 40 }} blureScreen={true} prefix={<Icon type="AntDesign" size={30} color={"white"} name='plus' />}>
            <Button text='btn 1'></Button>
            <Button text='btn 1'></Button>
          </Fab>
          <BlockContainer>
            <Block title="Theme Example">
              <Button icon={<Icon type="AntDesign" name="adduser" color="red" />} disabled={false} onPress={() => state.selectedTheme = state.selectedTheme == 0 ? 1 : 0} text="Toggle Theme" />
              <Text css="fos-xs">Text Themed</Text>
            </Block>
            <Block title="ProgressBar">
              <ProgressBar value={state.sliderValue} />
              <Slider
                css="mat:30"
                animationType="spring"
                minimumValue={0}
                value={state.sliderValue}
                onValueChange={(v) => state.sliderValue = v[0]}
                maximumValue={1}
                step={.1}
                enableButtons={true} />
            </Block>
          </BlockContainer>
          <BlockContainer>
            <Block title='DropDownlist'>
              <DropdownList
                mode="Modal"
                enableSearch={true}
                items={items}
                onSelect={x => state.selectedValue = x.value}
                placeHolder='Select Value'
                selectedValue={state.selectedValue} />
            </Block>
            <Block style={{ width: 300 }} title='Collabse'>
              <Collabse icon={<Icon type="AntDesign" name='book' size={20} />} text={"header test"}>
                <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus nobis
                  corporis ut, ex sed aperiam. Debitis, facere! Animi quis laudantium, odio
                  nulla recusandae labore pariatur in, vitae corporis delectus repellendus.</Text>
              </Collabse>
            </Block>

            <Block style={{ width: 300 }} title='Loader'>
              <Loader loading={true} text="Loading...">
                <Collabse defaultActive={true} icon={<Icon type="AntDesign" name='book' size={20} />} text={"header test"}>
                  <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus nobis
                    corporis ut, ex sed aperiam. Debitis, facere! Animi quis laudantium, odio
                    nulla recusandae labore pariatur in, vitae corporis delectus repellendus.</Text>
                </Collabse>
              </Loader>
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
              <CheckBoxList labelPostion="Left" onChange={(changes) => {

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
              <CheckBoxList onChange={(changes) => {

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
        </TabView>
        <TabView title='Modal & Alert'>
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
              <ActionSheet size={"30%"} isVisible={state.actionSheet} onHide={() => state.actionSheet = false}>
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
            <Block title="ToastDialog">
              <Button onPress={Toast} text="Show Toast" />
            </Block>
            <StatusBar style="auto" />
          </BlockContainer>
        </TabView>
      </TabBar>
    </ThemeContainer >
  );
}

