type NetworkMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "WS";
interface NetworkEntry {
    id: string;
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
export declare class NetworkLogger {
    private static originalFetch;
    entries: NetworkEntry[];
    private idCounter;
    onFetchReponse: (item: NetworkEntry) => void;
    constructor(onFetchReponse: (item: NetworkEntry) => void);
    logRequest(method: NetworkMethod, url: string, headers?: Record<string, string>, body?: any): string;
    logResponse(id: string, status: number, responseBody?: any, responseHeaders?: Record<string, string>): void;
    logError(id: string, error: string): void;
    getAll(): NetworkEntry[];
    clear(): void;
    enable(): void;
}
export {};
