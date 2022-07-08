import { createAction } from "./base"

export enum E_ACTION_TYPE {
    TEST_ACTION = 'testAction'
}

export const storeAction = {
    test(test: string) {
        return createAction(E_ACTION_TYPE.TEST_ACTION, test)
    },
}