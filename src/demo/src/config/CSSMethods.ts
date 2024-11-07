export const flatStyle = (style: any) => {
    if (style && Array.isArray(style) && typeof style == "object")
        style = style.reduce((a, v) => {
            if (v)
                a = { ...a, ...v };
            return a;
        }, {});
    
    return style ?? {};
}