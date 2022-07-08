import classNames from "classnames"
import { isFunction } from "lodash"
import React, { memo, useCallback, useState } from "react"
import { E_MUSIC_PLAYER_ACTION, E_MUSIC_PLAYER_STATUS, E_MUSIC_PLAY_TYPE, IMuisicInfo } from "../../types"
import "./index.scss"

interface IMusicPlayerProps {
    music: IMuisicInfo
    playTime: string
    onClick: (type: E_MUSIC_PLAYER_ACTION) => void
    playCount: number
    status: E_MUSIC_PLAYER_STATUS
    onPlayTypeChange?: (type: E_MUSIC_PLAY_TYPE) => void
}

function MusicPlayer(props: IMusicPlayerProps) {
    const { music, playTime, playCount, status, onPlayTypeChange } = props
    const [playType, setPlayType] = useState<E_MUSIC_PLAY_TYPE>(E_MUSIC_PLAY_TYPE.LIST_LOOP)
    const onClick = useCallback((type: E_MUSIC_PLAYER_ACTION) => {
        isFunction(props.onClick) && props.onClick(type)
    }, [])

    const onPlayTypeClick = useCallback(() => {
        let type = playType
        if (playType === E_MUSIC_PLAY_TYPE.LIST_LOOP) {
            type = E_MUSIC_PLAY_TYPE.RANDOM
        } else if (playType === E_MUSIC_PLAY_TYPE.RANDOM) {
            type = E_MUSIC_PLAY_TYPE.SINGLE
        } else {
            type = E_MUSIC_PLAY_TYPE.LIST_LOOP
        }
        setPlayType(type)
        isFunction(onPlayTypeChange) && onPlayTypeChange(type)
    }, [playType, onPlayTypeChange])

    return <div className="music-palyer-container">
        <img className="music-player-cover" src={music?.cover} />
        <div className="music-count-down">{playTime}</div>
        <div className="music-player">
            <div className="music-prev" title={"上一首"} onClick={() => {
                onClick(E_MUSIC_PLAYER_ACTION.PREV)
            }}>
                <img src='./static/images/audio-prev-circle.svg' />
            </div>
            <div className={classNames('music-play', { hide: status === E_MUSIC_PLAYER_STATUS.PLAYING })} title={'播放'} onClick={() => {
                onClick(E_MUSIC_PLAYER_ACTION.PLAY)
            }}>
                <img src='./static/images/audio-playing-circle.svg' />
            </div>
            <div className={classNames('music-pause', { hide: status !== E_MUSIC_PLAYER_STATUS.PLAYING })} title={'暂停'} onClick={() => {
                onClick(E_MUSIC_PLAYER_ACTION.PAUSE)
            }}>
                <img src='./static/images/audio-pause-circle.svg' />
            </div>
            <div className="music-next" title={"下一首"} onClick={() => {
                onClick(E_MUSIC_PLAYER_ACTION.NEXT)
            }}>
                <img src='./static/images/audio-next-circle.svg' />
            </div>
        </div>
        <div className="music-play-type" onClick={onPlayTypeClick}>
            {
                playType === E_MUSIC_PLAY_TYPE.LIST_LOOP && <img title="列表循环" src='./static/images/audio-play-list-loop-active.svg' />
            }
            {
                playType === E_MUSIC_PLAY_TYPE.RANDOM && <img title="随机播放" src='./static/images/audio-play-random-active.svg' />
            }
            {
                playType === E_MUSIC_PLAY_TYPE.SINGLE && <img title="单曲循环" src='./static/images/audio-play-single-active.svg' />
            }
        </div>
        <div className="music-player-list" onClick={() => {
            onClick(E_MUSIC_PLAYER_ACTION.PLAY_LIST)
        }} title='播放列表'>
            <img src='./static/images/audio-play-list.svg' />
            <span className="music-play-list-count">{playCount}</span>
        </div>
    </div>
}

export default memo(MusicPlayer)