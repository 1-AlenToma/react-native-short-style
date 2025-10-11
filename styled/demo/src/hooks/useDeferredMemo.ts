import React, { useDeferredValue, useMemo } from "react";

export const useDeferredMemo = function <T>(builder: () => T, depends: any[]) {
    const memoized = useMemo(builder, depends);
    return useDeferredValue(memoized);
}