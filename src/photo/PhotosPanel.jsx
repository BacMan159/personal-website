import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CATEGORIES, deletePhoto, fetchPhotos, reorderPhotos, updatePhoto, uploadPhoto, UnauthorizedError } from './api.js'
import { readExif, toWebJpeg } from './exif.js'
import { Field } from './AdminField.jsx'

const EMPTY_FORM = { title: '', category: '', featured: false, gear: '', lens: '', city: '', focal: '', aperture: '', shutter: '', iso: '' }

const known = (category) => CATEGORIES.some((c) => c.id === category)

// Form state <-> photo metadata. ISO is a string in the form so its input can be empty.
const toForm = (photo) => ({
    title: photo.title ?? '',
    category: known(photo.category) ? photo.category : '',
    featured: !!photo.featured,
    gear: photo.gear ?? '',
    lens: photo.lens ?? '',
    city: photo.city ?? '',
    focal: photo.settings?.focal ?? '',
    aperture: photo.settings?.aperture ?? '',
    shutter: photo.settings?.shutter ?? '',
    iso: photo.settings?.iso == null ? '' : String(photo.settings.iso),
})

// An older photo may have no category; leave it out rather than send an invalid one.
const toMeta = (form) => ({
    title: form.title,
    ...(form.category && { category: form.category }),
    featured: form.featured,
    gear: form.gear,
    lens: form.lens,
    city: form.city,
    settings: { focal: form.focal, aperture: form.aperture, shutter: form.shutter, iso: form.iso === '' ? null : Number(form.iso) },
})

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

/** The metadata inputs, shared by the upload form and the edit dialog. `children` is the submit row. */
const PhotoFields = ({ form, setForm, children }) => {
    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
    return (
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
            <label className="sm:col-span-2 flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                Feature in the gallery's hero carousel
            </label>
            {children}
        </div>
    )
}

const UploadForm = ({ token, onUploaded, onUnauthorized }) => {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [form, setForm] = useState(EMPTY_FORM)
    const [status, setStatus] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const pickFile = async (e) => {
        const next = e.target.files?.[0]
        if (!next) return
        setFile(next)
        setPreview(URL.createObjectURL(next))
        setStatus('')
        const exif = await readExif(next)
        setForm((f) => ({ ...EMPTY_FORM, title: f.title, category: f.category, featured: f.featured, city: f.city, ...exif }))
    }

    const submit = async (e) => {
        e.preventDefault()
        if (!file || !form.category) return
        setBusy(true)
        try {
            setStatus('Resizing…')
            const { blob, width, height } = await toWebJpeg(file)
            setStatus('Uploading…')
            const photos = await uploadPhoto(token, blob, { ...toMeta(form), width, height })
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

            <PhotoFields form={form} setForm={setForm}>
                <div className="sm:col-span-2 flex items-center gap-4">
                    <button type="submit" className="bl-admin-button" disabled={busy || !file || !form.category}>
                        {busy ? 'Working…' : 'Add to gallery'}
                    </button>
                    <span role="status" className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {status || (file && !form.category ? 'Pick a category.' : '')}
                    </span>
                </div>
            </PhotoFields>
        </form>
    )
}

/** Modal form for editing an uploaded photo's details. Native <dialog> handles Esc, focus and the backdrop. */
const EditDialog = ({ photo, token, onSaved, onClose, onUnauthorized }) => {
    const ref = useRef(null)
    const [form, setForm] = useState(() => toForm(photo))
    const [status, setStatus] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => { ref.current?.showModal() }, [])

    const submit = async (e) => {
        e.preventDefault()
        setBusy(true)
        setStatus('')
        try {
            onSaved(await updatePhoto(token, photo.id, toMeta(form)))
        } catch (err) {
            if (err instanceof UnauthorizedError) return onUnauthorized()
            setStatus(err.message || 'Save failed')
        } finally {
            setBusy(false)
        }
    }

    return (
        <dialog ref={ref} className="bl-admin-dialog" aria-label="Edit photo details" onClose={onClose}>
            <form className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" onSubmit={submit}>
                <img src={photo.url} alt="" className="w-full max-h-80 object-contain rounded-lg self-start" />
                <PhotoFields form={form} setForm={setForm}>
                    <div className="sm:col-span-2 flex items-center gap-3">
                        <button type="submit" className="bl-admin-button" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
                        <button type="button" className="bl-admin-ghost" onClick={() => ref.current.close()} disabled={busy}>Cancel</button>
                        <span role="status" className="text-sm" style={{ color: 'var(--text-muted)' }}>{status}</span>
                    </div>
                </PhotoFields>
            </form>
        </dialog>
    )
}

const PhotosPanel = ({ token, onUnauthorized }) => {
    // `saved` is the order on the server; `photos` is what's shown, including unsaved reordering.
    const [saved, setSaved] = useState([])
    const [photos, setPhotos] = useState([])
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [dragId, setDragId] = useState(null)
    const [editing, setEditing] = useState(null)

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

    // Takes the server's list after an edit but keeps any unsaved reordering in `photos`.
    const merge = useCallback((list) => {
        setSaved(list)
        setPhotos((shown) => shown.map((p) => list.find((q) => q.id === p.id) ?? p))
    }, [])

    // Quick edits from the grid (category, star) are saved right away.
    const edit = useCallback(async (photo, changes) => {
        try {
            merge(await updatePhoto(token, photo.id, changes))
        } catch (err) {
            fail(err)
        }
    }, [token, merge, fail])

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
                            Starred photos rotate in the hero carousel, in this order.
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
                                <button
                                    type="button"
                                    className="bl-admin-star"
                                    aria-pressed={!!p.featured}
                                    aria-label={p.featured ? 'Remove from hero carousel' : 'Feature in hero carousel'}
                                    title={p.featured ? 'Featured in the hero carousel' : 'Feature in the hero carousel'}
                                    onClick={() => edit(p, { featured: !p.featured })}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={p.featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-between gap-2 px-1">
                                <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{p.title || p.city || 'Untitled'}</span>
                                <span className="flex gap-3 shrink-0">
                                    <button type="button" onClick={() => setEditing(p)} className="text-xs" style={{ color: 'var(--accent-2)' }}>
                                        Edit
                                    </button>
                                    <button type="button" onClick={() => remove(p)} className="text-xs" style={{ color: '#ff6b6b' }}>
                                        Delete
                                    </button>
                                </span>
                            </div>
                            {/* A photo can have no category, or one that has since been removed from CATEGORIES. */}
                            <select
                                aria-label="Category"
                                className="bl-admin-input !py-1.5 !text-xs"
                                value={known(p.category) ? p.category : ''}
                                onChange={(e) => edit(p, { category: e.target.value })}
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

            {editing && (
                <EditDialog
                    key={editing.id}
                    photo={editing}
                    token={token}
                    onSaved={(list) => { merge(list); setEditing(null) }}
                    onClose={() => setEditing(null)}
                    onUnauthorized={onUnauthorized}
                />
            )}
        </div>
    )
}

export default PhotosPanel
