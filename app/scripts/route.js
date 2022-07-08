const { MainWindow } = require("./window/mainWindow")

const defaultHtml = `main/index.html`
const defaultRoute = "/"
const hashRoute = "#"
const defaultUrl = `${defaultHtml}${hashRoute}${defaultRoute}`

const routeUtil = {
    push(url) {
        const mainWindow = MainWindow.get()
        mainWindow.webContents.send("ROUTE_CHANGE", { url })
    }
}

module.exports = {
    defaultUrl,
    hashRoute,
    defaultRoute,
    routeUtil
}
