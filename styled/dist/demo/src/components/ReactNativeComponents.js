import * as Native from "react-native";
import { CMBuilder } from "../styles";
import * as NativeSlider from '@miblanchard/react-native-slider';
const styledItems = {};
const AnimatedTouchable = Native.Animated.createAnimatedComponent(Native.TouchableOpacity);
export const CreateView = function (view, name, override, useMem) {
    var _a, _b;
    name = (_a = name !== null && name !== void 0 ? name : view.displayName) !== null && _a !== void 0 ? _a : view;
    let cacheName = (override ? name : (_b = view.displayName) !== null && _b !== void 0 ? _b : name) + (useMem == true ? "true" : "");
    let View = styledItems[cacheName] ? styledItems[cacheName] : (styledItems[cacheName] = new CMBuilder(name, view)).fn(useMem !== null && useMem !== void 0 ? useMem : false);
    View.displayName = `Styled(${name !== null && name !== void 0 ? name : cacheName})`;
    return View;
};
export const CreateViewWithMem = function (view, name, override) {
    return CreateView(view, name, override, true);
};
// so we could know that this item was create by react-native-short-style
CreateView.prototype.CssStyleAble = CreateView.CssStyleAble = true;
export const View = CreateView(Native.View);
export const Slider = CreateView(NativeSlider.Slider, "Slider");
export const Text = CreateView(Native.Text, "Text");
export const TextInput = CreateView(Native.TextInput, "TextInput");
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
export const ViewMem = CreateViewWithMem(Native.View);
export const SliderMem = CreateViewWithMem(NativeSlider.Slider, "Slider");
export const TextMem = CreateViewWithMem(Native.Text, "Text");
export const TextInputMem = CreateViewWithMem(Native.TextInput, "TextInput");
export const ScrollViewMem = CreateViewWithMem(Native.ScrollView);
export const FlatListMem = CreateViewWithMem(Native.FlatList, "FlatList");
export const TouchableOpacityMem = CreateViewWithMem(Native.TouchableOpacity);
export const TouchableWithoutFeedbackMem = CreateViewWithMem(Native.TouchableOpacity);
export const TouchableNativeFeedbackMem = CreateViewWithMem(Native.TouchableOpacity);
export const ImageMem = CreateViewWithMem(Native.Image);
export const AnimatedViewMem = CreateViewWithMem(Native.Animated.View, "AnimatedView");
export const AnimatedTextMem = CreateViewWithMem(Native.Animated.Text, "AnimatedText");
export const AnimatedTouchableOpacityMem = CreateViewWithMem(AnimatedTouchable, "AnimatedTouchableOpacity");
export const AnimatedScrollViewMem = CreateViewWithMem(Native.Animated.ScrollView, "AnimatedScrollView");
//# sourceMappingURL=ReactNativeComponents.js.map