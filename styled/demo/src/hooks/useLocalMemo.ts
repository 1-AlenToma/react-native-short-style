import * as React from "react";

export const useLocalMemo = () => {
  const cache = React.useRef<Record<any, any>>({});
  const index = React.useRef(0);

  index.current = 0; // reset every render

  const memKey = <T>(key: string, fn: T, ...deps: any[]): T => {

    const prev = cache.current[key];

    const changed =
      !prev ||
      prev.deps.length !== deps.length ||
      deps.some((d, idx) => d !== prev.deps[idx]);

    if (changed) {
      cache.current[key] = {
        deps,
        value: fn
      };
    }

    return cache.current[key].value;
  }

  const mem = <T>(
    fn: T,
    ...deps: any[]
  ): T => {
    const i = index.current++;

    const prev = cache.current[i];

    const changed =
      !prev ||
      prev.deps.length !== deps.length ||
      deps.some((d, idx) => d !== prev.deps[idx]);

    if (changed) {
      cache.current[i] = {
        deps,
        value: fn
      };
    }

    return cache.current[i].value;
  };

  return { mem, memKey };
};