import { TouchableOpacityProps, TextProps, ColorValue, TextStyle, ViewStyle, OpaqueColorValue } from "react-native";
import { NestedStyleSheet } from "./styles";
import * as React from "react";
import * as Icons from "@expo/vector-icons/build/createIconSet";

export type ICSS = {
    props: string[]; // .button etc
}

export type StyledProps = {
    css?: string;
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
    text: string;
    icon?: React.ReactNode;
    textCss?: string;
    disabled?: ((() => boolean) | boolean);
} & StyledProps & TouchableOpacityProps

export type IThemeContext = {
    selectedIndex: number;
    themes: { [key: string]: number }[],
    defaultTheme: { [key: string]: number };
}

export type InternalThemeContext = {
    add: (id: string, element: React.ReactNode) => void;
    remove: (id: string) => void;
    totalItems: () => number;
    onChange?: () => void;
    items: () => Map,
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
}

export type EventListener = {
    remove: () => void;
}

export type CssSize = "xs" | "sm" | "full";

export type GlobalState = {
    screen: Size;
    window: Size;
    appStart: () => EventListener[];
    alertViewData: {
        alert: (props: AlertViewProps) => void;
        confirm: (props: AlertViewProps) => Promise<boolean>;
        data?: AlertViewFullProps;
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
    height: Percentage;
    lazyLoading?: boolean;
}


export type AlertViewAlertProps = {
    message: string;
    size?: CssSize;
    title?: string;
    okText?: string;
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
