// 펜리르 그리기 도우미: 푸른 검기 색 · 휘둘러 나가는 초승달 띠(연기 그림자 → 보랏빛 번짐 → 푸른 몸 → 흰 날) · 수정 파편 · 갈라진 땅 · 몸이 뜨는 높이
// (사용자가 준 이펙트 참고 그림의 느낌만 따서 코드로 새로 그림: 푸른 초승달 베기·수정 조각·내리꽂고 사방으로 긋는 검기)
import { FENRIR, type PlayerState } from "@pixel-rogue/shared";
import { additive, alpha, rnd, type Ctx } from "./pwFxBits";

export const DEEP = "#1a2a8a";
export const BLUE = "#3a6aff";
export const SKY = "#7ab0ff";
export const ICE = "#c8e4ff";
export const VIOLET = "#8a6aff";
export const SMOKE = "#1a1830";
const TAU = Math.PI * 2;

/** 두 각도 사이 초승달 띠 (가운데가 두껍고 양 끝이 가늘어짐) */
function band(ctx: Ctx, x: number, y: number, r: number, a0: number, a1: number, thick: number, sy: number): void {
  const steps = 16;
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const ang = a0 + ((a1 - a0) * k) / steps;
    ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r * sy);
  }
  for (let k = steps; k >= 0; k--) {
    const u = k / steps;
    const ang = a0 + (a1 - a0) * u;
    const rr = r - thick * Math.sin(u * Math.PI);
    ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * sy);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * 휘둘러 나가는 검기: a 방향 둘레 ±arc를 sweep(0~1)만큼 그어 나감 · fade 투명도
 * dir: 1이면 시계 방향 · smoke: 바깥 어두운 연기 그림자 · tint: 몸 색 (보랏빛/푸른빛) · sy: 세로 눌림(바닥에 누운 검기)
 */
export function slashArc(ctx: Ctx, x: number, y: number, r: number, a: number, arc: number, thick: number, sweep: number, fade: number, dir = 1, smoke = true, tint = BLUE, sy = 1): void {
  if (sweep <= 0 || fade <= 0) return;
  const start = a - arc * dir;
  const end = start + arc * 2 * dir * Math.min(1, sweep);
  const [a0, a1] = dir > 0 ? [start, end] : [end, start];
  if (smoke) {
    ctx.fillStyle = alpha(SMOKE, 0.45 * fade);
    band(ctx, x, y, r * 1.12, a0 - 0.05, a1 + 0.05, thick * 1.6, sy);
  }
  additive(ctx, () => {
    ctx.fillStyle = alpha(VIOLET, 0.35 * fade);
    band(ctx, x, y, r * 1.06, a0, a1, thick * 1.8, sy);
    ctx.fillStyle = alpha(tint, 0.85 * fade);
    band(ctx, x, y, r, a0, a1, thick, sy);
  });
  ctx.fillStyle = `rgba(255,255,255,${0.95 * fade})`;
  band(ctx, x, y, r, a0, a1, Math.max(1, thick * 0.3), sy);
}

/** 깨진 수정 조각: 맞은 자리에서 튀어 나가며 반짝 (n개, 퍼진 거리 d) */
export function shards(ctx: Ctx, x: number, y: number, n: number, d: number, f: number, seed: number, a = 1): void {
  for (let k = 0; k < n; k++) {
    const ang = rnd(seed, k) * TAU;
    const far = d * (0.4 + rnd(k, seed) * 0.8) * (1 - (1 - f) ** 2);
    const s = 1.5 + rnd(seed + 5, k) * 2.5;
    const px = x + Math.cos(ang) * far;
    const py = y + Math.sin(ang) * far - Math.sin(f * Math.PI) * 6 * rnd(k, 3);
    const spin = ang + f * 6 * (k % 2 ? 1 : -1);
    ctx.fillStyle = k % 3 === 0 ? `rgba(255,255,255,${a * (1 - f)})` : alpha(k % 2 ? ICE : SKY, a * (1 - f));
    ctx.beginPath();
    ctx.moveTo(px + Math.cos(spin) * s, py + Math.sin(spin) * s);
    ctx.lineTo(px + Math.cos(spin + 2.2) * s * 0.5, py + Math.sin(spin + 2.2) * s * 0.5);
    ctx.lineTo(px + Math.cos(spin + 3.6) * s * 0.7, py + Math.sin(spin + 3.6) * s * 0.7);
    ctx.closePath();
    ctx.fill();
  }
}

/** 갈라진 땅: 가운데서 n갈래 꺾인 금 (빛나는 금 · glow 투명도) */
export function cracks(ctx: Ctx, x: number, y: number, r: number, n: number, seed: number, a: number, glowA = a): void {
  ctx.lineCap = "round";
  for (let k = 0; k < n; k++) {
    const base = (k / n) * TAU + rnd(seed, k) * 0.5;
    const pts: [number, number][] = [[x, y]];
    let ang = base;
    for (let j = 1; j <= 4; j++) {
      ang += (rnd(seed + j, k) - 0.5) * 0.7;
      const d = (r * j) / 4;
      pts.push([x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.55]);
    }
    for (const [col, w, add] of [[DEEP, 2.4, false], [SKY, 1.4, true], ["#ffffff", 0.6, true]] as const) {
      const draw = () => {
        ctx.strokeStyle = col === "#ffffff" ? `rgba(255,255,255,${glowA})` : alpha(col, add ? glowA : a);
        ctx.lineWidth = w;
        ctx.beginPath();
        pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
        ctx.stroke();
      };
      if (add) additive(ctx, draw);
      else draw();
    }
  }
  ctx.lineCap = "butt";
}

/** 천랑 낙인으로 몸이 뜬 높이 (픽셀): 천천히 솟았다가 빠르게 내리꽂음 */
export function fenrirLift(p: PlayerState): number {
  if (!p.fnAir) return 0;
  const u = 1 - p.fnAir / FENRIR.jumpTicks;
  return u < 0.65 ? 30 * (1 - (1 - u / 0.65) ** 3) : 30 * (1 - ((u - 0.65) / 0.35) ** 2);
}
