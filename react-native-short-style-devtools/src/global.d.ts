// global.d.ts
declare global {
    interface Window {
        $: (tag: any, attrs?: Record<keyof HTMLElement & HTMLInputElement, any>) => DomElement & HTMLElement & HTMLInputElement;
        $$: (tag: string) => (DomElement & Element)[];
        appSettings: any;
        RN_STYLE_PROPS: { name: string, values: any, type: any }[];
        toHex: (color: string) => any;
    }

    interface ElementTool {
        name: string;
        children?: any[];
        readOnlyProps?: string[],
        props: NodeProps
    }

    interface NodeProps extends Record<string, any> {
        _viewId: string;
        _parent_viewId?: string;
        _elementIndex?: number;
        css?: any;
        style?: any;
        children?: string;
        platform?: string;
    }
}

export { }; // makes it a module so TypeScript merges types correctly
