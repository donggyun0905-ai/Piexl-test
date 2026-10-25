// 라스트 보스 궁극기 그리기: 용 염옥(커지는 불덩이 · 분화구 장면, 터질 때는 예고 없음) · 갓이터 패링(작은 방 밖이 깜깜, 패링 자세)
import { cageRect, PARRY_TICKS, HELL_CHARGE, HELL_COLS, HELL_ROWS, HELL_SHOW, HELL_WAVES, hellCell, type RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";

const TAU = Math.PI * 2;
/** 장면 사이 잠깐 비우는 틱 (같은 모양이 이어져도 바뀐 걸 알게) */
const BLINK = 6;

/** 바닥에: 염옥 분화구 장면 (안전한 칸만 비어 있음) */
export function drawUltGround(ctx: CanvasRenderingContext2D, s: RunState): void {
  for (const e of s.enemies) {
    if (e.kind !== "dragon" || e.ultAt === undefined || !e.ultSafe) continue;
    const t = s.tick - e.ultAt - HELL_CHARGE;
    const i = Math.floor(t / HELL_SHOW);
    if (t < 0 || i >= HELL_WAVES || t % HELL_SHOW >= HELL_SHOW - BLINK) continue;
    for (let q = 0; q < HELL_COLS * HELL_ROWS; q++) {
      if (q === e.ultSafe[i]) continue;
      const [l, top, r, b] = hellCell(q);
      ctx.fillStyle = "rgba(255, 90, 20, 0.35)";
      ctx.fillRect(l + 1, top + 1, r - l - 2, b - top - 2);
      // 분화구: 가운데 검붉은 구멍 + 솟는 불
      const cx = (l + r) / 2;
      const cy = (top + b) / 2;
      ctx.fillStyle = "#3a1008";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, (r - l) / 4, (b - top) / 6, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = (s.tick + q) % 8 < 4 ? "#ffb040" : "#ff6a20";
      ctx.fillRect(cx - 3, cy - 10, 6, 12);
    }
  }
}

/** 쇠사슬 한 줄: 잿빛 고리가 이어짐 */
function chain(ctx: CanvasRenderingContext2D, x: number, y: number, tx: number, ty: number): void {
  const len = Math.hypot(tx - x, ty - y);
  const n = Math.floor(len / 4);
  for (let i = 1; i < n; i++) {
    const cx = x + ((tx - x) * i) / n;
    const cy = y + ((ty - y) * i) / n;
    ctx.strokeStyle = i % 2 === 0 ? "#b8b0c8" : "#7a7088";
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(cx) - 1, Math.round(cy) - 1, 2, 2);
  }
}

/** 지금 작은 방 높이 */
function cageH(s: RunState): number | null {
  for (const e of s.enemies) {
    const rect = cageRect(s, e);
    if (rect) return rect[3] - rect[1];
  }
  return null;
}

/** 패링: 작은 방 위에 안내 · 사방 쇠사슬 · 패링 자세면 플레이어 둘레에 빛나는 고리 */
function drawParry(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap, l: number, top: number, r: number): void {
  const p = s.player;
  ctx.font = "bold 8px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = (p.parryCd ?? 0) > 0 ? "#8a7aa0" : "#ffe9a0";
  ctx.fillText("⚔ PARRY", (l + r) / 2, top - 4);
  // 사방(동서남북) 쇠사슬: 플레이어에서 작은 방 벽까지
  const x = snap(p.x);
  const y = snap(p.y);
  const bottom = top + (cageH(s) ?? 0);
  for (const [tx, ty] of [[x, top], [x, bottom], [l, y], [r, y]] as const) chain(ctx, x, y, tx, ty);
  const k = (p.parryTicks ?? 0) / PARRY_TICKS;
  if (k <= 0) return;
  ctx.strokeStyle = `rgba(255, 250, 220, ${0.4 + 0.6 * k})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(snap(p.x), snap(p.y), p.r + 5, 0, TAU);
  ctx.stroke();
}

/** 맨 위에: 용 입에서 커지는 염옥 불덩이 · 갓이터 패링 작은 방 밖 어둠 */
export function drawUltOverlay(ctx: CanvasRenderingContext2D, s: RunState, snap: Snap): void {
  for (const e of s.enemies) {
    if (e.ultAt === undefined) continue;
    const t = s.tick - e.ultAt;
    if (e.kind === "dragon" && t < HELL_CHARGE) {
      const r = 110 * (t / HELL_CHARGE);
      const x = snap(e.x + (e.dirX ?? 0) * e.r);
      const y = snap(e.y + (e.dirY ?? 0) * e.r);
      ctx.fillStyle = "rgba(255, 80, 20, 0.45)";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 220, 120, 0.6)";
      ctx.beginPath();
      ctx.arc(x, y, r * 0.55, 0, TAU);
      ctx.fill();
    }
    const rect = cageRect(s, e);
    if (rect) {
      const [l, top, r, b] = rect;
      ctx.fillStyle = "rgba(0, 0, 0, 0.94)";
      ctx.beginPath();
      ctx.rect(l - 1000, top - 1000, r - l + 2000, b - top + 2000);
      ctx.rect(r, top, l - r, b - top);
      ctx.fill("evenodd");
      ctx.strokeStyle = "rgba(160, 60, 220, 0.9)";
      ctx.lineWidth = 1;
      ctx.strokeRect(l, top, r - l, b - top);
      drawParry(ctx, s, snap, l, top, r);
    }
  }
}
