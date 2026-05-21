export class UpFunc {
    update(elem) {
        clearTimeout(this.upTimer);
        if (elem)
            this.elem = elem;
        if (!this.funcBind) {
            this.upTimer = setTimeout(() => {
                if (!this.funcBind)
                    this.updater = this.updater < 1000 ? this.updater + 1 : 0;
            }, 100);
        }
        else
            this.funcBind(this.elem);
    }
    constructor(id, elem) {
        this.updater = 0;
        this.id = id;
        this.elem = elem;
    }
}
export class Portals extends UpFunc {
    constructor() {
        super();
        this.elems = new Map();
        this.keys = [];
    }
    get totalItems() {
        return this.elems.size;
    }
    addElem(id, portal) {
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
    clean(id) {
        if (this.elems.has(id)) {
            this.elems.delete(id);
            this.setKeys();
            this.update();
        }
    }
}
//# sourceMappingURL=Portals.js.map