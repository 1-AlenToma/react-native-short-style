import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text } from "./ReactNativeComponents";
import * as React from "react";
import { setRef } from "../config";
import StateBuilder from '../States';
import { ActivityIndicator } from 'react-native';
import { Blur } from './Blur';
export const Loader = React.forwardRef((props, ref) => {
    const state = StateBuilder({
        loading: props.loading
    }).build();
    React.useEffect(() => {
        state.loading = props.loading;
    }, [props.loading]);
    setRef(ref, {
        loading: (value) => state.loading = value
    });
    return (_jsxs(View, { css: "wi:100% he:100% flg:1 bac:transparent", children: [_jsx(Blur, { css: "bor:5 zi:2", ifTrue: props.loading }), _jsxs(View, { ifTrue: props.loading, css: "juc:center ali:center _abc wi:100% he:100% bac:transparent zi:3", children: [_jsx(ActivityIndicator, Object.assign({ color: "white", size: "large" }, props, { children: null })), typeof props.text == "string" ? (_jsx(Text, { css: "fos-lg co:white fow:bold", children: props.text })) : props.text] }), _jsx(View, { css: 'wi:100% he:100% fl:1 flg:1 zi:1', children: props.children })] }));
});
//# sourceMappingURL=Loader.js.map