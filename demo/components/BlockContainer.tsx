import * as React from "react";
import { View, Text } from "react-native-short-style";

export const BlockContainer = ({ children, title }: any) => {

    return (
        <View css={"container flg:1"}>
            {children}
        </View>
    )

}