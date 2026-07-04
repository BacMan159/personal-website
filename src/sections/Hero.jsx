import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBacManChat } from '../hooks/useBacManChat.js'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.js'
import { useGlowAngle } from '../hooks/useGlowAngle.js'

const StatCard = ({ s }) => {
    const { ref, onMouseMove } = useGlowAngle()
    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="card bl-card p-6"
        >
            <div className="glow" />
            <div className="relative z-10 font-bold" style={{ fontSize: '40px', color: 'var(--text-primary)' }}>
                {s.value}
            </div>
            <div className="relative z-10 mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {s.label}
            </div>
        </motion.div>
    )
}

const STATS = [
    { value: '8+', label: 'Years' },
    { value: '6', label: 'Domains' },
    { value: '8', label: 'Clients' },
    { value: '100%', label: 'Satisfaction' },
]

const Hero = () => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [currentQ, setCurrentQ] = useState(null)
    const { answer, streaming, error, send, reset } = useBacManChat()
    const prevStreamingRef = useRef(false)
    const scrollRef = useRef(null)

    const showModal = !!currentQ || messages.length > 0

    useEffect(() => {
        if (prevStreamingRef.current && !streaming && currentQ) {
            setMessages((m) => [...m, { q: currentQ, a: answer, error }])
            setCurrentQ(null)
        }
        prevStreamingRef.current = streaming
    }, [streaming, currentQ, answer, error])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, currentQ, answer, streaming])

    useBodyScrollLock(showModal)

    useEffect(() => {
        if (!showModal) return
        const onKey = (e) => { if (e.key === 'Escape') closeChat() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal])

    const onSubmit = (e) => {
        e.preventDefault()
        const q = input.trim()
        if (!q || streaming) return
        const history = messages.flatMap((m) => [
            { role: 'user', content: m.q },
            { role: 'assistant', content: m.a || '' },
        ])
        setCurrentQ(q)
        setInput('')
        send(q, history)
    }

    const closeChat = () => {
        reset()
        setMessages([])
        setCurrentQ(null)
        setInput('')
    }

    return (
        <section id="hero" className="relative bl-stage">
            <div className="min-h-screen flex flex-col items-center justify-center px-5 md:px-10">
              <div className="bl-frosted bl-frosted-circle w-full max-w-2xl px-10 md:px-16 flex flex-col items-center justify-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="font-bold"
                    style={{ fontSize: 'clamp(48px, 7vw, 80px)', lineHeight: 1.05, color: 'var(--text-primary)' }}
                >
                    Hi, I'm <span style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>Bhasanth</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                    className="mt-4 text-base"
                    style={{ letterSpacing: '0.12em' }}
                >
                    Senior Full Stack Developer <span style={{ color: 'var(--accent)'}}>/</span> AI Engineer
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                    className="mt-12 w-full max-w-2xl"
                >
                    <form onSubmit={onSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Bac-Man about Bhasanth..."
                            className="flex-1 px-4 py-3 rounded-full outline-none"
                            disabled={streaming}
                        />
                        <button
                            type="submit"
                            disabled={streaming || !input.trim()}
                            className="px-5 py-3 rounded-full font-semibold disabled:opacity-50"
                            style={{ background: 'var(--accent)', color: '#fff' }}
                        >
                            Ask
                        </button>
                    </form>
                </motion.div>
              </div>
            </div>

            <div className="min-h-screen flex flex-col items-center justify-center px-5 md:px-10 pb-20">
              <div className="bl-frosted w-full max-w-5xl px-6 md:px-10 py-10 md:py-14 flex flex-col items-center text-center">

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full"> 
                      {STATS.map((s) => (
                          <StatCard key={s.label} s={s} />
                      ))}
                  </div>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-12 max-w-3xl text-base md:text-lg"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <>Senior Full Stack Developer with 8+ years building scalable, cloud-native applications across</>
                    aviation, healthcare, e-commerce, and finance. Currently focused on AI agent systems, RAG
                    architectures, and shipping production-ready experiences end-to-end.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-3"
                >
                    <a
                        href="/Bhasanth_Lakkaraju_Resume.pdf"
                        download
                        className="bl-cta gap-2"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download Resume
                    </a>
                </motion.div>
              </div>
            </div>

            {createPortal(
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            key="bacman-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={closeChat}
                            className="bl-modal-backdrop fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6"
                        >
                            <motion.div
                                key="bacman-panel"
                                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                onClick={(e) => e.stopPropagation()}
                                className="bl-modal-panel relative w-full max-w-2xl flex flex-col rounded-[28px]"
                                style={{ height: 'min(80vh, 720px)' }}
                            >
                                <div className="bl-modal-header flex items-center justify-between px-5 md:px-6 py-4 flex-shrink-0 rounded-t-[28px]">
                                    <h3 className="text-base md:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        Chat with <span style={{ color: 'var(--accent)' }}>Bac-Man</span>
                                    </h3>
                                    <button
                                        onClick={closeChat}
                                        aria-label="Close chat"
                                        className="bl-modal-close w-9 h-9 rounded-full flex items-center justify-center text-xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div
                                    ref={scrollRef}
                                    data-lenis-prevent
                                    className="flex-1 overflow-y-auto px-5 md:px-6 py-5 flex flex-col gap-4"
                                >
                                    {messages.map((m, i) => (
                                        <ChatTurn key={i} q={m.q} a={m.a} error={m.error} streaming={false} />
                                    ))}
                                    {currentQ && (
                                        <ChatTurn q={currentQ} a={answer} error={error} streaming={streaming} />
                                    )}
                                </div>

                                <form
                                    onSubmit={onSubmit}
                                    className="flex items-center gap-2 px-5 md:px-6 py-4 flex-shrink-0"
                                    style={{ borderTop: '1px solid var(--border-base)' }}
                                >
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask a follow-up..."
                                        className="flex-1 px-4 py-3 rounded-full outline-none"
                                        disabled={streaming}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={streaming || !input.trim()}
                                        className="px-5 py-3 rounded-full font-semibold disabled:opacity-50"
                                        style={{ background: 'var(--accent)', color: '#fff' }}
                                    >
                                        Ask
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    )
}

const ChatTurn = ({ q, a, error, streaming }) => (
    <div className="flex flex-col gap-2">
        <div className="bl-chat-bubble-user self-end max-w-[85%] rounded-2xl px-4 py-2.5 text-sm">
            {q}
        </div>
        <div className="bl-chat-bubble-assistant self-start max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed">
            {error ? (
                <span style={{ color: 'var(--accent)' }}>{error}</span>
            ) : (
                <span style={{ whiteSpace: 'pre-wrap' }}>{a}</span>
            )}
            {streaming && (
                <span className="inline-flex items-center ml-2 align-middle">
                    <span className="bl-streaming-dot" />
                </span>
            )}
        </div>
    </div>
)

export default Hero
