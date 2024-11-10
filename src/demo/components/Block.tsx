import * as React from "react";
import { View, Text } from "../src";
import { ViewStyle } from "react-native";

export const Block = ({ children, title, style }: { children: any, style?: ViewStyle, title?: string }) => {

    return (
        <View style={style} css="bor:5 bow:.5 boc:gray miw:200 he:auto flg:1 juc:center ali:center ma:5 pa:10">
            <Text css="fixed to:-8 fow:bold fos-md zi:2">{title}</Text>
            <View css="fixed to:-8 he:10 wi:90% zi:1" />
            <View css={x=> x.maT(8).wi("100%").he("100%")}>
            {
                children
            }
            </View>
        </View>
    )

}