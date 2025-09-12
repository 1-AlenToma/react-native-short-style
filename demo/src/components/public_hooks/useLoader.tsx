import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { View, Text } from "../ReactNativeComponents";
import { ProgressBar } from "../ProgressBar";
import { readAble } from "../../config";


export const useLoader = (
    initValue?: boolean,
    text?: string
) => {
    const [loading, setLoading] = useState(
        initValue ?? false
    );
    const [progressValue, setProgressValue] = useState<number | undefined>();

    useEffect(() => {
        setLoading(initValue ?? false);
    }, [initValue]);

    const show = (progress?: number) => {

        setProgressValue(progress);
        setLoading(true);
    };

    const hide = () => {
        setLoading(false);
        setProgressValue(undefined);
    };

    let elem = !loading ? null : (
        <View css="_loader">
            <View />
            <ActivityIndicator
                size="large"
                style={{
                    zIndex: 2
                }}
            />
            <ProgressBar css="he-100%" ifTrue={(progressValue ?? 0) > 0} value={progressValue as any / 100}>
                <Text>{readAble(progressValue ?? 0)}%</Text>
            </ProgressBar>
            <Text ifTrue={text != undefined} css="_title">
                {text}
            </Text>
        </View>
    );
    return { show, hide, elem, loading };
};