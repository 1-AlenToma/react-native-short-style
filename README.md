# react-native-short-style
`react-native-short-style` is developed for lazy developers, that is me.

No joks around, `react-native-short-style` will make your styling of your components much easier.

You dont need to import styles in every file and your are also able to have nested styles that automatcly gets applyied to your children. 

so like css `view text` will be applied without doing it your self all the time.

here is how it look like
![screenshot](https://raw.githubusercontent.com/1-AlenToma/react-native-short-style/main/screenshot/image.png)

additinally you could also simplify your styles like instead of background, simple do `bac:red box flex:1 op:0.5` and so on, box is a class that exist in your stylesheet.

here is a simple code that shows how it works.

```ts
import {
  Styleable,
  NestedStyleSheet
} from "react-native-short-style";
// now create your style or import.
// You can still use Stylesheet if you want
const styles = NestedStyleSheet.create({
  // this is a default style for View.Text
  "View.Text":{
     backgroundColor:"#fff"
   }
   // see here is the nested design for container
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    $Text: {
      $Text: {
        color: "red",
        $Text: {
          color: "black"
        }
      },
      color: "green"
    }
  },
  // this is a short cuts css
  // you can also write the whole word
  // or simple refer to other classes like container
  //the rules for shortcut is to take the first
  // tow chars [1,2] + all uppercase char
  // so `backgroundColor` will have a shortcut `bac` and so on.
  box: "bor:4 wi:80% pa:5 juc:center ali:center boc:#000 bow:1 hi:40 bac:red minHeight:10",
  //and here insted of adding a nested class simple add its path and the lib will find it.
  "box.Text": {
    color: "#fff"
  }
});

```
Now apply the lib to your components.
see below string `"View"` and `"Text"`
those will be the default style name in your stylesheet as i showed above.
```ts
import {
  Text,
  View
} from "react-native";

const StyledView = Styleable(
  View,
  "View",
  styles
);
const StyledText = Styleable(
  Text,
  "Text",
  styles
);

```

And now simple use your components
in addition to all the `View` props,
you can also use css.
this code is for the above image.
```tsx

    <StyledView css="container">
      <StyledText>
        green
        <StyledText>
          {" "}
          red
          <StyledText css="fos:70 fow:bold">
            {" "}
            black
          </StyledText>
        </StyledText>
      </StyledText>
      <StyledView css="box hi:50">
        <StyledText>
          this box created by css shortcut
        </StyledText>
      </StyledView>
      <StatusBar style="auto" />
    </StyledView>
```
Now the library is developed recently and you may find some bugs, please report those and I will try fix theme asap. 
