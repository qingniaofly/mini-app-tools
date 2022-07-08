import { createBrowserHistory, History, createHashHistory } from "history"

class ReactHistory {
    private static instance: History | null

    public static getInstance() {
        // console.log("process.env.PUBLIC_HISTORY1", process.env)
        // const isHashBrower = process.env.PUBLIC_HISTORY ? (process.env.PUBLIC_HISTORY === "hash" ? true : false) : true
        if (!ReactHistory.instance) {
            ReactHistory.instance = ReactHistory.create()
        }
        return ReactHistory.instance
    }

    public static destory() {
        ReactHistory.instance = null
    }

    public static create(isHashBrower = false) {
        // const basename = process.env.PUBLIC_URL
        // console.log("process.env.PUBLIC_HISTORY", process.env, basename)
        const history = isHashBrower ? createHashHistory({ pathname: ''}) : createBrowserHistory({ pathname: '' })
        return history
    }
}

export const history = ReactHistory.getInstance()

export default ReactHistory
