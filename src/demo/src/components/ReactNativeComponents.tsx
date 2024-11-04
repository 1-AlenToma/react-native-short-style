import * as React from "react";
import * as Native from "react-native";
import { Styleable } from "../styles";
import { ViewProps, TextProps, ScrollViewProps, TouchableOpacityProps, ImageProps, TextInputProps, Animated } from "react-native/types";
import { MouseProps, StyledProps } from "../Typse";


const styledItems: any = {}

export const CreateView = function <T, P>(view: any, name?: string) {
    name = name ?? view.displayName ?? view;
    let cacheName = view.displayName ?? name;
    let View = styledItems[cacheName] ? styledItems[cacheName] : (styledItems[cacheName] = Styleable(view, name))
    return View as (props: P & StyledProps & { ref?: any }) => T & React.ReactNode;
}

// so we could know that this item was create by react-native-short-style
CreateView.prototype.CssStyleAble = CreateView.CssStyleAble = true;


export const View = CreateView<Native.View, ViewProps & MouseProps>(Native.View);
export const Text = CreateView<Native.Text, TextProps & MouseProps>(Native.Text);
export const TextInput = CreateView<Native.TextInput, Native.TextInputProps>(Native.TextInput);
export const ScrollView = CreateView<Native.ScrollView, ScrollViewProps>(Native.ScrollView);
export const TouchableOpacity = CreateView<Native.TouchableOpacity, TouchableOpacityProps & MouseProps>(Native.TouchableOpacity);
export const Image = CreateView<Native.Image, ImageProps>(Native.Image);
export const AnimatedView = CreateView<Native.View, ViewProps & MouseProps>(Native.Animated.View, "AnimatedView");
export const AnimatedText = CreateView<Native.Text, TextProps & MouseProps>(Native.Animated.Text, "AnimatedText");
export const AnimatedScrollView = CreateView<Native.ScrollView, ScrollViewProps>(Native.Animated.ScrollView, "AnimatedScrollView");
