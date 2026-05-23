import * as Native from "react-native";
import * as NativeSlider from '@miblanchard/react-native-slider';
import { CreateViewWithMem } from "./helper";
const AnimatedTouchable = Native.Animated.createAnimatedComponent(Native.TouchableOpacity);
export const View = CreateViewWithMem(Native.View);
export const Slider = CreateViewWithMem(NativeSlider.Slider, "Slider");
export const Text = CreateViewWithMem(Native.Text, "Text");
export const TextInput = CreateViewWithMem(Native.TextInput, "TextInput");
export const ScrollView = CreateViewWithMem(Native.ScrollView);
export const FlatList = CreateViewWithMem(Native.FlatList, "FlatList");
export const TouchableOpacity = CreateViewWithMem(Native.TouchableOpacity);
export const TouchableWithoutFeedback = CreateViewWithMem(Native.TouchableOpacity);
export const TouchableNativeFeedback = CreateViewWithMem(Native.TouchableOpacity);
export const Image = CreateViewWithMem(Native.Image);
export const AnimatedView = CreateViewWithMem(Native.Animated.View, "AnimatedView");
export const AnimatedText = CreateViewWithMem(Native.Animated.Text, "AnimatedText");
export const AnimatedTouchableOpacity = CreateViewWithMem(AnimatedTouchable, "AnimatedTouchableOpacity");
export const AnimatedScrollView = CreateViewWithMem(Native.Animated.ScrollView, "AnimatedScrollView");
//# sourceMappingURL=ReactNativeComponentsMems.js.map