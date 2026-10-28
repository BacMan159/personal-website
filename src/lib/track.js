// Lightweight, cookie-free analytics → POST ${API_BASE}/api/track (DynamoDB).
//
// - Page view on load, one "section" view per section per session.
// - Clicks on any element with data-track="name" (optional data-track-label="…").
// - Outbound links, mailto and file downloads are captured automatically.
//
// Disabled in dev unless VITE_ENABLE_TRACKING=true, and when Do Not Track is on.

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.bhasanth.com'
const ENABLED =
    (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_TRACKING === 'true') &&
    typeof navigator !== 'undefined' &&
    navigator.doNotTrack !== '1'

const FLUSH_MS = 3000
const MAX_BATCH = 20

let queue = []
let timer = null
let started = false

function sessionId() {
    try {
        let id = sessionStorage.getItem('bl-sid')
        if (!id) {
            id = crypto.randomUUID()
            sessionStorage.setItem('bl-sid', id)
        }
        return id
    } catch {
        return 'anon'
    }
}

function flush() {
    clearTimeout(timer)
    timer = null
    if (queue.length === 0) return

    const body = JSON.stringify({ events: queue.splice(0, MAX_BATCH) })
    // text/plain keeps this a "simple" request, so no CORS preflight is needed.
    const sent = navigator.sendBeacon?.(`${API_BASE}/api/track`, new Blob([body], { type: 'text/plain' }))
    if (!sent) {
        fetch(`${API_BASE}/api/track`, { method: 'POST', body, keepalive: true }).catch(() => {})
    }
    if (queue.length > 0) flush()
}

function enqueue(type, name, label = '') {
    if (!ENABLED) return
    queue.push({
        type,
        name,
        label: String(label).slice(0, 120),
        path: location.pathname,
        referrer: type === 'view' && name === 'page' ? document.referrer : '',
        sessionId: sessionId(),
    })
    if (queue.length >= MAX_BATCH) flush()
    else if (!timer) timer = setTimeout(flush, FLUSH_MS)
}

export const trackView = (name, label) => enqueue('view', name, label)
export const trackClick = (name, label) => enqueue('click', name, label)

function onDocumentClick(e) {
    const tagged = e.target.closest?.('[data-track]')
    if (tagged) {
        trackClick(tagged.dataset.track, tagged.dataset.trackLabel ?? '')
        return
    }

    const link = e.target.closest?.('a[href]')
    if (!link) return
    const href = link.getAttribute('href')
    if (href.startsWith('mailto:')) return trackClick('mailto', href.slice(7))
    if (link.hasAttribute('download')) return trackClick('download', href.split('/').pop())

    try {
        const url = new URL(link.href)
        if (url.host !== location.host) trackClick('outbound', url.hostname + url.pathname)
    } catch { /* ignore malformed hrefs */ }
}

function observeSections() {
    const seen = new Set()
    const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            const id = entry.target.id
            if (!entry.isIntersecting || seen.has(id)) continue
            seen.add(id)
            trackView('section', id)
            io.unobserve(entry.target)
        }
    }, { threshold: 0.35 })

    document.querySelectorAll('section[id]').forEach((s) => io.observe(s))
}

/** Call once on app mount. Safe to call again (StrictMode). */
export function initTracking() {
    if (!ENABLED || started) return
    started = true

    trackView('page', document.title)
    document.addEventListener('click', onDocumentClick, { capture: true })
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flush()
    })
    window.addEventListener('pagehide', flush)
    observeSections()
}
