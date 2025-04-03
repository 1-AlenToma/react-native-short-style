export declare const serilizeCssStyle: (style: any) => any;
export declare const clearCss: (id: string) => void;
export declare const clearAll: () => void;
declare const css_translator: (css?: string, styleFile?: any, propStyle?: any, id?: string) => object & {
    _props: any;
};
export default css_translator;
