var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const svgSelect = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAypJREFUSImt1EFo23UUwPHv++XfJCUJrk1m1m1ae5jgYeBOHrS1ruJkDpQ2xaQgMhmmtUiFoSzTwtYMJgpaRNzJIbu0l3pRcFM3ZN3Ry9S5InYuabuujWsykrZrtuR5qK1p0qSE+G6/9/i/z+89/v+/HOwbSNRv8/mAkbHTgz2dkehZgcPA5NjpD/YEIqfeVDgDLBkbe3MP1Cci44AFBLKO3Pf2FVsc8KJ8PPbh4HsUhMmk5n3L6YVxjHwCYBPzGaphkfzbICpGvgXCiPYmrNzUfWf+mor2imqvceQuf3PixBIqYeAawh6Ko+ONIzcP9va/VlKoMjojp97pikT7au1TfbSGQmfbgsF9tfbpOh7tDxwbOlKcNwKHFZ6qFRDlkIq8VJy3gBtiTLxWIA8xgy7X2qf6aAuFwvu7u3eVq99OLbeo6uuq6q/UJ3D8ZEd3ZOjZ4rwBzjywrEPlHkyn0+9PzSe/AmZU9ZKq9m2GaV6OqjCwGbCksFgOcNRZw9OJJLG5BRvwHPAFcEtVr6jqgKo2AYiIqIqUApa11zY7O1oOeHRH428upyM5k0gRm1sovNjTwDAwrapXQi+0N/sbG5wlgGSzvrTHYy8HANQ77RcAipANWGf7M098fvStA6p6UVW71otqzLjb7X61EuCw2aLy7/RlEGB1TcB+oL9Qt1C1KgHNTd7fXU57cu1cCQGuAz3rgKh2W3b715UA+G9NWyCzQJuI3F4HMouLFy6eO3dnK6DOmJNS9JJsgjQBG/6oxuV2x1uDwcBWQMtO30ThmiogQ6o6uHawAK+IRFtDod3jIyPDbcFgv4q8Iqo3Lo+Ohtt7ep7Pw7uqaiZjkyv+h3eX4DOJFADN/sZCBBGJGoWPgF9Rvbc6k7knkFSRDEAesqjeFUh+d+mHXwq3ZLds+UJkan7DgEOqeqzky9sqrv45vZBZXmlw2q0Vr8e1L5vLfZpIZQ6s1Xdt31Y4yV+mWsBV7/jSXe9INXpcTz6203f98Uf8L/oecv+4ySQJ4OWqJygXE/G583furk5SZ9nyLTu8HdsbPD/9X/0B+CM+d/7nidj9m7f+7lzL/QM4+VXiyak93QAAAABJRU5ErkJggg==`;
// SmartScheduler.ts
import { Platform } from "react-native";
// Only import InteractionManager if available (React Native)
let InteractionManager;
try {
    InteractionManager = require("react-native").InteractionManager;
}
catch (_) { }
/**
 * Cross-platform async scheduler that keeps UI responsive
 */
export class SmartScheduler {
    static run(fn) {
        // On React Native, run after animations and gestures
        if (InteractionManager && Platform.OS !== "web") {
            InteractionManager.runAfterInteractions(() => fn());
            return;
        }
        // On Web, try using requestIdleCallback if supported
        if (typeof globalThis.requestIdleCallback === "function") {
            globalThis.requestIdleCallback(fn);
            //   console.log("requestIdleCallback")
            return;
        }
        // Fallback
        setTimeout(fn, 0);
    }
    /**
     * Splits a large array into chunks to avoid blocking UI.
     * Optionally uses SmartScheduler.run() to yield between chunks.
     */
    static runInChunks(items, chunkSize, callback, done) {
        let index = 0;
        function processNextChunk() {
            const end = Math.min(index + chunkSize, items.length);
            for (; index < end; index++) {
                callback(items[index], index);
            }
            if (index < items.length) {
                SmartScheduler.run(processNextChunk);
            }
            else if (done) {
                done();
            }
        }
        SmartScheduler.run(processNextChunk);
    }
    /**
 * Same as runInChunks, but awaits each chunk (useful if chunk processing is async)
 */
    static runInChunksAndGroupAsync(items, chunkSize, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            const processChunk = () => __awaiter(this, void 0, void 0, function* () {
                const end = Math.min(index + chunkSize, items.length);
                let group = [];
                for (; index < end; index++) {
                    group.push(items[index]);
                }
                if (group.length > 0)
                    yield callback(group);
                if (index < items.length) {
                    yield new Promise((r) => SmartScheduler.run(r));
                    yield processChunk();
                }
            });
            yield processChunk();
        });
    }
    /**
     * Same as runInChunks, but awaits each chunk (useful if chunk processing is async)
     */
    static runInChunksAsync(items, chunkSize, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 0;
            const processChunk = () => __awaiter(this, void 0, void 0, function* () {
                const end = Math.min(index + chunkSize, items.length);
                for (; index < end; index++) {
                    yield callback(items[index], index);
                }
                if (index < items.length) {
                    yield new Promise((r) => SmartScheduler.run(r));
                    yield processChunk();
                }
            });
            yield processChunk();
        });
    }
}
//# sourceMappingURL=constant.js.map