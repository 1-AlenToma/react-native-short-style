import { CSSProps } from "./CSSStyle";
import NestedStyleSheet from "./NestedStyleSheet";
import cssTranslator from "./cssTranslator";
export declare class CMBuilder {
    __name: string;
    __View: any;
    myRef: any;
    constructor(name: string, view: any);
    setRef(cRef: any, c: any): void;
    fn(): unknown;
    renderFirst(props: CSSProps<any>, ref: any): import("react/jsx-runtime").JSX.Element;
    render({ children, variant, cRef, ...props }: CSSProps<any>): import("react/jsx-runtime").JSX.Element;
}
export { NestedStyleSheet, cssTranslator };
