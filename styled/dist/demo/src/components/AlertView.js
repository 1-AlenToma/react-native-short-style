import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from "./ReactNativeComponents";
import { Button } from "./Button";
import { globalData } from "../theme/ThemeContext";
import StateBuilder from "../States";
import { Modal } from "./Modal";
export const AlertView = () => {
    var _a, _b, _c, _d, _e, _f, _g;
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
        var _a, _b;
        (_b = (_a = globalData.alertViewData.data).callBack) === null || _b === void 0 ? void 0 : _b.call(_a, a);
        globalData.alertViewData.data = undefined;
    };
    const data = (_a = globalData.alertViewData.data) !== null && _a !== void 0 ? _a : {};
    return (_jsx(Modal, { css: x => x.joinLeft(data.css).joinRight("pa-0 ma-0"), style: { minHeight: (_b = state.size) === null || _b === void 0 ? void 0 : _b.height, minWidth: (_c = state.size) === null || _c === void 0 ? void 0 : _c.width }, disableBlurClick: data.callBack != undefined, isVisible: globalData.alertViewData.data != undefined, onHide: () => globalData.alertViewData.data = undefined, children: _jsxs(View, { css: "fl:1 pa-0", children: [_jsxs(View, { css: "fl:1 pa-10", style: { height: data.callBack ? "90%" : "100%" }, onLayout: ({ nativeEvent }) => {
                        if (!state.size) {
                            state.size = nativeEvent.layout;
                            state.size.height += data.callBack ? 30 : 0;
                            state.size.height = Math.max(state.size.height, 200);
                        }
                    }, children: [_jsx(Text, { css: `fos-md fow:bold`, ifTrue: data.title != undefined, children: data.title }), _jsx(Text, { css: `fos-${(_d = data.size) !== null && _d !== void 0 ? _d : "sm"} co:gray pal:2`, children: data.message })] }), _jsxs(View, { ifTrue: data.callBack != undefined, css: "alertViewButtonContainer", children: [_jsx(Button, { text: (_e = data.yesText) !== null && _e !== void 0 ? _e : "Yes", onPress: () => answer(true) }), _jsx(Button, { text: (_f = data.cancelText) !== null && _f !== void 0 ? _f : "No", onPress: () => answer(false) })] }), _jsx(View, { ifTrue: data.callBack == undefined, css: "alertViewButtonContainer", children: _jsx(Button, { text: (_g = data.okText) !== null && _g !== void 0 ? _g : "Ok", onPress: () => answer(false) }) })] }) }));
};
//# sourceMappingURL=AlertView.js.map