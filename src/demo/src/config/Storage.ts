import { Platform } from "react-native";
import { globalData } from "../theme/ThemeContext";

export default class LocalStorage {

    getKey(key: string) {
        return `CSSStyled_${key}`;
    }
    set(key: string, item: any) {
        globalData.storage.set(this.getKey(key), item);
    }

    delete(key: string) {
        globalData.storage.delete(this.getKey(key));
    }

    get(key: string) {
        let value = globalData.storage.get(this.getKey(key));
        if (value && typeof value === "string" && (value.startsWith("[") || value.startsWith("{")))
            return JSON.parse(value);
        return value;
    }

    has(key: string) {
        return globalData.storage.has(this.getKey(key));
    }

    clear() {
        globalData.storage.clear();
    }
}

export const Storage = new LocalStorage();