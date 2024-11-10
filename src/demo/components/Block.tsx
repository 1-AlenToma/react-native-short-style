import * as React from "react";
import { View, Text } from "../src";
import { ViewStyle } from "react-native";

export const Block = ({ children, title, style }: { children: any, style?: ViewStyle, title?: string }) => {

    return (
        <View style={style} css="block">
            <Text css="fixed to:-8 fow:bold fos-md zi:2">{title}</Text>
            <View css="fixed to:-8 he:10 wi:90% zi:1" />
            <View css={x=> x.maT(8).fillView().flG(1)}>
            {
                children
            }
            </View>
        </View>
    )

}