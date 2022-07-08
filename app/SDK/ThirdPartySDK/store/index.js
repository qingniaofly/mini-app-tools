
class StoreMap {
    map = new Map()

    get(key) {
        return this.map.get(key)
    }

    set(key, value) {
        return this.map.set(key, value)
    }

    delete(key) {
        return this.map.delete(key)
    }

    clear() {
        this.map.clear()
    }

}


class Store {
    map = new Map()

    get(key) {
        let store = this.map.get(key)
        if (!store) {
            store = new StoreMap()
            this.map.set(key, store)
        }
        return store
    }

    clear() {
        const map = this.map
        for(const [key, store] of map){
            if (store && typeof store?.clear === 'function') {
                store.clear()
            }
        }
        map.clear()
    }
}

const storeService = new Store()

exports.module = storeService