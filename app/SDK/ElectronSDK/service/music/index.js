const E_MUSIC_EVENT = require('./type')
const { IpcMainEvent } = require('../../event')
const thirdPartySDK = require('../../../ThirdPartySDK')

class MusicService {
    initEvent = false
    musicEvent = null
    eventMap = new Map()
    eventsMap = new Map()
    constructor(musicEvent) {
        this.musicEvent = musicEvent
    }

    init() {
        if (this.initEvent) {
            return
        }
        this.initEvent = true
        this.musicEvent.handle(E_MUSIC_EVENT.GET_LIST_BY_TAG, async (event, data) => {
            console.log(`E_MUSIC_EVENT.GET_LIST_BY_TAG data=${JSON.stringify(data)}`)
            const { tag, page } = data || {}
            const result = await thirdPartySDK.musicService.getListByTag(tag, page)
            return result
        })
        this.musicEvent.handle(E_MUSIC_EVENT.GET_MUSIC_INFO_BY_ID, async (event, id) => {
            console.log(`E_MUSIC_EVENT.GET_MUSIC_INFO_BY_ID data=${id}`)
            const result = await thirdPartySDK.musicService.getMusicInfoById(id)
            return result
        })
        this.musicEvent.handle(E_MUSIC_EVENT.SEARCH, async (event, data) => {
            console.log(`E_MUSIC_EVENT.SEARCH data=${JSON.stringify(data)}`)
            const { keyword, page } = data || {}
            const result = await thirdPartySDK.musicService.search(keyword, page)
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

const musicEvent = new IpcMainEvent('E_MUSIC_EVENT')
const musicService = new MusicService(musicEvent)
module.exports = musicService
