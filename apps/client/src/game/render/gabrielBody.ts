// 가브리엘 그리기 (몸 둘레). 몸 뒤: 불멸의 성벽 성역(땅의 금빛 원·문양) · 빛의 망치가 떨어질 자리(좁혀 드는 금빛 고리)
// 몸 위: 성벽 미니 망치 다섯(몸 둘레를 돎) · 중력 붕괴로 끌어모으는 소용돌이·끌려오는 줄 · 압박된 적(머리 위 아래로 누르는 금빛 꺾쇠 · 발밑 중력 그림자) · 방패 돌진 중 앞에 세운 빛나는 방패와 뒤로 흐르는 빛줄기
import { gbMiniAt, isGabriel, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha, glow, rune, type Ctx } from "./pwFxBits";
import { GB } from "./gabrielFx";
import { lightHammer, lightShield } from "./gabrielArt";

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
  const p = s.player;
  if (!isGabriel(p) || s.over) return;
  const bx = snap(lerp(p.prevX, p.x, a0));
  const by = snap(lerp(p.prevY, p.y, a0));
  if (p.gbMini !== undefined) {
    // 미니 망치: 몸 둘레를 돌며 머리가 바깥을 향함
    for (let i = 0; i < 5; i++) {
      const [mx, my] = gbMiniAt(p, s.tick, i);
      const t = Math.atan2(my - p.y, mx - p.x);
      const hx = bx + (mx - p.x);
      const hy = by - 6 + (my - p.y) * 0.6;
      lightHammer(ctx, hx - Math.cos(t + 1.57) * 7, hy - Math.sin(t + 1.57) * 7, t + 1.57, 14, 0.95);
    }
  }
  if ((p.gbWell ?? 0) > 0) {
    // 중력 붕괴: 나에게 말려 드는 보라 고리 · 끌려오는 적과 이어진 중력 줄 · 터지기 직전 보호막이 금빛으로 부풂
    const k = 1 - p.gbWell! / 48;
    additive(ctx, () => {
      for (let i = 0; i < 3; i++) {
        const rr = 110 * (1 - ((s.tick * 0.04 + i / 3) % 1));
        ctx.strokeStyle = alpha(GB.grav, 0.6 * (rr / 110));
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(bx, by, rr, rr * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const e of s.enemies) {
        if (e.hp <= 0 || Math.hypot(e.x - p.x, e.y - p.y) > 130) continue;
        ctx.strokeStyle = alpha(GB.grav, 0.5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(snap(lerp(e.prevX, e.x, a0)), snap(lerp(e.prevY, e.y, a0)) - 4);
        ctx.lineTo(bx, by - 8);
        ctx.stroke();
      }
      glow(ctx, bx, by - 8, 14 + k * 16, (p.shieldPts ?? 0) > 0 ? GB.light : GB.grav, 0.4 + k * 0.5, k);
    });
  }
  const rush = p.s2Rush;
  if (rush) {
    const px = bx;
    const py = by - 8;
    const a = Math.atan2(rush.dy, rush.dx);
    additive(ctx, () => {
      for (let i = 0; i < 5; i++) {
        const off = (i - 2) * 6;
        const len = 18 + ((s.tick * 3 + i * 7) % 14);
        const sx = px - rush.dx * 6 - rush.dy * off;
        const sy = py - rush.dy * 6 + rush.dx * off;
        ctx.strokeStyle = alpha(i % 2 ? GB.gold : GB.white, 0.6);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - rush.dx * len, sy - rush.dy * len);
        ctx.stroke();
      }
    });
    lightShield(ctx, px + rush.dx * 16, py + rush.dy * 16, a, 42 + Math.sin(s.tick * 0.8) * 2, 1);
  }
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
