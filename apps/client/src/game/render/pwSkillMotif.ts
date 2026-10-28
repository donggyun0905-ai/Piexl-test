// 패왕전 스킬 그림 위에 얹는 캐릭터 느낌 (fx.motif, pwKits.PW_MOTIF): 같은 모양 스킬도 캐릭터마다 다르게 보이게
// 불(솟는 불꽃) · 얼음/원소(결정·번갈아) · 번개(지그재그) · 독(거품) · 그림자(검은 연기) · 빛(반짝이·십자) · 피(방울) · 자연(잎) · 영혼(부적·혼불)
// 기계(네모 불똥·육각) · 바람(소용돌이 줄) · 시간(시계 바늘) · 충격(금·파편) · 칼날(가는 베기 줄) · 야수(발톱 자국) · 쥐(쥐떼가 줄을 따라 달림)
// 줄 모양 스킬(toX·toY)은 줄을 따라, 나머지는 범위 안에 뿌림. 궁극기는 알갱이 두 배 + 바깥 빛 고리
import type { EffectState } from "@pixel-rogue/shared";
import { rnd } from "./pwFxBits";

type Ctx = CanvasRenderingContext2D;


/** 알갱이 자리 k개: 줄이면 줄 위, 부채꼴이면 앞쪽, 아니면 원 안 */
function spots(fx: EffectState, n: number, seed: number): [number, number][] {
  const out: [number, number][] = [];
  const a = Math.atan2(fx.dirY, fx.dirX);
  for (let k = 0; k < n; k++) {
    const u = rnd(seed, k);
    const v = rnd(k, seed);
    if (fx.toX !== undefined && fx.toY !== undefined) {
      const side = (v - 0.5) * fx.size * 1.6;
      const nx = -fx.dirY;
      const ny = fx.dirX;
      out.push([fx.x + (fx.toX - fx.x) * u + nx * side, fx.y + (fx.toY - fx.y) * u + ny * side]);
    } else {
      const ang = fx.arc ? a + (u - 0.5) * 2 * fx.arc : u * Math.PI * 2;
      const d = fx.size * Math.sqrt(v);
      out.push([fx.x + Math.cos(ang) * d, fx.y + Math.sin(ang) * d]);
    }
  }
  return out;
}

const px = (ctx: Ctx, x: number, y: number, w: number, h: number, c: string) => {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
};

const SCALE = 1.7;

type Draw = (ctx: Ctx, x: number, y: number, k: number, t: number, f: number, c: string, fx: EffectState) => void;

const MOTIFS: Record<string, Draw> = {
  fire: (ctx, x, y, k, t, f) => {
    const h = 3 + (k % 3);
    const yy = y - f * 10 - (k % 4);
    px(ctx, x, yy, 2, h, "#ff5a1a");
    px(ctx, x, yy + h - 2, 2, 2, "#ffd040");
    if (k % 3 === 0) px(ctx, x, yy - 2, 1, 1, "#fff0a0");
  },
  elements: (ctx, x, y, k, t, f) => MOTIFS[["fire", "ice", "lightning"][k % 3]!]!(ctx, x, y, k, t, f, "", {} as EffectState),
  ice: (ctx, x, y, k) => {
    px(ctx, x, y - 2, 1, 5, "#c8f0ff");
    px(ctx, x - 2, y, 5, 1, "#c8f0ff");
    if (k % 2) px(ctx, x, y, 1, 1, "#ffffff");
  },
  lightning: (ctx, x, y, k) => {
    ctx.strokeStyle = k % 2 ? "#fff8a0" : "#8ad8ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x + 2, y - 2);
    ctx.lineTo(x - 1, y);
    ctx.lineTo(x + 1, y + 4);
    ctx.stroke();
  },
  poison: (ctx, x, y, k, t, f) => {
    ctx.strokeStyle = k % 2 ? "#a8ff6a" : "#6ac83a";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y - f * 8, 1.5 + (k % 3) * 0.7, 0, Math.PI * 2);
    ctx.stroke();
  },
  shadow: (ctx, x, y, k, t, f) => {
    ctx.fillStyle = k % 3 ? "#1a1424" : "#5a3a8a";
    ctx.beginPath();
    ctx.arc(x + Math.sin(f * 6 + k) * 2, y - f * 7, 2.5 - f * 1.5, 0, Math.PI * 2);
    ctx.fill();
  },
  holy: (ctx, x, y, k, t, f) => {
    const s = k % 3 === 0 ? 2 : 1;
    px(ctx, x - s, y - f * 6, s * 2 + 1, 1, "#fff6c0");
    px(ctx, x, y - f * 6 - s, 1, s * 2 + 1, "#fff6c0");
  },
  blood: (ctx, x, y, k, t, f) => {
    px(ctx, x, y + f * 6, 2, 2, "#c8102a");
    if (k % 2) px(ctx, x, y + f * 6 - 1, 1, 1, "#ff5a6a");
  },
  nature: (ctx, x, y, k, t, f) => {
    const sway = Math.sin(f * 5 + k) * 3;
    px(ctx, x + sway, y - f * 6, 3, 2, k % 2 ? "#6ad84a" : "#a8e86a");
    px(ctx, x + sway + 1, y - f * 6 + 2, 1, 1, "#3a8a2a");
  },
  spirit: (ctx, x, y, k, t, f) => {
    if (k % 3 === 0) {
      // 부적 종이
      px(ctx, x - 1, y - f * 8 - 3, 3, 5, "#ffe8a0");
      px(ctx, x, y - f * 8 - 2, 1, 3, "#c82a2a");
    } else {
      ctx.fillStyle = "#a8e8ff";
      ctx.beginPath();
      ctx.arc(x, y - f * 10, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  tech: (ctx, x, y, k, t, f) => {
    px(ctx, x + (k % 2 ? f * 5 : -f * 5), y - f * 3, 2, 2, k % 2 ? "#5ad8ff" : "#ffd060");
    if (k % 4 === 0) {
      ctx.strokeStyle = "#5ad8ff";
      ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
    }
  },
  wind: (ctx, x, y, k, t, f) => {
    ctx.strokeStyle = "#e8f4ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 3 + (k % 3), f * 6 + k, f * 6 + k + 2.2);
    ctx.stroke();
  },
  time: (ctx, x, y, k, t, f) => {
    ctx.strokeStyle = "#e8d8a0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(f * 8 + k) * 3, y + Math.sin(f * 8 + k) * 3);
    ctx.stroke();
  },
  impact: (ctx, x, y, k, t, f) => {
    px(ctx, x + (rnd(k, 3) - 0.5) * f * 12, y + (rnd(3, k) - 0.5) * f * 12 - f * 4, 2, 2, k % 2 ? "#c8b090" : "#ffffff");
  },
  blade: (ctx, x, y, k) => {
    ctx.strokeStyle = k % 2 ? "#ffffff" : "#c8d8ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 2);
    ctx.lineTo(x + 4, y - 2);
    ctx.stroke();
  },
  beast: (ctx, x, y, k) => {
    if (k % 2) return;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    for (let j = -1; j <= 1; j++) {
      ctx.beginPath();
      ctx.moveTo(x - 3 + j * 2, y - 3);
      ctx.lineTo(x + 1 + j * 2, y + 3);
      ctx.stroke();
    }
  },
};

/** 쥐떼: 줄의 시작에서 끝으로 달려감 (몸·귀·꼬리) */
function rats(ctx: Ctx, fx: EffectState, f: number, seed: number): void {
  const n = fx.ult ? 12 : 8;
  const toX = fx.toX ?? fx.x + fx.dirX * fx.size;
  const toY = fx.toY ?? fx.y + fx.dirY * fx.size;
  for (let k = 0; k < n; k++) {
    const u = Math.min(1, f * 1.3 - rnd(seed, k) * 0.3);
    if (u < 0) continue;
    const side = (rnd(k, seed) - 0.5) * 14;
    const x = fx.x + (toX - fx.x) * u - fx.dirY * side;
    const y = fx.y + (toY - fx.y) * u + fx.dirX * side + (Math.floor((f * 40 + k) % 2) ? -1 : 0);
    const d = Math.sign(fx.dirX || 1);
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    ctx.scale(2, 2);
    px(ctx, -3, -2, 6, 3, "#1a1410");
    px(ctx, -2, -2, 4, 2, "#8a7a68");
    px(ctx, d * 2, -3, 1, 1, "#e8b0b0");
    px(ctx, d * 3, -1, 1, 1, "#ff3a3a");
    px(ctx, -d * 4, 0, 2, 1, "#c8a0a0");
    ctx.restore();
  }
}

export function drawMotif(ctx: Ctx, fx: EffectState, t: number, f: number, seed: number): void {
  const m = fx.motif;
  if (!m) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, t * 1.4);
  if (m === "rats") rats(ctx, fx, f, seed);
  else {
    const draw = MOTIFS[m];
    if (draw) {
      const n = Math.round((fx.ult ? 22 : 11) * Math.min(2, Math.max(0.6, fx.size / 30)));
      // 알갱이는 1.7배로 (작은 도트가 묻히지 않게)
      for (const [k, [x, y]] of spots(fx, n, seed).entries()) {
        ctx.save();
        ctx.translate(Math.round(x), Math.round(y));
        ctx.scale(SCALE, SCALE);
        draw(ctx, 0, 0, k, t, f, fx.tint ?? "#ffffff", fx);
        ctx.restore();
      }
    }
  }
  // 궁극기: 바깥으로 번지는 두 겹 빛 고리
  if (fx.ult && fx.toX === undefined) {
    ctx.globalAlpha = t * 0.8;
    ctx.strokeStyle = fx.tint ?? "#ffffff";
    ctx.lineWidth = 2;
    for (const s of [1, 1.35]) {
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, Math.max(1, fx.size * s * (0.6 + f * 0.6)), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}
