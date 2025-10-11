export declare const serilizeCssStyle: (style: any) => {};
export declare const clearCss: (id: string) => void;
export declare const clearAll: () => void;
declare const css_translator: (css?: string, styleFile?: any, id?: string) => object & {
    _props: any;
    important?: any;
};
export default css_translator;
