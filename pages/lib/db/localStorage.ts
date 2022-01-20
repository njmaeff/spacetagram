export class LocalStorageDB<DataType> {
    addItem(key: string, data: DataType) {
        this.data.set(key, data);
        this.save();
    }

    removeItem(key: string) {
        this.data.delete(key);
        this.save()
    }

    values(): DataType[] {
        return Array.from(this.data.values())
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data.entries()))
    }

    constructor(private storageKey: string) {
        this.data = new Map(JSON.parse(
            localStorage.getItem(
                storageKey
            ))
        )
    }

    private data: Map<string, DataType>;
}
