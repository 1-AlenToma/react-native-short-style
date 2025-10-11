import * as React from "react";
import { LoaderRef } from "../Typse";
export declare const Loader: React.ForwardRefExoticComponent<Omit<import("react-native").ActivityIndicatorProps, "animating" | "hidesWhenStopped"> & {
    loading: boolean;
    text?: string | React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
} & React.RefAttributes<LoaderRef>>;
