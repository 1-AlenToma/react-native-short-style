import { useRef, useEffect } from "react";
export const useTimer = (ms: number) => {
    const timer = useRef<undefined | number>();

    let create = function (func: Function, mss?: number) {
        clearTimeout(timer.current);
        timer.current = setTimeout(func, mss || ms);
    };
    (create as any).clear = () => clearTimeout(timer.current);

    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, [])

  

    return create as any as Function & { clear: () => void };
};