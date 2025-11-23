import { useRef } from "react";
export const useLocalRef = (value) => {
    const rValue = useRef(null);
    if (rValue.current === null)
        rValue.current = value && typeof value === "function" ? value() : value;
    return rValue.current;
};
export const useMutableRef = (value) => {
    const rValue = useRef(null);
    if (rValue.current === null)
        rValue.current = value && typeof value === "function" ? value() : value;
    return rValue;
};
//# sourceMappingURL=useLocalRef.js.map