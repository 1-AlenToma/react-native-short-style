import * as React from "react";
import StateBuilder from "react-smart-state";
import { FormGroup } from "./FormGroup";
import { View, Text, TouchableOpacity, AnimatedView } from "./ReactNativeComponents";
import { ifSelector, newId, optionalStyle } from "../config";
import { Icon } from "./Icon";
import { useAnimate } from "../hooks";
const CheckBoxContext = React.createContext({
    checkBoxListProps: {}
});
export const CheckBoxList = (props) => {
    if (ifSelector(props.ifTrue) == false)
        return null;
    const state = StateBuilder({
        ids: new Map(),
        isInit: false,
        working: false
    }).build();
    let ViewItem = props.label ? FormGroup : View;
    const reset = (lastId, value) => {
        if (props.selectionType == "CheckBox" || !state.isInit)
            return;
        state.working = true;
        let keys = [...state.ids.keys()];
        let update = false;
        for (let key of keys) {
            if (key !== lastId) {
                if (state.ids.get(key) !== false)
                    update = true;
                state.ids.set(key, false);
            }
        }
        if (update) {
            state.ids = (new Map([...state.ids.entries()]));
        }
        state.working = false;
    };
    React.useEffect(() => {
        state.isInit = true;
    }, []);
    const contextValue = {
        onChange: (checked, id) => {
            if (state.working || !state.ids.has(id))
                return;
            let cValue = state.ids.get(id);
            contextValue.add(id, checked);
            let keys = [...state.ids.keys()];
            reset(id, checked);
            if (cValue != checked)
                props.onChange(keys.map((x, i) => {
                    return { checked: state.ids.get(x), checkBoxIndex: i };
                }));
        },
        add: (id, checked) => {
            state.ids.set(id, checked);
            return checked;
        },
        remove: (id) => {
            state.ids.delete(id);
        },
        checkBoxListProps: props,
        value: (id) => { var _a; return (_a = state.ids.get(id)) !== null && _a !== void 0 ? _a : false; },
        ids: state.ids
    };
    React.useEffect(() => {
        state.ids = new Map();
    }, [props.children]);
    let items = Array.isArray(props.children) ? props.children : [props.children];
    return (React.createElement(CheckBoxContext.Provider, { value: contextValue },
        React.createElement(ViewItem, Object.assign({ title: props.label }, props), items.map((x, i) => (React.createElement(View, { key: i }, x))))));
};
export const CheckBox = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const state = StateBuilder({
        id: newId(),
        checked: props.checked,
        isInit: false,
        refItem: {
            working: false,
            prev: props.checked,
        }
    }).ignore("refItem").build();
    const context = React.useContext(CheckBoxContext);
    const checkBoxType = (_b = (_a = context.checkBoxListProps.checkBoxType) !== null && _a !== void 0 ? _a : props.checkBoxType) !== null && _b !== void 0 ? _b : "CheckBox";
    const labelPostion = (_d = (_c = props.labelPostion) !== null && _c !== void 0 ? _c : context.checkBoxListProps.labelPostion) !== null && _d !== void 0 ? _d : "Right";
    const disabled = (_f = (_e = context.checkBoxListProps.disabled) !== null && _e !== void 0 ? _e : props.disabled) !== null && _f !== void 0 ? _f : false;
    const selectionType = context.checkBoxListProps.selectionType;
    const { animateX, animate, currentValue } = useAnimate({ speed: 100 });
    const swtichColor = (_h = (_g = context.checkBoxListProps.swtichColor) !== null && _g !== void 0 ? _g : props.swtichColor) !== null && _h !== void 0 ? _h : { true: "black", false: "white" };
    if (!context.ids || !context.ids.has(state.id))
        (_j = context.add) === null || _j === void 0 ? void 0 : _j.call(context, state.id, props.checked);
    const tAnimate = (value) => {
        let ch = value == 1 ? true : false;
        if ((state.refItem.working && state.refItem.prev == ch) || disabled)
            return;
        state.refItem.working = true;
        state.refItem.prev = ch;
        animateX(value, () => {
            state.refItem.working = false;
        });
    };
    React.useEffect(() => {
        state.isInit = true;
        return () => { var _a; return (_a = context.remove) === null || _a === void 0 ? void 0 : _a.call(context, state.id); };
    }, []);
    if (!context.value)
        React.useEffect(() => {
            if (checkBoxType == "Switch")
                tAnimate(state.checked ? 1 : 0);
            //if (props.checked !== state.checked)
            state.checked = props.checked;
        }, [props.checked]);
    React.useEffect(() => {
        var _a, _b;
        let isChecked = context.value != undefined ? context.value(state.id) : props.checked;
        if (checkBoxType == "Switch")
            tAnimate(state.checked ? 1 : 0);
        if (state.checked != isChecked && state.isInit) {
            //context.add?.(state.id, state.checked);
            (_b = ((_a = context.onChange) !== null && _a !== void 0 ? _a : props.onChange)) === null || _b === void 0 ? void 0 : _b(state.checked, state.id);
        }
    }, [state.checked]);
    if (context.ids)
        React.useEffect(() => {
            if (state.checked !== context.value(state.id)) {
                state.checked = (context.value(state.id));
            }
        }, [context.ids]);
    const color = (isChecked) => {
        return swtichColor[isChecked];
    };
    const activeOpacity = disabled ? .5 : 1;
    const disabledCss = disabled ? "disabled" : "";
    return (React.createElement(React.Fragment, null,
        React.createElement(TouchableOpacity, { activeOpacity: activeOpacity, style: props.style, css: `_checkBox _overflow juc:end mab:5 CheckBox ${optionalStyle(props.css).c} ${disabledCss}`, ifTrue: checkBoxType == "CheckBox", onPress: () => {
                var _a;
                if (!disabled && !props.onPress)
                    state.checked = !state.checked;
                (_a = props.onPress) === null || _a === void 0 ? void 0 : _a.call(props);
            } },
            React.createElement(Text, { ifTrue: props.label != undefined && labelPostion == "Left", css: "fos-sm" }, props.label),
            React.createElement(View, { style: { backgroundColor: color(state.checked) }, css: `_checkBox_${labelPostion}` },
                React.createElement(Icon, { ifTrue: state.checked, type: "AntDesign", css: x => x.co("$co-light"), name: "check", size: 24 })),
            React.createElement(Text, { ifTrue: props.label != undefined && labelPostion == "Right", css: "fos-sm" }, props.label)),
        React.createElement(TouchableOpacity, { style: props.style, css: x => x.cls("_checkBox").juC("flex-end").maB(5).joinRight(props.css).cls(disabledCss), ifTrue: checkBoxType == "RadioButton", onPress: () => {
                if ((!state.checked || selectionType == "CheckBox" || !context.ids) && !disabled)
                    state.checked = !state.checked;
            } },
            React.createElement(Text, { ifTrue: props.label != undefined && labelPostion == "Left", css: "fos-sm" }, props.label),
            React.createElement(View, { style: { borderRadius: 24, backgroundColor: "transparent" }, css: `_checkBox_${labelPostion}` },
                React.createElement(Icon, { ifTrue: state.checked, size: 21, type: "MaterialCommunityIcons", name: "checkbox-blank-circle", color: color(true) })),
            React.createElement(Text, { ifTrue: props.label != undefined && labelPostion == "Right", css: "fos-sm" }, props.label)),
        React.createElement(TouchableOpacity, { ifTrue: checkBoxType == "Switch", activeOpacity: activeOpacity, onPress: () => {
                if (!disabled)
                    state.checked = (!state.checked);
            }, style: props.style, css: `fld:row ali:center juc:end ${optionalStyle(props.css).c} ${disabledCss}` },
            React.createElement(Text, { ifTrue: props.label != undefined, css: "fos-sm", style: {
                    flexGrow: 1,
                    maxWidth: "80%",
                    overflow: "hidden"
                } }, props.label),
            React.createElement(View, { style: {
                    backgroundColor: color(state.checked)
                }, css: "bor:10 mab:5 sh-xs juc:center miw:60 he:25 overflow:visible" },
                React.createElement(AnimatedView, { style: {
                        backgroundColor: color(!state.checked),
                        transform: [
                            {
                                translateX: animate.x.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-5, 40],
                                    extrapolate: "clamp"
                                })
                            }
                        ]
                    }, css: "wi:25 sh-sm he:25 bor:20 overflow:visible" })))));
};
//# sourceMappingURL=CheckBoxList.js.map