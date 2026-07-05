import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import { getLenis } from '../hooks/useLenis.js'
import ThemeToggle from './ThemeToggle.jsx'

const LINKS = [
    { name: 'About', id: 'hero' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'Contact', id: 'contact' },
]

const NavBar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTo = useCallback((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const lenis = getLenis()
        if (lenis) {
            lenis.scrollTo(el, { offset: -80, duration: 1.4 })
        } else {
            const top = el.getBoundingClientRect().top + window.scrollY - 80
            window.scrollTo({ top, behavior: 'smooth' })
        }
        setOpen(false)
    }, [])

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <a
                    href="#hero"
                    onClick={(e) => { e.preventDefault(); scrollTo('hero') }}
                    className={`bl-nav-pill text-2xl font-extrabold tracking-tight px-4 py-2 rounded-full ${scrolled ? 'is-scrolled' : ''}`}
                    style={{ color: 'var(--text-secondary)' }}
                >
                    BL
                </a>

                <nav
                    className={`bl-nav-pill hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full ${scrolled ? 'is-scrolled' : ''}`}
                >
                    {LINKS.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => scrollTo(l.id)}
                            className="text-sm font-medium px-4 py-2 rounded-full transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--accent)'
                                e.currentTarget.style.background = 'rgba(10, 132, 255,0.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--text-secondary)'
                                e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            {l.name}
                        </button>
                    ))}
                </nav>

                <div
                    className={`bl-nav-pill flex items-center gap-2 px-2 py-1.5 rounded-full ${scrolled ? 'is-scrolled' : ''}`}
                >
                    <a
                        href="https://www.linkedin.com/in/bhasanth/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(10, 132, 255,0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.23 0z" />
                        </svg>
                    </a>
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full"
                        aria-label="Menu"
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            {open ? (
                                <path d="M6 6l12 12M18 6L6 18" />
                            ) : (
                                <>
                                    <path d="M3 6h18" />
                                    <path d="M3 12h18" />
                                    <path d="M3 18h18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="drawer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="bl-nav-drawer lg:hidden overflow-hidden"
                    >
                        <div className="flex flex-col px-5 py-4 gap-3">
                            {LINKS.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => scrollTo(l.id)}
                                    className="text-left text-base py-2"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    {l.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default NavBar
