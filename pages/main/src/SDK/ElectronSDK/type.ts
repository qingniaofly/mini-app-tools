export enum E_GLOBAL_EVENT {
    ROUTE_CHANGE = 'ROUTE_CHANGE'
}

export interface IElectronEventService {
    
    send: (name: string, data: any) => void

    sendSync: (name: string, data: any) => Promise<any>

    invoke: (name: string, data?: any) => Promise<any>

    on: (name: string, callback: (event: any, data: any) => void) => void

    once: (name: string, callback: (event: any, data: any) => void) => void

    off: (name: string, callback: (event: any, data: any) => void) => void

    clear: (names: string[]) => void
}
 