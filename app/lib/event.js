const Window = require('../core/window')
const { ipcMainEvent, WindowEvent, EventUtil } = require('../core/event')

class CommonEvent {
    eventUtil = new EventUtil()
    constructor() {
        ipcMainEvent.on('create-task-window', (_, args) => {
            console.log('create-task-window', args)
        })

        ipcMainEvent.on('close-task-window', (_, args) => {
            console.log('close-task-window', args)
        })

        ipcMainEvent.on('message-from-worker', (event, args) => {
            console.log('main:', args)
            const mainWindow = Window.get('main')
            mainWindow.instance?.webContents.send('message-to-renderer', args)
        })
        ipcMainEvent.on('message-from-renderer', (event, args) => {
            console.log('main:', args)
            const workerWindow = Window.get('worker')
            workerWindow.instance?.webContents.send('message-from-main', args)
        })

        ipcMainEvent.on('fireEvent', (event, args) => {
            this.eventUtil.send(args.name, args.data)
        })

        ipcMainEvent.on('registerEvent', (event, args) => {
            this.eventUtil.on(args.name, args.data)
        })
    }
}

module.exports = {
    ipcMainEvent,
    eventUtil: new EventUtil(),
    WindowEvent,
    CommonEvent,
}
