import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fetchStats, UnauthorizedError } from './api.js'

// Site analytics from GET /api/stats (DynamoDB, see bhasanth-api lib/events.ts).
// Labels come from public visitors, so everything is rendered as text — never as HTML.

const RANGES = [7, 30, 90]
const METRICS = { views: 'Page views', sessions: 'Visitors', clicks: 'Clicks' }
const fmt = new Intl.NumberFormat()

const shortDay = (d) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })

// Smallest "nice" step (1, 2, 2.5, 5 × 10ⁿ) that fits the data in 4 gridlines.
function niceMax(v) {
    if (v <= 4) return 4
    const rough = v / 4
    const mag = 10 ** Math.floor(Math.log10(rough))
    const step = [1, 2, 2.5, 5, 10].find((s) => s * mag >= rough) * mag
    return Math.ceil(step) * 4
}

const Segmented = ({ label, options, value, onChange }) => (
    <div className="bl-admin-seg" role="group" aria-label={label}>
        {options.map(([key, text]) => (
            <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)}>
                {text}
            </button>
        ))}
    </div>
)

const Tile = ({ label, value, hint }) => (
    <div className="bl-admin-panel !p-4">
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
        <div className="bl-admin-tile-value">{value}</div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</div>
    </div>
)

// Horizontal bar list. With `of`, values show as a share of that total.
const BarList = ({ title, rows, label = (k) => k, of = 0 }) => {
    const max = of || Math.max(1, ...rows.map((r) => r.count))
    return (
        <section className="bl-admin-panel !p-4" style={{ width: 'auto' }}>
            <h3 className="bl-admin-card-title">{title}</h3>
            {rows.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</p>
            ) : (
                <ul className="flex flex-col gap-2.5">
                    {rows.slice(0, 10).map((r) => (
                        <li key={r.key}>
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="truncate" title={label(r.key)} style={{ color: 'var(--text-primary)' }}>{label(r.key)}</span>
                                <span className="shrink-0 tabular-nums" style={{ color: 'var(--text-muted)' }}>
                                    {of ? `${Math.min(100, Math.round((r.count / of) * 100))}%` : fmt.format(r.count)}
                                </span>
                            </div>
                            <div className="bl-admin-track">
                                <div className="bl-admin-fill" style={{ width: `${Math.min(100, (r.count / max) * 100)}%` }} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

const H = 220
const PAD = { top: 8, right: 4, bottom: 22, left: 34 }

const DayChart = ({ rows, metric }) => {
    const ref = useRef(null)
    const [width, setWidth] = useState(800)
    const [hover, setHover] = useState(null)

    useLayoutEffect(() => {
        const node = ref.current
        if (!node) return
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width || 800))
        ro.observe(node)
        return () => ro.disconnect()
    }, [])

    const iw = width - PAD.left - PAD.right
    const ih = H - PAD.top - PAD.bottom
    const base = PAD.top + ih
    const yMax = niceMax(Math.max(0, ...rows.map((r) => r[metric])))
    const band = iw / Math.max(1, rows.length)
    const barW = Math.max(2, Math.min(24, band - 2))
    const y = (v) => PAD.top + ih - (v / yMax) * ih
    const labelEvery = Math.ceil(rows.length / Math.max(1, Math.floor(iw / 56)))
    const name = METRICS[metric].toLowerCase()

    const hovered = hover === null ? null : rows[hover]
    const hx = hover === null ? 0 : PAD.left + band * hover + band / 2

    return (
        <div ref={ref} className="relative">
            <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} role="img" aria-label={`${METRICS[metric]} per day`} className="block overflow-visible">
                {[0, 1, 2, 3, 4].map((i) => {
                    const v = (yMax / 4) * i
                    return (
                        <g key={i}>
                            <line x1={PAD.left} x2={width - PAD.right} y1={y(v)} y2={y(v)} className={i === 0 ? 'bl-chart-baseline' : 'bl-chart-grid'} />
                            <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end" className="bl-chart-axis">{fmt.format(v)}</text>
                        </g>
                    )
                })}
                {rows.map((r, i) => {
                    const cx = PAD.left + band * i + band / 2
                    const v = r[metric]
                    const top = y(v)
                    // Column with a 4px rounded top, square at the baseline.
                    const rad = Math.min(4, base - top, barW / 2)
                    const x0 = cx - barW / 2
                    const x1 = cx + barW / 2
                    return (
                        <g key={r.day}>
                            {v > 0 && (
                                <path
                                    className="bl-chart-bar"
                                    style={{ opacity: hover === i ? 0.8 : 1 }}
                                    d={`M${x0},${base} V${top + rad} Q${x0},${top} ${x0 + rad},${top} H${x1 - rad} Q${x1},${top} ${x1},${top + rad} V${base} Z`}
                                />
                            )}
                            {i % labelEvery === 0 && (
                                <text x={cx} y={H - 6} textAnchor="middle" className="bl-chart-axis">{shortDay(r.day)}</text>
                            )}
                            <rect
                                x={PAD.left + band * i} y={PAD.top} width={band} height={ih}
                                fill="transparent" tabIndex={0} className="bl-chart-hit"
                                aria-label={`${shortDay(r.day)}: ${v} ${name}`}
                                onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}
                                onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                            />
                        </g>
                    )
                })}
            </svg>
            {hovered && (
                <div
                    className="bl-chart-tip"
                    style={{ left: `${(hx / width) * 100}%`, top: `${(Math.min(y(hovered[metric]), base - 4) / H) * 100}%` }}
                >
                    <div><span className="bl-chart-key" /><strong>{fmt.format(hovered[metric])}</strong> {name}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{shortDay(hovered.day)}</div>
                </div>
            )}
        </div>
    )
}

const AnalyticsPanel = ({ token, onUnauthorized }) => {
    const [days, setDays] = useState(7)
    const [metric, setMetric] = useState('views')
    const [data, setData] = useState(null)
    const [status, setStatus] = useState('')

    const load = useCallback(async () => {
        setStatus('Loading…')
        try {
            setData(await fetchStats(token, days))
            setStatus('')
        } catch (err) {
            if (err instanceof UnauthorizedError) return onUnauthorized()
            setStatus(`Couldn't load stats (${err.message}). Try Refresh.`)
        }
    }, [token, days, onUnauthorized])

    useEffect(() => { load() }, [load])

    const totals = data?.totals
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <div>
                    <h2 className="text-2xl" style={{ color: 'var(--text-primary)' }}>bhasanth.com analytics</h2>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {data ? `${shortDay(data.range.from)} – ${shortDay(data.range.to)} · UTC` : ' '}
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Segmented label="Date range" options={RANGES.map((d) => [d, `${d} days`])} value={days} onChange={setDays} />
                    <button type="button" className="bl-admin-ghost" onClick={load}>Refresh</button>
                </div>
            </div>

            {status && <p role="status" className="text-sm" style={{ color: 'var(--text-muted)' }}>{status}</p>}

            {data && (
                <>
                    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                        <Tile label="Page views" value={fmt.format(totals.views)} hint={`${(totals.views / data.range.days).toFixed(1)} per day`} />
                        <Tile label="Visitors" value={fmt.format(totals.sessions)} hint="unique sessions" />
                        <Tile label="Clicks" value={fmt.format(totals.clicks)} hint="tracked interactions" />
                        <Tile label="Clicks per visitor" value={totals.sessions ? (totals.clicks / totals.sessions).toFixed(1) : '–'} hint="engagement" />
                    </div>

                    <section className="bl-admin-panel !p-4" style={{ width: 'auto' }}>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <h3 className="bl-admin-card-title !mb-0">{METRICS[metric]} per day</h3>
                            <Segmented label="Chart metric" options={Object.entries(METRICS).map(([k, v]) => [k, k === 'views' ? 'Views' : v])} value={metric} onChange={setMetric} />
                        </div>
                        <DayChart rows={data.byDay} metric={metric} />
                        <details className="mt-3">
                            <summary className="text-sm cursor-pointer" style={{ color: 'var(--text-muted)' }}>Show as table</summary>
                            <div className="overflow-x-auto">
                                <table className="bl-admin-table">
                                    <thead><tr><th scope="col">Day (UTC)</th><th scope="col">Views</th><th scope="col">Visitors</th><th scope="col">Clicks</th></tr></thead>
                                    <tbody>
                                        {[...data.byDay].reverse().map((d) => (
                                            <tr key={d.day}>
                                                <td>{d.day}</td><td>{fmt.format(d.views)}</td><td>{fmt.format(d.sessions)}</td><td>{fmt.format(d.clicks)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    </section>

                    <div className="grid gap-3 md:grid-cols-2">
                        <BarList title="Top clicks" rows={data.clicks} label={(k) => k.replace(':', ' · ')} />
                        <BarList title="Sections reached (% of visitors)" rows={data.sections} of={totals.sessions} />
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        <BarList title="Referrers" rows={data.referrers} />
                        <BarList title="Countries" rows={data.countries} label={(k) => (k === '??' ? 'Unknown' : k)} />
                        <BarList title="Devices" rows={data.devices} label={(k) => k[0].toUpperCase() + k.slice(1)} />
                    </div>
                </>
            )}
        </div>
    )
}

export default AnalyticsPanel
