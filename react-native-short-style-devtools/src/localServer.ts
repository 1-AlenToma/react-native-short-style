import { DevServer, startDevServer } from "./index";
const server = startDevServer();

// send something to HTML
setInterval(() => {
  //  server.send({ type: "ping", time: Date.now() });
}, 3000);