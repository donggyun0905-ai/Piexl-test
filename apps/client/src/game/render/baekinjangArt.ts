// 백인장 그리기: 몸 위(미니 창 드론 5기와 붉은 레이저 자국 · 적안 표식 · 돌진베기 잔상)
// 그림 sprites/baekinjangFx.png (192칸 4×12, 줄 차례는 ROW) · baekinjangDrone.png — scripts/art/baekinjang.py
import { bjMarked, type RunState } from "@pixel-rogue/shared";
import { img } from "./lunaticFx";
import type { Snap } from "./palette";
import { additive, alpha as fade, glow, ring, type Ctx } from "./pwFxBits";

export const BJ = { red: "#ff2a3a", deep: "#7a0a18", light: "#ffb0b8", white: "#fff0f0" };
/** 효과 시트의 줄 */
export const ROW = { bjSlash: 0, bjFlurry: 1, bjSpin: 2, bjDash: 3, bjRain: 4, bjNeedle: 5, bjSpear: 6, bjShock: 7, bjEye: 8, bjPrison: 9, bjReaper: 10, bjEnd: 11 } as const;
const FX = img("baekinjangFx");
const DRONE = img("baekinjangDrone");
const C = 192;
const ok = (i: HTMLImageElement) => i.complete && i.naturalWidth > 0;

/** 빛 그림 한 칸 (row 줄, col 칸) → (x, y) 가운데, 너비 w, 각도 (더해 그림) · flip = 좌우 뒤집기 */
export function bjPic(ctx: Ctx, row: number, col: number, x: number, y: number, w: number, a = 1, angle = 0, flip = false): void {
  if (!ok(FX) || a <= 0) return;
  additive(ctx, () => {
    ctx.save();
    ctx.globalAlpha *= Math.min(1, a);
    ctx.translate(x, y);
    if (angle) ctx.rotate(angle);
    if (flip) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(FX, col * C, row * C, C, C, -w / 2, -w / 2, w, w);
    ctx.restore();
  });
}

/** 붉은 레이저 선 (겉은 붉게, 속은 희게) */
export function bjLaser(ctx: Ctx, ax: number, ay: number, bx: number, by: number, a: number, w = 2): void {
  additive(ctx, () => {
    for (const [col, lw, k] of [[BJ.red, w * 2.2, 0.45], [BJ.light, w, 0.8], [BJ.white, Math.max(0.6, w * 0.4), 1]] as const) {
      ctx.strokeStyle = fade(col, k * a);
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  });
}

/** 드론이 지나온 자리 (화면에서만 기억: 틱마다 한 점, 14점까지) */
const trails: { x: number; y: number }[][] = [];
let trailTick = -1;
const TRAIL = 14;

/** 몸 위: 드론과 레이저 자국 · 적안 표식 */
export function drawBaekinjangAir(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "baekinjang") return;
  const drones = p.bjDrones ?? [];
  if (trailTick !== s.tick) {
    // 틱이 건너뛰었거나 방이 바뀌었으면 자국을 지움
    if (s.tick !== trailTick + 1) trails.length = 0;
    trailTick = s.tick;
    drones.forEach((d, i) => {
      const t = (trails[i] ??= []);
      const last = t[t.length - 1];
      if (last && (last.x - d.x) ** 2 + (last.y - d.y) ** 2 > 60 * 60) t.length = 0;
      t.push({ x: d.x, y: d.y });
      if (t.length > TRAIL) t.shift();
    });
  }
  drones.forEach((d, i) => {
    const t = trails[i] ?? [];
    for (let k = 1; k < t.length; k++) bjLaser(ctx, snap(t[k - 1]!.x), snap(t[k - 1]!.y), snap(t[k]!.x), snap(t[k]!.y), (k / t.length) * 0.7, 1.2);
    const x = snap(d.x - d.vx * (1 - alpha));
    const y = snap(d.y - d.vy * (1 - alpha));
    const moving = d.vx * d.vx + d.vy * d.vy > 0.3;
    additive(ctx, () => glow(ctx, x, y, 5, BJ.red, 0.5, 0.3));
    if (!ok(DRONE)) return;
    ctx.save();
    ctx.translate(x, y + (moving ? 0 : Math.sin((s.tick + i * 13) * 0.1) * 1.5));
    ctx.rotate(moving ? Math.atan2(d.vy, d.vx) : -Math.PI / 2);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(DRONE, -7, -3.8, 14, 7.6);
    ctx.restore();
  });
  for (const e of s.enemies) {
    if (e.hp <= 0 || !bjMarked(s, e)) continue;
    const x = snap(e.x);
    const y = snap(e.y);
    const r = e.r + 5 + Math.sin(s.tick * 0.15) * 1;
    ring(ctx, x, y, r, fade(BJ.red, 0.8), 1);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) bjLaser(ctx, x + dx * (r - 2), y + dy * (r - 2), x + dx * (r + 4), y + dy * (r + 4), 0.8, 1);
  }
}
