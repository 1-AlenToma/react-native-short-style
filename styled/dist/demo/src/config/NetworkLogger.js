var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class NetworkLogger {
    constructor(onFetchReponse) {
        this.entries = [];
        this.idCounter = 0;
        this.onFetchReponse = onFetchReponse;
    }
    logRequest(method, url, headers, body) {
        const entry = {
            id: (++this.idCounter).toString(),
            method,
            url,
            requestHeaders: headers,
            requestBody: body,
            startTime: performance.now()
        };
        this.entries.push(entry);
        return entry.id;
    }
    logResponse(id, status, responseBody, responseHeaders) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry)
            return;
        entry.status = status;
        entry.responseBody = responseBody;
        entry.responseHeaders = responseHeaders;
        entry.endTime = performance.now();
        entry.duration = entry.endTime - entry.startTime;
    }
    logError(id, error) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry)
            return;
        entry.error = error;
        entry.endTime = performance.now();
        entry.duration = entry.endTime - entry.startTime;
    }
    getAll() {
        return this.entries.slice().reverse(); // latest first
    }
    clear() {
        this.entries = [];
        this.idCounter = 0;
    }
    enable() {
        global.fetch = (url_1, ...args_1) => __awaiter(this, [url_1, ...args_1], void 0, function* (url, options = {}) {
            const id = this.logRequest((options === null || options === void 0 ? void 0 : options.method) || "GET", url, options === null || options === void 0 ? void 0 : options.headers, options === null || options === void 0 ? void 0 : options.body);
            try {
                const res = yield NetworkLogger.originalFetch(url, options);
                const clone = res.clone();
                const body = yield clone.text();
                this.logResponse(id, res.status, body, Object.fromEntries(res.headers.entries()));
                return res;
            }
            catch (e) {
                this.logError(id, e.message || String(e));
                throw e;
            }
        });
    }
}
NetworkLogger.originalFetch = global.fetch;
// Example usage for fetch
//# sourceMappingURL=NetworkLogger.js.map