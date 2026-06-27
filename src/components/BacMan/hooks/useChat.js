import { useState, useCallback, useRef } from 'react'

// Option A — separate API repo deployed to api.bhasanth.com
// Set VITE_API_URL in your portfolio's .env.local for local dev:
//   VITE_API_URL=http://localhost:3000
// In production Vercel sets nothing — falls back to api.bhasanth.com
const API_BASE =
    import.meta.env.VITE_API_URL ?? 'https://api.bhasanth.com'

const WELCOME = {
    id:      'welcome',
    role:    'assistant',
    content: "Hey! I'm Bac-Man — Bhasanth's AI assistant. Ask me anything about his experience, projects, or skills.",
}

// Browser session cache — avoids repeat network calls within same tab
const sessionCache = new Map()

export function useChat() {
    const [messages, setMessages] = useState([WELCOME])
    const [loading,  setLoading]  = useState(false)
    const abortRef = useRef(null)

    const send = useCallback(
        async (question) => {
            if (!question.trim() || loading) return

            abortRef.current?.abort()
            abortRef.current = new AbortController()

            const userMsg = {
                id:      crypto.randomUUID(),
                role:    'user',
                content: question,
            }
            const assistantId  = crypto.randomUUID()
            const assistantMsg = {
                id:        assistantId,
                role:      'assistant',
                content:   '',
                streaming: true,
            }

            setMessages((prev) => [...prev, userMsg, assistantMsg])
            setLoading(true)

            // Snapshot history — exclude welcome + current streaming placeholder
            const history = messages
                .filter((m) => m.id !== 'welcome' && !m.streaming)
                .slice(-8)
                .map(({ role, content }) => ({ role, content }))

            const patch = (updater) =>
                setMessages((prev) =>
                    prev.map((m) => (m.id === assistantId ? updater(m) : m))
                )

            // Browser session cache — first-turn only (no history context)
            const cacheKey = question.toLowerCase().trim()
            if (history.length === 0 && sessionCache.has(cacheKey)) {
                patch((m) => ({
                    ...m,
                    content:   sessionCache.get(cacheKey),
                    streaming: false,
                }))
                setLoading(false)
                return
            }

            try {
                const res = await fetch(`${API_BASE}/api/chat`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ question, history }),
                    signal:  abortRef.current.signal,
                })

                if (!res.ok || !res.body) {
                    patch((m) => ({ ...m, content: `Request failed (HTTP ${res.status}) — please try again.`, streaming: false }))
                    return
                }

                const reader  = res.body.getReader()
                const decoder = new TextDecoder()
                let   buffer  = ''
                let   fullAnswer = ''

                outer: while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    buffer += decoder.decode(value, { stream: true })
                    const lines = buffer.split('\n')
                    buffer = lines.pop() ?? ''

                    let i = 0
                    while (i < lines.length) {
                        const line = lines[i]

                        if (line.startsWith('event: done')) {
                            patch((m) => ({ ...m, streaming: false }))
                            // Save to session cache for instant replay
                            if (history.length === 0 && fullAnswer) {
                                sessionCache.set(cacheKey, fullAnswer)
                            }
                            break outer
                        }

                        if (line.startsWith('event: error')) {
                            const dataLine = lines[i + 1] ?? ''
                            let msg = 'Something went wrong — please try again.'
                            if (dataLine.startsWith('data:')) {
                                try { msg = JSON.parse(dataLine.slice(5)).message ?? msg } catch { /* skip */ }
                            }
                            patch((m) => ({ ...m, content: msg, streaming: false }))
                            break outer
                        }

                        if (line.startsWith('data:')) {
                            try {
                                const { text } = JSON.parse(line.slice(5))
                                if (text) {
                                    fullAnswer += text
                                    patch((m) => ({ ...m, content: m.content + text }))
                                }
                            } catch { /* skip malformed chunk */ }
                        }

                        i++
                    }
                }
            } catch (err) {
                if (err.name === 'AbortError') return
                patch((m) => ({
                    ...m,
                    content:   'Connection error — please try again.',
                    streaming: false,
                }))
            } finally {
                setLoading(false)
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId ? { ...m, streaming: false } : m
                    )
                )
            }
        },
        [loading, messages]
    )

    const reset = useCallback(() => {
        abortRef.current?.abort()
        setMessages([WELCOME])
        setLoading(false)
    }, [])

    return { messages, loading, send, reset }
}
