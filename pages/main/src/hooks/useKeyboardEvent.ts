import React, { useEffect } from 'react'
import { ElectronBox } from '../SDK'

function useKeyboardEvent() {
    useEffect(() => {
        // function parseEventParams(e) {
        //     const { type, key, keyCode, which } = e
        //     const params = { type, key, keyCode, which }
        //     return JSON.stringify(params)
        // }
        // const listener = (e) => {
        //     // 键盘事件
        //     if (e.type === 'keydown' || e.type === 'keyup') {
        //         ElectronBox.get().eventService.sendSync('Events_Keyboard', parseEventParams(e))
        //     }
        // }
        // document.addEventListener('keydown', listener)
        // document.addEventListener('keyup', listener)
        // return () => {
        //     document.removeEventListener('keydown', listener)
        //     document.removeEventListener('keyup', listener)
        // }
    }, [])
}
export default useKeyboardEvent
