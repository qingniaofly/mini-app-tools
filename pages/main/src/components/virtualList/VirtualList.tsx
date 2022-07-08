import React, { useCallback, useEffect, useRef, useState, useReducer } from "react"

export interface IVirtualListRowRenderProps<T> {
    index: number
    item: T
    style: React.CSSProperties
}

export interface IVirtualListProps<T> {
    id?: string
    className?: string
    rowHeight?: number // 每行的高度
    height: number // 滚动列表高度
    bufferSize?: number
    list: T[] // 数据
    width?: string 
    onLoadData?: () => void // 滚动到底部加载数据
    onScroll?: () => void // 滚动回调
    rowRender?: (data: IVirtualListRowRenderProps<T>) => React.ReactNode // 渲染每行节点
}

export interface IDefaultState<T> {
    total: number
    height: number
    rowHeight: number
    bufferSize: number
    limit: number
    originStartIdx: number
    startIndex: number
    endIndex: number
    timer?: NodeJS.Timer
    onLoadData?: () => void
    onScroll?: (e?: HTMLDivElement) => void
}

// 虚拟列表
export function VirtualList<T>(props: IVirtualListProps<T>): JSX.Element {
    const { id, className = "", height, list, width, rowHeight = 56, bufferSize = 30, onLoadData, rowRender } = props
    
    const instance = useRef<IDefaultState<T>>({
        total: 0, height: 0, rowHeight: 56,
        bufferSize: 30, limit: 0,
        originStartIdx: 0,
        startIndex: 0, endIndex: 0,
        timer: null,
        onLoadData,
        onScroll: props.onScroll
    })
    const scrollContainer = useRef<HTMLDivElement>(null)
    const [totalHeight, setTotalHeight] = useState<number>(0)
    const [scrollTop, setScrollTop] = useState<number>(0)
    useEffect(() => {
        instance.current.bufferSize = bufferSize
    }, [bufferSize])
    useEffect(() => {
        instance.current.rowHeight = rowHeight
    }, [rowHeight])
    useEffect(() => {
        instance.current.onScroll = props.onScroll
    }, [props.onScroll])
    useEffect(() => {
        instance.current.onLoadData = onLoadData
    }, [onLoadData])

    const forceUpdate = useReducer(v => !v)[1]

    useEffect(() => {
        if (!height) 
            return
        const { originStartIdx } = instance.current
        const { rowHeight, bufferSize, total } = instance.current
        const limit = Math.ceil(height / rowHeight)
        const startIndex = Math.max(originStartIdx - bufferSize, 0)
        instance.current.limit = limit
        instance.current.startIndex = startIndex
        // 初始化后，窗口放大or缩小了，高度改变，重置
        if (instance.current.height && instance.current.height !== height) {
            // originStartIdx = 0
            // const endIndex = Math.min(
            //     originStartIdx + limit + bufferSize,
            //     total - 1
            // )
            // instance.current.endIndex = endIndex
            const { scrollTop } = scrollContainer.current
            const currIndex = Math.floor(scrollTop / rowHeight)
            instance.current.originStartIdx = currIndex
            instance.current.startIndex = Math.max(currIndex - bufferSize, 0)
            instance.current.endIndex = Math.min(currIndex + limit + bufferSize, total - 1)
            // 执行更新
            // setScrollTop(scrollTop => {
            //     return scrollTop + 1
            // })
            forceUpdate()
        }
        instance.current.height = height
    }, [height])

    useEffect(() => {
        const total = list.length
        setTotalHeight(total * instance.current.rowHeight)
    }, [list.length])

    useEffect(() => {
        const { originStartIdx, bufferSize, limit } = instance.current
        const total = list.length
        // if (oldTotal === total) 
        //     return
        const endIndex = Math.min(
            originStartIdx + limit + bufferSize,
            total - 1
        )
        instance.current.endIndex = endIndex
        instance.current.total = total
        setTotalHeight(total * instance.current.rowHeight)
    }, [list])

    // 渲染每行
    const renderRow = useCallback((data: IVirtualListRowRenderProps<T>) => {
        return typeof rowRender === "function" && rowRender(data)
    }, [rowRender])

    // 滚动事件
    const onScroll = useCallback((e) => {
        if (e.target === scrollContainer.current) {
            const { clientHeight, scrollHeight, scrollTop } = e.target
            const { total, rowHeight, limit, originStartIdx, bufferSize, onLoadData, onScroll } = instance.current
            const currIndex = Math.floor(scrollTop / rowHeight)

            // 执行滚动回调
            if (typeof onScroll === "function") {
                onScroll(e)
            }
            // console.log("VirtualList.tsx onScroll", originStartIdx, currIndex)
            // 滚动到底部了,触发滚动回调，加载数据
            if (scrollTop + clientHeight >= scrollHeight && typeof onLoadData === "function") {
                onLoadData()
            }
            if (originStartIdx !== currIndex) {
                instance.current.originStartIdx = currIndex
                instance.current.startIndex = Math.max(currIndex - bufferSize, 0)
                instance.current.endIndex = Math.min(currIndex + limit + bufferSize, total - 1)
                // 执行更新
                // setScrollTop(scrollTop)
                forceUpdate()
            }
        }
    }, [])

    // 渲染显示的内容
    const renderDisplayContent = useCallback((list: T[]) => {
        const { rowHeight, startIndex, endIndex } = instance.current
        const content: React.ReactNode[] = []
        if (list.length === 0) 
            return content
        for (let i = startIndex; i <= endIndex; ++i) {
            const data: IVirtualListRowRenderProps<T> = {
                index: i,
                item: list[i],
                style: {
                    // height: `${rowHeight - 1  }px`,
                    // lineHeight: `${rowHeight  }px`,
                    left: 0,
                    right: 0,
                    position: "absolute",
                    top: i * rowHeight,
                    // width
                }
            }
            const row = renderRow(data)
            content.push(row)
        }
        return content
    }, [renderRow])

    const total = list.length
    return (
        <div
            id={id}
            ref={scrollContainer}
            className={`virtual-list ${className}`}
            style={{
                overflowX: "hidden",
                overflowY: "auto",
                height
            }}
            onScroll={onScroll}
        >
            <div style={{ height: total * instance.current.rowHeight, position: "relative" }} data-scrolltop={scrollTop}>
                {renderDisplayContent(list)}
            </div>
        </div>
    )
}