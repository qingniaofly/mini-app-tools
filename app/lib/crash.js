const { app, crashReporter } = require('electron')
const path = require('path')

// 获取奔溃堆栈文件存放路径
let crashFilePath = ''
let crashDumpsDir = ''
class CrashUtil {
    constructor() {
        try {
            // electron 低版本
            crashFilePath = path.join(app.getPath('temp'), app.getName() + ' Crashes')
            console.log('app crash path:', crashFilePath)

            // electron 高版本
            crashDumpsDir = app.getPath('crashDumps')
            console.log('app crashDumpsDir:', crashDumpsDir)
        } catch (e) {
            console.error('app crash file path error', e)
        }

        app.on('gpu-process-crashed', (event, kill) => {
            console.warn('app:gpu-process-crashed', event, kill)
        })

        app.on('renderer-process-crashed', (event, webContents, kill) => {
            console.warn('app:renderer-process-crashed', event, webContents, kill)
        })

        app.on('render-process-gone', (event, webContents, details) => {
            console.warn('app:render-process-gone', event, webContents, details)
        })

        app.on('child-process-gone', (event, details) => {
            console.warn('app:child-process-gone', event, details)
        })
    }
    start = () => {
        // 开启crash捕获
        crashReporter.start({
            productName: 'mini-tools',
            companyName: 'qingniaofly',
            // submitURL: 'https://www.xxx.com', // 上传到服务器的地址
            uploadToServer: false, // 不上传服务器
            ignoreSystemCrashHandler: false, // 不忽略系统自带的奔溃处理，为 true 时表示忽略，奔溃时不会生成奔溃堆栈文件
        })
    }
}
const crashUtil = new CrashUtil()
module.exports = { crashUtil, crashFilePath, crashDumpsDir }
