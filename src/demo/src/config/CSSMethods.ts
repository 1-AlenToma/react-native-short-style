export const flatStyle = (style: any) => {
    if (style && Array.isArray(style) && typeof style == "object")
        style = style.reduce((a, v) => {
            if (v)
                a = { ...a, ...v };
            return a;
        }, {});

    return style ?? {};
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