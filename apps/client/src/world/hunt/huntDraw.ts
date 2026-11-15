// 지도 사냥 그리기: 몬스터(던전 그림 그대로, 맞으면 흰빛·예고면 붉게 깜빡) · 체력 줄 · 휘두른 궤적 · 피해 숫자 · 내 체력 줄·쓰러짐
import { drawEnemySprite, enemyFrames } from "../../game/enemySprites";
import { mobName } from "./huntNames";
import { shadow } from "../worldArt";
import type { Drawable } from "../worldTrees";
import type { Walker } from "../../lobby/walker";
import { HUNT_RULES as R } from "./huntGrounds";
import { SWING_SHOW, type Hunt, type Mob } from "./huntSim";

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
  // 하이오크·보스(4칸 그림): 걷기 2칸 · 예고면 공격 준비(2)
  const frame = (m.g.kind === "highorc" || enemyFrames(m.g.kind) >= 4) && m.st === "windup" ? 2 : Math.floor(t * 5) % 2;
  if (!drawEnemySprite(ctx, m.g.kind, x, y, frame, m.left, tint)) {
    ctx.fillStyle = tint?.[0] ?? "#7a9a5a";
    ctx.fillRect(x - m.g.r, y - m.g.r, m.g.r * 2, m.g.r * 2);
  }
  if (m.g.boss) {
    // 필드 보스: 늘 이름 · 긴 체력 줄
    bar(ctx, x, y - m.g.r - 12, 44, m.hp / m.g.hp, "#e0606a");
    ctx.font = "bold 7px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.fillText(mobName(m.g), x + 0.5, y - m.g.r - 15.5);
    ctx.fillStyle = "#ffb04a";
    ctx.fillText(mobName(m.g), x, y - m.g.r - 16);
  } else if (m.hp < m.g.hp) bar(ctx, x, y - m.g.r - 6, m.g.r * 2 + 2, m.hp / m.g.hp, "#e0606a");
}

/** 몬스터를 깊이 순서 목록에 넣음 (발 y 기준) */
export function pushMobs(ctx: Ctx, h: Hunt, t: number, items: Drawable[], near: (x: number, y: number) => boolean): void {
  for (const m of h.mobs) if (m.st !== "dead" && near(m.x, m.y)) items.push({ y: m.y + m.g.r, draw: () => drawMob(ctx, m, t) });
}

/** 나·몬스터 위에 겹쳐 그리기: 휘두른 궤적 · 피해 숫자 · 내 체력 줄 (맞았거나 사냥 중일 때) */
export function drawHuntTop(ctx: Ctx, h: Hunt, me: Walker): void {
  const s = h.me;
  if (s.swingT > 0) {
    // 초승달 모양 베기: 처음엔 굵고 밝게, 쓸고 지나가며 옅어짐
    const reach = R.swingReach * s.st.reachMul;
    const face = Math.atan2(s.sy, s.sx);
    const k = s.swingT / SWING_SHOW;
    const sweep = face - R.swingArc + R.swingArc * 2 * Math.min(1, (1 - k) * 2.2);
    const [x, y] = [me.x, me.y - 3];
    ctx.fillStyle = `rgba(255,244,214,${0.55 * k})`;
    ctx.beginPath();
    ctx.arc(x, y, reach, face - R.swingArc, sweep);
    ctx.arc(x, y, reach * 0.55, sweep, face - R.swingArc, true);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${k})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, reach, face - R.swingArc, sweep);
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

/** 화면 아래 가운데 (화면 픽셀): 체력 줄 · 대시 준비 칸 · 쓰러짐 남은 시간 (글자는 WorldStage가 넘김) */
export function drawHuntHud(ctx: Ctx, h: Hunt, w: number, hgt: number, k: number, dashLabel: string, downText: (n: number) => string): void {
  const s = h.me;
  const bw = 160 * k;
  const x = (w - bw) / 2;
  const y = hgt - 96 * k;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(x - 2 * k, y - 2 * k, bw + 4 * k, 12 * k);
  ctx.fillStyle = s.down > 0 ? "#888" : "#d84a4a";
  ctx.fillRect(x, y, bw * Math.max(0, s.hp / s.st.maxHp), 8 * k);
  ctx.font = `bold ${8 * k}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(`${Math.ceil(s.hp)} / ${Math.round(s.st.maxHp)}`, w / 2, y + 4 * k);
  // 대시: 차오르는 칸
  const full = s.dashCd <= 0 ? 1 : 1 - s.dashCd / (R.dashGap * s.st.dashMul);
  const dw = 60 * k;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect((w - dw) / 2 - k, y + 12 * k, dw + 2 * k, 7 * k);
  ctx.fillStyle = full >= 1 ? "#6ad0ff" : "#3a6a8a";
  ctx.fillRect((w - dw) / 2, y + 13 * k, dw * Math.max(0, Math.min(1, full)), 5 * k);
  ctx.font = `bold ${6 * k}px sans-serif`;
  ctx.fillStyle = "#fff";
  ctx.fillText(dashLabel, w / 2, y + 15.5 * k);
  if (s.down > 0) {
    ctx.font = `bold ${10 * k}px sans-serif`;
    ctx.fillStyle = "#000";
    ctx.fillText(downText(Math.ceil(s.down)), w / 2 + k, hgt / 2 - 30 * k + k);
    ctx.fillStyle = "#ff8a8a";
    ctx.fillText(downText(Math.ceil(s.down)), w / 2, hgt / 2 - 30 * k);
  }
}

/** 마우스를 올린 몬스터: 이름 · 권장 투력 (지도 좌표) */
export function drawMobTip(ctx: Ctx, h: Hunt, x: number, y: number, tip: (m: Mob) => string): void {
  const m = h.mobs.find((v) => v.st !== "dead" && Math.hypot(v.x - x, v.y - y) < v.g.r + 4);
  if (!m) return;
  const text = tip(m);
  ctx.font = "7px sans-serif";
  const tw = Math.ceil(ctx.measureText(text).width) + 6;
  const top = Math.round(m.y - m.g.r - (m.g.boss ? 34 : 18));
  ctx.fillStyle = "rgba(12,10,18,0.85)";
  ctx.fillRect(Math.round(m.x - tw / 2), top, tw, 10);
  ctx.fillStyle = "#ffe9a8";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, m.x, top + 5.5);
}
