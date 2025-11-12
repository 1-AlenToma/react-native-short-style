// worker.js
importScripts("msgpackr.js");


let queue = [];
let busy = false;
const BATCH_SIZE = 50;

function safeParse(json) {
    try {
        return JSON.parse(json);
    } catch (e) {
        console.error("Worker JSON parse error:", e);
        return null;
    }
}


async function decodeAny(data: any) {
    try {
        if (data instanceof Blob) {
            data = await data.arrayBuffer();
        }

        if (data instanceof ArrayBuffer) {
            data = new Uint8Array(data);
        }

        if (data instanceof Uint8Array) {
            // Try MsgPack first
            try {
                let item = msgpackr.decode(data);
                return item;
            } catch (err) {
                //  console.warn("MsgPack decode failed, trying JSON...");
                const text = new TextDecoder().decode(data);
                return JSON.parse(text);
            }
        }

        if (typeof data === "string") {
            return JSON.parse(data);
        }

        // Fallback
        return data;
    } catch (e) {
        console.error(e);
        return [];
    }
}

let patchedViews = {};
let childrenMap = {}; // parent_viewId -> Set(childIds)

function processView(operation) {
    const { type, payload } = operation;

    switch (type) {
        case "TREE_DATA":
            patchedViews = {};
            childrenMap = {};
            return operation;

        case "PATCH_DELETE":
            if (patchedViews[payload]) delete patchedViews[payload];
            // Remove from children map
            for (const parentId in childrenMap) {
                childrenMap[parentId]?.delete(payload);
                if (childrenMap[parentId]?.size === 0) delete childrenMap[parentId];
            }
            return operation;

        case "PATCH_NODE": {
            const viewId = payload?.props?._viewId;
            const parentId = payload?.props?._parent_viewId;

            if (!viewId) return operation;

            // Track parent→child relationship
            if (parentId) {
                if (!childrenMap[parentId]) childrenMap[parentId] = new Set();
                childrenMap[parentId].add(viewId);
            }

            // When a parent updates, invalidate all its children
            if (childrenMap[viewId]) {
                for (const childId of childrenMap[viewId]) {
                    delete patchedViews[childId];
                }
            }

            // Normal deduplication
            const prev = patchedViews[viewId];
            const serialized = JSON.stringify(operation);
            if (!prev || serialized !== JSON.stringify(prev)) {
                patchedViews[viewId] = operation;
                return operation;
            }

            return undefined;
        }

        default:
            return operation;
    }
}


onmessage = async (event) => {
    let raw = event.data;
    if (!raw) return;
    raw = await decodeAny(raw);

    raw = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
    // Always enqueue
    queue.push(...raw);

    if (!busy) flushQueue();
};

function flushQueue() {
    if (busy || queue.length === 0) return;
    try {
        busy = true;

        // Process up to 100 messages per batch
        const batch = [];
        while (batch.length < BATCH_SIZE && queue.length > 0) {
            /* let item = processView(queue.shift());
             if (item)
                 batch.push(item);*/
            batch.push(queue.shift());
        }

        if (batch.length > 0) {
            // Send this batch back to main thread
            postMessage(batch);
        }


    } finally {
        busy = false;
        // If there are more queued messages, flush again soon
        if (queue.length > 0) {
            // Give main thread a breath before next flush
            //flushQueue();
            setTimeout(flushQueue, 0);
        }
    }


}
