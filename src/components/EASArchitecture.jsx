import { useState, useEffect, useRef } from "react";

/*
  EAS-001 Architecture Diagram
  Portfolio-ready for bhasanth.com
  Original navy + cyan diagram palette; only the modal/root background is overridden.
*/

const C = {
  bg: "#060B18",
  navy: "#0A1628",
  navyLight: "#0F1F38",
  navyMid: "#132642",
  cyan: "#00E5FF",
  cyanDim: "#00E5FF88",
  cyanGlow: "#00E5FF22",
  cyanSubtle: "#00E5FF0A",
  emerald: "#34D399",
  emeraldDim: "#34D39988",
  amber: "#F59E0B",
  amberDim: "#F59E0B88",
  rose: "#FB7185",
  roseDim: "#FB718588",
  violet: "#A78BFA",
  violetDim: "#A78BFA88",
  white: "#F0F6FF",
  text: "#C5D3E8",
  muted: "#5A7092",
  dim: "#2A3F5F",
};

// Glow filter for SVG
const GlowDefs = () => (
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glowStrong" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.cyan} stopOpacity="0.8" />
      <stop offset="100%" stopColor={C.cyan} stopOpacity="0.15" />
    </linearGradient>
    <linearGradient id="feedbackGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor={C.emerald} stopOpacity="0.6" />
      <stop offset="100%" stopColor={C.cyan} stopOpacity="0.2" />
    </linearGradient>
  </defs>
);

const AnimatedPath = ({ d, color, delay = 0, dashed = false }) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeDasharray={dashed ? "4 4" : "none"}
    style={{
      opacity: 0,
      animation: `fadeSlide 0.6s ease ${delay}s forwards`,
    }}
  />
);

const FlowArrow = ({ x1, y1, x2, y2, color = C.cyanDim, delay = 0 }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const tipX = x2 - ux * 7, tipY = y2 - uy * 7;
  return (
    <g style={{ opacity: 0, animation: `fadeSlide 0.5s ease ${delay}s forwards` }}>
      <line x1={x1} y1={y1} x2={tipX} y2={tipY} stroke={color} strokeWidth="1.5" />
      <polygon points={`${x2},${y2} ${tipX - uy * 4},${tipY + ux * 4} ${tipX + uy * 4},${tipY - ux * 4}`} fill={color} />
    </g>
  );
};

const Node = ({ x, y, w, h, label, sub, color, refNum, delay = 0, glow = false }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 0,
        animation: `fadeSlide 0.6s ease ${delay}s forwards`,
        cursor: "default",
      }}
    >
      {/* Glow background on hover */}
      {(hovered || glow) && (
        <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="10"
          fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" filter="url(#glowStrong)" />
      )}
      {/* Card */}
      <rect x={x} y={y} width={w} height={h} rx="8"
        fill={hovered ? "#0a0a0a" : "#000000"}
        stroke={color} strokeWidth={hovered ? "2" : "1.2"} strokeOpacity={hovered ? 1 : 0.7}
        style={{ transition: "all 0.25s ease" }}
      />
      {/* Color accent bar */}
      <rect x={x} y={y} width="4" height={h} rx="2" fill={color} opacity="0.8" />
      {/* Label */}
      <text x={x + 16} y={y + (sub ? h / 2 - 6 : h / 2 + 1)} dominantBaseline="central"
        fill={C.white} fontSize="11.5" fontWeight="600"
        fontFamily="'Outfit', sans-serif">{label}</text>
      {/* Sub */}
      {sub && (
        <text x={x + 16} y={y + h / 2 + 9} dominantBaseline="central"
          fill={C.muted} fontSize="9"
          fontFamily="'JetBrains Mono', monospace">{sub}</text>
      )}
      {/* Ref number */}
      {refNum && (
        <text x={x + w - 10} y={y + 13} textAnchor="end"
          fill={color} fontSize="8" fontWeight="700" opacity="0.7"
          fontFamily="'JetBrains Mono', monospace">{refNum}</text>
      )}
    </g>
  );
};

const PulsingDot = ({ cx, cy, color, delay = 0 }) => (
  <g style={{ opacity: 0, animation: `fadeSlide 0.4s ease ${delay}s forwards` }}>
    <circle cx={cx} cy={cy} r="3" fill={color} opacity="0.8">
      <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx={cx} cy={cy} r="2" fill={color} />
  </g>
);

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="eas-arch" style={{
      background: `radial-gradient(ellipse at 30% 20%, rgba(10, 132, 255, 0.06) 0%, #000000 70%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      fontFamily: "'Outfit', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .eas-arch, .eas-arch * { box-sizing: border-box; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes titleIn {
          from { opacity: 0; letter-spacing: 8px; }
          to { opacity: 1; letter-spacing: 3px; }
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -20; }
        }
      `}</style>

      {/* Title block */}
      <div style={{ textAlign: "center", marginBottom: 28, opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, margin: "0 0 6px 0", lineHeight: 1.2 }}>
          Emotional Alignment System
        </h1>
        <p style={{ fontSize: 12, color: C.muted, maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>
          Closed-loop evaluation and optimization of emotional alignment in AI-generated conversational responses
        </p>
      </div>

      {/* Main diagram */}
      <svg viewBox="0 0 700 560" style={{ width: "100%", maxWidth: 750 }}>
        <GlowDefs />

        {/* Subtle grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.dim} strokeWidth="0.15" />
        </pattern>
        <rect width="700" height="560" fill="url(#grid)" opacity="0.3" />

        {/* ─── CONNECTION PATHS ─── */}
        {/* User → LLM */}
        <FlowArrow x1={350} y1={52} x2={350} y2={78} color={C.muted} delay={0.3} />
        {/* LLM → Encoder (left branch: user input) */}
        <FlowArrow x1={280} y1={112} x2={280} y2={150} color={C.violetDim} delay={0.5} />
        {/* LLM → Encoder (right branch: candidates) */}
        <FlowArrow x1={420} y1={112} x2={420} y2={150} color={C.violetDim} delay={0.5} />
        {/* Encoder → Alignment */}
        <FlowArrow x1={350} y1={186} x2={350} y2={218} color={C.cyanDim} delay={0.7} />
        {/* Alignment → Trajectory (left) */}
        <FlowArrow x1={250} y1={254} x2={195} y2={290} color={C.amberDim} delay={0.9} />
        {/* Alignment → Outcome (right) */}
        <FlowArrow x1={450} y1={254} x2={505} y2={290} color={C.roseDim} delay={0.9} />
        {/* Trajectory → Outcome (horizontal) */}
        <FlowArrow x1={290} y1={316} x2={410} y2={316} color={C.dim} delay={1.1} />
        {/* Trajectory → Optimizer */}
        <FlowArrow x1={160} y1={336} x2={240} y2={378} color={C.amberDim} delay={1.2} />
        {/* Outcome → Optimizer */}
        <FlowArrow x1={540} y1={336} x2={460} y2={378} color={C.roseDim} delay={1.2} />
        {/* Optimizer → Output */}
        <FlowArrow x1={350} y1={420} x2={350} y2={455} color={C.emeraldDim} delay={1.4} />

        {/* Feedback loop path */}
        <path
          d="M 530 398 L 610 398 L 610 95 L 500 95"
          fill="none" stroke={C.emeraldDim} strokeWidth="1"
          strokeDasharray="5 5"
          style={{
            opacity: 0,
            animation: `fadeSlide 0.6s ease 1.6s forwards`,
          }}
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
        </path>
        <polygon points="502,91 502,99 495,95" fill={C.emeraldDim}
          style={{ opacity: 0, animation: `fadeSlide 0.4s ease 1.7s forwards` }} />
        <text x="618" y="250" fill={C.emerald} fontSize="8" fontWeight="500" opacity="0.6"
          fontFamily="'JetBrains Mono', monospace" transform="rotate(90,618,250)"
          style={{ opacity: 0, animation: `fadeSlide 0.4s ease 1.8s forwards` }}>
          FEEDBACK LOOP
        </text>

        {/* Pulsing data dots along main flow */}
        <PulsingDot cx={350} cy={65} color={C.muted} delay={0.4} />
        <PulsingDot cx={350} cy={200} color={C.violet} delay={0.8} />
        <PulsingDot cx={350} cy={370} color={C.cyan} delay={1.3} />

        {/* ─── NODES ─── */}
        <Node x={255} y={16} w={190} h={36} label="User Input Interface" color={C.muted} refNum="110" delay={0.1} />

        <Node x={210} y={78} w={280} h={34} label="LLM Response Generator" sub="N candidate responses" color={C.cyan} refNum="120" delay={0.3} />

        {/* Small labels for branches */}
        <text x={235} y={142} fill={C.muted} fontSize="8" fontFamily="'JetBrains Mono', monospace"
          style={{ opacity: 0, animation: `fadeSlide 0.4s ease 0.5s forwards` }}>user input</text>
        <text x={425} y={142} fill={C.muted} fontSize="8" fontFamily="'JetBrains Mono', monospace"
          style={{ opacity: 0, animation: `fadeSlide 0.4s ease 0.5s forwards` }}>candidates</text>

        <Node x={175} y={150} w={350} h={36} label="Emotion Encoder Module" sub="Transformer → E(x) = [v, a, e, f, u, t] ∈ ℝ⁶" color={C.violet} refNum="130" delay={0.5} />

        <Node x={160} y={218} w={380} h={36} label="Emotional Alignment Engine" sub="S = f(E_user, E_resp, I) — Relational Scoring" color={C.cyan} refNum="140" delay={0.7} glow />

        <Node x={65} y={290} w={225} h={46} label="Trajectory Model" sub="Turn-by-turn emotional progression" color={C.amber} refNum="150" delay={0.9} />
        <Node x={410} y={290} w={225} h={46} label="Outcome Predictor" sub="CSAT · Escalation · Resolution · Churn" color={C.rose} refNum="160" delay={0.9} />

        <Node x={150} y={378} w={400} h={42} label="Closed-Loop Optimization Module" sub="Re-Rank (A) · RLHF Reward (B) · Constrained Decode (C)" color={C.cyan} refNum="170" delay={1.2} />

        <Node x={240} y={455} w={220} h={36} label="Optimized Response" color={C.emerald} delay={1.4} />

        {/* ─── BOTTOM LEGEND ─── */}
        <g style={{ opacity: 0, animation: `fadeSlide 0.5s ease 2s forwards` }}>
          <rect x={70} y={510} width={560} height={38} rx="6" fill="#000000" stroke={C.dim} strokeWidth="0.5" />
          {[
            { label: "Encoder", color: C.violet, x: 95 },
            { label: "Alignment", color: C.cyan, x: 195 },
            { label: "Trajectory", color: C.amber, x: 310 },
            { label: "Outcome", color: C.rose, x: 420 },
            { label: "Optimizer", color: C.cyan, x: 520 },
          ].map((item) => (
            <g key={item.label}>
              <rect x={item.x} y={523} width={10} height={10} rx="2" fill={item.color} opacity="0.7" />
              <text x={item.x + 16} y={530} fill={C.text} fontSize="9" fontWeight="500" fontFamily="'Outfit', sans-serif">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>

      {/* Footer badge */}
      <div style={{
        marginTop: 20,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: mounted ? 1 : 0,
        transition: "opacity 1s ease 2.2s",
      }}>
        <div style={{
          padding: "5px 12px",
          borderRadius: 6,
          border: `1px solid ${C.dim}`,
          background: "#000000",
          fontSize: 9,
          fontFamily: "'JetBrains Mono', monospace",
          color: C.muted,
        }}>
          20 Claims · 8 Figures · 63 Paragraphs
        </div>
      </div>
    </div>
  );
}
