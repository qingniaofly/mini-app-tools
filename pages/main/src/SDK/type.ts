import { IElectronEventService } from "./ElectronSDK/type";
import IMusicService from "./SDKBox/music/type";
import RouteService from "./SDKBox/route/type"
import INovelService from "./SDKBox/novel/type";

export interface ISDKBox {
    musicService: IMusicService,
    routeService: RouteService,
    novelService: INovelService
}

export interface IElectronSDK {
    eventService: IElectronEventService
}