import { useRef, useEffect } from "react";
export const useTimer = (ms) => {
    const timer = useRef();
    let create = function (func, mss) {
        clearTimeout(timer.current);
        timer.current = setTimeout(func, mss || ms);
    };
    create.clear = () => clearTimeout(timer.current);
    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, []);
    const func = create;
    return func;
};
//# sourceMappingURL=useTimer.js.map