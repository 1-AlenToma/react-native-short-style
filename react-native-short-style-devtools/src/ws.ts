import WS from "ws";

type WsExports = {
    WebSocket: typeof WS;
    WebSocketServer: typeof WS.Server;
};

let ws: WsExports;

export function getWs(): WsExports {
    if (ws) return ws;

    if ("WebSocketServer" in WS) {
        ws = {
            WebSocket: WS.WebSocket as any,
            WebSocketServer: (WS as any).WebSocketServer,
        };
    } else {
        ws = {
            WebSocket: WS as any,
            WebSocketServer: (WS as any).Server,
        };
    }

    return ws;
}
