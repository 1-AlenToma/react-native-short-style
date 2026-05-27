export declare const useLocalMemo: () => {
    mem: <T>(fn: T, ...deps: any[]) => T;
    memKey: <T>(key: string, fn: T, ...deps: any[]) => T;
};
