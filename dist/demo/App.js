import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import { ThemeContainer, Text, View, Button, Icon, NestedStyleSheet, TabBar, TabView, Fab, Collabse, Loader, ToolTip } from './src';
import buildState from "./src/States";
import GlobalStyles from './components/GlobalStyles';
import { Block, BlockContainer, ButtonGroupView, InputForm, ModalView, MovingBall, ProgressView, ScrollMenuView } from './components';
import { newId } from './src/config';
import * as icons from "@expo/vector-icons";
const userDefined = {
    textStyle: "co-yellow pa-5 !important",
    "texto, texto Text>Text:eq-of-type(0)": "bac-green co-red textStyle-!important",
    "virtualItemSelector:not(>:has(selectedValue)):nth(even) *": x => x.baC("black").co("white").foW("bold").importantAll()
};
const themes = [
    NestedStyleSheet.create(Object.assign({ AnimatedView: {
            backgroundColor: "#fff"
        }, View: {
            backgroundColor: "#fff"
        }, Text: {
            color: "#000"
        }, TextInput: {
            color: "#000"
        }, Icon: {
            color: "#000"
        } }, userDefined
    // "virtualItemSelector:not(*:has(selectedValue)):nth(even) *": x => x.baC("gray").co("white").foW("bold").importantAll()
    )),
    NestedStyleSheet.create(Object.assign({ AnimatedView: {
            backgroundColor: "rgb(70 70 70)"
        }, View: {
            backgroundColor: "rgb(70 70 70)"
        }, Text: {
            color: "#fff"
        }, TextInput: {
            color: "#fff"
        }, Icon: x => x.co(".co-light"), header: "bac:red" }, userDefined))
];
export default function App() {
    const state = buildState({
        id: newId(),
        selectedTheme: 0,
        loading: false
    }).build();
    const debug = false;
    if (state.loading)
        return null;
    return (_jsx(ThemeContainer, { icons: icons, selectedIndex: state.selectedTheme, themes: themes, defaultTheme: GlobalStyles, children: debug ? (_jsx(View, { css: "texto-!important", children: _jsxs(Text, { children: ["hej jkhkjhasd ", _jsx(Text, { children: "test" })] }) })) : (_jsxs(TabBar, { ifTrue: false, position: 'Bottom', header: {
                selectedIconStyle: "color:red",
                style: x => x.baC("#ffffff"),
                textStyle: x => x.co("#000"),
                overlayStyle: {
                    content: x => x.baC("#8a88ee").op(.4)
                }
            }, children: [_jsxs(TabView, { title: 'Themes', icon: { type: "AntDesign", name: "home", size: 20, css: "co:#000" }, children: [_jsxs(Fab, { follow: "Window", style: { bottom: 50 }, position: "RightBottom", prefixContainerStyle: x => x.baC(".co-dark"), blureScreen: true, prefix: _jsx(Icon, { type: "AntDesign", size: 30, css: x => x.co(".co-light"), name: 'plus' }), children: [_jsx(Button, { text: 'btn 1' }), _jsx(Button, { text: 'btn 1' })] }), _jsxs(BlockContainer, { children: [_jsx(Block, { title: "Theme Example", children: _jsx(Button, { icon: _jsx(Icon, { type: "AntDesign", name: "adduser", color: "red" }), disabled: false, onPress: () => state.selectedTheme = state.selectedTheme == 0 ? 1 : 0, text: "Toggle Theme" }) }), _jsx(ProgressView, {}), _jsx(InputForm, {})] }), _jsxs(BlockContainer, { children: [_jsx(ButtonGroupView, {}), _jsx(Block, { style: { width: 300 }, title: 'Collabse', children: _jsx(Collabse, { icon: _jsx(Icon, { type: "AntDesign", name: 'book', size: 20 }), text: "header test", children: _jsx(Text, { children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus nobis corporis ut, ex sed aperiam. Debitis, facere! Animi quis laudantium, odio nulla recusandae labore pariatur in, vitae corporis delectus repellendus." }) }) }), _jsx(Block, { style: { width: 300 }, title: 'Loader', children: _jsx(Loader, { loading: true, text: "Loading...", children: _jsx(Collabse, { defaultActive: true, icon: _jsx(Icon, { type: "AntDesign", name: 'book', size: 20 }), text: "header test", children: _jsx(Text, { children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus nobis corporis ut, ex sed aperiam. Debitis, facere! Animi quis laudantium, odio nulla recusandae labore pariatur in, vitae corporis delectus repellendus." }) }) }) }), _jsx(Block, { style: { width: 300 }, title: 'ToolTip', children: _jsx(ToolTip, { text: `Lorem ipsum'
               dolor sit amet consectetur adipisicing elit. Minus nobis corporis ut, ex sed aperiam. Debitis, facere! Animi quis 
                laudantium, odio nulla recusandae labore pariatur in, vitae corporis delectus repellendus.`, children: _jsx(Text, { children: "Press Here" }) }) })] })] }), _jsxs(TabView, { title: 'Modal & Alert', children: [_jsx(ModalView, {}), _jsx(StatusBar, { style: "auto" })] }), _jsx(TabView, { disableScrolling: true, title: "Moving Ball", children: _jsx(MovingBall, {}) }), _jsx(TabView, { disableScrolling: true, title: "ScrollMenu", children: _jsx(ScrollMenuView, {}) })] })) }));
}
//# sourceMappingURL=App.js.map