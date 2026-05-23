import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from "./ReactNativeComponents";
import { Button } from "./Button";
import { globalData } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { Modal } from "./Modal";
export const AlertView = () => {
    globalData.hook("alertViewData.data");
    globalData.bind("alertViewData.data.callBack");
    const state = StateBuilder({
        size: undefined
    }).build();
    globalData.useEffect(() => {
        if (state.size)
            state.size = undefined;
    }, "window", "alertViewData.data");
    const answer = (a) => {
        globalData.alertViewData.data.callBack?.(a);
        globalData.alertViewData.data = undefined;
    };
    const data = globalData.alertViewData.data ?? {};
    return (_jsx(Modal, { css: x => x.joinLeft(data.css).joinRight("pa-0 ma-0"), style: { minHeight: state.size?.height, minWidth: state.size?.width }, disableBlurClick: data.callBack != undefined, isVisible: globalData.alertViewData.data != undefined, onHide: () => globalData.alertViewData.data = undefined, children: _jsxs(View, { css: "fl:1 pa-0", children: [_jsxs(View, { css: "fl:1 pa-10", style: { height: data.callBack ? "90%" : "100%" }, onLayout: ({ nativeEvent }) => {
                        if (!state.size) {
                            state.size = nativeEvent.layout;
                            state.size.height += data.callBack ? 30 : 0;
                            state.size.height = Math.max(state.size.height, 200);
                        }
                    }, children: [_jsx(Text, { css: `fos-md fow:bold`, ifTrue: data.title != undefined, children: data.title }), _jsx(Text, { css: `fos-${data.size ?? "sm"} co:gray pal:2`, children: data.message })] }), _jsxs(View, { ifTrue: data.callBack != undefined, css: "alertViewButtonContainer", children: [_jsx(Button, { text: data.yesText ?? "Yes", onPress: () => answer(true) }), _jsx(Button, { text: data.cancelText ?? "No", onPress: () => answer(false) })] }), _jsx(View, { ifTrue: data.callBack == undefined, css: "alertViewButtonContainer", children: _jsx(Button, { text: data.okText ?? "Ok", onPress: () => answer(false) }) })] }) }));
};
//# sourceMappingURL=AlertView.js.map