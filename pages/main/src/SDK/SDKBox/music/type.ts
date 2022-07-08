
interface IMusicService {
    getListByTag: (tag: string, page: number) => PromiseLike<any>,
    getMusicInfoById: (id: string) => PromiseLike<any>
    search: (keyword: string, page: number) => PromiseLike<any>
}

// const E_MUSIC_EVENT_KEY = 'E_MUSIC_EVENT'

export enum E_MUSIC_EVENT {
    GET_LIST_BY_TAG = 'E_MUSIC_EVENT_GET_LIST_BY_TAG',
    GET_MUSIC_INFO_BY_ID = 'E_MUSIC_EVENT_GET_MUSIC_INFO_BY_ID',
    SEARCH = 'E_MUSIC_EVENT_SEARCH'
}

export default IMusicService