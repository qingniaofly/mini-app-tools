import { IElectronSDK } from "../../type"
import IRouteService, { E_ROUTE_EVENT } from "./type"

class RouteService implements IRouteService {
    private electronSDK: IElectronSDK
    private eventMap = new Map()
    private eventsMap = new Map()
    constructor(electronSDK: IElectronSDK) {
        this.electronSDK = electronSDK
        this.on(E_ROUTE_EVENT.ROUTE_CHANGE, (event, data) => {
            const list = this.eventsMap.get(E_ROUTE_EVENT.ROUTE_CHANGE)
            if (Array.isArray(list)) {
                list.forEach((fn) => {
                    if (typeof fn === 'function') {
                        fn(event,data)
                    }
                })
            }
        })
    }

    private on(name: string, callback: (event: any, data: any) => void) {
        const { eventService } = this.electronSDK
        const fn = this.eventMap.get(name)
        if (fn) {
            eventService.off(name, fn)
        }
        this.eventMap.set(name, callback)
        eventService.on(E_ROUTE_EVENT.ROUTE_CHANGE, callback)
    }

    onRouteChange(callback: (event: any, data: any) => void) {
        let list = this.eventsMap.get(E_ROUTE_EVENT.ROUTE_CHANGE)
        if (!Array.isArray(list)) {
            list = []
        }
        list.push(callback)
        this.eventsMap.set(E_ROUTE_EVENT.ROUTE_CHANGE, list)
        return () => {
            this.electronSDK.eventService.clear([E_ROUTE_EVENT.ROUTE_CHANGE])
        }
    }

    clear() {
        const eventNames: string[] = [...this.eventMap.keys()]
        this.electronSDK.eventService.clear(eventNames)
        this.eventMap.clear()
        this.eventsMap.clear()
    }
}

export default RouteService