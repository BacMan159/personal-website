import { useEffect, useRef, useState } from 'react'

const PARTICLE_COUNT = 80
const ACCENT = 'var(--accent)'

const PageLoader = ({ onDone }) => {
    const canvasRef = useRef(null)
    const [progress, setProgress] = useState(0)
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        const start = performance.now()
        const DURATION = 1800
        let rafId
        const tick = (now) => {
            const t = Math.min(1, (now - start) / DURATION)
            const eased = 1 - Math.pow(1 - t, 3)
            setProgress(Math.floor(eased * 100))
            if (t < 1) {
                rafId = requestAnimationFrame(tick)
            } else {
                setTimeout(() => {
                    setHidden(true)
                    onDone?.()
                }, 200)
            }
        }
        rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafId)
    }, [onDone])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1

        const resize = () => {
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            ctx.scale(dpr, dpr)
        }
        resize()
        window.addEventListener('resize', resize)

        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            r: Math.random() * 1.8 + 0.6,
            a: Math.random() * 0.6 + 0.2,
        }))

        let rafId
        const draw = () => {
            const w = window.innerWidth
            const h = window.innerHeight
            ctx.clearRect(0, 0, w, h)

            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0 || p.x > w) p.vx *= -1
                if (p.y < 0 || p.y > h) p.vy *= -1
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(10, 132, 255, ${p.a})`
                ctx.fill()
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i]
                    const b = particles[j]
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const d2 = dx * dx + dy * dy
                    if (d2 < 120 * 120) {
                        const alpha = (1 - d2 / (120 * 120)) * 0.25
                        ctx.strokeStyle = `rgba(10, 132, 255, ${alpha})`
                        ctx.lineWidth = 0.5
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
            }

            rafId = requestAnimationFrame(draw)
        }
        rafId = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    if (hidden) return null

    return (
        <div
            className="fixed inset-0 z-[2000] flex flex-col items-center justify-center"
            style={{
                background: '#000',
                transition: 'opacity 0.4s ease',
                opacity: progress >= 100 ? 0 : 1,
                pointerEvents: progress >= 100 ? 'none' : 'auto',
            }}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="relative z-10 flex flex-col items-center">
                <div
                    className="text-5xl md:text-5xl tabular-nums"
                    style={{ color: ACCENT, textShadow: `0 0 24px ${ACCENT}` }}
                >
                    {progress}%
                </div>
                <div
                    className="mt-6 h-px"
                    style={{
                        width: 240,
                        background: 'rgba(255,255,255,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: ACCENT,
                            boxShadow: `0 0 10px ${ACCENT}`,
                            transition: 'width 0.1s linear',
                        }}
                    />
                </div>
                <p
                    className="mt-4 text-xs tracking-[0.3em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    Loading
                </p>
            </div>
        </div>
    )
}

export default PageLoader
