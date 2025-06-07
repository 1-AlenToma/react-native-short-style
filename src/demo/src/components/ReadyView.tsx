import * as Native from "react-native";
import * as React from "react";
import { View } from "./ReactNativeComponents";
import { GenericViewProps, StyledProps, } from "../Typse";
import createState from "../States";
export const ReadyView = (props: Omit<Native.ViewProps, "ref"> & { timeout?: number } & StyledProps) => {
    const state = createState(() => ({
        width: 0
    })).timeout(props.timeout ?? 100).build();


    return (<View {...props} css={x => x.fl(1).joinRight(props.css)} onLayout={(event) => {
        state.width = event.nativeEvent.layout.width + event.nativeEvent.layout.height;
        props.onLayout?.(event);
    }}>
        {state.width > 0 ? props.children : null}
    </View>)
}

