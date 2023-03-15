import { IElectronSDK, ISDKBox } from "./type"
import { Box } from "./box"
import ElectronEventService from "./ElectronSDK"
import MusicService from "./SDKBox/music"
import RouteService from "./SDKBox/route"
import NovelService from "./SDKBox/novel"

export const SDKBox: Box<ISDKBox> = new Box()
export const ElectronBox: Box<IElectronSDK> = new Box()


export const SDK = {
    init: () => {
        SDK.createSDKBox() 
    },

    createSDKBox: () => {
        const electronSDK: IElectronSDK = SDK.createElectronSDK()
        const sdk: ISDKBox = {
            musicService: new MusicService(electronSDK),
            routeService: new RouteService(electronSDK),
            novelService: new NovelService(electronSDK)
        }
        ElectronBox.set(electronSDK)
        SDKBox.set(sdk)
    },

    createElectronSDK(): IElectronSDK {
        const electronSDK: IElectronSDK = {
            eventService: new ElectronEventService()
        }
        return electronSDK
    }
}