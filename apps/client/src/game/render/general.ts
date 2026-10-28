// 장수 그리기: 찌르기(창날 선 + 끝 반짝) · 청룡 검기·창 그림자 투사체 · 필살기(빛 터짐 + 이름 크게)
import { allPlayers, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";

type Ctx = CanvasRenderingContext2D;

/** 청룡 검기(초승달) · 학익진 창 */
export function drawGeneralShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  const a = Math.atan2(pr.vy, pr.vx);
  if (pr.spirit === "crescent") {
    const r = pr.r + 3;
    ctx.globalAlpha = pr.tint ? 0.55 : 0.35;
    ctx.fillStyle = pr.tint ?? "#3ac88a";
    ctx.beginPath();
    ctx.arc(x, y, r + 2, a - 1.4, a + 1.4);
    ctx.arc(x - Math.cos(a) * 4, y - Math.sin(a) * 4, r, a + 1.2, a - 1.2, true);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pr.tint ? "#fff" : "#c8fff0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, a - 1.2, a + 1.2);
    ctx.stroke();
    return true;
  }
  if (pr.spirit === "spearShot") {
    const fx = Math.cos(a);
    const fy = Math.sin(a);
    ctx.strokeStyle = "#8a6a3a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - fx * 10, y - fy * 10);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.strokeStyle = pr.tint ?? "#e8ecf4";
    ctx.lineWidth = pr.tint ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + fx * 4, y + fy * 4);
    ctx.stroke();
    return true;
  }
  return false;
}

export function drawGeneralFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  if (fx.kind === "thrust") {
    // 찌르기: 앞으로 뻗는 흰 창날 선 (굵기 width) + 끝 반짝
    const x0 = snap(fx.x);
    const y0 = snap(fx.y);
    const reach = 0.55 + 0.45 * Math.min(1, (1 - t) * 3);
    const x1 = x0 + ((fx.toX ?? fx.x) - fx.x) * reach;
    const y1 = y0 + ((fx.toY ?? fx.y) - fx.y) * reach;
    const w = fx.width ?? 4;
    ctx.globalAlpha = t * (fx.tint ? 0.6 : 0.35);
    ctx.strokeStyle = fx.tint ?? "#ffe8a0";
    ctx.lineWidth = w * (fx.tint ? 2.2 : 1.6);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = Math.max(1, w * 0.4);
    ctx.beginPath();
    ctx.moveTo(x0 + (x1 - x0) * 0.3, y0 + (y1 - y0) * 0.3);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.lineCap = "butt";
    const g = 2 + 3 * t;
    ctx.fillStyle = "#fff";
    ctx.fillRect(x1 - g / 2, y1 - 0.5, g, 1);
    ctx.fillRect(x1 - 0.5, y1 - g / 2, 1, g);
    ctx.globalAlpha = 1;
    return true;
  }
  if (fx.kind === "legend") {
    // 필살기: 필살기마다 다른 색 고리가 크게 퍼짐 (이름은 drawLegendName)
    const x = snap(fx.x);
    const y = snap(fx.y);
    const c = fx.tint ?? "#ffd76a";
    ctx.globalAlpha = t * 0.18;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, (fx.size + 20) * (1 - t) + 6, 0, Math.PI * 2);
    ctx.fill();
    for (let k = 0; k < 2; k++) {
      ctx.globalAlpha = t * (0.8 - k * 0.3);
      ctx.strokeStyle = k ? "#fff" : c;
      ctx.lineWidth = 3 - k;
      ctx.beginPath();
      ctx.arc(x, y, (fx.size + 20) * (1 - t) * (1 + k * 0.3) + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return true;
  }
  return false;
}

/** 필살기 색이 입혀진 휘두르기·폭발·고리·돌진 줄: 바깥 빛 + 흰 속 */
export function drawTintedFx(ctx: Ctx, fx: EffectState, px: number, py: number, snap: Snap): boolean {
  const c = fx.tint;
  if (!c || !["swing", "blast", "ring", "streak"].includes(fx.kind)) return false;
  const t = fx.ticks / fx.maxTicks;
  const path = () => {
    ctx.beginPath();
    if (fx.kind === "streak") {
      ctx.moveTo(snap(fx.x), snap(fx.y));
      ctx.lineTo(snap(fx.toX ?? fx.x), snap(fx.toY ?? fx.y));
    } else if (fx.kind === "swing") {
      const a = Math.atan2(fx.dirY, fx.dirX);
      if (!fx.dirX && !fx.dirY) ctx.arc(snap(px), snap(py), fx.size, 0, Math.PI * 2);
      else ctx.arc(snap(px), snap(py), fx.size, a - 1.1, a + 1.1);
    } else ctx.arc(snap(fx.x), snap(fx.y), Math.max(1, fx.size * (1.2 - t * 0.6)), 0, Math.PI * 2);
  };
  ctx.lineCap = "round";
  ctx.globalAlpha = t * 0.45;
  ctx.strokeStyle = c;
  ctx.lineWidth = 7;
  path();
  ctx.stroke();
  ctx.globalAlpha = t;
  ctx.lineWidth = 3;
  path();
  ctx.stroke();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  path();
  ctx.stroke();
  ctx.lineCap = "butt";
  ctx.globalAlpha = 1;
  return true;
}

/** 필살기 이름: 장수 머리 위에 크게 (뜨면서 커졌다가 사라짐) */
export function drawLegendName(ctx: Ctx, s: RunState, alpha: number, name: (i: number) => string): void {
  const fx = s.effects.find((e) => e.kind === "legend");
  if (!fx) return;
  const t = fx.ticks / fx.maxTicks;
  // 쓴 사람 머리 위 (협동·패왕전은 그 자리 사람, 남이 쓴 필살기가 내 머리 위에 뜨지 않게)
  const p = allPlayers(s)[fx.seat ?? 0] ?? s.player;
  const x = lerp(p.prevX, p.x, alpha);
  const y = lerp(p.prevY, p.y, alpha) - 22 - (1 - t) * 6;
  const text = name(fx.dirX);
  const size = 9 + Math.min(1, (1 - t) * 6) * 3;
  ctx.font = `bold ${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.globalAlpha = Math.min(1, t * 3);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#140a0a";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fx.tint ?? "#ffd76a";
  ctx.fillText(text, x, y);
  ctx.globalAlpha = 1;
}
