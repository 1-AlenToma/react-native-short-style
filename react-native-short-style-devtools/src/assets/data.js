window.RN_STYLE_PROPS = [
    { name: "alignContent", type: "enum", values: ["flex-start", "flex-end", "center", "stretch", "space-between", "space-around"] },
    { name: "alignItems", type: "enum", values: ["flex-start", "flex-end", "center", "stretch", "baseline"] },
    { name: "alignSelf", type: "enum", values: ["auto", "flex-start", "flex-end", "center", "stretch", "baseline"] },
    { name: "aspectRatio", type: "number" },
    { name: "backfaceVisibility", type: "enum", values: ["visible", "hidden"] },
    { name: "backgroundColor", type: "color" },
    { name: "borderBottomColor", type: "color" },
    { name: "borderBottomEndRadius", type: "number" },
    { name: "borderBottomLeftRadius", type: "number" },
    { name: "borderBottomRightRadius", type: "number" },
    { name: "borderBottomStartRadius", type: "number" },
    { name: "borderBottomWidth", type: "number" },
    { name: "borderColor", type: "color" },
    { name: "borderEndColor", type: "color" },
    { name: "borderLeftColor", type: "color" },
    { name: "borderLeftWidth", type: "number" },
    { name: "borderRadius", type: "number" },
    { name: "borderRightColor", type: "color" },
    { name: "borderRightWidth", type: "number" },
    { name: "borderStartColor", type: "color" },
    { name: "borderStyle", type: "enum", values: ["solid", "dotted", "dashed"] },
    { name: "borderTopColor", type: "color" },
    { name: "borderTopEndRadius", type: "number" },
    { name: "borderTopLeftRadius", type: "number" },
    { name: "borderTopRightRadius", type: "number" },
    { name: "borderTopStartRadius", type: "number" },
    { name: "borderTopWidth", type: "number" },
    { name: "borderWidth", type: "number" },
    { name: "bottom", type: "number|string" },
    { name: "color", type: "color" },
    { name: "columnGap", type: "number" },
    { name: "direction", type: "enum", values: ["inherit", "ltr", "rtl"] },
    { name: "display", type: "enum", values: ["none", "flex"] },
    { name: "elevation", type: "number" },
    { name: "end", type: "number|string" },
    { name: "flex", type: "number" },
    { name: "flexBasis", type: "number|string" },
    { name: "flexDirection", type: "enum", values: ["row", "row-reverse", "column", "column-reverse"] },
    { name: "flexGrow", type: "number" },
    { name: "flexShrink", type: "number" },
    { name: "flexWrap", type: "enum", values: ["wrap", "nowrap", "wrap-reverse"] },
    { name: "fontFamily", type: "string" },
    { name: "fontSize", type: "number" },
    { name: "fontStyle", type: "enum", values: ["normal", "italic"] },
    { name: "fontWeight", type: "enum", values: ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { name: "gap", type: "number" },
    { name: "height", type: "number|string" },
    { name: "includeFontPadding", type: "boolean" },
    { name: "justifyContent", type: "enum", values: ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"] },
    { name: "left", type: "number|string" },
    { name: "letterSpacing", type: "number" },
    { name: "lineHeight", type: "number" },
    { name: "margin", type: "number|string" },
    { name: "marginBottom", type: "number|string" },
    { name: "marginEnd", type: "number|string" },
    { name: "marginHorizontal", type: "number|string" },
    { name: "marginLeft", type: "number|string" },
    { name: "marginRight", type: "number|string" },
    { name: "marginStart", type: "number|string" },
    { name: "marginTop", type: "number|string" },
    { name: "marginVertical", type: "number|string" },
    { name: "maxHeight", type: "number|string" },
    { name: "maxWidth", type: "number|string" },
    { name: "minHeight", type: "number|string" },
    { name: "minWidth", type: "number|string" },
    { name: "objectFit", type: "enum", values: ["cover", "contain", "fill", "none", "scale-down"] },
    { name: "objectPosition", type: "string" },
    { name: "opacity", type: "number" },
    { name: "overflow", type: "enum", values: ["visible", "hidden", "scroll"] },
    { name: "overlayColor", type: "color" },
    { name: "padding", type: "number|string" },
    { name: "paddingBottom", type: "number|string" },
    { name: "paddingEnd", type: "number|string" },
    { name: "paddingHorizontal", type: "number|string" },
    { name: "paddingLeft", type: "number|string" },
    { name: "paddingRight", type: "number|string" },
    { name: "paddingStart", type: "number|string" },
    { name: "paddingTop", type: "number|string" },
    { name: "paddingVertical", type: "number|string" },
    { name: "position", type: "enum", values: ["absolute", "relative"] },
    { name: "resizeMode", type: "enum", values: ["cover", "contain", "stretch", "repeat", "center"] },
    { name: "right", type: "number|string" },
    { name: "rotation", type: "number" },
    { name: "scaleX", type: "number" },
    { name: "scaleY", type: "number" },
    { name: "shadowColor", type: "color" },
    { name: "shadowOpacity", type: "number" },
    { name: "shadowRadius", type: "number" },
    { name: "start", type: "number|string" },
    { name: "textAlign", type: "enum", values: ["auto", "left", "right", "center", "justify"] },
    { name: "textAlignVertical", type: "enum", values: ["auto", "top", "bottom", "center"] },
    { name: "textDecorationColor", type: "color" },
    { name: "textDecorationLine", type: "enum", values: ["none", "underline", "line-through", "underline line-through"] },
    { name: "textDecorationStyle", type: "enum", values: ["solid", "double", "dotted", "dashed"] },
    { name: "textShadowColor", type: "color" },
    { name: "textShadowRadius", type: "number" },
    { name: "tintColor", type: "color" },
    { name: "top", type: "number|string" },
    { name: "transform", type: "array" },
    { name: "transformMatrix", type: "array" },
    { name: "translateX", type: "number" },
    { name: "translateY", type: "number" },
    { name: "width", type: "number|string" },
    { name: "writingDirection", type: "enum", values: ["auto", "ltr", "rtl"] },
    { name: "zIndex", type: "number" },
];


// data test
const test = () => {
    let counter = 1
    document.getElementById("update").addEventListener("click", () => {
        apply_viewIdPatch({ name: 'Text', children: [], props: { _viewId: 454654, _parent_viewId: 2, _elementIndex: 0, children: `Hello Alen ${counter++}` }, children: [] })
    })

    document.getElementById("deleteNode").addEventListener("click", () => {
        deleteNode(454654)
    });

    const css = {
        container: {
            width: 100
        },
        box: {
            display: "flex"
        }
    }
    renderPayload({
        type: 'TREE_DATA',
        payload: {
            name: 'App',
            props: { platform: 'android', _viewId: 0 },
            children: [
                {
                    name: 'View',
                    props: { _viewId: 1, css, style: undefined, iftrue: false },
                    children: [
                        {
                            name: 'Header',
                            props: { title: 'My App', _viewId: 2, css: css, textCss: ".form div div:not(.buttons):nth-child(2) .form div div:not(.buttons):nth-child(2)", style: { height: 60, backgroundColor: '#222' } },
                            children: []
                        },
                        {
                            name: 'ScrollView',
                            props: { _viewId: 3, style: { flex: 1, marginTop: 8 } },
                            children: [
                                { name: 'Text', props: { _viewId: 4, children: 'Hello World', style: { fontSize: 16 } }, children: [] },
                                { name: 'Button', props: { _viewId: 5, title: 'Press me', style: { marginTop: 12 } }, children: [] },
                                {
                                    name: 'View',
                                    props: { _viewId: 6, style: { padding: 8, backgroundColor: '#111' } },
                                    children: [
                                        { name: 'Text', props: { _viewId: 7, children: 'Nested Text 1' }, children: [] },
                                        { name: 'Text', props: { _viewId: 8, children: 'Nested Text 2' }, children: [] },
                                        { name: 'Button', props: { _viewId: 9, title: 'Nested Button' }, children: [] },
                                        {
                                            name: 'View',
                                            props: { _viewId: 21, style: { padding: 4, backgroundColor: '#333' } },
                                            children: [
                                                { name: 'Text', props: { _viewId: 22, children: 'Deep Nested 1' }, children: [] },
                                                { name: 'Text', props: { _viewId: 23, children: 'Deep Nested 2' }, children: [] }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: 'FlatList',
                                    props: { _viewId: 10, dataLength: 3 },
                                    children: [
                                        { name: 'Text', props: { _viewId: 11, children: 'Item 1' }, children: [] },
                                        { name: 'Text', props: { _viewId: 12, children: 'Item 2' }, children: [] },
                                        { name: 'Text', props: { _viewId: 13, children: 'Item 3' }, children: [] }
                                    ]
                                },
                                {
                                    name: 'SectionList',
                                    props: { _viewId: 24, sections: 2 },
                                    children: [
                                        { name: 'Text', props: { _viewId: 25, children: 'Section 1 Header' }, children: [] },
                                        { name: 'Text', props: { _viewId: 26, children: 'Section 1 Item' }, children: [] },
                                        { name: 'Text', props: { _viewId: 27, children: 'Section 2 Header' }, children: [] },
                                        { name: 'Text', props: { _viewId: 28, children: 'Section 2 Item' }, children: [] }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'Footer',
                            props: { _viewId: 14, style: { height: 50, backgroundColor: '#333' } },
                            children: [
                                { name: 'Text', props: { _viewId: 15, children: 'Footer Text' }, children: [] },
                                { name: 'Button', props: { _viewId: 16, title: 'Footer Button' }, children: [] }
                            ]
                        }
                    ]
                },
                {
                    name: 'Modal',
                    props: { _viewId: 17, visible: true },
                    children: [
                        {
                            name: 'View', props: { _viewId: 18, style: { padding: 16, backgroundColor: '#222' } },
                            children: [
                                { name: 'Text', props: { _viewId: 19, children: 'Modal Title' }, children: [] },
                                { name: 'Button', props: { _viewId: 20, title: 'Close Modal' }, children: [] }
                            ]
                        }
                    ]
                },
                {
                    name: 'Drawer',
                    props: { _viewId: 29, open: false },
                    children: [
                        {
                            name: 'View', props: { _viewId: 30, style: { padding: 12 } },
                            children: [
                                { name: 'Text', props: { _viewId: 31, children: 'Menu Item 1' }, children: [] },
                                { name: 'Text', props: { _viewId: 32, children: 'Menu Item 2' }, children: [] },
                                { name: 'Text', props: { _viewId: 33, children: 'Menu Item 3' }, children: [] }
                            ]
                        }
                    ]
                }
            ]
        }
    }

    );
}


const dta = [{
    type: "TREE_DATA",
    name: "ThemeContextAPP",
    children: [],
    props: {
        _viewId: "__0__",
        platform: "test"
    }
}, {
    name: "View",
    children: [],
    props: {
        _viewId: "kjhasdjkh",
        _parent_viewId: "__0__"
    }
}]


const testWebView = () => {
    let item = dta.shift();
    if (item) {
        if (item.props._viewId == "__0__")
            renderPayload({ payload: item, type: "TREE_DATA" })
        else apply_viewIdPatch(item)

        setTimeout(() => {
            testWebView();
        }, 1);
    }

}


document.addEventListener("DOMContentLoaded", function () {
    if (window.appMode == "WebTest") {
        test();

        settings.consoleData.logs = [{ type: "log", content: "kjhakjshd kjhsdb" }],
            settings.consoleData.warnings = [{ type: "warning", content: "kjhakjshd kjhsdb" }],
            settings.consoleData.infos = [{ type: "info", content: "kjhakjshd kjhsdb" }],
            settings.consoleData.errors = [{ type: "error", content: dta }],
            parseConsole();

    }
    else {
        document.getElementById("update").remove();
        document.getElementById("deleteNode").remove();

    }
});
// alert(window.location)
//  testWebView();
