// 오르카 그리기 (몸 둘레). 몸 뒤: 소용돌이 장판 · 상어 물살 꼬리 · 범고래 돌파 물길 · 번개 대시 자국
// 몸 위: 헤엄치는 상어 기공파 · 해방 추가타 물 상어 · 범고래 물기운 · 해방 오라(번개) · 주먹 빛 · 머리 위 해방 게이지
import { isOrca, ORCA, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, shock, type Ctx } from "./pwFxBits";
import { bubbles, caustic, glints } from "./seaLight";
import { bolt, VOLT } from "./thorkenFx";
import { sharkShape } from "./tailShark";
import { hpBarTop } from "./hpTop";
import { crackle, fistGlow, OC_AQUA, OC_DEEP, OC_FOAM, orcaShape, spiral } from "./orcaArt";

/** 물살 꼬리 (x,y에서 뒤로 len) */
function wake(ctx: Ctx, x: number, y: number, dx: number, dy: number, len: number, w: number, a: number): void {
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (const [c, ww, al] of [[OC_DEEP, w * 1.6, 0.35], [OC_AQUA, w, 0.6], [OC_FOAM, w * 0.3, 0.8]] as const) {
      const g = ctx.createLinearGradient(x, y, x - dx * len, y - dy * len);
      g.addColorStop(0, alpha(c, al * a));
      g.addColorStop(1, alpha(c, 0));
      ctx.strokeStyle = g;
      ctx.lineWidth = ww;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - dx * len, y - dy * len);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
}

/** 몸 뒤 */
export function drawOrcaBack(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isOrca(p) || s.over) return;
  for (const w of p.ocPools ?? []) {
    const al = Math.min(1, w.t / 20);
    const x = snap(w.x);
    const y = snap(w.y);
    additive(ctx, () => glow(ctx, x, y, 50, OC_DEEP, 0.55 * al));
    spiral(ctx, x, y, 48, -s.tick * 0.2, 4, al);
    caustic(ctx, x, y, 36, s.tick, 0.5 * al);
  }
  for (const k of p.ocSharks ?? []) wake(ctx, snap(k.x), snap(k.y), k.dx, k.dy, 34 * k.size, 8 * k.size, 1);
  for (const d of p.ocDarts ?? []) wake(ctx, snap(d.x), snap(d.y), d.dx, d.dy, 30, 6, 1);
  const px = snap(lerp(p.prevX, p.x, a0));
  const py = snap(lerp(p.prevY, p.y, a0));
  const b = p.ocBreach;
  if (b) {
    for (const side of [-1, 1]) {
      additive(ctx, () => {
        ctx.strokeStyle = alpha(OC_FOAM, 0.8);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px - b.dy * side * 10, py + b.dx * side * 10);
        ctx.quadraticCurveTo(px - b.dx * 30 - b.dy * side * 20, py - b.dy * 30 + b.dx * side * 20, px - b.dx * 70 - b.dy * side * 30, py - b.dy * 70 + b.dx * side * 30);
        ctx.stroke();
      });
    }
    wake(ctx, px, py, b.dx, b.dy, 80, 18, 1);
  }
  // 번개 대시 중: 출발 자리부터 몸까지 번개
  const c = p.ocBolt;
  if (c) {
    bolt(ctx, snap(c.x), snap(c.y), px, py - 4, s.tick >> 1, 1, 3);
    bolt(ctx, snap(c.x), snap(c.y) - 3, px, py - 6, (s.tick >> 1) + 9, 0.7, 1.5);
  }
}

/** 머리 위 해방 게이지: 차는 동안 물빛 · 가득이면 흰빛 깜빡 · 해방 중에는 남은 시간 (번개 노랑) */
function gauge(ctx: Ctx, s: RunState, x: number, y: number): void {
  const p = s.player;
  const free = (p.ocFree ?? 0) > 0;
  const r = free ? (p.ocFree ?? 0) / Math.max(1, p.ocFree0 ?? ORCA.freeTicks) : Math.min(1, (p.ocTide ?? 0) / ORCA.tideMax);
  const top = hpBarTop(p, y) - 5;
  const w = 18;
  ctx.fillStyle = "rgba(4,16,32,0.9)";
  ctx.fillRect(x - w / 2 - 1, top - 1, w + 2, 4);
  ctx.fillStyle = free ? VOLT : r >= 1 && (s.tick >> 2) % 2 ? "#ffffff" : OC_AQUA;
  ctx.fillRect(x - w / 2, top, Math.round(w * r), 2);
  if (free || r >= 1) additive(ctx, () => glow(ctx, x - w / 2 + w * r, top + 1, 5, free ? VOLT : OC_AQUA, 0.8));
}

/** 몸 위 */
export function drawOrcaAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  const p = s.player;
  if (!isOrca(p) || s.over) return;
  for (const k of p.ocSharks ?? []) {
    const near = k.prey !== undefined ? s.enemies.find((e) => e.id === k.prey) : undefined;
    const bite = near ? Math.max(0, 1 - Math.hypot(near.x - k.x, near.y - k.y) / 40) : 0.2;
    sharkShape(ctx, snap(k.x), snap(k.y), Math.atan2(k.dy, k.dx), 30 * k.size, Math.min(1, k.t / 8), s.tick, bite);
  }
  // 해방 추가타: 물에서 튀어나와 포물선으로 날아가는 물 상어 (테일 상어처럼)
  for (const d of p.ocDarts ?? []) {
    const k = 1 - d.left / ORCA.dartRange;
    const hop = Math.sin(k * Math.PI) * 10;
    sharkShape(ctx, snap(d.x), snap(d.y) - hop, Math.atan2(d.dy - (0.5 - k) * 0.6, d.dx), 22, 1, s.tick, 0.7);
    bubbles(ctx, snap(d.x - d.dx * 10), snap(d.y - d.dy * 10), 8, k, d.hit.length + 3, 3, 0.7);
  }
  const px = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  const py = by - 4;
  const b = p.ocBreach;
  if (b) {
    orcaShape(ctx, px, py, Math.atan2(b.dy, b.dx), 1.1, 0.9, s.tick);
    bubbles(ctx, px, py, 34, (s.tick % 20) / 20, s.tick, 8, 0.9);
    return;
  }
  const free = (p.ocFree ?? 0) > 0;
  const fill = free ? 1 : (p.ocTide ?? 0) / ORCA.tideMax;
  // 양손 푸른 불꽃: 게이지만큼 커짐
  const side = [-p.faceY, p.faceX];
  for (const sgn of [-1, 1]) fistGlow(ctx, px + side[0]! * 6 * sgn + p.faceX * 3, py + 3 + side[1]! * 4 * sgn, 2 + fill * 4, 0.35 + fill * 0.5, s.tick + sgn * 7);
  if (free) {
    // 해방 오라: 몸을 감싸는 물빛 + 튀는 번개
    additive(ctx, () => {
      glow(ctx, px, py, 26, OC_AQUA, 0.35 + Math.sin(s.tick * 0.3) * 0.1, 0.3);
      shock(ctx, px, by, 15 + Math.sin(s.tick * 0.25) * 2, VOLT, 0.35, 2);
    });
    crackle(ctx, px, py, 18, s.tick, 0.9);
  } else if (fill >= 1) {
    const pulse = 0.5 + Math.sin(s.tick * 0.2) * 0.3;
    additive(ctx, () => shock(ctx, px, py + 2, 16 + Math.sin(s.tick * 0.2) * 2, OC_AQUA, 0.6 * pulse, 3));
    glints(ctx, px, py, 16, 3, s.tick, 5, OC_FOAM, 0.8);
  }
  // 막 때린 주먹: 앞으로 뻗은 큰 빛
  const last = p.ocLast;
  const since = last ? s.tick - last.t : 99;
  if (last && since < 10) {
    const reach = last.k === 2 ? 8 : 13;
    const fx = px + p.faceX * reach;
    const fy = py + 2 + p.faceY * reach - (last.k === 2 ? 8 : 0);
    fistGlow(ctx, fx, fy, 7 - since * 0.4, 1 - since / 10, s.tick);
    if (since < 4) additive(ctx, () => shock(ctx, fx, fy, 6 + since * 4, OC_FOAM, 0.9, 2));
  }
  if (!s.pvp) gauge(ctx, s, px, by);
}
