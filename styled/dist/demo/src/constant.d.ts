export declare const svgSelect = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAypJREFUSImt1EFo23UUwPHv++XfJCUJrk1m1m1ae5jgYeBOHrS1ruJkDpQ2xaQgMhmmtUiFoSzTwtYMJgpaRNzJIbu0l3pRcFM3ZN3Ry9S5InYuabuujWsykrZrtuR5qK1p0qSE+G6/9/i/z+89/v+/HOwbSNRv8/mAkbHTgz2dkehZgcPA5NjpD/YEIqfeVDgDLBkbe3MP1Cci44AFBLKO3Pf2FVsc8KJ8PPbh4HsUhMmk5n3L6YVxjHwCYBPzGaphkfzbICpGvgXCiPYmrNzUfWf+mor2imqvceQuf3PixBIqYeAawh6Ko+ONIzcP9va/VlKoMjojp97pikT7au1TfbSGQmfbgsF9tfbpOh7tDxwbOlKcNwKHFZ6qFRDlkIq8VJy3gBtiTLxWIA8xgy7X2qf6aAuFwvu7u3eVq99OLbeo6uuq6q/UJ3D8ZEd3ZOjZ4rwBzjywrEPlHkyn0+9PzSe/AmZU9ZKq9m2GaV6OqjCwGbCksFgOcNRZw9OJJLG5BRvwHPAFcEtVr6jqgKo2AYiIqIqUApa11zY7O1oOeHRH428upyM5k0gRm1sovNjTwDAwrapXQi+0N/sbG5wlgGSzvrTHYy8HANQ77RcAipANWGf7M098fvStA6p6UVW71otqzLjb7X61EuCw2aLy7/RlEGB1TcB+oL9Qt1C1KgHNTd7fXU57cu1cCQGuAz3rgKh2W3b715UA+G9NWyCzQJuI3F4HMouLFy6eO3dnK6DOmJNS9JJsgjQBG/6oxuV2x1uDwcBWQMtO30ThmiogQ6o6uHawAK+IRFtDod3jIyPDbcFgv4q8Iqo3Lo+Ohtt7ep7Pw7uqaiZjkyv+h3eX4DOJFADN/sZCBBGJGoWPgF9Rvbc6k7knkFSRDEAesqjeFUh+d+mHXwq3ZLds+UJkan7DgEOqeqzky9sqrv45vZBZXmlw2q0Vr8e1L5vLfZpIZQ6s1Xdt31Y4yV+mWsBV7/jSXe9INXpcTz6203f98Uf8L/oecv+4ySQJ4OWqJygXE/G583furk5SZ9nyLTu8HdsbPD/9X/0B+CM+d/7nidj9m7f+7lzL/QM4+VXiyak93QAAAABJRU5ErkJggg==";
/**
 * Cross-platform async scheduler that keeps UI responsive
 */
export declare class SmartScheduler {
    static run(fn: () => void | Promise<void>): void;
    /**
     * Splits a large array into chunks to avoid blocking UI.
     * Optionally uses SmartScheduler.run() to yield between chunks.
     */
    static runInChunks<T>(items: T[], chunkSize: number, callback: (item: T, index: number) => void, done?: () => void): void;
    /**
 * Same as runInChunks, but awaits each chunk (useful if chunk processing is async)
 */
    static runInChunksAndGroupAsync<T>(items: T[], chunkSize: number, callback: (item: T[]) => void | Promise<void>): Promise<void>;
    /**
     * Same as runInChunks, but awaits each chunk (useful if chunk processing is async)
     */
    static runInChunksAsync<T>(items: T[], chunkSize: number, callback: (item: T, index: number) => void | Promise<void>): Promise<void>;
}
