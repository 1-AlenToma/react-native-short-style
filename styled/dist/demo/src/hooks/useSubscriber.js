import React from "react";
import { useTimer } from "./useTimer";
import { newId } from "../config";
export function useSubscriber(defaultValue) {
    const subscribers = React.useRef({}).current;
    const timer = useTimer(100);
    // Used by children to subscribe
    const listen = (validator) => {
        const id = React.useRef(newId()).current;
        const [value, setValue] = React.useState(defaultValue);
        subscribers[id] = {
            setValue,
            validator
        };
        React.useEffect(() => {
            return () => {
                delete subscribers[id];
            };
        }, []);
        return value;
    };
    const clear = () => {
        timer(() => {
            setValue(defaultValue);
        });
    };
    // Used by publisher to broadcast
    const setValue = (value) => {
        for (const fn of Object.values(subscribers)) {
            if (!fn.validator || fn.validator(value))
                fn.setValue(value);
        }
    };
    return { listen, setValue, clear };
}
//# sourceMappingURL=useSubscriber.js.map