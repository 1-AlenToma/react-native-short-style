import { AlertViewAlertProps, AlertViewProps, IThemeContext, ToastProps } from "../Typse";
import React from "react";
export declare const RemoveProps: <T extends object>(props: T, ...items: (keyof T)[]) => T;
export declare const readAble: (nr: number | string, total?: number) => string | number;
export declare const optionalStyle: (style: any) => {
    c: string;
    o: any;
};
export declare const renderCss: (css: string, style: any) => object & {
    _props: any;
};
export declare const currentTheme: (context: IThemeContext) => any;
export declare const clearAllCss: () => void;
export declare const themeStyle: () => any;
export declare const ifSelector: (item?: boolean | Function) => boolean | Function;
export declare const proc: (partialValue: any, totalValue: any) => number;
export declare class AlertDialog {
    static alert(props: AlertViewAlertProps | string): void;
    static toast(props: ToastProps | string): void;
    static confirm(props: AlertViewProps | string): Promise<boolean>;
}
export declare const setRef: (ref: any, item: any) => void;
export declare const refCreator: <T>(forwardRef: (props: any, ref: any) => React.ReactNode, name: string, view: any) => T;
