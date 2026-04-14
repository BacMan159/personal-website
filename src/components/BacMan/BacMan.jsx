import { useState, useRef, useEffect, useCallback, lazy, Suspense, memo } from 'react'
import { useChat } from './hooks/useChat.js'

// Lazy-load the two canvases so R3F + GLB don't block initial page paint
const BacManBubbleCanvas = lazy(() => import('./BacManBubbleCanvas.jsx'))
const AvatarExperience   = lazy(() => import('../HeroModels/AvatarExperience.jsx'))

// ─── Suggested questions ──────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What's Bhasanth's current role?",
  "Tell me about his AI patent",
  "What's his tech stack?",
  "Describe his key projects",
]

// ─── Typing dots ──────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex gap-1 items-center py-0.5">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-violet-400 opacity-40"
        style={{ animation: `bacmanDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
  </div>
)

// ─── Single message bubble ────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-2 items-end ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Bot avatar dot */}
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mb-0.5">
          <span className="text-violet-300 text-xs font-bold">B</span>
        </div>
      )}
      <div
        className={[
          'max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed font-mono rounded-2xl',
          'transition-all duration-200',
          isUser
            ? 'bg-violet-600/25 border border-violet-500/35 text-violet-100 rounded-br-sm'
            : 'bg-white/[0.04] border border-white/[0.07] text-slate-300 rounded-bl-sm',
        ].join(' ')}
      >
        {msg.content}
        {msg.streaming && msg.content.length > 0 && (
          <span
            className="inline-block w-0.5 h-3.5 bg-violet-400 ml-0.5 align-text-bottom"
            style={{ animation: 'bacmanBlink 0.75s step-end infinite' }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Stable avatar panel — memo prevents re-mount on every keystroke ─────────
const AvatarPanel = memo(() => (
  <div className="hidden md:flex flex-col w-[340px] flex-shrink-0
                  bg-[#080412] border-r border-violet-500/10 relative">
    <div className="flex-1 relative">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-violet-500/40 border-t-violet-400 rounded-full animate-spin" />
          </div>
        }
      >
        <AvatarExperience />
      </Suspense>
    </div>
  </div>
))

// ─── Main widget ──────────────────────────────────────────────────────────────
const BacMan = () => {
  const [open,    setOpen]    = useState(false)
  const [closing, setClosing] = useState(false)
  const [input,   setInput]   = useState('')
  const { messages, loading, send } = useChat()

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input after open animation settles
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 440)
    return () => clearTimeout(t)
  }, [open])

  const openChat = useCallback(() => {
    setClosing(false)
    setOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeChat = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
      document.body.style.overflow = ''
    }, 380)
  }, [])

  const handleSend = useCallback(
    async (text) => {
      const content = (text ?? input).trim()
      if (!content || loading) return
      setInput('')
      await send(content)
    },
    [input, loading, send]
  )

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isTyping =
    loading &&
    messages.at(-1)?.role === 'assistant' &&
    messages.at(-1)?.content === ''

  return (
    <>
      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes bacmanPop {
          0%   { transform: scale(0.35); opacity: 0; }
          70%  { transform: scale(1.07); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes bacmanSonar {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.9); opacity: 0;   }
        }
        @keyframes bacmanExpand {
          0%   { transform: scale(0.06); opacity: 0; border-radius: 50%; }
          55%  { border-radius: 1rem; }
          100% { transform: scale(1);    opacity: 1; border-radius: 1rem; }
        }
        @keyframes bacmanCollapse {
          0%   { transform: scale(1);    opacity: 1; border-radius: 1rem; }
          55%  { border-radius: 50%; }
          100% { transform: scale(0.06); opacity: 0; border-radius: 50%; }
        }
        @keyframes bacmanFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bacmanBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes bacmanDot {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.35; }
          30%            { transform: translateY(-5px); opacity: 1;    }
        }
        @keyframes bacmanSlideLabel {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bacmanPulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1; }
        }
        .bacman-msg { animation: bacmanFadeUp 0.26s ease both; }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════
          BUBBLE — fixed bottom-right
      ════════════════════════════════════════════════════════════════ */}
      {/* Bubble — always mounted so BacManBubbleCanvas (R3F) never remounts */}
      <div
          className="fixed bottom-7 right-7 z-[9000] flex items-center gap-2.5"
          style={{
            visibility: (!open && !closing) ? 'visible' : 'hidden',
            pointerEvents: (!open && !closing) ? 'auto' : 'none',
            animation: 'bacmanPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          {/* "Ask me anything" label */}
          <button
            onClick={openChat}
            className="bg-violet-500/10 border border-violet-500/25 rounded-full px-4 py-1.5
                       text-[11px] font-semibold tracking-widest text-violet-200/90
                       hover:bg-violet-500/20 hover:border-violet-400/45 transition-all
                       whitespace-nowrap font-sans"
            style={{ animation: 'bacmanSlideLabel 0.35s 0.5s both' }}
          >
            Ask me anything ↗
          </button>

          {/* Avatar button */}
          <button
            onClick={openChat}
            aria-label="Open Bac-Man chat"
            className="relative w-16 h-16 rounded-full flex-shrink-0
                       bg-gradient-to-br from-[#1a0f2e] to-[#2d1f52]
                       border-2 border-violet-500/60
                       hover:scale-105 hover:border-violet-400/90
                       transition-all duration-200 overflow-hidden"
          >
            {/* Sonar rings */}
            {[0, 1].map((i) => (
              <span
                key={i}
                className="absolute inset-[-5px] rounded-full border border-violet-500/35 pointer-events-none"
                style={{ animation: `bacmanSonar 2.8s ease-out ${i}s infinite` }}
              />
            ))}

            {/* 3D Avatar canvas — lazy loaded */}
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-violet-400 text-xs font-bold font-mono">B</span>
                </div>
              }
            >
              <BacManBubbleCanvas />
            </Suspense>
          </button>
        </div>

      {/* ════════════════════════════════════════════════════════════════
          FULLSCREEN OVERLAY — expands from bubble origin
      ════════════════════════════════════════════════════════════════ */}
      {/* Always mounted so AvatarPanel (R3F canvas) never remounts/resizes */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bac-Man — Bhasanth's AI assistant"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
        style={{
          visibility: (open || closing) ? 'visible' : 'hidden',
          pointerEvents: (open || closing) ? 'auto' : 'none',
          transformOrigin: 'calc(100% - 64px) calc(100% - 64px)',
          animation: (open || closing)
            ? closing
              ? 'bacmanCollapse 0.36s cubic-bezier(0.4,0,1,1) forwards'
              : 'bacmanExpand  0.46s cubic-bezier(0.16,1,0.3,1) forwards'
            : 'none',
          backgroundImage:
            'linear-gradient(rgba(127,119,221,0.03) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(127,119,221,0.03) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
          backgroundColor: 'rgba(6,3,16,0.97)',
        }}
      >
          {/* ── Panel (max 1100px, split layout on md+) ── */}
          <div
            className="relative flex flex-col md:flex-row
                       w-full max-w-[1100px] mx-4
                       h-[calc(100dvh-48px)] max-h-[780px]
                       bg-[#0e0720] border border-violet-500/15 rounded-2xl overflow-hidden"
          >

            {/* ── LEFT: 3D Avatar panel (hidden on mobile) ── */}
            <AvatarPanel />

            {/* ── RIGHT: Chat panel ── */}
            <div className="flex flex-col flex-1 min-w-0 min-h-0">

              {/* Header (visible on mobile — avatar panel hidden) */}
              <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4
                              border-b border-violet-500/10 bg-[#0a0518]">
                {/* Mobile-only avatar dot */}
                <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-[#1a0f2e] to-[#2d1f52]
                                border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-300 text-xs font-bold">B</span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-sans font-bold text-sm tracking-[0.08em] text-violet-100">
                    BacMan
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.1em] text-violet-400/50 flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-[5px] h-[5px] rounded-full bg-violet-400 inline-block flex-shrink-0"
                      style={{ animation: 'bacmanPulse 2.2s ease-in-out infinite' }}
                    />
                    BHASANTH'S AI ASSISTANT
                  </p>
                </div>

                <button
                  onClick={closeChat}
                  aria-label="Close chat"
                  className="flex-shrink-0 border border-white/8 rounded-lg px-3 py-1.5
                             text-white/30 text-[11px] font-sans tracking-[0.08em]
                             hover:bg-white/5 hover:text-white/60 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div
                role="log"
                aria-live="polite"
                className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3
                           [scrollbar-width:thin] [scrollbar-color:rgba(127,119,221,0.2)_transparent]"
              >
                {messages.map((msg) => (
                  <div key={msg.id} className="bacman-msg">
                    <MessageBubble msg={msg} />
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="bacman-msg flex gap-2 items-end">
                    <div className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-500/30
                                    flex items-center justify-center flex-shrink-0 mb-0.5">
                      <span className="text-violet-300 text-xs font-bold">B</span>
                    </div>
                    <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                      <TypingDots />
                    </div>
                  </div>
                )}

                {/* Suggestion chips — shown after every assistant response */}
                {!loading && messages.at(-1)?.role === 'assistant' && !messages.at(-1)?.streaming && (
                  <div className="flex flex-wrap gap-2 pl-8 mt-1 bacman-msg">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        disabled={loading}
                        className="bg-violet-500/7 border border-violet-500/20 rounded-full
                                   px-3.5 py-1.5 text-[11px] font-mono text-violet-300/75
                                   hover:bg-violet-500/18 hover:border-violet-400/44 hover:text-violet-200
                                   disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="flex-shrink-0 border-t border-violet-500/10 bg-[#0a0518] px-4 py-3 pb-4">
                <div
                  className="flex items-center gap-2 bg-violet-500/5 border border-violet-500/17
                             rounded-xl px-4 py-1 focus-within:border-violet-500/38 transition-colors"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about experience, projects, skills…"
                    disabled={loading}
                    maxLength={1000}
                    aria-label="Type a message"
                    className="flex-1 bg-transparent border-none outline-none
                               text-violet-100 font-mono text-[12.5px] py-2.5
                               placeholder:text-violet-500/30 disabled:opacity-45
                               caret-violet-400"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className="w-9 h-9 flex-shrink-0 rounded-[9px] flex items-center justify-center
                               bg-violet-500/13 border border-violet-500/30 text-violet-400
                               hover:bg-violet-500/26 disabled:opacity-30 disabled:cursor-not-allowed
                               transition-all"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 8L14 2L8 14L7 9L2 8Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                <p className="text-center mt-2 text-[9px] font-sans tracking-[0.1em] text-white/10">
                  BAC-MAN · POWERED BY CLAUDE + AWS BEDROCK · BHASANTH.TECH
                </p>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default BacMan
