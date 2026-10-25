// 닌자 그리기: 그림자 분신(뒤에서 베기·X자·땅 가시·환영진 돌진) · 분신술 분신 · 연막 구름 · 적에게 쌓인 표식 · 수리검·쿠나이·풍마 수리검·바늘
import { CLONE_GAP, RING_TICKS, STRIKE_WAIT, WEAPONS, type ProjectileState, type RunState, type Shade, type WeaponDef } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

const INK = "#1c1428";
const EDGE = "#8a5ad8";
const EYE = "#ff4a6a";

/** 그림자 분신 하나 (x, y = 몸 가운데, face = 바라보는 쪽 -1·1, a = 진하기) */
function figure(ctx: CanvasRenderingContext2D, x: number, y: number, face: number, a: number, tick: number): void {
  ctx.globalAlpha = a;
  ctx.fillStyle = EDGE;
  ctx.fillRect(x - 3, y - 5, 6, 10);
  ctx.fillStyle = INK;
  ctx.fillRect(x - 2, y - 4, 4, 8);
  // 눈 띠 · 휘날리는 목도리
  ctx.fillStyle = EYE;
  ctx.fillRect(x + (face > 0 ? 0 : -2), y - 3, 2, 1);
  ctx.fillStyle = INK;
  const wave = (tick >> 2) % 2;
  ctx.fillRect(x - face * 4 - (face > 0 ? 1 : 0), y - 2 + wave, 2, 1);
  ctx.fillRect(x - face * 6 - (face > 0 ? 1 : 0), y - 1 - wave, 2, 1);
  ctx.globalAlpha = 1;
}

/** 베는 순간의 칼빛 (from → to, 두 줄) */
function slashLine(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, a: number, cross: boolean): void {
  ctx.strokeStyle = `rgba(200, 160, 255, ${a})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const dx = x1 - x0;
  const dy = y1 - y0;
  ctx.moveTo(x1 - dx * 0.6 - dy * 0.3, y1 - dy * 0.6 + dx * 0.3);
  ctx.lineTo(x1 + dx * 0.4 + dy * 0.3, y1 + dy * 0.4 - dx * 0.3);
  if (cross) {
    ctx.moveTo(x1 - dx * 0.6 + dy * 0.3, y1 - dy * 0.6 - dx * 0.3);
    ctx.lineTo(x1 + dx * 0.4 - dy * 0.3, y1 + dy * 0.4 + dx * 0.3);
  }
  ctx.stroke();
}

function drawShade(ctx: CanvasRenderingContext2D, sh: Shade, snap: Snap, tick: number): void {
  const x = snap(sh.x);
  const y = snap(sh.y);
  if (sh.kind === "smoke") {
    if (sh.t < 0) return;
    const fade = Math.min(1, sh.t / 10, (sh.life - sh.t) / 30);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + tick / 40;
      const r = 26 * (0.55 + 0.3 * Math.sin(tick / 15 + i));
      ctx.fillStyle = `rgba(70, 60, 90, ${0.35 * fade})`;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.5, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  const face = sh.tx >= sh.x ? 1 : -1;
  if (sh.kind === "dash") {
    // 환영진: 원 위에서 가운데로 스르륵 모여듦 (선 없이 몸만, 도착하면 사라짐)
    if (sh.t > RING_TICKS) return;
    figure(ctx, x, y, face, 0.35 + 0.55 * Math.min(1, sh.t / 4), tick);
    return;
  }
  if (sh.kind === "spike") {
    // 땅에서 솟는 그림자 가시
    const up = sh.t < STRIKE_WAIT ? sh.t / STRIKE_WAIT : Math.max(0, 1 - (sh.t - STRIKE_WAIT) / 10);
    ctx.fillStyle = INK;
    for (let i = -2; i <= 2; i++) {
      const h = (8 - Math.abs(i) * 2) * up;
      ctx.fillRect(x + i * 4 - 1, y + 4 - h, 2, h);
    }
    ctx.fillStyle = `rgba(138, 90, 216, ${0.5 * up})`;
    ctx.fillRect(x - 11, y + 4, 22, 1);
    return;
  }
  // 뒤에서 베기·X자: 스르륵 나타나 베고 사라짐
  const a = sh.t < STRIKE_WAIT ? sh.t / STRIKE_WAIT : Math.max(0, 1 - (sh.t - STRIKE_WAIT) / 10);
  figure(ctx, x, y, face, a, tick);
  if (sh.t >= STRIKE_WAIT && sh.t < STRIKE_WAIT + 5) slashLine(ctx, sh.x, sh.y, snap(sh.tx), snap(sh.ty), 1 - (sh.t - STRIKE_WAIT) / 5, sh.kind === "cross");
}

/** 환영진 원과 가운데 번쩍임 (sh = 그 묶음의 첫 그림자) */
function drawRing(ctx: CanvasRenderingContext2D, sh: Shade, snap: Snap): void {
  const cx = snap(sh.tx);
  const cy = snap(sh.ty);
  const r = Math.hypot(sh.sx - sh.tx, sh.sy - sh.ty);
  const f = Math.min(1, sh.t / RING_TICKS);
  if (sh.t <= RING_TICKS) {
    ctx.fillStyle = `rgba(138, 90, 216, ${0.1 * (1 - f)})`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(190, 150, 255, ${0.6 * (1 - f)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    return;
  }
  // 모인 순간: 짧은 빛살 8줄
  const a = 1 - (sh.t - RING_TICKS) / 8;
  if (a <= 0) return;
  ctx.strokeStyle = `rgba(230, 210, 255, ${a})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let k = 0; k < 8; k++) {
    const ang = (k * Math.PI) / 4;
    const len = 4 + 6 * (1 - a);
    ctx.moveTo(cx + Math.cos(ang) * 2, cy + Math.sin(ang) * 2);
    ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
  }
  ctx.stroke();
}

/** 닌자 무기를 들었을 때: 표식 · 분신술 분신 · 그림자들 */
export function drawNinja(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  const w: WeaponDef = WEAPONS[p.weaponId];
  if (!w.shade && !p.shades?.length) return;
  // 적에게 쌓인 표식: 체력바 위 보라 점
  if (w.shade) {
    const need = Math.max(1, (w.marks ?? 3) - (p.passives.includes("shadowMark") ? 1 : 0));
    for (const e of s.enemies) {
      if (!e.marks) continue;
      const x = snap(lerp(e.prevX, e.x, alpha));
      const y = snap(lerp(e.prevY, e.y, alpha)) - e.r - 8;
      for (let i = 0; i < need; i++) {
        ctx.fillStyle = i < e.marks ? EDGE : "rgba(40, 30, 60, 0.6)";
        ctx.fillRect(x - need * 1.5 + i * 3, y, 2, 2);
      }
    }
  }
  // 분신술: 양옆 분신
  if (w.shade === "clone" && !s.over) {
    const px = lerp(p.prevX, p.x, alpha);
    const py = lerp(p.prevY, p.y, alpha);
    for (const k of [1, -1]) figure(ctx, snap(px - p.faceY * CLONE_GAP * k), snap(py + p.faceX * CLONE_GAP * k), p.faceX >= 0 ? 1 : -1, 0.55, s.tick + k * 3);
  }
  // 환영진: 그림자 9개 한 묶음마다 원 하나 (처음 크기 그대로 옅어짐) + 가운데에 모일 때 한 번 번쩍
  const dashes = (p.shades ?? []).filter((sh) => sh.kind === "dash");
  for (let i = 0; i < dashes.length; i += 9) drawRing(ctx, dashes[i]!, snap);
  for (const sh of p.shades ?? []) drawShade(ctx, sh, snap, s.tick);
}

/** 닌자 던지는 무기면 그리고 true */
export function drawNinjaShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  const sp = pr.spirit;
  if (sp !== "shuriken" && sp !== "kunai" && sp !== "fuma" && sp !== "needle") return false;
  if (sp === "kunai" || sp === "needle") {
    // 날아가는 쪽으로 긴 칼날
    const len = Math.hypot(pr.vx, pr.vy) || 1;
    const dx = pr.vx / len;
    const dy = pr.vy / len;
    ctx.strokeStyle = sp === "needle" ? "#2a1c3c" : "#c8d0e0";
    ctx.lineWidth = sp === "needle" ? 1 : 1.5;
    ctx.beginPath();
    ctx.moveTo(x - dx * 4, y - dy * 4);
    ctx.lineTo(x + dx * 3, y + dy * 3);
    ctx.stroke();
    ctx.fillStyle = sp === "needle" ? EDGE : "#7a5a3a";
    ctx.fillRect(x - dx * 5 - 0.5, y - dy * 5 - 0.5, 1, 1);
    return true;
  }
  // 돌아가는 별
  const r = sp === "fuma" ? pr.r + 1 : pr.r + 0.5;
  const a = tick / 2;
  ctx.fillStyle = sp === "fuma" ? "#5a5a6a" : "#b8c0d0";
  for (let i = 0; i < 4; i++) {
    const c = Math.cos(a + (i * Math.PI) / 2);
    const s = Math.sin(a + (i * Math.PI) / 2);
    ctx.beginPath();
    ctx.moveTo(x + c * r, y + s * r);
    ctx.lineTo(x - s * r * 0.35, y + c * r * 0.35);
    ctx.lineTo(x + s * r * 0.35, y - c * r * 0.35);
    ctx.fill();
  }
  ctx.fillStyle = "#2a2438";
  ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
  return true;
}
