import * as React from "react";
import { View, Text } from "../src";

export const BlockContainer = ({ children, title }: any) => {

    return (
        <View css={"container flg:1"}>
            {children}
        </View>
    )

}