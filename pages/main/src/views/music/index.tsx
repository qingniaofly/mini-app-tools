import React, { memo, startTransition, useCallback, useEffect, useRef, useState } from "react"
import { SDKBox } from "../../SDK"
import _, { isFunction } from "lodash"
import "./index.scss"
import Loading from "../../components/loading"
import Portal from "../../components/portal"
import classNames from "classnames"
import lyricUtil from "./lyric"
import { E_MUSIC_PLAYER_ACTION, E_MUSIC_PLAYER_STATUS, E_MUSIC_PLAY_TYPE, E_MUSIC_SOURCE, IMuisicInfo } from "./types"
import MusicList, { MusicVirtualList } from "./components/musicList"
import useAudioEvent from "./hooks/useAudioEvent"
import MusicPlayer from "./components/musicPlayer"

// 事件 描述 DOM
// onabort 事件在视频/音频（audio/video）终止加载时触发。 
// oncanplay 事件在用户可以开始播放视频/音频（audio/video）时触发。 
// oncanplaythrough 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发。 
// ondurationchange 事件在视频/音频（audio/video）的时长发生变化时触发。 
// onemptied 当期播放列表为空时触发 
// onended 事件在视频/音频（audio/video）播放结束时触发。 
// onerror 事件在视频/音频（audio/video）数据加载期间发生错误时触发。 
// onloadeddata 事件在浏览器加载视频/音频（audio/video）当前帧时触发触发。 
// onloadedmetadata 事件在指定视频/音频（audio/video）的元数据加载后触发。 
// onloadstart 事件在浏览器开始寻找指定视频/音频（audio/video）触发。 
// onpause 事件在视频/音频（audio/video）暂停时触发。 
// onplaying 事件在视频/音频（audio/video）暂停或者在缓冲后准备重新开始播放时触发。 
// onprogress 事件在浏览器下载指定的视频/音频（audio/video）时触发。 
// onratechange 事件在视频/音频（audio/video）的播放速度发送改变时触发。 
// onseeked 事件在用户重新定位视频/音频（audio/video）的播放位置后触发。 
// onseeking 事件在用户开始重新定位视频/音频（audio/video）时触发。 
// onstalled 事件在浏览器获取媒体数据，但媒体数据不可用时触发。 
// onsuspend 事件在浏览器读取媒体数据中止时触发。 
// ontimeupdate 事件在当前的播放位置发送改变时触发。 
// onvolumechange 事件在音量发生改变时触发。 
// onwaiting 事件在视频由于要播放下一帧而需要缓冲时触发。

// function parseMusicList(list: any[], source: E_MUSIC_SOURCE) {
//     let newList: IMuisicInfo[] = []
//     if (!_.isArray(list)) {
//         return newList
//     }
//     newList = list.map(item => {
//         return parseMusicInfo(item, source)
//     })
//     return newList
// }

// function parseMusicInfo(item: any, source: E_MUSIC_SOURCE) {
//     let music: IMuisicInfo = { ...item }
//     if (source === E_MUSIC_SOURCE.zz123) {
//         music = {
//             id: item.id,
//             name: item.mname,
//             cover: item.pic,
//             src: item.mp3,
//             songer: item.sname,
//             time: item.play_time,
//             lyric: item.lrc
//         }
//     }
//     return music
// }

function parseSecondToMMSS(second: number) {
    const s = Math.ceil(second)
    const parseN = (n: number) => {
        const str = n < 10 ? `0${n}` : `${n}`
        return str
    }
    const mm = parseN(parseInt(`${s / 60}`)) // 分钟
    const ss = parseN(s % 60) // 秒
    return `${mm}:${ss}`
}
function Music() {
    const [list, setList] = useState<IMuisicInfo[]>([])
    const [playingMusic, setPlayingMusic] = useState<IMuisicInfo>()
    const [loading, setLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const musicInfoRef = useRef<HTMLDivElement>()
    const [playingListVisible, setPlayingListVisible] = useState(false)
    const [playingList, setPlayingList] = useState<IMuisicInfo[]>([])
    const [playingTime, setPlayingTime] = useState('00:00')
    const [playerStatus, setPlayerStatus] = useState<E_MUSIC_PLAYER_STATUS>(E_MUSIC_PLAYER_STATUS.NONE)
    const [loadingNextPage, setLoadingNextPage] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const musicContainerRef = useRef<HTMLDivElement>(null)
    const [musicContainerHeight, setMusicContainerHeight] = useState(() => {
        const root = document.querySelector('root')
        if (root) {
            return root.clientHeight
        }
        return 450
    })
    const instance = useRef({
        audioReady: false,
        lyricUtil,
        list,
        playingList,
        playingMusic,
        playType: E_MUSIC_PLAY_TYPE.LIST_LOOP, // 默认播放方式为列表循环
        tag: '', // 所选标签
        pager: {
            page: 1,
            pageSize: 0,
            isLastPage: false,
            keyword: '',
        }
    })

    function playMusic() {
        const audio = audioRef.current
        const {  playingMusic } = instance.current
        if (!audio || !playingMusic) {
            return
        }
        audio.play().catch((err) => {
            //
        })
        // instance.current.audioReady = false
        setPlayerStatus(E_MUSIC_PLAYER_STATUS.PLAYING)
    }

    function pauseMusic() {
        const audio = audioRef.current
        const {  playingMusic } = instance.current
        if (!audio || !playingMusic) {
            return
        }
        audio.pause()
        setPlayerStatus(E_MUSIC_PLAYER_STATUS.PAUSE)
    }

    function removeMusic() {
        const audio = audioRef.current
        if (!audio) {
            return
        }
        audio.src = ''
        setPlayerStatus(E_MUSIC_PLAYER_STATUS.NONE)
    }

    function updatePlayingList(music: IMuisicInfo, type: 'add' | 'remove' | 'update') {
        const list = [...instance.current.playingList]
        const index = list.findIndex(r => r.id === music?.id)
        if (type === 'add') {
            if (index > -1) {
                return
            }
            list.push(music)
        }
        else if (type === 'update') {
            if (index > -1) {
                list[index] = music
            } else {
                list.push(music)
            }
        } else if (type === 'remove') {
            list.splice(index, 1)
        }
        setPlayingList(list)
        instance.current.playingList = list
    }

    function getMusicInfoById(music: IMuisicInfo) {
        if (!!music.lyric) {
            return
        }
        console.log(`music SDKBox.get().musicService.getMusicInfoById id=${music?.id}`)
        SDKBox.get().musicService.getMusicInfoById(music?.id).then(data => {
            console.log(`music SDKBox.get().musicService.getMusicInfoById data=`, data)
            if (data?.success === 1 && data?.data) {
                setPlayingMusic((playingMusic) => {
                    const src = music?.src || data?.data?.src
                    if (!src) {
                        console.log('music getMusicInfoById music.src is error')
                        pauseMusic()
                        return playingMusic
                    }
                    const lyric: string = data?.data?.lyric || ''
                    initLyric(lyric)
                    const newPlayingMusic = { ...music, src, lyric } as IMuisicInfo
                    instance.current.playingMusic = newPlayingMusic
                    updatePlayingList(newPlayingMusic, 'update')
                    return newPlayingMusic
                })
            }
        })
    }

    function updateMusicList(list: IMuisicInfo[]) {
        setList(list)
        instance.current.list = list
    }

    function translateResponseToMusicList(data: any, concat = false) {
        const { pager } = instance.current
        const { page, pageSize } = pager
        if (page === 1) {
            setLoading(false)
        }
        if (data?.success === 1 && _.isArray(data.data)) {
            startTransition(() => {
                let list = _.isArray(data?.data) ? data.data : []
                if (concat) {
                    let newList: IMuisicInfo[] = []
                    newList = newList.concat(instance.current.list).concat(list)
                    list = newList
                }
                updateMusicList(list)
            })
            const currCount = data.data.length
            if (page === 1) {
                instance.current.pager.pageSize = currCount
            } else if (currCount < pageSize) {
                instance.current.pager.isLastPage = true
            }
        }
    }

    function onLoadData() {
        const { pager, tag } = instance.current
        const { page, isLastPage, keyword } = pager
        if (isLastPage && keyword) {
            return
        }
        instance.current.pager.page = page + 1
        setLoadingNextPage(true)
        if (keyword) {
            searchMusic(keyword, () => {
                setLoadingNextPage(false)
            })
            return
        }
        getMusicListByTag(tag, () => {
            setLoadingNextPage(false)
        })
    }

    function getMusicListByTag(tag: string, callback?: () => void) {
        const { pager } = instance.current
        const { page } = pager
        if (page === 1) {
            setLoading(true)
        }
        console.log(`music SDKBox.get().musicService.getListByTag tag=${tag},page=${page}`)
        SDKBox.get().musicService.getListByTag(tag, page).then((data) => {
            console.log(`music SDKBox.get().musicService.getListByTag data=`, data)
            translateResponseToMusicList(data, page > 1)
            isFunction(callback) && callback()
        })
    }

    function searchMusic(keyword: string, callback?: () => void) {
        const { pager } = instance.current
        const { page } = pager
        if (page === 1) {
            setLoading(true)
        }
        console.log(`music SDKBox.get().musicService.search keyword=${keyword},page=${page}`)
        SDKBox.get().musicService.search(keyword, page).then(data => {
            console.log('music SDKBox.get().musicService.search data=', data)
            translateResponseToMusicList(data, page > 1)
            isFunction(callback) && callback()
        })
    }

    const resetMusicList = useCallback(() => {
        updateMusicList([])
    }, [])

    const resetMusicListPager = useCallback(() => {
        instance.current.pager.isLastPage = false
        instance.current.pager.page = 1
    }, [])

    function initLyric(lrc: string) {
        // lyric.txt = lrc;
        // lyric. = ".lyric-panel";
        // lyric.lyricCSS = {"fontSize":"16px","marginTop":"15px","textAlign":"center"};
        // lyric.parse();

        lyricUtil.init(".lyric-panel", lrc)
        // lyric.play("01:20.22",{
        //     color:"red"
        // });
    }

    function playPrevMusic() {
        const { playingList, playingMusic } = instance.current
        const index = playingList.findIndex(r => r.id === playingMusic?.id)
        if (index === -1) {
            return
        }
        let prevIndex = index - 1
        if (index === 0) {
            prevIndex = playingList.length - 1
        }
        onPlayMusic(playingList[prevIndex])
    }

    function playNextMusic() {
        const { playingList, playingMusic } = instance.current
        const index = playingList.findIndex(r => r.id === playingMusic?.id)
        if (index === -1) {
            return
        }
        let nextIndex = index + 1
        if (index === playingList.length - 1) {
            nextIndex = 0
        }
        onPlayMusic(playingList[nextIndex])
    }

    function playRandomMusic() {
        const { playingList, playingMusic } = instance.current
        const index = playingList.findIndex(r => r.id === playingMusic?.id)
        if (index === -1) {
            return
        }
        const playListCount = playingList.length
        // 生成随机音乐的下标
        let nextIndex = Math.floor(Math.random() * playListCount)
        if (nextIndex < 0 || nextIndex > playListCount - 1) {
            nextIndex = 0
        }
        console.log(`music playRandomMusic index=${index},nextIndex=${nextIndex}`)
        onPlayMusic(playingList[nextIndex])
    }

    function updatePlayingMusic(playingMusic: IMuisicInfo | undefined) {
        setPlayingMusic(playingMusic)
        instance.current.playingMusic = playingMusic
    }

    function onPlayMusic(music: IMuisicInfo) {
        console.log('music onPlayMusic data=', music)
        const { playingMusic } = instance.current
        if (music?.id !== playingMusic?.id) {
            instance.current.lyricUtil.reset()
        }
        updatePlayingMusic(music)
        if (music?.src) {
            updatePlayingList(music, 'add')
            playMusic()
        } else {
            console.log('music onPlayMusic music.src is error')
        }
        getMusicInfoById(music)
    }

    function onCanPlay() {
        console.log('Audio.tsx audio onCanPlay')
        // instance.current.audioReady = true
        playMusic()
    }

    function onTimeUpdate() {
        const audio = audioRef.current
        if (!audio) {
            return
        }
        const currTime = audio.currentTime // 单位/s
        instance.current.lyricUtil.play(currTime)
        const mmss = parseSecondToMMSS(currTime)
        setPlayingTime(mmss)
        // console.log('Audio.tsx audio onTimeUpdate', currTime)
    }

    function onMusicListClick(music: IMuisicInfo, type: E_MUSIC_PLAYER_ACTION) {
        const { playingList } = instance.current
        if (type === E_MUSIC_PLAYER_ACTION.PLAY) {
            onPlayMusic(music)
            return
        }
        if (type === E_MUSIC_PLAYER_ACTION.ADD) {
            if (playingList.length === 0) {
                onPlayMusic(music)
                return
            }
            updatePlayingList(music, 'add')
            return
        }
        if (type === E_MUSIC_PLAYER_ACTION.REMOVE) {
            if (playingList.length === 1) {
                updatePlayingMusic(undefined)
                removeMusic()
            }
            updatePlayingList(music, 'remove')
            return
        }
    }

    function onMusicPlayerClick(type: E_MUSIC_PLAYER_ACTION) {
        if (type === E_MUSIC_PLAYER_ACTION.PLAY_LIST) {
            setPlayingListVisible(visible => !visible)
            return
        }

        if (type === E_MUSIC_PLAYER_ACTION.PLAY) {
            playMusic()
            return
        }

        if (type === E_MUSIC_PLAYER_ACTION.PAUSE) {
            pauseMusic()
            return
        }

        if (type === E_MUSIC_PLAYER_ACTION.PREV) {
            playPrevMusic()
            return
        }

        if (type === E_MUSIC_PLAYER_ACTION.NEXT) {
            playNextMusic()
            return
        }
    }

    function onMusicSearch() {
        const input = searchInputRef.current
        if (!input) {
            return
        }
        const { value } = input
        const keyword = value // todo 做字符处理
        instance.current.pager.keyword = keyword
        if (!keyword) {
            return
        }
        resetMusicList()
        resetMusicListPager()
        searchMusic(keyword)
    }

    function onPlayAll() {
        const { list, playingList } = instance.current
        const playList = [...playingList]
        if (_.isArray(list)) {
            list.forEach(music => {
                const index = playingList.findIndex(r => r.id === music?.id)
                if (index > -1) {
                    return
                }
                playList.push(music)
            })
            setPlayingList(playList)
            instance.current.playingList = playList
            if (playingList.length === 0) {
                onPlayMusic(playList[0])
            }
        }
    }

    function onMusicRefresh() {
        instance.current.pager.keyword = ''
        resetMusicList()
        resetMusicListPager()
        getMusicListByTag(instance.current.tag)
    }

    function onPlayTypeChange(type: E_MUSIC_PLAY_TYPE) {
        instance.current.playType = type
    }

    useAudioEvent(audioRef.current, 'ended', () => {
        instance.current.lyricUtil.reset()
        const { playType } = instance.current
        if (playType === E_MUSIC_PLAY_TYPE.SINGLE) {
            // 单曲循环
            console.log('Audio.tsx onEnded play loop')
            playMusic()
        } else if (playType === E_MUSIC_PLAY_TYPE.RANDOM) {
            // 列表随机播放
            console.log('Audio.tsx onEnded play random')
            playRandomMusic()
        } else {
            // 列表循环
            console.log('Audio.tsx onEnded play next')
            playNextMusic()
        }
    })

    useEffect(() => {
        const onClick = () => {
            //
        }
        document.body.addEventListener("click", onClick)
        return () => {
            document.body.removeEventListener("click", onClick)
            console.log('Audio.tsx remove event')
        }
    }, [])

    useEffect(() => {
        const musicListContainer = musicContainerRef.current
        if (musicListContainer) {
            const { clientHeight } = musicListContainer
            setMusicContainerHeight(clientHeight)
        }
        getMusicListByTag(instance.current.tag)
    }, [])

    return <div className="music-wrapper" ref={musicContainerRef}>
        <div className="music-left-container">
            <div className="music-header">
                <div className="music-source-container">
                    <div className="music-filter-container">
                        <div className="music-source">
                            <span>来源:</span>
                            <select>
                                <option>默认</option>
                                <option>百度音乐</option>
                                <option>网易云音乐</option>
                                <option>酷狗音乐</option>
                            </select>
                        </div>
                        <div className="music-tags">
                            <span>标签:</span>
                            <select>
                                <option>默认</option>
                                <option>抖音</option>
                                <option>其他</option>
                            </select>
                        </div>
                    </div>
                    <div className="music-heart">
                        <input type='checkbox' />
                        收藏列表
                    </div>
                    <div className="music-search-container">
                        <span className="music-list-search-input">
                            <input ref={searchInputRef} placeholder='输入歌曲名、歌手' />
                            <button className="music-list-action music-list-action-search" onClick={onMusicSearch} title='搜索'>
                                <img src='./static/images/audio-search.svg' />
                            </button>
                        </span>
                        <button className="music-list-action music-list-action-refresh" onClick={onMusicRefresh} title='刷新'>
                            <img src='./static/images/audio-refresh.svg' />
                        </button>
                        <button className="music-list-action music-list-action-play-all" onClick={onPlayAll} title={'播放全部'}>
                            <img src='./static/images/audio-play.svg' />
                        </button>
                    </div>
                </div>
            </div>
            <div className={classNames("music-list-content", { "music-list-loading": loading, "music-list-loading-next-page": loadingNextPage })}>
                <div className={classNames('music-list-loading-container', { hide: !(loading || loadingNextPage) })} >
                    <div className="music-list-loading">
                        <Loading loading={true} />
                    </div>
                </div>
                <MusicVirtualList height={musicContainerHeight - 80} list={list} playingMusic={playingMusic} onClick={onMusicListClick} onLoadData={onLoadData} />
            </div>
        </div>
        <div className="music-right-container">
            <div className={classNames("music-playing-container")}>
                <audio id="audio" ref={audioRef} preload={"auto"} data-id={playingMusic?.id} src={playingMusic?.src} onCanPlay={onCanPlay} onTimeUpdate={onTimeUpdate}>
                    对不起，您的浏览器不支持HTML5音频播放
                </audio>
                {!!playingMusic && <>
                    <div className="music-info-container" ref={musicInfoRef}>
                        <div className="music-info-cover">
                            <img src={playingMusic?.cover} />
                            <div className="music-info-detail">
                                <span>歌曲：{playingMusic?.name}</span>
                                <span>歌手：{playingMusic?.songer}</span>
                                <span>时长：{playingMusic?.time}</span>
                            </div>
                        </div>
                        <div className="music-info-lyric">
                            <div className="lyric-panel" style={{ height: "100%", overflow: "auto" }}></div>
                        </div>
                    </div>
                    <MusicPlayer music={playingMusic} playTime={playingTime} onClick={onMusicPlayerClick} status={playerStatus} playCount={playingList.length} onPlayTypeChange={onPlayTypeChange} />
                    <Portal target={musicInfoRef.current}>
                        <div className={classNames('music-play-list-container', { hide: !playingListVisible })} onClick={(e) => {
                            e.stopPropagation()
                        }}>
                            <div className="music-play-list">
                                <div className="music-play-list-header">
                                    <div className="music-play-list-title">
                                        播放列表({playingList.length})
                                    </div>

                                    <span className="music-play-list-close" onClick={(e) => {
                                        e.stopPropagation()
                                        setPlayingListVisible(false)
                                    }}><img src='./static/images/audio-close.svg' />
                                    </span>
                                </div>
                                <div className="music-play-list-content">
                                    <MusicVirtualList height={musicContainerHeight - 60 - 36} list={playingList} playingMusic={playingMusic} onClick={onMusicListClick} enableAdd={false} enableRemove={true} />
                                </div>
                            </div>
                        </div>
                    </Portal>
                </>}
            </div>
        </div>
    </div>
}

export default memo(Music)