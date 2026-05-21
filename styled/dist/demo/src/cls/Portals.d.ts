export declare class UpFunc {
    id?: string;
    elem?: {
        visible: boolean;
        children: any;
    };
    updater: number;
    upTimer?: ReturnType<typeof setTimeout>;
    funcBind?: (x: {
        visible: boolean;
        children: any;
    }) => void;
    update(elem?: {
        visible: boolean;
        children: any;
    }): void;
    constructor(id?: string, elem?: {
        visible: boolean;
        children: any;
    });
}
export declare class Portals extends UpFunc {
    elems: Map<string, UpFunc>;
    keys: string[];
    constructor();
    get totalItems(): number;
    addElem(id: string, portal: {
        visible: boolean;
        children: any;
    }): void;
    setKeys(): void;
    clean(id: string): void;
}
