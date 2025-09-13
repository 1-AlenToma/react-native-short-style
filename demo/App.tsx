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
  CSSStorage,
  useLoader
} from './src';
import buildState from "./src/States";
import GlobalStyles from './components/GlobalStyles';
import { Block, BlockContainer, ButtonGroupView, InputForm, ModalView, MovingBall, ProgressView, ScrollMenuView } from './components';
import { newId } from './src/config';
import React, { useEffect, useRef } from 'react';
import * as icons from "@expo/vector-icons";

const userDefined = {
  textStyle: "co-yellow pa-5 !important",
  "texto, texto Text>Text:eq-of-type(0)": "bac-green co-red textStyle-!important",
   "virtualItemSelector:not(>:has(selectedValue)):nth(even) *": x => x.baC("black").co("white").foW("bold").importantAll()
}
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
    },
   ...userDefined
    // "virtualItemSelector:not(*:has(selectedValue)):nth(even) *": x => x.baC("gray").co("white").foW("bold").importantAll()
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
    Icon: x => x.co(".co-light"),
    header: "bac:red",
    ...userDefined
  })
]

export default function App() {
  const state = buildState({
    id: newId(),
    selectedTheme: 0,
    loading: false
  }).build();



  const debug = false;

  useEffect(() => {
    /*  (async () => {
        const keys = (await AsyncStorage.getAllKeys()).filter(x => x.startsWith("CSSStyled_"));
        const datas = await AsyncStorage.multiGet(keys);
        datas.forEach(x => tempData.set(x[0], x[1]))
        //console.log(tempData)
        state.loading = false;
      })();*/
  }, [])

  if (state.loading)
    return null;


  return (
    <ThemeContainer icons={icons} selectedIndex={state.selectedTheme} themes={themes} defaultTheme={GlobalStyles}>
      {debug ? (<View css="texto-!important">
        <Text>hej jkhkjhasd <Text>test</Text></Text>
      </View>) : (
        <TabBar ifTrue={false} position='Bottom' header={{
          selectedIconStyle: "color:red",
          style: x => x.baC("#ffffff"),
          textStyle: x => x.co("#000"),
          overlayStyle: {
            content: x => x.baC("#8a88ee").op(.4)
          }
        }}>
          <TabView title='Themes' icon={{ type: "AntDesign", name: "home", size: 20, css: "co:#000" }}>
            <Fab follow="Window" style={{ bottom: 50 }} position="RightBottom"
              prefixContainerStyle={x => x.baC(".co-dark")} blureScreen={true} prefix={<Icon type="AntDesign" size={30} css={x => x.co(".co-light")} name='plus' />}>
              <Button text='btn 1'></Button>
              <Button text='btn 1'></Button>
            </Fab>
            <BlockContainer>
              <Block title="Theme Example">
                <Button icon={<Icon type="AntDesign" name="adduser" color="red" />} disabled={false} onPress={() => state.selectedTheme = state.selectedTheme == 0 ? 1 : 0} text="Toggle Theme" />
              </Block>

              <ProgressView />
              <InputForm />
            </BlockContainer>
            <BlockContainer>
              <ButtonGroupView />
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


            </BlockContainer>
          </TabView>
          <TabView title='Modal & Alert'>
            <ModalView />
            <StatusBar style="auto" />
          </TabView>
          <TabView disableScrolling={true} title="Moving Ball">
            <MovingBall />
          </TabView>
          <TabView disableScrolling={true} title="ScrollMenu">
            <ScrollMenuView />
          </TabView>
        </TabBar>
      )}
    </ThemeContainer >
  );
}

