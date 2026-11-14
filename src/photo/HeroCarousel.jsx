import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import { photoAlt } from './api.js'

const MAX_SLIDES = 10
const FALLBACK_SLIDES = 6
const INTERVAL_MS = 6000
const SWIPE_PX = 50

/**
 * Hero slides: the photos starred as featured in the admin console, in gallery order. Until any are
 * starred, falls back to the first landscape photos (topped up with portrait ones); photos without
 * dimensions count as landscape, as in the masonry.
 */
const pickSlides = (photos) => {
    const featured = photos.filter((p) => p.featured)
    if (featured.length) return featured.slice(0, MAX_SLIDES)
    const wide = photos.filter((p) => !p.width || !p.height || p.width >= p.height)
    const tall = photos.filter((p) => !wide.includes(p))
    return [...wide, ...tall].slice(0, FALLBACK_SLIDES)
}

const Arrow = ({ flip }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={flip ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
    </svg>
)

/** `paused` holds autoplay, e.g. while the lightbox is open over the page. */
const HeroCarousel = ({ photos, paused: held = false }) => {
    const slides = useMemo(() => (photos ? pickSlides(photos) : []), [photos])
    const [index, setIndex] = useState(0)
    const [userPaused, setUserPaused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const reduceMotion = useReducedMotion()

    const count = slides.length
    const autoplay = !reduceMotion && count > 1
    const paused = userPaused || hovered || focused || held
    const go = (step) => setIndex((i) => (i + step + count) % count)

    // Warm the cache for the next slide so the crossfade doesn't reveal a half-loaded image.
    useEffect(() => {
        if (count > 1) new Image().src = slides[(index + 1) % count].url
    }, [slides, index, count])

    if (!photos) return <div className="bl-hero bl-photo-skeleton" aria-hidden="true" />
    if (count === 0) return null

    const photo = slides[index % count]

    return (
        <motion.section
            className={`bl-hero${paused ? ' is-paused' : ''}`}
            aria-roledescription="carousel"
            aria-label="Featured photos"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false) }}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') go(-1)
                if (e.key === 'ArrowRight') go(1)
            }}
            onPanEnd={(e, { offset }) => {
                if (count > 1 && Math.abs(offset.x) > SWIPE_PX && Math.abs(offset.x) > Math.abs(offset.y)) go(offset.x < 0 ? 1 : -1)
            }}
        >
            {/* Announce slide changes only when the user drives them, not on every autoplay tick. */}
            <div aria-live={autoplay && !paused ? 'off' : 'polite'}>
                <AnimatePresence initial={false}>
                    <motion.figure
                        key={photo.id}
                        className="bl-hero-slide"
                        aria-roledescription="slide"
                        aria-label={`${index % count + 1} of ${count}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.9, ease: 'easeInOut' }}
                    >
                        <motion.img
                            src={photo.url}
                            alt={photoAlt(photo)}
                            draggable={false}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                            decoding="async"
                            initial={reduceMotion ? false : { scale: 1.08 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: INTERVAL_MS / 1000 + 1, ease: 'easeOut' }}
                        />
                        {photo.city && (
                            <motion.figcaption
                                className="bl-hero-caption"
                                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                            >
                                <p className="bl-photo-value">{photo.city}</p>
                            </motion.figcaption>
                        )}
                    </motion.figure>
                </AnimatePresence>
            </div>

            {count > 1 && (
                <>
                    <button type="button" className="bl-hero-arrow is-prev" aria-label="Previous photo" onClick={() => go(-1)} data-track="photo_hero" data-track-label="prev">
                        <Arrow flip />
                    </button>
                    <button type="button" className="bl-hero-arrow is-next" aria-label="Next photo" onClick={() => go(1)} data-track="photo_hero" data-track-label="next">
                        <Arrow />
                    </button>

                    <div className="bl-hero-controls">
                        {autoplay && (
                            <button
                                type="button"
                                className="bl-hero-pause"
                                aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                                onClick={() => setUserPaused((p) => !p)}
                                data-track="photo_hero"
                                data-track-label={userPaused ? 'play' : 'pause'}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    {userPaused
                                        ? <path d="M7 4.5v15l13-7.5z" />
                                        : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
                                </svg>
                            </button>
                        )}
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                type="button"
                                className="bl-hero-dot"
                                aria-label={`Show photo ${i + 1}`}
                                aria-current={i === index % count}
                                onClick={() => setIndex(i)}
                                data-track="photo_hero"
                                data-track-label="dot"
                            >
                                {/* The fill's CSS animation is the autoplay timer: it pauses with the carousel and advances on end. */}
                                {i === index % count && (
                                    <span
                                        key={index}
                                        className={`bl-hero-dot-fill${autoplay ? ' is-timing' : ''}`}
                                        style={{ animationDuration: `${INTERVAL_MS}ms` }}
                                        onAnimationEnd={() => go(1)}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </motion.section>
    )
}

export default HeroCarousel
