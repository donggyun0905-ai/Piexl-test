// 튜닝소 창 가득한 저격총 그림 (TunePanel): 부위마다 끼운 부품에 따라 모양이 바뀜. 부위를 누르면 고름 (고른 부위는 금빛 테두리)
// 부위 차례 = trackerParts.TUNE_SLOTS (총열 · 조준경 · 개머리판 · 탄창 · 총구 · 레일·받침)
import type { ReactNode } from "react";

interface Props {
  parts: number[];
  levels: number[];
  picked: number;
  onPick: (slot: number) => void;
}

const DARK = "#1c1d24";
const METAL = "#3a3e4a";
const STEEL = "#5a6272";
const WOOD = "#6a4428";
const LIGHT = "#8a96a8";
const GLASS = "#7ad0ff";

/** 부위 그림 (부품 번호마다) */
function partArt(slot: number, part: number, barrel: number): ReactNode {
  switch (slot) {
    case 0: // 총열: 표준 · 장총열 · 플루티드(홈) · 다조선(굵음)
      return (
        <>
          <rect x={300} y={part === 3 ? 80 : 82} width={part === 1 ? 236 : 210} height={part === 3 ? 14 : 10} fill={METAL} />
          <rect x={300} y={part === 3 ? 80 : 82} width={part === 1 ? 236 : 210} height={2} fill={LIGHT} />
          {part === 2 && [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={320 + i * 30} y={85} width={18} height={3} fill={DARK} />)}
        </>
      );
    case 1: // 조준경: 4배율 · 8배율(긴 경통·큰 대물렌즈) · 열상(붉은 렌즈) · 홀로그램(작은 상자)
      if (part === 3) return <><rect x={205} y={46} width={50} height={22} rx={3} fill={METAL} /><rect x={215} y={50} width={30} height={12} fill="#ff6a6a" opacity={0.55} /><circle cx={230} cy={56} r={3} fill="#ff3a3a" /></>;
      return (
        <>
          <rect x={185} y={48} width={part === 1 ? 130 : 100} height={16} rx={4} fill={METAL} />
          <rect x={part === 1 ? 300 : 270} y={42} width={part === 1 ? 26 : 20} height={28} rx={5} fill={STEEL} />
          <rect x={175} y={44} width={16} height={24} rx={4} fill={STEEL} />
          <circle cx={part === 1 ? 324 : 288} cy={56} r={part === 1 ? 11 : 8} fill={part === 2 ? "#ff5a3a" : GLASS} opacity={0.85} />
          <rect x={215} y={64} width={10} height={8} fill={DARK} />
          <rect x={255} y={64} width={10} height={8} fill={DARK} />
        </>
      );
    case 2: // 개머리판: 고정 · 접이식(뼈대) · 충격 흡수 패드 · 조절식 뺨받침
      if (part === 1) return <><path d="M150 78 L40 84 L40 124 L60 124 L60 96 L150 92 Z" fill={STEEL} /><rect x={30} y={84} width={12} height={42} fill={DARK} /></>;
      return (
        <>
          <path d="M150 74 L50 80 L36 128 L150 108 Z" fill={WOOD} />
          <path d="M150 74 L50 80 L48 86 L150 80 Z" fill="#8a5a34" />
          {part === 2 && <rect x={26} y={82} width={14} height={48} rx={4} fill="#2a1a1a" />}
          {part === 3 && <><rect x={80} y={62} width={50} height={12} rx={3} fill={STEEL} /><rect x={92} y={72} width={4} height={8} fill={DARK} /><rect x={114} y={72} width={4} height={8} fill={DARK} /></>}
        </>
      );
    case 3: // 탄창: 기본 · 확장(김) · 빠른 장전 클립 · 드럼
      if (part === 3) return <><circle cx={242} cy={128} r={24} fill={METAL} /><circle cx={242} cy={128} r={12} fill={STEEL} /><circle cx={242} cy={128} r={4} fill={LIGHT} /></>;
      return <rect x={226} y={104} width={part === 2 ? 22 : 32} height={part === 1 ? 64 : part === 2 ? 26 : 40} rx={3} fill={part === 2 ? "#a88a3a" : METAL} />;
    case 4: { // 총구: 맨 총구 · 소음기 · 머즐 브레이크(구멍) · 소염기(갈래). 총열 끝에 붙음
      const end = barrel === 1 ? 536 : 510;
      if (part === 0) return <rect x={end} y={83} width={8} height={8} fill={DARK} />;
      if (part === 1) return <><rect x={end} y={76} width={60} height={22} rx={6} fill={DARK} /><rect x={end + 6} y={78} width={48} height={3} fill={STEEL} /></>;
      if (part === 2) return <><rect x={end} y={79} width={34} height={16} fill={STEEL} />{[0, 1, 2].map((i) => <rect key={i} x={end + 6 + i * 9} y={81} width={5} height={12} fill={DARK} />)}</>;
      return <><rect x={end} y={80} width={20} height={14} fill={METAL} />{[0, 1, 2].map((i) => <rect key={i} x={end + 20} y={80 + i * 5} width={14} height={3} fill={METAL} />)}</>;
    }
    default: // 레일·받침: 민짜 레일 · 양각대 · 전술 레일(손잡이·불빛) · 위장 덮개
      if (part === 1) return <><rect x={420} y={94} width={20} height={8} fill={STEEL} /><path d="M425 100 L400 160 M435 100 L460 160" stroke={METAL} strokeWidth={5} /></>;
      if (part === 2) return <><rect x={360} y={94} width={90} height={8} fill={STEEL} /><rect x={380} y={102} width={12} height={34} rx={3} fill={DARK} /><rect x={430} y={102} width={20} height={10} fill={METAL} /><circle cx={450} cy={107} r={4} fill="#fff6c0" /></>;
      if (part === 3) return <>{[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${330 + i * 26} 78 l10 -10 l8 14 l10 -8 l4 18`} stroke={i % 2 ? "#4a6a3a" : "#6a8a4a"} strokeWidth={5} fill="none" />)}</>;
      return <rect x={360} y={94} width={70} height={6} fill={STEEL} />;
  }
}

/** 부위를 누르는 자리 (그림보다 넉넉하게) · 이름표 자리 */
const HIT: { x: number; y: number; w: number; h: number; lx: number; ly: number }[] = [
  { x: 300, y: 70, w: 210, h: 30, lx: 400, ly: 66 },
  { x: 170, y: 30, w: 160, h: 44, lx: 250, ly: 24 },
  { x: 20, y: 56, w: 132, h: 80, lx: 86, ly: 150 },
  { x: 210, y: 100, w: 64, h: 74, lx: 242, ly: 178 },
  { x: 505, y: 66, w: 85, h: 40, lx: 548, ly: 120 },
  { x: 340, y: 100, w: 150, h: 66, lx: 470, ly: 158 },
];

export function SniperSvg({ parts, levels, picked, onPick }: Props) {
  // 받침 부품(양각대)은 총 밑에, 나머지는 몸통 위에 그림
  const order = [5, 2, 0, 4, 3, 1];
  return (
    <svg className="sniper-svg" viewBox="0 0 600 190" role="img">
      <defs>
        <filter id="sniperGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffd56a" />
        </filter>
      </defs>
      {order.map((slot) => (
        <g key={slot} className={`sniper-part ${picked === slot ? "on" : ""}`} filter={picked === slot ? "url(#sniperGlow)" : undefined}>
          {partArt(slot, parts[slot] ?? 0, parts[0] ?? 0)}
        </g>
      ))}
      {/* 몸통 (방아쇠·손잡이) */}
      <rect x={150} y={70} width={152} height={34} rx={4} fill={DARK} />
      <rect x={150} y={70} width={152} height={4} fill={METAL} />
      <path d="M178 104 L170 140 L190 140 L198 104 Z" fill={WOOD} />
      <path d="M200 104 q6 14 18 0" stroke={LIGHT} strokeWidth={3} fill="none" />
      {HIT.map((h, slot) => (
        <g key={slot} className="sniper-hit" onClick={() => onPick(slot)}>
          <rect x={h.x} y={h.y} width={h.w} height={h.h} fill="transparent" />
          <text x={h.lx} y={h.ly} textAnchor="middle" className={`sniper-lv ${picked === slot ? "on" : ""}`}>
            {(levels[slot] ?? 0) > 0 ? `+${levels[slot]}` : "·"}
          </text>
        </g>
      ))}
    </svg>
  );
}
