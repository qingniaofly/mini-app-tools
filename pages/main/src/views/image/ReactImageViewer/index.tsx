import React, { useEffect, useImperativeHandle, useRef } from 'react'
import './index.scss'

export interface IReactImageViewerProps {
    className?: string
}

function registerEvent(dom, name, fn) {
    if (dom.attachEvent) {
        dom.attachEvent('on' + name, fn)
    } else {
        dom.addEventListener(name, fn, false)
    }
}

function unregisterEvent(dom, name, fn) {
    if (dom.detachEvent) {
        dom.detachEvent('on' + name, fn)
    } else {
        dom.removeEventListener(name, fn, false)
    }
}

function loadImagePromise(url: string) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
            resolve(image)
        }
        image.onerror = reject
        image.src = url
    })
}

function parseNumber(n: number, l = 1) {
    let a = parseFloat(`${n}`)
    a = isNaN(a) ? 0 : a
    const b = a.toFixed(l)
    return parseFloat(b)
}

const styleUtil = {
    updateTransform: (dom: HTMLDivElement | HTMLImageElement, opt: { scale?: number; translateX?: number; translateY?: number; rotateZ?: number }) => {
        if (!dom || !dom?.style || !opt) {
            return
        }
        const transfromInfo = dom.style.transform || ''
        const transfromList = transfromInfo.split(' ')
        for (let key in opt) {
            const value = opt[key]
            if (typeof value !== 'number') {
                continue
            }
            const index = transfromList.findIndex((v) => v.indexOf(key) > -1)
            if (index > -1) {
                transfromList.splice(index, 1)
            }
            let str = ''
            switch (key) {
                case 'scale':
                    str = `scale(${(opt.scale, opt.scale)})`
                    break
                case 'translateX':
                    str = `translateX(${opt.translateX}px)`
                    break
                case 'translateY':
                    str = `translateY(${opt.translateY}px)`
                    break
                case 'rotateZ':
                    str = `rotateZ(${opt.rotateZ}deg)`
                default:
                    break
            }
            if (key) {
                transfromList.push(str)
            }
        }
        dom.style.transform = transfromList.join(' ')
    },
}

class ImageViewerUtil {
    private imageContainerNode: HTMLDivElement
    private imageNode: HTMLDivElement

    private imageEventX = 0 // 开始拖动图片时，鼠标的位置x
    private imageEventY = 0 // 开始拖动图片时，鼠标的位置y
    private canDragImage = 0 // 鼠标是在图片上，是否可以拖动
    private canMoveImage = 0 // 鼠标是在图片上按下，是否可以移动

    private config = {
        imageStyle: {
            scale: {
                defaultValue: 1,
                value: 1, // 当前缩放比例
                per: 0.15,
                min: 0.1,
                max: 20,
            },
            rotate: {
                defaultValue: 0,
                value: 0, // 当前旋转角度
                per: 90,
                min: 0,
                max: 360,
            },
        },
    }

    constructor({ imageContainerNode, imageNode }) {
        this.imageContainerNode = imageContainerNode
        this.imageNode = imageNode
        this.bindEvent()
    }

    private onDocumentMousewheel = (e) => {
        if (e.wheelDelta >= 1) {
            // 放大
            this.large()
        } else {
            // 缩小
            this.small()
        }
    }

    private onDocumentMouseDown = (e: React.MouseEvent) => {
        if (this.canDragImage) {
            this.canMoveImage = 1
            const event = window.event as any
            this.imageEventX = event.x
            this.imageEventY = event.y
        }
    }

    private onDocumentMouseMove = (e) => {
        e.preventDefault()
        if (this.canMoveImage) {
            const event = window.event as any
            const currEventX = event.x
            const currEventY = event.y
            const style = {
                translateX: currEventX - this.imageEventX,
                translateY: currEventY - this.imageEventY,
            }
            styleUtil.updateTransform(this.imageNode, { translateX: style.translateX, translateY: style.translateY })
        }
    }

    private onDocumentMouseUp = (e) => {
        this.canMoveImage = 0
    }

    private onImageMouseOver = (e) => {
        this.canDragImage = 1
    }

    private onImageMouseLeave = (e) => {
        e.preventDefault()
        this.canDragImage = 0
    }

    private bindEvent() {
        window.onresize = (e) => {
            //
        }
        registerEvent(document, 'mousewheel', this.onDocumentMousewheel)
        registerEvent(document, 'mousedown', this.onDocumentMouseDown)
        registerEvent(document, 'mousemove', this.onDocumentMouseMove)
        registerEvent(document, 'mouseup', this.onDocumentMouseUp)
        registerEvent(this.imageNode, 'mouseover', this.onImageMouseOver)
        registerEvent(this.imageNode, 'mouseleave', this.onImageMouseLeave)
    }

    private unbindEvent() {
        unregisterEvent(document, 'mousewheel', this.onDocumentMousewheel)
        unregisterEvent(document, 'mousedown', this.onDocumentMouseDown)
        unregisterEvent(document, 'mousemove', this.onDocumentMouseMove)
        unregisterEvent(document, 'mouseup', this.onDocumentMouseUp)
        unregisterEvent(this.imageNode, 'mouseover', this.onImageMouseOver)
        unregisterEvent(this.imageNode, 'mouseleave', this.onImageMouseLeave)
    }

    private getImageStyleConfig() {
        return this.config.imageStyle
    }

    private large() {
        const imageStyleConfig = this.getImageStyleConfig()
        const { per: scalePer, max: maxScale, value } = imageStyleConfig.scale
        let scale = parseNumber(value + scalePer)
        scale = scale > maxScale ? maxScale : scale
        this.updateScale(scale)
        styleUtil.updateTransform(this.imageNode, { scale })
    }

    private small() {
        const imageStyleConfig = this.getImageStyleConfig()
        const { per: scalePer, min: minScale, value } = imageStyleConfig.scale
        let scale = parseNumber(value - scalePer)
        scale = scale < minScale ? minScale : scale
        this.updateScale(scale)
        styleUtil.updateTransform(this.imageNode, { scale })
    }

    private updateScale(scale: number) {
        const imageStyleConfig = this.getImageStyleConfig()
        imageStyleConfig.scale.value = scale
        console.log('image scale', scale)
    }

    private updateRotate(rotate: number) {
        const imageStyleConfig = this.getImageStyleConfig()
        imageStyleConfig.rotate.value = rotate
        console.log('image rotate', rotate)
    }

    private reset() {
        const imageStyleConfig = this.getImageStyleConfig()
        const scale = imageStyleConfig.scale.defaultValue
        this.updateScale(scale)
        const rotate = imageStyleConfig.rotate.defaultValue
        this.updateRotate(rotate)
        styleUtil.updateTransform(this.imageNode, { scale, translateX: 0, translateY: 0 })
    }

    private rotate() {
        const { per: rotatePer, min: minRotate, max: maxRotate, value } = this.config.imageStyle.rotate
        let rotate = value + rotatePer
        if (rotate >= maxRotate) {
            rotate = minRotate
        }
        this.updateRotate(rotate)
        styleUtil.updateTransform(this.imageNode, { rotateZ: rotate })
    }

    setLarge() {
        // 放大
        this.large()
    }

    setSmall() {
        // 缩小
        this.small()
    }

    setReset() {
        // 重置
        this.reset()
    }

    setRotate() {
        // 旋转
        this.rotate()
    }

    destory() {
        this.imageContainerNode = null
        this.imageNode = null
        this.unbindEvent()
    }
}

const ReactImageViewer = React.forwardRef((props: IReactImageViewerProps, ref: any) => {
    const { className = '' } = props

    const imageContainerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const instance = useRef<{ imageViewerUtil: ImageViewerUtil }>({ imageViewerUtil: null })

    useEffect(() => {
        const imageContainer = imageContainerRef.current
        const image = imageRef.current
        const imageViewerUtil = new ImageViewerUtil({ imageContainerNode: imageContainer, imageNode: image })
        instance.current.imageViewerUtil = imageViewerUtil

        return () => {
            imageViewerUtil.destory()
        }
    }, [])

    useImperativeHandle(ref, () => ({
        container: null,
        setLarge: () => {
            instance.current.imageViewerUtil.setLarge()
        },
        setSmall: () => {
            instance.current.imageViewerUtil.setSmall()
        },
        setReset: () => {
            instance.current.imageViewerUtil.setReset()
        },
        setRotate: () => {
            instance.current.imageViewerUtil.setRotate()
        },
    }))

    return (
        <div className={`react-image-viewer-container ${className}`} ref={imageContainerRef}>
            <img ref={imageRef} className="react-image" src="https://www.2008php.com/2014_Website_appreciate/2014-02-15/20140215220958T7Vn1T7Vn1.jpg" />
        </div>
    )
})

export default ReactImageViewer
