import { View, Text } from "./ReactNativeComponents";
import * as React from "react";
import { setRef } from "../config";
import StateBuilder from 'react-smart-state';
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
    return (React.createElement(View, { css: "wi:100% he:100% flg:1 bac:transparent" },
        React.createElement(Blur, { css: "bor:5 zi:2", ifTrue: props.loading }),
        React.createElement(View, { ifTrue: props.loading, css: "juc:center ali:center _abc wi:100% he:100% bac:transparent zi:3" },
            React.createElement(ActivityIndicator, Object.assign({ color: "white", size: "large" }, props, { children: null })),
            typeof props.text == "string" ? (React.createElement(Text, { css: "fos-lg co:white fow:bold" }, props.text)) : props.text),
        React.createElement(View, { css: 'wi:100% he:100% fl:1 flg:1 zi:1' }, props.children)));
});
//# sourceMappingURL=Loader.js.map