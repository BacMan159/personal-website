// Client for bhasanth-api: the photo endpoints (GET/POST/PUT/PATCH/DELETE /api/photos, POST /api/photos/upload-url)
// and site analytics (GET /api/stats). Admin calls send ADMIN_SECRET as a Bearer token.

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.bhasanth.com'

/** Photo categories, in the order the gallery filter shows them. Must match PHOTO_CATEGORIES in bhasanth-api. */
export const CATEGORIES = [
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'birds', label: 'Birds' },
    { id: 'landscape', label: 'Landscape' },
    { id: 'astro', label: 'Astrophotography' },
    { id: 'seascape', label: 'Seascape' },
    { id: 'aerial', label: 'Aerial' },
    { id: 'macro', label: 'Macro' },
    { id: 'street', label: 'Street' },
    { id: 'portrait', label: 'Portrait' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'travel', label: 'Travel' },
    { id: 'automobile', label: 'Automobile' },
]

export class UnauthorizedError extends Error {}

async function request(path, { token, ...init } = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    })
    const data = await res.json().catch(() => ({}))
    if (res.status === 401) throw new UnauthorizedError('Wrong admin token')
    if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
    return data
}

/** Public gallery list. `fresh` skips the 30s CDN cache (used by the admin page). */
export async function fetchPhotos({ fresh = false } = {}) {
    const { photos } = await request(`/api/photos${fresh ? `?t=${Date.now()}` : ''}`)
    return photos ?? []
}

/** Uploads a JPEG blob straight to S3, then saves its metadata. Returns the updated list. */
export async function uploadPhoto(token, blob, meta) {
    const { key, uploadUrl } = await request('/api/photos/upload-url', {
        token,
        method: 'POST',
        body: JSON.stringify({ contentType: blob.type }),
    })

    const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': blob.type }, body: blob })
    if (!put.ok) throw new Error(`Upload to storage failed (${put.status})`)

    const { photos } = await request('/api/photos', {
        token,
        method: 'POST',
        body: JSON.stringify({ ...meta, key }),
    })
    return photos
}

export async function deletePhoto(token, id) {
    const { photos } = await request(`/api/photos?id=${encodeURIComponent(id)}`, { token, method: 'DELETE' })
    return photos
}

/** Site analytics for the admin console. `days` is 7, 30 or 90. */
export function fetchStats(token, days) {
    return request(`/api/stats?days=${days}`, { token })
}

/** Saves the gallery order (array of photo ids, first = top of the gallery). Returns the updated list. */
export async function reorderPhotos(token, ids) {
    const { photos } = await request('/api/photos', { token, method: 'PUT', body: JSON.stringify({ order: ids }) })
    return photos
}

/** Changes one photo's category. Returns the updated list. */
export async function setPhotoCategory(token, id, category) {
    const { photos } = await request(`/api/photos?id=${encodeURIComponent(id)}`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ category }),
    })
    return photos
}
