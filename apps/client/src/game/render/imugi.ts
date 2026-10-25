// 이무기 그리기: 오라·용이 된 몸(imugiAura) · 폭풍·독 걸린 적 · 콤보 108 용(용 그림 모양을 무기 빛깔 반투명한 기로, 맵 아래에서 위로 크게 지나감) · 추가 공격 효과(번개·폭발·빛·늑대 이빨·하늘) · 은빛 파편
import { ROOM_MAX_X, ROOM_MIN_X, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { shapeSprite } from "../sprites";
import { drawImugiBody } from "./imugiAura";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 콤보 108의 용: 무기 빛깔 한 색의 반투명한 기(氣)로 된 용이 맵 아래에서 위로 크게 지나감 (머리 = u.y). 모양만 그리고 바탕은 없음 */
export function drawImugiOverlay(ctx: Ctx, s: RunState): void {
  const u = s.player.imUlt;
  if (!u || u.y === undefined) return;
  const img = shapeSprite("dragon", u.color);
  const core = shapeSprite("dragon", "#ffffff");
  if (!img || !core) return;
  const cx = (ROOM_MIN_X + ROOM_MAX_X) / 2;
  const size = (ROOM_MAX_X - ROOM_MIN_X) * 1.15;
  const cell = img.height;
  const frame = Math.floor(s.tick / 6) % Math.max(1, Math.floor(img.width / cell));
  // 그림은 머리가 아래를 봄 → 뒤집어서 머리가 위로 (머리 끝이 u.y)
  const draw = (src: HTMLCanvasElement, dy: number, scale: number, alpha: number) => {
    ctx.save();
    ctx.translate(cx, u.y! + size * 0.45 + dy);
    ctx.rotate(Math.PI);
    ctx.globalAlpha = alpha;
    const w = size * scale;
    ctx.drawImage(src, frame * cell, 0, cell, cell, -w / 2, -w / 2, w, w);
    ctx.restore();
  };
  ctx.globalCompositeOperation = "lighter";
  // 지나간 자리에 흐려지는 잔상 (용 모양만)
  for (let i = 3; i >= 1; i--) draw(img, size * 0.12 * i, 1 - i * 0.04, 0.12 / i);
  // 바깥 기운 → 몸 → 밝은 속
  draw(img, 0, 1.12, 0.18);
  draw(img, 0, 1, 0.42);
  draw(core, 0, 0.82, 0.18 + 0.06 * Math.sin(s.tick * 0.4));
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
}

/** 폭풍·독 걸린 적 · 오라·용이 된 몸 (플레이어 위) */
export function drawImugi(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  for (const e of s.enemies) {
    if ((e.imStorm ?? 0) > 0) {
      ctx.strokeStyle = "#7ae0ff";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.7;
      const a = s.tick * 0.4;
      ctx.beginPath();
      ctx.ellipse(snap(e.x), snap(e.y), e.r + 4, (e.r + 4) * 0.6, 0, a, a + 4);
      ctx.stroke();
    }
    if ((e.imVenomStacks ?? 0) > 0 && (e.imVenom ?? 0) > 0) {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = "#4ae05a";
      for (let i = 0; i < (e.imVenomStacks ?? 0); i++) ctx.fillRect(snap(e.x) - 6 + i * 3, snap(e.y) - e.r - 6 - ((s.tick + i * 7) % 10) / 3, 2, 2);
    }
  }
  ctx.globalAlpha = 1;
  drawImugiBody(ctx, s, alpha, snap);
}

/** 은빛 파편 */
export function drawImugiShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  if (pr.spirit !== "shard") return false;
  ctx.fillStyle = pr.tint ?? "#e8eef8";
  ctx.fillRect(x - 1, y - 1, 3, 2);
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y - 1, 1, 1);
  return true;
}

/** 하늘에서 내리치는 번개: 들쭉날쭉한 줄기(바깥 빛 → 색 → 흰 속) · 곁가지 · 땅에 닿는 섬광과 튀는 불꽃
 * strong(화룡점정): 연한 파랑 80% · 흰빛 20%로 줄기 셋, 하늘에서 내리꽂는 빛기둥과 큰 고리로 웅장하게 */
function drawBolt(ctx: Ctx, x: number, y: number, t: number, c: string, strong: boolean): void {
  const top = strong ? 110 : 60;
  const seed = (Math.round(x) * 73 + Math.round(y) * 37) | 0;
  const jag = (i: number, k: number) => ((((seed + i * 97 + k * 31) % 13) + 13) % 13) - 6;
  const path = (k: number, spread: number, off: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 8; i++) pts.push([x + off * (1 - i / 8) + (i === 8 ? 0 : jag(i, k) * spread), y - top + (top * i) / 8]);
    return pts;
  };
  const stroke = (pts: [number, number][], w: number, col: string, a: number) => {
    ctx.globalAlpha = a;
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.beginPath();
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.stroke();
  };
  const flash = Math.min(1, t * 1.6);
  const glow = strong ? "#cfe8ff" : c;
  const body = strong ? "#9fd4ff" : c;
  ctx.lineJoin = "round";
  if (strong) {
    // 하늘에서 내리꽂는 연한 빛기둥
    const g = ctx.createLinearGradient(0, y - top, 0, y);
    g.addColorStop(0, "rgba(159,212,255,0)");
    g.addColorStop(1, "rgba(159,212,255,0.55)");
    ctx.globalAlpha = flash * 0.8;
    ctx.fillStyle = g;
    ctx.fillRect(x - 9, y - top, 18, top);
  }
  const bolts = strong ? [0, -14, 14] : [0];
  bolts.forEach((off, k) => {
    const pts = path(k, strong ? 0.9 : 0.7, off);
    const main = k === 0;
    stroke(pts, strong ? (main ? 12 : 6) : 6, glow, flash * 0.22);
    stroke(pts, strong ? (main ? 5 : 2.5) : 3, body, flash * 0.95);
    // 흰 속 (화룡점정이면 가늘게 20%만)
    stroke(pts, strong ? (main ? 1 : 0.6) : 1, "#ffffff", flash);
    const [bx, by] = pts[3 + k]!;
    stroke([[bx, by], [bx + jag(9, k) * 1.4 + 6, by + 10], [bx + jag(10, k) + 10, by + 18]], 1, body, flash * 0.8);
  });
  ctx.lineJoin = "miter";
  // 땅에 닿는 섬광 · 고리 · 튀는 불꽃
  const r = (strong ? 18 : 9) * (1.2 - t);
  ctx.globalAlpha = flash * 0.5;
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = flash;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y, r * (strong ? 0.25 : 0.4), 0, Math.PI * 2);
  ctx.fill();
  for (let k = 0; k < (strong ? 2 : 1); k++) {
    ctx.globalAlpha = flash * (1 - k * 0.4);
    ctx.strokeStyle = k ? glow : body;
    ctx.lineWidth = strong ? 2 - k : 1;
    ctx.beginPath();
    ctx.ellipse(x, y + 1, r * (1.6 + k * 0.7), r * (0.6 + k * 0.25), 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  const n = strong ? 12 : 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + seed;
    const d = r * 1.2 + (1 - t) * (strong ? 22 : 10);
    ctx.globalAlpha = flash;
    ctx.fillStyle = strong ? (i % 5 === 0 ? "#fff" : body) : i % 2 ? c : "#fff";
    ctx.fillRect(x + Math.cos(a) * d - 1, y + Math.sin(a) * d * 0.6 - 1, 2, 2);
  }
  // 화룡점정: 번개 끝에 여의주 빛
  if (strong) {
    ctx.globalAlpha = flash;
    ctx.fillStyle = "#cfe8ff";
    ctx.beginPath();
    ctx.arc(x, y - top, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - 1, y - top - 1, 2, 2);
  }
}

/** 추가 공격 효과 */
export function drawImugiFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (!fx.kind.startsWith("im")) return false;
  const t = fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const c = fx.tint ?? "#ffd040";
  ctx.globalAlpha = t;
  if (fx.kind === "imBolt") {
    drawBolt(ctx, x, y, t, c, fx.dirX === 1);
  } else if (fx.kind === "imBoom" || fx.kind === "imLight" || fx.kind === "imSky") {
    const r = fx.size * (1.1 - t * 0.5);
    ctx.fillStyle = c;
    ctx.globalAlpha = t * 0.45;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = t;
    ctx.strokeStyle = fx.kind === "imLight" ? "#fff" : c;
    ctx.lineWidth = 2;
    ctx.stroke();
    if (fx.kind === "imLight") for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4);
      ctx.lineTo(x + Math.cos(a) * r * 1.2, y + Math.sin(a) * r * 1.2);
      ctx.stroke();
    }
    // 천룡: 위에서 떨어지는 하늘 조각
    if (fx.kind === "imSky") {
      ctx.fillStyle = "#8aa8ff";
      const fall = (1 - t) * 30;
      for (let i = -2; i <= 2; i++) ctx.fillRect(x + i * 8 - 3, y - 30 + fall, 6, 4);
    }
  } else if (fx.kind === "imBite") {
    // 어둠 늑대 이빨: 위아래로 다무는 송곳니 (깨문 차례가 뒤일수록 큼)
    const w = fx.size + fx.dirX * 2;
    const close = Math.min(1, (1 - t) * 3);
    ctx.fillStyle = c;
    for (let i = -2; i <= 2; i++) {
      const fxp = x + i * (w / 3);
      ctx.beginPath();
      ctx.moveTo(fxp - 2, y - 8 + close * 4);
      ctx.lineTo(fxp + 2, y - 8 + close * 4);
      ctx.lineTo(fxp, y - 2 + close * 3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fxp - 2, y + 8 - close * 4);
      ctx.lineTo(fxp + 2, y + 8 - close * 4);
      ctx.lineTo(fxp, y + 2 - close * 3);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  return true;
}
