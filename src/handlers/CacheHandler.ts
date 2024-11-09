export class CacheHandler<T> {
    map: Map<string, T>;
    constructor () {
        this.map = new Map();
    }

    cache(key: string, value: T | Partial<T>) {
        if (this.has(key)) this.map.set(key, { ...this.map.get(key), ...value } as T);
        else this.map.set(key, value as T); // this should only ever happen with full values anyway
    }

    get(key: string) {
        return this.map.get(key);
    }

    drop(key: string) {
        this.map.delete(key);
    }

    has(key: string) {
        return this.map.has(key);
    }
}