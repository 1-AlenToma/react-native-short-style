type ILocalMemo = {
    memKey<T>(key: string, fn: T, ...deps: any[]): T;
    memoKey<T>(key: string, fn: () => T, ...deps: any[]): T;
    memo<T>(fn: () => T, ...deps: any[]): T;
    mem<T>(fn: T, ...deps: any[]): T;
};
export declare const useLocalMemo: () => ILocalMemo;
export {};
