const window = require('../core/window')
const { ipcMainEvent } = require('../core/event')
const { config } = require('../config')

class Window {
    constructor() {
        ipcMainEvent.on('windowEvent', (event, args) => {
            console.log('window.js windowEvent', args)
            const fn = this[args?.method]
            if (typeof fn === 'function') {
                fn.apply(this, args.data)
            }
        })
    }
    get(id) {
        return window.get(id)
    }
    reload(id) {
        window.reload(id)
    }
    open(url, opts) {
        url = `${config.get('mainPath')}${url}`
        return window.open(url, opts)
    }
}

module.exports = new Window()
