import { DevServer, startDevServer } from "./DevServer";
const server = startDevServer();

// send something to HTML
setInterval(() => {
  //  server.send({ type: "ping", time: Date.now() });
}, 3000);