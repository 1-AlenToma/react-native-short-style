type NetworkMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "WS";

interface NetworkEntry {
    id: string;                     // unique id
    method: NetworkMethod;
    url: string;
    requestHeaders?: Record<string, string>;
    requestBody?: any;
    status?: number;
    responseHeaders?: Record<string, string>;
    responseBody?: any;
    startTime: number;
    endTime?: number;
    duration?: number;
    error?: string;
}

export class NetworkLogger {
    private static originalFetch: any = global.fetch;
    entries: NetworkEntry[] = [];
    private idCounter = 0;
    onFetchReponse: (item: NetworkEntry) => void;
    constructor(onFetchReponse: (item: NetworkEntry) => void) {
        this.onFetchReponse = onFetchReponse;
    }

    logRequest(method: NetworkMethod, url: string, headers?: Record<string, string>, body?: any) {
        const entry: NetworkEntry = {
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

    logResponse(id: string, status: number, responseBody?: any, responseHeaders?: Record<string, string>) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;
        entry.status = status;
        entry.responseBody = responseBody;
        entry.responseHeaders = responseHeaders;
        entry.endTime = performance.now();
        entry.duration = entry.endTime - entry.startTime;
    }

    logError(id: string, error: string) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;
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
        global.fetch = async (url, options: any = {}) => {
            const id = this.logRequest(options?.method || "GET", url, options?.headers, options?.body);
            try {
                const res = await NetworkLogger.originalFetch(url, options);
                const clone = res.clone();
                const body = await clone.text();
                this.logResponse(id, res.status, body, Object.fromEntries(res.headers.entries()));
                return res;
            } catch (e: any) {
                this.logError(id, e.message || String(e));
                throw e;
            }
        };
    }
}

// Example usage for fetch



