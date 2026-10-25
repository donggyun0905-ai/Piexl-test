// 야수 그리기: 고양이·사자·그림자 고양이 · 털실·헤어볼 · 할퀴기 자국(호랑이 발톱은 굵은 네 줄) · 캣닢 구름
import { PET_STATS, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

/** 종류마다: 털 · 줄무늬(사자는 갈기) · 눈 */
const LOOK = {
  cat: { fur: "#f0a050", mark: "#b8662a", eye: "#3a3446" },
  lion: { fur: "#e0b060", mark: "#8a4a20", eye: "#3a3446" },
  shadow: { fur: "#4a3a6a", mark: "#2a2040", eye: "#c8a0ff" },
} as const;

/** 고양이들 (플레이어 다음): 옆에서 본 몸 · 머리·귀 · 꼬리, 걸으면 발이 움직임 */
export function drawPets(ctx: CanvasRenderingContext2D, s: RunState, alpha: number, snap: Snap): void {
  if (s.over) return;
  for (const pet of s.player.pets ?? []) {
    const x = snap(lerp(pet.prevX, pet.x, alpha));
    const y = snap(lerp(pet.prevY, pet.y, alpha));
    const look = LOOK[pet.kind];
    const big = PET_STATS[pet.kind].r > 3 ? 1.6 : 1;
    const f = pet.face;
    const moving = pet.x !== pet.prevX || pet.y !== pet.prevY;
    const step = moving && (s.tick >> 3) % 2 === 0 ? 1 : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f * big, big);
    if (pet.kind === "shadow") ctx.globalAlpha = 0.85;
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(-3, 2, 6, 1);
    // 꼬리 · 몸 · 다리
    ctx.fillStyle = look.fur;
    ctx.fillRect(-4, -3 - step, 1, 2);
    ctx.fillRect(-3, -1, 5, 2);
    ctx.fillRect(-3 + step, 1, 1, 1);
    ctx.fillRect(1 - step, 1, 1, 1);
    // 머리 · 귀
    ctx.fillRect(1, -3, 3, 3);
    ctx.fillRect(1, -4, 1, 1);
    ctx.fillRect(3, -4, 1, 1);
    ctx.fillStyle = look.mark;
    if (pet.kind === "lion") ctx.fillRect(0, -4, 2, 4);
    else ctx.fillRect(-1, -1, 1, 1);
    ctx.fillStyle = look.eye;
    ctx.fillRect(3, -2, 1, 1);
    ctx.restore();
  }
}

/** 털실·헤어볼이면 그리고 true */
export function drawBeastShot(ctx: CanvasRenderingContext2D, pr: ProjectileState, x: number, y: number, tick: number): boolean {
  if (pr.spirit === "yarn") {
    // 분홍 털실 뭉치 + 풀린 실
    ctx.fillStyle = "#e85a8a";
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = "#ffb0c8";
    ctx.fillRect(x - 1 + ((tick >> 2) % 2), y - 1, 1, 2);
    ctx.fillStyle = "#e85a8a";
    ctx.fillRect(x - pr.vx * 1.5, y - pr.vy * 1.5, 1, 1);
    return true;
  }
  if (pr.spirit === "hairball") {
    ctx.fillStyle = "#8a6a4a";
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = "#c8a070";
    ctx.fillRect(x - 1, y - 2, 1, 1);
    ctx.fillRect(x + 1, y, 1, 1);
    return true;
  }
  return false;
}

/** 할퀴기 자국 · 캣닢 구름이면 그리고 true */
export function drawBeastFx(ctx: CanvasRenderingContext2D, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  if (fx.kind === "scratch") {
    // 비스듬한 흰 발톱 자국 세 줄
    const x = snap(fx.x);
    const y = snap(fx.y);
    const n = fx.size;
    const px = -fx.dirY;
    const py = fx.dirX;
    ctx.strokeStyle = "#fff";
    ctx.globalAlpha = t;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = -1; i <= 1; i++) {
      const ox = px * i * n * 0.5;
      const oy = py * i * n * 0.5;
      ctx.moveTo(x + ox - fx.dirX * n - px * n * 0.4, y + oy - fx.dirY * n - py * n * 0.4);
      ctx.lineTo(x + ox + fx.dirX * n + px * n * 0.4, y + oy + fx.dirY * n + py * n * 0.4);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "tigerScratch") {
    // 호랑이 발톱: 굵은 발톱 네 줄이 비스듬히 그어짐 (주황 기운 + 흰 날, 처음엔 그어지는 중)
    const x = snap(fx.x);
    const y = snap(fx.y);
    const n = fx.size;
    const px = -fx.dirY;
    const py = fx.dirX;
    const draw = Math.min(1, (1 - t) * 4);
    ctx.lineCap = "round";
    for (const [color, width, a] of [["#ff7a2a", 3, 0.85], ["#fff", 1.5, 1]] as const) {
      ctx.globalAlpha = t * a;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const o = (i - 1.5) * 0.42 * n;
        const sx = x + px * o - fx.dirX * n * 0.9 - px * n * 0.5;
        const sy = y + py * o - fx.dirY * n * 0.9 - py * n * 0.5;
        const ex = x + px * o + fx.dirX * n * 0.9 + px * n * 0.5;
        const ey = y + py * o + fx.dirY * n * 0.9 + py * n * 0.5;
        // 가운데가 바깥으로 살짝 휘는 발톱 자국
        const cx = (sx + ex) / 2 + fx.dirX * n * 0.25;
        const cy = (sy + ey) / 2 + fx.dirY * n * 0.25;
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(cx, cy, lerp(sx, ex, draw), lerp(sy, ey, draw));
      }
      ctx.stroke();
    }
    ctx.lineCap = "butt";
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "catnip") {
    // 연두 구름: 가장자리 원 + 떠다니는 잎
    const x = snap(fx.x);
    const y = snap(fx.y);
    const fade = Math.min(1, t * 6);
    ctx.fillStyle = `rgba(120, 220, 110, ${0.18 * fade})`;
    ctx.beginPath();
    ctx.arc(x, y, fx.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(160, 240, 150, ${0.5 * fade})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = `rgba(200, 255, 190, ${0.9 * fade})`;
    for (let i = 0; i < 6; i++) {
      const a = i * 1.05 + fx.ticks * 0.03;
      const r = fx.size * (0.3 + 0.1 * (i % 4));
      ctx.fillRect(snap(x + Math.cos(a) * r), snap(y + Math.sin(a) * r * 0.8), 2, 1);
    }
    return true;
  }
  return false;
}
