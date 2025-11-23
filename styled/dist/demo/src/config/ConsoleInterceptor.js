// ConsoleInterceptor.ts
import { devToolsHandlerContext } from "../theme/ThemeContext";
export class ConsoleInterceptor {
    /**
     * Apply the interception and filtering logic
     */
    static enable() {
        try {
            if (this.enabled)
                return;
            this.enabled = true;
            const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : false;
            console.log = (...args) => {
                try {
                    this.original.log(...args);
                    if (isDev && devToolsHandlerContext.data.isOpened)
                        devToolsHandlerContext.pushItem("LOG", args);
                }
                catch (err) {
                    this.original.error(err);
                }
            };
            console.info = (...args) => {
                try {
                    this.original.info(...args);
                    if (isDev && devToolsHandlerContext.data.isOpened)
                        devToolsHandlerContext.pushItem("INFO", args);
                }
                catch (err) {
                    this.original.error(err);
                }
            };
            console.warn = (...args) => {
                try {
                    this.original.warn(...args);
                    if (isDev && devToolsHandlerContext.data.isOpened)
                        devToolsHandlerContext.pushItem("WARNING", args);
                }
                catch (err) {
                    this.original.error(err);
                }
            };
            console.error = (...args) => {
                // Always show errors, even in production
                try {
                    this.original.error(...args);
                    if (isDev && devToolsHandlerContext.data.isOpened)
                        devToolsHandlerContext.pushItem("ERROR", args);
                }
                catch (err) {
                    this.original.error(err);
                }
            };
        }
        catch (e) {
            console.error(e);
        }
    }
    /**
     * Restore original console methods
     */
    static disable() {
        if (!this.enabled)
            return;
        this.enabled = false;
        console.log = this.original.log;
        console.info = this.original.info;
        console.warn = this.original.warn;
        console.error = this.original.error;
    }
}
ConsoleInterceptor.original = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
};
ConsoleInterceptor.enabled = false;
//# sourceMappingURL=ConsoleInterceptor.js.map