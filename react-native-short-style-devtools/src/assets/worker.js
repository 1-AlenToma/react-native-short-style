// worker.js

let queue = [];
let busy = false;
const BATCH_SIZE = 10;

function safeParse(json) {
    try {
        return JSON.parse(json);
    } catch (e) {
        console.error("Worker JSON parse error:", e);
        return null;
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


onmessage = (event) => {
    let raw = event.data;
    if (!raw) return;
    if (typeof raw == "string")
        raw = safeParse(raw);

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
            let item = processView(queue.shift());
            if (item)
                batch.push(item);
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
            setTimeout(flushQueue, 0);
        }
    }


}
