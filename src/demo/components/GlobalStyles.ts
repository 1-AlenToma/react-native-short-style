import { StyleSheet } from "react-native";
import { NestedStyleSheet } from "../src";

export default NestedStyleSheet.create({
    Text: "wi:100%",
    container: "fl:1",
    "container.Text": "fow:bold tea:center",
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    fixed: {
        position: "absolute"
    },
    actionButton: "wi:100% bobw:.5 boc:gray pa:5 juc:center ali:left",
    "actionButton.Text": "fos-xs",
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
})