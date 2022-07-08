import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes, useNavigate, useOutlet, Outlet, useLocation } from 'react-router-dom'
import { SDKBox } from '../../SDK'
import NovelList from './components/novelList'
import NovelInfo from './components/novelInfo'
import NovelChapter from './components/chapterInfo'
import RouteCache from '../../components/routeCache'

import './index.scss'

function Novel() {
    const location = useLocation()
    const outlet = useOutlet()
    const instance = useRef<Map<string, any>>(new Map())

    console.log('Novel', location, outlet)

    const { pathname } = location

    if (!instance.current.get(pathname)) {
        instance.current.set(pathname, outlet)
    }

    return (
        <div className="novel-content-container">
            {/* {
                instance.current.get(pathname)
            } */}
            <Outlet />
        </div>
    )
}

function NovelWrapper() {
    const [novelList, setNovelList] = useState<any[]>([])
    const [novelInfo, setNovelInfo] = useState<any>()
    const [novelChapterInfo, setNovelchapterInfo] = useState<any>()
    const instance = useRef({ keyword: '' })
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()

    const onTest1 = useCallback(() => {
        SDKBox.get()
            .novelService.search('', 1)
            .then((data) => {
                console.log(`Novel.tsx search data=`, data)
            })
    }, [])
    const onTest2 = useCallback(() => {
        SDKBox.get()
            .novelService.getList()
            .then((data) => {
                console.log(`Novel.tsx getList data=`, data)
            })
    }, [])
    function getNovelInfo(url: string) {
        SDKBox.get()
            .novelService.getChapterList(url)
            .then((data) => {
                console.log(`Novel.tsx getChapterList data=`, data)
                if (data && data?.success === 1) {
                    setNovelInfo(data.data)
                    navigate('/novel/info')
                }
            })
    }

    function getNovelChapterInfo(url: string) {
        SDKBox.get()
            .novelService.getChapterInfo(url)
            .then((data) => {
                console.log(`Novel.tsx getChapterInfo data=`, data)
                if (data && data?.success === 1) {
                    setNovelchapterInfo(data.data)
                    navigate('/novel/chapter')
                }
            })
    }

    function onNovelClick(url: string) {
        getNovelInfo(url)
    }

    function onNovelChapterClick(url: string) {
        getNovelChapterInfo(url)
    }

    function onChapterInfoClick(type: string, url: string) {
        if (type === 'contents' || url.indexOf('htm') === -1) {
            onNovelClick(url)
            return
        }
        onNovelChapterClick(url)
    }

    function onNovelDownload(url: string) {
        SDKBox.get()
            .novelService.download(url)
            .then((result) => {
                console.log(`Novel.tsx onNovelDownload data=`, result)
            })
    }

    function searchNovel() {
        const { keyword } = instance.current
        SDKBox.get()
            .novelService.search(keyword, 1)
            .then((data) => {
                console.log(`Novel.tsx search data=`, data)
                if (data && data.success === 1) {
                    setNovelList(data.data)
                }
            })
    }

    function onSearch() {
        if (!inputRef.current) {
            return
        }
        const { value } = inputRef.current
        const keyword = value
        instance.current.keyword = keyword
        if (!keyword) {
            getList()
            return
        }
        searchNovel()
    }

    const getList = useCallback(() => {
        SDKBox.get()
            .novelService.getList()
            .then((data) => {
                console.log(`Novel.tsx getList data=`, data)
                if (data && data.success === 1) {
                    setNovelList(data.data)
                }
            })
    }, [])

    useEffect(() => {
        getList()
    }, [])

    return (
        <div className="novel-wrapper">
            <div className="novel-filer-container">
                <div className="novel-source">
                    <span>来源:</span>
                    <select>
                        <option>笔趣阁</option>
                        <option>顶点</option>
                    </select>
                </div>
                <div className="novel-search">
                    <input ref={inputRef} />
                    <button onClick={onSearch}>搜索</button>
                    <span
                        className="electron-ui-link cursor-pointer"
                        onClick={() => {
                            navigate('/novel')
                        }}
                    >
                        小说列表
                    </span>
                </div>
            </div>
            <Routes>
                <Route path={`/`} element={<Novel />}>
                    <Route path={``} element={<NovelList list={novelList} onClick={onNovelClick} />}></Route>
                    <Route path={`chapter`} element={<NovelChapter chapterInfo={novelChapterInfo} onClick={onChapterInfoClick} />} />
                    <Route path={`info`} element={<NovelInfo novelInfo={novelInfo} onClick={onNovelChapterClick} onDownload={onNovelDownload} />} />
                </Route>
            </Routes>
        </div>
    )
}

export default memo(NovelWrapper)
