import { IElectronSDK } from '../../type'
import INovelService, { E_NOVEL_EVENT } from './type'

class NovelService implements INovelService {
    private electronSDK: IElectronSDK
    constructor(electronSDK: IElectronSDK) {
        this.electronSDK = electronSDK
    }

    getList() {
        console.log(`NovelService getListByTag`)
        return this.electronSDK.eventService.invoke(E_NOVEL_EVENT.GET_LIST)
    }

    getChapterList(url: string) {
        console.log(`NovelService getChapterList url=${url}`)
        return this.electronSDK.eventService.invoke(E_NOVEL_EVENT.GET_CHAPTER_LIST, url)
    }

    getChapterInfo(url: string) {
        console.log(`NovelService getChapterInfo url=${url}`)
        return this.electronSDK.eventService.invoke(E_NOVEL_EVENT.GET_CHAPTER_INFO, url)
    }

    search(keyword: string, page: number) {
        console.log(`NovelService search keyword=${keyword},page=${page}`)
        return this.electronSDK.eventService.invoke(E_NOVEL_EVENT.SEARCH, { keyword, page })
    }

    download(url: string) {
        console.log(`NovelService download url=${url}`)
        return this.electronSDK.eventService.invoke(E_NOVEL_EVENT.DOWNLOAD, url)
    }
}

export default NovelService
