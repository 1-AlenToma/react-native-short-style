import * as React from "react";
import { FormGroupProps, FormItemProps } from "../Typse";
export declare const FormItem: (props: FormItemProps) => import("react/jsx-runtime").JSX.Element;
export declare const FormGroup: (props: FormGroupProps & {
    children: (React.ReactElement<FormItemProps> | React.ReactElement<FormItemProps>[]);
}) => import("react/jsx-runtime").JSX.Element;
