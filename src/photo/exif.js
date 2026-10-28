// Reads EXIF from an image file and turns it into the gallery's telemetry fields,
// and downsizes the image to a web-friendly JPEG before upload.

import exifr from 'exifr'

const MAX_EDGE = 2400
const JPEG_QUALITY = 0.88

// Sony bodies report model codes ("ILCE-7M4") rather than marketing names ("A7M4").
function cameraName(make = '', model = '') {
    const sony = model.match(/^ILCE-(\w+)$/)
    if (sony) return `Sony A${sony[1]}`
    if (!make || /apple/i.test(make)) return model
    const brand = make.split(' ')[0]
    return model.toLowerCase().startsWith(brand.toLowerCase()) ? model : `${brand} ${model}`
}

// Phones name the lens after themselves ("iPhone 15 Pro back triple camera 6.765mm f/1.78"),
// which just repeats the camera — drop those. Real lenses come through as-is ("FE 35mm F1.8 G").
function lensName(lens = '', model = '') {
    const l = lens.trim()
    if (!l || (model && l.toLowerCase().startsWith(model.toLowerCase()))) return ''
    return l
}

function shutterSpeed(t) {
    if (!t) return ''
    return t >= 1 ? `${Math.round(t * 10) / 10}s` : `1/${Math.round(1 / t)}s`
}

/** Returns prefilled form values; any field EXIF doesn't have comes back empty. */
export async function readExif(file) {
    let tags = {}
    try {
        tags = (await exifr.parse(file)) ?? {}
    } catch { /* no EXIF (screenshots, exported files) */ }

    // Phones report tiny physical focal lengths (6.8mm); their 35mm-equivalent is what people recognise.
    // Interchangeable-lens cameras use the lens's real focal length.
    const isPhone = /apple|google|samsung/i.test(tags.Make ?? '')
    const focal = isPhone ? (tags.FocalLengthIn35mmFormat ?? tags.FocalLength) : (tags.FocalLength ?? tags.FocalLengthIn35mmFormat)
    return {
        gear: cameraName(tags.Make, tags.Model),
        lens: lensName(tags.LensModel, tags.Model),
        focal: focal ? `${Math.round(focal)}mm` : '',
        aperture: tags.FNumber ? `f/${Math.round(tags.FNumber * 10) / 10}` : '',
        shutter: shutterSpeed(tags.ExposureTime),
        iso: tags.ISO ? String(tags.ISO) : '',
    }
}

/** Downsizes to MAX_EDGE on the long side and re-encodes as JPEG (this also strips EXIF/GPS from the file). */
export async function toWebJpeg(file) {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode image'))), 'image/jpeg', JPEG_QUALITY),
    )
    return { blob, width, height }
}
