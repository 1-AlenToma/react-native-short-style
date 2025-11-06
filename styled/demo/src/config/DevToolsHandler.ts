import { newId } from "react-smart-state";
import { ElementTool } from "../Typse";
import React from "react";
//import { WebSocket } from "ws"
type LogTypes = "ERROR" | "LOG" | "WARNING" | "INFO";
type Types = ("TREE_DATA" | "PATCH_NODE" | "PATCH_DELETE" | "PATCH_SELECT" | "PROP") | LogTypes;
const _logTypes = ["ERROR", "LOG", "WARNING", "INFO"]
type ChangedProps = { _viewId: string, style?: string, css?: string };
const treeData = new Map<string, { type: Types, payload: ElementTool }>();
const wsTypes = {
    __To: "HTML" as "APP" | "HTML"
}

export class DevToolsData {
    elementSelection: boolean = false;
    changedProps: Map<string, ChangedProps> = new Map<string, ChangedProps>();
    propsUpdated: string = "";
    isOpened: boolean = false;
    rerender: string = "";
}


function safeStringify(obj, space = 2) {
    const seen = new WeakSet();
    return JSON.stringify(obj, function (key, value) {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
        }
        return value;
    }, space);
}


export class DevtoolsHandler {
    _host: string = undefined;
    renderingTree: boolean = false;
    que: { __To: "APP" | "HTML", payload: ElementTool | string, type: Types }[] = [];
    ws: WebSocket = undefined;
    thisServer: WebSocket;
    data: DevToolsData = new DevToolsData();
    components: Map<string, React.ReactElement> = new Map();
    timer: any = undefined;


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
        this.ws = new WebSocket(`ws://${this._host}:7780`);

        this.ws.onopen = () => {
            //  if (this.data.isOpened != this.data.isOpened)
            try {
                this.ws.send(JSON.stringify({ type: "REGISTER", clientType: "APP" }));
                this.data.isOpened = true;

                console.info("connected to react-native-short-style-devtools")
            } catch (e) {
                console.error(e);
            }
        };

        this.ws.onclose = (ev) => {
            if (this.data.isOpened != this.data.isOpened)
                this.data.isOpened = false;
            this.ws = undefined;
            console.info("disconnected from react-native-short-style-devtools", ev)
            /*  setTimeout(() => {// try again
                  this.open();
              }, 1000);*/
        }

        this.ws.onmessage = async (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.type == "TREE") {
                    let items = [...treeData.values()];
                    if (items.length <= 0 || items[0].type != "TREE_DATA") {
                        treeData.clear();
                        this.renderingTree = true;
                        this.data.rerender = newId();
                    }
                    else {
                        //this.que = this.que.filter(x => !_logTypes.includes(x.type))
                        await this.ws.send(safeStringify(items));
                    }
                    return;
                }
                if (data.__To)
                    delete data.__To;
                if (data.type == "PROP") {
                    for (let key in data) {
                        if (key != "type") {
                            this.data[key] = data[key];
                        }
                    }
                } else if (data.type == "SAVE_NODE_PROP") {
                    this.data.changedProps.set(data.payload._viewId, data.payload);
                    this.data.propsUpdated = newId()
                } else if (data.type == "RELOAD") {
                    this.data.changedProps.clear();
                    this.data.propsUpdated = newId();
                } else {
                    console.log("type could not be found ", event.data)
                }
            } catch (e) {
                console.error(e);
            }
        };
    }


    pushItem(type?: Types, payload?: any, isTree?: boolean) {
        this.que.push({ ...wsTypes, type, payload });
        if (isTree)
            treeData.set(payload.props._viewId, { ...wsTypes, type, payload: payload });
        return this;

    }

    timerSend() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.send();
        }, 10);

        return this;
    }

    async simpleSend(type?: Types, payload?: any) {
        try {
            await this.ws.send(safeStringify({ type, payload, ...wsTypes }));
        } catch (e) { console.error(e); }
    }

    async send(type?: Types, payload?: any) {
        try {
            if (!this.ws || !__DEV__)
                return;
            if (!this.data.isOpened || (this.renderingTree && type != "TREE_DATA")) {
                if (type)
                    this.que.push({ ...wsTypes, type, payload });
                return;
            }
            this.renderingTree = type == "TREE_DATA";
            //  if (this.renderingTree)
            //    this.que = this.que.filter(x => !_logTypes.includes(x.type))
            if (type)
                this.que.push({ ...wsTypes, type, payload });
            const dta = [...this.que]
            this.que = [];
            await this.ws.send(safeStringify(dta));
        } catch (e) {
            console.error(e);
        } finally {
            this.renderingTree = false;
            //if (this.que.length > 0)
            //  this.send();
        }
    }

    async sendProp(key: keyof DevToolsData) {
        this.simpleSend("PROP", { key, value: this.data[key] });

    }

    async sendTree(tree: ElementTool) {
        treeData.clear();
        treeData.set(tree.props._viewId, { ...wsTypes, type: "TREE_DATA", payload: tree });
        await this.send("TREE_DATA", tree)
    }

    async patch(tree: ElementTool) {
        this.pushItem("PATCH_NODE", tree, true).timerSend();
    }

    async delete(viewId: string) {
        treeData.delete(viewId);
        this.pushItem("PATCH_NODE", viewId).timerSend()
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