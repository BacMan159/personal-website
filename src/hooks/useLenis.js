import { useEffect } from 'react'
import Lenis from 'lenis'

let lenisInstance = null

export const getLenis = () => lenisInstance

// Max scroll delta per wheel event — prevents fast trackpad/wheel flings
// from blowing past scroll-triggered animations.
const MAX_WHEEL_DELTA = 120

export const useLenis = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
        })
        lenisInstance = lenis

        const clampWheel = (e) => {
            if (Math.abs(e.deltaY) <= MAX_WHEEL_DELTA) return
            e.stopImmediatePropagation()
            e.preventDefault()
            const clamped = Math.sign(e.deltaY) * MAX_WHEEL_DELTA
            lenis.scrollTo(lenis.targetScroll + clamped, { immediate: false })
        }
        window.addEventListener('wheel', clampWheel, { capture: true, passive: false })

        let rafId
        const raf = (time) => {
            lenis.raf(time)
            rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)

        return () => {
            window.removeEventListener('wheel', clampWheel, { capture: true })
            cancelAnimationFrame(rafId)
            lenis.destroy()
            lenisInstance = null
        }
    }, [])
}
