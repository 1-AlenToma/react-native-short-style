import { SelectorPart } from "../Typse";

export function parseSelector(selector: string): SelectorPart[] {
    const parts: SelectorPart[] = [];

    let buf = "";
    let relation: "child" | "descendant" = "descendant";
    let paren = 0;
    let bracket = 0;
    let quote: string | null = null;
    let esc = false;

    const flushToken = (token: string) => {
        if (!token.trim()) return;
        parts.push(parsePart(token.trim(), relation));
    };

    for (let i = 0; i < selector.length; i++) {
        const ch = selector[i];

        if (esc) { buf += ch; esc = false; continue; }
        if (ch === "\\") { buf += ch; esc = true; continue; }
        if (quote) {
            buf += ch;
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === "'" || ch === '"') { buf += ch; quote = ch; continue; }
        if (ch === "(") { paren++; buf += ch; continue; }
        if (ch === ")") { paren--; buf += ch; continue; }
        if (ch === "[") { bracket++; buf += ch; continue; }
        if (ch === "]") { bracket--; buf += ch; continue; }

        // top-level separator '>'
        if (paren === 0 && bracket === 0 && ch === ">") {
            flushToken(buf);
            buf = "";
            relation = "child";
            continue;
        }

        // top-level whitespace
        if (paren === 0 && bracket === 0 && /\s/.test(ch) && buf.length > 0) {
            flushToken(buf);
            buf = "";
            relation = "descendant";
            continue;
        }

        buf += ch;
    }

    flushToken(buf);

    return parts;
}

// parse a single token like "virtualItemSelector:nth(even):not(:has(selectedValue))"
function parsePart(token: string, relation: "child" | "descendant"): SelectorPart {
    let baseType = "";
    const sel: SelectorPart = { type: "*", relation };

    let i = 0;
    const pseudos: { name: string; arg?: string }[] = [];
    const attrs: { key: string; op?: string; value?: string }[] = [];

    while (i < token.length) {
        const ch = token[i];

        // Handle attribute start
        if (ch === "[") {
            let start = i + 1;
            let depth = 1;
            while (i + 1 < token.length && depth > 0) {
                i++;
                if (token[i] === "[") depth++;
                else if (token[i] === "]") depth--;
            }
            const content = token.slice(start, i);
            const parsedAttr = parseAttr(content);
            attrs.push(...parsedAttr);
            i++;
            continue;
        }
        sel.pseudos = sel.pseudos ?? [];
        // Handle pseudos
        if (ch === ":") {
            i++;
            let name = "";
            while (i < token.length && /[a-zA-Z-]/.test(token[i])) { name += token[i]; i++; }
            let arg: string | SelectorPart[][] | undefined;
            if (token[i] === "(") {
                let depth = 0;
                let start = i;
                while (i < token.length) {
                    if (token[i] === "(") depth++;
                    if (token[i] === ")") depth--;
                    i++;
                    if (depth === 0) break;
                }
                arg = token.slice(start + 1, i - 1);
            }

            const lname = name.toLowerCase();
            if (lname === "not" || lname == "has") sel.pseudos.push({ name: lname, arg: (arg as string)?.split(/\s*,\s*/).map(s => parseSelector(s)) ?? [] });
            else {
                sel.pseudos.push({ name: lname, arg });
                //  sel.pseudo = arg ? `${name}(${arg})` : name;

            }

            continue;
        }

        // Base type (before first ':' or '[')
        baseType += ch;
        i++;
    }

    sel.type = baseType.trim() || "*";
    if (attrs.length) sel.attrs = attrs;

    return sel;
}

// helper: parse attribute string into {key, op, value}
function parseAttr(attr: string) {
    const out: { key: string; op?: string; value?: string }[] = [];

    // All supported operators (longest first so we don’t split wrongly)
    const ops = ["!=", "^=", "$=", "*=", "~=", "|=", "="];

    let foundOp: string | undefined;
    let key = attr.trim();
    let value: string | undefined;

    for (const op of ops) {
        const idx = attr.indexOf(op);
        if (idx !== -1) {
            foundOp = op;
            key = attr.slice(0, idx).trim();
            value = attr.slice(idx + op.length).trim();

            // strip quotes from value if present
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }
            break;
        }
    }

    out.push({ key, op: foundOp, value });
    return out;
}


