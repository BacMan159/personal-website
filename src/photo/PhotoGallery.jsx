import { motion } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import ThemeToggle, { initThemeFromStorage } from '../components/ThemeToggle.jsx'
import { initTracking } from '../lib/track.js'
import { CATEGORIES, fetchPhotos } from './api.js'

const MAIN_SITE = import.meta.env.DEV ? '/' : 'https://bhasanth.com'

const TelemetryRow = ({ label, value }) => (
    <div className="bl-photo-row">
        <span className="bl-photo-label">{label}</span>
        <span className="bl-photo-value">{value}</span>
    </div>
)

// Column count per breakpoint, widest first (matches the old CSS columns: 1 / 2 at 640px / 3 at 1100px).
const BREAKPOINTS = [[1100, 3], [640, 2]]
const columnsFor = (w) => (BREAKPOINTS.find(([min]) => w >= min) ?? [0, 1])[1]

const useColumnCount = () => {
    const [count, setCount] = useState(() => columnsFor(window.innerWidth))
    useEffect(() => {
        const queries = BREAKPOINTS.map(([min]) => window.matchMedia(`(min-width: ${min}px)`))
        const update = () => setCount(columnsFor(window.innerWidth))
        queries.forEach((q) => q.addEventListener('change', update))
        return () => queries.forEach((q) => q.removeEventListener('change', update))
    }, [])
    return count
}

/**
 * Masonry: each item goes into the currently shortest column (leftmost on a tie), so the
 * gallery order reads left to right across the top instead of down the first column.
 * Heights are estimated from the stored aspect ratio; photos without dimensions count as 4:3.
 */
const toColumns = (items, count, ratioOf) => {
    const cols = Array.from({ length: count }, () => ({ height: 0, items: [] }))
    items.forEach((item, index) => {
        const col = cols.reduce((min, c) => (c.height < min.height ? c : min))
        col.items.push({ item, index })
        col.height += ratioOf(item)
    })
    return cols.map((c) => c.items)
}

// The selected category lives in the URL hash (e.g. #birds) so a filtered view can be shared.
const categoryFromHash = () => {
    const id = window.location.hash.slice(1)
    return CATEGORIES.some((c) => c.id === id) ? id : 'all'
}

const useCategory = () => {
    const [category, setCategory] = useState(categoryFromHash)
    useEffect(() => {
        const update = () => setCategory(categoryFromHash())
        window.addEventListener('hashchange', update)
        return () => window.removeEventListener('hashchange', update)
    }, [])
    const select = (id) => {
        history.replaceState(null, '', id === 'all' ? window.location.pathname + window.location.search : `#${id}`)
        setCategory(id)
    }
    return [category, select]
}

const CategoryFilter = ({ options, value, onChange }) => (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {options.map((c) => (
            <button
                key={c.id}
                type="button"
                className="bl-photo-filter"
                aria-pressed={value === c.id}
                onClick={() => onChange(c.id)}
                data-track="photo_filter"
                data-track-label={c.id}
            >
                {c.label}
            </button>
        ))}
    </div>
)

const photoRatio = (p) => (p.width && p.height ? p.height / p.width : 3 / 4)

const PhotoCard = ({ photo, index, columns }) => {
    const { focal, aperture, shutter, iso } = photo.settings
    const gear = [photo.gear, photo.lens].filter(Boolean).join(' · ')
    const settings = [focal, aperture, shutter, iso && `ISO ${iso}`].filter(Boolean).join(' · ')
    return (
        <motion.figure
            className="bl-photo-card"
            tabIndex={0}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (index % columns) * 0.08, ease: 'easeOut' }}
        >
            <img
                src={photo.url}
                alt={photo.title || [photo.city, photo.gear].filter(Boolean).join(' · ') || 'Photograph'}
                width={photo.width || undefined}
                height={photo.height || undefined}
                loading="lazy"
                decoding="async"
            />
            <figcaption className="bl-photo-overlay">
                {photo.title && <p className="bl-photo-title">{photo.title}</p>}
                {gear && <TelemetryRow label="Gear" value={gear} />}
                {photo.city && <TelemetryRow label="Location" value={photo.city} />}
                {settings && <TelemetryRow label="Settings" value={settings} />}
            </figcaption>
        </motion.figure>
    )
}

const PhotoGallery = () => {
    useEffect(() => { initThemeFromStorage() }, [])
    useEffect(() => { initTracking() }, [])

    const [photos, setPhotos] = useState(null)
    const [error, setError] = useState('')
    useEffect(() => {
        fetchPhotos().then(setPhotos).catch(() => setError('Could not load photos. Please try again later.'))
    }, [])

    const [category, setCategory] = useCategory()
    // Only offer categories that have photos; photos without a category show under "All" only.
    const filters = useMemo(
        () => [{ id: 'all', label: 'All' }, ...CATEGORIES.filter((c) => photos?.some((p) => p.category === c.id))],
        [photos],
    )
    const shown = useMemo(
        () => photos && (category === 'all' ? photos : photos.filter((p) => p.category === category)),
        [photos, category],
    )

    const columns = useColumnCount()
    const layout = useMemo(
        () => shown
            ? toColumns(shown, columns, photoRatio)
            : toColumns([3, 4, 3, 4, 3, 4], columns, (h) => h / 3),
        [shown, columns],
    )

    return (
        <main className="min-h-screen px-4 md:px-10 pb-20">
            <header className="max-w-7xl mx-auto flex items-center justify-between gap-4 pt-4">
                <a
                    href={MAIN_SITE}
                    className="bl-nav-pill text-2xl font-extrabold tracking-tight px-4 py-2 rounded-full"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    BL
                </a>
                <div className="bl-nav-pill flex items-center gap-2 px-2 py-1.5 rounded-full">
                    <a
                        href="https://www.instagram.com/stellarshots.by.bacman?cplk=MWp0OGwzNG15Ym9zNw%3D%3D&utm_source=qr"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(10, 132, 255,0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                        </svg>
                    </a>
                    <ThemeToggle />
                    <a
                        href={MAIN_SITE}
                        aria-label="Developer profile"
                        title="Developer profile"
                        data-track="nav"
                        data-track-label="dev_profile"
                        className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
                        style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(10, 132, 255,0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M8 6l-6 6 6 6" />
                            <path d="M16 6l6 6-6 6" />
                        </svg>
                    </a>
                </div>
            </header>

            <section className="max-w-7xl mx-auto pt-16 md:pt-24 pb-10 md:pb-14" style={{ width: 'auto' }}>
                <h1 className="text-4xl md:text-6xl" style={{ color: 'var(--text-primary)' }}>My Photography</h1>
                {filters.length > 1 && (
                    <div className="mt-8">
                        <CategoryFilter options={filters} value={category} onChange={setCategory} />
                    </div>
                )}
            </section>

            {error || (shown && shown.length === 0) ? (
                <p className="max-w-7xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                    {error || (photos.length === 0 ? 'New photos are on the way.' : 'No photos in this category yet.')}
                </p>
            ) : (
                <div className="bl-photo-grid max-w-7xl mx-auto" aria-busy={!photos}>
                    {layout.map((col, c) => (
                        <div key={c} className="bl-photo-column">
                            {shown
                                ? col.map(({ item, index }) => (
                                    <PhotoCard key={item.id} photo={item} index={index} columns={columns} />
                                ))
                                : col.map(({ item: h, index }) => (
                                    <div key={index} className="bl-photo-card bl-photo-skeleton" style={{ aspectRatio: `3 / ${h}` }} />
                                ))}
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

export default PhotoGallery
