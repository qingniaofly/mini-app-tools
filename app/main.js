// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, globalShortcut } = require('electron')
const path = require('path')
const url = require('url')
const { menus } = require('./scripts/menu.js')
const { defaultUrl } = require('./scripts/route.js')
const { MainWindow } = require('./scripts/window/mainWindow')
const electronSDK = require('./SDK/ElectronSDK')
const logger = require('./scripts/logger')

// console.log(menus)
Menu.setApplicationMenu(menus) // 隐藏菜单
// 禁用当前应用程序的硬件加速
app.disableHardwareAcceleration()

function createWindow() {
    // Create the browser window.
    const mainWindow = MainWindow.get()

    // and load the index.html of the app.
    // mainWindow.loadFile('./app/main/index.html#/about')
    mainWindow.loadURL(`file://${__dirname}/public/pages/${defaultUrl}`)
    // mainWindow.loadURL(`file://${__dirname}/public/pages/purehtml/index.html`)

    // const fileUrl = url.format({
    //   protocol: 'file',
    //   slashes: true,
    //   pathname: path.join(__dirname, './app/main/index.html')
    // })
    // mainWindow.loadURL(fileUrl)

    logger.init()

    electronSDK.init({ downloadUrl: __dirname })
    // mainWindow.webContents.openDevTools({mode:'right'})

    // Open the DevTools.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

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
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
