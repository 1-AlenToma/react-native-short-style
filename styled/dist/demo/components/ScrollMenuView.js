import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StateBuilder from "react-smart-state";
import { ActionSheet, Button, Icon, ScrollMenu, Text, View } from "../src";
export const ScrollMenuView = () => {
    const state = StateBuilder({
        selectedIndex: 0,
        visible: false
    }).build();
    return (_jsxs(View, { css: "fl-1", children: [_jsx(Button, { onPress: () => state.visible = true, icon: _jsx(Icon, { type: "Entypo", name: "menu", size: 20 }) }), _jsxs(ActionSheet, { position: "Right", size: "40%", isVisible: state.visible, onHide: () => state.visible = false, children: [_jsx(Button, { onPress: () => state.selectedIndex = 0, text: "View 1", css: `${state.selectedIndex == 0 ? "bac-red" : ""}` }), _jsx(Button, { onPress: () => state.selectedIndex = 1, text: "View 2", css: `${state.selectedIndex == 1 ? "bac-red" : ""}` }), _jsx(Button, { onPress: () => state.selectedIndex = 2, text: "View 3", css: `${state.selectedIndex == 2 ? "bac-red" : ""}` })] }), _jsxs(ScrollMenu, { style: { padding: 10 }, horizontal: false, onChange: index => state.selectedIndex = index, selectedIndex: state.selectedIndex, children: [_jsx(View, { children: _jsx(Text, { children: "view 1" }) }), _jsx(View, { children: _jsx(Text, { children: "view 2" }) }), _jsx(View, { children: _jsx(Text, { children: "view 3" }) })] })] }));
};
//# sourceMappingURL=ScrollMenuView.js.map