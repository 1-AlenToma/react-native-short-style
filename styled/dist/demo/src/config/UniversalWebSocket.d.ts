type MessageHandler = (data: any) => void | Promise<void>;
export declare class UniversalWebSocket {
    private socket?;
    private worker?;
    private url;
    private queue;
    onMessage?: MessageHandler;
    onOpen?: () => void;
    onClose?: (ev?: any) => void;
    onError?: (err?: any) => void;
    safeStringify(obj: any, space?: any): string;
    safeEncode(data: any): string | Buffer;
    safeDecode(data: any): Promise<any>;
    constructor(url: string);
    private init;
    send(data: any): void;
    close(): void;
}
export {};
