// 훈장 그림 (SVG): 보스마다 리본 색·문양 (용 = 불꽃 용머리 · 갓이터 = 엇갈린 대검 · 태초 = 빛과 어둠 반쪽) · 금빛 별 테두리·월계수 · 캐릭터 색 보석
import { useId } from "react";
import type { CharacterId } from "@pixel-rogue/shared";
import { C } from "../game/render/palette";
import { MedalBack, MedalFront } from "./MedalTier";
import { ModeEmblem } from "./ModeEmblem";
import { MODE_KINDS, type MedalKind, type ModeKind } from "./modeMedals";

/** 보스마다 리본 두 색 · 가운데 바탕 두 색 (밝은 → 어두운) */
const LOOK: Record<string, { ribbon: [string, string]; core: [string, string] }> = {
  dragon: { ribbon: ["#c8202e", "#ffb020"], core: ["#ff7a3a", "#5a0a12"] },
  godeater: { ribbon: ["#4a1a7a", "#e8c050"], core: ["#b070ff", "#1a0830"] },
  plight: { ribbon: ["#f4f0e0", "#16121e"], core: ["#fff6d0", "#2a2238"] },
  endless: { ribbon: ["#2a6ad8", "#7ad0ff"], core: ["#6ab0ff", "#0a1840"] },
  arena: { ribbon: ["#e8e8f0", "#c03040"], core: ["#ff8a6a", "#3a0a10"] },
  hero: { ribbon: ["#2a8a4a", "#ffd040"], core: ["#a8f0a0", "#0a3018"] },
  td: { ribbon: ["#6a4a2a", "#8ad0ff"], core: ["#c0e0ff", "#1a2a40"] },
  tdAbyss: { ribbon: ["#16101e", "#ff3a6a"], core: ["#ff6a9a", "#2a0414"] },
};

/** 8갈래 별 테두리 */
function star(r1: number, r2: number): string {
  return Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 ? r2 : r1;
    return `${(50 + Math.cos(a) * r).toFixed(1)},${(62 + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
}

function Emblem({ boss }: { boss: MedalKind }) {
  if ((MODE_KINDS as readonly string[]).includes(boss)) return <ModeEmblem kind={boss as ModeKind} />;
  if (boss === "dragon")
    return (
      <g>
        <path d="M50 46 C40 52 38 64 44 74 L50 70 L56 74 C62 64 60 52 50 46 Z" fill="#ffd27a" />
        <path d="M44 52 L36 42 L42 54 M56 52 L64 42 L58 54" stroke="#ffe9b0" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="46" cy="60" r="1.8" fill="#5a0a12" />
        <circle cx="54" cy="60" r="1.8" fill="#5a0a12" />
        <path d="M44 76 Q50 84 56 76" stroke="#ffb020" strokeWidth="2" fill="none" />
      </g>
    );
  if (boss === "godeater")
    return (
      <g stroke="#f4e2a0" strokeWidth="3" strokeLinecap="round">
        <path d="M38 76 L62 48 M62 76 L38 48" />
        <path d="M41 70 L45 74 M59 70 L55 74" stroke="#e8c050" strokeWidth="4" />
        <circle cx="50" cy="62" r="3" fill="#e8c050" stroke="none" />
      </g>
    );
  return (
    <g>
      <path d="M50 46 A16 16 0 0 1 50 78 Z" fill="#16121e" />
      <path d="M50 46 A16 16 0 0 0 50 78 Z" fill="#fff6d0" />
      <circle cx="50" cy="54" r="4" fill="#16121e" />
      <circle cx="50" cy="70" r="4" fill="#fff6d0" />
      <circle cx="50" cy="62" r="16" fill="none" stroke="#e8c050" strokeWidth="1.5" />
    </g>
  );
}

/** 월계수 한쪽 (dir 1 = 오른쪽) */
function Laurel({ dir }: { dir: 1 | -1 }) {
  return (
    <g transform={dir < 0 ? "translate(100 0) scale(-1 1)" : undefined} fill="#d8a83a" stroke="#7a5a1a" strokeWidth="0.6">
      <path d="M70 92 Q86 78 84 52" fill="none" stroke="#b08020" strokeWidth="1.6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={78 + i * 1.4} cy={88 - i * 8} rx="2.4" ry="5" transform={`rotate(${35 - i * 8} ${78 + i * 1.4} ${88 - i * 8})`} />
      ))}
    </g>
  );
}

/** tier: 꾸밈 단계 (금기 점수·모드 기록, 0 없음~6) · label: 오른쪽 위 숫자 패 · character "all"이면 보석이 금빛 */
export function MedalArt({ boss, character, size = 64, dim = false, tier = 0, label }: { boss: MedalKind; character: CharacterId | "all"; size?: number; dim?: boolean; tier?: number; label?: string }) {
  const uid = useId().replace(/:/g, "");
  const look = LOOK[boss] ?? LOOK.dragon!;
  const gem = (C as unknown as Record<string, string>)[character] ?? "#ffd040";
  return (
    <svg className={`medal-art${dim ? " dim" : ""}`} viewBox="0 0 100 110" width={size} height={size * 1.1} aria-hidden="true">
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="0.45" stopColor="#e8b030" />
          <stop offset="1" stopColor="#8a5a10" />
        </linearGradient>
        <radialGradient id={`c${uid}`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor={look.core[0]} />
          <stop offset="1" stopColor={look.core[1]} />
        </radialGradient>
      </defs>
      <MedalBack tier={tier} uid={uid} />
      {/* 리본 */}
      <path d="M30 0 L46 0 L56 40 L42 44 Z" fill={look.ribbon[0]} />
      <path d="M70 0 L54 0 L44 40 L58 44 Z" fill={look.ribbon[1]} />
      <path d="M30 0 L46 0 L48 8 L32 8 Z M54 0 L70 0 L68 8 L52 8 Z" fill="#000" opacity="0.2" />
      <Laurel dir={1} />
      <Laurel dir={-1} />
      {/* 별 테두리 · 금 고리 · 보스 바탕 */}
      <polygon points={star(34, 27)} fill={`url(#g${uid})`} stroke="#5a3a08" strokeWidth="1" />
      <circle cx="50" cy="62" r="24" fill="#5a3a08" />
      <circle cx="50" cy="62" r="22.5" fill={`url(#c${uid})`} stroke={`url(#g${uid})`} strokeWidth="2.5" />
      <Emblem boss={boss} />
      {/* 캐릭터 색 보석 (아래쪽 별 끝) */}
      <circle cx="50" cy="95" r="5" fill={gem} stroke="#fff2b0" strokeWidth="1.6" />
      <circle cx="48.4" cy="93.4" r="1.4" fill="#fff" opacity="0.8" />
      <MedalFront tier={tier} label={label} />
      {/* 빛 */}
      <path className="medal-shine" d="M34 50 L42 42 L66 74 L58 82 Z" fill="#fff" opacity="0.18" />
    </svg>
  );
}
