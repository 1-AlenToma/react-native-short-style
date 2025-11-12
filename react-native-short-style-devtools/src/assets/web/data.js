
window.cssColorNames = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
    transparent: "#00000000"
};

window.toHex = (color) => {
    return window.cssColorNames[color.toLowerCase()] ?? color;
}


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
