import React, { useCallback, useEffect, useState } from 'react'
import ThemeToggle, { initThemeFromStorage } from '../components/ThemeToggle.jsx'
import { Field } from './AdminField.jsx'
import AnalyticsPanel from './AnalyticsPanel.jsx'
import PhotosPanel from './PhotosPanel.jsx'

// Admin console at photo.bhasanth.com/admin: site analytics + photo gallery management.
// The token is ADMIN_SECRET on bhasanth-api; it's kept only in this browser.
const TOKEN_KEY = 'bl-admin'

const TABS = [
    { id: 'analytics', label: 'Analytics', Panel: AnalyticsPanel },
    { id: 'photos', label: 'Photos', Panel: PhotosPanel },
]

const readToken = () => {
    try { return localStorage.getItem(TOKEN_KEY) ?? '' } catch { return '' }
}
const saveToken = (t) => {
    try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
}

// The active tab lives in the URL hash (#analytics / #photos) so it survives reloads and can be linked to.
const tabFromHash = () => TABS.find((t) => `#${t.id}` === window.location.hash)?.id ?? TABS[0].id

const TokenGate = ({ error, onSubmit }) => {
    const [value, setValue] = useState('')
    return (
        <form
            className="bl-admin-panel max-w-md mx-auto flex flex-col gap-4"
            onSubmit={(e) => { e.preventDefault(); if (value.trim()) onSubmit(value.trim()) }}
        >
            <h1 className="text-3xl" style={{ color: 'var(--text-primary)' }}>Admin Console</h1>
            <Field label="Admin token" type="password" autoComplete="current-password" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
            {error && <p role="alert" className="text-sm" style={{ color: '#ff6b6b' }}>{error}</p>}
            <button type="submit" className="bl-admin-button">Continue</button>
        </form>
    )
}

const AdminConsole = () => {
    useEffect(() => { initThemeFromStorage() }, [])

    const [token, setToken] = useState(readToken)
    const [error, setError] = useState('')
    const [tab, setTab] = useState(tabFromHash)

    useEffect(() => {
        const onHash = () => setTab(tabFromHash())
        window.addEventListener('hashchange', onHash)
        return () => window.removeEventListener('hashchange', onHash)
    }, [])

    const signIn = (t) => { saveToken(t); setToken(t); setError('') }
    const signOut = useCallback(() => { saveToken(''); setToken('') }, [])
    const unauthorized = useCallback(() => { signOut(); setError('That token was rejected. Enter it again.') }, [signOut])

    const { Panel } = TABS.find((t) => t.id === tab)

    return (
        <main className="min-h-screen px-4 md:px-10 pb-20">
            <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 pt-4 pb-10">
                <a href="/" className="bl-nav-pill text-sm font-semibold px-4 py-2 rounded-full" style={{ color: 'var(--text-secondary)' }}>
                    ← Gallery
                </a>
                {token && (
                    <nav className="bl-nav-pill flex items-center gap-1 px-1.5 py-1.5 rounded-full" aria-label="Admin sections">
                        {TABS.map((t) => (
                            <a
                                key={t.id}
                                href={`#${t.id}`}
                                aria-current={tab === t.id ? 'page' : undefined}
                                className="bl-admin-tab"
                            >
                                {t.label}
                            </a>
                        ))}
                    </nav>
                )}
                <div className="bl-nav-pill flex items-center gap-2 px-2 py-1.5 rounded-full">
                    {token && (
                        <button type="button" onClick={signOut} className="text-sm px-3 py-1.5" style={{ color: 'var(--text-secondary)' }}>
                            Sign out
                        </button>
                    )}
                    <ThemeToggle />
                </div>
            </header>

            <div className="max-w-6xl mx-auto">
                {token
                    ? <Panel key={tab} token={token} onUnauthorized={unauthorized} />
                    : <TokenGate error={error} onSubmit={signIn} />}
            </div>
        </main>
    )
}

export default AdminConsole
