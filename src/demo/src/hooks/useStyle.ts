import cssTranslator from "../styles/cssTranslator";
import { IParent, SelectorPart, StyleContextType } from "../Typse";

// --- Selector Parser ---
export function parseSelector(selector: string): SelectorPart[] {
    const parts: SelectorPart[] = [];
    const regex =
        /(\s*>\s*|\s+)?([A-Za-z0-9_.*\[\]=!'"-]+)(?::(first-child|last-child|nth\((\d+)\)|eq\((\d+)\)|not\(([^)]+)\)))?/g;

    let match: RegExpExecArray | null;

    while ((match = regex.exec(selector))) {
        const [, rel, rawType, pseudo, nth, eq, notArg] = match;
        let pseudoVal: string | undefined;
        let notParts: SelectorPart[][] | undefined;

        if (pseudo === "first-child" || pseudo === "last-child") pseudoVal = pseudo;
        else if (nth) pseudoVal = `nth(${nth})`;
        else if (eq) pseudoVal = `eq(${eq})`;
        else if (pseudo?.startsWith("not")) {
            if (notArg) {
                const selectors = notArg.split(/\s*,\s*/).map(s => s.trim()).filter(Boolean);
                notParts = selectors.map((sel) => parseSelector(sel));
            }
        }

        // 🔹 Extract attributes [key=val]
        const attrs: { key: string; op?: string; value?: string }[] = [];
        const attrRegex = /\[([A-Za-z0-9_]+)\s*(?:(!=|=))\s*['"]?([^'"\]]+)['"]?\]/g;
        let attrMatch: RegExpExecArray | null;
        while (rawType && (attrMatch = attrRegex.exec(rawType))) {
            const [, key, op, val] = attrMatch;
            attrs.push({ key: key ?? "", op: op || undefined, value: val || undefined });
        }

        const cleanType = rawType?.replace(/\[.*?\]/g, ""); // remove [attr]

        parts.push({
            type: cleanType || "*",
            pseudo: pseudoVal,
            relation: rel?.includes(">") ? "child" : "descendant",
            not: notParts,
            attrs: attrs.length > 0 ? attrs : undefined,
        });
    }
    return parts;
}

// FullPathNode now keeps classes per node
type FullPathNode = string[];

// Build fullPath hierarchy
const expandFullPath = (parent: IParent | undefined, type: string, classPath: string[]): FullPathNode[] => {
    const result: FullPathNode[] = [];
    const traverse = (p?: IParent) => {
        if (!p) return;
        if (p.parent) traverse(p.parent);
        result.push([...p.classPath, p.props?.type ?? "unknown"]);
    };
    traverse(parent);
    result.push([...classPath, type]);
    return result;
};

// Compute indices, totals, typeIndex, totalTypes
function buildNodeMeta(fullPath: FullPathNode[], parent: IParent | undefined, thisParent: IParent | undefined, type: string, index: number, total: number) {
    const indices: number[] = [];
    const totals: number[] = [];
    const totalTypes: number[] = [];
    const typeIndex: number[] = [];
    const props: Record<number, Record<string, any>> = [];

    let p: IParent | undefined = thisParent;
    let i = fullPath.length - 1;

    while (i >= 0) {
        const nodeType = fullPath[i][fullPath[i].length - 1]; // last item is base type
        indices[i] = p?.index ?? 0;
        totals[i] = p?.total ?? 1;

        const parentChildren = p?.parent?.childrenPaths ?? [];
        typeIndex[i] = parentChildren.find(x => x.index === indices[i] && x.type === nodeType)?.typeIndex ?? 0;
        totalTypes[i] = parentChildren.filter(x => x.type === nodeType).length;

        props[i] = p?.props ?? {};

        p = p?.parent;
        i--;
    }

    // Override last node with current type/index/total
    const lastIdx = fullPath.length - 1;
    indices[lastIdx] = index;
    totals[lastIdx] = total;
    const lastParentChildren = parent?.childrenPaths ?? [];
    typeIndex[lastIdx] = lastParentChildren.find(x => x.index === index && x.type === type)?.typeIndex ?? 0;
    totalTypes[lastIdx] = lastParentChildren.filter(x => x.type === type).length;
    props[lastIdx] = thisParent?.props ?? {};

    return { indices, totals, totalTypes, typeIndex, props };
}




// --- Match selector ---
function matchSelector(
    fullPath: FullPathNode[],
    selector: SelectorPart[],
    indices: number[],
    totals: number[],
    totalTypes: any[],
    typeIndex: any[],
    props: Record<number, Record<string, any>>
): boolean {

    let p = fullPath.length - 1;
    let s = selector.length - 1;

    const checkPseudo = (sel: SelectorPart, idx: number, tot: number) => {
        if (!sel.pseudo) return true;
        if (sel.pseudo === "first-child") return idx === 0;
        if (sel.pseudo === "last-child") return idx === tot - 1;
        if (sel.pseudo.startsWith("nth(")) {
            const nth = parseInt(sel.pseudo.match(/\d+/)?.[0] ?? "0", 10);
            return idx + 1 === nth;
        }
        if (sel.pseudo.startsWith("eq(")) {
            const eq = parseInt(sel.pseudo.match(/\d+/)?.[0] ?? "0", 10);
            return idx === eq;
        }
        return true;
    };

    const checkAttrs = (sel: SelectorPart, currentPath: number): boolean => {
        if (!sel.attrs) return true;
        const nodeProps = props[currentPath] || {};
        for (const { key, op, value } of sel.attrs) {
            const actual = nodeProps[key];
            if (op === "=" && String(actual) !== value) return false;
            if (op === "!=" && String(actual) === value) return false;
            if (!op && actual === undefined) return false;
        }
        return true;
    };

    const checkNot = (sel: SelectorPart, currentPath: number): boolean => {
        if (!sel.not) return true;
        for (const notGroup of sel.not) {
            const pathSlice = fullPath.slice(0, currentPath + 1);
            const indicesSlice = indices.slice(0, currentPath + 1);
            const totalsSlice = totals.slice(0, currentPath + 1);
            const totalTypesSlice = totalTypes.slice(0, currentPath + 1);
            const typeIndexSlice = typeIndex.slice(0, currentPath + 1);
            const propsSlice: Record<number, Record<string, any>> = {};
            for (let i = 0; i <= currentPath; i++) propsSlice[i] = props[i] ?? {};
            if (matchSelector(pathSlice, notGroup, indicesSlice, totalsSlice, totalTypesSlice, typeIndexSlice, propsSlice)) {
                return false;
            }
        }
        return true;
    };

    while (s >= 0) {
        if (p < 0) return false;

        const sel = selector[s];

        const node = fullPath[p];
        const typeMatches = sel.type === "*" || node.includes(sel.type);
        if (!(typeMatches && checkPseudo(sel, typeIndex[p] ?? 0, totalTypes[p] ?? 1) && checkNot(sel, p) && checkAttrs(sel, p))) {
            return false;
        }

        s--;

        if (sel.relation === "child") {
            p--; // must match immediate parent
        } else if (s >= 0) {
            const nextSel = selector[s];
            let found = false;
            let tempP = p - 1;
            while (tempP >= 0) {
                const nextNode = fullPath[tempP];
                if (nextNode.includes(nextSel.type || "*") &&
                    checkPseudo(nextSel, typeIndex[tempP] ?? 0, totalTypes[tempP] ?? 1) &&
                    checkNot(nextSel, tempP) &&
                    checkAttrs(nextSel, tempP)) {
                    found = true;
                    p = tempP;
                    s--;
                    break;
                }
                tempP--;
            }
            if (!found) return false;
        } else {
            p--;
        }
    }

    return true;
}


// --- useStyled ---
export function useStyled(context: StyleContextType, type: string, index: number, total: number, variant?: string, thisParent?: IParent, systemTheme?: any) {
    const current = variant ? `${type}.${variant}` : type;
    const classNames = thisParent?.classPath ?? [];

    const fullPath = expandFullPath(context.parent, current, classNames);

    // Build indices, totals, typeIndex, totalTypes, props
    const { indices, totals, typeIndex, totalTypes, props } = buildNodeMeta(fullPath, context.parent, thisParent, type, index, total);

    let merged: Record<string, any> = {};
    let important: Record<string, any> = {};

    for (const rule of context.rules) {
        for (const selStr of rule.selectors) {
            const selectorParts = parseSelector(selStr);
            const lastPart = selectorParts[selectorParts.length - 1];

            if (lastPart && lastPart.type !== "*" && !fullPath[fullPath.length - 1].includes(lastPart.type))
                continue;

            if (!matchSelector(fullPath, selectorParts, indices, totals, totalTypes, typeIndex, props))
                continue;

            if (typeof rule.style === "string") {
                merged = { ...merged, ...cssTranslator(rule.style as any as string, systemTheme) };
                if (merged.important) important = { ...important, ...merged.important };
                merged = cleanStyle(merged);
            } else {
                const isWholeImportant = (rule.style as any)["!important"] === true;
                for (const [key, value] of Object.entries(rule.style)) {
                    if (key === "!important") continue;
                    if (typeof value === "string" && value.endsWith("!important")) {
                        important[key] = value.replace("!important", "").trim();
                    } else if (isWholeImportant) {
                        important[key] = value;
                    } else if (!(key in important)) {
                        merged[key] = value;
                    }
                }
            }
        }
    }

    return { ...merged, ...important };
}




export const cleanStyle = (style: any, parse?: boolean) => {
    if (parse)
        style = { ...style, ...style.important };
    if (style?.important)
        delete style.important;
    if (style?._props)
        delete style?.props;
    return style;
}