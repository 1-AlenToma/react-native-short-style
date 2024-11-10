import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';

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
  Loader,
  Portal,
  ButtonGroup,
  ToolTip,
  FormItem,
  TextInput,
  Pager
} from './src';
import buildState from "react-smart-state";
import GlobalStyles from './components/GlobalStyles';
import { Block, BlockContainer } from './components';
import { newId } from './src/config';
import React from 'react';
import { Platform } from 'react-native';

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
    Icon: x => x.props({ refererId: "iconHandler" }).co("$co-light")
  })
]

export default function App() {
  const state = buildState({
    id: newId(),
    selectedTheme: 0,
    modal1: false,
    modal2: false,
    actionSheet: {
      position: undefined,
      visible: false
    },
    checkBoxes: [true, false],
    sliderValue: .5,
    selectedValue: "item1",
    selectedButtons: [1],
    items: [],
    loading: false,

  }).ignore("items").build();

  const update = () => state.id = newId();

  const Alert = () => {
    AlertDialog.alert({ message: "This a test Text for alert dialog", title: "Success" });
  }

  const Toast = (type: any) => {
    AlertDialog.toast({
      message: "Loaders are enabled by default. Use `loader`, `loaderBg` to change the default behavior",
      title: type,
      position: "Top",
      loader: true,
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

  const loadItems = async () => {
    state.loading = true;
    let oldItems = [...state.items];
    [...Array(5)].map((_, x) => {
      let value = oldItems.length + 1
      oldItems.push({
        label: `item ${value}`,
        value: `item${value}`
      })
    });

    state.items = oldItems;
    state.loading = false;
  }

  React.useEffect(() => {
    loadItems();
  }, [])


  return (
    <ThemeContainer referers={[{
      id: "iconHandler",
      func: (props: any) => {
        return props;
        props.ifTrue = true;
        return props;
      }
    }]} selectedIndex={state.selectedTheme} themes={themes} defaultTheme={GlobalStyles}>
      <TabBar position='Bottom' header={{
        selectedIconStyle: "color:red",
        style: x => x.baC("#ffffff"),
        overlayStyle: {
          content: x => x.baC("#8a88ee").op(.4)
        }
      }}>
        <TabView title='Themes' icon={{ type: "AntDesign", name: "home", size: 20, css: "co:#000" }}>
          <Fab position="RightBottom" prefixContainerStyle={{ backgroundColor: "red" }} style={{ bottom: 40 }} blureScreen={true} prefix={<Icon type="AntDesign" size={30} color={"white"} name='plus' />}>
            <Button text='btn 1'></Button>
            <Button text='btn 1'></Button>
          </Fab>
          <BlockContainer>
            <Block title="Theme Example">
              <Button icon={<Icon type="AntDesign" name="adduser" color="red" />} disabled={false} onPress={() => state.selectedTheme = state.selectedTheme == 0 ? 1 : 0} text="Toggle Theme" />
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
                mode="Fold"
                enableSearch={true}
                items={state.items}
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
            <Block style={{ width: 300 }} title='ToolTip'>
              <ToolTip text={`Lorem ipsum'
               dolor sit amet consectetur adipisicing elit. Minus nobis corporis ut, ex sed aperiam. Debitis, facere! Animi quis 
                laudantium, odio nulla recusandae labore pariatur in, vitae corporis delectus repellendus.`}>
                <Text>Press Here</Text>
              </ToolTip>
            </Block>
            <Block style={{ width: 300 }} title='ButtonGroup'>
              <ButtonGroup onPress={(btns) => state.selectedButtons = btns} buttons={["Simple", "Button", "Group"]} selectedIndex={state.selectedButtons} />
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
              <Modal animationStyle="Opacity" isVisible={state.modal1} addCloser={true} onHide={() => state.modal1 = false}>
                <Text>this is modal 1</Text>
                <Button onPress={() => state.modal2 = true} text="Show Modal 2" />
              </Modal>
              <Modal css={x => x.wi("30%")} isVisible={state.modal2} onHide={() => state.modal2 = false}>
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

              <ActionSheet position={state.actionSheet.position} size={"30%"} isVisible={state.actionSheet.visible} onHide={() => state.actionSheet.visible = false}>
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
            <StatusBar style="auto" />
          </BlockContainer>
        </TabView>
        <TabView title="Form" disableScrolling={false}>
          <BlockContainer>
            <Block title='Form'>
              <FormItem title="FullName" icon={{ type: "AntDesign", name: "user" }}>
                <TextInput css="fl:1" />
              </FormItem>
              <FormItem title="UserName" icon={{ type: "AntDesign", name: "user" }}>
                <TextInput css="fl:1" />
              </FormItem>
              <FormItem title="Passowrd" info="Passowrd must at least containes one upper char" icon={{ type: "AntDesign", name: "lock" }}>
                <TextInput css="fl:1" />
              </FormItem>
              <FormItem title="Country" info="Select where you are from" icon={{ type: "AntDesign", name: "flag" }}>
                <DropdownList mode="Fold"
                  selectedValue={0}
                  items={[{ label: "Sweden", value: 0 }, { label: "Irak", value: 1 }]} />
              </FormItem>
              <FormItem title="Stay logged in" info="Passowrd must at least containes one upper char" icon={{ type: "AntDesign", name: "lock" }}>
                <CheckBox checked checkBoxType="RadioButton"></CheckBox>
              </FormItem>
              <FormItem title="Stay logged in" info="Passowrd must at least containes one upper char" icon={{ type: "AntDesign", name: "lock" }}>
                <CheckBox checked checkBoxType="Switch"></CheckBox>
              </FormItem>
            </Block>
            <Block title='Page infinit loading' style={{ display: "none", minWidth: 300, height: 150 }}>
              <Loader loading={state.loading}>
                <Pager ifTrue={false}
                  selectedIndex={state.items.findIndex(x => x.value == state.selectedValue)}
                  showsVerticalScrollIndicator={true}
                  items={state.items}
                  onEndReached={loadItems}
                  onSelect={(item) => state.selectedValue = item.value}
                  renderHeader={false} horizontal={false} render={(item, index, css) => (
                    <View css={`wi:100% he:40 juc:center mab:5 bobw:1 boc:#CCC pal:5 pa:10 bac-transparent ${css}`}>
                      <Text css={`fos-sm ${css}`}>{item.label}</Text>
                    </View>)} />
              </Loader>
            </Block>
            <Block title='Page with Pagination header' style={{ minWidth: 300, height: 300 }}>
              <Loader loading={state.loading}>
                <Pager
                  selectedIndex={state.items.findIndex(x => x.value == state.selectedValue)}
                  showsVerticalScrollIndicator={true} items={state.items} onEndReached={loadItems}
                  onSelect={(item) => state.selectedValue = item.value}
                  renderHeader={true} horizontal={false} render={(item, index, css) => (
                    <View css={`wi:100% he:40 juc:center mab:5 bobw:1 boc:#CCC pal:5 pa:10 bac-transparent ${css}`}>
                      <Text css={`fos-sm ${css}`}>{item.label}</Text>
                    </View>)} />
              </Loader>
            </Block>


          </BlockContainer>
        </TabView>
      </TabBar>
    </ThemeContainer >
  );
}

