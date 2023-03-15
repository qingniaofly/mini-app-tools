const { ipcRenderer } = window.require('electron')
class WindowUtil {
    constructor() {}

    open(url: string, opts) {
        ipcRenderer.send('windowEvent', { method: 'open', data: [url, opts] })
    }
}
const windowUtil = new WindowUtil()
export default windowUtil
