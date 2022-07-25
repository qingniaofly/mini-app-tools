import React, { memo, useEffect, useRef, useState } from 'react'
import ReactImageViewer from 'react-image-viewers'
import 'react-image-viewers/lib/esm/index.css'
import './index.scss'

function Image() {
    const reactImageViewerRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [imageList, setImageList] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [imageStyle, setImageStyle] = useState({})

    useEffect(() => {
        const reactImageViewer = reactImageViewerRef.current
        console.log('image container ', reactImageViewer)
        const imageList = ['https://www.2008php.com/2014_Website_appreciate/2014-02-15/20140215220958T7Vn1T7Vn1.jpg', 'https://lmg.jj20.com/up/allimg/1114/091920121117/200919121117-1-1200.jpg']
        setImageList(imageList)
        setImageUrl(imageList[0])
    }, [])

    return (
        <div className="image-container">
            <div className="image-tools-container">
                <button
                    onClick={() => {
                        setImageUrl(imageList[0])
                    }}
                >
                    上一张
                </button>
                <button
                    onClick={() => {
                        setImageUrl(imageList[1])
                    }}
                >
                    下一张
                </button>
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
            <div style={{ padding: 10 }}>{imageStyle && JSON.stringify(imageStyle)}</div>
            <div className="image-viewer">
                <ReactImageViewer
                    ref={reactImageViewerRef}
                    url={imageUrl}
                    isDebug={true}
                    timeout={5000}
                    onLoadStart={(url) => {
                        console.log(`ReactImageViewer Image LoadStart:: url=${url}`)
                        setLoading(true)
                    }}
                    onLoad={(image) => {
                        const { width, height } = image
                        console.log(`ReactImageViewer Image Load:: width=${width},height=${height}`)
                        setLoading(false)
                    }}
                    onLoadError={(err) => {
                        console.error(`ReactImageViewer Image LoadError:: error=${JSON.stringify(err)}`)
                        setLoading(false)
                    }}
                    onStyleChange={(opts) => {
                        console.log(`ReactImageViewer Image StyleChange:: options=${JSON.stringify(opts)}`)
                        setImageStyle(opts)
                    }}
                    config={{
                        perRotate: 10,
                        translateTouchType: 'mousewheel',
                    }}
                />
                {loading && (
                    <div className="image-loading-container">
                        <div className="image-loading">Loading...</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(Image)
