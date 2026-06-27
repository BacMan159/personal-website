import React, { useEffect, useRef } from 'react'

const ScrollProgress = () => {
    const barRef = useRef(null)

    useEffect(() => {
        const update = () => {
            const h = document.documentElement
            const max = h.scrollHeight - h.clientHeight
            const p = max > 0 ? window.scrollY / max : 0
            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${p})`
            }
        }
        update()
        window.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            window.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [])

    return <div ref={barRef} className="bl-scroll-progress" style={{ width: '100%', transform: 'scaleX(0)' }} />
}

export default ScrollProgress
