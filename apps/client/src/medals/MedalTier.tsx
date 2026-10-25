// 훈장 단계 꾸밈 (금기 점수·모드 기록이 높을수록 더 화려하게): 뒤 = 빛살·후광·불꽃 · 앞 = 고리·보석·왕관·숫자 패
// 단계 0 꾸밈 없음 · 1 동 · 2 은 (날개) · 3 금 (빛살·보석) · 4 흑요석 (보라 가시 후광) · 5 전설 (불꽃·왕관) · 6 태초 (무지개 후광·왕관·불꽃)

/** 단계마다 금속 색 (밝은 · 어두운) */
const METAL: [string, string][] = [
  ["#fff", "#888"],
  ["#f0b080", "#7a3a14"],
  ["#ffffff", "#8a90a8"],
  ["#fff2a0", "#b07810"],
  ["#d0a0ff", "#2a0a4a"],
  ["#ffd060", "#c02010"],
  ["#ffffff", "#ff40c0"],
];

/** (cx,cy)에서 n갈래 뾰족한 모양 */
function spikes(n: number, r1: number, r2: number, cx = 50, cy = 62): string {
  return Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * Math.PI) / n - Math.PI / 2;
    const r = i % 2 ? r2 : r1;
    return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
}

export function MedalBack({ tier, uid }: { tier: number; uid: string }) {
  if (tier < 2) return null;
  const [hi, lo] = METAL[tier]!;
  return (
    <g>
      <defs>
        <radialGradient id={`h${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.5" stopColor={hi} stopOpacity="0.9" />
          <stop offset="1" stopColor={lo} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`r${uid}`} x1="0" y1="0" x2="1" y2="1">
          {["#ff5050", "#ffd040", "#50ff90", "#50c0ff", "#c060ff"].map((c, i) => (
            <stop key={c} offset={i / 4} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      {tier >= 5 && <Flames color={tier === 6 ? `url(#r${uid})` : "#ff6020"} />}
      {tier === 2 && <Wings color={hi} edge={lo} />}
      {tier >= 3 && <polygon className="medal-rays" points={spikes(tier >= 4 ? 16 : 12, tier >= 4 ? 48 : 44, 30)} fill={tier === 6 ? `url(#r${uid})` : `url(#h${uid})`} opacity={tier === 4 ? 0.85 : 0.7} />}
      {tier >= 4 && <circle cx="50" cy="62" r="40" fill="none" stroke={tier === 6 ? `url(#r${uid})` : hi} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />}
    </g>
  );
}

/** label: 오른쪽 위 숫자 패 (없으면 안 그림) */
export function MedalFront({ tier, label }: { tier: number; label?: string }) {
  if (tier < 1) return null;
  const [hi, lo] = METAL[tier]!;
  return (
    <g>
      {/* 금속 고리 */}
      <circle cx="50" cy="62" r="25.5" fill="none" stroke={hi} strokeWidth="2.2" />
      {/* 별 끝 보석 */}
      {tier >= 3 &&
        [0, 1, 2, 3, 5, 6, 7].map((i) => {
          const a = (i * Math.PI) / 4 - Math.PI / 2;
          return <circle key={i} cx={50 + Math.cos(a) * 31} cy={62 + Math.sin(a) * 31} r={tier >= 4 ? 2.6 : 2} fill={tier >= 4 ? hi : "#ff4060"} stroke={lo} strokeWidth="0.8" />;
        })}
      {tier >= 5 && <Crown color={hi} edge={lo} />}
      {/* 숫자 패 (오른쪽 위) */}
      {label && (
      <g transform="translate(80 30)">
        <polygon points={spikes(tier >= 4 ? 6 : 4, 13, 10, 0, 0)} fill={lo} stroke={hi} strokeWidth="1.6" />
        <text y="4.2" textAnchor="middle" fontSize={label.length >= 3 ? 9 : 11} fontWeight="900" fill={hi} fontFamily="monospace">
          {label}
        </text>
      </g>
      )}
    </g>
  );
}

/** 은 훈장 양쪽 날개 */
function Wings({ color, edge }: { color: string; edge: string }) {
  const one = "M24 62 L4 46 L10 56 L2 58 L12 64 L6 70 L22 70 Z";
  return (
    <g fill={color} stroke={edge} strokeWidth="1">
      <path d={one} />
      <path d={one} transform="translate(100 0) scale(-1 1)" />
    </g>
  );
}

/** 전설·태초 훈장 뒤 불꽃 */
function Flames({ color }: { color: string }) {
  return (
    <g className="medal-flames" fill={color} opacity="0.85">
      <path d="M50 108 C20 100 8 76 16 52 C20 66 26 70 30 70 C22 52 30 34 40 26 C38 44 46 50 50 50 C54 50 62 44 60 26 C70 34 78 52 70 70 C74 70 80 66 84 52 C92 76 80 100 50 108 Z" />
    </g>
  );
}

/** 왕관 (가운데 위) */
function Crown({ color, edge }: { color: string; edge: string }) {
  return (
    <g>
      <path d="M36 40 L36 26 L43 33 L50 20 L57 33 L64 26 L64 40 Z" fill={color} stroke={edge} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="50" cy="20" r="2.4" fill="#ff3050" stroke={edge} strokeWidth="0.8" />
      <circle cx="36" cy="26" r="1.8" fill="#40c0ff" />
      <circle cx="64" cy="26" r="1.8" fill="#40c0ff" />
    </g>
  );
}
