import * as Native from "react-native";
import * as React from "react";
import { View } from "./ReactNativeComponents";
import { GenericViewProps, StyledProps, } from "../Typse";
import createState from "../States";
export const ReadyView = (props: Omit<Native.ViewProps, "ref"> & { timeout?: number } & StyledProps) => {
    const state = createState(() => ({
        size: undefined as any
    })).ignore("size").timeout(props.timeout ?? 100).build();

    React.useEffect(()=> {

    }, [state.size])


    return (<View {...props} css={x => x.fl(1).joinRight(props.css)} 
    onLayout={(event) => {
        state.size = event.nativeEvent.layout;
        props.onLayout?.(event);
    }}>
        {state.size  ? props.children : null}
    </View>)
}

