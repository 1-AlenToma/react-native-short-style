import { ThemeContext, globalData, InternalThemeContext } from "./ThemeContext";
import * as React from "react";
import { IThemeContext } from "../Typse";
import StateBuilder from "react-smart-state";
import { newId, clearAllCss } from "../config/Methods";
import { View, AlertView } from "../components";


const StaticView = () => {
    const context = React.useContext(InternalThemeContext);
    const state = StateBuilder({
        updater: ""
    }).build();

    context.onChange = () => state.updater = newId();
    const items: any[] = [...context.items().values()];


    return (
        <View css="zi:2 topPostion fl:1" ifTrue={items.length > 0}>
            {items}
        </View>
    )


}

const ThemeInternalContainer = ({ children }: any) => {
    const state = StateBuilder({
        items: new Map(),
        containerSize: { height: 0, width: 0 }
    }).ignore("items", "containerSize").build();

    const contextValue = {
        add: (id: string, element: React.ReactNode) => {
            state.items.set(id, element);
            contextValue.onChange?.();
        },
        remove: (id: string) => {
            let has = state.items.has(id);
            state.items.delete(id);
            if (has)
                contextValue.onChange?.();
        },
        totalItems: () => state.items.size,
        items: () => state.items,
        onChange: () => { },
        containerSize: () => state.containerSize

    }



    return (
        <InternalThemeContext.Provider value={contextValue}>
            <View onLayout={({ nativeEvent }) => {
                state.containerSize.height = nativeEvent.layout.height;
                state.containerSize.width = nativeEvent.layout.width;
            }} style={{ backgroundColor: "transparent", flex: 1, width:"100%", height:"100%" }}>
                <StaticView />
                <AlertView />
                {children}
            </View>
        </InternalThemeContext.Provider>
    )
}

export const ThemeContainer = (props: IThemeContext & { children: any }) => {
    globalData.hook("window");
    React.useEffect(() => {
        let events = globalData.appStart();
        return () => events.forEach(x => x.remove());
    }, [])

    React.useEffect(()=> {
        clearAllCss();
    },[props.selectedIndex])

    return (
        <ThemeContext.Provider value={props}>
            <ThemeInternalContainer>
                {props.children}
            </ThemeInternalContainer>
        </ThemeContext.Provider>
    )

}