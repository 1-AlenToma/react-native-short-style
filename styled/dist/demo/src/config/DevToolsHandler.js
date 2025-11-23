var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { newId } from "react-smart-state";
import { UniversalWebSocket } from "./UniversalWebSocket";
import { NetworkLogger } from "./NetworkLogger";
const _logTypes = ["ERROR", "LOG", "WARNING", "INFO"];
const treeData = new Map();
const wsTypes = {
    __To: "HTML"
};
class Settings {
    constructor() {
        this.elementSelection = false;
        this.webDevToolsIsOpen = false;
        this.zoom = 1.5;
        this.autoSave = true;
    }
}
export class DevToolsData {
    constructor() {
        this.changedProps = new Map();
        this.propsUpdated = "";
        this.isOpened = false;
        this.rerender = "";
        this.settings = new Settings();
    }
}
export class DevtoolsHandler {
    constructor() {
        this._host = undefined;
        this.renderingTree = false;
        this.que = [];
        this.treeQue = new Map();
        this.ws = undefined;
        this.data = new DevToolsData();
        this.components = new Map();
        this.timer = undefined;
        this.networkLogger = new NetworkLogger((item) => {
            this.pushItem("FETCH", item);
        });
        this.SKIP_KEYS = new Set(["style", "css"]);
    }
    get webUrl() {
        return `http://${this.host}:7778/index.html?q=IFRAME`;
    }
    get host() {
        return this._host;
    }
    set host(value) {
        this._host = value;
        this.open();
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._host || this._host == "" || !__DEV__)
                return;
            this.ws = new UniversalWebSocket(`ws://${this._host}:7780`);
            this.ws.onOpen = () => {
                //  if (this.data.isOpened != this.data.isOpened)
                try {
                    this.ws.send({ type: "REGISTER", clientType: "APP" });
                    this.data.isOpened = true;
                    this.networkLogger.enable();
                    //console.info("connected to react-native-short-style-devtools")
                }
                catch (e) {
                    console.error(e);
                }
            };
            this.ws.onClose = (ev) => {
                if (this.data.isOpened != this.data.isOpened)
                    this.data.isOpened = false;
                this.ws = undefined;
                //console.info("disconnected from react-native-short-style-devtools", ev)
                /*  setTimeout(() => {// try again
                      this.open();
                  }, 1000);*/
            };
            this.ws.onMessage = ((data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let item = yield this.ws.safeDecode(data);
                    let items = (Array.isArray(item) ? item : [item]).flatMap(x => x);
                    for (let data of items) {
                        if (data.type == "TREE") {
                            let datas = [...treeData.values()];
                            if (datas.length <= 0 || datas[0].type != "TREE_DATA") {
                                treeData.clear();
                                this.renderingTree = true;
                                this.data.rerender = newId();
                            }
                            else {
                                //this.que = this.que.filter(x => !_logTypes.includes(x.type))
                                yield this.ws.send(datas);
                                //  
                            }
                            setTimeout(() => {
                                this.send();
                            }, 1000);
                            return;
                        }
                        if (data.__To)
                            delete data.__To;
                        if (data.type == "PROP") {
                            if (data.payload.key) {
                                this.data.settings[data.payload.key] = data.payload.value;
                            }
                        }
                        else if (data.type == "SAVE_NODE_PROP") {
                            this.data.changedProps.set(data.payload._viewId, data.payload);
                            this.data.propsUpdated = newId();
                        }
                        else if (data.type == "RELOAD") {
                            this.data.changedProps.clear();
                            this.data.propsUpdated = newId();
                        }
                        else {
                            console.warn("type could not be found ", data);
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }));
        });
    }
    pushItem(type, payload, isTree, id) {
        if (!id)
            this.que.push(Object.assign(Object.assign({}, wsTypes), { type, payload }));
        else
            this.treeQue.set(id, Object.assign(Object.assign({}, wsTypes), { type, payload }));
        if (isTree)
            treeData.set(payload.props._viewId, Object.assign(Object.assign({}, wsTypes), { type, payload: payload }));
        return this;
    }
    timerSend() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.send();
        }, 5);
        return this;
    }
    simpleSend(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ws.send(Object.assign({ type, payload }, wsTypes));
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    send(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ws || !__DEV__)
                return;
            if (!this.data.isOpened || (this.renderingTree && type != "TREE_DATA")) {
                if (type)
                    this.que.push(Object.assign(Object.assign({}, wsTypes), { type, payload }));
                return;
            }
            try {
                this.renderingTree = type == "TREE_DATA";
                if (type)
                    this.que.push(Object.assign(Object.assign({}, wsTypes), { type, payload }));
                const entries = Array.from(this.treeQue.entries());
                const removed = entries.splice(1, 30); // remove 1 element at index 1
                this.treeQue = new Map(entries);
                const dta = [...this.que.splice(0, 30), ...removed.map(([_, value]) => value)];
                //this.treeQue.clear();
                if (dta.length > 0)
                    yield this.ws.send(dta);
            }
            catch (e) {
                console.error(e);
            }
            finally {
                if ((this.que.length > 0 || this.treeQue.size > 0)) {
                    this.renderingTree = false;
                    this.timerSend();
                }
                else
                    this.renderingTree = false;
            }
        });
    }
    sendProp(...keys) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let key of keys)
                this.simpleSend("PROP", Object.assign({ key, value: this.data.settings[key] }, wsTypes));
        });
    }
    sendTree(tree) {
        return __awaiter(this, void 0, void 0, function* () {
            treeData.clear();
            treeData.set(tree.props._viewId, Object.assign(Object.assign({}, wsTypes), { type: "TREE_DATA", payload: tree }));
            this.que = this.que.filter(x => !_logTypes.includes(x.type));
            this.treeQue.clear();
            yield this.send("TREE_DATA", tree);
        });
    }
    patch(tree) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pushItem("PATCH_NODE", tree, true, tree.props._viewId).timerSend();
        });
    }
    delete(viewId) {
        return __awaiter(this, void 0, void 0, function* () {
            treeData.delete(viewId);
            //  this.que = this.que.filter(x => x.type != "PATCH_NODE" || (x.payload as ElementTool).props._viewId !== viewId);
            this.pushItem("PATCH_DELETE", viewId).timerSend();
        });
    }
    select(viewId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pushItem("PATCH_SELECT", viewId).timerSend();
        });
    }
    cleanProps(props) {
        const item = {};
        for (const k in props) {
            const v = props[k];
            const t = typeof v;
            if (!this.SKIP_KEYS.has(k) && (t === "object" || t === "function"))
                continue;
            item[k] = v;
        }
        return item;
    }
    withKeysOnly(item) {
        for (let k in item) {
            const v = item[k];
            if (k == "_props" || k == "important") {
                delete item[k];
                continue;
            }
            if (typeof v == "object" && "_props" in v) {
                delete v["_props"];
            }
            if (typeof v == "object" && Object.keys(v).length == 0)
                delete item[k];
        }
        return item;
    }
    cleanDeletedItemsStyle(style, deletedItemStyle) {
        for (let k in deletedItemStyle) {
            if (k in style) {
                delete style[k];
            }
        }
    }
    validateDeletedProps(props, _deletedItems) {
        for (let key of _deletedItems) {
            let v = _deletedItems[key];
            let v1 = props[key];
            if (typeof v == "object" && v1) {
                this.validateDeletedProps(v1, v);
                continue;
            }
            if (key in props)
                delete props[key];
        }
    }
}
//# sourceMappingURL=DevToolsHandler.js.map