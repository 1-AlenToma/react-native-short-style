import { useDeferredValue, useMemo } from "react";
export const useDeferredMemo = function (builder, depends) {
    const memoized = useMemo(builder, depends);
    return useDeferredValue(memoized);
};
//# sourceMappingURL=useDeferredMemo.js.map