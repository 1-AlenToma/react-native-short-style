import * as React from "react";
import { View, Text } from "../src";

export const BlockContainer = ({ children, title }: any) => {

    return (
        <View css="flex:1 juc:center ali:center fld:row">
            {children}
        </View>
    )

}