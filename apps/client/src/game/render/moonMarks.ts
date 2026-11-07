// 달빛 상태이상 표시: 적 체력 줄 위에 달 하나 · 스택이 오를수록 그 달이 차오름 (1 초승달 → 2 상현달 → 3 반달 → 4 하현달 → 5 보름달) · 은은한 푸른 달빛 · 풀리기 직전엔 깜빡임
import type { EnemyState } from "@pixel-rogue/shared";
import { additive, glow } from "./pwFxBits";

/** 단계마다 7×7 달 그림 (W 밝은 면 · s 어두운 면의 흐린 테) — 단계가 오를수록 차오름 */
const PHASE = [
  ["..sssW.", ".s...WW", "s.....W", "s.....W", "s.....W", ".s...WW", "..sssW."],
  ["..ssWW.", ".s..WWW", "s...WWW", "s...WWW", "s...WWW", ".s..WWW", "..ssWW."],
  ["..sWWW.", ".s.WWWW", "s..WWWW", "s..WWWW", "s..WWWW", ".s.WWWW", "..sWWW."],
  ["..WWWW.", ".sWWWWW", "s.WWWWW", "s.WWWWW", "s.WWWWW", ".sWWWWW", "..WWWW."],
  ["..WWW..", ".WWWWW.", "WWWWWWW", "WWWWWWW", "WWWWWWW", ".WWWWW.", "..WWW.."],
];
const SIZE = 7;

function moon(ctx: CanvasRenderingContext2D, k: number, x: number, y: number, a: number): void {
  const rows = PHASE[k]!;
  ctx.fillStyle = `rgba(16,20,40,${0.8 * a})`;
  ctx.beginPath();
  ctx.arc(x + SIZE / 2, y + SIZE / 2, SIZE / 2 + 1, 0, Math.PI * 2);
  ctx.fill();
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
  const x0 = Math.round(x - SIZE / 2);
  const y0 = Math.round(y - e.r - 4 - SIZE - 3);
  additive(ctx, () => glow(ctx, x, y0 + SIZE / 2, 5 + n * 2, "#b8ccff", 0.25 * a * (n / 5 + 0.4), 0.2));
  moon(ctx, n - 1, x0, y0, a);
}
