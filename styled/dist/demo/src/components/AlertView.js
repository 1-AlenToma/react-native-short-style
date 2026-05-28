import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from "./ReactNativeComponents";
import { Button } from "./Button";
import { globalData } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { Modal } from "./Modal";
import { useLocalMemo } from "../hooks";
export const AlertView = () => {
    globalData.hook("alertViewData.data");
    globalData.bind("alertViewData.data.callBack");
    const state = StateBuilder({
        size: undefined
    }).build();
    const { mem, memo } = useLocalMemo();
    globalData.useEffect(() => {
        if (state.size)
            state.size = undefined;
    }, "window", "alertViewData.data");
    const answer = mem((a) => {
        globalData.alertViewData.data.callBack?.(a);
        globalData.alertViewData.data = undefined;
    });
    const data = globalData.alertViewData.data ?? {};
    return (_jsx(Modal, { css: memo(() => x => x.joinLeft(data.css).joinRight("pa-0 ma-0"), data.css), style: mem({ minHeight: state.size?.height, minWidth: state.size?.width }, state.size), disableBlurClick: data.callBack != undefined, isVisible: globalData.alertViewData.data != undefined, onHide: mem(() => globalData.alertViewData.data = undefined), children: _jsxs(View, { css: "fl:1 pa-0", children: [_jsxs(View, { css: "fl:1 pa-10", style: mem({ height: data.callBack ? "90%" : "100%" }, data.callBack), onLayout: mem(({ nativeEvent }) => {
                        if (!state.size) {
                            state.size = nativeEvent.layout;
                            state.size.height += data.callBack ? 30 : 0;
                            state.size.height = Math.max(state.size.height, 200);
                        }
                    }), children: [_jsx(Text, { css: `fos-md fow:bold`, ifTrue: data.title != undefined, children: data.title }), _jsx(Text, { css: `fos-${data.size ?? "sm"} co:gray pal:2`, children: data.message ?? "" })] }), _jsxs(View, { ifTrue: data.callBack != undefined, css: "alertViewButtonContainer", children: [_jsx(Button, { text: data.yesText ?? "Yes", onPress: mem(() => answer(true)) }), _jsx(Button, { text: data.cancelText ?? "No", onPress: mem(() => answer(false)) })] }), _jsx(View, { ifTrue: data.callBack == undefined, css: "alertViewButtonContainer", children: _jsx(Button, { text: data.okText ?? "Ok", onPress: mem(() => answer(false)) }) })] }) }));
};
//# sourceMappingURL=AlertView.js.map