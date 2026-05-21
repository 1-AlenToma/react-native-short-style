import { CSSProps } from "./CSSStyle";
import NestedStyleSheet from "./NestedStyleSheet";
import cssTranslator from "./cssTranslator";
export declare class CMBuilder {
    __name: string;
    __View: any;
    constructor(name: string, view: any);
    setRef(cRef: any, c: any, currentRef: {
        current: any;
    }): void;
    fn(): unknown;
    compaire(prev: any, next: any): boolean;
    render({ children, variant, style, css, ifTrue, noneDevtools, ...props }: CSSProps<any>, ref: any): import("react/jsx-runtime").JSX.Element;
}
export { NestedStyleSheet, cssTranslator };
