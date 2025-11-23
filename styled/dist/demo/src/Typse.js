export const StyledKey = "StyledKey";
export class IParent {
    constructor() {
        this.childrenPaths = new Map();
        this.classPath = [];
        this.props = {};
        this.type = "";
    }
    getKey(...args) {
        return args.join("|");
    }
    reg(type, index) {
        let key = this.getKey(type, index);
        if (!this.childrenPaths.has(key))
            this.childrenPaths.set(key, { type, index, typeIndex: Array.from(this.childrenPaths.values()).filter(x => x.type == type).length });
    }
    unreg(type, index) {
        this.childrenPaths.delete(this.getKey(type, index));
    }
}
//# sourceMappingURL=Typse.js.map