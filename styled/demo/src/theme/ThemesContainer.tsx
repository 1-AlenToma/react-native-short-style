import { ThemeContext, globalData, InternalThemeContext, StyleContext, devToolsHandlerContext } from "./ThemeContext";
import * as React from "react";
import { IThemeContext, Rule, Size } from "../Typse";
import StateBuilder from "../States";
import { newId, clearAllCss, currentTheme } from "../config";
import { View, AlertView, ToastView, TouchableOpacity, Text } from "../components";
import { GestureResponderEvent, Platform, StyleSheet, View as NativeView, Image } from "react-native";
import { parseSelector } from "../config/CssSelectorParser";
import { svgSelect } from "../constant";
import { DevtoolsIframe } from "../components/DevtoolsIframe";
import { sleep } from "react-smart-state";
import { useTimer } from "../hooks";


const StaticItem = ({ onMounted, id, item }: any) => {
    const state = StateBuilder({
        item: item
    }).ignore("item").build();

    onMounted(x => state.item = x);
    return state.item;
}



const StaticFullView = () => {
    const context = React.useContext(InternalThemeContext);
    const state = StateBuilder({
        updater: ""
    }).build();

    context.onItemsChange = () => {
        state.updater = newId();
    }
    const items = [...context.items().items.entries()];

    return (
        <View css={"_topPostion zi-4"} ifTrue={items.length > 0}>
            {
                items.map(([key, value], i) => (
                    <React.Fragment key={key}>
                        {value.el}
                    </React.Fragment>
                ))
            }
        </View>
    )
}

const StaticView = () => {
    const context = React.useContext(InternalThemeContext);
    const state = StateBuilder({
        updater: ""
    }).build();

    context.onStaticItemsChange = () => {
        state.updater = newId();

    }
    const items: any[] = [...context.items().staticItems.entries()]
    return (
        items.map(([key, value], i) => (
            <React.Fragment key={key}>
                {value.el}
            </React.Fragment>
        ))
    )
}

function parseStyles(obj: Record<string, any>, selectedIndex: number): Rule[] {
    const parsedTheme = React.useRef({}).current;
    if (!parsedTheme[selectedIndex] && obj)
        parsedTheme[selectedIndex] = Object.entries(obj).map(([selector, style]) => ({
            selectors: selector.split(",").map((s) => s.trim()),
            parsedSelector: selector.split(",").map(x => parseSelector(x.trim())),
            style,
        }));

    return parsedTheme[selectedIndex];
}


const ThemeInternalContainer = ({ children }: any) => {
    const state = StateBuilder({
        items: new Map<string, { el: any, onchange: Function }>(),
        staticItems: new Map<string, { el: any, onchange: Function }>(),
        containerSize: { height: 0, width: 0, y: 0, x: 0 }
    }).ignore("items", "containerSize", "staticItems").build();


    const contextValue = {
        add: (id: string, element: React.ReactNode, isStattic?: boolean) => {
            let item = !isStattic ? state.items.get(id) : state.staticItems.get(id);
            if (!item) {
                item = { onchange: undefined, el: undefined }
                item.el = (<StaticItem id={id} item={element} onMounted={(fn) => item.onchange = fn} />)
                if (!isStattic)
                    state.items.set(id, item);
                else
                    state.staticItems.set(id, item);

                if (!isStattic)
                    contextValue.onItemsChange?.();
                else
                    contextValue.onStaticItemsChange?.();
            } else item.onchange?.(element);
        },
        remove: (id: string) => {
            let hasItems = state.items.has(id);
            let hasStatic = state.staticItems.has(id);
            if (hasItems)
                state.items.delete(id);
            if (hasStatic)
                state.staticItems.delete(id);

            if (hasItems)
                contextValue.onItemsChange?.();
            if (hasStatic)
                contextValue.onStaticItemsChange?.();
        },
        totalItems: () => state.items.size,
        items: () => {
            return { items: state.items, staticItems: state.staticItems }
        },
        staticItems: () => state.staticItems,
        onItemsChange: () => { },
        onStaticItemsChange: () => { },
        containerSize: () => state.containerSize

    }



    return (
        <InternalThemeContext.Provider value={contextValue}>
            <DevtoolsIframe>
                <View onLayout={(event) => {
                    if (Platform.OS !== "web") {
                        event.target.measure(
                            (x, y, width, height) => {
                                state.containerSize.height = height;
                                state.containerSize.width = width;
                                state.containerSize.y = y;
                                state.containerSize.x = x;
                                globalData.containerSize = state.containerSize;
                            },
                        );
                    } else {
                        state.containerSize.height = event.nativeEvent.layout.height;
                        state.containerSize.width = event.nativeEvent.layout.width;
                        state.containerSize.y = event.nativeEvent.layout.y;
                        state.containerSize.x = event.nativeEvent.layout.x;
                        globalData.containerSize = state.containerSize;
                    }
                }} style={{ backgroundColor: "transparent", flex: 1, width: "100%", height: "100%" }}>
                    <DevToolLayoutSelector />
                    <StaticFullView />
                    <StaticView />
                    <ToastView />
                    <AlertView />
                    <View style={{
                        width: "100%",
                        height: "100%",
                        zIndex: 1
                    }}>
                        {children}
                    </View>
                </View>
            </DevtoolsIframe>
        </InternalThemeContext.Provider>
    )
}

export const DevToolLayoutSelector = () => {
    try {
        devToolsHandlerContext.hook("data.settings.elementSelection", "data.isOpened");
        const positionsRef = React.useRef<Map<any, Size>>(new Map());
        const [highlight, setHighlight] = React.useState<Size | null>(null);
        const [clicked, setClicked] = React.useState<Size | null>(null);
        const timer = useTimer(1)

        devToolsHandlerContext.useEffect(() => {
            if (devToolsHandlerContext.data.settings.elementSelection) {
                positionsRef.current = new Map();
                if (highlight)
                    setHighlight(null);
                if (clicked)
                    setClicked(null);
            }
        }, "data.settings.elementSelection")



        const measure = (el: NativeView) => {

            return new Promise<Size | undefined>((r) => {

                if (el.measureInWindow) {
                    el.measureInWindow((x, y, width, height) => {
                        r({ x, y, width, height, px: x, py: y });
                    });
                } else if (el.measure) {
                    el.measure((x, y, width, height, pageX, pageY) => {
                        r({ x, y, width, height, px: pageX, py: pageY });
                    });
                } else {
                    r(undefined);
                }
            });
        };

        const measureComponentOnce = async (cm: any, id: any) => {
            if (positionsRef.current.has(id)) return positionsRef.current.get(id);

            const pos = await measure(cm);
            if (pos) positionsRef.current.set(id, pos);
            return pos;
        };

        const selectComponentAt = async (x: number, y: number) => {
            try {

                let closestComponent: any = null;
                let smallestArea = Infinity;
                let closestRect: Size | undefined = undefined;
                let entries = [...devToolsHandlerContext.components.entries()]
                for (const [id, cm] of entries) {
                    if (!cm) {
                        continue
                    };
                    const position = await measureComponentOnce(cm, id);
                    if (!position) continue;

                    const { px, py, width, height } = position;

                    if (x >= px && x <= px + width && y >= py && y <= py + height) {
                        const area = width * height;
                        if (area < smallestArea) {
                            smallestArea = area;
                            closestComponent = id;
                            closestRect = position;
                            //  devToolsHandlerContext.select(closestComponent);
                        }
                    }
                }

                if (closestComponent) {
                    devToolsHandlerContext.select(closestComponent);
                    setClicked(closestRect);
                } else {
                    setClicked(null);
                }
            } catch (e) {
                console.error(e)
            }
        };


        const selectComponentAtWeb = (x: number, y: number) => {
            let closest: any = null;
            let smallestArea = Infinity;
            let closestRect: DOMRect | null = null;

            for (const [id, cm] of devToolsHandlerContext.components.entries()) {
                const el = cm as any as HTMLElement;
                if (!el || !el.getBoundingClientRect) continue;

                const rect = el.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    const area = rect.width * rect.height;
                    if (area < smallestArea) {
                        smallestArea = area;
                        closest = id;
                        closestRect = rect;
                    }
                }
            }

            if (closest && closestRect) {
                // devToolsHandlerContext.select(closest);
                setHighlight({
                    px: closestRect.left,
                    py: closestRect.top,
                    width: closestRect.width,
                    height: closestRect.height,
                    x: closestRect.left,
                    y: closestRect.top,
                });
            } else {
                setHighlight(null);
            }
        };



        // Touch handler (mobile)
        const handleSelection = (event: GestureResponderEvent) => {
            const { pageX, pageY } = event.nativeEvent;
            timer(() => {
                selectComponentAt(pageX, pageY);
            });
            // console.log(pageX, pageY)

        };


        // Mouse handler (web)
        const handleMouseMove = (event: React.MouseEvent) => {
            timer(() => {
                selectComponentAtWeb(event.clientX, event.clientY);
            });
        };

        const handleMouseLeave = () => setHighlight(null);

        const selector = (
            <TouchableOpacity
                noneDevtools={true}
                css="poe-box-only"
                onPress={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    devToolsHandlerContext.batch(async () => {
                        if (!devToolsHandlerContext.data.settings.webDevToolsIsOpen)
                            devToolsHandlerContext.data.settings.webDevToolsIsOpen = true;
                        if (!devToolsHandlerContext.data.settings.elementSelection)
                            devToolsHandlerContext.data.settings.elementSelection = !devToolsHandlerContext.data.settings.elementSelection;

                        await devToolsHandlerContext.sendProp("elementSelection", "webDevToolsIsOpen");
                    });
                }} style={{
                    position: "absolute",
                    borderRadius: 5,
                    top: 10,
                    right: 15,
                    width: 30,
                    height: 20,
                    zIndex: 99999,
                    backgroundColor: "#000",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row"
                }}>
                <Text css="co-white fow-bold fos-12 tea-center"> {"</>"}</Text>
            </TouchableOpacity>
        )

        if (!devToolsHandlerContext.data.settings.elementSelection) return __DEV__ && devToolsHandlerContext.data.isOpened ? selector : null;


        return (
            <>
                <View
                    noneDevtools={true}
                    css={"._touchOverlay zi-9999"}
                    onStartShouldSetResponder={() => true}
                    onResponderRelease={handleSelection}
                    onMoveShouldSetResponderCapture={() => false} // allow scrolling

                    // Web mouse events
                    onMouseMove={handleMouseMove as any}
                    onMouseLeave={handleMouseLeave as any}
                />
                {selector}
                {clicked && (
                    <View
                        noneDevtools={true}
                        css="._highlightBox"
                        style={[
                            {
                                top: clicked.py,
                                left: clicked.px,
                                width: clicked.width,
                                height: clicked.height,
                                borderColor: "red",
                            },
                        ]}>
                        <View noneDevtools={true} css="._highlightBorder" />
                    </View>
                )}
                {highlight && (
                    <View
                        css="._highlightBox"
                        noneDevtools={true}
                        style={[
                            {
                                pointerEvents: "none",
                                top: highlight.py,
                                left: highlight.px,
                                width: highlight.width,
                                height: highlight.height,
                            },
                        ]}>
                        <View noneDevtools={true} css="._highlightBorder" />
                    </View>
                )}

            </>
        );
    } catch (e) {
        console.error(e)
        throw e;
    }
};


export const ThemeContainer = (props: IThemeContext & { children: any }) => {
    globalData.hook("window");
    const [ready, setReady] = React.useState(false);
    const devtoolOpend = React.useRef(devToolsHandlerContext.data.isOpened);

    if (__DEV__ && props.localIp && devToolsHandlerContext.host != props.localIp)
        devToolsHandlerContext.host = props.localIp;

    if (__DEV__) {
        devToolsHandlerContext.hook("data.isOpened").on(() => devToolsHandlerContext.data.isOpened);
        devToolsHandlerContext.hook("data.rerender").on(() => devToolsHandlerContext.data.rerender != undefined)
    }

    // if (devToolsHandlerContext.data.isOpened == false && __DEV__)
    //   console.info("Consider installing react-native-short-style-devtools to be able to inspect the rendered style and css.");
    if (__DEV__)
        devToolsHandlerContext.useEffect(() => {
            if (devtoolOpend.current != devToolsHandlerContext.data.isOpened) {
                if (!devToolsHandlerContext.data.isOpened) {
                    console.warn("react-native-short-style-devtools is offline");
                    if (devtoolOpend.current)
                        devToolsHandlerContext.open(); // try to open it once
                }
                //     else console.info(`react-native-short-style-devtools is online.\nnote when using the devtool the app will be a little slower depending on our pc, so use it only to design your app`);

            }
            devtoolOpend.current = devToolsHandlerContext.data.isOpened;
        }, "data.isOpened")

    React.useEffect(() => {
        let events = globalData.appStart();
        if (props.storage)
            globalData.storage = props.storage as any;
        return () => events.forEach(x => x?.remove?.());
    }, []);

    if (props.storage && globalData.storage !== props.storage)
        globalData.storage = props.storage;

    if (globalData.themeIndex !== props.selectedIndex)
        globalData.themeIndex = props.selectedIndex;

    if (!globalData.icons)
        globalData.icons = props.icons ?? {} as any;

    const theme = currentTheme(props);
    // console.log(theme)
    const rules = parseStyles(theme, props.selectedIndex);
    if ((!ready || devToolsHandlerContext.data.rerender) && devToolsHandlerContext.data.isOpened && __DEV__) {
        devToolsHandlerContext.sendTree({
            name: "ThemeContextAPP",
            children: [],
            readOnlyProps: ["classes.*", "css", "props"],
            props: {
                _viewId: "__0__",
                platform: Platform.OS
            }
        }).then(() => setReady(true));
        if (devToolsHandlerContext.data.rerender)
            devToolsHandlerContext.data.rerender = undefined;
    }

    if (!ready && devToolsHandlerContext.data.isOpened && __DEV__)
        return null;

    return (

        <StyleContext.Provider value={{ rules: rules ?? [], path: [], parent: undefined }}>
            <ThemeContext.Provider value={{ ...props, systemThemes: theme }}>
                <ThemeInternalContainer>
                    {props.children}
                </ThemeInternalContainer>
            </ThemeContext.Provider>
        </StyleContext.Provider>

    )

}

