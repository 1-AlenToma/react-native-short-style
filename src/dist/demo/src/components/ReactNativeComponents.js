import * as Native from "react-native";
import { Styleable } from "../styles";
import * as NativeSlider from '@miblanchard/react-native-slider';
const styledItems = {};
const AnimatedTouchable = Native.Animated.createAnimatedComponent(Native.TouchableOpacity);
export const CreateView = function (view, name) {
    var _a, _b;
    name = (_a = name !== null && name !== void 0 ? name : view.displayName) !== null && _a !== void 0 ? _a : view;
    let cacheName = (_b = view.displayName) !== null && _b !== void 0 ? _b : name;
    let View = styledItems[cacheName] ? styledItems[cacheName] : (styledItems[cacheName] = Styleable(view, name));
    return View;
};
// so we could know that this item was create by react-native-short-style
CreateView.prototype.CssStyleAble = CreateView.CssStyleAble = true;
export const View = CreateView(Native.View);
export const Slider = CreateView(NativeSlider.Slider, "Slider");
export const SafeAreaView = CreateView(Native.SafeAreaView);
export const Text = CreateView(Native.Text);
export const TextInput = CreateView(Native.TextInput);
export const ScrollView = CreateView(Native.ScrollView);
export const FlatList = CreateView(Native.FlatList, "FlatList");
export const TouchableOpacity = CreateView(Native.TouchableOpacity);
export const TouchableWithoutFeedback = CreateView(Native.TouchableOpacity);
export const TouchableNativeFeedback = CreateView(Native.TouchableOpacity);
export const Image = CreateView(Native.Image);
export const AnimatedView = CreateView(Native.Animated.View, "AnimatedView");
export const AnimatedText = CreateView(Native.Animated.Text, "AnimatedText");
export const AnimatedTouchableOpacity = CreateView(AnimatedTouchable, "AnimatedTouchableOpacity");
export const AnimatedScrollView = CreateView(Native.Animated.ScrollView, "AnimatedScrollView");
//# sourceMappingURL=ReactNativeComponents.js.map