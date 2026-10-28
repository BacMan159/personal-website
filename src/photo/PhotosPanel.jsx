import React, { useCallback, useEffect, useState } from 'react'
import { CATEGORIES, deletePhoto, fetchPhotos, reorderPhotos, setPhotoCategory, uploadPhoto, UnauthorizedError } from './api.js'
import { readExif, toWebJpeg } from './exif.js'
import { Field } from './AdminField.jsx'

const EMPTY_FORM = { title: '', category: '', gear: '', lens: '', city: '', focal: '', aperture: '', shutter: '', iso: '' }

const known = (category) => CATEGORIES.some((c) => c.id === category)

// Returns a copy of `list` with the item at `from` moved to `to`.
const move = (list, from, to) => {
    const next = [...list]
    next.splice(to, 0, next.splice(from, 1)[0])
    return next
}

const ArrowButton = ({ label, onClick, disabled, children }) => (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className="bl-admin-arrow">
        {children}
    </button>
)

const UploadForm = ({ token, onUploaded, onUnauthorized }) => {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [form, setForm] = useState(EMPTY_FORM)
    const [status, setStatus] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const pickFile = async (e) => {
        const next = e.target.files?.[0]
        if (!next) return
        setFile(next)
        setPreview(URL.createObjectURL(next))
        setStatus('')
        const exif = await readExif(next)
        setForm((f) => ({ ...EMPTY_FORM, title: f.title, category: f.category, city: f.city, ...exif }))
    }

    const submit = async (e) => {
        e.preventDefault()
        if (!file || !form.category) return
        setBusy(true)
        try {
            setStatus('Resizing…')
            const { blob, width, height } = await toWebJpeg(file)
            setStatus('Uploading…')
            const photos = await uploadPhoto(token, blob, {
                title: form.title,
                category: form.category,
                gear: form.gear,
                lens: form.lens,
                city: form.city,
                settings: { focal: form.focal, aperture: form.aperture, shutter: form.shutter, iso: form.iso === '' ? null : Number(form.iso) },
                width,
                height,
            })
            onUploaded(photos)
            setFile(null)
            setPreview('')
            setForm(EMPTY_FORM)
            e.target.reset()
            setStatus('Added to the gallery.')
        } catch (err) {
            if (err instanceof UnauthorizedError) return onUnauthorized()
            setStatus(err.message || 'Upload failed')
        } finally {
            setBusy(false)
        }
    }

    return (
        <form className="bl-admin-panel grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" onSubmit={submit}>
            <div className="flex flex-col gap-3">
                <label className="bl-admin-drop">
                    {preview
                        ? <img src={preview} alt="" className="max-h-80 w-full object-contain rounded-lg" />
                        : <span style={{ color: 'var(--text-muted)' }}>Choose a JPEG, PNG or WebP photo</span>}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="sr-only" onChange={pickFile} />
                </label>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Camera, lens and settings are filled from EXIF when present. The photo is resized to 2400px and GPS is stripped from the file.
                </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field label="Title" placeholder="Optional" maxLength={80} value={form.title} onChange={set('title')} /></div>
                <div className="sm:col-span-2 flex flex-col gap-1.5" role="group" aria-label="Category">
                    <span className="bl-photo-label" style={{ flex: 'none' }}>Category</span>
                    <div className="bl-admin-seg self-start flex-wrap">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                aria-pressed={form.category === c.id}
                                onClick={() => setForm((f) => ({ ...f, category: c.id }))}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>
                <Field label="Camera" placeholder="Sony A7M4" maxLength={60} value={form.gear} onChange={set('gear')} />
                <Field label="Lens" placeholder="FE 35mm F1.8" maxLength={60} value={form.lens} onChange={set('lens')} />
                <Field label="City" placeholder="Kyoto" maxLength={60} value={form.city} onChange={set('city')} />
                <Field label="Focal length" placeholder="35mm" maxLength={16} value={form.focal} onChange={set('focal')} />
                <Field label="Aperture" placeholder="f/2" maxLength={16} value={form.aperture} onChange={set('aperture')} />
                <Field label="Shutter" placeholder="1/250s" maxLength={16} value={form.shutter} onChange={set('shutter')} />
                <Field label="ISO" placeholder="400" type="number" min="1" value={form.iso} onChange={set('iso')} />
                <div className="sm:col-span-2 flex items-center gap-4">
                    <button type="submit" className="bl-admin-button" disabled={busy || !file || !form.category}>
                        {busy ? 'Working…' : 'Add to gallery'}
                    </button>
                    <span role="status" className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {status || (file && !form.category ? 'Pick a category.' : '')}
                    </span>
                </div>
            </div>
        </form>
    )
}

const PhotosPanel = ({ token, onUnauthorized }) => {
    // `saved` is the order on the server; `photos` is what's shown, including unsaved reordering.
    const [saved, setSaved] = useState([])
    const [photos, setPhotos] = useState([])
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [dragId, setDragId] = useState(null)

    const dirty = photos.some((p, i) => p.id !== saved[i]?.id)

    const load = useCallback((list) => { setSaved(list); setPhotos(list) }, [])

    useEffect(() => {
        fetchPhotos({ fresh: true }).then(load).catch((err) => setError(err.message))
    }, [load])

    const fail = useCallback((err) => {
        if (err instanceof UnauthorizedError) return onUnauthorized()
        setError(err.message)
    }, [onUnauthorized])

    const remove = useCallback(async (photo) => {
        if (!window.confirm(`Delete ${photo.title ? `"${photo.title}"` : 'this photo'}? This removes the file too.`)) return
        try {
            load(await deletePhoto(token, photo.id))
        } catch (err) {
            fail(err)
        }
    }, [token, load, fail])

    // Saved right away; keeps any unsaved reordering in `photos`.
    const changeCategory = useCallback(async (photo, category) => {
        try {
            const list = await setPhotoCategory(token, photo.id, category)
            setSaved(list)
            setPhotos((shown) => shown.map((p) => (p.id === photo.id ? { ...p, category } : p)))
        } catch (err) {
            fail(err)
        }
    }, [token, fail])

    const saveOrder = async () => {
        setSaving(true)
        try {
            load(await reorderPhotos(token, photos.map((p) => p.id)))
            setError('')
        } catch (err) {
            fail(err)
        } finally {
            setSaving(false)
        }
    }

    const shift = (index, by) => setPhotos((list) => move(list, index, index + by))

    // Live drag-and-drop: the dragged card moves as it passes over others.
    const dragOver = (e, overId) => {
        e.preventDefault()
        if (!dragId || dragId === overId) return
        setPhotos((list) => move(list, list.findIndex((p) => p.id === dragId), list.findIndex((p) => p.id === overId)))
    }

    return (
        <div className="flex flex-col gap-8">
            {error && <p role="alert" className="text-sm" style={{ color: '#ff6b6b' }}>{error}</p>}

            <UploadForm token={token} onUploaded={load} onUnauthorized={onUnauthorized} />

            <section style={{ width: 'auto' }}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-2xl" style={{ color: 'var(--text-primary)' }}>
                            In the gallery <span className="text-base" style={{ color: 'var(--text-muted)' }}>({photos.length})</span>
                        </h2>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            Drag photos (or use the arrows) to change the gallery order. First = top of the gallery.
                        </p>
                    </div>
                    {dirty && (
                        <div className="flex items-center gap-2">
                            <button type="button" className="bl-admin-ghost" onClick={() => setPhotos(saved)} disabled={saving}>Discard</button>
                            <button type="button" className="bl-admin-button" onClick={saveOrder} disabled={saving}>
                                {saving ? 'Saving…' : 'Save order'}
                            </button>
                        </div>
                    )}
                </div>
                <ul className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {photos.map((p, i) => (
                        <li
                            key={p.id}
                            draggable
                            onDragStart={(e) => { setDragId(p.id); e.dataTransfer.effectAllowed = 'move' }}
                            onDragOver={(e) => dragOver(e, p.id)}
                            onDrop={(e) => e.preventDefault()}
                            onDragEnd={() => setDragId(null)}
                            className="bl-admin-panel !p-2 flex flex-col gap-2 cursor-grab"
                            style={{ opacity: dragId === p.id ? 0.4 : 1 }}
                        >
                            <div className="relative">
                                <img src={p.url} alt="" loading="lazy" draggable={false} className="aspect-square w-full object-cover rounded-lg" />
                                <span className="bl-admin-badge">{i + 1}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 px-1">
                                <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{p.title || p.city || 'Untitled'}</span>
                                <button type="button" onClick={() => remove(p)} className="text-xs shrink-0" style={{ color: '#ff6b6b' }}>
                                    Delete
                                </button>
                            </div>
                            {/* A photo can have no category, or one that has since been removed from CATEGORIES. */}
                            <select
                                aria-label="Category"
                                className="bl-admin-input !py-1.5 !text-xs"
                                value={known(p.category) ? p.category : ''}
                                onChange={(e) => changeCategory(p, e.target.value)}
                                style={known(p.category) ? undefined : { borderColor: '#ff6b6b' }}
                            >
                                {!known(p.category) && <option value="" disabled>No category</option>}
                                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                            <div className="flex justify-between px-1">
                                <ArrowButton label="Move earlier" onClick={() => shift(i, -1)} disabled={i === 0}>←</ArrowButton>
                                <ArrowButton label="Move later" onClick={() => shift(i, 1)} disabled={i === photos.length - 1}>→</ArrowButton>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}

export default PhotosPanel
