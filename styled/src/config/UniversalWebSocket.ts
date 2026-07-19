// UniversalWebSocket.ts

import { Platform } from "react-native";
import { Packr } from "msgpackr";
let packr = new Packr({
    encodeUndefinedAsNil: false, // undefined keys will be skipped
    useRecords: false,           // optional, treat plain objects as plain
    mapsAsObjects: true          // map objects are decoded as plain objects
});

type MessageHandler = (data: any) => void | Promise<void>;

export class UniversalWebSocket {
    private socket?: WebSocket;
    private worker?: Worker;
    private url: string;
    private queue: any[] = [];
    onMessage?: MessageHandler;
    onOpen?: () => void;
    onClose?: (ev?: any) => void;
    onError?: (err?: any) => void;


    safeStringify(obj, space = undefined) {
        const seen = new WeakSet();
        return JSON.stringify(obj, function (key, value) {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) return "[Circular]";
                seen.add(value);
            }
            return value;
        }, space);
    }

    safeEncode(data) {
        try {
            let item = packr.pack(data);
            return item;
        } catch (e) {
            console.warn("MsgPack failed, fallback to JSON", e);
            return this.safeStringify(data);
        }
    }

    async safeDecode(data) {
        if (data instanceof Blob) {
            data = await data.arrayBuffer();
        }

        if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data);
        }

        if (data instanceof Uint8Array) {
            // Try MsgPack first
            try {
                return packr.unpack(data);
            } catch (err) {
                //  console.warn("MsgPack decode failed, trying JSON...");
                const text = new TextDecoder().decode(data);
                return JSON.parse(text);
            }
        }

        if (typeof data === "string") {
            return JSON.parse(data);
        }

        // Fallback
        return data;
    }

    constructor(url: string) {
        this.url = url;
        this.init();
    }

    private init() {
        if (Platform.OS == "web" && typeof Worker !== "undefined" && typeof window !== "undefined") {
            //  console.log("using worker")
            // 🌐 Web environment with Worker support
            this.worker = new Worker(
                URL.createObjectURL(
                    new Blob(
                        [`
                            let socket;
                            let queue = [];
                            self.onmessage = function(e) {
                                const { type, data } = e.data;
                                if (type === "connect") {
                                    socket = new WebSocket(data);
                                    socket.binaryType = "arraybuffer";
                                    socket.onopen = () => self.postMessage({ type: "open" });
                                    socket.onmessage = (ev) => self.postMessage({ type: "message", data: ev.data });
                                    socket.onerror = (err) => self.postMessage({ type: "error", data: err });
                                    socket.onclose = (ev) => self.postMessage({ type: "close", data: ev });
                                } else if (type === "send" && socket?.readyState === 1) {
                                    if (queue.length>0){
                                         while (queue.length > 0 && socket.readyState === 1) {
                                             socket.send(queue.shift());
                                        }
                                    }
                                    if (socket.readyState === 1)
                                        socket.send(data);
                                } else if (type === "close") {
                                    socket?.close();
                                }else if (socket && socket.readyState !== 1 && type === "send"){
                                    queue.push(data)
                                }
                            };
                        `],
                        { type: "application/javascript" }
                    )
                )
            );

            this.worker.onmessage = (e) => {
                const { type, data } = e.data;
                if (type === "open") this.onOpen?.();
                else if (type === "message") this.onMessage?.(data);
                else if (type === "error") this.onError?.(data);
                else if (type === "close") this.onClose?.(data);
            };

            this.worker.postMessage({ type: "connect", data: this.url });
        } else {
            // 📱 React Native or non-worker environment
            this.socket = new WebSocket(this.url);
            this.socket.binaryType = "arraybuffer";
            this.socket.onopen = () => this.onOpen?.();
            this.socket.onmessage = (ev) => this.onMessage?.(ev.data);
            this.socket.onerror = (err) => this.onError?.(err);
            this.socket.onclose = (ev) => this.onClose?.(ev);
        }
    }

    send(data: any) {
        if (this.worker) {
            this.worker.postMessage({ type: "send", data: this.safeEncode(data) });
        } else if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            if (this.queue.length > 0) {
                while (this.queue.length > 0 && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(this.queue.shift());
                }
            }
            this.socket.send(this.safeEncode(data));
        } else if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
            this.queue.push(data);
        }
    }

    close() {
        if (this.worker) {
            this.worker.postMessage({ type: "close" });
            this.worker.terminate();
        } else {
            this.socket?.close();
        }
    }


}
