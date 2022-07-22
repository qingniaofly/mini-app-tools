import React, { memo, useEffect, useRef } from 'react'
import ReactImageViewer from './ReactImageViewer'
import './index.scss'

function Image() {
    const reactImageViewerRef = useRef(null)

    useEffect(() => {
        const reactImageViewer = reactImageViewerRef.current
        console.log('image container ', reactImageViewer)
    }, [])

    return (
        <div className="image-container">
            <div className="image-tools-container">
                <button
                    onClick={() => {
                        reactImageViewerRef.current.setLarge()
                    }}
                >
                    放大
                </button>
                <button
                    onClick={() => {
                        reactImageViewerRef.current.setSmall()
                    }}
                >
                    缩小
                </button>
                <button
                    onClick={() => {
                        reactImageViewerRef.current.setReset()
                    }}
                >
                    还原
                </button>
                <button
                    onClick={() => {
                        reactImageViewerRef.current.setRotate()
                    }}
                >
                    旋转
                </button>
                <button>下载</button>
            </div>
            <ReactImageViewer ref={reactImageViewerRef} />
        </div>
    )
}

export default memo(Image)
