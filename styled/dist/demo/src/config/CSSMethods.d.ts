export declare const flatStyle: (style: any) => any;
export declare const removeProps: (item: any, ...props: string[]) => any;
export declare const hasString: (a: string, b: string) => boolean;
export declare const eqString: (a: string, b: string) => boolean;
export declare const parseKeys: (key: string) => string[];
export declare const extractProps: (css?: string) => {
    css: string;
    _hasValue: boolean;
};
export declare const newId: (inc?: string) => string;
export declare const ValueIdentity: {
    chars: readonly [":", "-"];
    has: (value: any) => "" | ":" | "-";
    isClass: (value: any) => boolean;
    keyValue: (value: string) => {
        key: string;
        value: string;
        kvalue: string;
        isClassName: boolean;
        important: boolean;
    };
    cleanCss: (css: string) => string;
    splitCss: (css: string) => any;
    getClasses: (css: string, globalStyle?: any, itemIndex?: number) => string[];
};
