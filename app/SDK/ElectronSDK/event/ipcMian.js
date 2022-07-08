const { ipcMain } = require('electron');

const ipcMainNativeEvent = {
    
    send(name, data) {
        window.webContents.send(name, data)
    },

    on(name, callback) {
        ipcMain.on(name, callback)
    },

    once(name, callback) {
        ipcMain.once(name, callback)
    },

    off(name, callback) {
        ipcMain.removeListener(name, callback)
    },

    clear(names) {
        ipcMain.removeAllListeners(names)
    },

    handle(name, callback) {
        return ipcMain.handle(name, callback)
    },

    handleOnce(name, callback) {
        return ipcMain.handleOnce(name, callback)
    }
}

class IpcMainEventUtil {
    ipcMainEvent = null
    eventMap = new Map()
    eventsMap = new Map()
    constructor(ipcMainEvent) {
        this.ipcMainEvent = ipcMainEvent
    }

    handle(name, callback) {
        const eventService = this.ipcMainEvent
        const fn = this.eventMap.get(name)
        if (fn) {
            eventService.off(name, fn)
        }
        this.eventMap.set(name, callback)
        eventService.handle(name, callback)
    }

    clear() {
        const eventNames = [...this.eventMap.keys()]
        this.ipcMainEvent.clear(eventNames)
        this.eventMap.clear()
        this.eventsMap.clear()
    }
}

class IpcMainEvent extends IpcMainEventUtil {
    key = ''
    constructor(key) {
        super(ipcMainNativeEvent)
        this.key = key
    }
    handle(name, callback) {
        const newName = `${this.key}_${name}`
        super.handle(newName, callback)
    }
}


module.exports = {
    ipcMainNativeEvent,
    IpcMainEvent
}