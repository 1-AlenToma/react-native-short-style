import * as React from "react";
import { View, Text } from "./ReactNativeComponents";
import { Button } from "./Button";
import { globalData } from "../theme/ThemeContext";
import StateBuilder from "react-smart-state";
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
    return (React.createElement(Modal, { css: x => x.joinLeft(data.css).joinRight("pa-0 ma-0"), style: { minHeight: (_b = state.size) === null || _b === void 0 ? void 0 : _b.height, minWidth: (_c = state.size) === null || _c === void 0 ? void 0 : _c.width }, disableBlurClick: data.callBack != undefined, isVisible: globalData.alertViewData.data != undefined, onHide: () => globalData.alertViewData.data = undefined },
        React.createElement(View, { css: "fl:1 pa-0" },
            React.createElement(View, { css: "fl:1 pa-10", style: { height: data.callBack ? "90%" : "100%" }, onLayout: ({ nativeEvent }) => {
                    if (!state.size) {
                        state.size = nativeEvent.layout;
                        state.size.height += data.callBack ? 30 : 0;
                        state.size.height = Math.max(state.size.height, 200);
                    }
                } },
                React.createElement(Text, { css: `fos-md fow:bold`, ifTrue: data.title != undefined }, data.title),
                React.createElement(Text, { css: `fos-${(_d = data.size) !== null && _d !== void 0 ? _d : "sm"} co:gray pal:2` }, data.message)),
            React.createElement(View, { ifTrue: data.callBack != undefined, css: "alertViewButtonContainer" },
                React.createElement(Button, { text: (_e = data.yesText) !== null && _e !== void 0 ? _e : "Yes", onPress: () => answer(true) }),
                React.createElement(Button, { text: (_f = data.cancelText) !== null && _f !== void 0 ? _f : "No", onPress: () => answer(false) })),
            React.createElement(View, { ifTrue: data.callBack == undefined, css: "alertViewButtonContainer" },
                React.createElement(Button, { text: (_g = data.okText) !== null && _g !== void 0 ? _g : "Ok", onPress: () => answer(false) })))));
};
//# sourceMappingURL=AlertView.js.map