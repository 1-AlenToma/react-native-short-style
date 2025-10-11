import { CSSStorage } from "../Typse";
declare class TempStorage implements CSSStorage {
    data: Map<string, any>;
    lastSave: number;
    private validate;
    constructor();
    getKey(key: string): string;
    set(key: string, item: any): void;
    delete(key: string): void;
    get(key: string): any;
    has(key: string): boolean;
    clear(): void;
}
declare class LocalStorage implements CSSStorage {
    getKey(key: string): string;
    set(key: string, item: any): void;
    delete(key: string): void;
    get(key: string): any;
    has(key: string): boolean;
    clear(): void;
}
export declare const Storage: LocalStorage;
export declare const TStorage: TempStorage;
export {};
