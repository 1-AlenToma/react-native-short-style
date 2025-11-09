import { devNull } from "os";
import { parseSelector } from "../config/CssSelectorParser";
import cssTranslator, { clearCss } from "../styles/cssTranslator";
import { IParent, SelectorPart, StyleContextType, IPositionContext } from "../Typse";
import * as React from "react";
import { devToolsHandlerContext } from "../theme/ThemeContext";

export const PositionContext = React.createContext<IPositionContext>({ index: 0, parentId: "__0__" })





// FullPathNode now keeps classes per node
type FullPathNode = string[];

// Build fullPath hierarchy
const expandFullPath = (parent: IParent | undefined, type: string, classPath: string[]): FullPathNode[] => {
    const result: FullPathNode[] = [];
    const traverse = (p?: IParent) => {
        if (!p) return;
        if (p.parent) traverse(p.parent);
        result.push([...p.classPath, p?.type ?? "unknown"]);
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

        const parentChildren = Array.from(p?.parent?.childrenPaths?.values() ?? []);
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
    const lastParentChildren = Array.from(parent?.childrenPaths?.values() ?? []);;
    typeIndex[lastIdx] = lastParentChildren.find(x => x.index === index && x.type === type)?.typeIndex ?? 0;
    totalTypes[lastIdx] = lastParentChildren.filter(x => x.type === type).length;
    props[lastIdx] = thisParent?.props ?? {};

    return { indices, totals, totalTypes, typeIndex, props };
}




// --- Match selector ---
// --- Match selector ---
function matchSelector(
    fullPath: FullPathNode[],
    selector: SelectorPart[],
    indices: number[],
    totals: number[],
    totalTypes: any[],
    typeIndex: any[],
    props: Record<number, Record<string, any>>,
    pathIndex: number = -1
): boolean {

    if (pathIndex === -1) pathIndex = fullPath.length - 1;
    let selectorIndex = selector.length - 1;

    // --- Check pseudos ---
    function checkPseudos(sel: SelectorPart, currentPath: number): boolean {
        if (!sel.pseudos || sel.pseudos.length === 0) return true;

        const tot = totals[currentPath] ?? 1;
        const idx = indices[currentPath] ?? 0;
        const typeIdx = typeIndex[currentPath] ?? 0;
        const typeTot = totalTypes[currentPath] ?? 1;

        for (const pseudo of sel.pseudos) {
            const name = pseudo.name.toLowerCase();

            switch (name) {
                // --- Structural ---
                case "first-child": if (idx !== 0) return false; break;
                case "last-child": if (idx !== tot - 1) return false; break;
                case "only-child": if (tot !== 1) return false; break;
                case "first-of-type": if (typeIdx !== 0) return false; break;
                case "last-of-type": if (typeIdx !== typeTot - 1) return false; break;
                case "only-of-type": if (typeTot !== 1) return false; break;

                // --- nth variants ---
                case "nth": {
                    const value = String(pseudo.arg ?? "").trim();
                    if (/even/i.test(value)) { if (idx % 2 !== 0) return false; }
                    else if (/odd/i.test(value)) { if (idx % 2 !== 1) return false; }
                    else { const nth = parseInt(value, 10); if (idx + 1 !== nth) return false; }
                    break;
                }
                case "nth-of-type": {
                    const value = String(pseudo.arg ?? "").trim();
                    if (/even/i.test(value)) { if (typeIdx % 2 !== 0) return false; }
                    else if (/odd/i.test(value)) { if (typeIdx % 2 !== 1) return false; }
                    else { const nth = parseInt(value, 10); if (typeIdx + 1 !== nth) return false; }
                    break;
                }

                // --- eq shortcuts ---
                case "eq": { const eq = parseInt(String(pseudo.arg ?? "0"), 10); if (idx !== eq) return false; break; }
                case "eq-of-type": { const eq = parseInt(String(pseudo.arg ?? "0"), 10); if (typeIdx !== eq) return false; break; }

                // --- :not(...) ---
                case "not": {
                    if (Array.isArray(pseudo.arg)) {
                        for (const group of pseudo.arg) {
                            let startIndex = currentPath + 1; // start after current node
                            const firstRelation = group[0]?.relation || "descendant";
                            // check descendants for match
                            while (startIndex < fullPath.length) {
                                if (matchSelector(fullPath, group, indices, totals, totalTypes, typeIndex, props, startIndex)) {
                                    return false; // excluded because descendant matches
                                }

                                if (firstRelation === "child") break; // only check immediate child
                                startIndex++;
                            }
                        }
                    }
                    break;
                }

                // --- :has(...) ---
                case "has": {
                    if (!Array.isArray(pseudo.arg)) break;
                    for (const group of pseudo.arg) {
                        let found = false;
                        let startIndex = currentPath + 1; // start after current node
                        const firstRelation = group[0]?.relation || "descendant";
                        while (startIndex < fullPath.length) {
                            if (matchSelector(fullPath, group, indices, totals, totalTypes, typeIndex, props, startIndex)) {
                                found = true;
                                break;
                            }


                            if (firstRelation === "child") break; // only check immediate child
                            startIndex++;
                        }
                        if (!found) return false; // required descendant missing
                    }
                    break;
                }

                default:
                    break; // ignore unknown pseudos
            }
        }

        return true;
    }

    // --- Check attributes ---
    function checkAttrs(sel: SelectorPart, currentPath: number): boolean {
        if (!sel.attrs || sel.attrs.length === 0) return true;
        const nodeProps = props[currentPath] ?? {};
        for (const { key, op, value } of sel.attrs) {
            const actual = nodeProps[key];
            switch (op) {
                case "=": if (String(actual) !== value) return false; break;
                case "!=": if (String(actual) === value) return false; break;
                case "^=": if (typeof actual !== "string" || !actual.startsWith(value)) return false; break;
                case "$=": if (typeof actual !== "string" || !actual.endsWith(value)) return false; break;
                case "*=": if (typeof actual !== "string" || !actual.includes(value)) return false; break;
                case "~=": if (typeof actual !== "string" || !actual.split(/\s+/).includes(value)) return false; break;
                case "|=": if (typeof actual !== "string" || (actual !== value && !actual.startsWith(value + "-"))) return false; break;
                default: if (actual === undefined) return false;
            }
        }
        return true;
    }

    // --- Main matching loop ---
    while (pathIndex >= 0 && selectorIndex >= 0) {
        const node = fullPath[pathIndex];
        const sel = selector[selectorIndex];

        const typeMatches = sel.type === "*" || node.includes(sel.type);

        if (!(typeMatches && checkPseudos(sel, pathIndex) && checkAttrs(sel, pathIndex))) {
            return false;
        }

        selectorIndex--;

        if (sel.relation === "child") {
            pathIndex--; // must match immediate parent
        } else if (selectorIndex >= 0) {
            // descendant relation
            const nextSel = selector[selectorIndex];
            let found = false;
            for (let tempP = pathIndex - 1; tempP >= 0; tempP--) {
                const nextNode = fullPath[tempP];
                if (nextNode.includes(nextSel.type || "*") &&
                    checkPseudos(nextSel, tempP) &&
                    checkAttrs(nextSel, tempP)) {
                    found = true;
                    pathIndex = tempP;
                    selectorIndex--;
                    break;
                }
            }
            if (!found) return false;
        } else {
            pathIndex--;
        }
    }

    return selectorIndex < 0; // all selector parts matched
}


// --- useStyled ---
export function useStyled(parentId: string, context: StyleContextType, type: string, index: number, total: number, variant?: string, thisParent?: IParent, systemTheme?: any) {
    const id = `${parentId}_useStyled`;
    const current = variant ? `${type}.${variant}` : type;
    const classNames = thisParent?.classPath ?? [];
    const idDev = devToolsHandlerContext.data.isOpened && __DEV__;

    React.useEffect(() => {
        return () => clearCss(id);
    })

    const fullPath = expandFullPath(context.parent, current, classNames);
    //console.log(fullPath)

    // Build indices, totals, typeIndex, totalTypes, props
    const { indices, totals, typeIndex, totalTypes, props } = buildNodeMeta(fullPath, context.parent, thisParent, type, index, total);

    let merged: Record<string, any> = {};
    let important: Record<string, any> = {};
    let keyStyle: Record<string, any> = {};

    for (const rule of context.rules) {
        let keySelector: Record<string, any> = {};
        let keySelectorImportant: Record<string, any> = {};
        for (const item of rule.parsedSelector) {
            //const selectorParts = parseSelector(selStr);
            //  const selectorParts = selStr.
            const lastPart = item[item.length - 1];

            if (lastPart && lastPart.type !== "*" && !fullPath[fullPath.length - 1].includes(lastPart.type))
                continue;

            /*  if (rule.selectors.find(x => x.indexOf("virtualItemSelector:nth") !== -1) && fullPath.find(x => x.indexOf("virtualItemSelector") != -1)) {
                  console.log(rule)
      
              }*/
            if (!matchSelector(fullPath, item, indices, totals, totalTypes, typeIndex, props))
                continue;
            // if (lastPart.type == "Text" && rule.selectors.includes("container> Text"))
            //   console.log("here")


            if (typeof rule.style === "string") {
                let st = cssTranslator(rule.style as any as string, systemTheme);
                merged = { ...merged, ...st };
                if (merged.important) important = { ...important, ...cleanStyle(merged.important) };
                merged = cleanStyle(merged);
                if (idDev) {
                    keySelector = ({ ...keySelector, ...st });
                    if (keySelector.important)
                        keySelectorImportant = { ...keySelectorImportant, ...cleanStyle(keySelector.important) };
                    keySelector = cleanStyle(keySelector);

                }
            } else {
                const isWholeImportant = (rule.style as any)["!important"] === true;
                for (const [key, value] of Object.entries(rule.style)) {
                    if (key === "!important") continue;
                    if (typeof value === "string" && value.endsWith("!important")) {
                        important[key] = value.replace(/(\-)?!important/gi, "").trim();
                        if (idDev)
                            keySelectorImportant[key] = important[key]
                    } else if (isWholeImportant) {
                        important[key] = value;
                        if (idDev)
                            keySelectorImportant[key] = value;
                    } else {
                        if (!(key in important))
                            merged[key] = value;
                        if (idDev && !(key in keySelectorImportant))
                            keySelectorImportant[key] = value;
                    }
                }
            }


        }

        keyStyle[rule.selectors.join(",")] = { ...keySelector, ...keySelectorImportant };
    }

    return [{ ...merged, important }, keyStyle] as [Record<string, any> & { important: typeof important }, Record<string, any>];
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