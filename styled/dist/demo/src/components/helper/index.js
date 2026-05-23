import { CMBuilder } from "../../styles";
const styledItems = {};
export const CreateView = function (view, name, override, withMem) {
    var _a, _b;
    name = (_a = name !== null && name !== void 0 ? name : view.displayName) !== null && _a !== void 0 ? _a : view;
    let cacheName = (override ? name : (_b = view.displayName) !== null && _b !== void 0 ? _b : name) + (withMem == true ? "true" : "");
    let View = styledItems[cacheName] ? styledItems[cacheName] : (styledItems[cacheName] = new CMBuilder(name, view)).fn(withMem !== null && withMem !== void 0 ? withMem : false);
    View.displayName = `Styled(${name !== null && name !== void 0 ? name : cacheName})`;
    return View;
};
export const CreateViewWithMem = function (view, name, override) {
    return CreateView(view, name, override, true);
};
// so we could know that this item was create by react-native-short-style
CreateView.prototype.CssStyleAble = CreateView.CssStyleAble = true;
//# sourceMappingURL=index.js.map