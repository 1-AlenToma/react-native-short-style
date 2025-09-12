import { globalData } from "../theme/ThemeContext";
const getKey = (key) => {
    return `CSSStyled_${key.replace(/[ ]/g, "")}_${globalData.themeIndex}`;
};
class TempStorage {
    validate() {
        let now = parseInt((new Date().getTime() / 1000).toString());
        var hours = Math.abs(now - this.lastSave) / 3600;
        if (hours > 1) {
            this.data = new Map();
            this.lastSave = parseInt((new Date().getTime() / 1000).toString());
        }
    }
    constructor() {
        this.data = new Map();
        this.lastSave = parseInt((new Date().getTime() / 1000).toString());
        globalData.tStorage = this;
    }
    getKey(key) {
        return getKey(key);
    }
    set(key, item) {
        this.data.set(this.getKey(key), item);
    }
    delete(key) {
        this.data.delete(this.getKey(key));
    }
    get(key) {
        let value = this.data.get(this.getKey(key));
        this.validate();
        return value;
    }
    has(key) {
        return this.data.has(this.getKey(key));
    }
    clear() {
        this.data.clear();
    }
}
class LocalStorage {
    getKey(key) {
        return getKey(key);
    }
    set(key, item) {
        globalData.storage.set(this.getKey(key), item);
    }
    delete(key) {
        globalData.storage.delete(this.getKey(key));
    }
    get(key) {
        let value = globalData.storage.get(this.getKey(key));
        if (value && typeof value === "string" && (value.startsWith("[") || value.startsWith("{")))
            return JSON.parse(value);
        return value;
    }
    has(key) {
        return globalData.storage.has(this.getKey(key));
    }
    clear() {
        globalData.storage.clear();
    }
}
export const Storage = new LocalStorage();
export const TStorage = new TempStorage();
//# sourceMappingURL=Storage.js.map