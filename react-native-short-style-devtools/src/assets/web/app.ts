
const $ = window.$;
const $$ = window.$$;
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
        $(".autoSave").addClass("selected");
    else $(".autoSave").removeClass("selected");
})

propsChanged.add("autoSave.Save", (settings) => {
    if (!settings.autoSave && viewer.selectedViewId)
        window.$(".save")?.removeClass("hidden");
    else $(".save")?.addClass("hidden");
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

const parseMessage = async (event: any) => {
    let item = event?.data ?? event;
    if (typeof item == "string")
        item = JSON.parse(item);
    if (!item) return;
    item = (Array.isArray(item) ? item : [item]);

    try {
        for (let i = 0; i < item.length; i++) {
            let msg = item[i];

            if (!msg || !msg.type)
                continue;
            if (msg.__To)
                delete msg.__To;

            // if (i % 100 == 0)
            //   await sleep(10)
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
                viewer.renderNode(msg.payload);
            } else if (msg.type === "PATCH_DELETE") {
                htmlScrollPosition.loading(true)
                viewer.deleteNode(msg.payload) // viewid
            } else if (msg.type === "PATCH_SELECT") {
                viewer.selectNode(msg.payload, true) // viewId
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
            } else if (msg.type == "FETCH") {
                console.log("fetch data, not implemented yet", msg.payload);
            }
        }
    } catch (e) {
        console.error(e, event.data)
    } finally {
        if (htmlScrollPosition.rendering)
            htmlScrollPosition.restore();


    }
}

$(".modal .title .btn").on("click", () => {
    modal.hide();
});

const sleep = (ms) => new Promise((r: Function) => setTimeout(() => {
    r();
}, ms));
const modal = {
    content: $(".modal .center"),
    container: $(".modal"),
    title: $(".modal .title span"),
    show: async () => {
        modal.container.parent().show("flex")
        await sleep(50);
        modal.container.addClass("active");

        return modal;
    },
    hide: async () => {
        modal.content.clear();
        modal.container.removeClass("active");
        await sleep(350);
        modal.container.parent().hide()
        modal.title.parent().findAll(".btn:not(.close)").forEach(x => x.remove());
        return modal;
    }
}

modal.hide();

const htmlScrollPosition = {
    rendering: false,
    loaderEl: $(".loader"),
    loading: (value) => {

        clearTimeout(htmlScrollPosition.timer);
        if (htmlScrollPosition.rendering == value)
            return;
        htmlScrollPosition.loaderEl.css({ visibility: value ? "visible" : "hidden" });
        htmlScrollPosition.rendering = value;
    },
    timer: undefined,
    data: [], //left, top,
    save: (force?: boolean) => {
        if (htmlScrollPosition.rendering && !force)
            return;
        htmlScrollPosition.data = viewer.container.parent()?.scrollValues();
    },
    restore: () => {
        clearTimeout(htmlScrollPosition.timer);
        htmlScrollPosition.timer = setTimeout(() => {
            if (htmlScrollPosition.data.length < 2) {
                htmlScrollPosition.loading(false)
                return;
            }
            viewer.container.parent().scroll(htmlScrollPosition.data[0], htmlScrollPosition.data[1]);
            htmlScrollPosition.loading(false)
        }, 500);
    }
}

$(".container[data-type='Elements'] .left > .scrollAble").on("scroll", () => {
    htmlScrollPosition.save();
});

var socketIsOpen = false;


const tabs = $(".tabs");
tabs.findAll(".header p").forEach(x => {
    x.on("click", (e) => {
        tabs.find(".header .selected")?.removeClass("selected");
        tabs.find(".active")?.removeClass("active");
        x.addClass("selected");
        let value = x.attr("data-value") ?? x.text();
        tabs.find(`.content> div[data-type="${value}"]`)?.addClass("active");
        viewer.searchInput.placeholder = value.startsWith("Elements") ? "Search nodes (name or prop)" : "Search logs";
        if (value.startsWith("Elements"))
            $(".clearLogs")?.hide()
        else $(".clearLogs")?.show("inline-flex");
        searchedItems = {};
    })
});

$("#zoom").on("change", () => {
    let value = parseFloat($("#zoom").value);
    if (value >= 1) {
        settings.zoom = value;
        sendSettigs("zoom");
        parseSetting()
    }
})

$$("[data-props]:not([data-props=''])").forEach(x => {
    x.on("click", function (e) {
        sendSettigs(x);
    })
});

$(".reload").on("click", () => {
    viewer.socket.postMessage("RELOAD", true);
});

$$(".lst li a").forEach(x => {
    x.on("click", () => {
        $(".lst li .selected")?.removeClass("selected");
        x.addClass("selected");
        parseSetting();
    });
});

$(".clearLogs").on("click", () => {
    settings.consoleData.errors = [];
    settings.consoleData.infos = [];
    settings.consoleData.warnings = [];
    settings.consoleData.logs = [];
    viewer.socket.postMessage("CLEARLOGS", { payload: true });
    parseConsole();
});

const sendSettigs = (x?: any) => {
    let htmlObject = x.attr != undefined;
    let key = htmlObject ? x.attr("data-props") : x;
    let value = settings[key];
    if (typeof value === "boolean")
        value = !value;
    else if (htmlObject) value = x.attr("data-value")
    settings[key] = value;
    if (htmlObject)
        x.attr("data-value", value)
    propsChanged.has(key).forEach(x => x());
    viewer.socket.postMessage("PROP", { key, value });
}

let selectedConsole = undefined;
let consoleData = undefined;

const parseConsole = (renderedItem?: any) => {
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

        const pre = $("<pre />").addClass(`console_${type}`.toLowerCase());
        const code = $("<code />").attr("id", Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)).html(text.replace(/\\n/g, '\n'));
        pre.append(code);
        pre.onclick = () => {
            if (!pre.hasClass("expand"))
                pre.addClass("expand");
        }
        return pre;
    }

    let click = (e) => {
        $(".lst li .selected")?.removeClass("selected");
        e.target.classList.add("selected");
        parseConsole();
    }
    const tab = $("p[data-value='Console']");
    const messages = $(".messages");
    const infos = $(".infos");
    const logs = $(".logs");
    const errors = $(".errors");
    const warnings = $(".warnings");

    messages.onclick = infos.onclick = logs.onclick = errors.onclick = warnings.onclick = click;
    const cnl = $("[data-type='Console']");
    const leftPanel = cnl.find(".left .tree-root");
    const selectedCnl = $(".lst li .selected") ?? $(".lst li:first-child");
    selectedCnl.addClass("selected");
    const scrolledToBottom = leftPanel.scrollTop === (leftPanel.scrollHeight - leftPanel.offsetHeight);
    const appendElement = (e) => {
        leftPanel.append(e);
        if (e.find("code") && e.find("code").offsetHeight <= 70)
            e.addClass("expand")
    }

    if (renderedItem.length <= 0 || consoleData == undefined) {
        leftPanel.html("");
        consoleData = {
            errors: settings.consoleData.errors.map(x => createConsoleItem(x)),
            info: settings.consoleData.infos.map(x => createConsoleItem(x)),
            warnings: settings.consoleData.warnings.map(x => createConsoleItem(x)),
            log: settings.consoleData.logs.map(x => createConsoleItem(x)),
        };
        // let scrollTop = leftPanel.scrollTop;
        let tempSelectedConsole = "";
        leftPanel.innerHTML = "";
        if (selectedCnl.hasClass("messages")) {
            tempSelectedConsole = "messages";
            [...consoleData.errors, ...consoleData.info, ...consoleData.log, ...consoleData.warnings].forEach(x => appendElement(x));
        }

        if (selectedCnl.hasClass("logs")) {
            tempSelectedConsole = "logs";
            consoleData.log.forEach(x => appendElement(x));
        }

        if (selectedCnl.hasClass("errors")) {
            tempSelectedConsole = "errors";
            consoleData.errors.forEach(x => appendElement(x));
        }

        if (selectedCnl.hasClass("warnings")) {
            tempSelectedConsole = "warnings";
            consoleData.warnings.forEach(x => appendElement(x));
        }

        if (selectedCnl.hasClass("infos")) {
            tempSelectedConsole = "infos";
            consoleData.info.forEach(x => appendElement(x));
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

            appendElement(item);
            if (scrolledToBottom)
                item.scrollIntoView();
        }
    }

    if (tab)
        tab.find("span").textContent = consoleData.errors.length + consoleData.info.length + consoleData.log.length + consoleData.warnings.length;

    if (messages) {
        messages.find("span").textContent = consoleData.errors.length + consoleData.info.length + consoleData.log.length + consoleData.warnings.length;
    }
    if (logs) {
        logs.find("span").textContent = consoleData.log.length;

    }

    if (infos) {
        infos.find("span").textContent = consoleData.info.length;
    }

    if (errors) {
        errors.find("span").textContent = consoleData.errors.length;
    }

    if (warnings) {
        warnings.find("span").textContent = consoleData.warnings.length;
    }
}

const parseSetting = (_parseConsole?: boolean) => {
    for (let key in settings) {
        $(`[data-props='${key}']`)?.attr("data-value", settings[key]);
    }
    $$(".container > .left").forEach(x => x.css({ zoom: settings.zoom }));
    if (_parseConsole)
        parseConsole();
}
parseSetting(true);



function inputForm(propKey: string, jsonItem: any, viewId?: string, isSingleValue?: boolean, parent?: any, isReadOnly?: boolean, parentKey?: string) {
    const fullkeyName = parentKey ? `${parentKey}.${propKey}` : propKey;
    let item = Object.keys(typeof jsonItem == "object" ? jsonItem : [propKey].reduce((c, v) => {
        c[v] = jsonItem;
        return c;
    }, {})).map(x => {
        return [x ?? "", (typeof jsonItem == "object" ? jsonItem[x] ?? "" : jsonItem)];
    });



    if (!$("#styleDataListNames")) {
        let datalist = $("<datalist />", { id: "styleDataListNames" });
        window.RN_STYLE_PROPS.forEach(x => {
            datalist.append($("<option />", { value: x.name }));
            if (x.values && Array.isArray(x.values)) {
                let values = $("<datalist />", { id: x.name.toLowerCase() });
                x.values.forEach(v => {
                    values.append($("<option />", { value: v }));
                });
                values.mount()
            }
        })
        datalist.mount();
    }

    const container = (typeof jsonItem === "object" ? $("<div />") : $(".props") ?? $("<div />"));
    const buttons = $("<div />", { className: "buttons" }).mount(container);
    container.className = "form " + (typeof jsonItem !== "object" ? "props" : "");



    function createwrapper(...childs) {
        let div = $("<div />");
        div.append(...childs)
        return div;
    }

    const save = (dataOnly?: boolean) => {
        htmlScrollPosition.loading(true);
        const getKeyValueInput = (el) => {
            let result = [];
            for (let item of el.children) {
                const isDeleted = item.parent(".deleted")
                if (item.hasClass("buttons")) {
                    let dataFor = item?.find(".title")?.attr("data-for");
                    let dataKey = el.parent()?.find(":scope > .buttons > .title")?.attr("data-for");
                    if (item.findAll("input").length > 0 || !dataFor)
                        continue;


                    result.push({ key: dataFor, value: {}, dataKey: dataKey });
                    continue;

                }
                if (item.hasClass("form")) {
                    result.push(...getKeyValueInput(item))
                    continue;
                }

                let inputs = item.findAll("input");
                //  if (inputs.length < 2)
                //  continue;

                let dataKey = el.attr("data-key");
                let dataFor = el.parent()?.find(":scope > .buttons > .title")?.attr("data-for");
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

        let inputContainers = $(".props-panel").children.map(getKeyValueInput).flatMap(x => x).sort((a, b) => {
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
            viewer.socket.postMessage('SAVE_NODE_PROP', { ...json, _deletedItems: getDeletedJson(deleteJson) });
        htmlScrollPosition.loading(false);
        return json;
    }



    function addInput(key: string, index: number, prependToChild?: any) {
        let colType = window.RN_STYLE_PROPS.find(x => x.name.toLowerCase() === key.toLowerCase())?.type ?? "text";
        if (colType === "number")
            colType = "number";
        else if (colType != "color") colType = "text";


        const onChange = (e) => {
            if (!settings.autoSave)
                return;
            clearTimeout(timer);
            timer = setTimeout(() => {
                let inputs = $(e.target).parent(2).findAll("input");
                if (inputs.length < 2)
                    return;
                if (inputs[1].readOnly)
                    return;
                if (inputs[0].value.length > 0 && inputs[1].value.length > 0)
                    save();
            }, 500);
        }
        let div = $("<div />");
        let input = $("<input />", {
            type: "text",
            value: item[index][0],
            readOnly: typeof jsonItem !== "object" || key.length > 0 || isReadOnly,
            placeholder: "key",
            onchange: onChange,
            name: key,
        })

        let timer = undefined;

        if (propKey === "style" || !container.classList.contains("props")) {
            input.attr("list", "styleDataListNames");
        }

        div.append(createwrapper(input));

        let inputValue = $("<input />", {
            type: colType,
            disabled: isReadOnly,
            value: colType == "color" ? window.toHex(item[index][1]) : item[index][1],
            readOnly: isReadOnly,
            placeholder: "value",
            onchange: onChange,
            name: "value"
        });



        if (item[index][0].trim() !== "" && $("datalist#" + item[index][0].trim().toLowerCase())) {
            inputValue.attr("list", key.toLowerCase());
        }

        if (colType == "color" && !isReadOnly) {
            let inputValue2 = $("<input />", {
                type: "text",
                value: item[index][1],
                placeholder: "value",
            }).attr("name", `${key}_value`);
            inputValue2.onchange = inputValue.onchange = (e) => {
                let target = $(e.target);
                let inputs = target.parent().findAll("input");
                inputs.forEach(x => {
                    if (x !== e.target && x.value !== target.value)
                        x.value = window.toHex(target.value)
                });
                onChange(e)
            };
            div.append(createwrapper(inputValue, inputValue2));
        } else div.append(createwrapper(inputValue));

        input.on("input", () => {
            const id = input.value.replace(/\s+/g, "-").toLowerCase();
            if (id !== "" && $("datalist#" + id.toLowerCase())) {
                inputValue.attr("list", id.toLowerCase());
            }
        });

        inputValue.on("input", () => {
            inputValue.attr("value", inputValue.value);
        });

        if (!isSingleValue && !isReadOnly) {
            let btn = $("<button />", {
                textContent: "-",
                className: "btn"
            });
            btn.onclick = function () {
                item.splice(index, 1)
                div.addClass("deleted");
                let deletedLine = $("line", {
                    className: "deletedProp"
                });
                div.prepend(deletedLine);
                div.findAll("input").forEach(x => x.attr("readonly", true));
                if (settings.autoSave)
                    save();
            }

            div.append(btn);
        }
        if (prependToChild)
            container.prepend(div);
        else container.append(div);

        return input;
    }


    let label = $("<p />", {
        textContent: typeof jsonItem == "object" ? propKey : "Props",
        className: `title${parent ? " subtitle" : ""}`
    });

    if (typeof jsonItem == "object")
        label.attr("data-for", propKey);
    buttons.append(label);
    const btnContainers = $("<div />").css({ gap: "5px" }).mount(buttons);


    // add new key
    if (!isSingleValue && !isReadOnly) {
        let btn = $("<button />", {
            textContent: "+",
            className: "btn"
        });
        btn.onclick = function () {
            item.push(["", ""]);
            addInput("", item.length - 1, true)?.focus();
        }
        btnContainers.append(btn);

    }



    if (item.length > 0 && !$(".props-panel .save")) {
        // save 
        let btn = $(".save");
        btn.onclick = function () {
            // save to 
            save();
        }

        if (!settings.autoSave)
            btn.removeClass("hidden");
        else btn.addClass("hidden");


        btn = $(".json");
        btn.onclick = function () {
            let json: any = save(true);
            let copy: IDomElement = $("<button />", {
                className: "btn copy"
            }).html(`<img src="copy_content.svg" style="height:var(--pathHeight)" />`);
            copy.onclick = (e) => {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    window.focus();
                    navigator.clipboard.writeText(JSON.stringify(json, undefined, 4));
                    copy.flash()
                    modal.content.flash()
                } catch { }
            }
            if (json.style) {
                let copyStyle = $("<button />", {
                    className: "btn copyStyle"
                }).html(`<img src="copy_content.svg" style="height:var(--pathHeight)" /> Style`);
                copyStyle.onclick = (e) => {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        window.focus();
                        navigator.clipboard.writeText(JSON.stringify(json.style, undefined, 4));
                        let prettyJsonStyle = modal.content.find("pretty-json")?.shadowRoot?.find("pretty-json[key='style']")?.shadowRoot?.find(".row");
                        copyStyle.flash();
                        if (prettyJsonStyle)
                            prettyJsonStyle.flash();
                    } catch { }
                }
                modal.title.parent().append(copyStyle);
            }
            let pre = $("<pre />");
            let code = $("<pretty-json />", {
                textContent: JSON.stringify(json, undefined, 4)
            }).attr("expand", "5");
            pre.append(code);
            modal.title.parent().append(copy);
            modal.title.text("Json Viewer");
            modal.content.append(pre);
            modal.show()
        }
        btn.removeClass("hidden");
    } else {
        $$(".save, .json").forEach(x => x.addClass("hidden"));
        // propsChanged.remove("autoSave.Save");
    }
    for (let key of item) {
        if (key[1] && typeof key[1] === "object")
            inputForm(key[0], key[1], viewId, false, container, isReadOnly, fullkeyName);
        else
            addInput(key[0], item.indexOf(key));
    }

    if (typeof jsonItem === "object")
        container.attr("data-key", propKey);

    (parent ?? $(".props-panel")).append(container);
}




// Current state
const viewer = new HtmlViewer(inputForm, parseMessage, htmlScrollPosition);
let searchValue = "";
const elementBy_viewId = new WeakMap(); // element -> _viewId
const _viewIdToElement = {}; // _viewId -> element
let searchedItems = {} // id and element


const renderPayload = (msg) => {
    viewer.clear().renderNode(msg.payload)
    viewer.showProps(); // clear
}



// Delegated click handling for nodes
viewer.container.on('click', (ev) => {
    let target = $(ev.target);
    if (target.hasClass("node-text")) {
        if (!target.hasClass("expand"))
            target.addClass("expand");
        return;
    }
    if (!target.hasClass("expander") && !target.parent().hasClass("expander")) {
        if (!target.attr("data-id"))
            target = target.parent("[data-id]:not([data-id=''])");
        if (!target)
            return;
        const viewId = target.attr("data-id");

        viewer.selectNode(viewId);
    } else {
        viewer.collabsNode((target.hasClass("expander") ? target : target.parent()).id);
    }
    return false
});

// Search
viewer.searchInput.on('input', (ev) => {
    searchValue = ev.target.value.trim().toLowerCase();
    searchedItems = {};
});

viewer.searchInput.on('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // block unintended form behavior
        if (document.querySelector(".container.active")?.getAttribute("data-type") == "Elements" || !document.querySelector(".header p.selected") || document.querySelector(".header p.selected")?.getAttribute("data-value") == ("Elements"))
            searchHtml(true);
        else searchLogs(true);
        // put your logic here
    }
});




function searchLogs(fromEnter) {
    let datas = $$("div[data-type='Console'] .left code");
    for (let item of datas) {
        const id = item.id;
        let txt = item.text().toString().trim();
        if (txt.toLowerCase().includes(searchValue.toLowerCase()) && !(id && searchedItems[id]?.includes(txt))) {
            item.scrollIntoView({ block: "center", inline: "nearest" });
            item.flash();

            if (!searchedItems[id]) searchedItems[id] = [];
            searchedItems[id].push(txt);
            return;
        }
    }
}

function searchHtml(fromEnter = false) {
    if (searchValue.length <= 1) return;

    const nodes = $$(".node-name,.node-props");
    for (let item of nodes) {
        let txt = item.text().trim();
        let id = item._viewId;

        if (
            txt.toLowerCase().includes(searchValue.toLowerCase()) &&
            !(id && searchedItems[id]?.includes(txt))
        ) {
            item.scrollIntoView({ block: "center", inline: "nearest" });
            item.flash();

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







// Optional: respond to keyboard navigation (j/k)
window.addEventListener('keydown', (ev) => {
    if (ev.key === 'j' || ev.key === 'k') {
        // TODO: implement selection move
    }
});


let toolBar: DomElement = $(".toolbar");
if (viewer.isIframe && toolBar) {
    toolBar.hide()
    document.documentElement.style.setProperty('--toolbarHeight', "2px");

    $(".header").append(viewer.searchInput);
    viewer.searchInput.css({ marginLeft: "5px" });;
} else {
    document.querySelector(".exit")?.remove();
}


let isResizing = false;
let leftDivs = $$(".left");
let currentZoom = 1;

function getZoom(el) {
    // Read computed zoom or fallback to 1
    const zoomValue = parseFloat(getComputedStyle(el).zoom);
    return isNaN(zoomValue) ? 1 : zoomValue;
}

leftDivs.forEach(x => {
    const resizers = x.findAll(".resizer");
    resizers.forEach(r => {
        r.on("mousedown", (e) => {
            isResizing = true;
            currentZoom = getZoom(x.el); // 🔥 get zoom factor on mousedown
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
            viewer.container.el.style.userSelect = "none"; // optional if you want text not interfering
            viewer.container.el.style.pointerEvents = "none"; // optional if you want text not interfering
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
        leftDivs.forEach(x => (x.css({ width: newWidth + "px" })));
    }
});

document.addEventListener("mouseup", () => {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = "auto";
        document.body.style.userSelect = "auto";
        viewer.container.el.style.userSelect = ""; // optional if you want text not interfering
        viewer.container.el.style.pointerEvents = ""; // optional if you want text not interfering
    }
});
viewer.socket.open();