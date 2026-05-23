import * as Native from "react-native";
import * as NativeSlider from '@miblanchard/react-native-slider';
import { CreateView } from "./helper";
const AnimatedTouchable = Native.Animated.createAnimatedComponent(Native.TouchableOpacity);
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
//# sourceMappingURL=ReactNativeComponents.js.map