import { ElementTool } from "../Typse";
import React from "react";
import { UniversalWebSocket } from "./UniversalWebSocket";
import { NetworkLogger } from "./NetworkLogger";
type LogTypes = "ERROR" | "LOG" | "WARNING" | "INFO";
type Types = ("TREE_DATA" | "PATCH_NODE" | "PATCH_DELETE" | "PATCH_SELECT" | "PROP" | "FETCH") | LogTypes;
type ChangedProps = {
    _viewId: string;
    style?: string;
    css?: string;
};
declare class Settings {
    elementSelection: boolean;
    webDevToolsIsOpen: boolean;
    zoom: number;
    autoSave: boolean;
}
export declare class DevToolsData {
    changedProps: Map<string, ChangedProps>;
    propsUpdated: string;
    isOpened: boolean;
    rerender: string;
    settings: Settings;
}
export declare class DevtoolsHandler {
    _host: string;
    renderingTree: boolean;
    que: {
        __To: "APP" | "HTML";
        payload: ElementTool | string;
        type: Types;
    }[];
    treeQue: Map<string, {
        __To: "APP" | "HTML";
        payload: ElementTool | string;
        type: Types;
    }>;
    ws: UniversalWebSocket;
    data: DevToolsData;
    components: Map<string, React.ReactElement>;
    timer: any;
    networkLogger: NetworkLogger;
    get webUrl(): string;
    get host(): string | undefined;
    set host(value: string | undefined);
    open(): Promise<void>;
    pushItem(type?: Types, payload?: any, isTree?: boolean, id?: string): this;
    timerSend(): this;
    simpleSend(type?: Types, payload?: any): Promise<void>;
    send(type?: Types, payload?: any): Promise<void>;
    sendProp(...keys: (keyof Settings)[]): Promise<void>;
    sendTree(tree: ElementTool): Promise<void>;
    patch(tree: ElementTool): Promise<void>;
    delete(viewId: string): Promise<void>;
    select(viewId: string): Promise<void>;
    SKIP_KEYS: Set<string>;
    cleanProps(props: any): {};
    withKeysOnly(item: any): any;
    cleanDeletedItemsStyle(style: any, deletedItemStyle: any): void;
    validateDeletedProps(props: any, _deletedItems: any): void;
}
export {};
