import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { storeAction } from './store/actions'
import { SDKBox, ElectronBox } from './SDK'
import Music from './views/music'
import Novel from './views/novel'
import Image from './views/image'
import { IRootState } from './store/type'
import './style/common.scss'
import '@babel/polyfill'
import useTask from './hooks/useWorker'
import useKeyboardEvent from './hooks/useKeyboardEvent'
import windowUtil from './SDK/window'

const Home = () => {
    const dispatch = useDispatch()
    const [msg, setMsg] = useState('')
    useEffect(() => {
        ElectronBox.get().eventService.on('message-to-renderer', (_, args) => {
            console.log('render:', args)
            setMsg(args)
        })

        setTimeout(() => {
            dispatch(storeAction.test('小王12'))
        }, 3000)
    }, [])
    return (
        <div>
            hello world
            <button
                onClick={() => {
                    windowUtil.open('/worker.html', { winId: 'worker', aaa: 123 })
                }}
            >
                打开worker
            </button>
            <button
                onClick={() => {
                    ElectronBox.get().eventService.send('message-from-renderer', { type: 'render', data: `from-renderer:${new Date().getTime()}` })
                }}
            >
                发消息
            </button>
            {JSON.stringify(msg)}
        </div>
    )
}

const routeConfig = [
    {
        path: 'about',
        element: <Music />,
        cache: false,
    },
    {
        path: 'music',
        element: <Music />,
        cache: false,
    },
    {
        path: 'novel',
        element: <Novel />,
        cache: false,
    },
    {
        path: '/',
        element: <Home />,
        cache: false,
    },
]

function MainRoute() {
    const location = useLocation()
    const { pathname } = location

    console.log(`MainRoute pathname=${pathname}`)

    const cacheRoutes = routeConfig.filter((r) => r.cache)
    const routes = routeConfig.filter((r) => !r.cache)
    return (
        <>
            {cacheRoutes.map((r, index) => {
                const visible = pathname.indexOf(r.path) > -1
                return (
                    <div key={index} style={{ display: visible ? '' : 'none' }}>
                        {r.element}
                    </div>
                )
            })}
            {
                <Routes>
                    {routes.map((r, index) => {
                        return <Route key={index} path={r.path} element={r.element} />
                    })}
                </Routes>
            }
        </>
    )
}

const About = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        setTimeout(() => {
            dispatch(storeAction.test('小张'))
        }, 3000)
    }, [])
    return <div>About</div>
}

const App = () => {
    const { test } = useSelector((state: IRootState) => state)
    const navigate = useNavigate()

    // const onTest = useCallback(async () => {
    //     SDKBox.get().musicService.getListByTag().then((data) => {
    //         console.log(`getListByTag data=${JSON.stringify(data)}`)
    //     })
    // }, [])

    // const onTest2 = useCallback(async () => {
    //     SDKBox.get().musicService.getMusicInfoById('dmxzz').then((data) => {
    //         console.log(`getMusicInfoById data=${JSON.stringify(data)}`)
    //     })
    // }, [])

    useKeyboardEvent()
    useTask()

    useEffect(() => {
        ElectronBox.get().eventService.on('crash-file-path', (event, args) => {
            console.warn('crash-file-path:', args)
        })

        const onRouteChange = (_, data) => {
            console.log(`E_GLOBAL_EVENT.ROUTE_CHANGE data=${JSON.stringify(data)}`)
            navigate(data?.url)
        }
        const removeRouteChange = SDKBox.get().routeService.onRouteChange(onRouteChange)

        return () => {
            removeRouteChange()
        }
    }, [])
    return (
        <div data-test={test} className="app-wrapper allow-select-text" style={{ width: '100%', height: '100%' }}>
            <Routes>
                <Route path={`about`} element={<About />} />
                <Route path={`image`} element={<Image />} />
                <Route path={`music`} element={<Music />} />
                <Route path={`/novel/*`} element={<Novel />}></Route>
                <Route path={`/`} element={<Home />} />
            </Routes>
            {/* <div className="subapp" id="subapp"></div> */}
        </div>
    )
}

export default App
