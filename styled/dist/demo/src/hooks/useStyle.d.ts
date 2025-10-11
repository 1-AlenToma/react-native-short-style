import { IParent, StyleContextType, PositionContext } from "../Typse";
import * as React from "react";
export declare const positionContext: React.Context<PositionContext>;
export declare function useStyled(parentId: string, context: StyleContextType, type: string, index: number, total: number, variant?: string, thisParent?: IParent, systemTheme?: any): Record<string, any> & {
    important: Record<string, any>;
};
export declare const cleanStyle: (style: any, parse?: boolean) => any;
