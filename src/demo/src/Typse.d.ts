import { TouchableOpacityProps, TextInputProps, TextProps, ColorValue, TextStyle, ViewStyle, OpaqueColorValue, ImageStyle, View, ViewProps, ActivityIndicatorProps } from "react-native";
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
    type?: "Warning" | "Error" | "Info" | "Success"
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

export type DropdownItem = {
    label: string;
    value: any;
}

export type DropdownRefItem = {
    open: () => void;
    close: () => void;
    selectedValue?: void;
}

export type DropdownListProps = StyledProps & {
    items: DropdownItem[],
    render?: (item: DropdownItem) => React.ReactNode;
    onSelect?: (item: DropdownItem) => void;
    selectedValue?: any;
    mode?: "Modal" | "ActionSheet",
    placeHolder?: string;
    selectedItemCss?: string;
    size?: Percentage;
    enableSearch?: boolean;
    textInputPlaceHolder?: string;
}

export type CollabseProps = StyledProps & {
    defaultActive?: boolean;
    text?: string | React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export type LoaderRef = {
    loading: (value: boolean) => void;
}

export type LoaderProps = Omit<ActivityIndicatorProps, "animating" | "hidesWhenStopped"> & {
    loading: boolean;
    text?: string | React.ReactNode;
    children: React.ReactNode | React.ReactNode[];
}