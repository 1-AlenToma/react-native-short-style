import { View, Text } from "./ReactNativeComponents";
import * as React from "react";
import { setRef } from "../config";
import { LoaderProps, LoaderRef } from "../Typse";
import StateBuilder from '../States';
import { ActivityIndicator } from 'react-native';
import { Blur } from './Blur';

export const Loader = React.forwardRef<LoaderRef, LoaderProps>((props, ref) => {
    const state = StateBuilder({
        loading: props.loading
    }).build();

    React.useEffect(() => {
        state.loading = props.loading;
    }, [props.loading])


    setRef(ref, {
        loading: (value) => state.loading = value
    } as LoaderRef);


    return (<View css="wi:100% he:100% flg:1 bac:transparent">
        <Blur css="bor:5 zi:2" ifTrue={props.loading} />
        <View ifTrue={props.loading} css="juc:center ali:center _abc wi:100% he:100% bac:transparent zi:3">
            <ActivityIndicator color="white" size="large" {...props} children={null} />
            {
                typeof props.text == "string" ? (<Text css="fos-lg co:white fow:bold">
                    {props.text}
                </Text>) : props.text
            }
        </View>
        <View css='wi:100% he:100% fl:1 flg:1 zi:1'>
            {props.children}
        </View>
    </View>)
});
