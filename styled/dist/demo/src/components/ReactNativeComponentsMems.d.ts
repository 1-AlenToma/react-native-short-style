import * as Native from "react-native";
import { ViewProps, TextProps, ScrollViewProps, TouchableOpacityProps, ImageProps, FlatListProps } from "react-native/types";
import * as NativeSlider from '@miblanchard/react-native-slider';
export declare const View: Omit<Native.View, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.View, ViewProps>;
} & ((props: import("..").GenericViewProps<Native.View, Omit<ViewProps, "style">>) => import("react").ReactElement<ViewProps, string | import("react").JSXElementConstructor<any>>);
export declare const Slider: Omit<NativeSlider.Slider, "props" | "ref"> & {
    props: import("..").GenericViewProps<NativeSlider.Slider, NativeSlider.SliderProps>;
} & ((props: import("..").GenericViewProps<NativeSlider.Slider, Omit<NativeSlider.SliderProps, "style">>) => import("react").ReactElement<NativeSlider.SliderProps, string | import("react").JSXElementConstructor<any>>);
export declare const Text: Omit<Native.Text, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.Text, TextProps>;
} & ((props: import("..").GenericViewProps<Native.Text, Omit<TextProps, "style">>) => import("react").ReactElement<TextProps, string | import("react").JSXElementConstructor<any>>);
export declare const TextInput: Omit<Native.TextInput, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.TextInput, Native.TextInputProps>;
} & ((props: import("..").GenericViewProps<Native.TextInput, Omit<Native.TextInputProps, "style">>) => import("react").ReactElement<Native.TextInputProps, string | import("react").JSXElementConstructor<any>>);
export declare const ScrollView: Omit<Native.ScrollView, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.ScrollView, ScrollViewProps>;
} & ((props: import("..").GenericViewProps<Native.ScrollView, Omit<ScrollViewProps, "style">>) => import("react").ReactElement<ScrollViewProps, string | import("react").JSXElementConstructor<any>>);
export declare const FlatList: Omit<Native.FlatList<any>, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.FlatList<any>, FlatListProps<any>>;
} & ((props: import("..").GenericViewProps<Native.FlatList<any>, Omit<FlatListProps<any>, "style">>) => import("react").ReactElement<FlatListProps<any>, string | import("react").JSXElementConstructor<any>>);
export declare const TouchableOpacity: Omit<import("react").ForwardRefExoticComponent<Native.TouchableOpacityProps & import("react").RefAttributes<Native.View>>, "props" | "ref"> & {
    props: import("..").GenericViewProps<import("react").ForwardRefExoticComponent<Native.TouchableOpacityProps & import("react").RefAttributes<Native.View>>, TouchableOpacityProps>;
} & ((props: import("..").GenericViewProps<import("react").ForwardRefExoticComponent<Native.TouchableOpacityProps & import("react").RefAttributes<Native.View>>, Omit<TouchableOpacityProps, "style">>) => import("react").ReactElement<TouchableOpacityProps, string | import("react").JSXElementConstructor<any>>);
export declare const TouchableWithoutFeedback: Omit<Native.TouchableWithoutFeedback, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.TouchableWithoutFeedback, Native.TouchableWithoutFeedbackProps>;
} & ((props: import("..").GenericViewProps<Native.TouchableWithoutFeedback, Omit<Native.TouchableWithoutFeedbackProps, "style">>) => import("react").ReactElement<Native.TouchableWithoutFeedbackProps, string | import("react").JSXElementConstructor<any>>);
export declare const TouchableNativeFeedback: Omit<Native.TouchableNativeFeedback, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.TouchableNativeFeedback, Native.TouchableNativeFeedbackProps>;
} & ((props: import("..").GenericViewProps<Native.TouchableNativeFeedback, Omit<Native.TouchableNativeFeedbackProps, "style">>) => import("react").ReactElement<Native.TouchableNativeFeedbackProps, string | import("react").JSXElementConstructor<any>>);
export declare const Image: Omit<Native.Image, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.Image, ImageProps>;
} & ((props: import("..").GenericViewProps<Native.Image, Omit<ImageProps, "style">>) => import("react").ReactElement<ImageProps, string | import("react").JSXElementConstructor<any>>);
export declare const AnimatedView: Omit<Native.View, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.View, ViewProps>;
} & ((props: import("..").GenericViewProps<Native.View, Omit<ViewProps, "style">>) => import("react").ReactElement<ViewProps, string | import("react").JSXElementConstructor<any>>);
export declare const AnimatedText: Omit<Native.Text, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.Text, TextProps>;
} & ((props: import("..").GenericViewProps<Native.Text, Omit<TextProps, "style">>) => import("react").ReactElement<TextProps, string | import("react").JSXElementConstructor<any>>);
export declare const AnimatedTouchableOpacity: Omit<import("react").ForwardRefExoticComponent<Native.TouchableOpacityProps & import("react").RefAttributes<Native.View>>, "props" | "ref"> & {
    props: import("..").GenericViewProps<import("react").ForwardRefExoticComponent<Native.TouchableOpacityProps & import("react").RefAttributes<Native.View>>, TouchableOpacityProps>;
} & ((props: import("..").GenericViewProps<import("react").ForwardRefExoticComponent<Native.TouchableOpacityProps & import("react").RefAttributes<Native.View>>, Omit<TouchableOpacityProps, "style">>) => import("react").ReactElement<TouchableOpacityProps, string | import("react").JSXElementConstructor<any>>);
export declare const AnimatedScrollView: Omit<Native.ScrollView, "props" | "ref"> & {
    props: import("..").GenericViewProps<Native.ScrollView, ScrollViewProps>;
} & ((props: import("..").GenericViewProps<Native.ScrollView, Omit<ScrollViewProps, "style">>) => import("react").ReactElement<ScrollViewProps, string | import("react").JSXElementConstructor<any>>);
