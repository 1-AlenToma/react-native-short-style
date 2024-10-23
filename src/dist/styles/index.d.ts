import cssTranslator from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
export type Styled = {
    css?: string;
    ifTrue?: (() => boolean | boolean);
};
declare const Styleable: <T>(View: T, styleFile: any, identifier?: string) => T & Styled;
export { Styleable, NestedStyleSheet, cssTranslator };
