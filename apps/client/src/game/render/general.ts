// 장수 그리기: 찌르기(창날 선 + 끝 반짝) · 청룡 검기·창 그림자 투사체 · 필살기(빛 터짐 + 이름 크게)
import { allPlayers, type EffectState, type ProjectileState, type RunState } from "@pixel-rogue/shared";
import { lerp, type Snap } from "./palette";
import { additive, alpha as fade, beam, crescent, glow, shock, sparks } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;

/** 청룡 검기(초승달) · 학익진 창 */
export function drawGeneralShot(ctx: Ctx, pr: ProjectileState, x: number, y: number): boolean {
  const a = Math.atan2(pr.vy, pr.vx);
  if (pr.spirit === "crescent") {
    // 청룡 검기: 비취빛 초승달 두 겹 + 흰 날 + 용 기운
    const r = pr.r + 3;
    const c = pr.tint ?? "#3ac88a";
    additive(ctx, () => {
      glow(ctx, x, y, r * 1.8, c, 0.5);
      crescent(ctx, x - Math.cos(a) * 3, y - Math.sin(a) * 3, r + 2, a, 1.25, 6, c, 0.8);
      crescent(ctx, x, y, r, a, 1.1, 2.5, pr.tint ? "#ffffff" : "#c8fff0", 1);
    });
    return true;
  }
  if (pr.spirit === "spearShot") {
    // 창 그림자: 빛 꼬리 + 나무 자루 + 번뜩이는 창날
    const fx = Math.cos(a);
    const fy = Math.sin(a);
    additive(ctx, () => beam(ctx, x - fx * 18, y - fy * 18, x, y, 2.5, pr.tint ?? "#ffe8a0", 0.45));
    ctx.strokeStyle = "#8a6a3a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - fx * 10, y - fy * 10);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = pr.tint ?? "#e8ecf4";
    ctx.beginPath();
    ctx.moveTo(x + fx * 5, y + fy * 5);
    ctx.lineTo(x - fy * 2, y + fx * 2);
    ctx.lineTo(x + fy * 2, y - fx * 2);
    ctx.fill();
    additive(ctx, () => glow(ctx, x + fx * 3, y + fy * 3, 4, "#ffffff", 0.7));
    return true;
  }
  return false;
}

export function drawGeneralFx(ctx: Ctx, fx: EffectState, snap: Snap): boolean {
  const t = fx.ticks / fx.maxTicks;
  if (fx.kind === "thrust") {
    // 찌르기: 앞으로 쭉 뻗는 빛 창날 + 끝에서 터지는 별빛 + 밀려나는 바람
    const x0 = snap(fx.x);
    const y0 = snap(fx.y);
    const reach = 0.55 + 0.45 * Math.min(1, (1 - t) * 3);
    const x1 = x0 + ((fx.toX ?? fx.x) - fx.x) * reach;
    const y1 = y0 + ((fx.toY ?? fx.y) - fx.y) * reach;
    const w = fx.width ?? 4;
    const c = fx.tint ?? "#ffe8a0";
    additive(ctx, () => {
      beam(ctx, x0, y0, x1, y1, w * (fx.tint ? 1.4 : 1), c, t);
      glow(ctx, x1, y1, 6 + w * 2 * t, c, t, 1.5);
      const g = 3 + 6 * t;
      ctx.strokeStyle = `rgba(255,255,255,${t})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1 - g, y1);
      ctx.lineTo(x1 + g, y1);
      ctx.moveTo(x1, y1 - g);
      ctx.lineTo(x1, y1 + g);
      ctx.stroke();
    });
    return true;
  }
  if (fx.kind === "legend") {
    // 필살기: 필살기 색 빛이 터지고 충격파 두 겹 + 불똥 (이름은 drawLegendName)
    const x = snap(fx.x);
    const y = snap(fx.y);
    const c = fx.tint ?? "#ffd76a";
    const r = (fx.size + 20) * (1 - t) + 6;
    additive(ctx, () => {
      glow(ctx, x, y, r, c, t * 0.7, t > 0.8 ? 1.5 : 0.4);
      shock(ctx, x, y, r, c, t, 8);
      shock(ctx, x, y, r * 1.3, "#ffffff", t * 0.6, 3);
      sparks(ctx, x, y, 14, r * 1.2, 1 - t, c, fx.x + fx.y);
    });
    return true;
  }
  return false;
}

/** 필살기 색이 입혀진 휘두르기·폭발·고리·돌진 줄: 겹치면 밝아지는 바깥 빛 + 색 + 흰 속 */
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
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (const [col, w] of [[fade(c, t * 0.3), 11], [fade(c, t * 0.8), 4], [`rgba(255,255,255,${t})`, 1.5]] as const) {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      path();
      ctx.stroke();
    }
    ctx.lineCap = "butt";
  });
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
