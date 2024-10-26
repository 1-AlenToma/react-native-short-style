import { StatusBar } from 'expo-status-bar';

import { ThemeContext, ScrollView,ThemeContainer, Text, View, Button, Icon, NestedStyleSheet, Modal, ActionSheet , TouchableOpacity} from './src';
import buildState from "react-smart-state";
import GlobalStyles from './components/GlobalStyles';
import Block from './components/Block';

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
    selectedTheme: 0,
    modal1: false,
    modal2: false,
    actionSheet: false
  }).build()

  return (
    <ThemeContainer selectedIndex={state.selectedTheme} themes={themes} defaultTheme={GlobalStyles}>
      <View css="container flex:1 juc:center ali:center fld:row">
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
        <Block title="Theme Example">
          <Button icon={<Icon type="AntDesign" name="adduser" color="red" />} disabled={false} onPress={() => state.selectedTheme = state.selectedTheme == 0 ? 1 : 0} text="Toggle Theme" />
          <Text css="fos-xs">Text Themed</Text>
        </Block>
        <Block title="ActionSheet">
        <Button onPress={() => state.actionSheet = true} text="ActionSheet" />
          <ActionSheet height={"30%"} isVisible={state.actionSheet} onHide={() => state.actionSheet = false}>
          <ScrollView style={{maxHeight:"95%"}}>
            {
         
              ["Play", "Share", "Delete", "Favorit", "Cancel"].map(x=> (
                <TouchableOpacity onPress={()=> state.actionSheet = false} css="actionButton" key={x} >
                  <Text>{x}</Text>
                </TouchableOpacity>
              ))
            }
            </ScrollView>
          </ActionSheet>
        </Block>
        <StatusBar style="auto" />

      </View>
    </ThemeContainer>
  );
}

