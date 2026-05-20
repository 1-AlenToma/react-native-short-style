export class UpFunc {
    id?: string;
    elem?: { visible: boolean; children: any };
    updater = 0;
    upTimer = undefined;
    funcBind?: (x: { visible: boolean; children: any }) => void;
    update(elem?: { visible: boolean; children: any }) {
        clearTimeout(this.upTimer);
        if (elem)
            this.elem = elem;
        if (!this.funcBind) {
            this.upTimer = setTimeout(() => {
                if (!this.funcBind)
                    this.updater = this.updater < 1000 ? this.updater + 1 : 0;
            }, 100);
        } else this.funcBind(this.elem);
    }
    constructor(id?: string, elem?: { visible: boolean; children: any }) {
        this.id = id;
        this.elem = elem;
    }
}

export class Portals extends UpFunc {
    elems = new Map<string, UpFunc>();
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
            let extItem = this.elems.get(id);
            if (!extItem) {
                this.elems.set(id, new UpFunc(id, portal));
                this.setKeys();
            }
            if (extItem)
                extItem.update(portal);
            else
                this.update();
        }
    }

    setKeys() {
        this.keys = [...this.elems.keys()];
    }

    clean(id: string) {
        if (this.elems.has(id)) {
            this.elems.delete(id);
            this.setKeys();
            this.update();
        }
    }
}