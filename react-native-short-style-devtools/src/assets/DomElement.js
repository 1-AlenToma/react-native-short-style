class DomElement {
    constructor(tag = "div", attrs) {
        this.el = typeof tag === "string"
            ? document.createElement(tag)
            : tag instanceof HTMLElement || tag instanceof DocumentFragment
                ? tag
                : document.createElement("div");
        if (attrs)
            this.attr(attrs);
    }

    flash(byStyle = {}) {
        let node = this.el;
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

        return this;
    }

    hasValue() {
        if (!this.el || !this.el.parentElement)
            return false;
        return true;
    }


    hasClass(cls) {
        return this.el.classList.contains(cls)
    }

    // Set or get attributes
    attr(name, value) {
        if (typeof name === "string" && value === undefined)
            return this.el.getAttribute(name);

        if (typeof name === "string") {
            this.el.setAttribute(name, value);
        } else if (typeof name === "object" && name !== null) {
            for (const [k, v] of Object.entries(name)) {
                if (v !== undefined && v !== null) {
                    if (k in this)
                        this.el[k] = v;
                    else
                        this.el.setAttribute(k, v);

                }
            }
        }
        return this;
    }



    // Add inline styles
    css(styles) {
        if (typeof styles === "string")
            this.el.style.cssText += ";" + styles;
        else
            Object.assign(this.el.style, styles);
        return this;
    }

    // Add one or more classes
    addClass(...cls) {
        this.el.classList.add(...cls);
        return this;
    }

    removeClass(...cls) {
        this.el.classList.remove(...cls);
        return this;
    }

    toggleClass(cls, force) {
        this.el.classList.toggle(cls, force);
        return this;
    }

    option(key, value) {
        this.el[key] = value;
    }

    // Add event listener
    on(event, handler, options) {
        this.el.addEventListener(event, handler, options);
        return this;
    }

    off(event, handler) {
        this.el.removeEventListener(event, handler);
        return this;
    }

    // Add or clear children
    append(...children) {
        for (let child of children) {
            if (!child) continue;
            if (child instanceof DomElement) child = child.el;
            if (typeof child === "string")
                child = document.createTextNode(child);
            this.el.appendChild(child);
        }
        return this;
    }

    prepend(...children) {
        for (let child of children) {
            if (!child) continue;
            if (child instanceof DomElement) child = child.el;
            if (typeof child === "string")
                child = document.createTextNode(child);
            this.el.prepend(child);
        }
        return this;
    }

    clear() {
        this.el.textContent = "";
        return this;
    }

    // Insert into DOM
    mount(parent = document.body) {
        const p = parent instanceof DomElement ? parent.el : parent;
        p.appendChild(this.el);
        return this;
    }

    remove() {
        this.el.remove();
        return this;
    }

    // Shortcut for query inside element
    find(selector) {
        let item = this.el.querySelector(selector);
        if (item)
            return new DomElement(item);
        return undefined;
    }

    findAll(selector) {
        return [...this.el.querySelectorAll(selector)].map(el => new DomElement(el));
    }

    get children() {
        return [...this.el.children].map(x => new DomElement(x))
    }

    parent(selector) {
        let item = null;

        if (selector && typeof selector == "string")
            item = this.el.closest(selector);
        else if (selector == undefined) item = this.el.parentElement;
        else for (let i = 0; i < selector; i++) {
            item = (item ?? this.el).parentElement;
        }

        if (item)
            return new DomElement(item);

        return undefined;

    }

    text(value) {
        if (value === undefined) return this.el.textContent;
        this.el.textContent = value;
        return this;
    }

    html(value) {
        if (value === undefined) return this.el.innerHTML;
        this.el.innerHTML = value;
        return this;
    }

    hide(value) {
        if (value)
            this.css({ display: value });
        else this.css({ display: "none" });
    }

    show(value) {
        if (value)
            this.css({ display: value });
        else this.css({ display: "block" });
    }

    scrollIntoView(option) {
        this.el.scrollIntoView(option);
        return this;
    }

    scrollValues() {
        return [this.el.scrollLeft, this.el.scrollTop];
    }

    focus() {
        this.el.focus();
        return this;
    }

    get shadowRoot() {
        return this.el.shadowRoot ? new DomElement(this.el.shadowRoot) : this.el.shadowRoot;
    }

    scroll(left, top) {
        if (left)
            this.el.scrollLeft = left;
        if (top)
            this.el.scrollTop = top;

        return this;
    }
}

const getterAndSetter = [
    "onclick",
    "onchange",
    "offsetHeight",
    "offsetWidth",
    "scrollLeft",
    "scrollTop",
    "scrollHeight",
    "scrollWidth",
    "classList",
    "value",
    "id",
    "style",
    "length",
    "className",
    "readOnly",
    "disabled",
    "textContent"];
getterAndSetter.forEach(x => {
    Object.defineProperty(DomElement.prototype, x, {
        get: function () {
            return this.el[x];
        },
        set: function (value) {
            this.el[x] = value;
        },
        enumerable: true
    })
})


window.$ = function (tag, attrs) {
    if (tag && typeof tag == "string") {
        tag = tag.trim();
        if (tag.startsWith("<") && tag.endsWith("/>")) {
            tag = tag.substring(1, tag.length - 2).trim();
            tag = document.createElement(tag);
        }
        else if (/[\.\#\>\s:()\[\]]/.test(tag)) {
            tag = document.querySelector(tag);
        }
    }
    if (tag)
        return new DomElement(tag, attrs);
    return undefined;
}

$.find = (selector) => {
    let item = document.querySelector(selector);
    if (item)
        return new DomElement(item);
    return undefined;
}

$.findAll = (selector) => {
    return [...document.querySelectorAll(selector)].map(el => new DomElement(el));
}