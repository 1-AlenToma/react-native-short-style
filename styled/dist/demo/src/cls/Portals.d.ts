type Listener = () => void;
export declare class UpFunc {
    private listeners;
    subscribe: (fn: Listener) => () => any;
    protected notify(): void;
}
export declare class Portals extends UpFunc {
    elems: Map<string, {
        visible: boolean;
        children: any;
    }>;
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
export {};
