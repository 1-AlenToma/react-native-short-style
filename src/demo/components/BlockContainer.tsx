import * as React from "react";
import { View, Text } from "../src";

export const BlockContainer = ({ children, title }: any) => {

    return (
        <View css={x=> x.fl(1).classNames("_center")}>
            {children}
        </View>
    )

}