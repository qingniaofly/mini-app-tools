import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import { HashRouter } from 'react-router-dom'
const { ipcRenderer } = window.require('electron')
import './style/common.scss'
import './worker.less'
import useKeyboardEvent from './hooks/useKeyboardEvent'

function Task() {
    const [inputMessageList, setInputMessageList] = useState([])
    const [outputMessageList, setOutputMessageList] = useState([])
    useKeyboardEvent()
    useEffect(() => {
        ipcRenderer.on('message-from-main', (event, args) => {
            console.info('worker:', args)
            setInputMessageList((list) => list.concat([args]))
            setTimeout(() => {
                const res = { timestamp: new Date().getTime(), ...args }
                ipcRenderer.send('message-from-worker', res)
                setOutputMessageList((list) => list.concat([args]))
            }, 3000)
        })
        ipcRenderer.on('begain-task', (event, arg) => {
            // 根据tag判断任务类型
            if (arg.tag === 'xxxx') {
                console.log(arg.dataSource)
                //任务处理TODO
                // xxxx()
                //以下代码可根据需要放在合适的位置
                //如果处理状态有变化则发送变化通知
                ipcRenderer.send('change-task-status', { data: 'change-task-status' })

                //如果任务处理完成，则发送完成通知
                ipcRenderer.send('task-complete', { data: '' })
            }
        })
        ipcRenderer.send('window-load-success', true)
        return () => {
            ipcRenderer.removeAllListeners()
        }
    }, [])
    return (
        <div className="worker-container allow-select-text">
            <div className="message-list">
                <div className="left">
                    {inputMessageList.map((r, i) => {
                        return (
                            <div key={i} className="message">
                                req:{JSON.stringify(r)}
                            </div>
                        )
                    })}
                </div>
                <div className="right">
                    {outputMessageList.map((r, i) => {
                        return (
                            <div key={i} className="message">
                                res:{JSON.stringify(r)}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const container = document.getElementById('root') as HTMLDivElement
const root = ReactDOM.createRoot(container)
const render = (Component: React.FC): void => {
    root.render(
        <Provider store={store}>
            <HashRouter>
                <Component />
            </HashRouter>
        </Provider>
    )
}
render(Task)
