// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
// const nodeAbi = require('node-abi')
const debug = require('electron-debug')
const log4js = require('log4js')
const Logger = require('./lib/logger')
const { config } = require('./config')
const logger = new Logger(log4js, { filePath: config.get('logFilePath'), type: 'log4js', category: 'mini-tools' })
logger.init()
config.log()
const { crashUtil, crashFilePath, crashDumpsDir } = require('./lib/crash')
const Window = require('./lib/window')
const { menus } = require('./lib/menu.js')
const { CommonEvent } = require('./lib/event')
const electronSDK = require('./SDK/ElectronSDK')

config.openDevTools && debug({ showDevTools: false })

Menu.setApplicationMenu(menus) // 隐藏菜单
// 禁用当前应用程序的硬件加速
app.disableHardwareAcceleration()

// isDebug && console.log('electron abi:', nodeAbi.getAbi('17.12.0', 'electron'), 'node abi:', nodeAbi.getAbi('14.17.0', 'node'))

function initMainWindow() {
    crashUtil.start()
    const mainWindow = Window.open('/index.html', {
        winId: 'main',
    })
    mainWindow.instance.webContents.on('dom-ready', () => {
        console.log('main window dom-ready')
    })

    mainWindow.instance.webContents.on('did-create-window', () => {
        console.log('main window did-create-window')
    })

    mainWindow.instance.webContents.on('did-finish-load', function (event) {
        // mainWindow.instance.webContents.send('crash-file-path', `${crashFilePath} or ${crashDumpsDir}`)
    })

    const commonEvent = new CommonEvent()

    electronSDK.init({ downloadUrl: __dirname })

    return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    console.log('app ready')
    initMainWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    console.log('app window-all-closed')
    if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
    //
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
