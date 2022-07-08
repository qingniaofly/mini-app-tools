export class Box<T> {
    // eslint-disable-next-line
    constructor(private _instance: T = null) {
    }
    get() {
        return this._instance
    }
    set(t: T) {
        this._instance = t
    }
}