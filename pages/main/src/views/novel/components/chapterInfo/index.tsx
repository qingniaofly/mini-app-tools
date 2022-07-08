import { isFunction } from "lodash";
import React, { memo, useCallback } from "react";
import "./index.scss"

interface INovelChapterProps {
    chapterInfo: any
    onClick?: (type: string, url: string) => void
}

function NovelChapter(props: INovelChapterProps) {
    const { chapterInfo } = props

    const onClick = useCallback((type: string, url: string) => {
        isFunction(props.onClick) && props.onClick(type, url)
    }, [])

    return <div className="novel-chapter-container">
        <div className="novel-chapter-title">
            <h1>{chapterInfo?.title}</h1>
            <div className="btns">
                <span className="link" onClick={() => {
                    onClick('prev', chapterInfo?.prevUrl)
                }}>上一章</span>
                <span className="link" onClick={() => {
                    onClick('contents', chapterInfo?.contentsUrl)
                }}>目录</span>
                <span className="link" onClick={() => {
                    onClick('next', chapterInfo?.nextUrl)
                }}>下一章</span>
            </div>
        </div>
        <div className="novel-chapter">
            <div className="novel-chapter-content" dangerouslySetInnerHTML={{ __html: chapterInfo?.content }}>
            </div>
        </div>
    </div>
}

export default memo(NovelChapter)