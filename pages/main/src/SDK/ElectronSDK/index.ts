
import { electronEvent } from "./event"
import { IElectronEventService } from "./type"

class ElectronEventService implements IElectronEventService {
    
    send(name: string, data: any) {
        electronEvent.send(name, data)
    }

    sendSync(name: string, data: any) {
        return electronEvent.sendSync(name, data)
    }

    invoke(name: string, data?: any) {
        return electronEvent.invoke(name, data)
    }

    on(name: string, callback: (event: any, data: any) => void) {
        electronEvent.on(name, callback)
    }

    once(name: string, callback: (event: any, data: any) => void) {
        electronEvent.once(name, callback)
    }

    off(name: string, callback: (event: any, data: any) => void) {
        electronEvent.off(name, callback)
    }

    clear(names: string[]) {
        electronEvent.clear(names)
    }
}

export default ElectronEventService

