import cssTranslator from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
export declare type Styled = {
    css?: string;
};
declare const Styleable: <T>(View: T, identifier: string, styleFile: any) => any;
export { Styleable, NestedStyleSheet, cssTranslator };
