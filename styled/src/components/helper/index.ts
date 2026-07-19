import { GenericViewProps, GenericView } from "../../Typse";
import { CMBuilder } from "../../styles";
const styledItems: any = {}
export const CreateView = function <T extends object, P>(view: any, name?: string, override?: boolean, withMem?: boolean) {
    name = name ?? view.displayName ?? view;
    let cacheName = (override ? name : view.displayName ?? name) + (withMem == true ? "true" : "");
    let View = styledItems[cacheName] ? styledItems[cacheName] : (styledItems[cacheName] = new CMBuilder(name, view)).fn(withMem ?? false);
    View.displayName = `Styled(${name ?? cacheName})`;
    return View as any as GenericView<T, P> & ((props: GenericViewProps<T, Omit<P, "style">>) => React.ReactElement<P>);
}

export const CreateViewWithMem = function <T extends object, P>(view: any, name?: string, override?: boolean) {
    return CreateView<T, P>(view, name, override, true);
}

// so we could know that this item was create by react-native-short-style
CreateView.prototype.CssStyleAble = CreateView.CssStyleAble = true;