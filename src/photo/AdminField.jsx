import React from 'react'

export const Field = ({ label, hint, ...props }) => (
    <label className="flex flex-col gap-1.5">
        <span className="bl-photo-label" style={{ flex: 'none' }}>{label}</span>
        <input className="bl-admin-input" {...props} />
        {hint && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</span>}
    </label>
)
