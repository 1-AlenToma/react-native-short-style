import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { devToolsHandlerContext } from "../theme/ThemeContext";
import "../assets/styles.css";
import { Platform, View } from "react-native";
import { useTimer } from "../hooks";
let isResizing = false;
export const DevtoolsIframe = ({ children }) => {
    const resize = React.useRef(null);
    const containerRef = React.useRef(null);
    const timer = useTimer(100);
    const mouseDown = () => {
        isResizing = true;
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
        containerRef.current.querySelector("iframe").style.pointerEvents = "none";
    };
    const mouseMove = (e) => {
        if (!isResizing || !containerRef.current)
            return;
        const parent = containerRef.current.parentElement;
        const parentRect = parent.getBoundingClientRect();
        // Distance from parent bottom to cursor
        const distanceFromBottom = parentRect.bottom - e.clientY;
        // Height we want = total parent height - distance from bottom
        const newHeight = Math.max(200, Math.min(parentRect.height * 0.8, distanceFromBottom));
        containerRef.current.style.height = newHeight + "px";
    };
    const mouseUp = () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = "auto";
            document.body.style.userSelect = "auto";
            containerRef.current.querySelector("iframe").style.pointerEvents = "auto";
        }
    };
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
    return (_jsxs(View, { style: { flex: 1, height: "100%", display: "flex", position: "relative" }, children: [_jsx(View, { style: { flex: 1 }, children: children }), _jsxs("div", { ref: containerRef, className: "iframeDevContainer", children: [_jsx("div", { className: "resizer", ref: resize, onMouseDown: mouseDown }), _jsx("iframe", { id: "devtools-iframe", allow: "clipboard-read; clipboard-write; fullscreen", sandbox: "allow-scripts allow-same-origin", src: devToolsHandlerContext.webUrl })] })] }));
};
//# sourceMappingURL=DevtoolsIframe.js.map