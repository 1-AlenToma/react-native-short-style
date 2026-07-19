import * as Native from "react-native";
import * as React from "react";
import { View } from "./ReactNativeComponents";
import { GenericViewProps, StyledProps, } from "../Typse";
import createState from "../States";
import { useLocalMemo } from "../hooks";
export const ReadyView = (props: Omit<Native.ViewProps, "ref"> & { timeout?: number } & StyledProps) => {
    const state = createState(() => ({
        size: undefined as any
    })).ignore("size").timeout(props.timeout ?? 100).build();
    const {mem} = useLocalMemo();


    return (<View {...props} css={x => x.fl(1).joinRight(props.css)} 
    onLayout={mem((event) => {
        state.size = event.nativeEvent.layout;
        props.onLayout?.(event);
    }, props.onLayout)}>
        {state.size  ? props.children : null}
    </View>)
}

