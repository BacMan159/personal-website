import React, { useState, useRef } from 'react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.js'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useGlowAngle } from '../hooks/useGlowAngle.js'
import Reveal from '../components/Reveal.jsx'

const ENTRIES = [
    {
        company: 'Delta Airlines',
        role: 'Sr. Full Stack Developer',
        dates: 'Feb 2023 – Present',
        location: 'Boston, MA',
        bullets: [
            'Lead frontend modernization across Delta digital properties using Angular and React.',
            'Architected microservices on AWS (Lambda, API Gateway, DynamoDB) handling millions of daily transactions.',
            'Drove a 25-point lift in successful customer transactions through UX and performance work.',
        ],
    },
    {
        company: 'Deloitte',
        role: 'Sr. Java Developer',
        dates: 'Aug 2022 – Jan 2023',
        bullets: [
            'Built Spring Boot microservices for federal health initiatives.',
            'Designed event-driven Kafka pipelines for compliance reporting.',
        ],
    },
    {
        company: 'RiceFW Technologies',
        role: 'Java Developer',
        dates: 'Jul 2021 – Jul 2022',
        bullets: [
            'Delivered enterprise integrations using Java, Spring, and IBM MQ.',
            'Automated SFTP file pipelines processing 100k+ files daily.',
        ],
    },
    {
        company: 'Delta Airlines',
        role: 'Full Stack Developer',
        dates: 'Dec 2020 – Dec 2022',
        bullets: [
            'Shipped self-service tools used by airport operations teams.',
            'Migrated legacy on-prem services to AWS serverless.',
        ],
    },
    {
        company: 'CloudData Technology',
        role: 'Java Developer',
        dates: 'May 2021 – Feb 2022',
        bullets: [
            'Implemented data ingestion services across Redshift and DynamoDB.',
            'Optimized Java/Spring Boot batch jobs for nightly ETL.',
        ],
    },
    {
        company: 'Amazon',
        role: 'Software Development Engineer',
        dates: 'Jul 2019 – Sep 2019',
        bullets: [
            'Internship within the retail platform org.',
            'Built internal tooling consumed by tier-1 services.',
        ],
    },
    {
        company: 'JPMorgan Chase',
        role: 'Infrastructure Software Engineer',
        dates: 'Jul 2018 – Jul 2019',
        bullets: [
            'Built infrastructure automation for trading platforms.',
            'Worked across Java, Python, and Linux observability.',
        ],
    },
]

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
            className="card bl-card p-5 cursor-pointer text-left w-full"
        >
            <div className="glow" />
            <div className="relative z-10 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {entry.dates}
            </div>
            <div className="relative z-10 mt-1 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {entry.role}
            </div>
            <div className="relative z-10 mt-1 text-sm" style={{ color: 'var(--accent)' }}>
                {entry.company}
            </div>
        </motion.button>
    )
}

const Timeline = () => {
    const [open, setOpen] = useState(null)

    useBodyScrollLock(!!open)

    return (
        <section id="experience" className="bl-stage section-padding">
            <div className="max-w-6xl mx-auto">
                <Reveal as="h2" className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Experience
                </Reveal>
                <Reveal as="p" delay={0.05} className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
                    Click any role for details.
                </Reveal>

                <div className="flex flex-col gap-10">
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
                            <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                {open.dates} {open.location ? `· ${open.location}` : ''}
                            </div>
                            <h3 className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {open.role}
                            </h3>
                            <div className="mt-1 text-base" style={{ color: 'var(--accent)' }}>
                                {open.company}
                            </div>
                            <ul className="mt-5 space-y-2 list-disc pl-5" style={{ color: 'var(--text-secondary)' }}>
                                {open.bullets.map((b) => (
                                    <li key={b}>{b}</li>
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
