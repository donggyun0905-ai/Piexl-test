// 보호 이펙트 (모든 모드): 무적 보호막(결계·수호 부적 등)은 빛나는 육각 방패막 · 보호막 점수(초과 치료 등)는 금빛 얇은 막
// · 회복하면 몸에 초록 빛이 번지고 + 표시가 떠오름 (화면 전용: 체력이 늘어난 것을 보고 그림)
import type { PlayerState, RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;

/** 육각 방패막: 안쪽 빛 · 바깥·안쪽 육각 테두리 · 도는 반짝임 (끝나기 직전에는 깜빡임) */
function hexShield(ctx: Ctx, x: number, y: number, R: number, tick: number, rgb: string, alpha: number): void {
  const g = ctx.createRadialGradient(x, y, R * 0.2, x, y, R);
  g.addColorStop(0, `rgba(${rgb}, 0)`);
  g.addColorStop(0.75, `rgba(${rgb}, ${0.12 * alpha})`);
  g.addColorStop(1, `rgba(${rgb}, ${0.35 * alpha})`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.fill();
  const spin = tick / 40;
  const hex = (rr: number, a0: number) => {
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) {
      const a = a0 + (k / 6) * Math.PI * 2;
      if (k === 0) ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      else ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.stroke();
  };
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${rgb}, ${0.85 * alpha})`;
  hex(R, spin);
  ctx.strokeStyle = `rgba(${rgb}, ${0.35 * alpha})`;
  hex(R * 0.62, -spin * 1.5);
  // 도는 반짝임
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, R - 0.5, tick / 9, tick / 9 + 0.7);
  ctx.stroke();
  ctx.lineWidth = 1;
}

/** 사람마다 회복 표시 상태 (지난 체력 · 모은 회복량 · 빛 남은 프레임) */
const heals = new WeakMap<PlayerState, { hp: number; acc: number; glow: number; seed: number }>();
const GLOW = 36;

function healGlow(ctx: Ctx, p: PlayerState, x: number, y: number): void {
  let h = heals.get(p);
  if (!h) {
    h = { hp: p.hp, acc: 0, glow: 0, seed: 0 };
    heals.set(p, h);
  }
  const gain = p.hp - h.hp;
  h.hp = p.hp;
  // 조금씩 차는 재생은 모아 두었다가 최대 체력의 5%가 되면 한 번 (맞으면 모은 것 버림)
  h.acc = gain > 0 ? h.acc + gain : gain < 0 ? 0 : h.acc * 0.995;
  if (h.acc >= p.stats.maxHp * 0.05) {
    h.acc = 0;
    h.glow = GLOW;
    h.seed++;
  }
  if (h.glow <= 0) return;
  const f = 1 - h.glow / GLOW;
  h.glow--;
  // 몸에 번지는 초록 빛
  const g = ctx.createRadialGradient(x, y - 4, 1, x, y - 4, 14);
  g.addColorStop(0, `rgba(120, 255, 140, ${0.45 * (1 - f)})`);
  g.addColorStop(1, "rgba(120, 255, 140, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y - 4, 14, 0, Math.PI * 2);
  ctx.fill();
  // 떠오르는 + 다섯 개
  for (let k = 0; k < 5; k++) {
    const ox = (((h.seed * 7 + k * 13) % 17) - 8) * 1.2;
    const rise = f * 18 + k * 2;
    const a = Math.max(0, 1 - f * 1.2 - k * 0.05);
    if (a <= 0) continue;
    const px = Math.round(x + ox);
    const py = Math.round(y - 2 - rise);
    ctx.globalAlpha = a;
    ctx.fillStyle = "#0a3010";
    ctx.fillRect(px - 2, py - 1, 5, 3);
    ctx.fillRect(px - 1, py - 2, 3, 5);
    ctx.fillStyle = "#7aff8a";
    ctx.fillRect(px - 1, py, 3, 1);
    ctx.fillRect(px, py - 1, 1, 3);
  }
  ctx.globalAlpha = 1;
}

/** 몸 위에 그림: 회복 빛 · 보호막 점수 막 · 무적 보호막 */
export function drawGuardFx(ctx: Ctx, s: RunState, p: PlayerState, x: number, y: number): void {
  healGlow(ctx, p, x, y);
  const pts = p.shieldPts ?? 0;
  if (pts >= 1) hexShield(ctx, x, y - 4, p.r + 8, s.tick, "255, 210, 120", Math.min(1, 0.4 + pts / Math.max(1, p.stats.maxHp)));
  if (p.shieldTicks > 0) {
    const blink = p.shieldTicks < 40 && Math.floor(p.shieldTicks / 4) % 2 === 0;
    if (!blink) hexShield(ctx, x, y - 4, p.r + 10, s.tick, "130, 210, 255", 1);
  }
}
