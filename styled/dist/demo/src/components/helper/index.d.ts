import { GenericViewProps, GenericView } from "../../Typse";
export declare const CreateView: {
    <T extends object, P>(view: any, name?: string, override?: boolean, withMem?: boolean): GenericView<T, P> & ((props: GenericViewProps<T, Omit<P, "style">>) => React.ReactElement<P>);
    CssStyleAble: boolean;
};
export declare const CreateViewWithMem: <T extends object, P>(view: any, name?: string, override?: boolean) => Omit<T, "props" | "ref"> & {
    props: GenericViewProps<T, P>;
} & ((props: GenericViewProps<T, Omit<P, "style">>) => import("react").ReactElement<P, string | import("react").JSXElementConstructor<any>>);
