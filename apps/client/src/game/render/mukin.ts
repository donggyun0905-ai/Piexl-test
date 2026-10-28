// 묵인 그리기: 돌진할 때 몸 앞에 생기는 거대한 마력 방패(무기마다 모양·색이 다름) · 요새 방벽 · 회복약이 차오르는 빛
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { additive, glow } from "./pwFxBits";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 무기마다 방패: 색 · 테두리 색 · 폭(옆으로 반) · 모양 */
type Shape = "round" | "tower" | "crack" | "arrow" | "twin" | "chain" | "wall" | "spike" | "fort" | "flame";
const SHIELDS: Record<string, { c: string; e: string; w: number; shape: Shape }> = {
  ironHorn: { c: "#e8c060", e: "#fff4c0", w: 16, shape: "round" },
  shieldBash: { c: "#5aa8ff", e: "#e0f0ff", w: 18, shape: "tower" },
  quakeRam: { c: "#d88a3a", e: "#ffd8a0", w: 17, shape: "crack" },
  longRam: { c: "#4ae8e8", e: "#e0ffff", w: 13, shape: "arrow" },
  twinRam: { c: "#7ad8ff", e: "#ffe8a0", w: 15, shape: "twin" },
  chainRam: { c: "#a87aff", e: "#e8d8ff", w: 15, shape: "chain" },
  wallRam: { c: "#8aa890", e: "#e0f0e0", w: 26, shape: "wall" },
  spikeRam: { c: "#e84a4a", e: "#ffd0d0", w: 16, shape: "spike" },
  fortressRam: { c: "#f2c14e", e: "#ffffff", w: 20, shape: "fort" },
  meteorRam: { c: "#ff6a2a", e: "#ffe070", w: 18, shape: "flame" },
};

/** 방패 하나 (몸 앞 가까운 쪽이 x=0, 옆이 y) */
function shield(ctx: Ctx, sh: (typeof SHIELDS)[string], tick: number): void {
  const w = sh.w;
  const pulse = 0.55 + Math.sin(tick * 0.5) * 0.15;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = sh.c;
  ctx.beginPath();
  if (sh.shape === "arrow") {
    ctx.moveTo(-2, -w);
    ctx.lineTo(8, 0);
    ctx.lineTo(-2, w);
    ctx.lineTo(1, 0);
  } else if (sh.shape === "tower" || sh.shape === "wall") {
    ctx.rect(-2, -w, 5, w * 2);
  } else {
    // 볼록한 마력 방패 (앞쪽으로 둥글게)
    ctx.moveTo(-2, -w);
    ctx.quadraticCurveTo(10, 0, -2, w);
    ctx.closePath();
  }
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = sh.e;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = sh.e;
  switch (sh.shape) {
    case "round":
      // 가운데 쇠뿔 문양
      ctx.fillRect(2, -1, 3, 2);
      ctx.fillRect(4, -3, 1, 2);
      ctx.fillRect(4, 1, 1, 2);
      break;
    case "tower":
      for (let y = -w + 3; y < w; y += 6) ctx.fillRect(0, y, 2, 1);
      break;
    case "crack":
      for (let i = 0; i < 4; i++) ctx.fillRect(1 + (i % 2), -w + 4 + i * 8, 1, 4);
      ctx.fillStyle = "#7a5a3a";
      for (let i = 0; i < 3; i++) ctx.fillRect(-6 - ((tick + i * 5) % 8), -w + 6 + i * 10, 2, 2);
      break;
    case "arrow":
      for (const y of [-w * 0.6, 0, w * 0.6]) ctx.fillRect(-14 - ((tick * 2) % 6), y, 8, 1);
      break;
    case "twin":
      ctx.strokeStyle = "#ffe8a0";
      ctx.beginPath();
      ctx.moveTo(-6, -w + 3);
      ctx.quadraticCurveTo(5, 0, -6, w - 3);
      ctx.stroke();
      break;
    case "chain":
      ctx.strokeStyle = sh.e;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(-6 - i * 5, Math.sin(tick * 0.4 + i) * 3, 2.5, 1.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case "wall":
      for (let y = -w; y < w; y += 4) ctx.fillRect((y / 4) % 2 ? 0 : 1, y, 1, 3);
      break;
    case "spike":
      for (let y = -w + 2; y <= w - 2; y += 5) {
        ctx.beginPath();
        ctx.moveTo(4, y - 2);
        ctx.lineTo(9, y);
        ctx.lineTo(4, y + 2);
        ctx.fill();
      }
      break;
    case "fort":
      for (let y = -w; y < w; y += 6) ctx.fillRect(5, y, 3, 3);
      ctx.fillStyle = "#c81e2a";
      ctx.fillRect(1, -2, 3, 4);
      break;
    case "flame":
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = i % 2 ? "#ffd040" : "#ff4a1a";
        ctx.fillRect(-4 - ((tick * 1.5 + i * 4) % 14), -w + 3 + i * ((w * 2 - 6) / 5), 3, 2);
      }
      break;
  }
}

/** 몸 위: 돌진 중 마력 방패 · 요새 방벽 · 회복약이 차오르는 초록 빛 */
export function drawMukinAura(ctx: Ctx, s: RunState, alpha: number, snap: Snap): void {
  const p = s.player;
  if (p.characterId !== "mukin") return;
  const x = snap(lerp(p.prevX, p.x, alpha));
  const y = snap(lerp(p.prevY, p.y, alpha));
  const r = p.s2Rush;
  if (r) {
    const sh = SHIELDS[p.weaponId] ?? SHIELDS.ironHorn!;
    ctx.save();
    ctx.translate(x + r.dx * (p.r + 12), y - 14 + r.dy * (p.r + 12));
    ctx.rotate(Math.atan2(r.dy, r.dx));
    // 거대한 몸에 맞게 크게
    ctx.scale(1.6, 1.6);
    shield(ctx, sh, s.tick);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  if ((p.mkGuard ?? 0) > 0) {
    ctx.globalAlpha = 0.5 + Math.sin(s.tick * 0.3) * 0.2;
    ctx.strokeStyle = "#e8c070";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - p.r - 6, y - p.r - 26, (p.r + 6) * 2, p.r + 32);
    ctx.globalAlpha = 1;
  }
  if ((p.mkPool ?? 0) > 0) {
    for (let i = 0; i < 4; i++) {
      const k = (s.tick * 0.7 + i * 11) % 30;
      ctx.globalAlpha = 1 - k / 30;
      ctx.fillStyle = "#8aff8a";
      ctx.fillRect(Math.round(x + Math.sin(i * 2.4) * (p.r + 2)), Math.round(y - k), 1, 2);
    }
    ctx.globalAlpha = 1;
  }
}

/** 요새 돌진이 끝났을 때 금빛 네모 방벽이 번쩍 */
export function drawMukinFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  if (fx.kind !== "mkGuard") return false;
  const t = 1 - fx.ticks / fx.maxTicks;
  const x = snap(fx.x);
  const y = snap(fx.y);
  // 금빛 방벽: 겹치는 빛 네모 두 겹 + 가운데 빛 + 모서리 반짝임
  const k = 1 + t * 0.4;
  const w = fx.size * 2 * k;
  const h = fx.size * 2.2 * k;
  additive(ctx, () => {
    glow(ctx, x, y - fx.size * 0.1, fx.size * 1.6, "#e8c070", (1 - t) * 0.6, t < 0.2 ? 1 : 0);
    for (const [c, lw, m] of [["rgba(232,192,112,0.35)", 6, 1], ["#ffe8a0", 2, 1], ["#ffffff", 1, 0.85]] as const) {
      ctx.globalAlpha = 1 - t;
      ctx.strokeStyle = c;
      ctx.lineWidth = lw;
      ctx.strokeRect(x - (w * m) / 2, y - fx.size * 0.1 - (h * m) / 2, w * m, h * m);
    }
    ctx.globalAlpha = 1;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) glow(ctx, x + (sx * w) / 2, y - fx.size * 0.1 + (sy * h) / 2, 4, "#ffffff", 1 - t, 1);
  });
  return true;
}
