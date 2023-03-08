import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { storeAction } from './store/actions'
import { SDKBox } from './SDK'
import Music from './views/music'
import Novel from './views/novel'
import Image from './views/image'
import { IRootState } from './store/type'
import './style/common.scss'
import '@babel/polyfill'

const Home = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        setTimeout(() => {
            dispatch(storeAction.test('小王12'))
        }, 3000)
    }, [])
    return <div>hello world</div>
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

    useEffect(() => {
        
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
