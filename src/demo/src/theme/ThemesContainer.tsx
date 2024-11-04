import { ThemeContext, globalData, InternalThemeContext } from "./ThemeContext";
import * as React from "react";
import { IThemeContext } from "../Typse";
import StateBuilder from "react-smart-state";
import { newId, clearAllCss } from "../config/Methods";
import { View, AlertView, ToastView } from "../components";


const StaticFullView = () => {
    const context = React.useContext(InternalThemeContext);
    const state = StateBuilder({
        updater: ""
    }).build();

    context.onItemsChange = () => {
        state.updater = newId();
    }
    const items: any[] = [...context.items().items.values()];


    return (
        <View css="zi:2 topPostion fl:1" ifTrue={items.length > 0}>
            {items}
        </View>
    )
}

const StaticView = () => {
    const context = React.useContext(InternalThemeContext);
    const state = StateBuilder({
        updater: ""
    }).build();

    context.onStaticItemsChange = () => {
        state.updater = newId();

    }
    const items: any[] = [...context.items().staticItems.values()];


    return (items)


}

const ThemeInternalContainer = ({ children }: any) => {
    const state = StateBuilder({
        items: new Map(),
        staticItems: new Map(),
        containerSize: { height: 0, width: 0, y: 0, x: 0 }
    }).ignore("items", "containerSize").build();

    const contextValue = {
        add: (id: string, element: React.ReactNode, isStattic?: boolean) => {
            if (!isStattic)
                state.items.set(id, element);
            else
                state.staticItems.set(id, element);

            if (!isStattic)
                contextValue.onItemsChange?.();
            else
                contextValue.onStaticItemsChange?.();
        },
        remove: (id: string) => {
            let hasItems = state.items.has(id);
            let hasStatic = state.staticItems.has(id);
            if (hasItems)
                state.items.delete(id);
            if (hasStatic)
                state.staticItems.delete(id);

            if (hasItems)
                contextValue.onItemsChange?.();
            if (hasStatic)
                contextValue.onStaticItemsChange?.();
        },
        totalItems: () => state.items.size,
        items: () => {
            return { items: state.items, staticItems: state.staticItems }
        },
        staticItems: () => state.staticItems,
        onItemsChange: () => { },
        onStaticItemsChange: () => { },
        containerSize: () => state.containerSize

    }



    return (
        <InternalThemeContext.Provider value={contextValue}>
            <View onLayout={({ nativeEvent }) => {
                state.containerSize.height = nativeEvent.layout.height;
                state.containerSize.width = nativeEvent.layout.width;
                state.containerSize.y = nativeEvent.layout.y;
                state.containerSize.x = nativeEvent.layout.x;
            }} style={{ backgroundColor: "transparent", flex: 1, width: "100%", height: "100%" }}>
                <StaticFullView />
                <StaticView />
                <ToastView />
                <AlertView />
                {children}
            </View>
        </InternalThemeContext.Provider>
    )
}

export const ThemeContainer = (props: IThemeContext & { children: any }) => {
    globalData.hook("window");
    const state = StateBuilder({
        selectedIndex: props.selectedIndex
    }).build();
    React.useEffect(() => {
        let events = globalData.appStart();
        return () => events.forEach(x => x.remove());
    }, [])

    if (state.selectedIndex != props.selectedIndex) {
        clearAllCss();
        state.selectedIndex = props.selectedIndex;
    }

    return (
        <ThemeContext.Provider value={props}>
            <ThemeInternalContainer>
                {props.children}
            </ThemeInternalContainer>
        </ThemeContext.Provider>
    )

}