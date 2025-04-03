import { Animated } from "react-native";
import * as React from "react";
import { Size, TabBarProps, TabItemProps } from "../Typse";
type ITabBarContext = {
    onChange: (index: number) => void;
    onMenuChange: (index?: number, menuInterpolate?: number[], menuItemWidth?: number) => void;
    selectedIndex: number;
    lazyLoading: boolean;
    size: Size;
    props: TabBarProps;
    animated: Animated.ValueXY;
};
export declare class TabView extends React.PureComponent<TabItemProps, {}> {
    static contextType: React.Context<ITabBarContext>;
    render(): React.ReactNode;
}
export declare const TabBar: (props: TabBarProps) => React.JSX.Element;
export {};
