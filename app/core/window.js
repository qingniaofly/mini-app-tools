const { BrowserWindow } = require('electron')
const { WindowEvent, eventUtil } = require('./event')
const path = require('path')

class BaseWindow {
    instance = null
    winId = ''
    url = ''

    constructor(opts) {
        const winId = opts?.winId
        if (!winId) {
            console.warn('create window must has unique winId')
            return
        }
        this.winId = winId
        const win = this.create(opts)
        console.info(`${winId} window has create`, opts)
        this.instance = win

        if (opts?.menuBarVisible === false) {
            win.removeMenu()
        }
        if (opts?.openDevTools === true) {
            win.webContents.openDevTools()
        }
    }

    create(opts) {
        console.log('preload', path.join(__dirname, '../preload.js'))
        const window = new BrowserWindow({
            width: 800,
            height: 600,
            // backgroundColor: '#f0e68c',
            webPreferences: {
                ...opts?.webPreferences,
                nodeIntegration: true,
                contextIsolation: false, //是否隔离上下文
                preload: path.join(__dirname, '../preload.js'),
                enableRemoteModule: false,
            },
            ...opts,
        })
        return window
    }

    open(url) {
        const win = this.instance
        this.url = url
        console.log(`${this.winId} load:`, url)
        win.loadURL(url)
    }

    reloadUrl() {
        const win = this.instance
        if (!this.url) {
            console.log(`${this.winId} reload: url is empty`)
            return
        }
        console.log(`${this.winId} reload:`, this.url)
        win.loadURL(this.url)
    }
}

class Window {
    winMap = new Map()
    idToWinIdMap = new Map() // 窗口原有id和现有业务winId的映射
    get(id) {
        let win = this.winMap.get(id)
        let winId = id
        if (!win) {
            winId = this.idToWinIdMap.get(id)
            win = this.winMap.get(winId)
        }
        console.log(`window get:winId=${winId},id=${win?.instance?.id}`)
        return win
    }
    open(url, opts) {
        const winId = opts?.winId
        if (!url || !winId) {
            console.log(`winId:${winId} or url: ${url} is empty`)
            return
        }
        let win = this.winMap.get(winId)
        if (!win) {
            win = new BaseWindow(opts)
            this.winMap.set(winId, win)
            const id = win.instance.id
            this.idToWinIdMap.set(id, winId)
            win.instance.on('closed', () => {
                // win.removeAllListeners()
                this.winMap.delete(winId)
                this.idToWinIdMap.delete(id)
                console.log(`${winId} window closed`)
            })

            //监听窗口内容崩溃
            win.instance.webContents.on(
                'crashed',
                ((winId) => {
                    return (err) => {
                        // win.instance.close()
                        // this.open(winId)
                        console.log(`${winId} crashed`, err)
                    }
                })(winId)
            )
            // render-process-gone
            win.instance.webContents.on(
                'render-process-gone',
                ((winId) => {
                    return (err) => {
                        // win.instance.close()
                        // this.open(winId)
                        console.log(`${winId} render-process-gone`, err)
                    }
                })(winId)
            )

            win.instance.webContents.on(
                'unresponsive',
                ((winId) => {
                    return (err) => {
                        console.log(`${winId} unresponsive`)
                    }
                })(winId)
            )

            win.instance.webContents.on('devtools-opened', (err) => {
                console.log(`${winId} devtools-opened`)
            })
        }
        win.open(url)
        return win
    }

    reload(id) {
        const win = this.get(id)
        if (win) {
            win.reloadUrl()
        }
        return win
    }
}

module.exports = new Window()
