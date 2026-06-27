import React, { useEffect, useRef } from 'react'

const CustomCursor = () => {
    const dotRef = useRef(null)
    const target = useRef({ x: -100, y: -100 })
    const current = useRef({ x: -100, y: -100 })
    const rafRef = useRef(null)

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (window.matchMedia('(hover: none)').matches) return

        const onMove = (e) => {
            target.current.x = e.clientX
            target.current.y = e.clientY
        }
        window.addEventListener('mousemove', onMove)

        const lerp = (a, b, t) => a + (b - a) * t
        // 80ms lerp delay → ~0.2 per 16ms frame
        const tick = () => {
            current.current.x = lerp(current.current.x, target.current.x, 0.2)
            current.current.y = lerp(current.current.y, target.current.y, 0.2)
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`
            }
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)

        return () => {
            window.removeEventListener('mousemove', onMove)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return <div ref={dotRef} className="bl-cursor" />
}

export default CustomCursor
