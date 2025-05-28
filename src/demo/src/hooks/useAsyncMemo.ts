import React from "react";
import { useTimer } from "./useTimer";

export const useAsyncMemo = function <T>(builder: () => T, depends: any[]) {
    const [items, setItems] = React.useState<T | undefined>();
    const timer = useTimer(1)
    React.useEffect(() => {
        timer(() => {
            setItems(builder());
        });
    }, depends)

    return items;
}