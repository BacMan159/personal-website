import React, { lazy, Suspense, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGlowAngle } from '../hooks/useGlowAngle.js'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.js'
import Reveal from '../components/Reveal.jsx'

const EASArchitecture = lazy(() => import('../components/EASArchitecture.jsx'))

const ProjectCard = ({ p, i, onClick }) => {
    const { ref, onMouseMove } = useGlowAngle()
    const featured = !!p.featured
    const clickable = !!onClick
    return (
        <motion.article
            ref={ref}
            onMouseMove={onMouseMove}
            onClick={onClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            viewport={{ margin: '-10% 0px -20% 0px', amount: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
            className={`card bl-card flex flex-col ${featured ? 'md:col-span-2 p-8 md:p-10' : 'p-6'} ${clickable ? 'cursor-pointer' : ''}`}
        >
            <div className="glow" />
            {featured && (
                <span
                    className="relative z-10 self-start mb-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
                    style={{ background: 'rgba(10,132,255,0.15)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                >
                    ★ Featured
                </span>
            )}
            <h3
                className={`relative z-10 font-semibold ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}
                style={{ color: 'var(--text-primary)' }}
            >
                {p.name}
            </h3>
            <p
                className={`relative z-10 mt-2 leading-relaxed ${featured ? 'text-base md:text-lg max-w-3xl' : 'text-sm'}`}
                style={{ color: 'var(--text-secondary)' }}
            >
                {p.desc}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                {p.stack.map((s) => (
                    <span key={s} className="bl-pill">
                        {s}
                    </span>
                ))}
            </div>
            {clickable && (
                <div className="relative z-10 mt-4 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    View architecture →
                </div>
            )}
        </motion.article>
    )
}

const PROJECTS = [
    {
        name: 'EAS-001 Patent System',
        stack: ['TypeScript', 'React', 'FastAPI', 'Python', 'HuggingFace'],
        desc: 'Enterprise patent workflow platform with role-based review pipelines, audit trails, and document versioning. Production system serving USPTO-adjacent workflows end-to-end.',
        featured: true,
        modal: 'eas',
    },
    {
        name: 'Bac-Man RAG Chatbot',
        stack: ['React', 'Vite', 'Node.js', 'AWS Bedrock', 'S3 Vectors', 'SSE'],
        desc: 'Personal AI assistant streaming responses over SSE, backed by a custom retrieval pipeline grounded in my résumé and projects.',
    },
    {
        name: 'Earnings Call Intelligence Platform',
        stack: ['React', 'Node.js', 'Express', 'AWS Bedrock', 'DynamoDB', 'S3'],
        desc: 'Multi-agent workflow that ingests S&P 500 earnings calls, extracts thematic signals, and generates analyst-grade summaries.',
    },
]

const Projects = () => {
    const [showEAS, setShowEAS] = useState(false)
    useBodyScrollLock(showEAS)

    useEffect(() => {
        if (!showEAS) return
        const onKey = (e) => { if (e.key === 'Escape') setShowEAS(false) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [showEAS])

    return (
        <section id="projects" className="bl-stage section-padding">
            <div className="max-w-6xl mx-auto">
                <Reveal as="h2" className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Projects
                </Reveal>
                <Reveal as="p" delay={0.05} className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
                    Selected things I've built.
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PROJECTS.map((p, i) => (
                        <ProjectCard
                            key={p.name}
                            p={p}
                            i={i}
                            onClick={p.modal === 'eas' ? () => setShowEAS(true) : undefined}
                        />
                    ))}
                </div>
            </div>

            {createPortal(
                <AnimatePresence>
                    {showEAS && (
                        <motion.div
                            key="eas-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setShowEAS(false)}
                            className="bl-modal-backdrop fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                onClick={(e) => e.stopPropagation()}
                                className="bl-modal-panel relative w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden rounded-2xl"
                            >
                                <div className="bl-modal-header flex items-center justify-between px-5 md:px-6 py-3 md:py-4 flex-shrink-0">
                                    <h3
                                        className="text-base md:text-lg font-semibold truncate"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        EAS-001 Patent System · Architecture
                                    </h3>
                                    <button
                                        onClick={() => setShowEAS(false)}
                                        aria-label="Close"
                                        className="bl-modal-close w-11 h-11 rounded-full flex items-center justify-center text-xl leading-none flex-shrink-0"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div data-lenis-prevent className="flex-1 overflow-auto">
                                    <Suspense
                                        fallback={
                                            <div
                                                className="p-12 text-center text-sm"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                Loading architecture…
                                            </div>
                                        }
                                    >
                                        <EASArchitecture />
                                    </Suspense>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    )
}

export default Projects
