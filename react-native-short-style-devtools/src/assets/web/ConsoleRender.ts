class ConsoleRender {
    tab = $("p[data-value='Console']");
    messages = $(".messages");
    infos = $(".infos");
    logs = $(".logs");
    errors = $(".errors");
    warnings = $(".warnings");
    cnl = $("[data-type='Console']");
    leftPanel = this.cnl.find(".left .tree-root");
    searchedItems = {};
    searchInput: IDomElement = $("#search");


    click = (e) => {
        $(".lst li .selected")?.removeClass("selected");
        e.target.classList.add("selected");
        this.leftPanel.html("");
        this.parseItems();
    }

    searchLogs(fromEnter) {
        let searchValue = this.searchInput.value;
        let datas = $$("div[data-type='Console'] .left code");
        for (let item of datas) {
            const id = item.id;
            let txt = item.text().toString().trim();
            if (txt.toLowerCase().includes(searchValue.toLowerCase()) && !(id && this.searchedItems[id]?.includes(txt))) {
                item.scrollIntoView({ block: "center", inline: "nearest" });
                item.flash();

                if (!this.searchedItems[id]) this.searchedItems[id] = [];
                this.searchedItems[id].push(txt);
                return;
            }
        }

        if (fromEnter) {
            this.searchedItems = {};
            this.searchLogs(false);
        }
    }


    constructor() {
        this.messages.onclick = this.infos.onclick = this.logs.onclick = this.errors.onclick = this.warnings.onclick = this.click;
    }

    appendElement = (e) => {
        this.leftPanel.append(e);
        if (e.find("code") && e.find("code").offsetHeight <= 70)
            e.addClass("expand")
    }

    createConsoleItem = ({ type, payload }) => {
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

    clear() {
        this.consoleData = undefined;
        this.leftPanel.html("");
        this.parseItems();
    }

    selectedConsole = undefined as "infos" | "errors" | "warnings" | "logs" | "messages";
    consoleData = undefined;

    parseItems(renderedItem?: any) {
        renderedItem = (Array.isArray(renderedItem) ? renderedItem : [renderedItem]).filter(x => x != undefined)

        const selectedCnl = $(".lst li .selected") ?? $(".lst li:first-child");
        selectedCnl.addClass("selected");
        const scrollableItem = this.leftPanel.parent()
        const isAtBottom =
            scrollableItem.scrollHeight -
            scrollableItem.scrollTop -
            scrollableItem.clientHeight < 5;

        if (renderedItem.length <= 0 || this.consoleData == undefined) {
            if (!this.consoleData)
                this.consoleData = {
                    errors: settings.consoleData.errors.map(x => this.createConsoleItem(x)),
                    info: settings.consoleData.infos.map(x => this.createConsoleItem(x)),
                    warnings: settings.consoleData.warnings.map(x => this.createConsoleItem(x)),
                    log: settings.consoleData.logs.map(x => this.createConsoleItem(x)),
                };
            // let scrollTop = leftPanel.scrollTop;
            let tempSelectedConsole = undefined as typeof this.selectedConsole;
            this.leftPanel.innerHTML = "";
            if (selectedCnl.hasClass("messages")) {
                tempSelectedConsole = "messages";
                [...this.consoleData.errors, ...this.consoleData.info, ...this.consoleData.log, ...this.consoleData.warnings].forEach(x => this.appendElement(x));
            }

            if (selectedCnl.hasClass("logs")) {
                tempSelectedConsole = "logs";
                this.consoleData.log.forEach(x => this.appendElement(x));
            }

            if (selectedCnl.hasClass("errors")) {
                tempSelectedConsole = "errors";
                this.consoleData.errors.forEach(x => this.appendElement(x));
            }

            if (selectedCnl.hasClass("warnings")) {
                tempSelectedConsole = "warnings";
                this.consoleData.warnings.forEach(x => this.appendElement(x));
            }

            if (selectedCnl.hasClass("infos")) {
                tempSelectedConsole = "infos";
                this.consoleData.info.forEach(x => this.appendElement(x));
            }

            if (isAtBottom) {
                scrollableItem.scrollTop = scrollableItem.scrollHeight;
            }

            this.selectedConsole = tempSelectedConsole;
        } else {
            for (let x of renderedItem) {
                const item = this.createConsoleItem(x);
                switch (x.type.toLowerCase()) {
                    case "log":
                    case "logs":
                        this.consoleData.log.push(item);
                        if (this.selectedConsole == "logs" || this.selectedConsole == "messages")
                            this.appendElement(item);
                        break;
                    case "info":
                    case "infos":
                        this.consoleData.info.push(item);
                        if (this.selectedConsole == "infos" || this.selectedConsole == "messages")
                            this.appendElement(item);
                        break;
                    case "warnings":
                    case "warning":
                        this.consoleData.warnings.push(item);
                        if (this.selectedConsole == "warnings" || this.selectedConsole == "messages")
                            this.appendElement(item);
                        break;
                    case "errors":
                    case "error":
                        this.consoleData.errors.push(item);
                        if (this.selectedConsole == "errors" || this.selectedConsole == "messages")
                            this.appendElement(item);
                }



            }

            if (isAtBottom) {
                scrollableItem.scrollTop = scrollableItem.scrollHeight;
            }

        }

        if (this.tab) {
            const errorSpan = this.consoleData.errors.length > 0 ? `<span style="color:red;">(${this.consoleData.errors.length})</span>` : ""
            this.tab.find("span").html((this.consoleData.errors.length + this.consoleData.info.length + this.consoleData.log.length + this.consoleData.warnings.length) + errorSpan);
        }
        if (this.messages) {
            this.messages.find("span").textContent = this.consoleData.errors.length + this.consoleData.info.length + this.consoleData.log.length + this.consoleData.warnings.length;
        }
        if (this.logs) {
            this.logs.find("span").textContent = this.consoleData.log.length;

        }

        if (this.infos) {
            this.infos.find("span").textContent = this.consoleData.info.length;
        }

        if (this.errors) {
            this.errors.find("span").textContent = this.consoleData.errors.length;
        }

        if (this.warnings) {
            this.warnings.find("span").textContent = this.consoleData.warnings.length;
        }
    }
}