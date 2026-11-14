import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { photoAlt } from './api.js'
import { PhotoTelemetry } from './PhotoDetails.jsx'

const SWIPE_PX = 50
const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

const Icon = ({ d, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
)

const ICONS = {
    close: 'M6 6l12 12M18 6L6 18',
    prev: 'M15 6l-6 6 6 6',
    next: 'M9 6l6 6-6 6',
    expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
    shrink: 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5',
}

/**
 * Full-viewport photo viewer. `photos` is the list to step through (the filtered grid, or the carousel
 * slides) and `index` the open one. Esc / backdrop click closes; ←/→ and swipe step; where the browser
 * supports it, a button switches to true fullscreen.
 */
const Lightbox = ({ photos, index, onIndex, onClose }) => {
    const ref = useRef(null)
    const reduceMotion = useReducedMotion()
    const [fullscreen, setFullscreen] = useState(false)
    // A swipe ends with a click on the stage; ignore it so swiping doesn't close the viewer.
    const swipedAt = useRef(0)
    const count = photos.length
    const photo = photos[index]
    const step = (by) => onIndex((index + by + count) % count)

    // Lock page scroll, move focus in, and give it back to the opening element on close.
    useEffect(() => {
        const opener = document.activeElement
        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'
        ref.current?.querySelector('.bl-lightbox-close')?.focus()
        return () => {
            document.body.style.overflow = overflow
            if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
            opener?.focus?.({ preventScroll: true })
        }
    }, [])

    useEffect(() => {
        const sync = () => setFullscreen(!!document.fullscreenElement)
        document.addEventListener('fullscreenchange', sync)
        return () => document.removeEventListener('fullscreenchange', sync)
    }, [])

    // Warm the neighbours so stepping doesn't flash an empty frame.
    useEffect(() => {
        if (count < 2) return
        new Image().src = photos[(index + 1) % count].url
        new Image().src = photos[(index - 1 + count) % count].url
    }, [photos, index, count])

    const onKeyDown = (e) => {
        if (e.key === 'Escape') onClose()
        else if (e.key === 'ArrowLeft' && count > 1) step(-1)
        else if (e.key === 'ArrowRight' && count > 1) step(1)
        else if (e.key === 'Tab') {
            // Keep focus inside the dialog.
            const items = [...ref.current.querySelectorAll(FOCUSABLE)]
            const first = items[0]
            const last = items[items.length - 1]
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
        }
    }

    const toggleFullscreen = () => {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
        else ref.current.requestFullscreen?.().catch(() => {})
    }

    if (!photo) return null
    const hasDetails = photo.title || photo.gear || photo.lens || photo.city || Object.values(photo.settings ?? {}).some(Boolean)

    return (
        <motion.div
            ref={ref}
            className="bl-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo viewer: ${photoAlt(photo)}`}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
        >
            <div className="bl-lightbox-bar">
                <span className="bl-photo-value" aria-live="polite">{count > 1 ? `${index + 1} / ${count}` : ''}</span>
                <div className="flex items-center gap-2">
                    {document.fullscreenEnabled && (
                        <button
                            type="button"
                            className="bl-lightbox-button"
                            aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
                            onClick={toggleFullscreen}
                            data-track="photo_lightbox"
                            data-track-label="fullscreen"
                        >
                            <Icon d={fullscreen ? ICONS.shrink : ICONS.expand} />
                        </button>
                    )}
                    <button type="button" className="bl-lightbox-button bl-lightbox-close" aria-label="Close" onClick={onClose}>
                        <Icon d={ICONS.close} />
                    </button>
                </div>
            </div>

            <motion.div
                className="bl-lightbox-stage"
                onClick={(e) => { if (e.target === e.currentTarget && Date.now() - swipedAt.current > 300) onClose() }}
                onPanEnd={(e, { offset }) => {
                    swipedAt.current = Date.now()
                    if (count > 1 && Math.abs(offset.x) > SWIPE_PX && Math.abs(offset.x) > Math.abs(offset.y)) step(offset.x < 0 ? 1 : -1)
                }}
            >
                <AnimatePresence initial={false}>
                    <motion.img
                        key={photo.id}
                        src={photo.url}
                        alt={photoAlt(photo)}
                        draggable={false}
                        decoding="async"
                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                    />
                </AnimatePresence>

                {count > 1 && (
                    <>
                        <button type="button" className="bl-lightbox-button bl-lightbox-arrow is-prev" aria-label="Previous photo" onClick={() => step(-1)}>
                            <Icon d={ICONS.prev} size={20} />
                        </button>
                        <button type="button" className="bl-lightbox-button bl-lightbox-arrow is-next" aria-label="Next photo" onClick={() => step(1)}>
                            <Icon d={ICONS.next} size={20} />
                        </button>
                    </>
                )}
            </motion.div>

            {hasDetails && (
                <div className="bl-lightbox-details">
                    {photo.title && <p className="bl-photo-title">{photo.title}</p>}
                    <PhotoTelemetry photo={photo} />
                </div>
            )}
        </motion.div>
    )
}

export default Lightbox
