export declare const useTimer: (ms: number) => ((func: Function, mss?: number) => void) & {
    clear: () => void;
};
