import { IElectronSDK } from "../../type"
import IMusicService, { E_MUSIC_EVENT } from "./type"

class MusicService implements IMusicService {
    private electronSDK: IElectronSDK
    constructor(electronSDK: IElectronSDK) {
        this.electronSDK = electronSDK
    }

    getListByTag(tag: string, page: number) {
        console.log(`musicService getListByTag tag=${tag},page=${page}`)
        return this.electronSDK.eventService.invoke(E_MUSIC_EVENT.GET_LIST_BY_TAG, { tag, page })
    }

    getMusicInfoById(id: string) {
        console.log(`musicService getMusicInfoById id=${id}`)
        return this.electronSDK.eventService.invoke(E_MUSIC_EVENT.GET_MUSIC_INFO_BY_ID, id)
    }

    search(keyword: string, page: number) {
        console.log(`musicService search keyword=${keyword},page=${page}`)
        return this.electronSDK.eventService.invoke(E_MUSIC_EVENT.SEARCH, { keyword, page })
    }
}

export default MusicService