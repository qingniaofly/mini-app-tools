import { isFunction } from "lodash"
import React, { memo, useCallback } from "react"
import { E_MUSIC_PLAYER_ACTION, IMuisicInfo } from "../../types"
import "./index.scss"
import { VirtualList } from "../../../../components/virtualList/VirtualList";

interface IMusicListProps {
    playingMusic?: IMuisicInfo
    list: IMuisicInfo[]
    onClick: (music: IMuisicInfo, type: E_MUSIC_PLAYER_ACTION) => void
    enableAdd?: boolean
    enableRemove?: boolean
}

function MusicList(props: IMusicListProps) {
    const { list, playingMusic, enableAdd = true, enableRemove = false } = props
    const onClick = useCallback((music: IMuisicInfo, type: E_MUSIC_PLAYER_ACTION) => {
        isFunction(props.onClick) && props.onClick(music, type)
    }, [props.onClick])
    return <div className="music-list">
        {
            list.map((music, index) => {
                return <MusicItem key={index} music={music} playingMusic={playingMusic} onClick={onClick} enableAdd={enableAdd} enableRemove={enableRemove} />
            })
        }
    </div>
}

interface IMusicIItemProps {
    playingMusic?: IMuisicInfo
    music: IMuisicInfo
    onClick: (music: IMuisicInfo, type: E_MUSIC_PLAYER_ACTION) => void
    enableAdd?: boolean
    enableRemove?: boolean
}

function MusicItem(props: IMusicIItemProps) {
    const { music, playingMusic, enableAdd = true, enableRemove = false } = props
    const onClick = useCallback((music: IMuisicInfo, type: E_MUSIC_PLAYER_ACTION) => {
        isFunction(props.onClick) && props.onClick(music, type)
    }, [props.onClick])
    const isPlaying = playingMusic?.id === music.id
    return <div data-id={music.id} className="music-item">
        <img src={music.cover} width={32} height={32} className="music-cover" />
        {isPlaying && <img className="music-playing" src={"./static/images/audio-playing.svg"} />}
        <div className="music-info">
            <span className="music-name">{music.name}</span>
            <span className="music-songer">{music.songer}</span>
        </div>
        <div className="music-time">{music.time}</div>
        <div className="music-action">
            <img src='./static/images/audio-play.svg' title="播放" onClick={(e) => {
                e.stopPropagation()
                onClick(music, E_MUSIC_PLAYER_ACTION.PLAY)
            }} />
            {enableAdd && <img src='./static/images/audio-add.svg' title="添加到播放列表" onClick={(e) => {
                e.stopPropagation()
                onClick(music, E_MUSIC_PLAYER_ACTION.ADD)
            }} />}
            {enableRemove && <img src='./static/images/audio-trash.svg' title="删除" onClick={(e) => {
                e.stopPropagation()
                onClick(music, E_MUSIC_PLAYER_ACTION.REMOVE)
            }} />}
        </div>
    </div>
}

interface IMusicVirtualListProps extends IMusicListProps {
    height: number
    list: IMuisicInfo[]
    onLoadData?: () => void
}

export function MusicVirtualList(props: IMusicVirtualListProps) {
    const { list, height, ...args } = props
    return <VirtualList<IMuisicInfo>
        className={"music-list"}
        rowHeight={48}
        height={height || 400}
        bufferSize={15}
        list={list}
        onLoadData={props.onLoadData}
        rowRender={(data) => {
            const { index, item, style } = data
            if (!item) {
                return null
            }
            return <div key={index} style={style}>
                <MusicItem music={item} {...args} />
            </div>
        }}
    />
}
export default memo(MusicList)