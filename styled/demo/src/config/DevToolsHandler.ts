import { newId, sleep } from "react-smart-state";
import { ElementTool } from "../Typse";
import React from "react";
import { UniversalWebSocket } from "./UniversalWebSocket";
//import { NetworkLogger } from "./NetworkLogger";
//import { WebSocket } from "ws"
type LogTypes = "ERROR" | "LOG" | "WARNING" | "INFO";
type Types = ("TREE_DATA" | "PATCH_NODE" | "PATCH_DELETE" | "PATCH_SELECT" | "PROP" | "FETCH") | LogTypes;
const _logTypes = ["ERROR", "LOG", "WARNING", "INFO"]
type ChangedProps = { _viewId: string, style?: string, css?: string };
const treeData = new Map<string, { type: Types, payload: ElementTool, settings?: any }>();
const wsTypes = {
    __To: "HTML" as "APP" | "HTML"
}

class Settings {
    elementSelection: boolean = false;
    webDevToolsIsOpen: boolean = false;
    zoom: number = 1.5;
    autoSave: boolean = true;
}

export class DevToolsData {
    changedProps: Map<string, ChangedProps> = new Map<string, ChangedProps>();
    propsUpdated: string = "";
    isOpened: boolean = false;
    rerender: string = "";
    settings: Settings = new Settings();

}




export class DevtoolsHandler {
    _host: string = undefined;
    renderingTree: boolean = false;
    que: { __To: "APP" | "HTML", payload: ElementTool | string, type: Types }[] = [];
    treeQue: Map<string, { __To: "APP" | "HTML", payload: ElementTool | string, type: Types }> = new Map();
    ws: UniversalWebSocket = undefined;
    data: DevToolsData = new DevToolsData();
    components: Map<string, React.ReactElement> = new Map();
    timer: any = undefined;
    /*  networkLogger: NetworkLogger = new NetworkLogger((item) => {
          this.pushItem("FETCH", item);
      });*/

    get webUrl() {
        return `http://${this.host}:7778/index.html?q=IFRAME`;
    }

    get host() {
        return this._host;
    }

    set host(value: string | undefined) {
        this._host = value;
        this.open();
    }


    async open() {
        if (!this._host || this._host == "" || !__DEV__)
            return;
        this.ws = new UniversalWebSocket(`ws://${this._host}:7780`);

        this.ws.onOpen = () => {
            //  if (this.data.isOpened != this.data.isOpened)
            try {
                this.ws.send({ type: "REGISTER", clientType: "APP" });
                this.data.isOpened = true;
                //  this.networkLogger.enable();

                //console.info("connected to react-native-short-style-devtools")
            } catch (e) {
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
        }

        this.ws.onMessage = (async (data) => {
            try {
                let item = await this.ws.safeDecode(data);
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
                            await this.ws.send(datas);
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

                    } else if (data.type == "SAVE_NODE_PROP") {
                        this.data.changedProps.set(data.payload._viewId, data.payload);
                        this.data.propsUpdated = newId()
                    } else if (data.type == "RELOAD") {
                        this.data.changedProps.clear();
                        this.data.propsUpdated = newId();
                    } else {
                        console.warn("type could not be found ", data)
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });
    }


    pushItem(type?: Types, payload?: any, isTree?: boolean, id?: string) {
        if (!id)
            this.que.push({ ...wsTypes, type, payload });
        else this.treeQue.set(id, { ...wsTypes, type, payload });
        if (isTree)
            treeData.set(payload.props._viewId, { ...wsTypes, type, payload: payload });
        return this;
    }

    timerSend() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.send();
        }, 5);

        return this;
    }

    async simpleSend(type?: Types, payload?: any) {
        try {
            await this.ws.send({ type, payload, ...wsTypes });
        } catch (e) { console.error(e); }
    }

    async send(type?: Types, payload?: any) {
        if (!this.ws || !__DEV__)
            return;
        if (!this.data.isOpened || (this.renderingTree && type != "TREE_DATA")) {
            if (type)
                this.que.push({ ...wsTypes, type, payload });

            return;
        }

        try {


            this.renderingTree = type == "TREE_DATA";
            if (type)
                this.que.push({ ...wsTypes, type, payload });
            const entries = Array.from(this.treeQue.entries());
            const removed = entries.splice(1, 30); // remove 1 element at index 1
            this.treeQue = new Map(entries)
            const dta = [...this.que.splice(0, 30), ...removed.map(([_, value]) => value)];
            //this.treeQue.clear();
            if (dta.length > 0)
                await this.ws.send(dta);
        } catch (e) {
            console.error(e);
        } finally {

            if ((this.que.length > 0 || this.treeQue.size > 0)) {
                this.renderingTree = false;
                this.timerSend();

            } else this.renderingTree = false;
        }
    }

    async sendProp(...keys: (keyof Settings)[]) {
        for (let key of keys)
            this.simpleSend("PROP", { key, value: this.data.settings[key], ...wsTypes });

    }

    async sendTree(tree: ElementTool) {
        treeData.clear();
        treeData.set(tree.props._viewId, { ...wsTypes, type: "TREE_DATA", payload: tree });
        this.que = this.que.filter(x => !_logTypes.includes(x.type));
        this.treeQue.clear();
        await this.send("TREE_DATA", tree);
    }

    async patch(tree: ElementTool) {
        this.pushItem("PATCH_NODE", tree, true, tree.props._viewId).timerSend();
    }

    async delete(viewId: string) {
        treeData.delete(viewId);
        //  this.que = this.que.filter(x => x.type != "PATCH_NODE" || (x.payload as ElementTool).props._viewId !== viewId);
        this.pushItem("PATCH_DELETE", viewId).timerSend();
    }

    async select(viewId: string) {
        this.pushItem("PATCH_SELECT", viewId).timerSend();
    }

    SKIP_KEYS = new Set(["style", "css"]);
    cleanProps(props) {
        const item = {};
        for (const k in props) {
            const v = props[k];
            const t = typeof v;
            if (!this.SKIP_KEYS.has(k) && (t === "object" || t === "function")) continue;
            item[k] = v;
        }
        return item;
    }

    withKeysOnly(item: any) {
        for (let k in item) {
            const v = item[k];
            if (k == "_props" || k == "important") {
                delete item[k];
                continue;
            }

            if (typeof v == "object" && "_props" in v) {
                delete v["_props"]
            }
            if (typeof v == "object" && Object.keys(v).length == 0)
                delete item[k];
        }

        return item;
    }

    cleanDeletedItemsStyle(style: any, deletedItemStyle: any) {
        for (let k in deletedItemStyle) {

            if (k in style) {
                delete style[k];
            }
        }
    }

    validateDeletedProps(props: any, _deletedItems: any) {
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