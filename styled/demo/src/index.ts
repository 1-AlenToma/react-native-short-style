export * from "./theme";
export * from "./components";
export * from "./styles";
export { AlertDialog } from "./config";
export * from "./Typse";
export * from "./hooks";
import { ConsoleInterceptor } from "./config/ConsoleInterceptor";

ConsoleInterceptor.enable();

setInterval(() => {
    const items = ["log", "info", "warn", "error"];
    const method = items[Math.floor(Math.random() * items.length)];
    console[method]({ test: "asdkjh kjh", date: new Date() });
}, 1000);

