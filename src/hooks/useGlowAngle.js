import { useRef, useCallback } from 'react'

/**
 * Tracks pointer angle relative to an element's center and writes it to
 * the `--start` CSS custom property on the host element (consumed by the
 * `.card::before` rule in index.css). Returns a ref + onMouseMove handler
 * to spread on any element.
 */
export function useGlowAngle() {
    const ref = useRef(null)
    const raf = useRef(null)

    const onMouseMove = useCallback((e) => {
        const node = ref.current
        if (!node) return
        if (raf.current) cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(() => {
            const rect = node.getBoundingClientRect()
            const mx = e.clientX - rect.left - rect.width / 2
            const my = e.clientY - rect.top - rect.height / 2
            let angle = Math.atan2(my, mx) * (180 / Math.PI)
            angle = (angle + 360) % 360
            node.style.setProperty('--start', String(angle + 60))
        })
    }, [])

    return { ref, onMouseMove }
}
