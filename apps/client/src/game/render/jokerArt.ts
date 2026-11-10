// 조커 그리기: 판 위를 튕겨 다니는 카드(트럼프 카드·사신의 낫·장난감 총 탄) · 머리 위 카드뽑기(뒷면 셋이 섞이다 한 장이 뒤집힘) · 효과 중 카드
// 카드 그림은 사용자 그림 sprites/jokerCards.png (60×90 여섯 장: 뒷면 달·붉은 일식·세계수 → 앞면 달·붉은 일식·세계수). 효과는 render/jokerFx
import { cardDamage, cardMaxed, JOKER_DRAW, type JokerCard, type RunState } from "@pixel-rogue/shared";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import type { Snap } from "./palette";
import { img } from "./lunaticFx";

export const JK = { paper: "#f4f0ff", edge: "#c86bff", neon: "#b8ff3a", dark: "#2a1a3a", gold: "#ffd84a", red: "#ff3a6a" };
const CARDS = img("jokerCards");
const ready = () => CARDS.complete && CARDS.naturalWidth > 0;
/** 뽑기 카드 색 (그림을 못 불러오면 이 색 네모) · 0 달 · 1 붉은 일식 · 2 세계수 */
export const DRAW_COLORS = ["#6a8aff", "#ff3a3a", "#ffe08a"];

/** 뽑기 카드 한 장 (가운데 x, y · 높이 h · 앞면이면 front · sx: 가로 눌림 0~1, 뒤집기) */
export function drawDrawCard(ctx: Ctx, x: number, y: number, h: number, card: number, front: boolean, sx = 1): void {
  const w = (h * 2) / 3;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(Math.max(0.05, sx), 1);
  if (ready()) ctx.drawImage(CARDS, (card + (front ? 3 : 0)) * 60, 0, 60, 90, -w / 2, -h / 2, w, h);
  else {
    ctx.fillStyle = JK.gold;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = DRAW_COLORS[card] ?? JK.edge;
    ctx.fillRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2);
  }
  ctx.restore();
}

/** 카드 한 장 (튕긴 수가 많을수록 더 밝게 빛남) */
function card(ctx: Ctx, c: JokerCard, x: number, y: number, tick: number, power: number): void {
  const spin = (tick + c.id * 7) * 0.25;
  const hot = Math.min(1, power / 60);
  // 튕긴 횟수 상한에 닿은 카드는 금색으로 빛남
  const maxed = cardMaxed(c);
  additive(ctx, () => glow(ctx, x, y, c.r * 2.2 + hot * 6, maxed || c.ace ? JK.gold : c.w === 1 ? JK.neon : JK.edge, maxed ? 0.75 : 0.25 + hot * 0.45, hot * 0.4));
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  if (c.w === 1) {
    // 사신의 낫: 도는 초승달 날
    ctx.strokeStyle = JK.neon;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, c.r, 0, Math.PI * 1.2);
    ctx.stroke();
    ctx.strokeStyle = JK.edge;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, c.r - 2, 0.2, Math.PI * 1.1);
    ctx.stroke();
    ctx.fillStyle = JK.dark;
    ctx.fillRect(-1, -1, 2, c.r);
  } else if (c.w === 2) {
    // 장난감 총 탄: 형광 구슬
    ctx.fillStyle = JK.neon;
    ctx.beginPath();
    ctx.arc(0, 0, c.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = JK.paper;
    ctx.fillRect(-1, -1, 1, 1);
  } else {
    // 트럼프 카드 (에이스는 금테)
    const w = c.r * 1.3;
    const h = c.r * 1.9;
    ctx.fillStyle = c.ace || maxed ? JK.gold : JK.edge;
    ctx.fillRect(-w, -h, w * 2, h * 2);
    ctx.fillStyle = JK.paper;
    ctx.fillRect(-w + 1, -h + 1, w * 2 - 2, h * 2 - 2);
    ctx.fillStyle = c.ace ? JK.red : JK.neon;
    ctx.fillRect(-1, -1, 2, 2);
  }
  ctx.restore();
}

/** 머리 위: 카드뽑기 게이지 · 섞기 → 뒤집기 · 효과 중 카드 */
function drawOverHead(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const top = y - p.r - 14;
  const f = p.jkFlip;
  if (f) {
    const t = JOKER_DRAW.flipTicks - f.t;
    const flipAt = JOKER_DRAW.flipTicks - 30;
    if (t < flipAt) {
      // 셋이 서로 자리를 바꾸며 섞임
      const k = t / flipAt;
      const spd = 0.15 + k * 0.5;
      for (let i = 0; i < 3; i++) {
        const ph = t * spd + (i * Math.PI * 2) / 3;
        drawDrawCard(ctx, x + Math.sin(ph) * 12, top - 2 + Math.cos(ph) * 3, 16, i, false);
      }
    } else {
      const u = (t - flipAt) / 30;
      const sx = Math.abs(Math.cos(u * Math.PI));
      additive(ctx, () => glow(ctx, x, top - 4, 18 + u * 8, DRAW_COLORS[f.card]!, 0.5 * u, 0.3));
      drawDrawCard(ctx, x, top - 6, 22, f.card, u > 0.5, sx);
    }
    return;
  }
  const b = p.jkBuff;
  if (b) {
    const k = b.t / JOKER_DRAW.buffTicks;
    additive(ctx, () => glow(ctx, x, top, 10, DRAW_COLORS[b.card]!, 0.25 + 0.1 * Math.sin(s.tick * 0.2), 0.2));
    drawDrawCard(ctx, x, top, 14, b.card, true);
    ctx.fillStyle = alpha(DRAW_COLORS[b.card]!, 0.9);
    ctx.fillRect(x - 6, top + 9, Math.round(12 * k), 1);
    return;
  }
  if (!p.passives.includes("jkDraw" as never)) return;
  const g = Math.min(1, (p.jkGauge ?? 0) / JOKER_DRAW.max);
  ctx.fillStyle = alpha(JK.dark, 0.8);
  ctx.fillRect(x - 7, y + p.r + 3, 14, 2);
  ctx.fillStyle = g >= 1 ? JK.gold : JK.edge;
  ctx.fillRect(x - 7, y + p.r + 3, Math.round(14 * g), 2);
}

/** 조커: 카드 · 머리 위 (player 둘레 그리기에서) */
export function drawJoker(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "joker" || s.over) return;
  for (const c of p.jkCards ?? []) card(ctx, c, snap(c.x), snap(c.y), s.tick, cardDamage(p, c));
  drawOverHead(ctx, s, snap(p.prevX + (p.x - p.prevX) * a0), snap(p.prevY + (p.y - p.prevY) * a0));
}
