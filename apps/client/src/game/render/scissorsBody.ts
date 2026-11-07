// 시저스 그리기 (몸 둘레). 몸 뒤: 나에게서 묶인 적으로 이어진 운명의 실 (느슨하면 아래로 처진 붉은 실 · 멀어질수록 곧게 팽팽해지며 하얗게 빛남) · 적 쪽 붉은 매듭
// 몸 위: 단죄할 수 있는 적(체력이 적은 보통 적) 머리 위 작은 가위 표시 · 달빛 각성 흰 기운
import { ENEMIES, isScissors, SCISSORS, SCISSORS_PERKS, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, type Ctx } from "./pwFxBits";
import { SX } from "./scissorsFx";

/** 몸 뒤: 운명의 실 */
export function drawScissorsBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isScissors(p) || s.over || !p.sxThreads) return;
  const x = snap(lerp(p.prevX, p.x, a0));
  const y = snap(lerp(p.prevY, p.y, a0)) - 4;
  for (const th of p.sxThreads) {
    const e = s.enemies.find((f) => f.id === th.id && f.hp > 0);
    if (!e) continue;
    const ex = snap(lerp(e.prevX, e.x, a0));
    const ey = snap(lerp(e.prevY, e.y, a0)) - 2;
    const d = Math.hypot(ex - x, ey - y);
    const taut = Math.max(0, Math.min(1, (d - SCISSORS.slackAt) / (SCISSORS.tautAt - SCISSORS.slackAt)));
    // 느슨할수록 아래로 처짐 · 사라지기 직전엔 깜빡임
    const sag = (1 - taut) * Math.min(18, d * 0.2);
    const al = th.t < 60 && (s.tick >> 2) % 2 ? 0.4 : 1;
    const mx = (x + ex) / 2;
    const my = (y + ey) / 2 + sag;
    if (taut > 0.5) additive(ctx, () => {
      ctx.strokeStyle = alpha("#ffffff", (taut - 0.5) * 0.8 * al);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.stroke();
    });
    ctx.strokeStyle = alpha(taut > 0.8 ? "#ffd0d4" : SX.thread, al);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(mx, my, ex, ey);
    ctx.stroke();
    // 적 쪽 매듭
    ctx.fillStyle = alpha(SX.thread, al);
    ctx.fillRect(Math.round(ex) - 1, Math.round(ey) - 1, 3, 3);
  }
}

/** 단죄할 수 있는 적 머리 위 작은 가위 (벌어졌다 닫혔다) */
function execMark(ctx: Ctx, x: number, y: number, tick: number): void {
  const w = 1 + ((tick >> 3) % 2) * 2;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 4, y - w);
  ctx.lineTo(x + 4, y + w);
  ctx.moveTo(x - 4, y + w);
  ctx.lineTo(x + 4, y - w);
  ctx.stroke();
  ctx.strokeStyle = SX.blade;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = SX.red;
  ctx.fillRect(x - 6, y - 2, 2, 2);
  ctx.fillRect(x - 6, y + 1, 2, 2);
}

/** 몸 위: 단죄 표시 · 각성 기운 */
export function drawScissorsAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isScissors(p) || s.over) return;
  const at = p.passives.includes("sxHead") ? SCISSORS_PERKS.sxHead.at : SCISSORS.execAt;
  for (const e of s.enemies) {
    if (e.hp <= 0 || ENEMIES[e.kind]?.boss === true || e.kind === "dummy" || e.hp > e.maxHp * at) continue;
    execMark(ctx, snap(e.x), snap(e.y) - e.r - 9, s.tick);
  }
  if ((p.sgAwake ?? 0) > 0) {
    const x = snap(lerp(p.prevX, p.x, a0));
    const y = snap(lerp(p.prevY, p.y, a0));
    additive(ctx, () => glow(ctx, x, y - 8, 18, SX.moon, 0.18 + 0.06 * Math.sin(s.tick * 0.2)));
  }
}
