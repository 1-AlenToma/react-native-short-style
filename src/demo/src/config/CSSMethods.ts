export const flatStyle = (style: any) => {
    if (style && Array.isArray(style) && typeof style == "object")
        style = style.reduce((a, v) => {
            if (v)
                a = { ...a, ...v };
            return a;
        }, {});

    return style ?? {};
}

export const parseKeys = (key: string) => {
    let t = "";
    let keys: string[] = [];
    for (let i = 0; i < key.length; i++) {
        let k = key[i];
        let nKey = key[i + 1];
        if (k != "$") {
            t += k;
            continue;
        }

        if (k == "$" && nKey != "$") {
            if (!keys.includes(t))
                keys.push(t); // 
            t += "."
            continue
        }

        if (k == "$" && nKey == "$") {
            if (!keys.includes(t))
                keys.push(t);
            t = keys[keys.length - 2] ?? t;
        }
    }

    keys.push(t);
    return keys.filter(x => x && x.length > 0)
}

export const extractProps = (css?: string) => {
    let result = { css, _hasValue: false };
    if (!css)
        return result
    if (/(props\:)( )?(\{)(.*)(\})/g.test(css)) {
        result._hasValue = true;
        let value = css.match(/((props\:)( )?(\{)(.*)(\}))/g);
        if (value && value.length > 0) {
            let items = [];
            for (let item of value) {
                let pItem = JSON.parse(item.replace(/(props:)/g, ""));
                if (pItem.css) {
                    css = css.replace(item, pItem.css);
                    delete pItem.css
                }
                else css = css.replace(item, "")
                items.push(pItem)
            }
            if (items.length > 0)
                result = { ...result, ...flatStyle(items) };
        }
    }

    result.css = css;
    return result;
}

let ids = new Map();
let lastDate = new Date();
export const newId = (inc?: string): string => {
    if (lastDate.getMinutes() - new Date().getMinutes() > 1) {
        ids = new Map();
        lastDate = new Date();
    }
    let id: string = (inc ?? "") + Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)
    if (ids.has(id)) {
        return (newId(id) as string);
    }
    ids.set(id, id);
    return id;
}