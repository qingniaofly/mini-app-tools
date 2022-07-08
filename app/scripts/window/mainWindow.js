const { BrowserWindow } = require('electron')
const path = require('path')

class MainWindowUtil {
    instance = null
    
    create() {
      const window = new BrowserWindow({
            width: 800,
            height: 600,
            // backgroundColor: '#f0e68c',
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false,//是否隔离上下文
              // preload: path.join(__dirname, './scripts/preload.js')
            }
        })
      return window
    }

    get() {
      if (!this.instance) {
        this.instance = this.create()
      }
      return this.instance
    }
}

const MainWindow = new MainWindowUtil()

module.exports = {
  MainWindow
}