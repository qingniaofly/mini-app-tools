export enum E_ROUTE_EVENT {
    ROUTE_CHANGE = 'ROUTE_CHANGE'
}

interface IRouteService {
    onRouteChange: (callback: (event: any, data: any) => void) => () => void
    clear: () => void
}

export default IRouteService