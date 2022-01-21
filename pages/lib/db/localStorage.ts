import {useState} from "react";

type KeyLike = string | number;

export class UseLocalStorageDB<DataType = any> {
    addItem(key: KeyLike, data: DataType) {
        this.data.set(key, data);
        this.save();
    }

    removeItem(key: KeyLike) {
        this.data.delete(key);
        this.save()
    }

    values(): DataType[] {
        return Array.from(this.data.values())
    }

    length(): number {
        return this.data.size
    }

    hasKey(key: KeyLike) {
        return this.data.has(key);
    }

    constructor(private storageKey: string) {

        if (global.window) {
            this.data = new Map(JSON.parse(
                localStorage.getItem(
                    storageKey
                )) ?? []
            );
        } else {
            this.data = new Map();
        }

        const [count, updateCount] = useState(this.data.size)

        this.save = () => {
            localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.data.entries())))
            if (this.data.size !== count) {
                updateCount(this.data.size);
            }
        }

        this.count = count;

    }

    count: number;
    save: () => void;
    private data: Map<KeyLike, DataType>;
}
