import * as React from "react";
class LocalMemory {
    cacheNumber = [];
    cashKeys = {};
    index = 0;
    memKey(key, fn, ...deps) {
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
    memoKey(key, fn, ...deps) {
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
    memo(fn, ...deps) {
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
    }
    ;
    mem(fn, ...deps) {
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
    }
    ;
    get funcs() {
        return { mem: this.mem.bind(this), memo: this.memo.bind(this), memKey: this.memKey.bind(this), memoKey: this.memoKey.bind(this) };
    }
}
export const useLocalMemo = () => {
    const item = React.useRef(undefined);
    if (!item.current)
        item.current = new LocalMemory();
    item.current.index = 0;
    return item.current.funcs;
};
//# sourceMappingURL=useLocalMemo.js.map