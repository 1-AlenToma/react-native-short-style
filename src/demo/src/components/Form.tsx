import * as React from "react";
import { View, Text } from "./ReactNativeComponents";

export const Form = ({ children, title }: { children: any, title: string }) => {

    return (
        <View css="bor:5 bow:.5 boc:gray miw:50 mih:50 juc:center ali:center ma:5 pa:10">
            <Text css="fixed to:-8 fow:bold fos-xs zi:2">{title}</Text>
            <View css="fixed to:-8 he:10 wi:90% zi:1" />
            {
                children
            }
        </View>
    )

}