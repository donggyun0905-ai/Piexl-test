// 가브리엘 그리기 (몸 둘레). 몸 뒤: 불멸의 성벽 성역(땅의 금빛 원·문양) · 빛의 망치가 떨어질 자리(좁혀 드는 금빛 고리)
// 몸 위: 압박된 적(머리 위 아래로 누르는 금빛 꺾쇠 · 발밑 중력 그림자)
import { isGabriel, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, rune, type Ctx } from "./pwFxBits";
import { GB } from "./gabrielFx";

/** 몸 뒤 */
export function drawGabrielBack(ctx: Ctx, s: RunState, _a0: number, snap: Snap): void {
  const p = s.player;
  if (!isGabriel(p) || s.over) return;
  const z = p.gbZone;
  if (z && (p.gbUlt ?? 0) > 0) {
    // 성역: 금빛 원 · 천천히 도는 문양 · 끝나기 직전 깜빡임
    const x = snap(z.x);
    const y = snap(z.y);
    const end = p.gbUlt! < 90 ? 0.5 + 0.5 * Math.sin(s.tick * 0.5) : 1;
    ctx.fillStyle = alpha(GB.light, 0.08 * end);
    ctx.beginPath();
    ctx.ellipse(x, y, z.r, z.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    additive(ctx, () => {
      rune(ctx, x, y, z.r, GB.gold, 0.7 * end, s.tick * 0.01);
      rune(ctx, x, y, z.r * 0.45, GB.light, 0.5 * end, -s.tick * 0.02);
      glow(ctx, x, y, z.r * 0.5, GB.light, 0.12 * end);
    });
  }
  for (const d of p.gbDrops ?? []) {
    // 떨어질 자리: 좁혀 드는 금빛 고리
    const k = Math.min(1, d.t / 30);
    additive(ctx, () => {
      ctx.strokeStyle = alpha(GB.gold, 0.8 - k * 0.4);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(snap(d.x), snap(d.y), d.r * (0.4 + k * 0.6), d.r * 0.5 * (0.4 + k * 0.6), 0, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}

/** 몸 위 */
export function drawGabrielAura(ctx: Ctx, s: RunState, a0: number, snap: Snap): void {
  if (!isGabriel(s.player) || s.over) return;
  for (const e of s.enemies) {
    if (e.hp <= 0 || !(e.gbPress ?? 0)) continue;
    const x = snap(lerp(e.prevX, e.x, a0));
    const y = snap(lerp(e.prevY, e.y, a0));
    const al = Math.min(1, e.gbPress! / 20);
    // 발밑 중력 그림자
    ctx.fillStyle = alpha(GB.deep, 0.4 * al);
    ctx.beginPath();
    ctx.ellipse(x, y + 1, e.r + 3, (e.r + 3) * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    // 머리 위 아래로 누르는 꺾쇠 (위아래로 살짝 움직임)
    const top = y - e.r - 10 + ((s.tick >> 3) % 2);
    ctx.fillStyle = alpha(GB.gold, al);
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x - 3 + i, top + i, 1, 1);
      ctx.fillRect(x + 3 - i, top + i, 1, 1);
    }
    ctx.fillRect(x, top + 3, 1, 1);
  }
}
