import { isFunction } from "lodash"
import { useEffect, useRef } from "react"

function useAudioEvent(audio: HTMLAudioElement | null, name: string, callback: () => void) {
    const fn = useRef(callback)
    fn.current = callback

    useEffect(() => {
        if (!audio) {
            return
        }
        const callback = () => {
            console.log(`useAudioEvent.ts calback ${name}`)
            isFunction(fn.current) && fn.current()
        }
        audio.addEventListener(name, callback)
    }, [audio, name])
}

export default useAudioEvent