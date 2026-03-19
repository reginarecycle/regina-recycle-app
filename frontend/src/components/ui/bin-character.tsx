import { useState, useEffect, useRef } from "react";

export type Mood = "normal" | "happy" | "sad" | "surprised" | "angry";

// ─── Per-mood face config ─────────────────────────────────────────────────────

const MOUTH_D: Record<Mood, string> = {
  normal:    "M 84 170 Q 127 170 168 170",
  happy:     "M 84 166 Q 127 186 168 166",
  sad:       "M 84 178 Q 127 164 168 178",
  surprised: "M 115 172 Q 127 182 139 172",
  angry:     "M 84 176 Q 127 167 168 176",
};

const EYE_RY: Record<Mood, number> = {
  normal: 16, happy: 14, sad: 15, surprised: 20, angry: 9,
};

const LID_Y: Record<Mood, number> = {
  normal: 0, happy: -12, sad: 2, surprised: -22, angry: 4,
};

const BLUSH_COLOR: Record<Mood, string> = {
  normal:    "transparent",
  happy:     "#ff9999",
  sad:       "#88aaff",
  surprised: "#ffbbaa",
  angry:     "transparent",
};

const BLUSH_OPACITY: Record<Mood, number> = {
  normal: 0, happy: 0.35, sad: 0.22, surprised: 0.2, angry: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BinCharacter({ mood }: { mood: Mood }) {
  const svgRef                    = useRef<SVGSVGElement>(null);
  const [pupilL, setPupilL]       = useState({ x: 0, y: 0 });
  const [pupilR, setPupilR]       = useState({ x: 0, y: 0 });
  const [isBlinking, setBlinking] = useState(false);
  const [isDancing, setDancing]   = useState(false);
  const [lidOpen, setLidOpen]     = useState(false);
  const prevMood                  = useRef<Mood>("normal");

  // ── Mouse tracking (disabled when angry) ──
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!svgRef.current || isBlinking || mood === "angry") return;
      const rect = svgRef.current.getBoundingClientRect();
      const sx = rect.width / 260;
      const sy = rect.height / 320;
      const calc = (cx: number, cy: number) => {
        const ex = cx * sx + rect.left;
        const ey = cy * sy + rect.top;
        const a = Math.atan2(e.clientY - ey, e.clientX - ex);
        const d = Math.min(
          mood === "surprised" ? 7 : 5,
          Math.hypot(e.clientX - ex, e.clientY - ey) / 18
        );
        return { x: Math.cos(a) * d, y: Math.sin(a) * d };
      };
      setPupilL(calc(94, 148));
      setPupilR(calc(160, 146));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isBlinking, mood]);

  // ── Angry glare ──
  useEffect(() => {
    if (mood === "angry") {
      setPupilL({ x: 0, y: 2 });
      setPupilR({ x: 0, y: 2 });
    }
  }, [mood]);

  // ── Blinking cadence varies by mood ──
  useEffect(() => {
    const base =
      mood === "angry" ? 1400 :
      mood === "sad"   ? 5500 : 3000;

    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), mood === "surprised" ? 55 : 130);
    };

    const t = setTimeout(blink, 1800);
    const i = setInterval(blink, base + Math.random() * 1500);
    return () => { clearTimeout(t); clearInterval(i); };
  }, [mood]);

  // ── Dance + lid pop on happy / surprised transition ──
  useEffect(() => {
    if (prevMood.current === mood) return;
    prevMood.current = mood;
    if (mood === "happy" || mood === "surprised") {
      setDancing(true);
      setLidOpen(true);
      setTimeout(() => setLidOpen(false), 900);
      setTimeout(() => setDancing(false), 1050);
    }
  }, [mood]);

  // ── Derived values ──
  const C   = "#344E41";
  const CD  = "#213b2c";
  const CL  = "#4a6a55";

  const eyeRy     = isBlinking ? 1.5 : EYE_RY[mood];
  const pupilSize = mood === "surprised" ? 11 : 8;
  const pupilFill = mood === "angry" ? "#3a0f0f" : CD;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 260 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto block overflow-visible"
      style={{
        animation: isDancing ? "binDance 1s ease-in-out" : "none",
        transformOrigin: "center bottom",
      }}
    >
      <style>{`
        @keyframes binDance {
          0%   { transform: rotate(0deg) translateY(0); }
          12%  { transform: rotate(-6deg) translateY(-14px); }
          28%  { transform: rotate(5deg) translateY(-7px); }
          44%  { transform: rotate(-5deg) translateY(-16px); }
          60%  { transform: rotate(4deg) translateY(-5px); }
          75%  { transform: rotate(-3deg) translateY(-10px); }
          88%  { transform: rotate(2deg) translateY(-2px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes lidBob {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-4px); }
        }
        @keyframes tearFall {
          0%   { opacity: 0; transform: translateY(0px); }
          15%  { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(22px); }
        }
        @keyframes steamPuff {
          0%,100% { opacity: 0.5; transform: translateY(0) scaleX(1); }
          50%     { opacity: 0.9; transform: translateY(-3px) scaleX(1.1); }
        }
        @keyframes angryShake {
          0%,100% { transform: translateX(0); }
          25%     { transform: translateX(-2px); }
          75%     { transform: translateX(2px); }
        }
        .lid-bob    { animation: lidBob 2.6s ease-in-out infinite; }
        .tear       { animation: tearFall 2.4s ease-in infinite; }
        .tear-r     { animation: tearFall 2.4s ease-in 1s infinite; }
        .steam      { animation: steamPuff 0.7s ease-in-out infinite; }
        .steam-r    { animation: steamPuff 0.7s ease-in-out 0.35s infinite; }
        .angry-body { animation: angryShake 0.35s ease-in-out infinite; }
      `}</style>

      {/* ── LID ── */}
      <g
        className={mood !== "angry" ? "lid-bob" : ""}
        style={{
          transform: lidOpen ? "translateY(-20px)" : `translateY(${LID_Y[mood]}px)`,
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <path d="M 28 60 L 232 60 L 232 68 L 28 68 Z" fill={CD} />
        <path d="M 24 66 L 236 66 L 236 80 L 24 80 Z" fill="#3e6050" />
        <path d="M 28 68 L 232 68 L 232 73 L 28 73 Z" fill="#527a66" opacity="0.4" />
        <rect x="74"  y="56" width="20" height="9" rx="4" fill={CD} />
        <rect x="118" y="54" width="20" height="9" rx="4" fill={CD} />
        <rect x="162" y="56" width="20" height="9" rx="4" fill={CD} />
        <rect x="92"  y="52" width="76" height="7"  rx="3.5" fill={CD} />
        <path d="M 24 80 L 236 80 L 234 88 L 26 88 Z" fill={CD} opacity="0.55" />
      </g>

      {/* ── BODY (shakes when angry) ── */}
      <g className={mood === "angry" ? "angry-body" : ""}>

        {/* Structure */}
        <path d="M 210 88 L 236 92 L 238 268 L 212 264 Z" fill={CD} />
        <path d="M 26 88 L 210 88 L 212 264 L 24 264 Z" fill={C} />
        <path d="M 26 88 L 50 88 L 50 264 L 26 264 Z" fill={CL} opacity="0.45" />
        <path d="M 24 82 L 212 82 L 212 92 L 24 92 Z" fill={CD} />
        <path d="M 212 82 L 236 86 L 236 94 L 212 92 Z" fill="#162418" />

        {/* Ribs */}
        {[86, 128, 170].map((x, i) => (
          <g key={i}>
            <path
              d={`M ${x} 90 Q ${x + 2} 176 ${x + 1} 262`}
              stroke={CD} strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.6"
            />
            <path
              d={`M ${x} 90 Q ${x + 2} 176 ${x + 1} 262`}
              stroke={C} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.3"
            />
          </g>
        ))}
        <path d="M 24 126 L 212 126 L 212 134 L 24 134 Z" fill={CD} opacity="0.4" />

        {/* ── Brows ── */}
        {mood === "happy" && (
          <>
            <path d="M 78 132 Q 94 127 110 132" stroke={CD} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
            <path d="M 144 130 Q 160 125 176 130" stroke={CD} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />
          </>
        )}
        {mood === "sad" && (
          <>
            <path d="M 78 134 Q 94 129 110 134" stroke={CD} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" />
            <path d="M 144 132 Q 160 127 176 132" stroke={CD} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" />
          </>
        )}
        {mood === "surprised" && (
          <>
            <path d="M 78 126 Q 94 119 110 126" stroke={CD} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" />
            <path d="M 144 124 Q 160 117 176 124" stroke={CD} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.55" />
          </>
        )}
        {mood === "angry" && (
          <>
            <path d="M 78 130 Q 94 137 110 130" stroke="#5a1010" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
            <path d="M 144 128 Q 160 135 176 128" stroke="#5a1010" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.75" />
          </>
        )}

        {/* ── Eye sockets ── */}
        <ellipse
          cx="94" cy="148" rx="22" ry={mood === "angry" ? 16 : 20}
          fill={mood === "angry" ? "#2a0a0a" : CD} opacity="0.45"
        />
        <ellipse
          cx="160" cy="146" rx="22" ry={mood === "angry" ? 16 : 20}
          fill={mood === "angry" ? "#2a0a0a" : CD} opacity="0.45"
        />

        {/* ── Eye whites ── */}
        <ellipse cx="94"  cy="148" rx="18" ry={eyeRy} fill="white" style={{ transition: "ry 0.2s ease" }} />
        <ellipse cx="160" cy="146" rx="18" ry={eyeRy} fill="white" style={{ transition: "ry 0.2s ease" }} />

        {/* ── Pupils + catchlights ── */}
        {!isBlinking && (
          <>
            <circle cx={94  + pupilL.x} cy={148 + pupilL.y} r={pupilSize} fill={pupilFill} />
            <circle cx={160 + pupilR.x} cy={146 + pupilR.y} r={pupilSize} fill={pupilFill} />
            <circle cx={97  + pupilL.x} cy={145 + pupilL.y} r={mood === "surprised" ? 3.5 : 2.5} fill="white" />
            <circle cx={163 + pupilR.x} cy={143 + pupilR.y} r={mood === "surprised" ? 3.5 : 2.5} fill="white" />
          </>
        )}

        {/* ── Cheek blush ── */}
        {BLUSH_OPACITY[mood] > 0 && (
          <>
            <ellipse cx="70"  cy="162" rx="12" ry="7" fill={BLUSH_COLOR[mood]} opacity={BLUSH_OPACITY[mood]} />
            <ellipse cx="188" cy="160" rx="12" ry="7" fill={BLUSH_COLOR[mood]} opacity={BLUSH_OPACITY[mood]} />
          </>
        )}

        {/* ── Sad tears ── */}
        {mood === "sad" && (
          <>
            <ellipse className="tear"   cx="88"  cy="167" rx="3" ry="5" fill="#88aaee" />
            <ellipse className="tear-r" cx="166" cy="165" rx="3" ry="5" fill="#88aaee" />
          </>
        )}

        {/* ── Surprised sweat drop ── */}
        {mood === "surprised" && (
          <ellipse cx="180" cy="136" rx="4" ry="6" fill="#aad4f0" opacity="0.65" />
        )}

        {/* ── Angry steam ── */}
        {mood === "angry" && (
          <>
            <path className="steam"   d="M 56 108 Q 62 101 68 108 Q 74 115 80 108"   stroke="#cc2222" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
            <path className="steam-r" d="M 172 106 Q 178 99 184 106 Q 190 113 196 106" stroke="#cc2222" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
          </>
        )}

        {/* ── Mouth ── */}
        {mood === "surprised" ? (
          <ellipse cx="127" cy="176" rx="11" ry="10" fill={CD} opacity="0.75" />
        ) : (
          <path
            d={MOUTH_D[mood]}
            stroke={mood === "angry" ? "#4a1010" : CD}
            strokeWidth={mood === "normal" ? 4 : 4.5}
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* ── Recycling badge ── */}
        <circle
        cx="127" cy="220" r="24" 
        fill={mood === "angry" ? "#3a0a0a" : CD}
        opacity={mood === "angry" ? 0.55 : 0.4}
        />
        <text
        x="127" y="229"           
        textAnchor="middle"
        fontSize="24"
        fill={mood === "angry" ? "rgba(255,80,80,0.65)" : "rgba(255,255,255,0.55)"}
        >
          ♻
        </text>

        {/* ── Base ── */}
        <path d="M 24 264 L 212 264 L 212 274 L 24 274 Z" fill={CD} />
        <path d="M 212 264 L 236 268 L 236 278 L 212 274 Z" fill="#111f18" />
        <path d="M 56 274 L 192 274" stroke="#111" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* ── Wheels (outside shake group so they stay grounded) ── */}
      <ellipse cx="72"  cy="288" rx="22" ry="16" fill="#111" />
      <ellipse cx="72"  cy="286" rx="22" ry="16" fill="#222" />
      <ellipse cx="72"  cy="286" rx="11" ry="8"  fill="#111" />
      <ellipse cx="176" cy="286" rx="22" ry="16" fill="#111" />
      <ellipse cx="176" cy="284" rx="22" ry="16" fill="#222" />
      <ellipse cx="176" cy="284" rx="11" ry="8"  fill="#111" />
    </svg>
  );
}
