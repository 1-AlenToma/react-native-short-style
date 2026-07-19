import * as React from "react";
import { devToolsHandlerContext } from "../theme/ThemeContext";
// @ts-ignore: side-effect import for global CSS
import "../assets/styles.css";
import { Platform, View } from "react-native";
import { useLocalMemo, useTimer } from "../hooks";
let isResizing = false;
export const DevtoolsIframe = ({ children }) => {

    const resize = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { mem } = useLocalMemo();

    const mouseDown = mem(() => {
        isResizing = true;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
        containerRef.current.querySelector("iframe").style.pointerEvents = "none";
    }, containerRef.current);

    const mouseMove = mem((e: MouseEvent) => {
        if (!isResizing || !containerRef.current) return;

        const parent = containerRef.current.parentElement!;
        const parentRect = parent.getBoundingClientRect();

        // Distance from parent bottom to cursor
        const distanceFromBottom = parentRect.bottom - e.clientY;

        // Height we want = total parent height - distance from bottom
        const newHeight = Math.max(200, Math.min(parentRect.height * 0.8, distanceFromBottom));

        containerRef.current.style.height = newHeight + "px";
    }, containerRef.current)

    const mouseUp = mem(() => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = "auto";
            document.body.style.userSelect = "auto";
            containerRef.current.querySelector("iframe").style.pointerEvents = "auto";
        }
    }, containerRef.current)

    if (Platform.OS == "web" && __DEV__)
        React.useEffect(() => {
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            return () => {
                document.removeEventListener("mousemove", mouseMove);
                document.removeEventListener("mouseup", mouseUp);
            };
        }, []);
    if (__DEV__ && Platform.OS == "web")
        devToolsHandlerContext.hook("data.isOpened", "host", "data.settings.elementSelection", "data.settings.webDevToolsIsOpen");
   
    if (!devToolsHandlerContext.host || !devToolsHandlerContext.data.isOpened || !__DEV__ || Platform.OS != "web" || !devToolsHandlerContext.data.settings.webDevToolsIsOpen)
        return children;


    return (
        <View style={mem({ flex: 1, height: "100%", display: "flex", position: "relative" })}>
            <View style={mem({ flex: 1 })}>
                {children}
            </View>
            <div ref={containerRef} className="iframeDevContainer">
                <div className="resizer" ref={resize} onMouseDown={mouseDown} />
                <iframe id="devtools-iframe" allow="clipboard-read; clipboard-write; fullscreen" sandbox="allow-scripts allow-same-origin" src={devToolsHandlerContext.webUrl} />
            </div>
        </View>
    )
}