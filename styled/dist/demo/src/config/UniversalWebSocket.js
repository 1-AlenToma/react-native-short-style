// UniversalWebSocket.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Platform } from "react-native";
import { Packr } from "msgpackr";
let packr = new Packr({
    encodeUndefinedAsNil: false, // undefined keys will be skipped
    useRecords: false, // optional, treat plain objects as plain
    mapsAsObjects: true // map objects are decoded as plain objects
});
export class UniversalWebSocket {
    safeStringify(obj, space = undefined) {
        const seen = new WeakSet();
        return JSON.stringify(obj, function (key, value) {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value))
                    return "[Circular]";
                seen.add(value);
            }
            return value;
        }, space);
    }
    safeEncode(data) {
        try {
            let item = packr.pack(data);
            return item;
        }
        catch (e) {
            console.warn("MsgPack failed, fallback to JSON", e);
            return this.safeStringify(data);
        }
    }
    safeDecode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data instanceof Blob) {
                data = yield data.arrayBuffer();
            }
            if (data instanceof ArrayBuffer) {
                data = new Uint8Array(data);
            }
            if (data instanceof Uint8Array) {
                // Try MsgPack first
                try {
                    return packr.unpack(data);
                }
                catch (err) {
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
        });
    }
    constructor(url) {
        this.queue = [];
        this.url = url;
        this.init();
    }
    init() {
        if (Platform.OS == "web" && typeof Worker !== "undefined" && typeof window !== "undefined") {
            //  console.log("using worker")
            // 🌐 Web environment with Worker support
            this.worker = new Worker(URL.createObjectURL(new Blob([`
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
                        `], { type: "application/javascript" })));
            this.worker.onmessage = (e) => {
                var _a, _b, _c, _d;
                const { type, data } = e.data;
                if (type === "open")
                    (_a = this.onOpen) === null || _a === void 0 ? void 0 : _a.call(this);
                else if (type === "message")
                    (_b = this.onMessage) === null || _b === void 0 ? void 0 : _b.call(this, data);
                else if (type === "error")
                    (_c = this.onError) === null || _c === void 0 ? void 0 : _c.call(this, data);
                else if (type === "close")
                    (_d = this.onClose) === null || _d === void 0 ? void 0 : _d.call(this, data);
            };
            this.worker.postMessage({ type: "connect", data: this.url });
        }
        else {
            // 📱 React Native or non-worker environment
            this.socket = new WebSocket(this.url);
            this.socket.binaryType = "arraybuffer";
            this.socket.onopen = () => { var _a; return (_a = this.onOpen) === null || _a === void 0 ? void 0 : _a.call(this); };
            this.socket.onmessage = (ev) => { var _a; return (_a = this.onMessage) === null || _a === void 0 ? void 0 : _a.call(this, ev.data); };
            this.socket.onerror = (err) => { var _a; return (_a = this.onError) === null || _a === void 0 ? void 0 : _a.call(this, err); };
            this.socket.onclose = (ev) => { var _a; return (_a = this.onClose) === null || _a === void 0 ? void 0 : _a.call(this, ev); };
        }
    }
    send(data) {
        if (this.worker) {
            this.worker.postMessage({ type: "send", data: this.safeEncode(data) });
        }
        else if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            if (this.queue.length > 0) {
                while (this.queue.length > 0 && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(this.queue.shift());
                }
            }
            this.socket.send(this.safeEncode(data));
        }
        else if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
            this.queue.push(data);
        }
    }
    close() {
        var _a;
        if (this.worker) {
            this.worker.postMessage({ type: "close" });
            this.worker.terminate();
        }
        else {
            (_a = this.socket) === null || _a === void 0 ? void 0 : _a.close();
        }
    }
}
//# sourceMappingURL=UniversalWebSocket.js.map