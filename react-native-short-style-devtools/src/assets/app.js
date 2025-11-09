const ignoreAttrs = ["_viewId", "_parent_viewId", "_elementIndex"]
const settings = Object.assign({
    elementSelection: false,
    zoom: 1,
    autoSave: true,
    webDevToolsIsOpen: true,
    consoleData: {
        errors: [],
        warnings: [],
        infos: [],
        logs: [],
    }
}, window.appSettings ?? {});


const propsChanged = {
    data: {},
    has: (key) => {
        let result = Object.keys(propsChanged.data).map(x => {
            if (x.startsWith(key))
                return propsChanged.data[x];
            return undefined;
        }).filter(x => x !== undefined);
        return result;
    },
    add: (id, func) => {
        propsChanged.data[id] = () => {
            func(settings);
        }

        return propsChanged;
    },
    remove: (id) => {
        if (propsChanged.data[id])
            delete propsChanged.data[id];
        return propsChanged;
    }
};

propsChanged.add("autoSave.Click", (settings) => {
    if (settings.autoSave)
        document.querySelector(".autoSave").classList.add("selected");
    else document.querySelector(".autoSave").classList.remove("selected");
})

propsChanged.add("autoSave.Save", (settings) => {
    if (!settings.autoSave && selectedViewId)
        document.querySelector(".save")?.classList.remove("hidden");
    else document.querySelector(".save")?.classList.add("hidden");
})

function safeStringify(obj, space = 2) {
    const seen = new WeakSet();
    return JSON.stringify(obj, function (key, value) {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
        }
        return value;
    }, space);
}

let ques = [];
const parseMessage = (event) => {
    try {
        let item = event?.data ?? event;
        if (typeof item == "string")
            item = JSON.parse(item);
        if (!item) return;

        item = Array.isArray(item) ? item : [item];
        if (htmlScrollPosition.rendering) {
            ques.push(...item);
            return;
        }
        for (let msg of item) {
            if (!msg || !msg.type)
                continue;
            if (msg.__To)
                delete msg.__To;
            if (msg.type === 'TREE_DATA') {
                htmlScrollPosition.loading(true);
                if (msg.settings) {
                    Object.assign(settings, msg.settings);
                    parseSetting(false)
                }
                // full replace
                renderPayload(msg);
            }
            else if (msg.type == "PROP") {
                settings[msg.payload.key] = msg.payload.value;
                parseSetting(false)
            }
            else if (msg.type === 'PATCH_NODE') {
                htmlScrollPosition.loading(true)
                // msg.payload = { _viewId: number, props?: object, children?: array }
                apply_viewIdPatch(msg.payload);
            } else if (msg.type === "PATCH_DELETE") {
                htmlScrollPosition.loading(true)
                deleteNode(msg.payload) // viewid
            } else if (msg.type === "PATCH_SELECT") {
                selectById(msg.payload) // viewId
            } else if (msg.type == "ERROR") {
                settings.consoleData.errors.push(msg);
                parseConsole(msg);
            } else if (msg.type == "LOG") {
                settings.consoleData.logs.push(msg);
                parseConsole(msg);
            } else if (msg.type == "INFO") {
                settings.consoleData.infos.push(msg);
                parseConsole(msg);
            } else if (msg.type == "WARNING") {
                settings.consoleData.warnings.push(msg);
                parseConsole(msg);
            }
        }
    } catch (e) {
        console.error(e, event.data)
    } finally {

        if (ques.length > 0) {
            let dt = [...ques];
            ques = [];
            htmlScrollPosition.rendering = false;
            parseMessage(dt);
        } else {
            if (htmlScrollPosition.rendering)
                htmlScrollPosition.restore();
        }

    }
}

document.querySelector(".modal .title .btn").onclick = () => {
    modal.hide();
}

const sleep = (ms) => new Promise(r => setTimeout(() => {
    r();
}, ms))
const modal = {
    content: document.querySelector(".modal .center"),
    container: document.querySelector(".modal"),
    title: document.querySelector(".modal .title span"),
    show: async () => {
        modal.container.parentElement.style.display = "flex";
        await sleep(50);
        modal.container.classList.add("active");

        return modal;
    },
    hide: async () => {
        modal.content.textContent = "";
        modal.container.classList.remove("active");
        await sleep(350);
        modal.container.parentElement.style.display = "none";
        modal.title.parentElement.querySelectorAll(".btn:not(.close)").forEach(x => x.remove());
        return modal;
    }
}

modal.hide();

const htmlScrollPosition = {
    rendering: false,
    loaderEl: document.querySelector(".loader"),
    loading: (value) => {
        clearTimeout(htmlScrollPosition.timer);
        htmlScrollPosition.loaderEl.style.visibility = value ? "visible" : "hidden";
        htmlScrollPosition.rendering = value;
    },
    timer: undefined,
    data: [], //left, top,
    save: (force) => {
        if (htmlScrollPosition.rendering && !force)
            return;
        const el = document.querySelector(".container[data-type=Elements] > .left");
        htmlScrollPosition.data = [el.scrollLeft, el.scrollTop];
    },
    restore: () => {
        clearTimeout(htmlScrollPosition.timer);
        htmlScrollPosition.timer = setTimeout(() => {
            if (htmlScrollPosition.data.length < 2) {
                htmlScrollPosition.loading(false)
                return;
            }
            const el = document.querySelector(".container[data-type=Elements] > .left");
            el.scrollLeft = htmlScrollPosition.data[0];
            el.scrollTop = htmlScrollPosition.data[1];
            htmlScrollPosition.loading(false)
        }, 1000);
    }
}

document.querySelector(".container[data-type=Elements] > .left").addEventListener("scroll", () => {
    htmlScrollPosition.save();
});

var socketIsOpen = false;
const mock = () => {
    const socket = new WebSocket("ws://localhost:7780");

    socket.onopen = () => {
        socketIsOpen = true;
        socket.send(JSON.stringify({ type: "REGISTER", clientType: "HTML" }));
        socket.send(JSON.stringify({ type: "TREE", __To: "APP" }));
    };

    socket.onclose = () => {
        socketIsOpen = false;
    }

    socket.onmessage = (e) => {
        requestIdleCallback(() => {
            parseMessage(e);
        })


    };

    return {
        postMessage: (type, payload) => {
            socket.send(JSON.stringify({ type, payload, __To: "APP" }));
        }

    }
}
const vscode = mock();
const tabs = document.querySelector(".tabs");
tabs.querySelectorAll(".header p").forEach(x => {
    x.addEventListener("click", (e) => {
        tabs.querySelector(".header .selected")?.classList.remove("selected");
        tabs.querySelector(".active")?.classList.remove("active");
        x.classList.add("selected");
        let value = x.getAttribute("data-value") ?? x.textContent;
        tabs.querySelector(`.content> div[data-type=${value}]`)?.classList.add("active");
        searchInput.placeholder = value.startsWith("Elements") ? "Search nodes (name or prop)" : "Search logs";
        if (value.startsWith("Elements"))
            document.querySelector(".clearLogs").style.display = "none";
        else document.querySelector(".clearLogs").style.display = "inline-flex";
        searchedItems = {};
    })
});

document.querySelector("#zoom").onchange = () => {
    let value = parseFloat(document.querySelector("#zoom").value);
    if (value >= 1) {
        settings.zoom = value;
        sendSettigs("zoom");
        parseSetting()
    }
}

document.querySelectorAll("[data-props]:not([data-props=''])").forEach(x => {
    x.addEventListener("click", function (e) {
        sendSettigs(x);
    })
});

document.querySelector(".reload").addEventListener("click", () => {
    vscode.postMessage("RELOAD", true);
});

document.querySelectorAll(".lst li a").forEach(x => {
    x.addEventListener("click", () => {
        document.querySelector(".lst li .selected")?.classList.remove("selected");
        x.classList.add("selected");
        parseSetting();
    });
});

document.querySelector(".clearLogs").addEventListener("click", () => {
    settings.consoleData.errors = [];
    settings.consoleData.infos = [];
    settings.consoleData.warnings = [];
    settings.consoleData.logs = [];
    parseConsole();
});

const sendSettigs = (x) => {
    let htmlObject = x.getAttribute != undefined;
    let key = htmlObject ? x.getAttribute("data-props") : x;
    value = settings[key];
    if (typeof value === "boolean")
        value = !value;
    else if (htmlObject) value = x.getAttribute("data-value")
    settings[key] = value;
    if (htmlObject)
        x.setAttribute("data-value", value)
    propsChanged.has(key).forEach(x => x());
    vscode.postMessage("PROP", { key, value });
}

let selectedConsole = undefined;
let consoleData = undefined;

const parseConsole = (renderedItem) => {
    renderedItem = (Array.isArray(renderedItem) ? renderedItem : [renderedItem]).filter(x => x != undefined)
    const createConsoleItem = ({ type, payload }) => {
        let text = payload;
        if (text && typeof text == "object" && Array.isArray(text) && text.length == 1) {
            text = payload[0];
        }

        if (typeof payload == "object") {
            text = safeStringify(text, 2);
        }

        if (text.startsWith('"'))
            text = text.substring(1);
        if (text.endsWith('"'))
            text = text.substring(0, text.length - 1)

        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.setAttribute("id", Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36));
        pre.className = `console_${type}`.toLowerCase();
        code.innerHTML = text.replace(/\\n/g, '\n');
        pre.appendChild(code);
        pre.onclick = () => {
            if (!pre.classList.contains("expand"))
                pre.classList.add("expand");
        }
        return pre;
    }

    let click = (e) => {
        document.querySelector(".lst li .selected")?.classList.remove("selected");
        e.target.classList.add("selected");
        parseConsole();
    }
    const tab = document.querySelector("p[data-value=Console]");
    const messages = document.querySelector(".messages");
    const infos = document.querySelector(".infos");
    const logs = document.querySelector(".logs");
    const errors = document.querySelector(".errors");
    const warnings = document.querySelector(".warnings");

    messages.onclick = infos.onclick = logs.onclick = errors.onclick = warnings.onclick = click;
    const cnl = document.querySelector("[data-type='Console']");
    const leftPanel = cnl.querySelector(".left .tree-root");
    const selectedCnl = document.querySelector(".lst li .selected") ?? document.querySelector(".lst li:first-child");
    selectedCnl.classList.add("selected");
    const scrolledToBottom = leftPanel.scrollTop === (leftPanel.scrollHeight - leftPanel.offsetHeight);
    leftPanel.appendElement = (e) => {
        leftPanel.appendChild(e);
        if (e.querySelector("code") && e.querySelector("code").offsetHeight <= 70)
            e.classList.add("expand")
    }

    if (renderedItem.length <= 0 || consoleData == undefined) {
        consoleData = {
            errors: settings.consoleData.errors.map(x => createConsoleItem(x)),
            info: settings.consoleData.infos.map(x => createConsoleItem(x)),
            warnings: settings.consoleData.warnings.map(x => createConsoleItem(x)),
            log: settings.consoleData.logs.map(x => createConsoleItem(x)),
        };
        // let scrollTop = leftPanel.scrollTop;
        let tempSelectedConsole = "";
        leftPanel.innerHTML = "";
        if (selectedCnl.classList.contains("messages")) {
            tempSelectedConsole = "messages";
            [...consoleData.errors, ...consoleData.info, ...consoleData.log, ...consoleData.warnings].forEach(x => leftPanel.appendElement(x));
        }

        if (selectedCnl.classList.contains("logs")) {
            tempSelectedConsole = "logs";
            consoleData.log.forEach(x => leftPanel.appendElement(x));
        }

        if (selectedCnl.classList.contains("errors")) {
            tempSelectedConsole = "errors";
            consoleData.errors.forEach(x => leftPanel.appendElement(x));
        }

        if (selectedCnl.classList.contains("warnings")) {
            tempSelectedConsole = "warnings";
            consoleData.warnings.forEach(x => leftPanel.appendElement(x));
        }

        if (selectedCnl.classList.contains("infos")) {
            tempSelectedConsole = "infos";
            consoleData.info.forEach(x => leftPanel.appendElement(x));
        }

        // if (selectedConsole == tempSelectedConsole)
        //   leftPanel.scrollTop = scrollTop; // retain the position when updating

        leftPanel.children[leftPanel.children.length - 1]?.scrollIntoView();
        selectedConsole = tempSelectedConsole;
    } else {
        for (let x of renderedItem) {
            const item = createConsoleItem(x);
            switch (x.type.toLowerCase()) {
                case "log":
                case "logs":
                    consoleData.log.push(item);
                    break;
                case "info":
                case "infos":
                    consoleData.info.push(item);
                    break;
                case "warnings":
                case "warning":
                    consoleData.warnings.push(item);
                    break;
                case "errors":
                case "error":
                    consoleData.errors.push(item);
            }

            leftPanel.appendElement(item);
            if (scrolledToBottom)
                item.scrollIntoView();
        }
    }

    if (tab)
        tab.querySelector("span").textContent = consoleData.errors.length + consoleData.info.length + consoleData.log.length + consoleData.warnings.length;

    if (messages) {
        messages.querySelector("span").textContent = consoleData.errors.length + consoleData.info.length + consoleData.log.length + consoleData.warnings.length;
    }
    if (logs) {
        logs.querySelector("span").textContent = consoleData.log.length;

    }

    if (infos) {
        infos.querySelector("span").textContent = consoleData.info.length;
    }

    if (errors) {
        errors.querySelector("span").textContent = consoleData.errors.length;
    }

    if (warnings) {
        warnings.querySelector("span").textContent = consoleData.warnings.length;
    }
}

const parseSetting = (_parseConsole) => {
    for (let key in settings) {
        let item = document.querySelector(`[data-props='${key}']`);
        if (item)
            item.setAttribute("data-value", settings[key]);
    }
    document.querySelectorAll(".container > .left").forEach(x => x.style.zoom = settings.zoom);
    if (_parseConsole)
        parseConsole();
}
parseSetting(true);



function inputForm(propKey, jsonItem, viewId, isSingleValue, parent, isReadOnly, parentKey) {
    const fullkeyName = parentKey ? `${parentKey}.${propKey}` : propKey;
    let item = Object.keys(typeof jsonItem == "object" ? jsonItem : [propKey].reduce((c, v) => {
        c[v] = jsonItem;
        return c;
    }, {})).map(x => {
        return [x ?? "", (typeof jsonItem == "object" ? jsonItem[x] ?? "" : jsonItem)];
    });



    if (!document.getElementById("styleDataListNames")) {
        let datalist = document.createElement("datalist");
        datalist.id = "styleDataListNames";
        window.RN_STYLE_PROPS.forEach(x => {
            let option = document.createElement("option");
            option.value = x.name;
            datalist.appendChild(option);

            if (x.values && Array.isArray(x.values)) {
                let values = document.createElement("datalist");
                values.id = x.name.toLowerCase();
                x.values.forEach(v => {
                    let option = document.createElement("option");
                    option.value = v;
                    values.appendChild(option);
                    document.body.appendChild(values);
                })
            }
        })
        document.body.appendChild(datalist);
    }

    const container = (typeof jsonItem === "object" ? document.createElement("div") : document.querySelector(".props") ?? document.createElement("div"));
    const buttons = document.createElement("div");
    buttons.className = "buttons";
    container.appendChild(buttons);
    container.className = "form " + (typeof jsonItem !== "object" ? "props" : "");



    function createwrapper(...childs) {
        let div = document.createElement("div");
        childs.forEach(x => div.appendChild(x))
        return div;
    }

    const save = (dataOnly) => {
        htmlScrollPosition.loading(true);
        const getKeyValueInput = (el) => {
            let result = [];
            for (let item of [...el.children]) {
                const isDeleted = item.closest(".deleted")
                if (item.classList.contains("buttons")) {
                    let dataFor = item?.querySelector(".title")?.getAttribute("data-for");
                    let dataKey = el.parentNode?.querySelector(":scope > .buttons > .title")?.getAttribute("data-for");
                    if (item.querySelectorAll("input").length > 0 || !dataFor)
                        continue;


                    result.push({ key: dataFor, value: {}, dataKey: dataKey });
                    continue;

                }
                if (item.classList.contains("form")) {
                    result.push(...getKeyValueInput(item))
                    continue;
                }

                let inputs = [...item.querySelectorAll("input")];
                //  if (inputs.length < 2)
                //  continue;

                let dataKey = el.getAttribute("data-key");
                let dataFor = el.parentNode?.querySelector(":scope > .buttons > .title")?.getAttribute("data-for");
                if (dataKey && dataFor) {
                    dataKey = `${dataFor}.${dataKey}`
                }

                if (!dataKey && inputs.length == 0)
                    continue;
                if (inputs[0]?.value.trim().length > 0)
                    result.push({ key: inputs[0]?.value.trim(), value: inputs[1]?.value, dataKey: dataKey, isDeleted });
            }

            return result;

        }

        let inputContainers = [...document.querySelector(".props-panel").children].map(getKeyValueInput).flatMap(x => x).sort((a, b) => {
            const aIsObj = typeof a.value === "object" && a.value !== null;
            const bIsObj = typeof b.value === "object" && b.value !== null;

            if (aIsObj && !bIsObj) return -1; // a first
            if (!aIsObj && bIsObj) return 1;  // b first
            return 0; // keep order otherwise
        });
        let json = { _viewId: viewId };
        let deleteJson = {};
        const getDeletedJson = (item) => {
            if (item === null || typeof item !== "object") return item; // base case

            for (const key of Object.keys(item)) {
                const value = item[key];

                if (value === undefined) {
                    delete item[key];
                    continue;
                }

                if (typeof value === "object") {
                    const cleaned = getDeletedJson(value);
                    if (cleaned === undefined || (typeof cleaned === "object" && Object.keys(cleaned).length === 0)) {
                        delete item[key];
                    } else {
                        item[key] = cleaned;
                    }
                }
            }

            return Object.keys(item).length > 0 ? item : undefined;
        };

        for (let data of inputContainers) {

            let key = data.key.trim();
            let value = data.value;
            if (typeof value == "string" && /^[0-9.,]*$/g.test(value)) {
                value = Number(value);
            }

            if (typeof value == "string" && ["false", "true"].includes(value.toLowerCase()))
                value = eval(value);
            if (data.dataKey && data.dataKey != "") {
                let item = json;
                let item2 = deleteJson;
                let keys = data.dataKey.split(".");
                keys.forEach(x => {
                    if (item[x] == undefined)
                        item[x] = {};
                    if (item2[x] == undefined)
                        item2[x] = {};
                    item2 = item2[x];
                    item = item[x]
                });

                if (data.isDeleted) {
                    if (item[key] == undefined)
                        item2[key] = value;
                }
                else {
                    if (item2[key] != undefined)
                        delete item2[key];
                    item[key] = value;
                }
            } else {
                if (data.isDeleted) {
                    if (json[key] == undefined)
                        deleteJson[key] = value;
                }
                else {
                    if (deleteJson[key] != undefined)
                        delete deleteJson[key];
                    json[key] = value;
                }
            }
        }
        if (!dataOnly)
            vscode.postMessage('SAVE_NODE_PROP', { ...json, _deletedItems: getDeletedJson(deleteJson) });
        htmlScrollPosition.loading(false);
        return json;
    }



    function addInput(key, index, prependToChild) {
        let colType = window.RN_STYLE_PROPS.find(x => x.name.toLowerCase() === key.toLowerCase())?.type ?? "text";
        if (colType === "number")
            colType = "number";
        else if (colType != "color") colType = "text";
        let div = document.createElement("div");
        let input = document.createElement("input");

        let timer = undefined;

        const onChange = (e) => {
            if (!settings.autoSave)
                return;
            clearTimeout(timer);
            timer = setTimeout(() => {
                let inputs = e.target.parentElement.parentElement.querySelectorAll("input");
                if (inputs.length < 2)
                    return;
                if (inputs[1].readOnly)
                    return;
                if (inputs[0].value.length > 0 && inputs[1].value.length > 0)
                    save();
            }, 500);
        }
        input.type = "text";
        input.class
        input.value = item[index][0];
        input.readOnly = typeof jsonItem !== "object" || key.length > 0 || isReadOnly;
        input.setAttribute("name", key);
        input.placeholder = "key";
        input.onchange = onChange;


        if (propKey === "style" || !container.classList.contains("props")) {
            input.setAttribute("list", "styleDataListNames");
        }

        div.appendChild(createwrapper(input));

        let inputValue = document.createElement("input");
        inputValue.type = colType;
        inputValue.disabled = isReadOnly;
        inputValue.value = colType == "color" ? window.toHex(item[index][1]) : item[index][1];
        inputValue.setAttribute("name", `${key}_value`);
        inputValue.readOnly = isReadOnly;
        inputValue.placeholder = "value";
        inputValue.setAttribute("value", colType == "color" ? window.toHex(item[index][1]) : item[index][1]);
        inputValue.onchange = onChange;


        if (item[index][0].trim() !== "" && document.querySelector("datalist#" + item[index][0].trim().toLowerCase())) {
            inputValue.setAttribute("list", key.toLowerCase());
        }

        if (colType == "color" && !isReadOnly) {
            let inputValue2 = document.createElement("input");
            inputValue2.type = "text";
            inputValue2.value = item[index][1];
            inputValue2.setAttribute("name", `${key}_value`);
            inputValue2.placeholder = "value";
            inputValue2.onchange = inputValue.onchange = (e) => {
                let inputs = e.target.parentElement.querySelectorAll("input");
                inputs.forEach(x => {
                    if (x !== e.target && x.value !== e.target.value)
                        x.value = window.toHex(e.target.value)
                });
                onChange(e)
            };
            div.appendChild(createwrapper(inputValue, inputValue2));
        } else div.appendChild(createwrapper(inputValue));

        input.addEventListener("input", () => {
            const id = input.value.replace(/\s+/g, "-").toLowerCase();
            if (id !== "" && document.querySelector("datalist#" + id.toLowerCase())) {
                inputValue.setAttribute("list", id.toLowerCase());
            }
        });

        inputValue.addEventListener("input", () => {
            inputValue.setAttribute("value", inputValue.value);
        });

        if (!isSingleValue && !isReadOnly) {
            let btn = document.createElement("button");
            btn.textContent = "-";
            btn.className = "btn";
            btn.onclick = function () {
                item.splice(index, 1)
                div.classList.add("deleted");
                let deletedLine = document.createElement("line");
                deletedLine.classList.add("deletedProp");
                div.prepend(deletedLine);
                div.querySelectorAll("input").forEach(x => x.setAttribute("readonly", true));
                if (settings.autoSave)
                    save();
            }

            div.appendChild(btn);
        }
        if (prependToChild)
            container.prepend(div);
        else container.appendChild(div);

        return input;
    }


    let label = document.createElement("p");
    label.textContent = typeof jsonItem == "object" ? propKey : "Props";
    label.className = `title${parent ? " subtitle" : ""}`;
    if (typeof jsonItem == "object")
        label.setAttribute("data-for", propKey);
    buttons.appendChild(label);
    const btnContainers = document.createElement("div");
    btnContainers.style.gap = "5px";
    buttons.appendChild(btnContainers);


    // add new key
    if (!isSingleValue && !isReadOnly) {
        let btn = document.createElement("button");
        btn.textContent = "+";
        btn.className = "btn";
        btn.onclick = function () {
            item.push(["", ""]);
            addInput("", item.length - 1, true)?.focus();
        }
        btnContainers.appendChild(btn);

    }



    if (item.length > 0 && !document.querySelector(".props-panel .save")) {
        // save 
        let btn = document.querySelector(".save");
        btn.onclick = function () {
            // save to 
            save();
        }

        if (!settings.autoSave)
            btn.classList.remove("hidden");
        else btn.classList.add("hidden");


        btn = document.querySelector(".json");
        btn.onclick = function () {
            let json = save(true);
            let copy = document.createElement("button");
            copy.className = "btn copy";
            copy.innerHTML = `<img src="copy_content.svg" style="height:var(--pathHeight)" />`;
            copy.onclick = () => {
                navigator.clipboard.writeText(JSON.stringify(json, undefined, 4));
                flash(copy)
                flash(modal.content)
            }
            if (json.style) {
                let copyStyle = document.createElement("button");
                copyStyle.className = "btn copyStyle";
                copyStyle.innerHTML = `<img src="copy_content.svg" style="height:var(--pathHeight)" /> Style`;
                copyStyle.onclick = () => {
                    navigator.clipboard.writeText(JSON.stringify(json.style, undefined, 4));
                    let prettyJsonStyle = modal.content.querySelector("pretty-json")?.shadowRoot?.querySelector("pretty-json[key=style]")?.shadowRoot?.querySelector(".row");
                    flash(copyStyle);
                    if (prettyJsonStyle)
                        flashByStyle(prettyJsonStyle);
                }
                modal.title.parentElement.appendChild(copyStyle);
            }
            let pre = document.createElement("pre");
            let code = document.createElement("pretty-json");
            code.setAttribute("expand", "5");
            code.textContent = JSON.stringify(json, undefined, 4);
            pre.appendChild(code);
            modal.title.parentElement.appendChild(copy);
            modal.title.textContent = "Json Viewer";
            modal.content.appendChild(pre);
            modal.show()
        }
        btn.classList.remove("hidden");
    } else {
        document.querySelectorAll(".save, .json").forEach(x => x.classList.add("hidden"));
        // propsChanged.remove("autoSave.Save");
    }
    for (let key of item) {
        if (key[1] && typeof key[1] === "object")
            inputForm(key[0], key[1], viewId, false, container, isReadOnly, fullkeyName);
        else
            addInput(key[0], item.indexOf(key));
    }

    if (typeof jsonItem === "object")
        container.setAttribute("data-key", propKey);

    (parent ?? document.querySelector(".props-panel")).appendChild(container);
}




// Current state
let currentTree = null;
let selectedNodePath = null; // array of indices path
let selectedViewId = null;
let flatNodes = []; // for counts/search
let searchValue = "";
const elementBy_viewId = new WeakMap(); // element -> _viewId
const _viewIdToElement = {}; // _viewId -> element
let searchedItems = {} // id and element
const treeRootEl = document.getElementById('treeRoot');
const propsPanel = document.getElementById('propsPanel');
const nodeCountEl = document.getElementById('nodeCount');
const searchInput = document.getElementById('search');

const renderPayload = (msg) => {
    currentTree = msg.payload;
    flatNodes = [];
    selectedNodePath = null;
    selectedViewId = null;
    showProps(); // clear
    renderTree();
}



// Delegated click handling for nodes
treeRootEl.addEventListener('click', (ev) => {
    const dataPath = ev.target.getAttribute("data-path");
    const nodeEl = ev.target.closest('.node') ?? document.querySelector(`div[data-path='${dataPath}']`);

    if (!nodeEl || (nodeEl.classList.contains("selected") && !ev.target.classList.contains('expander'))) return false
    const path = nodeEl.getAttribute('data-path');
    if (!path) return false
    const isExpander = ev.target.classList.contains('expander');
    if (isExpander) {
        toggleNode(path);
        return false
    }
    selectNode(path);
    return false
});

// Search
searchInput.addEventListener('input', (ev) => {
    searchValue = ev.target.value.trim().toLowerCase();
    searchedItems = {};
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // block unintended form behavior
        if (document.querySelector(".container.active")?.getAttribute("data-type") == "Elements" || !document.querySelector(".header p.selected") || document.querySelector(".header p.selected")?.getAttribute("data-value") == ("Elements"))
            searchHtml(true);
        else searchLogs(true);
        // put your logic here
    }
});

function flashByStyle(node, index, byStyle = {}) {
    if (!node || !(node instanceof HTMLElement)) return;

    // Save original styles so we can restore them later
    const originalTransition = node.style.transition;
    const originalBoxShadow = node.style.boxShadow;
    const originalBackground = node.style.backgroundColor;

    // Merge provided styles with default flash effect
    const flashStyle = {
        transition: "all 0.3s ease",
        boxShadow: "0 0 20px rgba(255, 255, 0, 0.9)",
        backgroundColor: "rgba(255, 255, 0, 0.2)",
        ...byStyle
    };

    // Apply flash styles
    Object.assign(node.style, flashStyle);

    // Animate back to normal
    setTimeout(() => {
        node.style.transition = "all 0.5s ease";
        node.style.boxShadow = originalBoxShadow || "";
        node.style.backgroundColor = originalBackground || "";
    }, 300);

    // Fully restore transition timing after flash ends
    setTimeout(() => {
        node.style.transition = originalTransition || "";
    }, 1000);
}


function flash(node, index, byStyle) {
    node.classList.add("flash")
    setTimeout(() => {
        node.classList.remove("flash")
    }, 1000);
}

function searchLogs(fromEnter) {
    let datas = document.querySelectorAll("div[data-type=Console] .left code");
    for (let item of datas) {
        const id = item.id;
        let txt = item.textContent.trim();
        if (txt.toLowerCase().includes(searchValue.toLowerCase()) && !(id && searchedItems[id]?.includes(txt))) {
            item.scrollIntoView({ block: "center", inline: "nearest" });
            flash(item);

            if (!searchedItems[id]) searchedItems[id] = [];
            searchedItems[id].push(txt);
            return;
        }
    }
}

function searchHtml(fromEnter = false) {
    if (searchValue.length <= 1) return;

    const nodes = [...document.querySelectorAll(".node-name,.node-props")];
    for (let item of nodes) {
        let txt = item.textContent.trim();
        let id = item._viewId;

        if (
            txt.toLowerCase().includes(searchValue.toLowerCase()) &&
            !(id && searchedItems[id]?.includes(txt))
        ) {
            item.scrollIntoView({ block: "center", inline: "nearest" });
            flash(item);

            if (!searchedItems[id]) searchedItems[id] = [];
            searchedItems[id].push(txt);
            return;
        }
    }

    // If nothing found or all cycled, reset on next Enter
    if (fromEnter) {
        searchedItems = {};
        searchHtml(false);
    }
}

// Utilities
function makePathAttr(pathArray) {
    return pathArray.join('.') ?? "0";
}

function getNodeByPath(pathString) {
    if (!currentTree) return null;
    if (!pathString) return null;
    const idxs = pathString.split('.').map(s => parseInt(s, 10));
    let node = currentTree;
    for (let i = 0; i < idxs.length; i++) {
        if (!node || !node.children) return null;
        node = node.children[idxs[i]];
    }
    return node;
}

function findNodeBy_viewId(node, _viewId) {
    if (node.props._viewId === _viewId) return node;

    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            const found = findNodeBy_viewId(child, _viewId);
            if (found) return found;
        }
    }
    return null;
}


function apply_viewIdPatch(patch) {
    if (!patch || !patch.props || typeof patch.props._viewId === 'undefined' || !currentTree) return;

    const _viewId = patch.props._viewId;
    const _parent_viewId = patch.props._parent_viewId;

    // Check if the node already exists in currentTree
    const existingNode = findNodeBy_viewId(currentTree, _viewId);

    if (existingNode) {
        // ✅ Update props only
        existingNode.props = {
            ...existingNode.props,
            ...patch.props,
        };

        // ✅ Replace children if provided
        if (Array.isArray(patch.children)) {
            existingNode.children = patch.children;
        }

        // ✅ Re-render ONLY this branch
        partialRerender(existingNode.props._parent_viewId);

        if (selectedViewId == existingNode.props._viewId && _viewIdToElement[selectedViewId])
            selectNode(_viewIdToElement[selectedViewId].getAttribute('data-path'))
        return;
    }

    // ✅ Otherwise it's a new node → insert under its parent
    insertNewNode(patch, _parent_viewId);
    if (selectedViewId == _viewId && _viewIdToElement[selectedViewId])
        selectNode(_viewIdToElement[selectedViewId].getAttribute('data-path'))
}


function renderTree() {
    treeRootEl.innerHTML = '';
    if (!currentTree) {
        treeRootEl.innerHTML = '<div class="empty">No component tree received yet.</div>';
        nodeCountEl.textContent = '0 nodes';
        return;
    }
    flatNodes = [];
    const ul = document.createElement('ul');
    ul.className = 'rn-tree';
    // We'll render children of the root inside top ul, but also show root node itself as first node
    const rootLi = renderNodeRecursive(currentTree, []);
    ul.appendChild(rootLi);
    treeRootEl.appendChild(ul);

    nodeCountEl.textContent = flatNodes.length + ' nodes';
    //scrollToItem();
}


function partialRerender(_parent_viewId) {
    const parentEl = _viewIdToElement[_parent_viewId];
    if (!parentEl) {
        renderTree();
        return;
    }

    const pathString = parentEl.getAttribute('data-path');
    let parentNode = getNodeByPath(pathString);
    if (!parentNode) {
        if (currentTree) {
            if (currentTree.children?.length <= 1)
                renderTree();
            else parentNode = currentTree;

        } else
            return;
    }

    const parentLi = parentEl.closest('li.node-container');
    if (!parentLi) return;

    const childUl = parentLi.querySelector('ul.rn-tree');

    // if (childUl) childUl.remove();

    if (parentNode?.children?.length > 0) {
        const newUl = document.createElement('ul');
        newUl.className = 'rn-tree';

        parentNode.children.forEach((child, idx) => {
            const childLi = renderNodeRecursive(
                child,
                [...pathString.split('.').map(Number), idx]
            );
            newUl.appendChild(childLi);
        });
        if (childUl)
            childUl.replaceWith(newUl)
        else {
            parentLi.appendChild(newUl);
            parentLi.querySelector(".node-closer").textContent = ">";
            let closer = document.createElement("span");
            closer.className = "node-name";
            closer.setAttribute("data-path", parentLi.querySelector(".node").getAttribute("data-path"));
            closer.textContent = `<${parentNode.name} />`
            parentLi.appendChild(closer);
        }
    } else childUl?.remove();


}

function deleteNode(_viewId) {
    // 1. Remove the actual DOM/element reference if it exists
    const el = _viewIdToElement[_viewId];
    if (el) {
        delete _viewIdToElement[_viewId]; // fixed wrong key usage
        el.remove();
    }

    // 2. Remove the node from your tree structure
    const node = findNodeBy_viewId(currentTree, _viewId);
    if (node && node.props._parent_viewId) {
        // find the parent node
        const parentNode = findNodeBy_viewId(currentTree, node.props._parent_viewId);
        if (parentNode && Array.isArray(parentNode.children)) {
            // remove the node from parent children
            parentNode.children = parentNode.children.filter(
                child => child.props._viewId !== _viewId
            );

            const parentEl = _viewIdToElement[node.props._parent_viewId];

            if (parentEl && parentNode.children.length <= 0) {
                parentEl.parentNode.querySelectorAll(".rn-tree, :scope > .node-name").forEach(x => x.remove());
                parentEl.querySelector(".node-closer").textContent = " />"
            }
        }


    } else if (node && !node.props._parent_viewId) {
        // this means it's the root or a top-level node
        // remove it directly from the top-level tree if needed
        if (Array.isArray(currentTree.children)) {
            currentTree.children = currentTree.children.filter(
                child => child.props._viewId !== _viewId
            );
        }
    }
}



function insertNewNode(patchNode, _parent_viewId) {
    if (!_parent_viewId) return;
    const _elementIndex = patchNode.props._elementIndex;
    const parentNode = findNodeBy_viewId(currentTree, _parent_viewId);
    if (!parentNode) return;

    if (!parentNode.children) parentNode.children = [];
    if (_elementIndex === undefined) {
        parentNode.children.push({
            name: patchNode.name,
            props: patchNode.props,
            children: patchNode.children || []
        });
    } else parentNode.children.splice(_elementIndex, 0, patchNode);
    // ✅ Just re-render this subtree
    partialRerender(_parent_viewId);
}



// Each node gets: data-path attribute (e.g., "0.1.2"), a .node class, optional "selected"
function renderNodeRecursive(node, pathArray) {
    const _viewId = node.props._viewId;
    const li = document.createElement('li');
    li.className = 'node-container';
    const nodeEl = document.createElement('div');
    nodeEl.className = 'node';
    let dataPath = makePathAttr(pathArray);

    nodeEl.setAttribute('data-path', dataPath);

    nodeEl._viewId = _viewId;
    elementBy_viewId.set(nodeEl, _viewId);
    _viewIdToElement[_viewId] = nodeEl;


    // determine if has children
    const hasChildren = node.children && node.children.length > 0;
    if (pathArray.length > 0) {

        const expander = document.createElement('span');
        expander.className = 'expander';
        expander.textContent = hasChildren ? (isCollapsed(pathArray) ? '▸' : '▾') : '';
        nodeEl.appendChild(expander);
    }

    const label = document.createElement('div');
    label.className = 'label';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'node-name';
    nameSpan.textContent = `<${node.name || '(anonymous)'}`;
    nameSpan._viewId = node.props._viewId;
    label.appendChild(nameSpan);

    const propsSpan = document.createElement('span');
    propsSpan.className = 'node-props';
    propsSpan._viewId = node.props._viewId;
    // Show some props preview if exists
    const propsPreview = summarizeProps(node.props);
    if (propsPreview && propsPreview.length > 0) {
        propsSpan.textContent = propsPreview;
        label.appendChild(propsSpan);
    }

    const labelCloser = document.createElement('span');
    labelCloser.className = 'node-closer';
    labelCloser.textContent = isCollapsed(pathArray) || !hasChildren ? " />" : ">";
    label.appendChild(labelCloser);

    nodeEl.appendChild(label);

    // If this node is selected, mark
    if (selectedNodePath === makePathAttr(pathArray)) {
        nodeEl.classList.add('selected');
    }

    li.appendChild(nodeEl);

    // Track flatNodes for search/metrics
    flatNodes.push({ path: makePathAttr(pathArray), node });

    // Children
    if (hasChildren) {
        // if collapsed => hide children
        if (!isCollapsed(pathArray)) {
            const childUl = document.createElement('ul');
            childUl.className = 'rn-tree';
            node.children.forEach((child, idx) => {
                const childLi = renderNodeRecursive(child, [...pathArray, idx]);
                childUl.appendChild(childLi);
            });
            li.appendChild(childUl);
            const nameSpanEnd = document.createElement('span');
            nameSpanEnd.className = 'node-name';
            nameSpanEnd.setAttribute('data-path', makePathAttr(pathArray));
            nameSpanEnd.textContent = `</${node.name || '(anonymous)'}>`;
            nameSpanEnd._viewId = node.props._viewId;
            li.appendChild(nameSpanEnd);
        }
    }

    // add data path attribute to the outermost node container for event delegation
    li.querySelector('.node').setAttribute('data-path', makePathAttr(pathArray));
    return li;
}

// simple collapsed state stored in a Set keyed by path strings
const collapsedSet = new Set();
function isCollapsed(pathArray) {
    const key = makePathAttr(pathArray);
    return collapsedSet.has(key);
}

function toggleNode(pathString) {
    if (!pathString) return;
    if (collapsedSet.has(pathString)) collapsedSet.delete(pathString);
    else collapsedSet.add(pathString);
    renderTree();
}

function pathName(pathString) {
    // Notify extension as before
    const viewPath = [];
    let tempNode = currentTree;
    const indices = pathString.split('.').map(s => parseInt(s, 10));
    for (let i = 0; i < indices.length + 1; i++) {
        if (!tempNode) break;
        viewPath.push(tempNode.name || '(anonymous)');
        tempNode = tempNode.children?.[indices[i]];
    }

    return viewPath;
}

function selectById(viewId) {
    let el = _viewIdToElement[viewId];
    if (el) {
        let path = el.getAttribute("data-path");
        if (path) {
            selectNode(path);
        }
        el.scrollIntoView({ block: "center", inline: "nearest" });
        setTimeout(() => {
            htmlScrollPosition.save(true)
        }, 100);
        flash(el);
    }
}

function selectNode(pathString) {
    document.querySelectorAll(".selected").forEach(x => x.classList.remove("selected"));
    const node = getNodeByPath(pathString);
    if (node) {
        selectedNodePath = pathString;
        //  renderTree();
        selectedViewId = node.props._viewId;
        showProps(node, pathString);
        document.querySelectorAll(`[data-path='${pathString}']`).forEach(x => x.classList.add("selected"))

        // notify extension
        // vscode.postMessage({ type: 'NODE_SELECTED', payload: { path: pathString, node } });
    }
}

function showProps(node, path) {
    propsPanel.innerHTML = '';
    if (!node) {
        propsPanel.innerHTML = '<div class="empty">No node selected</div>';
        return;
    }

    /* const header = document.createElement('div');
     header.className = 'props-card';
     header.innerHTML = `<h3>Selected: <span style="color:#fff">${node.name || '(anonymous)'}</span></h3>`;
     propsPanel.appendChild(header);*/
    (document.querySelector(".path") ?? {}).textContent = `${pathName(path).join(' > ')}`


    const keys = node.props ? Object.keys(node.props) : [];
    if (keys.length === 0) {

        // propsCard.innerHTML = '<div class="empty">No props</div>';
    } else {
        propsPanel.innerHTML = "";
        keys.forEach(key => {
            let value = node.props[key];
            let readOnly = currentTree.readOnlyProps?.some(x => x.startsWith(key))
            if (!ignoreAttrs.includes(key) && (key == "style" || !Array.isArray(value))) {

                if (key == "style" && Array.isArray(value)) {
                    value = value.reduce((c, v) => ({ ...c, ...(v ?? {}) }), {});
                }

                try {
                    if (typeof value == "object" && key !== "children") {
                        inputForm(key, value, node.props._viewId, false, undefined, readOnly)
                    }
                    else if (typeof value !== "object") {
                        inputForm(key, value, node.props._viewId, true, undefined, readOnly)
                    }
                } catch (e) {
                    console.error(e)
                    //  v.textContent = String(value);
                }
            }
        });
    }
}

function renderStyle(item) {
    if (item && Array.isArray(item)) {
        item = item.reduce((c, v) => {
            c = { ...c, ...(v ?? {}) }
        }, {})
    }

    let str = [];
    for (let key in item ?? {}) {
        str.push(`${key}:${item[key]}`)
    }

    return str.join("; ")
}

function summarizeProps(props) {
    if (!props) return '';
    const keys = Object.keys(props || {});
    if (keys.length === 0) return '';
    // try to make a compact preview: show first 2 small props
    const small = [];
    for (const k of keys) {
        if (ignoreAttrs.includes(k))
            continue;
        const v = props[k];
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
            small.push(`${k}="${String(v)}"`);
        } else if (typeof v === 'object' && v !== null) {
            if (k == "style") {
                small.push(`${k}="${renderStyle(v)}"`);
                continue;
            }
            // show if it's a small object with few keys
            if (Object.keys(v).length <= 2) {
                small.push(`${k}="Big([Object])"`);
            }
        }
        //if (small.length >= 2) break;
    }
    return small.join(" ");
}

// initial empty state
renderTree();

// Optional: respond to keyboard navigation (j/k)
window.addEventListener('keydown', (ev) => {
    if (ev.key === 'j' || ev.key === 'k') {
        // TODO: implement selection move
    }
});

// Expose a simple API for debugging in webview console:
window.__rnInspector = {
    setTree: (tree) => {
        currentTree = tree; flatNodes = []; selectedNodePath = null; renderTree();
    },
    getFlatNodes: () => flatNodes
};


let toolBar = document.querySelector(".toolbar");
if (window.location.href.indexOf("IFRAME") !== -1 && toolBar) {
    toolBar.style.display = "none";
    document.documentElement.style.setProperty('--toolbarHeight', "2px");

    document.querySelector(".header").appendChild(document.querySelector("#search"));
    document.querySelector("#search").style.marginLeft = "5px";
} else {
    document.querySelector(".exit")?.remove();
}


let isResizing = false;
let leftDivs = document.querySelectorAll(".left");
let currentZoom = 1;

function getZoom(el) {
    // Read computed zoom or fallback to 1
    const zoomValue = parseFloat(getComputedStyle(el).zoom);
    return isNaN(zoomValue) ? 1 : zoomValue;
}

leftDivs.forEach(x => {
    const resizers = x.querySelectorAll(".resizer");
    resizers.forEach(r => {
        r.addEventListener("mousedown", (e) => {
            isResizing = true;
            currentZoom = getZoom(x); // 🔥 get zoom factor on mousedown
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
        });
    });
});

document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    let item = leftDivs[0];
    let pos = item.getBoundingClientRect();

    // Adjust for zoom (divide pixel delta by zoom factor)
    const newWidth = (e.clientX - pos.left) / currentZoom;

    const minWidth = 100;
    const maxWidth = window.innerWidth * 0.8;

    if (newWidth >= minWidth && newWidth <= maxWidth) {
        leftDivs.forEach(x => (x.style.width = newWidth + "px"));
    }
});

document.addEventListener("mouseup", () => {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "auto";
        document.body.style.userSelect = "auto";
    }
});
