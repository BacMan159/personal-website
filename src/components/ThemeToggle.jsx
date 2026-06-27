import React, { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'bl-theme'

function applyTheme(theme) {
    const root = document.documentElement
    if (theme === 'light') {
        root.classList.add('light')
        root.classList.remove('dark')
    } else {
        root.classList.add('dark')
        root.classList.remove('light')
    }
}

export function initThemeFromStorage() {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const theme = stored === 'light' ? 'light' : 'dark'
    applyTheme(theme)
    return theme
}

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
)

const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
)

const ThemeToggle = () => {
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        setTheme(initThemeFromStorage())
    }, [])

    const toggle = useCallback(() => {
        setTheme((prev) => {
            const next = prev === 'dark' ? 'light' : 'dark'
            applyTheme(next)
            try { window.localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
            return next
        })
    }, [])

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-base)',
                color: '#FF1744',
            }}
        >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
    )
}

export default ThemeToggle
