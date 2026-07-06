import React, { useState, useRef } from 'react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.js'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useGlowAngle } from '../hooks/useGlowAngle.js'
import Reveal from '../components/Reveal.jsx'
import { expCards } from '../constants/index.js'

const splitTitle = (title) => {
    const [role, company] = title.split(' – ')
    return { role, company: company ?? '' }
}

const ENTRIES = expCards.map((c) => {
    const { role, company } = splitTitle(c.title)
    return {
        role,
        company,
        dates: c.date,
        review: c.review,
        logoPath: c.logoPath,
        bullets: c.responsibilities,
    }
})

const Card = ({ entry, onOpen }) => {
    const cardRef = useRef(null)
    const { ref: glowRef, onMouseMove } = useGlowAngle()

    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start end', 'end start'],
    })

    const x = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1],
        isSmallScreen ? [0, 0, 0, 0, 0] : [-240, -80, 0, -80, -240],
    )
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5, 0.7, 1],
        isSmallScreen ? [0, 1, 1, 1, 0] : [0, 0.35, 1, 0.35, 0],
    )
    const scale = useTransform(
        scrollYProgress,
        [0, 0.4, 0.5, 0.6, 1],
        isSmallScreen ? [1, 1, 1, 1, 1] : [0.88, 0.96, 1.06, 0.96, 0.88],
    )

    return (
        <motion.button
            type="button"
            ref={(el) => {
                cardRef.current = el
                glowRef.current = el
            }}
            style={{ x, opacity, scale }}
            onMouseMove={onMouseMove}
            onClick={() => onOpen(entry)}
            className="card bl-card p-4 cursor-pointer text-left w-full"
        >
            <div className="glow" />
            <div className="relative z-10 flex items-center gap-3.5">
                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bl-timeline-logo">
                    <img
                        src={entry.logoPath}
                        alt={`${entry.company} logo`}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {entry.role}
                    </div>
                    <div className="mt-0.5 text-sm truncate" style={{ color: 'var(--accent)' }}>
                        {entry.company}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-wider truncate" style={{ color: 'var(--text-muted)' }}>
                        {entry.dates}
                    </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 self-center" style={{ color: 'var(--text-muted)' }}>
                    <path d="M9 6l6 6-6 6" />
                </svg>
            </div>
        </motion.button>
    )
}

const Timeline = () => {
    const [open, setOpen] = useState(null)

    useBodyScrollLock(!!open)

    return (
        <section id="experience" className="bl-stage section-padding">
            <div className="max-w-6xl mx-auto min-w-0 w-full lg:flex lg:gap-12">
                <div className="mb-10 lg:mb-0 lg:shrink-0 lg:w-64">
                    <div className="flex justify-center md:justify-start lg:sticky lg:top-[50vh] lg:-translate-y-1/2">
                        <Reveal as="h2" className="bl-card !rounded-full inline-block px-8 py-3 md:px-10 md:py-4 text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Experience
                        </Reveal>
                    </div>
                </div>

                <div className="flex flex-col gap-10 lg:flex-1 lg:max-w-2xl">
                    {ENTRIES.map((e) => (
                        <Card key={`${e.company}-${e.dates}`} entry={e} onOpen={setOpen} />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setOpen(null)}
                        className="bl-modal-backdrop fixed inset-0 z-[300] flex items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bl-modal-panel p-6 md:p-8 max-w-2xl w-full relative max-h-[88vh] overflow-y-auto rounded-2xl"
                        >
                            <button
                                onClick={() => setOpen(null)}
                                className="bl-modal-close absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center text-2xl leading-none"
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <div className="flex items-start gap-4 pr-12">
                                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center overflow-hidden bl-timeline-logo">
                                    <img
                                        src={open.logoPath}
                                        alt={`${open.company} logo`}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-contain p-1.5"
                                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                        {open.dates}
                                    </div>
                                    <h3 className="mt-1 text-xl md:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {open.role}
                                    </h3>
                                    <div className="mt-0.5 text-base" style={{ color: 'var(--accent)' }}>
                                        {open.company}
                                    </div>
                                </div>
                            </div>

                            {open.review && (
                                <p className="mt-5 text-sm italic leading-relaxed border-l-2 pl-4" style={{ color: 'var(--text-secondary)', borderColor: 'var(--accent)' }}>
                                    {open.review}
                                </p>
                            )}

                            <ul className="mt-5 space-y-3">
                                {open.bullets.map((b) => (
                                    <li key={b} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Timeline
