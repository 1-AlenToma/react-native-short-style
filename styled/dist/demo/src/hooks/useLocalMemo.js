import * as React from "react";
export const useLocalMemo = () => {
    const cacheNumber = React.useRef([]);
    const cashKeys = React.useRef({});
    const index = React.useRef(0);
    index.current = 0; // reset every render
    const memKey = (key, fn, ...deps) => {
        const prev = cashKeys.current[key];
        const changed = !prev ||
            prev.deps.length !== deps.length ||
            deps.some((d, idx) => d !== prev.deps[idx]);
        if (changed) {
            cashKeys.current[key] = {
                deps,
                value: fn
            };
        }
        return cashKeys.current[key].value;
    };
    const mem = (fn, ...deps) => {
        const i = index.current++;
        const prev = cacheNumber.current[i];
        const changed = !prev || prev.changed ||
            prev.deps.length !== deps.length ||
            deps.some((d, idx) => d !== prev.deps[idx]);
        if (changed) {
            if (!prev && i < cacheNumber.current.length) {
                for (let index = i; index < cacheNumber.current.length; index++)
                    if (cacheNumber.current[index])
                        cacheNumber.current[index].changed = true;
            }
            cacheNumber.current[i] = {
                deps,
                value: fn,
                changed: false
            };
        }
        return cacheNumber.current[i].value;
    };
    return { mem, memKey };
};
//# sourceMappingURL=useLocalMemo.js.map