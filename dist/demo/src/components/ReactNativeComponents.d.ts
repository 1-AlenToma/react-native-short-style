import * as React from "react";
import * as Native from "react-native";
import { GenericViewProps, GenericView } from "../Typse";
import * as NativeSlider from '@miblanchard/react-native-slider';
export declare const CreateView: {
    <T extends object, P>(view: any, name?: string): GenericView<T, P> & ((props: GenericViewProps<T, P>) => React.ReactElement<P>);
    CssStyleAble: boolean;
};
export declare const View: Omit<Native.View, "props" | "ref"> & {
    props: GenericViewProps<Native.View, Native.ViewProps>;
} & ((props: GenericViewProps<Native.View, Native.ViewProps>) => React.ReactElement<Native.ViewProps, string | React.JSXElementConstructor<any>>);
export declare const Slider: Omit<NativeSlider.Slider, "props" | "ref"> & {
    props: GenericViewProps<NativeSlider.Slider, NativeSlider.SliderProps>;
} & ((props: GenericViewProps<NativeSlider.Slider, NativeSlider.SliderProps>) => React.ReactElement<NativeSlider.SliderProps, string | React.JSXElementConstructor<any>>);
export declare const SafeAreaView: Omit<Native.SafeAreaView, "props" | "ref"> & {
    props: GenericViewProps<Native.SafeAreaView, Native.ViewProps>;
} & ((props: GenericViewProps<Native.SafeAreaView, Native.ViewProps>) => React.ReactElement<Native.ViewProps, string | React.JSXElementConstructor<any>>);
export declare const Text: Omit<Native.Text, "props" | "ref"> & {
    props: GenericViewProps<Native.Text, Native.TextProps>;
} & ((props: GenericViewProps<Native.Text, Native.TextProps>) => React.ReactElement<Native.TextProps, string | React.JSXElementConstructor<any>>);
export declare const TextInput: Omit<Native.TextInput, "props" | "ref"> & {
    props: GenericViewProps<Native.TextInput, Native.TextInputProps>;
} & ((props: GenericViewProps<Native.TextInput, Native.TextInputProps>) => React.ReactElement<Native.TextInputProps, string | React.JSXElementConstructor<any>>);
export declare const ScrollView: Omit<Native.ScrollView, "props" | "ref"> & {
    props: GenericViewProps<Native.ScrollView, Native.ScrollViewProps>;
} & ((props: GenericViewProps<Native.ScrollView, Native.ScrollViewProps>) => React.ReactElement<Native.ScrollViewProps, string | React.JSXElementConstructor<any>>);
export declare const FlatList: Omit<Native.FlatList<any>, "props" | "ref"> & {
    props: GenericViewProps<Native.FlatList<any>, Native.FlatListProps<any>>;
} & ((props: GenericViewProps<Native.FlatList<any>, Native.FlatListProps<any>>) => React.ReactElement<Native.FlatListProps<any>, string | React.JSXElementConstructor<any>>);
export declare const TouchableOpacity: Omit<React.ForwardRefExoticComponent<Native.TouchableOpacityProps & React.RefAttributes<Native.View>>, "props" | "ref"> & {
    props: GenericViewProps<React.ForwardRefExoticComponent<Native.TouchableOpacityProps & React.RefAttributes<Native.View>>, Native.TouchableOpacityProps>;
} & ((props: GenericViewProps<React.ForwardRefExoticComponent<Native.TouchableOpacityProps & React.RefAttributes<Native.View>>, Native.TouchableOpacityProps>) => React.ReactElement<Native.TouchableOpacityProps, string | React.JSXElementConstructor<any>>);
export declare const TouchableWithoutFeedback: Omit<Native.TouchableWithoutFeedback, "props" | "ref"> & {
    props: GenericViewProps<Native.TouchableWithoutFeedback, Native.TouchableWithoutFeedbackProps>;
} & ((props: GenericViewProps<Native.TouchableWithoutFeedback, Native.TouchableWithoutFeedbackProps>) => React.ReactElement<Native.TouchableWithoutFeedbackProps, string | React.JSXElementConstructor<any>>);
export declare const TouchableNativeFeedback: Omit<Native.TouchableNativeFeedback, "props" | "ref"> & {
    props: GenericViewProps<Native.TouchableNativeFeedback, Native.TouchableNativeFeedbackProps>;
} & ((props: GenericViewProps<Native.TouchableNativeFeedback, Native.TouchableNativeFeedbackProps>) => React.ReactElement<Native.TouchableNativeFeedbackProps, string | React.JSXElementConstructor<any>>);
export declare const Image: Omit<Native.Image, "props" | "ref"> & {
    props: GenericViewProps<Native.Image, Native.ImageProps>;
} & ((props: GenericViewProps<Native.Image, Native.ImageProps>) => React.ReactElement<Native.ImageProps, string | React.JSXElementConstructor<any>>);
export declare const AnimatedView: Omit<Native.View, "props" | "ref"> & {
    props: GenericViewProps<Native.View, Native.ViewProps>;
} & ((props: GenericViewProps<Native.View, Native.ViewProps>) => React.ReactElement<Native.ViewProps, string | React.JSXElementConstructor<any>>);
export declare const AnimatedText: Omit<Native.Text, "props" | "ref"> & {
    props: GenericViewProps<Native.Text, Native.TextProps>;
} & ((props: GenericViewProps<Native.Text, Native.TextProps>) => React.ReactElement<Native.TextProps, string | React.JSXElementConstructor<any>>);
export declare const AnimatedTouchableOpacity: Omit<React.ForwardRefExoticComponent<Native.TouchableOpacityProps & React.RefAttributes<Native.View>>, "props" | "ref"> & {
    props: GenericViewProps<React.ForwardRefExoticComponent<Native.TouchableOpacityProps & React.RefAttributes<Native.View>>, Native.TouchableOpacityProps>;
} & ((props: GenericViewProps<React.ForwardRefExoticComponent<Native.TouchableOpacityProps & React.RefAttributes<Native.View>>, Native.TouchableOpacityProps>) => React.ReactElement<Native.TouchableOpacityProps, string | React.JSXElementConstructor<any>>);
export declare const AnimatedScrollView: Omit<Native.ScrollView, "props" | "ref"> & {
    props: GenericViewProps<Native.ScrollView, Native.ScrollViewProps>;
} & ((props: GenericViewProps<Native.ScrollView, Native.ScrollViewProps>) => React.ReactElement<Native.ScrollViewProps, string | React.JSXElementConstructor<any>>);
