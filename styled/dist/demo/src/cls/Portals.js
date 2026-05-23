export class UpFunc {
    listeners = new Set();
    subscribe = (fn) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    };
    notify() {
        for (const fn of this.listeners) {
            fn();
        }
    }
}
export class Portals extends UpFunc {
    elems = new Map();
    keys = [];
    constructor() {
        super();
    }
    get totalItems() {
        return this.elems.size;
    }
    addElem(id, portal) {
        if (!portal.visible)
            this.clean(id);
        else {
            let hasKey = this.elems.has(id);
            this.elems.set(id, portal);
            if (!hasKey)
                this.setKeys();
            this.notify();
        }
    }
    setKeys() {
        this.keys = [...this.elems.keys()];
    }
    clean(id) {
        if (this.elems.has(id)) {
            this.elems.delete(id);
            this.setKeys();
            this.notify();
        }
    }
}
//# sourceMappingURL=Portals.js.map