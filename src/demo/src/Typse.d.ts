import { TouchableOpacityProps, TextInputProps, TextProps, ColorValue, TextStyle, ViewStyle, OpaqueColorValue, ImageStyle, View, ViewProps } from "react-native";
import { NestedStyleSheet } from "./styles";
import * as React from "react";
import * as Icons from "@expo/vector-icons/build/createIconSet";

type TextCustomInputProps = StyledProps & TextInputProps & {
    mode: "Outlined" | "Flat" | "Normal"
}

export type ICSS = {
    props: string[]; // .button etc
}

type InternalStyledProps = StyledProps & {
    View: any;
    viewPath: string;
    fullParentPath?: string;
    classNames?: string[];
}

export type MouseProps = {
    onMouseEnter?: (event: any) => void;
    onMouseLeave?: (event: any) => void;
}

export type CSS_String = string;


export type GenericCSS<A, B = CSS_String, C = {}, D = {}, E = {}> = A | B | C | D | E;

export type StyledProps = {
    css?: CSS_String;
    ifTrue?: ((() => boolean) | boolean);
    style?: ViewStyle;
};

type IConType = "AntDesign" | "Entypo" | "EvilIcons" | "Feather" | "FontAwesome" | "FontAwesome5" | "FontAwesome6" | "Fontisto" | "Foundation" | "Ionicons" | "MaterialCommunityIcons" | "MaterialIcons" | "Octicons" | "SimpleLineIcons" | "Zocial";
export type IConProps = StyledProps & {
    name: string,
    type: IConType;
    color?: string | OpaqueColorValue;
    size?: number;
    borderRadius?: number;
    /**
     * Styles applied to the icon only
     * Good for setting margins or a different color.
     *
     * @default {marginRight: 10}
     */
    iconStyle?: TextStyle;

    /**
     * Style prop inherited from TextProps and TouchableWithoutFeedbackProperties
     * Only exist here so we can have ViewStyle or TextStyle
     *
     */
    style?: ViewStyle | TextStyle;
    /**
     * Background color of the button. Can be a string or OpaqueColorValue (returned from
     * PlatformColor(..))
     *
     * @default '#007AFF'
     */
    backgroundColor?: string | OpaqueColorValue;
}

export type ButtonProps = {
    text?: string;
    icon?: React.ReactNode;
    textCss?: string;
    disabled?: ((() => boolean) | boolean);
    whilePressed?: () => void;
    whilePressedDelay?: number;
} & StyledProps & Omit<TouchableOpacityProps, "children"> & MouseProps;

export type IThemeContext = {
    selectedIndex: number;
    themes: { [key: string]: number }[],
    defaultTheme: { [key: string]: number };
}

export type InternalThemeContext = {
    add: (id: string, element: React.ReactNode, isStattic?: boolean) => void;
    remove: (id: string) => void;
    totalItems: () => number;
    onItemsChange?: () => void;
    onStaticItemsChange?: () => void;
    items: () => { items: Map, staticItems: Map },
    containerSize: () => Size
}

export type ICSSContext = {
    parentKey: () => string;
    registerChild: (id: string, name: string) => { index: number, name: string };
    deleteChild: (id) => void;
    parentClassNames: (pk: string, name: string, elementPosition: { index: number, name: string }) => string;
}

export type Size = {
    height: number;
    width: number;
    fontScale?: number;
    scale?: number;
    y?: number;
    x?: number;
}

export type EventListener = {
    remove: () => void;
}

export type CssSize = "xs" | "sm" | "full";

export type GlobalState = {
    activePan: boolean;
    screen: Size;
    window: Size;
    appStart: () => EventListener[];
    alertViewData: {
        alert: (props: AlertViewProps | string) => void;
        confirm: (props: AlertViewProps | string) => Promise<boolean>;
        toast: (props: ToastProps | string) => void;
        data?: AlertViewFullProps;
        toastData?: ToastProps;
    }
}

type Percentage = `${number}%` | number

export type ModalProps = {
    isVisible: boolean;
    onHide: () => void;
    disableBlurClick?: boolean;
    children: React.ReactNode | React.ReactNode[];
    style?: ViewStyle;
    css?: string;
    speed?: number;
}

export type ActionSheetProps = ModalProps & {
    size: Percentage;
    lazyLoading?: boolean;
    position?: "Bottom" | "Top" | "Left" | "Right";
}


export type AlertViewAlertProps = {
    message: string;
    size?: CssSize;
    title?: string;
    okText?: string;
}

export type ToastProps = Omit<AlertViewAlertProps, "okText"> & {
    icon?: React.ReactNode,
    loader?: boolean;
    loaderBg?: ColorValue;
    position?: "Top" | "Bottom"
}

export type AlertViewProps = AlertViewAlertProps & {

    yesText?: string;
    cancelText?: string;

}


export type AlertViewFullProps = AlertViewProps & {
    callBack?: (answer: boolean) => void;
}


export type CheckBoxProps = StyledProps & {
    onChange?: (isChecked: boolean) => void;
    label?: string;
    checked: boolean;
    disabled?: boolean;
    selectionType?: "CheckBox" | "Radio" = "CheckBox";
    checkBoxType?: "CheckBox" | "RadioButton" | "Switch" = "CheckBox";
    swtichColor?: { false: ColorValue, true: ColorValue }
    labelPostion?: "Right" | "Left"

}

export type ICheckBox = <T>(props: T) => React.ReactNode;

export type CheckBoxListProps = {
    onChange: (checkBoxes: { checked: boolean, checkBoxIndex: number }[]) => void;
    label?: string;
    children: ICheckBox<Omit<CheckBoxProps, "selectionType" | "checkBoxType" | "onChange">> | ICheckBox<Omit<CheckBoxProps, "selectionType" | "checkBoxType" | "onChange">>[];
} & Omit<CheckBoxProps, "checked" | "onChange">

export type MenuIcon = {
    component: any;
    props?: any;
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type ProgressBarProps = StyledProps & {
    value: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1 | (number & {});
    color?: ColorValue;
    text?: string;
    speed?: number;
    children?: React.ReactNode;
}

let test: ProgressBarProps = {
    value: 500
}


export type MenuChildren = React.ReactNode & {
    props: TabItemProps
}

export type TabItemProps = StyledProps & {
    icon?: MenuIcon | IConProps;
    title?: string;
    children: React.ReactNode;
    onLoad?: () => void;
    head?: React.ReactNode;
    disableScrolling?: boolean;
}


export type TabBarProps = StyledProps & {
    children: MenuChildren | MenuChildren[];
    lazyLoading?: boolean;
    selectedTabIndex?: number;
    position?: "Top" | "Bottom";
    onTabChange?: (index: number) => void;
    disableScrolling?: boolean;
    header?: {
        style?: GenericCSS<ViewStyle, CSS_String>;
        selectedStyle?: GenericCSS<ViewStyle, CSS_String>;
        selectedTextStyle?: GenericCSS<TextStyle, CSS_String>;
        selectedIconStyle?: GenericCSS<ViewStyle, CSS_String, ImageStyle, TextStyle, ImageStyle>;
    }
}

export type FabProps = StyledProps & {
    position: "LeftTop" | "RightTop" | "LeftBottom" | "RightBottom";
    onVisible?: () => void;
    blureScreen?: boolean;
    onPress?: (index: number) => void;
    prefix: string | React.ReactNode;
    prefixContainerStyle?: ViewStyle;
    children: React.ReactNode | React.ReactNode[];
}

export type SliderProps = {
    /**
 * Initial value of the slider, or array of initial values for all thumbs.
 * The value should be between minimumValue
 * and maximumValue, which default to 0 and 1 respectively.
 * Default value is 0.
 *
 * *This is not a controlled component*, e.g. if you don't update
 * the value, the component won't be reset to its inital value.
 */
    value?: number | number[]

    lue?: number | number[]

    enableButtons: boolean;

    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled?: boolean

    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    minimumValue?: number

    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    maximumValue?: number

    /**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
    step?: number

    /**
     * The color used for the track to the left of the button. Overrides the
     * default blue gradient image.
     */
    minimumTrackTintColor?: string

    /**
     * The color used for the track to the right of the button. Overrides the
     * default blue gradient image.
     */
    maximumTrackTintColor?: string

    /**
     * The style applied to the track to the left of the button.
     */
    minimumTrackStyle?: StyleProp<ViewStyle>

    /**
     * The style applied to the track to the right of the button.
     */
    maximumTrackStyle?: StyleProp<ViewStyle>

    /**
     * The color used for the thumb.
     */
    thumbTintColor?: string

    /**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center has the visible thumb.
     * This allows to have a visually small thumb while still allowing the user
     * to move it easily.
     * The default is {width: 40, height: 40}.
     */
    thumbTouchSize?: { width: number; height: number }

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onValueChange: (value: number) => void

    /**
     * Callback called when the user starts changing the value (e.g. when
     * the slider is pressed).
     */
    onSlidingStart?: (value: number) => void

    /**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
    onSlidingComplete?: (value: number) => void

    /**
     * The style applied to the slider container.
     */
    style?: StyleProp<ViewStyle>

    /**
     * The style applied to the track.
     */
    trackStyle?: StyleProp<ViewStyle>

    /**
     * The style applied to the thumb.
     */
    thumbStyle?: StyleProp<ViewStyle> | StyleProp<ViewStyle>[]

    /**
     * Sets an element for the thumb.
     */
    thumbElement?: React.ReactNode | React.ReactNode[]

}
