// 달빛 상태이상 표시: 적 체력 줄 위에 스택만큼 달이 차례로 생김 (1 초승달 → 2 상현달 → 3 반달 → 4 하현달 → 5 보름달) · 은은한 푸른 달빛 · 풀리기 직전엔 깜빡임
import type { EnemyState } from "@pixel-rogue/shared";
import { additive, glow } from "./pwFxBits";

/** 단계마다 5×5 달 그림 (W 밝은 면 · s 흐린 테) — 단계가 오를수록 차오름 */
const PHASE = [
  ["..sW.", "...W.", "...WW", "...W.", "..sW."],
  ["..sWW", "...WW", "...WW", "...WW", "..sWW"],
  [".sWW.", "s.WWW", "s.WWW", "s.WWW", ".sWW."],
  [".WWW.", "sWWWW", "sWWWW", "sWWWW", ".WWW."],
  [".WWW.", "WWWWW", "WWWWW", "WWWWW", ".WWW."],
];
const SIZE = 5;
const GAP = 1;

function moon(ctx: CanvasRenderingContext2D, k: number, x: number, y: number, a: number): void {
  const rows = PHASE[k]!;
  ctx.fillStyle = `rgba(16,20,40,${0.8 * a})`;
  ctx.fillRect(x - 1, y - 1, SIZE + 2, SIZE + 2);
  rows.forEach((row, j) =>
    [...row].forEach((ch, i) => {
      if (ch === ".") return;
      ctx.fillStyle = ch === "W" ? `rgba(250,252,255,${a})` : `rgba(150,170,220,${0.7 * a})`;
      ctx.fillRect(x + i, y + j, 1, 1);
    }),
  );
}

/** (x, y) = 적 가운데 · 체력 줄(y - r - 4) 바로 위 */
export function drawMoonMarks(ctx: CanvasRenderingContext2D, e: EnemyState, x: number, y: number, tick: number): void {
  const n = Math.min(PHASE.length, e.moon ?? 0);
  if (n <= 0 || e.hp <= 0) return;
  const left = e.moonT ?? 0;
  const a = left < 60 && Math.floor(tick / 6) % 2 === 0 ? 0.45 : 1;
  const w = n * SIZE + (n - 1) * GAP;
  const x0 = Math.round(x - w / 2);
  const y0 = Math.round(y - e.r - 4 - SIZE - 3);
  additive(ctx, () => glow(ctx, x, y0 + SIZE / 2, 6 + n * 3, "#b8ccff", 0.25 * a * (n / 5 + 0.4), 0.2));
  for (let i = 0; i < n; i++) moon(ctx, i, x0 + i * (SIZE + GAP), y0, a);
}
