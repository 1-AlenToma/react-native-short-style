// ConsoleInterceptor.ts

import { devToolsHandlerContext } from "../theme/ThemeContext";

type ConsoleMethod = (...args: any[]) => void;

export class ConsoleInterceptor {
    private static original = {
        log: console.log as ConsoleMethod,
        info: console.info as ConsoleMethod,
        warn: console.warn as ConsoleMethod,
        error: console.error as ConsoleMethod,
    };

    private static enabled = false;

    /**
     * Apply the interception and filtering logic
     */
    static enable() {
        try {
            if (this.enabled) return;
            this.enabled = true;

            const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : false;

            console.log = (...args: any[]) => {
                try {
                    this.original.log(...args);
                    if (isDev && devToolsHandlerContext.data.isOpened)
                        devToolsHandlerContext.pushItem("LOG", args)
                } catch (err) {
                    this.original.error(err);
                }

            };

            console.info = (...args: any[]) => {
                try {
                    this.original.info(...args);
                    if (isDev && devToolsHandlerContext.data.isOpened)
                        devToolsHandlerContext.pushItem("INFO", args)
                } catch (err) {
                    this.original.error(err);
                }

            };

            console.warn = (...args: any[]) => {
                try {
                    this.original.warn(...args);
                    if (isDev && devToolsHandlerContext.data.isOpened)
                        devToolsHandlerContext.pushItem("WARNING", args)
                } catch (err) {
                    this.original.error(err);
                }

            };

            console.error = (...args: any[]) => {
                // Always show errors, even in production
                try {
                    this.original.error(...args);
                    if (isDev && devToolsHandlerContext.data.isOpened)
                        devToolsHandlerContext.pushItem("ERROR", args)
                } catch (err) {
                    this.original.error(err);
                }

            };

        } catch (e) {
            console.error(e)
        }
    }

    /**
     * Restore original console methods
     */
    static disable() {
        if (!this.enabled) return;
        this.enabled = false;

        console.log = this.original.log;
        console.info = this.original.info;
        console.warn = this.original.warn;
        console.error = this.original.error;
    }
}