# react-native-short-style
`react-native-short-style` is developed for lazy developers, that is me.

No joks around, `react-native-short-style` will make your styling of your components much easier.

You dont need to import styles in every file and your are also able to have nested styles that automatcly gets applyied to your children. 

so like css `view text` will be applied without doing it your self all the time.

# App using `react-native-short-style`
[Novelo](https://github.com/1-AlenToma/Novelo)

here is how it look like
![screenshot](https://raw.githubusercontent.com/1-AlenToma/react-native-short-style/main/src/screenshot/image.png)

additinally you could also simplify your styles like instead of background, simple do `bac-red box fl-1 op:0.5` and so on, box is a class that exist in your stylesheet.

If you see below, you also have predefines components like `Modal`, `ActionSheets`, `Tabs` and `AlertDialog` etc that you could use. See `demo` for more info

here is a simple code that shows how it works.


And now simple use your components
in addition to all the `View` props,
you can also use css.
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
    Icon: x => x.props({ refererId: "iconHandler" }).co(".co-light"),
    header: "bac:red"
  })
]

export default function App() {
  const state = buildState({
    id: newId(),
    selectedTheme: 0,
  }).build();

  let el = useRef<DomPath<typeof View, any> | undefined>()

  useEffect(() => {
    if (el.current) {
      // you are also able to search recrusivly throw element event in react-native android, IOS,Web and windows.
      console.warn("Found item", el.current.querySelectorAll<typeof Text>(".button #txt, #txt2[someattr*='kas']"))
    }
  }, [el.current])
  return (
    <ThemeContainer icons={icons} referers={[{
      id: "iconHandler",
      func: (props: any) => {
        return props;
        // edit the props look up at Icon refererId
        props.ifTrue = true;
        return props;
      }
    }]} selectedIndex={state.selectedTheme} themes={themes} defaultTheme={GlobalStyles}>

     <View css="button bac-red fld-column" ref={el}>
        <View css={x => x.cls("button").baC(".co-blue100")}>
          <Text id='txt'>test</Text>
          <Text id='txt'>test</Text>
          <Text id='txt2' css="tea-center bac-red wi-100%" someattr="kaskdj">test2</Text>
        </View>
      </View>
    </ThemeContainer >
  );
}

```
## possible style overview 
```js
const userStyle = NestedStyleSheet.create({
    header: "bac-#292e34",
    header$Text: x => x.foS(".fos-lg").co(".co-light").foW("bold"),
    headerLine: "bac-inherit _abc wi-90% fl-0 flg-1 pa-5 _center to--10 zi-1",
    headerLine$View: "ali-center",
    headerLine$View$Text: x => x.foS(".fos-lg").foW("bold"),
    disabled: x => x.op(.8).baC(".co-gray400"),
    selectedValue: x => x.baC("#007fff").co("#FFFFFF"),
    alertViewButtonContainer: "fld:row ali:center mah-40 wi-100% fl-1 po-relative to-5",
    alertViewButtonContainer$TouchableOpacity: "fl-1 he-100% _center bor-0 !important",
    alertViewButtonContainer$TouchableOpacity$Text: "tea-center fos-12 fow-bold",
    scrollMenuItem$View: x => x.fl(1)
})

```


Now the library is developed recently and you may find some bugs, please report those and I will try fix theme asap. 
