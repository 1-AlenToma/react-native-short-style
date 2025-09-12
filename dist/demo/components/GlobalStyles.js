import { Platform } from "react-native";
import { NestedStyleSheet } from "../src";
const web = NestedStyleSheet.create({
    container: x => x.flG(1).classNames("_center"),
    block: "bor:5 bow:.5 boc:gray miw:200 he:auto flg:1 juc:center ali:center ma:5 pa:10"
});
const android = NestedStyleSheet.create({
    container: x => x.classNames("_center").wi("100%"),
    block: "bor:5 bow:.5 boc:gray miw:200 he:auto juc:center ali:center ma:5 pa:10 fl:1 maw:90% fld:row mat:50 mih:50"
});
let _default = NestedStyleSheet.create({
    Text: "wi:100%",
    container: "fl:1",
    "container> Text": "fow:bold tea:center",
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    fixed: {
        position: "absolute"
    },
    actionButton: "wi:100% bobw:.5 boc:gray pa:5 juc:center ali:left",
    "actionButton > Text": "fos-xs",
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
});
if (Platform.OS == "web")
    _default = Object.assign(Object.assign({}, _default), web);
else
    _default = Object.assign(Object.assign({}, _default), android);
export default _default;
//# sourceMappingURL=GlobalStyles.js.map