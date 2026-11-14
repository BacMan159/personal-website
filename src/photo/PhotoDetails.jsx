import React from 'react'

const TelemetryRow = ({ label, value }) => (
    <div className="bl-photo-row">
        <span className="bl-photo-label">{label}</span>
        <span className="bl-photo-value">{value}</span>
    </div>
)

/** Gear / location / exposure rows, shared by the gallery card overlay and the lightbox. */
export const PhotoTelemetry = ({ photo }) => {
    const { focal, aperture, shutter, iso } = photo.settings ?? {}
    const gear = [photo.gear, photo.lens].filter(Boolean).join(' · ')
    const settings = [focal, aperture, shutter, iso && `ISO ${iso}`].filter(Boolean).join(' · ')
    return (
        <>
            {gear && <TelemetryRow label="Gear" value={gear} />}
            {photo.city && <TelemetryRow label="Location" value={photo.city} />}
            {settings && <TelemetryRow label="Settings" value={settings} />}
        </>
    )
}
