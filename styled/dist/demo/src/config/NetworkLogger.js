export class NetworkLogger {
    static originalFetch = global.fetch;
    entries = [];
    idCounter = 0;
    onFetchReponse;
    constructor(onFetchReponse) {
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
        global.fetch = async (url, options = {}) => {
            const id = this.logRequest(options?.method || "GET", url, options?.headers, options?.body);
            try {
                const res = await NetworkLogger.originalFetch(url, options);
                const clone = res.clone();
                const body = await clone.text();
                this.logResponse(id, res.status, body, Object.fromEntries(res.headers.entries()));
                return res;
            }
            catch (e) {
                this.logError(id, e.message || String(e));
                throw e;
            }
        };
    }
}
// Example usage for fetch
//# sourceMappingURL=NetworkLogger.js.map