const { ipcRenderer } = window.require('electron');

export const electronEvent = {
    
    send(name: string, data: any) {
        ipcRenderer.send(name, data)
    },

    sendSync(name: string, data: any) {
        return ipcRenderer.sendSync(name, data)
    },

    invoke(name: string, data?: any) {
        return ipcRenderer.invoke(name, data)
    },

    on(name: string, callback: (event: any, data: any) => void) {
        ipcRenderer.on(name, callback)
    },

    once(name: string, callback: (event: any, data: any) => void) {
        ipcRenderer.once(name, callback)
    },

    off(name: string, callback: (event: any, data: any) => void) {
        ipcRenderer.removeListener(name, callback)
    },

    clear(names: string[]) {
        ipcRenderer.removeAllListeners(names)
    }
}

