import * as React from "react";
import { FormGroupProps, FormItemProps } from "../Typse";
export declare const FormItem: (props: FormItemProps) => React.JSX.Element;
export declare const FormGroup: (props: FormGroupProps & {
    children: (React.ReactElement<FormItemProps> | React.ReactElement<FormItemProps>[]);
}) => React.JSX.Element;
