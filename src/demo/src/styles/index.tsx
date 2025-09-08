import React, { useRef } from "react";
import {
    View as RNView,
    Text as RNText,
    TouchableOpacity,
    Platform,
} from "react-native";
import { globalData, InternalThemeContext, StyleContext, ThemeContext } from "../theme/ThemeContext";
import { CSSProps, CSSStyle } from "./CSSStyle";
import { currentTheme, ifSelector, newId, refCreator, setRef, ValueIdentity } from "../config";
import { SelectorPart, Rule, StyleContextType } from "../Typse";
import NestedStyleSheet from "./NestedStyleSheet";
import cssTranslator from "./cssTranslator";

// --- Types ---

class IParent {
    index?: number;
    total?: number;
    parent?: IParent;
    childrenPaths: { type: string, index: number, typeIndex: number }[] = [];
    classPath: string[] = [];
    props: Record<string, any> = {};

    reg(type: string, index: number) {
        if (!this.childrenPaths.find(x => x.index == index && x.type == type))
            this.childrenPaths.push({ type, index, typeIndex: this.childrenPaths.filter(x => x.type == type).length });
    }
}




// --- Selector Parser ---
function parseSelector(selector: string): SelectorPart[] {
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
function useStyled(context: StyleContextType, type: string, index: number, total: number, variant?: string, thisParent?: IParent, systemTheme?: any) {
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




const cleanStyle = (style: any, parse?: boolean) => {
    if (parse)
        style = { ...style, ...style.important };
    if (style?.important)
        delete style.important;
    if (style?._props)
        delete style?.props;
    return style;
}



const cn = { View: RNView, Button: TouchableOpacity, Icon: RNView, Text: RNText, } as any;
// --- StyleParent --- (simpler, no mapping)

export class CMBuilder {
    __name: string;
    __View: any;
    myRef: any = undefined;
    constructor(name: string, view: any) {
        this.__name = name;
        this.__View = view;
        //  console.log(view)
    }

    setRef(cRef: any, c: any) {
        if (c === null)
            return;
        if (c === this.myRef) {
            return;
        }
        try {
            /* const props = this.getNextProps();
             if (reactNative.Platform.OS != "web") {
                 let item = assignRf((c ?? {}) as DomPath<any, any>, { ...props, css: this.refItem.contextValue.getCss() });
                 this.refItem.contextValue.setViews(item);
                 (this.context as any)?.registerView?.(item);// to parent
                 setRef(props.cRef, item);
             } else*/
            setRef(cRef, c);
        } catch (e) {
            console.error(e)
        } finally {
            this.myRef = c;
        }
    }

    fn() {
        const bound: any = this.renderFirst.bind(this);
        bound.__name = this.__name; // attach __name to the bound function
        return refCreator(bound, this.__name, this.__View);
    }

    renderFirst(props: CSSProps<any>, ref: any) {
        const RN = useRef<any>(this.render.bind(this)).current;
        const css = React.useMemo(() => {
            if (props && typeof props.css === "function") {
                return props.css(new CSSStyle()).toString();
            }
            return props?.css || "";
        }, [props?.css]);

        const ifTrue = props && ifSelector(props.ifTrue)
        if (ifSelector(ifTrue) === false)
            return null;


        RN.__name = this.__name;
        return <RN {...props} ifTrue={true} css={css} cRef={(c) => setRef(ref, c)} />
    }

    render({ children, __styleIndex, __styleTotal, variant, cRef, ...props }: CSSProps<any>) {
        const context = React.useContext(StyleContext);
        const themeContext = React.useContext(ThemeContext);
        const systemTheme = currentTheme(themeContext);
        //const id = useRef(newId()).current;
        const CM = this.__View;
        const childrenArray = React.Children.toArray(children).filter((c) => c != null);
        const childTotal = childrenArray.length;
        const isTextWeb = CM.displayName === "Text" && Platform.OS === "web";
        const dataSet = __DEV__ && Platform.OS == "web" && props.css ? { css: "__DEV__ CSS:" + props.css, type: this.__name } : undefined;
        const classNames = ValueIdentity.getClasses(props.css);
        const className = classNames.join(" ");
        //const css = ValueIdentity.cleanCss(props.css);
        const css = props.css;


        // console.log(context)
        if (isTextWeb) {
            globalData.hook("activePan");
        }
        const current = variant ? `${this.__name}.${variant}` : this.__name;
        const fullPath = [...context.path, current];

        const prt = new IParent();
        prt.index = __styleIndex ?? 0;
        prt.total = __styleTotal ?? context.parent?.total ?? 1;
        prt.classPath = classNames.filter(Boolean);
        prt.parent = context.parent;
        prt.props = { className: classNames.join(" "), type: this.__name, ...props };
        // console.log(prt.props)
        context.parent?.reg(this.__name, __styleIndex ?? 0);
        prt.classPath.forEach((x: string) => context.parent?.reg(x, __styleIndex ?? 0));

        const regChild = (child: any, idx: number) => {
            const typeName =
                (child.type as any)?.__name ||
                (child.type as any)?.displayName ||
                (child.type as any)?.name ||
                "unknown";

            const classNames = ValueIdentity.getClasses(props.css);
            classNames.forEach(x => prt.reg(x, idx))
            prt.reg(typeName, idx);
        }

        const cloneChild = (childrens: any[]) => {
            return React.Children.map(childrens, ((child, idx) => {
                if (React.isValidElement(child as any) && child.type !== React.Fragment) {
                    regChild(child, idx)
                    return (React.cloneElement(child as any, {
                        __styleIndex: idx,
                        __styleTotal: childTotal,
                    }));
                }

                if (React.isValidElement(child as any) && child.type === React.Fragment) {
                    return (
                        <React.Fragment key={idx}>
                            {cloneChild(child.props.children)}
                        </React.Fragment>
                    );
                }

                return child;
            }
            ));
        }

        const mappedChildren = cloneChild(childrenArray)

        let cssStyle = undefined
        const style = useStyled(context, this.__name, __styleIndex ?? 0, __styleTotal ?? context.parent?.total ?? 1, variant, prt, systemTheme);

        if (css && css.trim().length > 0)
            cssStyle = cleanStyle(cssTranslator(css, systemTheme), true);



        const styles = (Array.isArray(props.style) ? [style, cssStyle, ...props.style] : [style, cssStyle, props.style]).filter(Boolean);
        if (isTextWeb && globalData.activePan)
            styles.push({ userSelect: "none" });



        if (childTotal === 0) return <CM dataSet={dataSet} {...props} ref={c => this.setRef(cRef, c)} style={styles} />

        return (
            <StyleContext.Provider
                value={{
                    rules: context.rules,
                    path: fullPath,
                    parent: prt,
                }}>
                <CM dataSet={dataSet} {...props} ref={c => this.setRef(cRef, c)} style={styles}>{mappedChildren}</CM>
            </StyleContext.Provider>
        );
    };
}


export {
    NestedStyleSheet,
    cssTranslator
};