import * as ReactNative from "react-native";
import { CSSStyle, CSSStyleSheetStyle } from "./CSSStyle";
type NamedStyles<T> = {
    [P in keyof T]: ReactNative.ViewStyle | ReactNative.TextStyle | ReactNative.ImageStyle | string | ((x: CSSStyleSheetStyle) => CSSStyle);
};
declare class NestedStyleSheet {
    static create<T extends NamedStyles<T> | NamedStyles<any>>(obj: T & NamedStyles<any>): {
        [key: string]: number;
    };
}
export default NestedStyleSheet;
