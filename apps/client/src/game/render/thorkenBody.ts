// 토르켄 그리기 (2): 몸 둘레 — 태풍·소용돌이 (몸 뒤) / 사슬·철구공·폭풍 게이지 (몸 위) · 성게 가시·삼지창 물살 탄
import { isThorken, thorkenGauge, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, shock } from "./pwFxBits";
import { bolt, CYAN, FOAM, SEA, VOLT } from "./thorkenFx";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;

/** 철구공마다 공 색 · 둘레 빛 */
const BALL_LOOK: Record<string, [string, string]> = {
  tkIron: ["#4a4058", "#8ad8ff"],
  tkTide: ["#2a5aa8", "#6ae8ff"],
  tkVolt: ["#4a4a8a", "#fff27a"],
  tkWhirl: ["#2a6a9a", "#6ae8ff"],
  tkUrchin: ["#5a3a6a", "#ff8a9a"],
  tkTwin: ["#4a4058", "#8ad8ff"],
  tkGeyser: ["#2a6ac8", "#a8f0ff"],
  tkFloe: ["#7aa8d8", "#e0f8ff"],
  tkKraken: ["#5a2a7a", "#d88aff"],
  tkMaelstrom: ["#1a3a7a", "#6ae8ff"],
};

/** 소용돌이 (가운데 x·y, 반지름 r, 돌아간 각 spin): 바다색 팔 넷 + 흰 거품 줄 */
function vortex(ctx: Ctx, x: number, y: number, r: number, spin: number, a: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, 0.55);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, alpha("#0a3a6a", 0.55 * a));
  g.addColorStop(0.6, alpha(SEA, 0.3 * a));
  g.addColorStop(1, alpha(SEA, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TAU);
  ctx.fill();
  ctx.lineCap = "round";
  for (let k = 0; k < 4; k++) {
    for (const [c, w, off] of [[alpha(CYAN, 0.75 * a), 3, 0], [alpha(FOAM, 0.85 * a), 1, 0.12]] as const) {
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.beginPath();
      for (let u = 0; u <= 1.001; u += 0.08) {
        const ang = spin + (k / 4) * TAU + u * 3.2 + off;
        const d = r * (0.15 + u * 0.85);
        ctx.lineTo(Math.cos(ang) * d, Math.sin(ang) * d);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

/** 몸 뒤: 태풍(큰 소용돌이 + 빗줄기 + 가끔 번개) · 작은 소용돌이 */
export function drawThorkenBack(ctx: Ctx, s: RunState, _alpha: number, snap: Snap): void {
  const p = s.player;
  if (!isThorken(p)) return;
  for (const w of p.tkWhirls ?? []) vortex(ctx, snap(w.x), snap(w.y), w.r, -s.tick * 0.18, Math.min(1, w.t / 20));
  const st = p.tkStorm;
  if (!st) return;
  const a = Math.min(1, st.t / 25);
  const x = snap(st.x);
  const y = snap(st.y);
  vortex(ctx, x, y, st.r * 1.1, -s.tick * 0.12, a);
  vortex(ctx, x, y, st.r * 0.6, -s.tick * 0.2 + 1, a);
  // 빗줄기 (기울어진 흰 줄)
  ctx.strokeStyle = alpha(FOAM, 0.55 * a);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let k = 0; k < 26; k++) {
    const rx = x + ((k * 37 + s.tick * 3) % (st.r * 2)) - st.r;
    const ry = y - 40 + ((k * 53 + s.tick * 9) % (st.r + 40));
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 3, ry + 8);
  }
  ctx.stroke();
  if (st.t % 50 > 22 && st.t % 50 < 28) bolt(ctx, x + ((st.t * 13) % 30) - 15, y - 150, x + ((st.t * 7) % 24) - 12, y, st.t, 0.9, 2.5);
}

/** 철구공 하나 (빛 · 공 · 반짝임) */
function ballAt(ctx: Ctx, x: number, y: number, id: string, tick: number): void {
  const [body, rim] = BALL_LOOK[id] ?? BALL_LOOK.tkIron!;
  additive(ctx, () => glow(ctx, x, y, 12, rim, 0.45 + Math.sin(tick * 0.2) * 0.1));
  ctx.fillStyle = "#1a1626";
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, TAU);
  ctx.fill();
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, TAU);
  ctx.fill();
  ctx.fillStyle = alpha("#ffffff", 0.55);
  ctx.fillRect(x - 3, y - 3, 2, 2);
  if (id === "tkUrchin") {
    ctx.fillStyle = rim;
    for (let k = 0; k < 8; k++) ctx.fillRect(Math.round(x + Math.cos((k / 8) * TAU + tick * 0.1) * 7), Math.round(y + Math.sin((k / 8) * TAU + tick * 0.1) * 7), 1, 1);
  }
  if (id === "tkVolt" && tick % 12 < 4) bolt(ctx, x, y, x + ((tick * 5) % 12) - 6, y - 10, tick, 0.8, 1);
}

/** 사슬 (손 → 공, 고리 점) */
function chain(ctx: Ctx, x0: number, y0: number, x1: number, y1: number): void {
  const d = Math.hypot(x1 - x0, y1 - y0);
  const n = Math.max(2, Math.floor(d / 4));
  // 늘어진 사슬: 가운데가 조금 처짐
  const sag = Math.min(8, d * 0.08);
  for (let k = 1; k < n; k++) {
    const u = k / n;
    const cx = x0 + (x1 - x0) * u;
    const cy = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * sag;
    ctx.fillStyle = k % 2 ? "#c8c8d8" : "#7a7a8a";
    ctx.fillRect(Math.round(cx) - 1, Math.round(cy) - 1, 2, 2);
  }
}

/** 몸 위: 사슬·철구공 · 폭풍 게이지 (발밑 줄, 가득이면 번쩍) */
export function drawThorkenAura(ctx: Ctx, s: RunState, alpha0: number, snap: Snap): void {
  const p = s.player;
  if (!isThorken(p)) return;
  const x = snap(lerp(p.prevX, p.x, alpha0));
  const y = snap(lerp(p.prevY, p.y, alpha0));
  if (p.tkMode) {
    const bx = snap(p.tkBx ?? p.x);
    const by = snap(p.tkBy ?? p.y) - (p.tkMode === 1 && p.tkFly ? Math.sin((1 - p.tkFly.t / 12) * Math.PI) * 16 : 0) - 3;
    chain(ctx, x + p.faceX * 4, y - 4, bx, by);
    ballAt(ctx, bx, by, p.weaponId, s.tick);
    if (p.weaponId === "tkTwin" && p.tkMode === 2) {
      const tx = x - (bx - x);
      const ty = y - 3 - (by - y + 3);
      chain(ctx, x - p.faceX * 4, y - 4, tx, ty);
      ballAt(ctx, tx, ty, p.weaponId, s.tick);
    }
  }
  // 폭풍 게이지: 발밑 가는 줄 (하늘색 → 가득이면 노란 번쩍임)
  const g = thorkenGauge(p);
  const w = 22;
  const gy = y + p.r + 6;
  ctx.fillStyle = "#0a1a2a";
  ctx.fillRect(x - w / 2 - 1, gy - 1, w + 2, 4);
  ctx.fillStyle = g >= 1 ? (s.tick % 10 < 5 ? VOLT : FOAM) : CYAN;
  ctx.fillRect(x - w / 2, gy, Math.round(w * g), 2);
  if (g >= 1) additive(ctx, () => shock(ctx, x, y - 4, 16 + Math.sin(s.tick * 0.3) * 2, CYAN, 0.6, 4));
}

/** 성게 가시 · 삼지창 물살 */
export function drawThorkenShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "tkSpike" && pr.spirit !== "tkWater") return false;
  const len = Math.hypot(pr.vx, pr.vy) || 1;
  const dx = pr.vx / len;
  const dy = pr.vy / len;
  if (pr.spirit === "tkSpike") {
    ctx.strokeStyle = "#ff8a9a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - dx * 6, y - dy * 6);
    ctx.lineTo(x + dx * 2, y + dy * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.fillRect(Math.round(x + dx * 2), Math.round(y + dy * 2), 1, 1);
    return true;
  }
  // 물살: 흰 머리 + 하늘색 꼬리 + 물방울
  ctx.lineCap = "round";
  for (const [c, w] of [[alpha(SEA, 0.5), 6], [alpha(CYAN, 0.9), 3], [FOAM, 1]] as const) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x - dx * 12, y - dy * 12);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  ctx.lineCap = "butt";
  return true;
}
