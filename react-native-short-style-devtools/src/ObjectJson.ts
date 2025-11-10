import fs from "fs";
import path from "path";

export class Settings {
    elementSelection = false;
    webDevToolsIsOpen = false;
    zoom = 1;
    autoSave = true;
}

export class Logs {
    data: any[] = [];
    add(...items: any[]) {
        items.forEach(item => {
            if (this.data.length > 300)
                this.data.shift();
            this.data.push(item);
        });
    }

    clear(){
        this.data = [];
    }
}

export class ObjectJson<T extends Record<string, any>> {
    data: T;
    fileName: string;
    hasChanged = false;
    logs: Logs = new Logs();

    constructor(data: T, fileName = "AppSettings") {
        this.data = data;
        this.fileName = fileName;
        this.read();
    }

    get basePath(): string {
        const dir = path.join(".", "react-native-short-style-devtools-data");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        return dir;
    }

    setKeyValue<K extends keyof T>(key: K, value: T[K]): this {
        if (this.data[key] !== value) {
            this.data[key] = value;
            this.hasChanged = true;
        }
        return this;
    }

    ObjectValue(__To?: "HTML" | "APP") {
        return Object.entries(this.data).map(([key, value]) => ({
            payload: { key, value },
            type: "PROP",
            __To,
        }));
    }

    read(): this {
        const filePath = path.join(this.basePath, `${this.fileName}.json`);
        if (fs.existsSync(filePath)) {
            try {
                const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
                Object.assign(this.data, json);
            } catch (err) {
                console.error(`❌ Failed to read JSON: ${filePath}`, err);
            }
        } else {
            this.save(); // Create file with defaults
        }
        return this;
    }

    save(): this {
        const filePath = path.join(this.basePath, `${this.fileName}.json`);
        try {
            fs.writeFileSync(filePath, JSON.stringify(this.data, null, 2), "utf8");
            this.hasChanged = false;
        } catch (err) {
            console.error(`❌ Failed to save JSON: ${filePath}`, err);
        }
        return this;
    }
}
