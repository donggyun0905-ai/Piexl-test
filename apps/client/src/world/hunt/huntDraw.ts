// 지도 사냥 그리기: 몬스터(던전 그림 그대로, 맞으면 흰빛·예고면 붉게 깜빡) · 체력 줄 · 휘두른 궤적 · 피해 숫자 · 내 체력 줄·쓰러짐
import { drawEnemySprite } from "../../game/enemySprites";
import { shadow } from "../worldArt";
import type { Drawable } from "../worldTrees";
import type { Walker } from "../../lobby/walker";
import { HUNT_RULES as R } from "./huntGrounds";
import type { Hunt, Mob } from "./huntSim";

type Ctx = CanvasRenderingContext2D;

function bar(ctx: Ctx, x: number, y: number, w: number, k: number, color: string): void {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(Math.round(x - w / 2) - 1, Math.round(y) - 1, w + 2, 4);
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x - w / 2), Math.round(y), Math.max(1, Math.round(w * k)), 2);
}

function drawMob(ctx: Ctx, m: Mob, t: number): void {
  const x = Math.round(m.x);
  const y = Math.round(m.y);
  shadow(ctx, x, y + m.g.r - 1, m.g.r, m.g.r * 0.4, 0.3);
  const blink = m.st === "windup" && Math.floor(t * 10) % 2 === 0;
  const tint: readonly [string, number] | undefined = m.flash > 0 ? ["#ffffff", 0.8] : blink ? ["#ff3a3a", 0.55] : undefined;
  // 하이오크: 걷기 2칸 · 예고면 도끼 치켜듦(2)
  const frame = m.g.kind === "highorc" && m.st === "windup" ? 2 : Math.floor(t * 5) % 2;
  if (!drawEnemySprite(ctx, m.g.kind, x, y, frame, m.left, tint)) {
    ctx.fillStyle = tint?.[0] ?? "#7a9a5a";
    ctx.fillRect(x - m.g.r, y - m.g.r, m.g.r * 2, m.g.r * 2);
  }
  if (m.hp < m.g.hp) bar(ctx, x, y - m.g.r - 6, m.g.r * 2 + 2, m.hp / m.g.hp, "#e0606a");
}

/** 몬스터를 깊이 순서 목록에 넣음 (발 y 기준) */
export function pushMobs(ctx: Ctx, h: Hunt, t: number, items: Drawable[], near: (x: number, y: number) => boolean): void {
  for (const m of h.mobs) if (m.st !== "dead" && near(m.x, m.y)) items.push({ y: m.y + m.g.r, draw: () => drawMob(ctx, m, t) });
}

/** 나·몬스터 위에 겹쳐 그리기: 휘두른 궤적 · 피해 숫자 · 내 체력 줄 (맞았거나 사냥 중일 때) */
export function drawHuntTop(ctx: Ctx, h: Hunt, me: Walker): void {
  const s = h.me;
  if (s.swingT > 0) {
    const reach = R.swingReach * s.st.reachMul;
    const face = Math.atan2(s.sy, s.sx);
    ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, s.swingT / 0.14)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(me.x, me.y - 3, reach * 0.8, face - R.swingArc, face + R.swingArc);
    ctx.stroke();
  }
  ctx.font = "bold 7px sans-serif";
  ctx.textAlign = "center";
  for (const p of h.pops) {
    ctx.globalAlpha = Math.min(1, p.t * 2);
    ctx.fillStyle = "#000";
    ctx.fillText(p.text, p.x + 0.5, p.y + 0.5);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
  if (s.hp < s.st.maxHp || s.calm < 3) bar(ctx, me.x, me.y - 18, 16, s.hp / s.st.maxHp, s.down > 0 ? "#888" : "#6ae06a");
}

/** 대시 중 잔상 (나 그리기 전에) */
export function drawDashTrail(ctx: Ctx, h: Hunt, me: Walker): void {
  if (h.me.dashT <= 0) return;
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  for (let k = 1; k <= 3; k++) {
    ctx.beginPath();
    ctx.ellipse(me.x - h.me.dx * k * 5, me.y - 4 - h.me.dy * k * 5, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
