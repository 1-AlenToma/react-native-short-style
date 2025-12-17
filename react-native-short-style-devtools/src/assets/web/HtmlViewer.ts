class HtmlViewer {
    container: IDomElement = $("#treeRoot");
    propsPanel: IDomElement = $("#propsPanel");
    nodeCountEl: IDomElement = $("#nodeCount");
    searchInput: IDomElement = $("#search");
    path: IDomElement = $(".path");
    rootNode: ElementTool = {} as any;
    trees: Record<string, ElementTool> = {};
    childRelations: Map<string, Map<string, ElementTool>> = new Map();// parentId, views
    selectedViewId?: string;
    ignoreAttrs = ["_viewId", "_parent_viewId", "_elementIndex"];
    isIframe: boolean = window.location.href.indexOf("IFRAME") != -1;
    isHidden: boolean = false;
    socketIsOpen: boolean = false;
    inputForm: (propKey: string, jsonItem: any, viewId?: string, isSingleValue?: boolean, parent?: any, isReadOnly?: boolean, parentKey?: string) => void;
    socket: {
        postMessage: (type, payload) => void;
        handChake: () => void;
        socketIsOpen: boolean;
        open: () => void;
    }
    parseMessage: (event: any) => void | Promise<void>;
    collapsedNodes: Record<string, boolean> = {};
    loader: any;
    platform?: string;
    constructor(inputform: Function, parseMessage: (event: any) => void | Promise<void>, loader: any) {
        this.loader = loader;
        this.inputForm = inputform as any;
        this.parseMessage = parseMessage;
        window.location.href.indexOf("IFRAME");
        document.addEventListener("visibilitychange", () => {
            this.isHidden = document.hidden;
            return;
            if ((!this.rootNode || !this.platform || this.platform == "web")) {
                if (!this.isHidden) {

                    this.loader.loading(true);
                    this.socket.handChake();
                    //if (this.selectedViewId && this.trees[this.selectedViewId])
                    //  this.showProps(this.trees[this.selectedViewId])
                    if (this.selectedViewId)
                        setTimeout(() => {
                            this.selectNode(this.selectedViewId, true);
                        }, 1000);
                    return;
                    this.container.html("");
                    this.renderNode(this.rootNode);
                }// else this.selectedViewId = undefined;
            }
        });
        this.createSocket();
    }

    calcPath(viewId: string) {
        const pathNodes: ElementTool[] = [];
        let current = this.trees[viewId];

        // walk up the tree to the root
        while (current) {
            pathNodes.unshift(current); // add to start of array
            const parentId = current.props._parent_viewId;
            current = parentId ? this.trees[parentId] : undefined;
        }

        this.path.html("");
        this.path.append(...pathNodes.map(x => $("<span />", {
            textContent: x.name, "data-id": x.props._viewId, onclick: () => {
                this.selectNode(x.props._viewId, true);
            }
        })))
    }

    collabsNode(viewId: string) {
        let node = this.trees[viewId];
        if (!node)
            return;
        this.collapsedNodes[viewId] = !this.collapsedNodes[viewId];
        if (this.collapsedNodes[viewId])
            this.container.findAll(`li.node-container[data-id="${viewId}"] > ul`).forEach(x => x.remove());
        this.renderNode(node);

    }

    createSocket() {
        const item = {
            worker: undefined,
            socket: undefined as WebSocket,
            socketIsOpen: false,

            postMessage: (type, payload) => {
                if (item.socketIsOpen) {
                    item.socket.send(JSON.stringify({ type, payload, __To: "APP" }));
                }
            },
            handChake: () => {
                if (item.socketIsOpen) {
                    item.socket.send(JSON.stringify({ type: "REGISTER", clientType: "HTML" }));
                    item.socket.send(JSON.stringify({ type: "TREE", __To: "APP" }));
                }
            },

            open: () => {
                if (item.worker) item.worker.terminate();
                if (item.socket) item.socket.close();

                item.worker = new Worker("web/worker.js");
                item.worker.onmessage = e => {
                    //    setTimeout(() => parseMessage(e), 0);
                    this.parseMessage(e)
                }
                item.worker.onerror = e => {
                    try {
                        console.error(e);
                    } catch { }
                }

                item.socket = new WebSocket("ws://localhost:7780");
                item.socket.binaryType = "arraybuffer";

                item.socket.onopen = () => {
                    item.socketIsOpen = true;
                    item.handChake();

                };

                item.socket.onclose = () => (item.socketIsOpen = false);

                // Send raw data to worker (no JSON.parse in main thread)
                item.socket.onmessage = e => item.worker.postMessage(e.data);
            },
        };

        this.socket = item;
    }


    clear() {
        this.container.html("");
        this.trees = {};
        this.rootNode = {} as any;
        this.childRelations.clear();
        console.log("item Cleared")
        return this;
    }

    selectNode(viewId: string, scrollToView?: boolean) {
        this.container.findAll(`div.node.selected, span.node-name.selected`).forEach(x => x.removeClass("selected"));
        let htmlNode = this.container.findAll(`div.node[data-id="${viewId}"], span.node-name[data-id="${viewId}"]`);
        htmlNode.forEach(x => x.addClass("selected"));
        if (htmlNode.length > 0 && scrollToView)
            htmlNode[0]?.scrollIntoViewIfNeeded(this.container.parent());
        if (this.selectedViewId != viewId || this.propsPanel.find(".empty"))
            this.showProps(this.trees[viewId]);

        this.selectedViewId = viewId;
        this.calcPath(viewId);
        this.path.find(`span[data-id="${viewId}"]`).addClass("selected")
    }

    showProps(node?: ElementTool) {
        this.propsPanel.innerHTML = '';
        if (!node) {
            this.propsPanel.html('<div class="empty">No node selected</div>')
            //  this.propsPanel.innerHTML = '<div class="empty">No node selected</div>';
            return;
        }


        const keys = node.props ? Object.keys(node.props) : [];
        if (keys.length === 0) {
            this.propsPanel.html('<div class="empty">No props</div>')
            // propsCard.innerHTML = '<div class="empty">No props</div>';
        } else {
            this.propsPanel.html("")
            keys.forEach(key => {
                let value = node.props[key];
                let readOnly = viewer.rootNode.readOnlyProps?.some(x => x.startsWith(key))
                if (!viewer.ignoreAttrs.includes(key) && (key == "style" || !Array.isArray(value))) {

                    if (key == "style" && Array.isArray(value)) {
                        value = value.reduce((c, v) => ({ ...c, ...(v ?? {}) }), {});
                    }

                    try {
                        if (typeof value == "object" && key !== "children") {
                            this.inputForm(key, value, node.props._viewId, false, undefined, readOnly)
                        }
                        else if (typeof value !== "object") {
                            this.inputForm(key, value, node.props._viewId, true, undefined, readOnly)
                        }
                    } catch (e) {
                        console.error(e)
                        //  v.textContent = String(value);
                    }
                }
            });
        }
    }

    objectToString(item: object, lvl: number = 0) {
        if (!item)
            return "";
        let keys = Object.keys(item);
        let str = [];
        for (let key of keys) {
            if (this.ignoreAttrs.includes(key) || key == "children")
                continue;

            let value = item[key] ?? "";
            if (value == "")
                continue;
            if (value && typeof value == "object") {
                if (Array.isArray(value) || Object.keys(value).length > 20 || lvl > 0) {
                    if (lvl == 0)
                        str.push(`${key}="Big(Object)"`);
                }
                else {
                    value = this.objectToString(value, lvl + 1);
                    if (value != "")
                        str.push(`${key}="${value}"`);
                }
            } else
                str.push(`${key}${lvl == 0 ? "=" : ":"}${lvl == 0 ? '"' : ""}${value}${lvl == 0 ? '"' : ""}`);
        }
        return str.join(lvl == 0 ? " " : "; ");
    }

    renderAttrs(node: ElementTool) {
        const props = $("<span />", { className: "node-props" });
        props.html(this.objectToString(node.props));
        return props;
    }

    validateRelations(node: ElementTool) {
        if (!this.childRelations.has(node.props._viewId))
            this.childRelations.set(node.props._viewId, new Map());
        if (!this.childRelations.has(node.props._parent_viewId)) {
            this.childRelations.set(node.props._parent_viewId, new Map([[node.props._parent_viewId, node]]));
        } else if (!this.childRelations.get(node.props._parent_viewId).has(node.props._viewId))
            this.childRelations.get(node.props._parent_viewId).set(node.props._viewId, node);
        this.trees[node.props._viewId] = node;

    }

    validateNodeClosers(nodeui: IDomElement, node: ElementTool, updateProps: boolean = true) {

        const collabsed = this.collapsedNodes[node.props._viewId];
        let children = this.childRelations.get(node.props._viewId);
        let nodeText = nodeui.parent("li").find(":scope > .node-text");
        let nodeName = nodeui.find(".node-name") ?? $("<span />", { className: "node-name", textContent: `<${node.name}` }).mount(nodeui);
        let props = updateProps ? this.renderAttrs(node) : undefined;
        let nodeCloser = nodeui.find(".node-closer") ?? $("<span />", { className: "node-closer", textContent: ">" }).mount(nodeui);
        let elementCloser = nodeui.parent("li").find(`.node-name[data-id="${node.props._viewId}"]`) ?? (!collabsed ? $("<span />", { className: "node-name", "data-id": node.props._viewId, textContent: `</${node.name}>` }) : undefined);
        let expander = nodeui.parent().find(".expander") ?? $("<span />", { className: "expander", id: node.props._viewId, innerHTML: "<img src='arrowDown.svg' />" });
        const hasChildren = nodeText || children.size > 0;
        if (updateProps) {
            nodeui.remove(".node-props").insertAt(props, 1);

        }

        if ((!hasChildren && !collabsed) || this.rootNode == node)
            expander.remove();
        else if (!expander.added())
            nodeui.parent().prepend(expander);
        if (expander.added())
            collabsed ? expander.addClass("collabsed") : expander.removeClass("collabsed");
        if (hasChildren && nodeCloser.text() != ">" && !collabsed)
            nodeCloser.text(">");
        else if ((!hasChildren || collabsed) && nodeCloser.text() != "/>")
            nodeCloser.text(" />");
        if (!collabsed) {
            if (!hasChildren && elementCloser.added())
                elementCloser.remove();
            else if (hasChildren && !nodeui.parent("li").children.reverse()[0].hasClass("node-name"))
                elementCloser.mount(nodeui.parent("li"));
        } else if (elementCloser?.added())
            elementCloser.remove()

        if (this.selectedViewId == node.props._viewId) {
            if (!nodeui.parent().hasClass("selected")) {
                this.selectNode(node.props._viewId, false);
                /*   nodeui.parent().addClass("selected");
                   elementCloser?.addClass("selected");
                   this.showProps(node);*/
            }
        }

    }

    async deleteNode(viewId: string) {
        this.container.remove(`[data-id="${viewId}"]`); // remove all html
        // 2. Delete node data
        delete this.trees[viewId];
        this.childRelations.delete(viewId);

        // 3. Find and recursively delete all child nodes
        for (const x of Object.values(this.trees)) {
            if (x.props._parent_viewId === viewId) {
                this.deleteNode(x.props._viewId); // recursive call
            }
        }
    }

    renderNode(node: ElementTool, parentCollabsed: boolean = false) {
        try {
            const firstNode = this.container.children.length <= 0;
            this.validateRelations(node);
            if (firstNode && node.name == "ThemeContextAPP") {
                this.rootNode = node;
                if (node.props.platform)
                    this.platform = node.props.platform;

            } else if (firstNode)
                return;

            const parentNode = firstNode ? undefined : this.trees[node.props._parent_viewId];
            if ((!firstNode && !parentNode)  || this.collapsedNodes[node.props._parent_viewId]) {
                return;
            }

            let collabed = this.collapsedNodes[node.props._viewId];


            let children = !collabed ? this.childRelations.get(node.props._viewId) : new Map();
            let parentUi = firstNode ? $("<ul />", { className: "rn-tree" }).mount(this.container) : $(`li[data-id="${node.props._parent_viewId}"]`)
            if (!parentUi && !firstNode) {
                //   this.renderNode(parentNode);
                //  console.warn("view parent not found", node.props._viewId, node.props._parent_viewId)
                return;

            }
            const text = node.props.children && typeof node.props.children == "string" ? node.props.children : undefined;
            let ui = firstNode ? undefined : $(`ul[data-id="${node.props._viewId}"]`) ?? $("<ul />", {
                className: "rn-tree",
                "data-id": node.props._viewId,
                "data-index": node.props._elementIndex ?? 0
            });
            if (ui && !ui.added()) {
                let index = node.props._elementIndex;
                let items = parentUi.findAll(":scope > ul");
                let target = items.find(c => {
                    return parseInt(c.dataset.index) > index
                });
                if (target) target.el.before(ui.el);
                else parentUi.append(ui);
            }
            // add to parent 
            if (!firstNode) {
                this.childRelations.get(node.props._parent_viewId).set(node.props._viewId, node);
            }
            let nodeContainer = $(`li[data-id="${node.props._viewId}"]`) ?? $("<li />", {
                className: "node-container",
                "data-id": node.props._viewId
            }).mount(ui ?? parentUi);


            const isNew = !nodeContainer.added(); // already in the dom
            if (!nodeContainer.added()) // later validate index
                parentUi.insertAt(nodeContainer, node.props._elementIndex);

            let nodeUi = nodeContainer.find(`div.node[data-id="${node.props._viewId}"]`) ?? $("<div />", {
                className: "node",
                "data-id": node.props._viewId,
            }).append($("<div />", { className: "label" })).mount(nodeContainer);



            let childrenTree = nodeContainer.find("ul.rn-tree");

            if (!isNew && children.size <= 0 && childrenTree) // if all children are removed 
                childrenTree.remove();

            if (text) {

                let textNode = nodeContainer.find(":scope div.node-text") ?? $("<div />", { className: "node-text" }).mount(nodeContainer);
                if (collabed)
                    textNode.remove();
                else
                    if (textNode.text() != text)
                        textNode.text(text);
            }

            if (children.size > 0 && !collabed) {
                if (!childrenTree)
                    childrenTree = $("<ul />", { className: "rn-tree" }).mount(nodeContainer);
                let ids = childrenTree.findAll("li").map(({ id }) => id);
                ids.filter(id => !children.has(id)).forEach(x => childrenTree.find(`li[data-id="${x}"]`)?.remove());
                children.forEach((value, key) => {
                    if (!ids.includes(value.props._viewId)) // render only new items, updated items will render them self
                        (this.renderNode(value));
                });
            }

            this.validateNodeClosers(nodeUi.find(".label"), node);
            if (!firstNode)
                this.validateNodeClosers($(`li[data-id="${node.props._parent_viewId}"]`).find(".label"), parentNode, false); // if children added or remove, make sure tags is right


        } catch (e) {
            console.error(e, node)
        }
        return this;
    }
}
