import React, { memo } from 'react'
import { useCallback } from 'react'
import _, { isFunction } from 'lodash'
import './index.scss'

interface INovelInfoProps {
    novelInfo?: any
    onClick?: (url: string) => void
    onDownload?: (url: string) => void
}

function NovelInfo(props: INovelInfoProps) {
    const { novelInfo } = props

    const onDownload = useCallback(
        (url: string) => {
            isFunction(props.onDownload) && props.onDownload(url)
        },
        [props.onDownload]
    )

    return (
        <div className="novel-info-container">
            <div className="novel-info">
                <span>小说详情：</span>
                <span>{novelInfo?.title}</span>
                <div className="novel-operate">
                    <table width={'50%'}>
                        <thead>
                            <tr>
                                <td align="center">共：{novelInfo?.chapterList.length}章</td>
                                <td align="center">{novelInfo?.author}</td>
                                <td align="center">
                                    <span
                                        className="electron-ui-link cursor-pointer"
                                        onClick={() => {
                                            onDownload(novelInfo?.url)
                                        }}
                                    >
                                        下载
                                    </span>
                                </td>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <div className="novel-chapter-list">
                <dl>
                    {novelInfo?.chapterList.map((chapter: any, index: number) => {
                        return (
                            <dd key={index}>
                                <span
                                    className="link"
                                    data-href={chapter.url}
                                    onClick={() => {
                                        isFunction(props.onClick) && props.onClick(chapter.url)
                                    }}
                                >
                                    {chapter.title}
                                </span>
                            </dd>
                        )
                    })}
                </dl>
            </div>
        </div>
    )
}

export default memo(NovelInfo)
