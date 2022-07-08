import { E_ACTION_TYPE } from "./actions"
import { IAction, IRootState } from "./type"

export const reducers = {
    [E_ACTION_TYPE.TEST_ACTION](state: IRootState, action: IAction<string>) {
        return { ...state, test: action.payLoad }
    }
}