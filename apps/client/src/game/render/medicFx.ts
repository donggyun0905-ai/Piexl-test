// 의사 효과 그리기 (전부 의사만의 모양): 메스 교차 베기·베인 자국 · 수혈 튜브 · 심전도·전기 불꽃 · 링거 폴대 회전 · 가스 퍼짐
// · 알약 터짐 · 구급 키트 폭발 · 붕대 채찍 · 바느질 · 회복 + · 항체 반사 · 구급차 충돌
import type { EffectState, RunState } from "@pixel-rogue/shared";
import { additive, glow, glowStroke, sparks } from "./pwFxBits";
import { C, lerp, type Snap } from "./palette";

const PILL_COLORS = ["#ff6a7a", "#7fd88a", "#ffd060"];

/** 의사 효과면 그리고 true */
export function drawMedicFx(ctx: CanvasRenderingContext2D, s: RunState, fx: EffectState, px: number, py: number, snap: Snap): boolean {
  const draw = FX[fx.kind];
  if (!draw) return false;
  const t = fx.ticks / fx.maxTicks;
  ctx.save();
  draw(ctx, fx, t, snap(fx.follow ? px : fx.x), snap(fx.follow ? py : fx.y), s.tick, snap);
  ctx.restore();
  return true;
}

type FxDraw = (ctx: CanvasRenderingContext2D, fx: EffectState, t: number, x: number, y: number, tick: number, snap: Snap) => void;

const FX: Partial<Record<EffectState["kind"], FxDraw>> = {
  // 메스: 앞쪽에 X자로 교차하는 두 줄기 빛이 번쩍이고, 교차점에 별 모양 반짝임
  slash(ctx, fx, t, x, y) {
    const a = Math.atan2(fx.dirY, fx.dirX);
    const d = fx.size * 0.6;
    const len = fx.size * 0.45;
    ctx.translate(x + Math.cos(a) * d, y + Math.sin(a) * d);
    ctx.rotate(a);
    // 처음엔 짧게 → 쭉 그어짐
    const k = Math.min(1, (1 - t) * 3);
    for (const tilt of [0.8, -0.8]) {
      const cx = Math.cos(tilt) * len * k;
      const cy = Math.sin(tilt) * len * k;
      ctx.globalAlpha = t * 0.6;
      ctx.strokeStyle = "#a8c8ff";
      ctx.lineWidth = 3;
      line(ctx, -cx, -cy, cx, cy);
      ctx.globalAlpha = t;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      line(ctx, -cx, -cy, cx, cy);
    }
    // 교차점 별: 네 갈래 빛이 커졌다 줄어듦
    const r = 2 + 4 * Math.sin(t * Math.PI);
    ctx.globalAlpha = t;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI) / 4 + 0.39;
      const rr = i % 2 === 0 ? r : r * 0.3;
      if (i === 0) ctx.moveTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
      else ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr);
    }
    ctx.closePath();
    ctx.fill();
  },
  // 베인 자국: 붉은 X (주사기·바늘이 꽂힌 자리도)
  cut(ctx, fx, t, x, y) {
    const k = fx.size + 1;
    ctx.globalAlpha = t;
    ctx.strokeStyle = C.blood;
    ctx.lineWidth = 1;
    line(ctx, x - k, y - k, x + k, y + k);
    line(ctx, x - k, y + k * 0.4, x + k * 0.6, y - k);
  },
  // 수혈 튜브: 아래로 처진 붉은 관 + 플레이어 쪽으로 흐르는 핏방울
  tube(ctx, fx, _t, x, y, tick, snap) {
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    const cx = (x + tx) / 2;
    const cy = (y + ty) / 2 + 8;
    ctx.strokeStyle = "#5a1020";
    ctx.lineWidth = 3;
    curve(ctx, tx, ty, cx, cy, x, y);
    ctx.strokeStyle = C.blood;
    ctx.lineWidth = 1.5;
    curve(ctx, tx, ty, cx, cy, x, y);
    ctx.fillStyle = "#ff8a9a";
    for (let i = 0; i < 3; i++) {
      const k = ((tick * 0.04 + i / 3) % 1);
      const bx = (1 - k) * (1 - k) * tx + 2 * (1 - k) * k * cx + k * k * x;
      const by = (1 - k) * (1 - k) * ty + 2 * (1 - k) * k * cy + k * k * y;
      ctx.fillRect(bx - 1, by - 1, 2, 2);
    }
  },
  // 제세동기: 앞으로 뻗는 심전도 (평평 → 뾰족 → 평평) + 패들 두 개
  ecg(ctx, fx, t, x, y) {
    const a = Math.atan2(fx.dirY, fx.dirX);
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.globalAlpha = t;
    ctx.fillStyle = "#9aa3b8";
    ctx.fillRect(4, -6, 3, 4);
    ctx.fillRect(4, 2, 3, 4);
    const len = fx.size;
    const pts: [number, number][] = [[6, 0], [len * 0.35, 0], [len * 0.45, -7], [len * 0.55, 6], [len * 0.62, -3], [len * 0.7, 0], [len, 0]];
    ctx.strokeStyle = "#7ff0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
    glowStroke(ctx);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.8;
    glowStroke(ctx);
  },
  // 전기 불꽃: 노란 빛줄기 네 갈래
  zap(ctx, fx, t, x, y, tick) {
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#ffe070";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const a = tick * 0.7 + (i * Math.PI) / 2;
      const r = fx.size + 3;
      line(ctx, x, y, x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
  },
  // 링거 폴대: 폴대가 한 바퀴 돌고 끝에 수액 주머니, 지나간 자리에 옅은 꼬리
  pole(ctx, fx, t, x, y) {
    const a0 = Math.atan2(fx.dirY, fx.dirX);
    const a = a0 + (1 - t) * Math.PI * 2;
    const r = fx.size;
    ctx.globalAlpha = 0.3 * t;
    ctx.strokeStyle = C.syringe;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.85, a - 1.2, a);
    glowStroke(ctx);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#c8d0e0";
    ctx.lineWidth = 1.5;
    const ex = x + Math.cos(a) * r;
    const ey = y + Math.sin(a) * r;
    line(ctx, x, y, ex, ey);
    ctx.fillStyle = C.syringe;
    ctx.fillRect(ex - 2, ey - 3, 4, 5);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(ex - 1, ey - 2, 1, 2);
  },
  // 가스 퍼짐: 작은 초록 구름이 여러 개 부풀어 오름
  puff(ctx, fx, t, x, y) {
    ctx.fillStyle = C.gas;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const d = fx.size * (1 - t) * 0.8;
      ctx.globalAlpha = 0.5 * t;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 3 + 4 * (1 - t), 0, Math.PI * 2);
      ctx.fill();
    }
  },
  // 알약 터짐: 알약 색 가루가 흩어짐
  pillpop(ctx, fx, t, x, y) {
    ctx.globalAlpha = t;
    ctx.fillStyle = PILL_COLORS[(fx.width ?? 0) % 3]!;
    for (let i = 0; i < 5; i++) {
      const a = i * 1.26;
      const d = 2 + 5 * (1 - t);
      ctx.fillRect(x + Math.cos(a) * d - 0.5, y + Math.sin(a) * d - 0.5, 1, 1);
    }
  },
  // 구급 키트 폭발: 흰 빛 → 커지는 붉은 십자 + 사방으로 날아가는 붕대 조각
  medburst(ctx, fx, t, x, y) {
    const k = 1 - t;
    additive(ctx, () => glow(ctx, x, y, fx.size * Math.min(1, k * 2) + 4, "#ffffff", t, 1.5));
    ctx.globalAlpha = t;
    const c = 3 + fx.size * 0.4 * k;
    ctx.fillStyle = C.blood;
    ctx.fillRect(x - c / 3, y - c, (c * 2) / 3, c * 2);
    ctx.fillRect(x - c, y - c / 3, c * 2, (c * 2) / 3);
    ctx.strokeStyle = C.bandage;
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + 0.3;
      const d = fx.size * k;
      line(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, x + Math.cos(a + 0.4) * (d + 4), y + Math.sin(a + 0.4) * (d + 4));
    }
  },
  // 붕대 채찍: 두루마리에서 넓은 붕대 띠(거즈 격자 무늬)가 곧게 풀려 나갔다가, 끝에서 탁 튕기고(흰 불똥) 다시 감겨 돌아옴
  lash(ctx, fx, t, x, y) {
    const u = 1 - t;
    const reach = fx.size * (u < 0.4 ? u / 0.4 : u < 0.55 ? 1 : 1 - (u - 0.55) / 0.45);
    const a = Math.atan2(fx.dirY, fx.dirX);
    ctx.translate(x, y);
    ctx.rotate(a);
    // 두루마리
    ctx.fillStyle = C.bandage;
    ctx.beginPath();
    ctx.arc(3, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c8b890";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.arc(3, 0, 1.5, 0, Math.PI * 2);
    glowStroke(ctx);
    if (reach < 2) return;
    // 띠 + 거즈 격자
    ctx.fillStyle = C.bandage;
    ctx.fillRect(3, -2, reach, 4);
    ctx.strokeStyle = "#c8b890";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.8;
    for (let d = 5; d < reach + 3; d += 3) {
      line(ctx, d, -2, d + 2, 2);
      line(ctx, d + 2, -2, d, 2);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(3 + reach - 1, -2, 2, 4);
    if (u >= 0.35 && u < 0.7) additive(ctx, () => glow(ctx, 3 + reach, 0, 8, "#ffffff", 1 - (u - 0.35) / 0.35, 1.4));
    // 끝까지 뻗은 순간 탁: 흰 불똥
    if (u >= 0.35 && u < 0.7) {
      const k = (u - 0.35) / 0.35;
      ctx.globalAlpha = 1 - k;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const ang = -1 + i * 0.5;
        const r0 = 2 + 4 * k;
        line(ctx, 3 + reach + Math.cos(ang) * r0, Math.sin(ang) * r0, 3 + reach + Math.cos(ang) * (r0 + 3), Math.sin(ang) * (r0 + 3));
      }
    }
  },
  // 봉합: 바늘 자리에서 가운데로 바느질 자국 (짧은 가로 땀)
  stitch(ctx, fx, t, x, y, _tick, snap) {
    const tx = snap(fx.toX ?? fx.x);
    const ty = snap(fx.toY ?? fx.y);
    const len = Math.hypot(tx - x, ty - y) || 1;
    const nx = -(ty - y) / len;
    const ny = (tx - x) / len;
    ctx.globalAlpha = t;
    ctx.strokeStyle = C.bandage;
    ctx.lineWidth = 1;
    line(ctx, x, y, tx, ty);
    for (let d = 3; d < len; d += 5) {
      const px = lerp(x, tx, d / len);
      const py = lerp(y, ty, d / len);
      line(ctx, px - nx * 2, py - ny * 2, px + nx * 2, py + ny * 2);
    }
  },
  // 회복: 위로 떠오르는 + (초록 = 체력, 파랑 = 보호막)
  plus(ctx, fx, t, x, y) {
    const yy = y - 4 - (1 - t) * 10;
    additive(ctx, () => glow(ctx, x, yy, 6, fx.width ? "#8ad0ff" : "#6ee87a", Math.min(1, t * 2), 0.8));
    ctx.globalAlpha = Math.min(1, t * 2);
    ctx.fillStyle = fx.width ? "#8ad0ff" : "#6ee87a";
    ctx.fillRect(x - 1, yy - 3, 2, 6);
    ctx.fillRect(x - 3, yy - 1, 6, 2);
  },
  // 항체 반사: 플레이어에서 퍼지는 Y자 항체
  antibody(ctx, fx, t, x, y) {
    const r = fx.size * (1 - t * 0.6);
    ctx.globalAlpha = t;
    ctx.strokeStyle = "#8ad0ff";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const ex = x + Math.cos(a) * r;
      const ey = y + Math.sin(a) * r;
      line(ctx, x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, ex, ey);
      line(ctx, ex, ey, ex + Math.cos(a - 0.6) * 3, ey + Math.sin(a - 0.6) * 3);
      line(ctx, ex, ey, ex + Math.cos(a + 0.6) * 3, ey + Math.sin(a + 0.6) * 3);
    }
  },
  // 구급차 충돌: 노란 별 조각
  bump(ctx, fx, t, x, y) {
    additive(ctx, () => sparks(ctx, x, y, 8, fx.size * 1.4, 1 - t, "#ffe070", x + y));
    ctx.globalAlpha = t;
    ctx.fillStyle = "#ffe070";
    for (let i = 0; i < 5; i++) {
      const a = i * 1.26 - 0.5;
      const d = fx.size * (1.2 - t * 0.6);
      ctx.fillRect(x + Math.cos(a) * d - 1, y + Math.sin(a) * d - 1, 2, 2);
    }
  },
};

function line(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): void {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  glowStroke(ctx);
}

function curve(ctx: CanvasRenderingContext2D, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number): void {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo(cx, cy, x1, y1);
  glowStroke(ctx);
}
