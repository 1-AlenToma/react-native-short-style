import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text } from "../ReactNativeComponents";
import { ProgressBar } from "../ProgressBar";
import { readAble } from "../../config";
export const useLoader = (initValue, text) => {
    const [loading, setLoading] = useState(initValue !== null && initValue !== void 0 ? initValue : false);
    const [progressValue, setProgressValue] = useState();
    useEffect(() => {
        setLoading(initValue !== null && initValue !== void 0 ? initValue : false);
    }, [initValue]);
    const show = (progress) => {
        setProgressValue(progress);
        setLoading(true);
    };
    const hide = () => {
        setLoading(false);
        setProgressValue(undefined);
    };
    let elem = !loading ? null : (_jsxs(View, { css: "_loader", children: [_jsx(View, {}), _jsx(ActivityIndicator, { size: "large", style: {
                    zIndex: 2
                } }), _jsx(ProgressBar, { css: "he-100%", ifTrue: (progressValue !== null && progressValue !== void 0 ? progressValue : 0) > 0, value: progressValue / 100, children: _jsxs(Text, { children: [readAble(progressValue !== null && progressValue !== void 0 ? progressValue : 0), "%"] }) }), _jsx(Text, { ifTrue: text != undefined, css: "_title", children: text })] }));
    return { show, hide, elem, loading };
};
//# sourceMappingURL=useLoader.js.map