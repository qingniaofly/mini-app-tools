const E_NOVEL_EVENT = require('./type')
const { IpcMainEvent } = require('../../event')
const thirdPartySDK = require('thirdparty-sdk')
const downloadUtil = require('../../util/download')

class NovelService {
    initEvent = false
    novelEvent = null
    eventMap = new Map()
    eventsMap = new Map()
    constructor(novelEvent) {
        this.novelEvent = novelEvent
    }

    init(data) {
        if (this.initEvent) {
            return
        }
        const { downloadUrl = '' } = data || {}
        this.initEvent = true
        downloadUtil.downloadUrl = downloadUrl
        this.novelEvent.handle(E_NOVEL_EVENT.GET_LIST, async (event, data) => {
            console.log(`E_NOVEL_EVENT.GET_LIST data=${JSON.stringify(data)}`)
            const result = await thirdPartySDK.novelService.getList()
            return result
        })
        this.novelEvent.handle(E_NOVEL_EVENT.GET_CHAPTER_LIST, async (event, url) => {
            console.log(`E_NOVEL_EVENT.GET_CHAPTER_LIST data=${url}`)
            const result = await thirdPartySDK.novelService.getChapterList(url)
            return result
        })
        this.novelEvent.handle(E_NOVEL_EVENT.GET_CHAPTER_INFO, async (event, url) => {
            console.log(`E_NOVEL_EVENT.GET_CHAPTER_INFO data=${url}`)
            const result = await thirdPartySDK.novelService.getChapterInfo(url)
            return result
        })
        this.novelEvent.handle(E_NOVEL_EVENT.SEARCH, async (event, data) => {
            console.log(`E_NOVEL_EVENT.SEARCH data=${JSON.stringify(data)}`)
            const { keyword, page } = data || {}
            const result = await thirdPartySDK.novelService.search(keyword, page)
            return result
        })
        this.novelEvent.handle(E_NOVEL_EVENT.DOWNLOAD, async (event, url) => {
            console.log(`E_NOVEL_EVENT.DOWNLOAD data=${url}`)
            const result = await thirdPartySDK.novelService.download(url)
            const { code, ...args } = await downloadUtil.downloadNovel(result)
            result.code = code
            result.success = code === 0 ? 1 : 0
            result.data = args
            return result
        })
    }

    clear() {
        const eventNames = [...this.eventMap.keys()]
        this.ipcMainEvent.clear(eventNames)
        this.eventMap.clear()
        this.eventsMap.clear()
    }
}
const novelEvent = new IpcMainEvent('E_NOVEL_EVENT')
const novelService = new NovelService(novelEvent)
module.exports = novelService
