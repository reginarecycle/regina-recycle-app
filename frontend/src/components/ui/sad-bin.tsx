import { useEffect, useRef, useState } from "react";

function SadBin() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [pupilL, setPupilL] = useState({ x: 0, y: 0 });
    const [pupilR, setPupilR] = useState({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = useState(false);
    const [isDancing, setIsDancing] = useState(false);
  
    useEffect(() => {
      const handleMove = (e: MouseEvent) => {
        if (!svgRef.current || isBlinking) return;
        const rect = svgRef.current.getBoundingClientRect();
        const sx = rect.width / 260, sy = rect.height / 320;
        const calc = (cx: number, cy: number) => {
          const ex = cx * sx + rect.left, ey = cy * sy + rect.top;
          const a = Math.atan2(e.clientY - ey, e.clientX - ex);
          const d = Math.min(5, Math.hypot(e.clientX - ex, e.clientY - ey) / 18);
          return { x: Math.cos(a) * d, y: Math.sin(a) * d };
        };
        setPupilL(calc(94, 152));
        setPupilR(calc(160, 150));
      };
      window.addEventListener("mousemove", handleMove);
      return () => window.removeEventListener("mousemove", handleMove);
    }, [isBlinking]);
  
    useEffect(() => {
      const blink = () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 130);
      };
      const t = setTimeout(blink, 1600);
      const i = setInterval(blink, 3000 + Math.random() * 2000);
      return () => { clearTimeout(t); clearInterval(i); };
    }, []);
  
    useEffect(() => {
      const dance = () => {
        setIsDancing(true);
        setTimeout(() => setIsDancing(false), 1050);
      };
      const t = setTimeout(dance, 1200);
      const i = setInterval(dance, 4000);
      return () => { clearTimeout(t); clearInterval(i); };
    }, []);
  
    const C  = "#344E41";
    const CD = "#213b2c";
    const CL = "#4a6a55";
  
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 260 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block overflow-visible"
        style={{
          animation: isDancing ? "sadDance 1s ease-in-out" : "none",
          transformOrigin: "center bottom",
        }}
      >
        <style>{`
          @keyframes sadDance {
            0%   { transform: rotate(0deg) translateY(0); }
            12%  { transform: rotate(-6deg) translateY(-14px); }
            28%  { transform: rotate(5deg) translateY(-7px); }
            44%  { transform: rotate(-5deg) translateY(-16px); }
            60%  { transform: rotate(4deg) translateY(-5px); }
            75%  { transform: rotate(-3deg) translateY(-10px); }
            88%  { transform: rotate(2deg) translateY(-2px); }
            100% { transform: rotate(0deg) translateY(0); }
          }
          @keyframes lidFloat {
            0%,100% { transform: translateY(0); }
            50%     { transform: translateY(-6px); }
          }
          .lid-anim { animation: lidFloat 2.8s ease-in-out infinite; }
        `}</style>
  
        {/* Lid */}
        <g className="lid-anim">
          <path d="M 28 62 L 232 62 L 232 70 L 28 70 Z" fill={CD} />
          <path d="M 24 68 L 236 68 L 236 82 L 24 82 Z" fill="#3e6050" />
          <path d="M 28 70 L 232 70 L 232 75 L 28 75 Z" fill="#527a66" opacity="0.4" />
          <rect x="74"  y="58" width="20" height="9" rx="4" fill={CD} />
          <rect x="118" y="56" width="20" height="9" rx="4" fill={CD} />
          <rect x="162" y="58" width="20" height="9" rx="4" fill={CD} />
          <rect x="92" y="54" width="76" height="7" rx="3.5" fill={CD} />
          <path d="M 24 82 L 236 82 L 234 90 L 26 90 Z" fill={CD} opacity="0.6" />
        </g>
  
        {/* Body */}
        <path d="M 210 90 L 236 94 L 238 268 L 212 264 Z" fill={CD} />
        <path d="M 26 90 L 210 90 L 212 264 L 24 264 Z" fill={C} />
        <path d="M 26 90 L 50 90 L 50 264 L 26 264 Z" fill={CL} opacity="0.45" />
        <path d="M 24 84 L 212 84 L 212 94 L 24 94 Z" fill={CD} />
        <path d="M 212 84 L 236 88 L 236 96 L 212 94 Z" fill="#162418" />
  
        {/* Ribs */}
        {[86, 128, 170].map((x, i) => (
          <g key={i}>
            <path d={`M ${x} 92 Q ${x + 2} 178 ${x + 1} 262`} stroke={CD} strokeWidth="16" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d={`M ${x} 92 Q ${x + 2} 178 ${x + 1} 262`} stroke={C}  strokeWidth="9"  strokeLinecap="round" fill="none" opacity="0.3" />
          </g>
        ))}
        <path d="M 24 128 L 212 128 L 212 136 L 24 136 Z" fill={CD} opacity="0.45" />
  
        {/* Face */}
        <ellipse cx="94"  cy="152" rx="22" ry="20" fill={CD} opacity="0.45" />
        <ellipse cx="160" cy="150" rx="22" ry="20" fill={CD} opacity="0.45" />
        <ellipse cx="94"  cy="152" rx="18" ry={isBlinking ? 2 : 16} fill="white" />
        <ellipse cx="160" cy="150" rx="18" ry={isBlinking ? 2 : 16} fill="white" />
        {!isBlinking && (
          <>
            <circle cx={94  + pupilL.x} cy={152 + pupilL.y} r="8" fill={CD} />
            <circle cx={160 + pupilR.x} cy={150 + pupilR.y} r="8" fill={CD} />
            <circle cx={97  + pupilL.x} cy={149 + pupilL.y} r="2.5" fill="white" />
            <circle cx={163 + pupilR.x} cy={147 + pupilR.y} r="2.5" fill="white" />
          </>
        )}
  
        {/* Sad mouth */}
        <path d="M 84 175 Q 127 165 168 174" stroke={CD} strokeWidth="4.5" fill="none" strokeLinecap="round" />
  
        {/* Worried brows */}
        <path d="M 80 138 Q 94 133 108 138"  stroke={CD} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 146 136 Q 160 131 174 136" stroke={CD} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
  
        {/* Padlock badge */}
        <circle cx="127" cy="218" r="26" fill={CD} opacity="0.5" />
        <g transform="translate(107, 206)">
          <rect x="2" y="10" width="20" height="14" rx="3" fill="rgba(255,80,80,0.72)" />
          <path d="M 6 10 V 7 a 6 6 0 0 1 12 0 v 3" stroke="rgba(255,80,80,0.72)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="12" cy="17" r="2" fill="rgba(255,255,255,0.6)" />
        </g>
  
        {/* Base */}
        <path d="M 24 264 L 212 264 L 212 274 L 24 274 Z" fill={CD} />
        <path d="M 212 264 L 236 268 L 236 278 L 212 274 Z" fill="#111f18" />
        <path d="M 56 274 L 192 274" stroke="#111" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
  
        {/* Wheels */}
        <ellipse cx="72"  cy="288" rx="22" ry="16" fill="#111" />
        <ellipse cx="72"  cy="286" rx="22" ry="16" fill="#222" />
        <ellipse cx="72"  cy="286" rx="11" ry="8"  fill="#111" />
        <ellipse cx="176" cy="286" rx="22" ry="16" fill="#111" />
        <ellipse cx="176" cy="284" rx="22" ry="16" fill="#222" />
        <ellipse cx="176" cy="284" rx="11" ry="8"  fill="#111" />
      </svg>
    );
  }

export default SadBin;