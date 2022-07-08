interface INovelService {
    getList: () => PromiseLike<any>
    getChapterList: (url: string) => PromiseLike<any>
    getChapterInfo: (url: string) => PromiseLike<any>
    search: (keyword: string, page: number) => PromiseLike<any>
    download: (url: string) => PromiseLike<any>
}

// const E_MUSIC_EVENT_KEY = 'E_MUSIC_EVENT'

export enum E_NOVEL_EVENT {
    GET_LIST = 'E_NOVEL_EVENT_GET_LIST',
    GET_CHAPTER_LIST = 'E_NOVEL_EVENT_GET_CHAPTER_LIST',
    GET_CHAPTER_INFO = 'E_NOVEL_EVENT_GET_CHAPTER_INFO',
    SEARCH = 'E_NOVEL_EVENT_SEARCH',
    DOWNLOAD = 'E_NOVEL_EVENT_DOWNLOAD',
}

export default INovelService
