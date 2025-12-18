type IDomElement = DomElement & HTMLElement & HTMLInputElement;
class DomElement<T = IDomElement> {
    el: HTMLElement;
    _viewId?: string;
    constructor(tag: any = "div", attrs?: any) {
        this.el = (typeof tag === "string"
            ? document.createElement(tag)
            : tag instanceof HTMLElement || tag instanceof DocumentFragment
                ? tag
                : tag instanceof DomElement ? tag.el : document.createElement("div")) as any;

        if (attrs)
            this.attr(attrs);
    }

    flash(byStyle: any = {}): this {
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

    added() {
        return !!(this.el && this.el.parentElement);

    }


    hasClass(cls: string) {
        return this.el.classList.contains(cls)
    }


    // Set or get attributes
    attr(name: any, value?: any): any {
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
                        this.el.setAttribute(k, v as string);

                }
            }
        }
        return this;
    }

    // Add inline styles
    css(styles: any): this {
        if (typeof styles === "string")
            this.el.style.cssText += ";" + styles;
        else
            Object.assign(this.el.style, styles);
        return this;
    }

    // Add one or more classes
    addClass(...cls: string[]): this {
        this.el.classList.add(...cls);
        return this;
    }

    removeClass(...cls: string[]): this {
        this.el.classList.remove(...cls);
        return this;
    }

    toggleClass(cls: string, force?: boolean): this {
        this.el.classList.toggle(cls, force);
        return this;
    }

    option(key: string, value?: any): this {
        this.el[key] = value;
        return this;
    }

    // Add event listener
    on(event: string, handler: any, options?: any): this {
        this.el.addEventListener(event, handler, options);
        return this;
    }

    off(event, handler): this {
        this.el.removeEventListener(event, handler);
        return this;
    }

    // Add or clear children
    append(...children: any[]): this {
        for (let child of children) {
            if (!child) continue;
            if (child instanceof DomElement) child = child.el;
            if (typeof child === "string")
                child = document.createTextNode(child);
            this.el.appendChild(child);
        }
        return this;
    }

    prepend(...children: any[]): this {
        for (let child of children) {
            if (!child) continue;
            if (child instanceof DomElement) child = child.el;
            if (typeof child === "string")
                child = document.createTextNode(child);
            this.el.prepend(child);
        }
        return this;
    }

    clear(): this {
        this.el.textContent = "";
        return this;
    }

    // Insert into DOM
    mount(parent: DomElement | HTMLElement = document.body): this {
        const p = parent instanceof DomElement ? parent.el : parent;
        p.appendChild(this.el);
        return this;
    }

    remove(selector?: string): this {
        if (!selector)
            this.el.remove();
        else this.findAll(selector).forEach(x => x.remove());
        return this;
    }

    insertAt(child: DomElement, index: number, selector?: string | ((el: DomElement) => (DomElement | undefined))) {
        const beforeNode = !selector ? (this.el.children[index] || null) : (typeof selector == "function" ? selector(this as any)?.el ?? null : this.findAll(selector)[index]?.el ?? null) // null = append at end
        beforeNode ? this.el.insertBefore(child.el, beforeNode) : this.el.appendChild(child.el);
        return this;
    }


    // Shortcut for query inside element
    find(selector: string): T {
        let item = this.el.querySelector(selector);
        if (item)
            return new DomElement(item) as any;
        return undefined;
    }

    findAll(selector: string): (this & IDomElement)[] {
        return [...this.el.querySelectorAll(selector)].map(el => new DomElement(el)) as any;
    }

    get children() {
        return [...this.el.children].map(x => new DomElement(x))
    }

    parent(selector?: string | number): this {
        let item = null;

        if (selector && typeof selector == "string")
            item = this.el.closest(selector);
        else if (selector == undefined) item = this.el.parentElement;
        else if (typeof selector == "number") for (let i = 0; i < selector; i++) {
            item = (item ?? this.el).parentElement;
        }

        if (item)
            return new DomElement(item) as any;

        return undefined;

    }

    text(value?: string): any {
        if (value === undefined) return this.el.textContent;
        this.el.textContent = value;
        return this;
    }

    html(value?: string) {
        if (value === undefined) return this.el.innerHTML;
        this.el.innerHTML = value;
        return this as any;
    }

    hide(value?: string) {
        if (value)
            this.css({ display: value });
        else this.css({ display: "none" });
    }

    show(value?: string) {
        if (value)
            this.css({ display: value });
        else this.css({ display: "block" });
    }

    scrollIntoView(option) {
        this.el.scrollIntoView(option);
        return this;
    }
    scrollIntoViewIfNeeded(scrollableContainer: DomElement, behavior: ScrollBehavior = "instant") {
        const container = scrollableContainer.el;
        const el = this.el;
        if (!container || !el) return;

        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // element top relative to container
        const elTopRelative = elRect.top - containerRect.top + container.scrollTop;

        const viewTop = container.scrollTop;
        const viewHeight = container.clientHeight;

        const centerMin = viewTop + viewHeight * 0.4;
        const centerMax = viewTop + viewHeight * 0.6;

        const isTopCentered =
            elTopRelative >= centerMin &&
            elTopRelative <= centerMax;

        if (!isTopCentered) {
            container.scrollTo({
                top: elTopRelative - viewHeight / 2,
                behavior
            });
        }
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

    scroll(left?: number, top?: number) {
        if (left)
            this.el.scrollLeft = left;
        if (top)
            this.el.scrollTop = top;

        return this;
    }

    getBoundingClientRect() {
        return this.el.getBoundingClientRect();
    }
}

const getterAndSetter = [
    "onclick",
    "onchange",
    "offsetHeight",
    "offsetWidth",
    "clientHeight",
    "clientWidth",
    "scrollLeft",
    "scrollTop",
    "scrollHeight",
    "scrollWidth",
    "classList",
    "innerHTML",
    "value",
    "id",
    "style",
    "length",
    "className",
    "readOnly",
    "disabled",
    "textContent",
    "src",
    "dataset"];
getterAndSetter.forEach(x => {
    Object.defineProperty(DomElement.prototype, x, {
        get: function () {
            let v = this.el[x];
            if (typeof v == "function" && v)
                v.bind(this.el);
            return v;
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
        else if (/[\.\#\>\s:\(\)\[\]]/.test(tag)) {
            tag = document.querySelector(tag);
        }
    }
    if (tag)
        return new DomElement(tag, attrs) as any;
    return undefined;
}

window.$$ = function (selector) {
    return [...document.querySelectorAll(selector)].map(el => new DomElement(el)) as any;
}

