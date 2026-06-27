import { useEffect } from 'react'
import { getLenis } from './useLenis.js'

export function useBodyScrollLock(active) {
    useEffect(() => {
        if (!active) return
        const lenis = getLenis()
        lenis?.stop()
        return () => { lenis?.start() }
    }, [active])
}
