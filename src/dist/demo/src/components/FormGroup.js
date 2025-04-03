import * as React from "react";
import { View, Text } from "./ReactNativeComponents";
import { ifSelector } from "../config";
import { Icon } from "./Icon";
import { ToolTip } from "./ToolTip";
const ForGroupContext = React.createContext({});
export const FormItem = (props) => {
    var _a, _b;
    const context = React.useContext(ForGroupContext);
    const labelPosition = (_b = (_a = props.labelPosition) !== null && _a !== void 0 ? _a : context.labelPosition) !== null && _b !== void 0 ? _b : "Top";
    if (ifSelector(props.ifTrue) == false)
        return null;
    const icon = props.icon;
    const css = "mar:5";
    return (React.createElement(View, { style: props.style, css: x => x.cls("_formItem", "FormItem").joinRight(props.css) },
        React.createElement(View, { css: x => x.flD(labelPosition == "Top" ? "column" : "row").if(labelPosition == "Top", "ali-flex-start", "ali-center juc-space-between") },
            React.createElement(View, { css: "fld-row" },
                React.createElement(View, { ifTrue: icon != undefined, css: css }, icon && icon.type ? React.createElement(Icon, Object.assign({ size: 15, color: "white" }, icon)) : icon),
                React.createElement(View, { ifTrue: props.title != undefined, css: css }, props.title && typeof props.title == "string" ? React.createElement(Text, { css: "fos-sm fow:bold" }, props.title) : props.title),
                React.createElement(ToolTip, { postion: "Top", containerStyle: "po:relative le:1", ifTrue: props.info != undefined && labelPosition == "Top", text: props.info },
                    React.createElement(Icon, { type: "AntDesign", name: "infocirlce", size: 15 }))),
            React.createElement(View, { css: x => x.cls("_formItemCenter", "_formItemCenter" + labelPosition).if(labelPosition == "Top", x => x.wi("100%")) }, props.children),
            React.createElement(ToolTip, { postion: "Top", containerStyle: "po:relative le:1", ifTrue: props.info != undefined && labelPosition != "Top", text: props.info },
                React.createElement(Icon, { type: "AntDesign", name: "infocirlce", size: 15 }))),
        React.createElement(View, { ifTrue: props.message != undefined, css: "fl:1 pal:10 pab:5" }, props.message)));
};
export const FormGroup = (props) => {
    return (React.createElement(ForGroupContext.Provider, { value: { labelPosition: props.labelPosition } },
        React.createElement(View, { style: props.style, css: x => x.cls("_formGroup FormGroup").maT(30).joinRight(props.css) },
            React.createElement(View, { ifTrue: props.title != undefined && props.formStyle == "Headless", css: "headerLine" },
                React.createElement(View, { css: "bac-transparent" },
                    React.createElement(Text, { numberOfLines: 1 }, props.title))),
            React.createElement(View, { css: "bac-transparent" },
                React.createElement(View, { css: "bac-transparent" },
                    React.createElement(View, { ifTrue: props.title != undefined && props.formStyle != "Headless", css: "wi-100% fl-0 flg-1 pa-5 header bac-transparent" },
                        React.createElement(Text, { numberOfLines: 1 }, props.title)),
                    React.createElement(View, { css: x => x.maT(8).fillView().flG(1).paL(5).paR(5).baC("$co-transparent") }, props.children))))));
};
//# sourceMappingURL=FormGroup.js.map