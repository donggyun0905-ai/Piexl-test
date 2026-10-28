// 패왕전 랭크 티어 로고 (SVG): 티어마다 모양·색·장식이 다름 · 단계(III·II·I)는 아래 보석 수 (I가 셋)
// 흙(갈라진 둥근 방패) · 돌(육각 돌판) · 청동(작은 날개 방패) · 은(엇갈린 칼 방패) · 금(왕관 날개 방패)
// · 수정(빛나는 수정 다발) · 성좌(별자리 고리 방패) · 패왕(불꽃 날개와 왕관)
import type { RankTier } from "@pixel-rogue/shared";
import type { ReactNode } from "react";

interface Look {
  main: string;
  dark: string;
  light: string;
}

const LOOK: Record<RankTier, Look> = {
  clay: { main: "#9a6a44", dark: "#5e3e26", light: "#c89a6a" },
  stone: { main: "#8a8a92", dark: "#4e4e58", light: "#c4c4cc" },
  bronze: { main: "#c07a3a", dark: "#6e4018", light: "#f0b070" },
  silver: { main: "#b8c4d4", dark: "#5e6a7e", light: "#f2f6ff" },
  gold: { main: "#f2c040", dark: "#9a6a10", light: "#fff2a0" },
  crystal: { main: "#5ad8e8", dark: "#1e7a9a", light: "#d8fbff" },
  star: { main: "#6a5ae8", dark: "#2a1e7a", light: "#c8c0ff" },
  overlord: { main: "#e8443a", dark: "#7a1018", light: "#ffd860" },
};

/** 방패 모양 (가운데 50,52) */
const SHIELD = "M50 14 L80 24 L78 56 Q74 78 50 90 Q26 78 22 56 L20 24 Z";

function body(tier: RankTier, k: Look): ReactNode {
  switch (tier) {
    case "clay":
      return (
        <>
          <circle cx="50" cy="52" r="32" fill={k.main} stroke={k.dark} strokeWidth="4" />
          <path d="M38 30 L46 46 L40 58 L50 72 M62 34 L56 48 L64 60" stroke={k.dark} strokeWidth="3" fill="none" />
          <circle cx="50" cy="52" r="10" fill={k.light} opacity="0.5" />
        </>
      );
    case "stone":
      return (
        <>
          <path d="M50 16 L82 34 L82 70 L50 88 L18 70 L18 34 Z" fill={k.main} stroke={k.dark} strokeWidth="4" />
          <path d="M50 30 L68 40 L68 64 L50 74 L32 64 L32 40 Z" fill={k.light} opacity="0.35" />
          <path d="M26 40 L40 46 M74 60 L60 56" stroke={k.dark} strokeWidth="3" />
        </>
      );
    case "bronze":
      return (
        <>
          <path d="M22 34 L6 26 L12 44 L4 50 L22 54 Z M78 34 L94 26 L88 44 L96 50 L78 54 Z" fill={k.dark} />
          <path d={SHIELD} fill={k.main} stroke={k.dark} strokeWidth="4" />
          <path d="M50 30 L60 50 L50 72 L40 50 Z" fill={k.light} />
        </>
      );
    case "silver":
      return (
        <>
          <path d="M14 18 L86 86 M86 18 L14 86" stroke={k.dark} strokeWidth="7" strokeLinecap="round" />
          <path d="M14 18 L86 86 M86 18 L14 86" stroke={k.light} strokeWidth="3" strokeLinecap="round" />
          <path d={SHIELD} fill={k.main} stroke={k.dark} strokeWidth="4" />
          <path d="M50 28 L54 46 L70 50 L54 54 L50 74 L46 54 L30 50 L46 46 Z" fill={k.light} />
        </>
      );
    case "gold":
      return (
        <>
          <path d="M22 40 Q2 30 4 12 Q16 26 24 26 Z M78 40 Q98 30 96 12 Q84 26 76 26 Z" fill={k.main} stroke={k.dark} strokeWidth="2" />
          <path d={SHIELD} fill={k.main} stroke={k.dark} strokeWidth="4" />
          <path d="M34 50 L38 36 L44 46 L50 32 L56 46 L62 36 L66 50 Z" fill={k.light} stroke={k.dark} strokeWidth="2" />
          <rect x="34" y="52" width="32" height="6" fill={k.dark} />
          <circle cx="50" cy="68" r="6" fill={k.light} />
        </>
      );
    case "crystal":
      return (
        <>
          <path d="M50 8 L64 40 L50 92 L36 40 Z" fill={k.main} stroke={k.dark} strokeWidth="3" />
          <path d="M28 30 L38 52 L30 82 L18 52 Z M72 30 L82 52 L70 82 L62 52 Z" fill={k.light} stroke={k.dark} strokeWidth="3" />
          <path d="M50 8 L50 92" stroke={k.light} strokeWidth="3" />
          <circle cx="50" cy="40" r="4" fill="#ffffff" />
        </>
      );
    case "star":
      return (
        <>
          <circle cx="50" cy="52" r="42" fill="none" stroke={k.light} strokeWidth="2" strokeDasharray="4 6" />
          <path d={SHIELD} fill={k.main} stroke={k.dark} strokeWidth="4" />
          <path d="M36 36 L52 44 L62 34 L66 56 L48 68" stroke={k.light} strokeWidth="2" fill="none" />
          {[[36, 36], [52, 44], [62, 34], [66, 56], [48, 68]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#ffffff" />
          ))}
        </>
      );
    case "overlord":
      return (
        <>
          <path d="M20 60 Q0 40 10 10 Q20 34 30 36 Z M80 60 Q100 40 90 10 Q80 34 70 36 Z" fill={k.light} stroke={k.dark} strokeWidth="2" />
          <path d="M24 64 Q10 46 18 26 Q26 42 34 44 Z M76 64 Q90 46 82 26 Q74 42 66 44 Z" fill={k.main} />
          <path d={SHIELD} fill={k.dark} stroke={k.light} strokeWidth="4" />
          <path d="M30 52 L34 28 L42 42 L50 22 L58 42 L66 28 L70 52 Z" fill={k.light} stroke={k.main} strokeWidth="2" />
          <path d="M50 58 Q60 66 50 82 Q40 66 50 58 Z" fill={k.main} />
        </>
      );
  }
}

/** div: 3·2·1 (0이면 보석 없음) */
export function RankEmblem({ tier, div, size = 64 }: { tier: RankTier; div: number; size?: number }) {
  const k = LOOK[tier];
  const gems = div > 0 ? 4 - div : 0;
  return (
    <svg className={`rank-emblem ${tier}`} width={size} height={size} viewBox="0 0 100 110" aria-hidden="true">
      {body(tier, k)}
      {Array.from({ length: gems }, (_, i) => (
        <path key={i} d={`M${50 + (i - (gems - 1) / 2) * 14} 96 l5 6 l-5 6 l-5 -6 Z`} fill={k.light} stroke={k.dark} strokeWidth="1.5" />
      ))}
    </svg>
  );
}
