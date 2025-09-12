export const StyledKey = "StyledKey";
export class IParent {
    constructor() {
        this.childrenPaths = [];
        this.classPath = [];
        this.props = {};
        this.type = "";
    }
    reg(type, index) {
        if (!this.childrenPaths.find(x => x.index == index && x.type == type))
            this.childrenPaths.push({ type, index, typeIndex: this.childrenPaths.filter(x => x.type == type).length });
    }
}
//# sourceMappingURL=Typse.js.map