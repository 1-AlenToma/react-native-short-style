import { ConvertedElement, DomPath, InternalStyledProps } from "../Typse";
import { removeProps, eqString } from "./CSSMethods";
import * as CSSselect from 'css-select';

const EMPTY_OBJECT = {};

function isTag(elem) {
    return elem.type === "tag";
}
function getChildren(elem) {
    const { _elementsChildren } = elem?.raw ?? {};
    let i = 0;
    for (let ch of _elementsChildren ?? []) {
        if (ch.___HTMLELEMENT) {
            ch.___HTMLELEMENT.prev = _elementsChildren[i - 1] || null;
            ch.___HTMLELEMENT.next = _elementsChildren[i + 1] || null;
            ch.___HTMLELEMENT.parent = elem;
        }
        i++;
    }
    elem.children = (_elementsChildren ?? []).map(x => x.___HTMLELEMENT);
    return elem.children;
}
function getParent(elem) {
    return elem.parent;
}
function removeSubsets(nodes) {
    var idx = nodes.length, node, ancestor, replace;

    // Check if each node (or one of its ancestors) is already contained in the
    // array.
    while (--idx > -1) {
        node = ancestor = nodes[idx];

        // Temporarily remove the node under consideration
        nodes[idx] = null;
        replace = true;

        while (ancestor) {
            if (nodes.indexOf(ancestor) > -1) {
                replace = false;
                nodes.splice(idx, 1);
                break;
            }
            ancestor = getParent(ancestor)
        }

        // If the node has been found to be unique, re-insert it.
        if (replace) {
            nodes[idx] = node;
        }
    }

    return nodes;
}

var adapter = {
    isTag: isTag,
    existsOne: function (test, elems) {
        return elems.some(function (elem) {
            return isTag(elem) ?
                test(elem) || adapter.existsOne(test, getChildren(elem)) :
                false;
        });
    },
    getSiblings: function (elem) {
        var parent = getParent(elem);
        return parent ? getChildren(parent) : [elem];
    },
    getChildren: getChildren,
    getParent: getParent,
    getAttributeValue: function (elem, name) {
        if (elem.attributes && name in elem.attributes) {
            var attr = elem.attributes[name];
            return typeof attr === "string" ? attr : attr.value;
        } else if (name === "class" && elem.classList) {
            return Array.from(elem.classList).join(" ");
        }
    },
    hasAttrib: function (elem, name) {
        return name in (elem.attributes || EMPTY_OBJECT);
    },
    removeSubsets: removeSubsets,
    getName: function (elem) {
        return (elem.name || "").toLowerCase();
    },
    findOne: function findOne(test, arr) {
        var elem = null;

        for (var i = 0, l = arr.length; i < l && !elem; i++) {
            if (test(arr[i])) {
                elem = arr[i];
            } else {
                var childs = getChildren(arr[i]);
                if (childs && childs.length > 0) {
                    elem = findOne(test, childs);
                }
            }
        }

        return elem;
    },
    findAll: function findAll(test, elems) {
        var result = [];
        for (var i = 0, j = elems.length; i < j; i++) {
            if (!isTag(elems[i])) continue;
            if (test(elems[i])) result.push(elems[i]);
            var childs = getChildren(elems[i]);
            if (childs) result = result.concat(findAll(test, childs));
        }
        return result;
    },
    getText: function getText(elem) {
        if (Array.isArray(elem)) return elem.map(getText).join("");

        if (isTag(elem)) return getText(getChildren(elem));

        if (elem.type == "text") return elem.data;

        return "";
    }
};




export class HElement implements ConvertedElement {
    // Required properties
    type: 'tag' | 'text'; // for css-select
    name: string; // tag name
    attributes: Record<string, string>; // simplified attributes (for css-select)
    children: HElement[];
    childNodes: HElement[];
    parent: HElement | null;
    next: HElement | null;
    prev: HElement | null;
    data?: string; // only for type = "text"
    id?: string;
    classList: string[] = [];
    // Reference to original RN component
    raw: DomPath<any, InternalStyledProps>;

    querySelector<T>(selector: string) {
        const matches = CSSselect.selectOne(selector, [this], { adapter: adapter as any });
        return (matches as HElement)?.raw as DomPath<T, any> | undefined
    }

    querySelectorAll<T>(selector: string) {
        const matches = CSSselect.selectAll(selector, [this], { adapter: adapter as any });
        return (matches as HElement[]).map(x => x.raw) as DomPath<T, any>[] | undefined
    }

    constructor(item: DomPath<any, InternalStyledProps>, parent: HElement | null = null) {
        this.raw = item;
        this.parent = parent;
        this.attributes = {};
        this.children = [];


        const { type: CompType, props } = item;

        const itemProps = removeProps({ ...item._elemntsProps, ...props }, "View", "fullParentPath", "ifTrue", "themeContext");
        this.id = itemProps.id;
        this.classList = [...(itemProps.css?.toString().split(" ") ?? []), (itemProps.className?.toString().split(" ") ?? [])]
        this.attributes = this.extractAttribs(itemProps);
        const { children } = this.attributes;
        if (typeof children === 'string' || typeof item === 'string') {
            this.type = 'tag';
            this.name = 'text';
            this.data = children || (item as any as string);

        } else {
            this.type = 'tag';
            this.name = this.mapRNTypeToTag(CompType);
            // this.children = this.childNodes = this.extractChildren(children);
        }
        this.attributes.name = this.name;
        // Link sibling pointers

    }

    private mapRNTypeToTag(CompType: any): string {
        if (CompType?.name === 'View') return 'div';
        if (CompType?.name === 'Text') return 'span';
        if (CompType?.name === 'Image') return 'img';
        return typeof CompType === 'string' ? CompType : 'div';
    }

    private extractAttribs(props: any = {}): Record<string, string> {
        const attribs: Record<string, string> = {};

        // Convert style to inline CSS
        if (props.style) {
            const css = this.rnStyleToCss(props.style);
            attribs.style = Object.entries(css).map(([k, v]) => `${k}:${v}`).join('; ');
        }

        // Map RN props to HTML-like attributes
        //        const map = ['id', 'className', 'title', 'alt', 'name', 'href', 'src', 'type'];
        for (const key in props) {
            if (props[key]) attribs[key] = String(props[key]);
        }

        return attribs;
    }



    private rnStyleToCss(style: any): Record<string, string> {
        const css: any = {};
        const styles = Array.isArray(style) ? Object.assign({}, ...style) : style;
        for (const key in styles) {
            const value = styles[key];
            const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
            css[cssKey] = typeof value === 'number' && !['zIndex', 'opacity'].includes(key)
                ? `${value}px`
                : value;
        }
        return css;
    }

    // Optional helper: return text recursively
    getText(): string {
        if (this.type === 'text') return this.data ?? '';
        return this.children.map(c => c.getText()).join('');
    }
}
