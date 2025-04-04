import * as React from "react";
import * as Native from "react-native";
import { GenericViewProps, GenericView, DomPath } from "../Typse";
import * as NativeSlider from '@miblanchard/react-native-slider';
export declare const CreateView: {
    <T extends object, P>(view: any, name?: string): GenericView<T, P> & ((props: GenericViewProps<T, P>) => DomPath<React.ReactElement<P>, P>);
    CssStyleAble: boolean;
};
export declare const View: Omit<Native.View, "props" | "ref"> & {
    props: GenericViewProps<Native.View, Native.ViewProps>;
} & ((props: GenericViewProps<Native.View, Native.ViewProps>) => DomPath<React.ReactElement<Native.ViewProps, string | React.JSXElementConstructor<any>>, Native.ViewProps>);
export declare const Slider: Omit<NativeSlider.Slider, "props" | "ref"> & {
    props: GenericViewProps<NativeSlider.Slider, NativeSlider.SliderProps>;
} & ((props: GenericViewProps<NativeSlider.Slider, NativeSlider.SliderProps>) => DomPath<React.ReactElement<NativeSlider.SliderProps, string | React.JSXElementConstructor<any>>, NativeSlider.SliderProps>);
export declare const SafeAreaView: Omit<Native.SafeAreaView, "props" | "ref"> & {
    props: GenericViewProps<Native.SafeAreaView, Native.ViewProps>;
} & ((props: GenericViewProps<Native.SafeAreaView, Native.ViewProps>) => DomPath<React.ReactElement<Native.ViewProps, string | React.JSXElementConstructor<any>>, Native.ViewProps>);
export declare const Text: Omit<Native.Text, "props" | "ref"> & {
    props: GenericViewProps<Native.Text, Native.TextProps>;
} & ((props: GenericViewProps<Native.Text, Native.TextProps>) => DomPath<React.ReactElement<Native.TextProps, string | React.JSXElementConstructor<any>>, Native.TextProps>);
export declare const TextInput: Omit<Native.TextInput, "props" | "ref"> & {
    props: GenericViewProps<Native.TextInput, Native.TextInputProps>;
} & ((props: GenericViewProps<Native.TextInput, Native.TextInputProps>) => DomPath<React.ReactElement<Native.TextInputProps, string | React.JSXElementConstructor<any>>, Native.TextInputProps>);
export declare const ScrollView: Omit<Native.ScrollView, "props" | "ref"> & {
    props: GenericViewProps<Native.ScrollView, Native.ScrollViewProps>;
} & ((props: GenericViewProps<Native.ScrollView, Native.ScrollViewProps>) => DomPath<React.ReactElement<Native.ScrollViewProps, string | React.JSXElementConstructor<any>>, Native.ScrollViewProps>);
export declare const FlatList: Omit<Native.FlatList<any>, "props" | "ref"> & {
    props: GenericViewProps<Native.FlatList<any>, Native.FlatListProps<any>>;
} & ((props: GenericViewProps<Native.FlatList<any>, Native.FlatListProps<any>>) => DomPath<React.ReactElement<Native.FlatListProps<any>, string | React.JSXElementConstructor<any>>, Native.FlatListProps<any>>);
export declare const TouchableOpacity: Omit<typeof Native.TouchableOpacity, "props" | "ref"> & {
    props: GenericViewProps<typeof Native.TouchableOpacity, Native.TouchableOpacityProps>;
} & ((props: GenericViewProps<typeof Native.TouchableOpacity, Native.TouchableOpacityProps>) => DomPath<React.ReactElement<Native.TouchableOpacityProps, string | React.JSXElementConstructor<any>>, Native.TouchableOpacityProps>);
export declare const TouchableWithoutFeedback: Omit<Native.TouchableWithoutFeedback, "props" | "ref"> & {
    props: GenericViewProps<Native.TouchableWithoutFeedback, Native.TouchableWithoutFeedbackProps>;
} & ((props: GenericViewProps<Native.TouchableWithoutFeedback, Native.TouchableWithoutFeedbackProps>) => DomPath<React.ReactElement<Native.TouchableWithoutFeedbackProps, string | React.JSXElementConstructor<any>>, Native.TouchableWithoutFeedbackProps>);
export declare const TouchableNativeFeedback: Omit<Native.TouchableNativeFeedback, "props" | "ref"> & {
    props: GenericViewProps<Native.TouchableNativeFeedback, Native.TouchableNativeFeedbackProps>;
} & ((props: GenericViewProps<Native.TouchableNativeFeedback, Native.TouchableNativeFeedbackProps>) => DomPath<React.ReactElement<Native.TouchableNativeFeedbackProps, string | React.JSXElementConstructor<any>>, Native.TouchableNativeFeedbackProps>);
export declare const Image: Omit<Native.Image, "props" | "ref"> & {
    props: GenericViewProps<Native.Image, Native.ImageProps>;
} & ((props: GenericViewProps<Native.Image, Native.ImageProps>) => DomPath<React.ReactElement<Native.ImageProps, string | React.JSXElementConstructor<any>>, Native.ImageProps>);
export declare const AnimatedView: Omit<Native.View, "props" | "ref"> & {
    props: GenericViewProps<Native.View, Native.ViewProps>;
} & ((props: GenericViewProps<Native.View, Native.ViewProps>) => DomPath<React.ReactElement<Native.ViewProps, string | React.JSXElementConstructor<any>>, Native.ViewProps>);
export declare const AnimatedText: Omit<Native.Text, "props" | "ref"> & {
    props: GenericViewProps<Native.Text, Native.TextProps>;
} & ((props: GenericViewProps<Native.Text, Native.TextProps>) => DomPath<React.ReactElement<Native.TextProps, string | React.JSXElementConstructor<any>>, Native.TextProps>);
export declare const AnimatedTouchableOpacity: Omit<typeof Native.TouchableOpacity, "props" | "ref"> & {
    props: GenericViewProps<typeof Native.TouchableOpacity, Native.TouchableOpacityProps>;
} & ((props: GenericViewProps<typeof Native.TouchableOpacity, Native.TouchableOpacityProps>) => DomPath<React.ReactElement<Native.TouchableOpacityProps, string | React.JSXElementConstructor<any>>, Native.TouchableOpacityProps>);
export declare const AnimatedScrollView: Omit<Native.ScrollView, "props" | "ref"> & {
    props: GenericViewProps<Native.ScrollView, Native.ScrollViewProps>;
} & ((props: GenericViewProps<Native.ScrollView, Native.ScrollViewProps>) => DomPath<React.ReactElement<Native.ScrollViewProps, string | React.JSXElementConstructor<any>>, Native.ScrollViewProps>);
