import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import store from "./store"
import { HashRouter } from "react-router-dom"
import { SDK } from './SDK'
SDK.init()
const container = document.getElementById("root") as HTMLDivElement
const root = ReactDOM.createRoot(container)
const render = (Component: React.FC): void => {
    root.render(
        <Provider store={store}>
            <HashRouter>
                <Component />
            </HashRouter>
        </Provider>
    )
}
render(App)
