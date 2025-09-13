# react-native-short-style
`react-native-short-style` It is designed to use CSS selectors to style your components as you do with css web like in native.

With this css you wont need to devide your style across components, and style each component, child etc.

So like CSS you could have selectors like `container > Button Text:[children*='submit']:"width-100 he-20 di-flex"` etc.

# App using `react-native-short-style`
[Novelo](https://github.com/1-AlenToma/Novelo)

here is how it look like
![screenshot](https://raw.githubusercontent.com/1-AlenToma/react-native-short-style/main/src/screenshot/image.png)

additinally you could also simplify your styles like instead of background, simple do `bac-red .box fl-1 op:0.5` and so on, box is a class that exist in your stylesheet.

If you see below, you also have predefines components like `Modal`, `ActionSheets`, `Tabs` and `AlertDialog` etc that you could use. See `demo` for more info

here is a simple code that shows how it works.


And now simple use your components
in addition to all the `View` props,
you can also use css.


# !important
for overriding a css value, it have to be followed by `-!important` eg `wi-100%-!important`.
for overriding the whole css style use `!important` instead eg `wi-100 he-200 !important` now both `width` and `height` will be overriden.

The overriden rules are as follow. `css` prop override `NestedStyleSheet`, and style override both css and `NestedStyleSheet`.

Note: Do not use dynamic style in css to much, eg a moving ball as its value changes to much and the lib caches all `css` values.
The cache have max size and it will reset when the size reaches, so no need to be worry even if you dynamic `css`


# here is a predifined Components you could use, like stylesheet, Modal etc.

```tsx
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
} from 'react-native-short-style';
// if you are using expo, or your use react-native-vector-icons
import * as icons from "@expo/vector-icons";


# Simple test

```ts
const userDefined = {
  textStyle: "co-yellow pa-5 !important",
  "texto, texto Text>Text:eq-of-type(0)": "bac-green co-red .textStyle-!important",
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



  // All your components have to be contained within ThemeContainer
  <ThemeContainer icons={icons} selectedIndex={state.selectedTheme} themes={themes} defaultTheme={GlobalStyles}>

  <View css="texto-!important">
        <Text>hej jkhkjhasd <Text>test</Text></Text>
      </View>
  </ThemeContainer>

```



Now the library is developed recently and you may find some bugs, please report those and I will try fix theme asap. 
