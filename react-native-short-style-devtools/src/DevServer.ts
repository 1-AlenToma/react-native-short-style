// ui-lib/DevServer.ts
import fs from "fs";
import path from "path";
import { parse } from 'url';
import http from "http";
import mime from "mime";
import { WebSocketServer, WebSocket } from "ws";
import { ObjectJson, Settings } from "./ObjectJson";

export interface DevServerOptions {
    root?: string;
    port?: number;
    wsPort?: number;
}




const assetsFiles: Record<string, string> = {
    "style.css": "path",
    "app.js": "path",
    "data.js": "path",
    "selection.png": "path"
}

class WsClient {
    ws: WebSocket;
    clientType?: "APP" | "HTML";

    constructor(ws: WebSocket) {
        this.ws = ws;
    }
}

export class DevServer {
    private httpServer?: http.Server;
    private wsServer?: WebSocketServer;
    private clients = new Set<WsClient>();

    private root: string;
    private port: number;
    private wsPort: number;
    private started = false;
    private appSettings: ObjectJson<Settings> = new ObjectJson(new Settings());

    constructor(opts: DevServerOptions = {}) {
        this.root = opts.root ?? path.resolve(__dirname);
        this.port = opts.port ?? 7778;
        this.wsPort = opts.wsPort ?? 7780;
    }

    start() {
        if (this.started) return;
        this.started = true;

        this.createHttpServer();
        this.createWebSocketServer();

        console.log(
            `🌐  Dev server running:\n  • http://localhost:${this.port}\n  • ws://localhost:${this.wsPort}`
        );
    }

    private createHttpServer() {
        const assetsDir = path.join(this.root, 'assets');
        this.httpServer = http.createServer((req, res) => {
            try {
                // Parse URL to ignore query string
                const reqUrl = parse(req.url || '/', true);
                const pathname = reqUrl.pathname || '/';

                let filePath = path.join(assetsDir, pathname === '/' ? 'index.html' : pathname);
                if (!fs.existsSync(filePath)) {
                    res.writeHead(404);
                    res.end('Not found');
                    return;
                }

                // Basic content type handling
                const ext = path.extname(filePath);
                const isText = ['.html', '.js', '.css', '.json', '.txt'].includes(ext);
                const type = mime.getType(filePath) || "application/octet-stream";
                // For binary files (images, fonts, etc.), read as buffer

                res.writeHead(200, { 'Content-Type': type });

                let content = isText ? fs.readFileSync(filePath, 'utf8') : fs.readFileSync(filePath);

                if (typeof content == "string" && filePath.endsWith('index.html')) {
                    // Inject appSettings + fix paths for Chrome

                    content = content.replace(/\{\{(.*?)\}\}/g, (_, key) => {
                        return this.appSettings.data[key] ?? ""; // fallback if missing
                    });

                    content = content
                        .replace(/WebTest/gi, "")
                        .replace("{#}", "Default")
                        .replace("appSettings = undefined", `appSettings = ${JSON.stringify(this.appSettings.data)}`);


                    // Replace VSCode URIs with relative asset paths
                    for (let assetName in assetsFiles) {
                        content = content.replace(assetName, assetName);
                    }

                    // Optionally inject Chrome indicator
                    content = content.replace(
                        '</head>',
                        `<script>window.IS_CHROME = true;</script></head>`
                    );
                }

                res.end(content);
            } catch (err) {
                res.writeHead(500);
                res.end(String(err));
            }
        });

        this.httpServer.listen(this.port, "0.0.0.0");
    }

    private createWebSocketServer() {
        this.wsServer = new WebSocketServer({
            port: this.wsPort,
            host: "0.0.0.0" // 👈 listen on all network interfaces
        });

        this.wsServer.on("connection", (ws) => {
            let wsItem = new WsClient(ws);
            this.clients.add(wsItem);
            console.log("🔌 Dev UI connected");

            ws.on("message", (data) => {
                try {
                    const msg = JSON.parse(data.toString());
                    // If client is registering itself
                    if (msg.type === "REGISTER") {
                        wsItem.clientType = msg.clientType;   // "app" or "html"
                        if (msg.payload) {
                            Object.assign(this.appSettings, msg.payload);
                            this.appSettings.save();
                        }
                        console.log(`Registered ${wsItem.clientType}`);
                        wsItem.ws.send(JSON.stringify(this.appSettings.ObjectValue()));
                        return;
                    }
                    this.send(msg);
                } catch (err) {
                    console.error("Bad WS message:", err);
                }
            });

            ws.on("close", () => {
                this.clients.delete(wsItem);
                console.log("🔌 Dev UI disconnected");
            });
        });
    }

    // 💬 App → HTML
    send(data: { __To: "HTML" | "APP" } | { __To: "HTML" | "APP" }[]) {
        try {
            const items = Array.isArray(data) ? data : [data]; // normalize to array
            const appItems = JSON.stringify(items.filter(x => x.__To == "APP"));
            const htmlItems = JSON.stringify(items.filter(x => x.__To == "HTML"));
            items.filter((x: any) => x.type == "PROP").forEach((x: any) => {
                if (x.payload?.key != undefined) {
                    this.appSettings.setKeyValue(x.payload.key as any, x.payload.value);
                }
            });

            if (this.appSettings.hasChanged)
                this.appSettings.save();

            for (const c of this.clients) {
                if (c.clientType === "APP" && c.ws.readyState === WebSocket.OPEN)
                    c.ws.send(appItems);
                if (c.clientType === "HTML" && c.ws.readyState === WebSocket.OPEN)
                    c.ws.send(htmlItems);

            }

        } catch (e) {
            console.error("send() error:", e);
        }
    }

}

/** Singleton helper */
let singleton: DevServer | null = null;
export function startDevServer(opts?: DevServerOptions) {
    if (!singleton) {
        singleton = new DevServer(opts);
        singleton.start();
    }
    return singleton;
}


/* ui test 
if (__DEV__) {
  const { startDevServer } = require("./DevServer");
  const server = startDevServer({ root: path.resolve(__dirname, "dev") });

  // listen to messages from HTML
  server.onMessage((msg) => {
    if (msg.type === "updateTheme") {
      console.log("Changing theme to", msg.value);
      // ...update theme, reload, etc
    }
  });

  // send something to HTML
  setInterval(() => {
    server.send({ type: "ping", time: Date.now() });
  }, 3000);
}
*/