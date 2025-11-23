export declare const useLocalRef: <T>(value: (() => T) | T) => T;
export declare const useMutableRef: <T>(value: (() => T) | T) => {
    current: T;
};
