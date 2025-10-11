export declare function useSubscriber<T>(defaultValue: T): {
    listen: (validator?: (newValue: T) => boolean) => T;
    setValue: (value: T) => void;
    clear: () => void;
};
