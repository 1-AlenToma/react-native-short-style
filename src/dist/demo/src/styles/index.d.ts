import cssTranslator from "./cssTranslator";
import NestedStyleSheet from "./NestedStyleSheet";
import { StyledProps } from "../Typse";
declare const Styleable: <T>(View: T, identifier: string) => T & StyledProps;
export { Styleable, NestedStyleSheet, cssTranslator };
export * from "./CSSStyle";
