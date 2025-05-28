import React from "react";
import { useTimer } from "./useTimer";
import { newId } from "../config";

type SubscriberMap<T> = Record<string, { validator?: (newValue: T) => boolean, setValue: (value: T) => void }>;

export function useSubscriber<T>(defaultValue: T) {
    const subscribers = React.useRef<SubscriberMap<T>>({}).current;
    const timer = useTimer(0);

    // Used by children to subscribe
    const listen = (validator?: (newValue: T) => boolean) => {
        const id = React.useRef<string>(newId()).current;
        const [value, setValue] = React.useState<T>(defaultValue);
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

    // Used by publisher to broadcast
    const setValue = (value: T) => {
        timer(() => {
            for (const fn of Object.values(subscribers)) {
                if (!fn.validator || fn.validator(value))
                    fn.setValue(value);
            }
        });
    };

    return { listen, setValue };
}