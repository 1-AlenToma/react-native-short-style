// ui-lib/DevServer.ts
import fs from "fs";
import path from "path";
import http from "http";
import mime from "mime";
import { WebSocketServer, WebSocket } from "ws";
import AppSettings from "./appSettings";

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
    private appSettings: AppSettings = new AppSettings();

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
                let filePath = path.join(assetsDir, req.url === '/' ? 'webview.html' : req.url!);
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

                if (typeof content == "string" && filePath.endsWith('webview.html')) {
                    // Inject appSettings + fix paths for Chrome
                    content = content
                        .replace(/WebTest/gi, "")
                        .replace("{#}", "Default")
                        .replace("appSettings = undefined", `appSettings = ${JSON.stringify(this.appSettings)}`);

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
                        console.log(`Registered ${wsItem.clientType}`);
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

            for (const item of items) {
                const payload = JSON.stringify(item);

                for (const c of this.clients) {
                    if (c.clientType === item.__To && c.ws.readyState === WebSocket.OPEN) {
                        c.ws.send(payload);
                    }
                }
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