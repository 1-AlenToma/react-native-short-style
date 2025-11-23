import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(View, { style: props.style, css: x => x.cls("_formItem", "FormItem").joinRight(props.css), children: [_jsxs(View, { css: x => x.flD(labelPosition == "Top" ? "column" : "row").if(labelPosition == "Top", "ali-flex-start", "ali-center juc-space-between"), children: [_jsxs(View, { css: "fld-row", children: [_jsx(View, { ifTrue: icon != undefined, css: x => x.maW(20).joinRight(css), children: icon && icon.type ? _jsx(Icon, Object.assign({ size: 15, color: "white" }, icon)) : icon }), _jsx(View, { ifTrue: props.title != undefined, css: css, children: props.title && typeof props.title == "string" ? _jsx(Text, { css: ".fos-sm fow:bold", children: props.title }) : props.title }), _jsx(ToolTip, { postion: "Top", containerStyle: "po:relative le:1", ifTrue: props.info != undefined && labelPosition == "Top", text: props.info, children: props.infoIcon ? (props.infoIcon) : (_jsx(Icon, { type: "FontAwesome", name: "info-circle", size: 15 })) })] }), _jsx(View, { css: x => x.cls("_formItemCenter", "_formItemCenter" + labelPosition).if(labelPosition == "Top", x => x.wi("100%")), children: props.children }), _jsx(ToolTip, { postion: "Top", containerStyle: "po:relative le:1", ifTrue: props.info != undefined && labelPosition != "Top", text: props.info, children: props.infoIcon ? (props.infoIcon) : (_jsx(Icon, { type: "FontAwesome", name: "info-circle", size: 15 })) })] }), _jsx(View, { ifTrue: props.message != undefined, css: "fl:1 pal:10 pab:5", children: props.message })] }));
};
export const FormGroup = (props) => {
    return (_jsx(ForGroupContext.Provider, { value: { labelPosition: props.labelPosition }, children: _jsxs(View, { style: props.style, css: x => x.cls("_formGroup FormGroup").maT(30).joinRight(props.css), children: [_jsx(View, { ifTrue: props.title != undefined && props.formStyle == "Headless", css: "headerLine", children: _jsx(View, { css: "bac-transparent", children: _jsx(Text, { numberOfLines: 1, children: props.title }) }) }), _jsx(View, { css: "bac-transparent", children: _jsxs(View, { css: "bac-transparent", children: [_jsx(View, { ifTrue: props.title != undefined && props.formStyle != "Headless", css: "wi-100% fl-0 flg-1 pa-5 header bac-transparent", children: _jsx(Text, { css: "bac-transparent", numberOfLines: 1, children: props.title }) }), _jsx(View, { css: x => x.maT(8).fillView().flG(1).paL(5).paR(5).baC(".co-transparent"), children: props.children })] }) })] }) }));
};
//# sourceMappingURL=FormGroup.js.map