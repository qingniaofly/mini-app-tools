import { createStore } from "redux"
import { IAction } from "./type"


export function createAction<T = {}>(type: string, payLoad: T, other = undefined): IAction<T> {
    return {
        type,
        payLoad,
        other
    }
}

export function createStoreWithReducers(reducers: any, initStore: any) {
    const reducer = function (state: any, action: IAction<any>) {
        action.payLoad = action.payLoad === undefined ? {} : action.payLoad
        if (reducers[action.type]) {
            return reducers[action.type](state, action)
        }
        return state
    }
    return createStore(reducer, initStore)
}