import * as React from "react";

type ILocalMemo = {
  memKey<T>(key: string, fn: T, ...deps: any[]): T;
  memoKey<T>(key: string, fn: () => T, ...deps: any[]): T;
  memo<T>(fn: () => T,...deps: any[]): T;
  mem<T>(fn: T,...deps: any[]): T;

}

class LocalMemory {
  private cacheNumber: { value: any, deps: any[] }[] = [];
  private cashKeys: Record<string, { value: any, deps: any[] }> = {};
  index: number = 0;

  memKey<T>(key: string, fn: T, ...deps: any[]): T {
    const prev = this.cashKeys[key];
    const changed = !prev ||
      prev.deps.length !== deps.length ||
      deps.some((d, idx) => d !== prev.deps[idx]);
    if (changed) {
      this.cashKeys[key] = {
        deps,
        value: fn
      };
    }
    return this.cashKeys[key].value;
  }

  memoKey<T>(key: string, fn: () => T, ...deps: any[]): T {
    const prev = this.cashKeys[key];
    const changed = !prev ||
      prev.deps.length !== deps.length ||
      deps.some((d, idx) => d !== prev.deps[idx]);
    if (changed) {
      this.cashKeys[key] = {
        deps,
        value: fn()
      };
    }
    return this.cashKeys[key].value;
  }

  memo<T>(fn: () => T,...deps: any[]): T {
    const i = this.index++;
    const prev = this.cacheNumber[i];
    const changed = !prev ||
      prev.deps.length !== deps.length ||
      deps.some((d, idx) => d !== prev.deps[idx]);
    if (changed) {
      this.cacheNumber[i] = {
        deps,
        value: fn()
      };
    }
    return this.cacheNumber[i].value;
  };

  mem<T>(fn: T,...deps: any[]): T {
    const i = this.index++;
    const prev = this.cacheNumber[i];
    const changed = !prev ||
      prev.deps.length !== deps.length ||
      deps.some((d, idx) => d !== prev.deps[idx]);
    if (changed) {
      this.cacheNumber[i] = {
        deps,
        value: fn
      };
    }
    return this.cacheNumber[i].value;
  };

  get funcs() : ILocalMemo {
    return { mem: this.mem.bind(this), memo: this.memo.bind(this), memKey: this.memKey.bind(this), memoKey: this.memoKey.bind(this) };
  }
}

export const useLocalMemo = () => {
  const item = React.useRef<LocalMemory>(undefined);
  if (!item.current)
    item.current = new LocalMemory();
  item.current.index = 0;
  return item.current.funcs;
};