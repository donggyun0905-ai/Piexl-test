// 트럼프 그림 카드 그림 (SVG): J·Q·K 왕실 인물(위아래 대칭) · 조커 광대
const SKIN = "#f6d8b8";

/** J·Q·K: 액자 안에 위쪽 반신을 그리고 아래로 뒤집어 한 번 더 · 무늬색 옷 · 왕관(K) · 보석 관(Q) · 깃 모자(J) */
export function RoyalFace({ rank, suit, red }: { rank: number; suit: string; red: boolean }) {
  const ink = red ? "#d0283a" : "#1e1c28";
  const robe = red ? "#c8283a" : "#2a4ab0";
  const trim = red ? "#2a4ab0" : "#c8283a";
  return (
    <g>
      <rect x="11" y="12" width="38" height="60" rx="2" fill="#fff8e8" stroke={ink} strokeWidth="0.8" />
      <clipPath id={`pc-frame-${rank}`}>
        <rect x="11" y="12" width="38" height="60" rx="2" />
      </clipPath>
      <g clipPath={`url(#pc-frame-${rank})`}>
        <Half rank={rank} robe={robe} trim={trim} ink={ink} />
        <g transform="rotate(180 30 42)">
          <Half rank={rank} robe={robe} trim={trim} ink={ink} />
        </g>
      </g>
      <line x1="11" y1="42" x2="49" y2="42" stroke={ink} strokeWidth="0.5" strokeOpacity="0.5" />
      <text x="15" y="20" fontSize="7" fill={ink}>
        {suit}
      </text>
      <text x="45" y="68" fontSize="7" fill={ink} transform="rotate(180 45 66)">
        {suit}
      </text>
    </g>
  );
}

/** 위쪽 반신 (가운데 줄 42까지) */
function Half({ rank, robe, trim, ink }: { rank: number; robe: string; trim: string; ink: string }) {
  return (
    <g strokeLinejoin="round">
      {/* 어깨·옷 (줄무늬 깃) */}
      <path d="M14 42 Q16 33 24 31 L36 31 Q44 33 46 42 Z" fill={robe} stroke={ink} strokeWidth="0.6" />
      <path d="M24 31 L30 40 L36 31" fill="#f4e4b0" stroke={ink} strokeWidth="0.5" />
      <path d="M17 38 L22 33 M43 38 L38 33" stroke={trim} strokeWidth="1.4" />
      <path d="M26 33 L30 39 L34 33" fill="none" stroke="#e8b040" strokeWidth="0.8" />
      {/* 얼굴 · 머리카락 */}
      <path d="M23.5 22 Q22.5 31 30 31.5 Q37.5 31 36.5 22 Z" fill={rank === 11 ? "#e8b040" : "#6a4024"} />
      <ellipse cx="30" cy="25" rx="5.2" ry="6" fill={SKIN} stroke={ink} strokeWidth="0.5" />
      <path d="M27.6 24.6 h1.2 M31.2 24.6 h1.2" stroke="#222" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M28.6 28.2 Q30 29 31.4 28.2" fill="none" stroke="#a03030" strokeWidth="0.5" />
      {rank === 12 && <path d="M25.5 28 Q30 34 34.5 28 Q30 31 25.5 28 Z" fill="#8a5a34" />}
      {/* 머리 장식: K 왕관 · Q 보석 관 · J 깃 모자 */}
      {rank === 12 && <path d="M23.5 20 L23.5 14.5 L26.5 17.5 L30 13 L33.5 17.5 L36.5 14.5 L36.5 20 Z" fill="#f2c14e" stroke={ink} strokeWidth="0.5" />}
      {rank === 11 && (
        <>
          <path d="M24.5 20 Q30 14 35.5 20 Z" fill="#f2c14e" stroke={ink} strokeWidth="0.5" />
          <circle cx="30" cy="17" r="1.2" fill={trim} />
        </>
      )}
      {rank === 10 && (
        <>
          <path d="M23 21 Q30 15 37 21 Z" fill={trim} stroke={ink} strokeWidth="0.5" />
          <path d="M35 18 Q41 13 44 15 Q39 16 36.5 20" fill="#f4e4b0" stroke={ink} strokeWidth="0.4" />
        </>
      )}
      {rank === 12 && <circle cx="30" cy="15.5" r="0.9" fill={trim} />}
      {/* 손에 든 것: K 홀 · Q 꽃 · J 창 */}
      {rank === 12 && <path d="M41 42 L41 22 M39.4 22.5 h3.2" stroke="#c8862a" strokeWidth="1.2" />}
      {rank === 11 && (
        <>
          <path d="M19 41 L19 30" stroke="#3a8a3a" strokeWidth="0.8" />
          <circle cx="19" cy="29" r="2" fill="#ff8ab0" stroke={ink} strokeWidth="0.4" />
        </>
      )}
      {rank === 10 && <path d="M18 42 L18 18 M16.6 20 L18 15.5 L19.4 20 Z" stroke="#8a8aa0" strokeWidth="0.9" fill="#c8c8d8" />}
    </g>
  );
}

/** 조커: 고깔 모자 광대 + 별 · 무지개 글자 */
export function JokerFace() {
  return (
    <g>
      <text x="7" y="13" fontSize="6.5" fontWeight="800" fill="#d0283a" fontFamily="sans-serif" textAnchor="middle" writingMode="tb">
        JOKER
      </text>
      <path d="M18 34 L24 14 L30 30 L36 12 L42 34 Z" fill="#7a3ab0" stroke="#2a2030" strokeWidth="0.6" />
      <path d="M24 14 L27 22 M36 12 L33 21" stroke="#ffd860" strokeWidth="1" />
      <circle cx="24" cy="13" r="2" fill="#ffd860" stroke="#2a2030" strokeWidth="0.4" />
      <circle cx="36" cy="11" r="2" fill="#ffd860" stroke="#2a2030" strokeWidth="0.4" />
      <ellipse cx="30" cy="42" rx="11" ry="11.5" fill={SKIN} stroke="#2a2030" strokeWidth="0.6" />
      <path d="M24 39 l3 -2 l3 2 M30 39 l3 -2 l3 2" fill="none" stroke="#2a2030" strokeWidth="0.8" />
      <circle cx="30" cy="44" r="2.4" fill="#e8283a" />
      <path d="M23.5 47 Q30 55 36.5 47" fill="#fff" stroke="#2a2030" strokeWidth="0.6" />
      <path d="M17 58 L22 52 L26 58 L30 52 L34 58 L38 52 L43 58 L43 66 L17 66 Z" fill="#2a8ad0" stroke="#2a2030" strokeWidth="0.5" />
      <path d="M22 52 L22 66 M30 52 L30 66 M38 52 L38 66" stroke="#ffd860" strokeWidth="0.8" />
      <path d="M30 70 L31.4 73.6 L35 74 L32.2 76.2 L33 80 L30 78 L27 80 L27.8 76.2 L25 74 L28.6 73.6 Z" fill="#ffd860" stroke="#c8862a" strokeWidth="0.4" />
    </g>
  );
}
