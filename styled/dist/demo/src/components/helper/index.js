import { CMBuilder } from "../../styles";
const styledItems = {};
export const CreateView = function (view, name, override, withMem) {
    name = name ?? view.displayName ?? view;
    let cacheName = (override ? name : view.displayName ?? name) + (withMem == true ? "true" : "");
    let View = styledItems[cacheName] ? styledItems[cacheName] : (styledItems[cacheName] = new CMBuilder(name, view)).fn(withMem ?? false);
    View.displayName = `Styled(${name ?? cacheName})`;
    return View;
};
export const CreateViewWithMem = function (view, name, override) {
    return CreateView(view, name, override, true);
};
// so we could know that this item was create by react-native-short-style
CreateView.prototype.CssStyleAble = CreateView.CssStyleAble = true;
//# sourceMappingURL=index.js.map