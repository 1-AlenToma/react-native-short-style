import React from "react";
import { View, Text, TextInput, NestedStyleSheet, ThemeContext, IExtraThemeContext } from "react-native-short-style";
import StateManagment from "react-smart-state";

export const PlayGround = () => {
    const themeContext = React.useContext(ThemeContext) as IExtraThemeContext;
    const state = StateManagment({
        // Formatted valid stringified object layout for JSON.parse compatibility
        value: JSON.stringify({
            "txtContainer": "fl-1 wi-100% he-300",
            "txt": "fow-bold",
            "txtContainer > Text:first-child": ".txt co-red",
            "txtContainer > Text:eq(1)": ".txt co-yellow",
            "txtContainer > Text:last-of-type": "co-blue fow-normal-!important .txt"
        }, null, 4),
        error: ""
    }).build();

    // Compile state changes on-the-fly safely
    React.useEffect(() => {
        try {
            const parsedJSON = JSON.parse(state.value);
            // Overwrite styling map references dynamically
            const compiledStyle = NestedStyleSheet.create(parsedJSON);
            themeContext.injectStyle(compiledStyle)
            console.log(compiledStyle)
            state.error = "";
        } catch (e) {
            state.error = e.toString();
        }
    }, [state.value]);

    return (
        <View css="fl-1 miw-500 ma-20">
            <Text css="title">Live Test Example</Text>

            <View css="fl-1">
                <Text>change here to see the result down.</Text>

                {/* FIXED: Removed the naked text 'NestedStyleSheet.Create(' out of JSX node bounds */}
                <Text css="co-blue">NestedStyleSheet.Create(</Text>
                <TextInput
                    defaultValue={state.value}
                    css="he-200 bow-1 bor-5"
                    multiline={true}
                    onChangeText={txt => { state.value = txt; }}
                />
                <Text css="co-blue">)</Text>
            </View>
            <Text css="title">Result</Text>
            {/* Injecting dynamically updated CSS classes compiled styles map */}
            <View css="he-100">
                <Text css="co-blue">{`<View css="txtContainer mal-30">`}</Text>
                <View css="txtContainer mal-30">
                    <Text>first-child text</Text>
                    <Text>secound-child text</Text>
                    <Text>last-child text</Text>

                </View>
                <Text css="co-blue">{`<View>`}</Text>
            </View>
            {/* Error messaging tray */}
            {state.error ? (
                <Text css="co-red fow-bold">
                    {state.error}
                </Text>
            ) : null}
        </View>
    );
};
