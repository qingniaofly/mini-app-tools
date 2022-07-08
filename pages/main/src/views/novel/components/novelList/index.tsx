import { isFunction } from "lodash";
import React, { memo } from "react";
import "./index.scss"

interface INovelListProps {
    list: any[]
    onClick?: (url: string) => void
}

function NovelList(props: INovelListProps) {
    const { list } = props
    return <div className="novel-list-container">
        <h2>小说大全</h2>
        <div className="novel-list">
            <ul>
                {list.map((novel, index) => {
                    return (
                        <li key={index}>
                            <span className="link" data-href={novel.url} onClick={() => {
                                isFunction(props.onClick) && props.onClick(novel.url)
                            }}>{novel.title}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    </div>
}

export default memo(NovelList)