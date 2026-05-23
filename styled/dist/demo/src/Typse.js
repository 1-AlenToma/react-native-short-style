export const StyledKey = "StyledKey";
export class IParent {
    index;
    total;
    parent;
    childrenPaths = new Map();
    classPath = [];
    props = {};
    type = "";
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