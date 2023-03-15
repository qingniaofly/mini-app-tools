import { useRef, useEffect } from 'react'
import { ElectronBox } from '../SDK'

function useTask() {
    //任务进程窗口
    const win = useRef(null)
    useEffect(() => {
        begain()
        return () => {
            //页面销毁时，关闭任务进程
            closeArchiveRenderer()
        }
    }, [])

    //开始任务
    function begain() {
        listenIpcRenderer()
        createTaskWindow()
    }

    //创建隐藏window（任务进程）
    function createTaskWindow() {
        ElectronBox.get().eventService.sendSync('create-task-window', { type: 'task' })
    }

    //ipc通信监听
    function listenIpcRenderer() {
        const { eventService } = ElectronBox.get()
        //任务进程创建成功监听
        eventService.on('load-task-window-success', (event, arg) => {
            console.log(arg)
            if (arg) {
                event.reply('begain-task', {
                    //tag标记任务类型
                    tag: 'xxx',
                    //传给任务进程的数据
                    dataSource: ['123'],
                })
            }
        })

        //任务处理状态监听
        eventService.on('change-task-status', (event, arg) => {
            console.log(arg)
            if (arg.error) {
                console.log(arg.error)
                return
            }
            if (arg.status === 2) {
                //状态处理
            }
        })

        eventService.on('task-complete', (event, arg) => {
            //任务完成监听
            //关闭进程，移除监听，可根据需要放在合适的地方
            closeArchiveRenderer()
        })
    }

    //要在合适的时机把进程关闭，并移除监听
    function closeArchiveRenderer() {
        ElectronBox.get().eventService.sendSync('close-task-window', { type: 'task' })
    }
}

export default useTask