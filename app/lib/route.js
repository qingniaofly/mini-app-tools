const Window = require('./window')

const routeUtil = {
    push(url) {
        const mainWindow = Window.get('main').instance
        mainWindow.webContents.send('ROUTE_CHANGE', { url })
    },
}

module.exports = routeUtil
