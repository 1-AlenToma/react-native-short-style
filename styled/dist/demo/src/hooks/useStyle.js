import cssTranslator, { clearCss } from "../styles/cssTranslator";
import * as React from "react";
import { devToolsHandlerContext } from "../theme/ThemeContext";
export const PositionContext = React.createContext({ index: 0, parentId: "__0__" });
// Build fullPath hierarchy
const expandFullPath = (parent, type, classPath) => {
    const result = [];
    const traverse = (p) => {
        var _a;
        if (!p)
            return;
        if (p.parent)
            traverse(p.parent);
        result.push([...p.classPath, (_a = p === null || p === void 0 ? void 0 : p.type) !== null && _a !== void 0 ? _a : "unknown"]);
    };
    traverse(parent);
    result.push([...classPath, type]);
    return result;
};
// Compute indices, totals, typeIndex, totalTypes
function buildNodeMeta(fullPath, parent, thisParent, type, index, total) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const indices = [];
    const totals = [];
    const totalTypes = [];
    const typeIndex = [];
    const props = [];
    let p = thisParent;
    let i = fullPath.length - 1;
    while (i >= 0) {
        const nodeType = fullPath[i][fullPath[i].length - 1]; // last item is base type
        indices[i] = (_a = p === null || p === void 0 ? void 0 : p.index) !== null && _a !== void 0 ? _a : 0;
        totals[i] = (_b = p === null || p === void 0 ? void 0 : p.total) !== null && _b !== void 0 ? _b : 1;
        const parentChildren = Array.from((_e = (_d = (_c = p === null || p === void 0 ? void 0 : p.parent) === null || _c === void 0 ? void 0 : _c.childrenPaths) === null || _d === void 0 ? void 0 : _d.values()) !== null && _e !== void 0 ? _e : []);
        typeIndex[i] = (_g = (_f = parentChildren.find(x => x.index === indices[i] && x.type === nodeType)) === null || _f === void 0 ? void 0 : _f.typeIndex) !== null && _g !== void 0 ? _g : 0;
        totalTypes[i] = parentChildren.filter(x => x.type === nodeType).length;
        props[i] = (_h = p === null || p === void 0 ? void 0 : p.props) !== null && _h !== void 0 ? _h : {};
        p = p === null || p === void 0 ? void 0 : p.parent;
        i--;
    }
    // Override last node with current type/index/total
    const lastIdx = fullPath.length - 1;
    indices[lastIdx] = index;
    totals[lastIdx] = total;
    const lastParentChildren = Array.from((_k = (_j = parent === null || parent === void 0 ? void 0 : parent.childrenPaths) === null || _j === void 0 ? void 0 : _j.values()) !== null && _k !== void 0 ? _k : []);
    ;
    typeIndex[lastIdx] = (_m = (_l = lastParentChildren.find(x => x.index === index && x.type === type)) === null || _l === void 0 ? void 0 : _l.typeIndex) !== null && _m !== void 0 ? _m : 0;
    totalTypes[lastIdx] = lastParentChildren.filter(x => x.type === type).length;
    props[lastIdx] = (_o = thisParent === null || thisParent === void 0 ? void 0 : thisParent.props) !== null && _o !== void 0 ? _o : {};
    return { indices, totals, totalTypes, typeIndex, props };
}
// --- Match selector ---
// --- Match selector ---
function matchSelector(fullPath, selector, indices, totals, totalTypes, typeIndex, props, pathIndex = -1) {
    if (pathIndex === -1)
        pathIndex = fullPath.length - 1;
    let selectorIndex = selector.length - 1;
    // --- Check pseudos ---
    function checkPseudos(sel, currentPath) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (!sel.pseudos || sel.pseudos.length === 0)
            return true;
        const tot = (_a = totals[currentPath]) !== null && _a !== void 0 ? _a : 1;
        const idx = (_b = indices[currentPath]) !== null && _b !== void 0 ? _b : 0;
        const typeIdx = (_c = typeIndex[currentPath]) !== null && _c !== void 0 ? _c : 0;
        const typeTot = (_d = totalTypes[currentPath]) !== null && _d !== void 0 ? _d : 1;
        for (const pseudo of sel.pseudos) {
            const name = pseudo.name.toLowerCase();
            switch (name) {
                // --- Structural ---
                case "first-child":
                    if (idx !== 0)
                        return false;
                    break;
                case "last-child":
                    if (idx !== tot - 1)
                        return false;
                    break;
                case "only-child":
                    if (tot !== 1)
                        return false;
                    break;
                case "first-of-type":
                    if (typeIdx !== 0)
                        return false;
                    break;
                case "last-of-type":
                    if (typeIdx !== typeTot - 1)
                        return false;
                    break;
                case "only-of-type":
                    if (typeTot !== 1)
                        return false;
                    break;
                // --- nth variants ---
                case "nth": {
                    const value = String((_e = pseudo.arg) !== null && _e !== void 0 ? _e : "").trim();
                    if (/even/i.test(value)) {
                        if (idx % 2 !== 0)
                            return false;
                    }
                    else if (/odd/i.test(value)) {
                        if (idx % 2 !== 1)
                            return false;
                    }
                    else {
                        const nth = parseInt(value, 10);
                        if (idx + 1 !== nth)
                            return false;
                    }
                    break;
                }
                case "nth-of-type": {
                    const value = String((_f = pseudo.arg) !== null && _f !== void 0 ? _f : "").trim();
                    if (/even/i.test(value)) {
                        if (typeIdx % 2 !== 0)
                            return false;
                    }
                    else if (/odd/i.test(value)) {
                        if (typeIdx % 2 !== 1)
                            return false;
                    }
                    else {
                        const nth = parseInt(value, 10);
                        if (typeIdx + 1 !== nth)
                            return false;
                    }
                    break;
                }
                // --- eq shortcuts ---
                case "eq": {
                    const eq = parseInt(String((_g = pseudo.arg) !== null && _g !== void 0 ? _g : "0"), 10);
                    if (idx !== eq)
                        return false;
                    break;
                }
                case "eq-of-type": {
                    const eq = parseInt(String((_h = pseudo.arg) !== null && _h !== void 0 ? _h : "0"), 10);
                    if (typeIdx !== eq)
                        return false;
                    break;
                }
                // --- :not(...) ---
                case "not": {
                    if (Array.isArray(pseudo.arg)) {
                        for (const group of pseudo.arg) {
                            let startIndex = currentPath + 1; // start after current node
                            const firstRelation = ((_j = group[0]) === null || _j === void 0 ? void 0 : _j.relation) || "descendant";
                            // check descendants for match
                            while (startIndex < fullPath.length) {
                                if (matchSelector(fullPath, group, indices, totals, totalTypes, typeIndex, props, startIndex)) {
                                    return false; // excluded because descendant matches
                                }
                                if (firstRelation === "child")
                                    break; // only check immediate child
                                startIndex++;
                            }
                        }
                    }
                    break;
                }
                // --- :has(...) ---
                case "has": {
                    if (!Array.isArray(pseudo.arg))
                        break;
                    for (const group of pseudo.arg) {
                        let found = false;
                        let startIndex = currentPath + 1; // start after current node
                        const firstRelation = ((_k = group[0]) === null || _k === void 0 ? void 0 : _k.relation) || "descendant";
                        while (startIndex < fullPath.length) {
                            if (matchSelector(fullPath, group, indices, totals, totalTypes, typeIndex, props, startIndex)) {
                                found = true;
                                break;
                            }
                            if (firstRelation === "child")
                                break; // only check immediate child
                            startIndex++;
                        }
                        if (!found)
                            return false; // required descendant missing
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
    function checkAttrs(sel, currentPath) {
        var _a;
        if (!sel.attrs || sel.attrs.length === 0)
            return true;
        const nodeProps = (_a = props[currentPath]) !== null && _a !== void 0 ? _a : {};
        for (const { key, op, value } of sel.attrs) {
            const actual = nodeProps[key];
            switch (op) {
                case "=":
                    if (String(actual) !== value)
                        return false;
                    break;
                case "!=":
                    if (String(actual) === value)
                        return false;
                    break;
                case "^=":
                    if (typeof actual !== "string" || !actual.startsWith(value))
                        return false;
                    break;
                case "$=":
                    if (typeof actual !== "string" || !actual.endsWith(value))
                        return false;
                    break;
                case "*=":
                    if (typeof actual !== "string" || !actual.includes(value))
                        return false;
                    break;
                case "~=":
                    if (typeof actual !== "string" || !actual.split(/\s+/).includes(value))
                        return false;
                    break;
                case "|=":
                    if (typeof actual !== "string" || (actual !== value && !actual.startsWith(value + "-")))
                        return false;
                    break;
                default: if (actual === undefined)
                    return false;
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
        }
        else if (selectorIndex >= 0) {
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
            if (!found)
                return false;
        }
        else {
            pathIndex--;
        }
    }
    return selectorIndex < 0; // all selector parts matched
}
// --- useStyled ---
export function useStyled(parentId, context, type, index, total, variant, thisParent, systemTheme) {
    var _a;
    try {
        const id = `${parentId}_useStyled`;
        const current = variant ? `${type}.${variant}` : type;
        const classNames = (_a = thisParent === null || thisParent === void 0 ? void 0 : thisParent.classPath) !== null && _a !== void 0 ? _a : [];
        const idDev = devToolsHandlerContext.data.isOpened && __DEV__;
        React.useEffect(() => {
            return () => clearCss(id);
        });
        const fullPath = expandFullPath(context.parent, current, classNames);
        //console.log(fullPath)
        // Build indices, totals, typeIndex, totalTypes, props
        const { indices, totals, typeIndex, totalTypes, props } = buildNodeMeta(fullPath, context.parent, thisParent, type, index, total);
        let merged = {};
        let important = {};
        let keyStyle = {};
        for (const rule of context.rules) {
            let keySelector = {};
            let keySelectorImportant = {};
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
                    let st = cssTranslator(rule.style, systemTheme);
                    merged = Object.assign(Object.assign({}, merged), st);
                    if (merged.important)
                        important = Object.assign(Object.assign({}, important), cleanStyle(merged.important));
                    merged = cleanStyle(merged);
                    if (idDev) {
                        keySelector = (Object.assign(Object.assign({}, keySelector), st));
                        if (keySelector.important)
                            keySelectorImportant = Object.assign(Object.assign({}, keySelectorImportant), cleanStyle(keySelector.important));
                        keySelector = cleanStyle(keySelector);
                    }
                }
                else {
                    const isWholeImportant = rule.style["!important"] === true;
                    for (const [key, value] of Object.entries(rule.style)) {
                        if (key === "!important")
                            continue;
                        if (typeof value === "string" && value.endsWith("!important")) {
                            important[key] = value.replace(/(\-)?!important/gi, "").trim();
                            if (idDev)
                                keySelectorImportant[key] = important[key];
                        }
                        else if (isWholeImportant) {
                            important[key] = value;
                            if (idDev)
                                keySelectorImportant[key] = value;
                        }
                        else {
                            if (!(key in important))
                                merged[key] = value;
                            if (idDev && !(key in keySelectorImportant))
                                keySelectorImportant[key] = value;
                        }
                    }
                }
            }
            keyStyle[rule.selectors.join(",")] = Object.assign(Object.assign({}, keySelector), keySelectorImportant);
        }
        return [Object.assign(Object.assign({}, merged), { important }), keyStyle];
    }
    catch (e) {
        console.error("usestyle error");
        throw e;
    }
}
export const cleanStyle = (style, parse) => {
    if (parse)
        style = Object.assign(Object.assign({}, style), style.important);
    if (style === null || style === void 0 ? void 0 : style.important)
        delete style.important;
    if (style === null || style === void 0 ? void 0 : style._props)
        style === null || style === void 0 ? true : delete style.props;
    return style;
};
//# sourceMappingURL=useStyle.js.map