import { useState, useCallback, useRef } from 'react'

/**
 * Lightweight reusable SSE chat hook for the Bac-Man backend.
 * Used by the new hero chat input. Streams plain-text chunks via
 * the existing /api/chat endpoint contract.
 *
 * @returns {{
 *   answer: string,
 *   streaming: boolean,
 *   error: string | null,
 *   send: (question: string, history?: Array<{role: string, content: string}>) => Promise<void>,
 *   reset: () => void,
 * }}
 */
const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.bhasanth.com'

export function useBacManChat() {
    const [answer, setAnswer] = useState('')
    const [streaming, setStreaming] = useState(false)
    const [error, setError] = useState(null)
    const abortRef = useRef(null)

    const reset = useCallback(() => {
        abortRef.current?.abort()
        setAnswer('')
        setStreaming(false)
        setError(null)
    }, [])

    const send = useCallback(async (question, history = []) => {
        if (!question.trim()) return
        abortRef.current?.abort()
        abortRef.current = new AbortController()

        setAnswer('')
        setError(null)
        setStreaming(true)

        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, history }),
                signal: abortRef.current.signal,
            })

            if (!res.ok || !res.body) {
                setError(`Request failed (HTTP ${res.status})`)
                setStreaming(false)
                return
            }

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            outer: while (true) {
                const { done, value } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() ?? ''
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i]
                    if (line.startsWith('event: done')) break outer
                    if (line.startsWith('event: error')) {
                        const dataLine = lines[i + 1] ?? ''
                        let msg = 'Something went wrong.'
                        if (dataLine.startsWith('data:')) {
                            try { msg = JSON.parse(dataLine.slice(5)).message ?? msg } catch { /* skip */ }
                        }
                        setError(msg)
                        break outer
                    }
                    if (line.startsWith('data:')) {
                        try {
                            const { text } = JSON.parse(line.slice(5))
                            if (text) setAnswer((prev) => prev + text)
                        } catch { /* skip */ }
                    }
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') setError('Connection error.')
        } finally {
            setStreaming(false)
        }
    }, [])

    return { answer, streaming, error, send, reset }
}
