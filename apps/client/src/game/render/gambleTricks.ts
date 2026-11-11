// 도박꾼의 야바위 방해 (섞는 동안 3번, sim/gamble gambleTrick): 연막이 탁자를 덮음 · 도박꾼이 카드를 뿌림 · 방 한쪽에서 금화 폭죽 (시선 끌기)
// 화면 전용 (어둠 위에 그려 상자를 가림 · 결과는 안 바뀜)
import { cupY, gamblerY, gambleNow, gambleTrick, type RunState } from "@pixel-rogue/shared";
import { additive, alpha, easeOut, glow, rnd, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;

/** 연막: 탁자 위로 피어올라 상자를 덮었다가 걷힘 */
function smoke(ctx: Ctx, cx: number, y: number, f: number, n: number): void {
  const a = Math.min(1, Math.sin(f * Math.PI) * 1.7);
  for (let i = 0; i < 26; i++) {
    const px = cx + (rnd(i, n + 1) - 0.5) * 96 + Math.sin(f * 5 + i) * 4;
    const py = y + 4 + (rnd(i, n + 2) - 0.5) * 30 - f * 8;
    ctx.fillStyle = alpha(i % 3 ? "#2a2434" : "#4a4258", a * (0.75 + rnd(i, n + 3) * 0.25));
    ctx.beginPath();
    ctx.arc(Math.round(px), Math.round(py), 10 + rnd(i, n + 4) * 9 + f * 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 카드 뿌리기: 도박꾼 손에서 카드가 탁자 위로 쏟아져 팔랑이며 떨어짐 */
function cards(ctx: Ctx, cx: number, y: number, f: number, n: number): void {
  for (let i = 0; i < 22; i++) {
    const k = Math.max(0, Math.min(1, f * 1.5 - rnd(i, n + 1) * 0.5));
    if (k <= 0 || k >= 1) continue;
    const px = cx + (rnd(i, n + 2) - 0.5) * 90 * easeOut(k);
    const py = gamblerY() + (y + 22 - gamblerY()) * k - Math.sin(k * Math.PI) * 12;
    ctx.save();
    ctx.translate(Math.round(px), Math.round(py));
    ctx.rotate(k * 9 + i);
    ctx.fillStyle = "#f4f0e4";
    ctx.fillRect(-6, -8, 12, 16);
    ctx.fillStyle = i % 2 ? "#c02838" : "#1a1420";
    ctx.fillRect(-2, -3, 4, 6);
    ctx.restore();
  }
}

/** 금화 폭죽: 방 한쪽(번갈아)에서 번쩍 터져 눈길을 끎 */
function coins(ctx: Ctx, cx: number, y: number, f: number, n: number): void {
  const x = cx + (n % 2 ? 1 : -1) * 104;
  additive(ctx, () => {
    shock(ctx, x, y - 6, 44 * easeOut(f), "#ffd040", 1 - f, 5);
    glow(ctx, x, y - 6, 34, "#ffd040", (1 - f) * 0.9, 0.7);
    sparks(ctx, x, y - 6, 30, 60, f, "#ffd040", n * 7 + 3);
  });
  for (let i = 0; i < 12; i++) {
    const d = easeOut(f) * (20 + rnd(i, n + 5) * 34);
    const ang = rnd(i, n + 6) * Math.PI * 2;
    ctx.fillStyle = alpha(i % 2 ? "#ffd040" : "#fff6c0", 1 - f);
    ctx.fillRect(Math.round(x + Math.cos(ang) * d), Math.round(y - 6 + Math.sin(ang) * d * 0.7 + f * f * 26), 3, 3);
  }
}

const DRAW = [smoke, cards, coins];

export function drawGambleTricks(ctx: Ctx, s: RunState, cx: number): void {
  const g = gambleNow(s);
  const tr = g && gambleTrick(g, s.tick);
  if (tr) DRAW[tr.kind]!(ctx, cx, cupY(), tr.f, tr.n);
}
