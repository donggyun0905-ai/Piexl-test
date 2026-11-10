// 트럼프 카드 한 장 (블랙잭·하이로우·조커 공용, SVG라 크게 키워도 선명): 모서리 숫자·무늬 · 숫자마다 실제 카드처럼 무늬 배치 · J·Q·K는 위아래가 뒤집힌 왕실 그림 · 뒷면 무늬 · 조커
import { JokerFace, RoyalFace } from "./cardArt";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

/** 숫자 카드 무늬 자리 (카드 60×84 안, 가운데 아래쪽은 뒤집어 그림) */
const L = 20;
const M = 30;
const R = 40;
const PIPS: readonly (readonly [number, number])[][] = [
  [],
  [[M, 21], [M, 63]],
  [[M, 21], [M, 42], [M, 63]],
  [[L, 21], [R, 21], [L, 63], [R, 63]],
  [[L, 21], [R, 21], [M, 42], [L, 63], [R, 63]],
  [[L, 21], [R, 21], [L, 42], [R, 42], [L, 63], [R, 63]],
  [[L, 21], [R, 21], [M, 31.5], [L, 42], [R, 42], [L, 63], [R, 63]],
  [[L, 21], [R, 21], [M, 31.5], [L, 42], [R, 42], [M, 52.5], [L, 63], [R, 63]],
  [[L, 21], [R, 21], [L, 35], [R, 35], [M, 42], [L, 49], [R, 49], [L, 63], [R, 63]],
  [[L, 21], [R, 21], [M, 28], [L, 35], [R, 35], [L, 49], [R, 49], [M, 56], [L, 63], [R, 63]],
];

/** rank 0~12 (A~K) · suit 0~3 (♠♥♦♣) · back: 뒷면 */
export function PlayingCard({ rank, suit, back = false, big = false, small = false }: { rank: number; suit: number; back?: boolean; big?: boolean; small?: boolean }) {
  const size = big ? " big" : small ? " small" : "";
  if (back) return <CardBack cls={size} />;
  const r = RANKS[rank]!;
  const s = SUITS[suit]!;
  const red = suit === 1 || suit === 2;
  const ink = red ? "#d0283a" : "#1e1c28";
  return (
    <span key={`${rank}-${suit}`} className={`pcard${red ? " red" : ""}${size}`}>
      <svg viewBox="0 0 60 84" aria-label={`${r}${s}`}>
        <defs>
          <linearGradient id="pc-paper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fffef8" />
            <stop offset="1" stopColor="#efe6d2" />
          </linearGradient>
        </defs>
        <rect x="0.5" y="0.5" width="59" height="83" rx="5" fill="url(#pc-paper)" stroke="#2a2030" strokeWidth="0.8" />
        <rect x="2.5" y="2.5" width="55" height="79" rx="3.5" fill="none" stroke={ink} strokeOpacity="0.12" strokeWidth="0.6" />
        <g fill={ink} fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" textAnchor="middle">
          <Corner r={r} s={s} />
          <g transform="rotate(180 30 42)">
            <Corner r={r} s={s} />
          </g>
          {rank >= 10 ? (
            <RoyalFace rank={rank} suit={s} red={red} />
          ) : rank === 0 ? (
            <Ace s={s} spade={suit === 0} />
          ) : (
            PIPS[rank]!.map(([x, y], i) => (
              <text key={i} x={x} y={y + 5} fontSize="15" transform={y > 42 ? `rotate(180 ${x} ${y})` : undefined}>
                {s}
              </text>
            ))
          )}
        </g>
      </svg>
    </span>
  );
}

function Corner({ r, s }: { r: string; s: string }) {
  return (
    <>
      <text x="7.5" y="12" fontSize={r === "10" ? 9 : 10.5} letterSpacing={r === "10" ? -1 : 0}>
        {r}
      </text>
      <text x="7.5" y="21" fontSize="8.5">
        {s}
      </text>
    </>
  );
}

/** 에이스: 가운데 큰 무늬 (스페이드는 꽃무늬 테두리) */
function Ace({ s, spade }: { s: string; spade: boolean }) {
  return (
    <>
      {spade && <circle cx="30" cy="42" r="17" fill="none" stroke="#1e1c28" strokeWidth="0.6" strokeDasharray="1.5 1.5" />}
      <text x="30" y="53" fontSize={spade ? 34 : 30}>
        {s}
      </text>
    </>
  );
}

/** 카드 뒷면: 보라 마름모 격자 · 금테 · 가운데 별 문장 */
export function CardBack({ cls = "" }: { cls?: string }) {
  return (
    <span className={`pcard back${cls}`}>
      <svg viewBox="0 0 60 84" aria-hidden>
        <defs>
          <pattern id="pc-lattice" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#5a2a90" />
            <rect width="3" height="3" fill="#7a3ab0" />
            <circle cx="4.5" cy="4.5" r="0.7" fill="#c89aff" />
          </pattern>
          <radialGradient id="pc-seal">
            <stop offset="0" stopColor="#fff6c8" />
            <stop offset="1" stopColor="#c8862a" />
          </radialGradient>
        </defs>
        <rect x="0.5" y="0.5" width="59" height="83" rx="5" fill="#fffdf6" stroke="#2a2030" strokeWidth="0.8" />
        <rect x="3.5" y="3.5" width="53" height="77" rx="3" fill="url(#pc-lattice)" stroke="#e8c060" strokeWidth="1" />
        <rect x="6" y="6" width="48" height="72" rx="2" fill="none" stroke="#e8c06088" strokeWidth="0.5" />
        <circle cx="30" cy="42" r="10" fill="#3a1a60" stroke="#e8c060" strokeWidth="1" />
        <path d="M30 34 L32.2 39.6 L38 40 L33.5 43.6 L35 49.2 L30 46 L25 49.2 L26.5 43.6 L22 40 L27.8 39.6 Z" fill="url(#pc-seal)" />
      </svg>
    </span>
  );
}

/** 조커 게임 카드 (짝 맞추기용 숫자 카드 · 조커) */
export function JokerCard({ n, joker, small = false }: { n: number; joker: boolean; small?: boolean }) {
  if (!joker) return <PlayingCard rank={(n - 1) % 13} suit={n % 4} small={small} />;
  return (
    <span className={`pcard joker${small ? " small" : ""}`}>
      <svg viewBox="0 0 60 84" aria-label="Joker">
        <rect x="0.5" y="0.5" width="59" height="83" rx="5" fill="#fff8fc" stroke="#2a2030" strokeWidth="0.8" />
        <JokerFace />
      </svg>
    </span>
  );
}
