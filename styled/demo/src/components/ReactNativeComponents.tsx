import * as React from "react";
import * as Native from "react-native";
import { CMBuilder } from "../styles";
import { ViewProps, TextProps, ScrollViewProps, TouchableOpacityProps, ImageProps, FlatListProps } from "react-native/types";
import { GenericViewProps, GenericView } from "../Typse";
import * as NativeSlider from '@miblanchard/react-native-slider';


const styledItems: any = {}
const AnimatedTouchable = Native.Animated.createAnimatedComponent(Native.TouchableOpacity);
export const CreateView = function <T extends object, P>(view: any, name?: string, override?: boolean, useMem?: boolean) {
    name = name ?? view.displayName ?? view;
    let cacheName = (override ? name : view.displayName ?? name) + (useMem == true ? "true" : "");
    let View = styledItems[cacheName] ? styledItems[cacheName] : (styledItems[cacheName] = new CMBuilder(name, view)).fn(useMem ?? false);
    View.displayName = `Styled(${name ?? cacheName})`;
    return View as any as GenericView<T, P> & ((props: GenericViewProps<T, Omit<P, "style">>) => React.ReactElement<P>);
}

export const CreateViewWithMem = function <T extends object, P>(view: any, name?: string, override?: boolean) {
    return CreateView<T, P>(view, name, override, true);
}



// so we could know that this item was create by react-native-short-style
CreateView.prototype.CssStyleAble = CreateView.CssStyleAble = true;

export const View = CreateView<Native.View, ViewProps>(Native.View);
export const Slider = CreateView<NativeSlider.Slider, NativeSlider.SliderProps>(NativeSlider.Slider, "Slider");
export const Text = CreateView<Native.Text, TextProps>(Native.Text, "Text");
export const TextInput = CreateView<Native.TextInput, Native.TextInputProps>(Native.TextInput, "TextInput");
export const ScrollView = CreateView<Native.ScrollView, ScrollViewProps>(Native.ScrollView);
export const FlatList = CreateView<Native.FlatList, FlatListProps<any>>(Native.FlatList, "FlatList");
export const TouchableOpacity = CreateView<typeof Native.TouchableOpacity, TouchableOpacityProps>(Native.TouchableOpacity);
export const TouchableWithoutFeedback = CreateView<Native.TouchableWithoutFeedback, Native.TouchableWithoutFeedbackProps>(Native.TouchableOpacity);
export const TouchableNativeFeedback = CreateView<Native.TouchableNativeFeedback, Native.TouchableNativeFeedbackProps>(Native.TouchableOpacity);
export const Image = CreateView<Native.Image, ImageProps>(Native.Image);
export const AnimatedView = CreateView<Native.View, ViewProps>(Native.Animated.View, "AnimatedView");
export const AnimatedText = CreateView<Native.Text, TextProps>(Native.Animated.Text, "AnimatedText");
export const AnimatedTouchableOpacity = CreateView<typeof Native.TouchableOpacity, TouchableOpacityProps>(AnimatedTouchable, "AnimatedTouchableOpacity");
export const AnimatedScrollView = CreateView<Native.ScrollView, ScrollViewProps>(Native.Animated.ScrollView, "AnimatedScrollView");

export const ViewMem = CreateViewWithMem<Native.View, ViewProps>(Native.View);
export const SliderMem = CreateViewWithMem<NativeSlider.Slider, NativeSlider.SliderProps>(NativeSlider.Slider, "Slider");
export const TextMem = CreateViewWithMem<Native.Text, TextProps>(Native.Text, "Text");
export const TextInputMem = CreateViewWithMem<Native.TextInput, Native.TextInputProps>(Native.TextInput, "TextInput");
export const ScrollViewMem = CreateViewWithMem<Native.ScrollView, ScrollViewProps>(Native.ScrollView);
export const FlatListMem = CreateViewWithMem<Native.FlatList, FlatListProps<any>>(Native.FlatList, "FlatList");
export const TouchableOpacityMem = CreateViewWithMem<typeof Native.TouchableOpacity, TouchableOpacityProps>(Native.TouchableOpacity);
export const TouchableWithoutFeedbackMem = CreateViewWithMem<Native.TouchableWithoutFeedback, Native.TouchableWithoutFeedbackProps>(Native.TouchableOpacity);
export const TouchableNativeFeedbackMem = CreateViewWithMem<Native.TouchableNativeFeedback, Native.TouchableNativeFeedbackProps>(Native.TouchableOpacity);
export const ImageMem = CreateViewWithMem<Native.Image, ImageProps>(Native.Image);
export const AnimatedViewMem = CreateViewWithMem<Native.View, ViewProps>(Native.Animated.View, "AnimatedView");
export const AnimatedTextMem = CreateViewWithMem<Native.Text, TextProps>(Native.Animated.Text, "AnimatedText");
export const AnimatedTouchableOpacityMem = CreateViewWithMem<typeof Native.TouchableOpacity, TouchableOpacityProps>(AnimatedTouchable, "AnimatedTouchableOpacity");
export const AnimatedScrollViewMem = CreateViewWithMem<Native.ScrollView, ScrollViewProps>(Native.Animated.ScrollView, "AnimatedScrollView");