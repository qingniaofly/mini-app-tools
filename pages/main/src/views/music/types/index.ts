export interface IMuisicInfo {
    id: string
    cover: string
    name: string
    src: string
    songer: string
    time: string
    lyric?: string
}

export enum E_MUSIC_SOURCE {
    zz123 = 'zz123'
}

export enum E_MUSIC_PLAYER_ACTION {
    PLAY = 'play',
    PAUSE = 'pause',
    ADD = 'add',
    REMOVE = 'remove',
    PLAY_LIST = 'play_list',
    PREV = 'prev',
    NEXT = 'next',
}

export enum E_MUSIC_PLAYER_STATUS {
    NONE = 'none',
    PLAYING ='playing',
    PAUSE = 'pause'
}

export enum E_MUSIC_PLAY_TYPE {
    LIST = 'list', // 列表
    RANDOM ='random', // 随机
    SINGLE = 'single', // 单曲循环
    LIST_LOOP = 'LIST_LOOP' // 列表循环
}