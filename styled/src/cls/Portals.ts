type Listener = () => void;
export class UpFunc {
    private listeners = new Set<Listener>();

    subscribe = (fn: Listener) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn) as any;
    };

    protected notify() {
        for (const fn of this.listeners) {
            fn();
        }
    }
}

export class Portals extends UpFunc {
    elems = new Map<string, { visible: boolean; children: any }>();
    keys = [] as string[];
    constructor() {
        super();
    }

    get totalItems() {
        return this.elems.size;
    }

    addElem(id: string, portal: { visible: boolean; children: any }) {
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

    clean(id: string) {
        if (this.elems.has(id)) {
            this.elems.delete(id);
            this.setKeys();
            this.notify();
        }
    }
}