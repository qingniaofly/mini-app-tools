import { createStoreWithReducers } from "./base"
import { reducers } from "./reducers"
import { IRootState } from "./type"

const initialState: IRootState = {
    test: '',
    cacheRoute: new Map()
}

export const store = createStoreWithReducers(reducers, initialState)

export default store
