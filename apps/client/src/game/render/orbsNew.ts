// 원소술사 그리기 (새 효과): 웨폰 마스터 진짜 검(칼끝이 적을 향함) · 은하수 스택 고리 · 빛 터짐 · 빅뱅 · 두 번째 중력 · 갓 핸드
import type { EffectState, OrbBody, RunState } from "@pixel-rogue/shared";
import type { Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;
const TAU = Math.PI * 2;
/** 검 원소 빛 */
const GLOW: Partial<Record<OrbBody["tag"], string>> = { fire: "#ff6a2a", water: "#3aa0ff", earth: "#c08a40", thunder: "#ffe23a", grass: "#5ad05a" };

function disc(ctx: Ctx, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.5, r), 0, TAU);
  ctx.fill();
}

/** 검이 향할 방향: 날아가는 검은 노리는 적 · 떠 있는 검은 가까운 적 · 지키는 검은 도는 방향 */
export function bladeAngle(s: RunState, b: OrbBody, i: number, cx: number, cy: number): number {
  const f = (s.player.flyers ?? []).find((x) => x.i === i);
  if (f) return Math.atan2(f.y - b.y, f.x - b.x);
  if (b.striker) {
    let best: { x: number; y: number } | null = null;
    let bd = (s.player.stats.range + 20) ** 2;
    for (const e of s.enemies) {
      const d = (e.x - b.x) ** 2 + (e.y - b.y) ** 2;
      if (e.hp > 0 && d < bd) {
        bd = d;
        best = e;
      }
    }
    return best ? Math.atan2(best.y - b.y, best.x - b.x) : -Math.PI / 2;
  }
  // 지키는 검: 몸 둘레를 도는 방향으로 칼끝
  return Math.atan2(b.y - cy, b.x - cx) + Math.PI / 2;
}

/** 진짜 검 하나: 칼날(밝은 강철 + 가운데 홈) · 코등이 · 원소 색 손잡이 · 원소 빛 */
export function drawSword(ctx: Ctx, x: number, y: number, a: number, tag: OrbBody["tag"], tick: number): void {
  const glow = GLOW[tag] ?? "#e8ecf4";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  // 원소 빛
  ctx.globalAlpha = 0.3 + 0.15 * Math.abs(Math.sin(tick * 0.15 + x));
  ctx.fillStyle = glow;
  ctx.fillRect(-4, -2.5, 13, 5);
  ctx.globalAlpha = 1;
  // 칼날 (오른쪽이 칼끝)
  ctx.fillStyle = "#b8c0d0";
  ctx.fillRect(-1, -1.5, 8, 3);
  ctx.fillStyle = "#f4f8ff";
  ctx.fillRect(-1, -1.5, 8, 1);
  ctx.fillStyle = "#8890a8";
  ctx.fillRect(0, 0, 6, 0.6);
  ctx.fillStyle = "#f4f8ff";
  ctx.fillRect(7, -1, 1, 2);
  ctx.fillRect(8, -0.5, 1, 1);
  // 코등이 · 손잡이 · 끝 장식
  ctx.fillStyle = "#e8c860";
  ctx.fillRect(-2, -3, 1.5, 6);
  ctx.fillStyle = glow;
  ctx.fillRect(-5, -1, 3, 2);
  ctx.fillStyle = "#e8c860";
  ctx.fillRect(-6, -1, 1, 2);
  ctx.restore();
}

/** 은하수 스택: 적 발밑에 별빛 고리가 차오름 (거의 다 차면 깜빡임) */
export function drawGalaxyStacks(ctx: Ctx, s: RunState, snap: Snap, max: number): void {
  for (const e of s.enemies) {
    const k = (e.galaxy ?? 0) / max;
    if (k <= 0 || e.hp <= 0) continue;
    const x = snap(e.x);
    const y = snap(e.y);
    const r = e.r + 4;
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = "#3a2a6a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = k > 0.85 ? 0.6 + 0.4 * Math.abs(Math.sin(s.tick * 0.4)) : 0.9;
    ctx.strokeStyle = k > 0.85 ? "#ffffff" : "#c8a0ff";
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * k);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** 갓 핸드: 금빛 테두리의 크고 단단한 손 (손목 띠에 빛 문양, 뒤에 후광). 드는 동안 크게, 쉴 때는 몸 옆에 떠 있음 */
export function drawGodHand(ctx: Ctx, s: RunState, cx: number, cy: number, snap: Snap): void {
  const p = s.player;
  const holding = (p.handTicks ?? 0) > 0;
  const x = snap(holding ? cx : cx + 10);
  const y = snap(holding ? cy - 26 : cy - 9 + Math.sin(s.tick * 0.08) * 1.5);
  const k = holding ? 1.2 : 0.7;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  // 후광
  ctx.globalAlpha = 0.25 + 0.1 * Math.sin(s.tick * 0.1);
  ctx.fillStyle = "#fff0a0";
  disc(ctx, 0, 0, 10);
  ctx.globalAlpha = 1;
  // 손바닥 (금빛 테두리)
  ctx.fillStyle = "#c89a3a";
  ctx.fillRect(-6, -4, 12, 9);
  ctx.fillStyle = "#ffe9b8";
  ctx.fillRect(-5, -3, 10, 7);
  // 손가락 네 개 (마디 그늘)
  for (let i = 0; i < 4; i++) {
    const fx = -5 + i * 2.6;
    const len = i === 1 || i === 2 ? 5 : 4;
    ctx.fillStyle = "#c89a3a";
    ctx.fillRect(fx - 0.5, -4 - len, 2.6, len + 1);
    ctx.fillStyle = "#ffe9b8";
    ctx.fillRect(fx, -3.5 - len, 1.6, len);
    ctx.fillStyle = "#e0c088";
    ctx.fillRect(fx, -2 - len / 2, 1.6, 0.6);
  }
  // 엄지
  ctx.fillStyle = "#c89a3a";
  ctx.fillRect(5, -2, 3.5, 3);
  ctx.fillStyle = "#ffe9b8";
  ctx.fillRect(5.5, -1.5, 2.5, 2);
  // 손목 띠 + 빛 문양
  ctx.fillStyle = "#6a4aa0";
  ctx.fillRect(-5, 5, 10, 3);
  ctx.fillStyle = "#fff6c0";
  ctx.fillRect(-1, 5.5, 2, 2);
  ctx.fillRect(-4, 6, 1, 1);
  ctx.fillRect(3, 6, 1, 1);
  ctx.restore();
  if (holding && !p.handId) {
    ctx.fillStyle = "#8a8496";
    disc(ctx, x, y + 9, 4);
    ctx.fillStyle = "#b0aabc";
    ctx.fillRect(x - 2, y + 7, 2, 1);
  }
}

/** 효과: 빛 터짐 · 빅뱅 · 두 번째 중력 */
export function drawElemFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "elLight" && fx.kind !== "elBang" && fx.kind !== "elWell") return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  const r = fx.size;
  if (fx.kind === "elLight") {
    // 빛 줄기 8개가 뻗고 가운데가 하얗게
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = "#fff6c0";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const a = (i * TAU) / 8 + 0.2;
      const len = r * (0.4 + t * 0.8) * (i % 2 ? 0.6 : 1);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
    ctx.fillStyle = "#ffffff";
    disc(ctx, x, y, 3 * (1 - t) + 1);
  } else if (fx.kind === "elBang") {
    // 빅뱅: 한 점으로 모였다가 하얀 섬광 → 보랏빛·금빛 고리가 퍼지고 별가루가 흩어짐
    if (t < 0.15) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffffff";
      disc(ctx, x, y, 2 + (1 - t / 0.15) * 6);
    } else {
      const k = (t - 0.15) / 0.85;
      ctx.globalAlpha = (1 - k) * 0.5;
      ctx.fillStyle = "#fff8e0";
      disc(ctx, x, y, r * (0.3 + k * 0.7));
      ctx.globalAlpha = 1 - k;
      for (const [m, c, w] of [[1, "#c8a0ff", 3], [0.7, "#ffd27a", 2], [0.45, "#ffffff", 1]] as const) {
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, r * m * (0.3 + k)), 0, TAU);
        ctx.stroke();
      }
      for (let i = 0; i < 16; i++) {
        const a = i * 2.39996;
        const d = r * (0.2 + k * 1.3) * (0.6 + ((i * 7) % 5) / 10);
        ctx.fillStyle = i % 3 ? "#ffffff" : "#ffd8ff";
        ctx.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d), 1, 1);
      }
    }
  } else {
    // 두 번째 중력: 같은 자리에 어두운 소용돌이가 조여 들다가 내려앉음
    ctx.globalAlpha = 0.25 + 0.2 * t;
    ctx.fillStyle = "#281446";
    disc(ctx, x, y, r * (1 - t * 0.3));
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = "#b08aff";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const k = (1 - ((t * 2 + i / 3) % 1)) * r;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1, k), t * 6 + i, t * 6 + i + 4);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  return true;
}
