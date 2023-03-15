const { ipcMain } = require('electron')

class IpcMainEvent {
    on(name, callback) {
        ipcMain.on(name, callback)
    }

    once(name, callback) {
        ipcMain.once(name, callback)
    }

    removeListener(name, callback) {
        ipcMain.removeListener(name, callback)
    }

    removeAllListeners(names) {
        ipcMain.removeAllListeners(names)
    }

    handle(name, callback) {
        return ipcMain.handle(name, callback)
    }

    handleOnce(name, callback) {
        return ipcMain.handleOnce(name, callback)
    }
}

class WindowEvent extends IpcMainEvent {
    window = null
    eventUtil = new EventUtil()
    constructor(window) {
        this.window = window
    }

    send(name, data) {
        this.window.webContents.send(name, data)
    }
}

class EventUtil {
    map = new Map()

    on = (name, callback) => {
        let fnList = this.map.get(name)
        if (!Array.isArray(fnList)) {
            fnList = []
        }
        fnList.push(callback)
        this.map.set(name, fnList)
    }

    send = (name, data) => {
        const fnList = this.map.get(name)
        if (!Array.isArray(fnList)) {
            return
        }
        fnList.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(data)
            }
        })
    }

    removeListener(name, callback) {
        const fnList = this.map.get(name)
        if (!Array.isArray(fnList)) {
            return
        }
        const list = fnList.filter((fn) => fn !== callback)
        this.map.set(name, list)
    }

    clear() {
        this.map.clear()
    }
}

module.exports = { ipcMainEvent: new IpcMainEvent(), WindowEvent, EventUtil }
