import { useRef } from "react"

export const useLocalRef = <T>(value: (() => T) | T) => {
    const rValue = useRef<T>(null);
    if (rValue.current === null)
        rValue.current = value && typeof value === "function" ? (value as any)() : value;

    return rValue.current as T;
}