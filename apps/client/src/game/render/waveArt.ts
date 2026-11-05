// 웨이브 그림 도구: 상상으로 빚은 물 — 투명한 하늘색 몸 · 흰 거품 테두리 · 안쪽 빛무늬 · 반짝임 (도트가 아닌 부드러운 물)
// 물덩이 · 초승달 파도 · 나비 · 여신 · 손 · 문어 다리 · 눈 · 꿈의 고래 · 음표 · 깃털 · 물고기 · 연꽃잎 · 구름
import { additive, alpha, glow, rnd, type Ctx } from "./pwFxBits";
import { glint } from "./seaLight";

export const WV = { aqua: "#6aeeff", sky: "#9af6ff", deep: "#1a7ae8", foam: "#f4ffff", pale: "#c8f8ff", pink: "#ff9ad8", gold: "#ffe27a", ink: "#0a3a6a" };
const TAU = Math.PI * 2;

/** 물로 된 몸 칠하기: 가운데 맑고 가장자리 진한 하늘색 + 흰 테두리 (path는 미리 만든 길) */
export function waterFill(ctx: Ctx, x: number, y: number, r: number, a: number, path: () => void, edge = 1.2): void {
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r * 1.2);
  g.addColorStop(0, alpha(WV.foam, 0.85 * a));
  g.addColorStop(0.35, alpha(WV.aqua, 0.55 * a));
  g.addColorStop(1, alpha(WV.deep, 0.75 * a));
  ctx.fillStyle = g;
  path();
  ctx.fill();
  ctx.strokeStyle = alpha(WV.foam, 0.9 * a);
  ctx.lineWidth = edge;
  ctx.stroke();
}

/** 일렁이는 물덩이 (둘레가 살아 움직임) */
export function blob(ctx: Ctx, x: number, y: number, r: number, a: number, tick: number, seed = 0, wob = 0.12): void {
  waterFill(ctx, x, y, r, a, () => {
    ctx.beginPath();
    for (let i = 0; i <= 16; i++) {
      const t = (i / 16) * TAU;
      const rr = r * (1 + Math.sin(t * 3 + tick * 0.18 + seed) * wob + Math.sin(t * 5 - tick * 0.11 + seed * 2) * wob * 0.5);
      ctx.lineTo(x + Math.cos(t) * rr, y + Math.sin(t) * rr);
    }
    ctx.closePath();
  });
  glint(ctx, x - r * 0.35, y - r * 0.4, Math.max(1.5, r * 0.25), WV.foam, a);
}

/** 말려 올라가는 초승달 파도 (ang 나아가는 쪽 · r 크기): 짙은 물 몸 + 흰 물마루 + 뒤로 흩어지는 물방울 */
export function crestWave(ctx: Ctx, x: number, y: number, ang: number, r: number, a: number, tick: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  additive(ctx, () => glow(ctx, 0, 0, r * 1.6, WV.aqua, 0.5 * a));
  const g = ctx.createLinearGradient(-r, 0, r * 0.6, 0);
  g.addColorStop(0, alpha(WV.deep, 0));
  g.addColorStop(0.5, alpha(WV.aqua, 0.7 * a));
  g.addColorStop(1, alpha(WV.foam, 0.95 * a));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(-r * 0.3, 0, r, -1.25, 1.25);
  ctx.arc(-r * 0.75, 0, r * 0.95, 1.1, -1.1, true);
  ctx.closePath();
  ctx.fill();
  // 물마루 (흰 거품 줄이 앞쪽 가장자리를 따라 감김)
  ctx.strokeStyle = alpha(WV.foam, a);
  ctx.lineWidth = Math.max(1.2, r * 0.14);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(-r * 0.3, 0, r, -1.15, 1.15);
  ctx.stroke();
  ctx.lineCap = "butt";
  for (let i = 0; i < 6; i++) {
    const t = (i / 5 - 0.5) * 2.2;
    const back = ((tick * 0.6 + i * 7) % 12) / 12;
    ctx.fillStyle = alpha(i % 2 ? WV.foam : WV.sky, a * (1 - back));
    ctx.fillRect(Math.cos(t) * r * 0.7 - r * 0.3 - back * r * 0.9, Math.sin(t) * r * 0.9, 1.5, 1.5);
  }
  ctx.restore();
}

/** 물나비 (ang 나는 쪽 · flap 0~1 날개 접힘 · s 크기) */
export function butterfly(ctx: Ctx, x: number, y: number, ang: number, flap: number, s: number, a: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang + Math.PI / 2);
  const w = 0.35 + Math.abs(Math.sin(flap * Math.PI)) * 0.65;
  additive(ctx, () => glow(ctx, 0, 0, s * 2.2, WV.aqua, 0.5 * a));
  for (const sx of [-1, 1]) {
    ctx.save();
    ctx.scale(sx * w, 1);
    waterFill(ctx, s * 0.9, -s * 0.4, s, a, () => {
      ctx.beginPath();
      ctx.ellipse(s * 0.9, -s * 0.45, s * 0.95, s * 0.7, -0.5, 0, TAU);
    }, 0.8);
    waterFill(ctx, s * 0.6, s * 0.55, s * 0.6, a * 0.9, () => {
      ctx.beginPath();
      ctx.ellipse(s * 0.6, s * 0.55, s * 0.6, s * 0.42, 0.6, 0, TAU);
    }, 0.6);
    ctx.restore();
  }
  ctx.fillStyle = alpha(WV.foam, a);
  ctx.fillRect(-0.5, -s * 0.7, 1, s * 1.4);
  ctx.restore();
}

/** 물의 여신 (발 x, y · s 크기 · pour 0~1 물병 기울임): 흐르는 머리칼 · 물결로 풀리는 옷자락 · 머리 위 물빛 고리 */
export function goddess(ctx: Ctx, x: number, y: number, s: number, a: number, tick: number, pour: number): void {
  const h = 46 * s;
  additive(ctx, () => glow(ctx, x, y - h * 0.55, h * 0.75, WV.aqua, 0.45 * a, 0.4));
  // 옷자락: 아래로 갈수록 넓어지며 물결로 풀림
  waterFill(ctx, x, y - h * 0.3, h * 0.5, a * 0.75, () => {
    ctx.beginPath();
    ctx.moveTo(x - 4 * s, y - h * 0.62);
    for (let i = 0; i <= 8; i++) {
      const u = i / 8;
      ctx.lineTo(x - 4 * s - u * 12 * s + Math.sin(tick * 0.12 + u * 6) * 1.5 * s, y - h * 0.62 + u * h * 0.62);
    }
    for (let i = 0; i <= 6; i++) ctx.lineTo(x - 16 * s + (i / 6) * 32 * s, y + Math.sin(tick * 0.2 + i) * 2 * s);
    for (let i = 8; i >= 0; i--) {
      const u = i / 8;
      ctx.lineTo(x + 4 * s + u * 12 * s + Math.sin(tick * 0.12 + u * 6 + 2) * 1.5 * s, y - h * 0.62 + u * h * 0.62);
    }
    ctx.closePath();
  });
  // 머리 · 머리칼 물줄기
  blob(ctx, x, y - h * 0.74, 5 * s, a, tick, 3, 0.05);
  ctx.lineCap = "round";
  for (let k = 0; k < 4; k++) {
    ctx.strokeStyle = alpha(k % 2 ? WV.sky : WV.foam, 0.7 * a);
    ctx.lineWidth = 1.4 * s;
    ctx.beginPath();
    ctx.moveTo(x - 3 * s + k * 2 * s, y - h * 0.78);
    ctx.quadraticCurveTo(x - 10 * s - k * 2 * s, y - h * 0.6, x - 8 * s - k * 3 * s + Math.sin(tick * 0.15 + k) * 3 * s, y - h * 0.35);
    ctx.stroke();
  }
  // 머리 위 고리
  additive(ctx, () => {
    ctx.strokeStyle = alpha(WV.gold, 0.8 * a);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y - h * 0.9, 6 * s, 2 * s, 0, 0, TAU);
    ctx.stroke();
  });
  // 팔과 물병 (오른쪽 위로 들고 기울임)
  const jx = x + 10 * s;
  const jy = y - h * 0.62;
  ctx.strokeStyle = alpha(WV.foam, 0.85 * a);
  ctx.lineWidth = 1.4 * s;
  ctx.beginPath();
  ctx.moveTo(x + 3 * s, y - h * 0.55);
  ctx.lineTo(jx, jy + 2 * s);
  ctx.stroke();
  ctx.lineCap = "butt";
  ctx.save();
  ctx.translate(jx, jy);
  ctx.rotate(0.3 + pour * 0.9);
  ctx.fillStyle = alpha(WV.gold, 0.9 * a);
  ctx.beginPath();
  ctx.ellipse(0, 0, 3 * s, 4 * s, 0, 0, TAU);
  ctx.fill();
  ctx.fillRect(-1.5 * s, -6 * s, 3 * s, 3 * s);
  ctx.restore();
}

/** 물의 손 (손목 x, y · side -1 왼손 1 오른손 · s 크기): 손바닥 + 손가락 넷 + 엄지 */
export function waterHand(ctx: Ctx, x: number, y: number, side: number, s: number, a: number, tick: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(side, 1);
  additive(ctx, () => glow(ctx, 6 * s, -8 * s, 16 * s, WV.aqua, 0.5 * a));
  waterFill(ctx, 6 * s, -8 * s, 12 * s, a, () => {
    ctx.beginPath();
    ctx.moveTo(-2 * s, 4 * s);
    ctx.lineTo(-2 * s, -10 * s);
    for (let f = 0; f < 4; f++) {
      const fx = (f * 3.2 - 1) * s;
      const tip = -(20 + (f === 1 || f === 2 ? 3 : 0)) * s + Math.sin(tick * 0.2 + f) * s;
      ctx.lineTo(fx, tip);
      ctx.lineTo(fx + 2.4 * s, tip);
      ctx.lineTo(fx + 2.6 * s, -10 * s);
    }
    ctx.lineTo(12 * s, -6 * s);
    ctx.lineTo(16 * s, -12 * s);
    ctx.lineTo(13 * s, -2 * s);
    ctx.lineTo(10 * s, 4 * s);
    ctx.closePath();
  });
  ctx.restore();
}

/** 문어 다리 (x0,y0 → x1,y1 · w 굵기 · curl 끝 말림): 굵다가 가늘어지는 물 다리 + 빨판 */
export function tentacle(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, w: number, a: number, curl: number): void {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const n = 10;
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const bend = Math.sin(u * Math.PI) * curl * 0.25 + u * u * u * curl * 0.35;
    pts.push([x0 + dx * u - dy * bend, y0 + dy * u + dx * bend, w * (1 - u * 0.8)]);
  }
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const [ax, ay, aw] = pts[i]!;
      const [bx, by] = pts[i + 1]!;
      ctx.strokeStyle = alpha(WV.deep, 0.6 * a);
      ctx.lineWidth = aw * 1.4;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.strokeStyle = alpha(WV.aqua, 0.8 * a);
      ctx.lineWidth = aw * 0.8;
      ctx.stroke();
      ctx.strokeStyle = alpha(WV.foam, 0.6 * a);
      ctx.lineWidth = Math.max(0.6, aw * 0.2);
      ctx.stroke();
      if (i % 2 === 1) {
        ctx.fillStyle = alpha(WV.pale, a);
        ctx.beginPath();
        ctx.arc(ax, ay, Math.max(0.6, aw * 0.18), 0, TAU);
        ctx.fill();
      }
    }
    ctx.lineCap = "butt";
  });
}

/** 심해의 눈 (open 0~1 뜬 정도 · look 눈동자 흔들림) */
export function deepEye(ctx: Ctx, x: number, y: number, r: number, open: number, a: number, tick: number): void {
  const h = r * 0.55 * open;
  additive(ctx, () => glow(ctx, x, y, r * 1.6, WV.deep, 0.7 * a, 0.2));
  ctx.fillStyle = alpha(WV.ink, 0.85 * a);
  ctx.beginPath();
  ctx.moveTo(x - r, y);
  ctx.quadraticCurveTo(x, y - h * 2, x + r, y);
  ctx.quadraticCurveTo(x, y + h * 2, x - r, y);
  ctx.fill();
  ctx.strokeStyle = alpha(WV.aqua, a);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (open < 0.15) return;
  const ix = x + Math.sin(tick * 0.07) * r * 0.12;
  additive(ctx, () => {
    glow(ctx, ix, y, r * 0.5 * open, WV.aqua, a, 0.6);
    ctx.strokeStyle = alpha(WV.sky, a);
    ctx.lineWidth = 1;
    for (const rr of [0.42, 0.3]) {
      ctx.beginPath();
      ctx.arc(ix, y, r * rr * open, 0, TAU);
      ctx.stroke();
    }
  });
  ctx.fillStyle = alpha("#000814", a);
  ctx.beginPath();
  ctx.ellipse(ix, y, r * 0.06 + 0.6, r * 0.28 * open, 0, 0, TAU);
  ctx.fill();
}

/** 꿈의 고래 (가운데 x, y · ang · s 크기): 맑은 물빛 몸 · 큰 꼬리지느러미 · 배 줄무늬 · 몸속 별빛 */
export function dreamWhale(ctx: Ctx, x: number, y: number, ang: number, s: number, a: number, tick: number): void {
  const len = 44 * s;
  const half = 12 * s;
  const flap = Math.sin(tick * 0.2) * half * 0.6;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  additive(ctx, () => glow(ctx, 0, 0, len * 0.9, WV.aqua, 0.5 * a, 0.3));
  waterFill(ctx, 0, 0, len * 0.5, a, () => {
    ctx.beginPath();
    ctx.moveTo(len * 0.5, 0);
    ctx.quadraticCurveTo(len * 0.45, -half * 1.2, 0, -half);
    ctx.quadraticCurveTo(-len * 0.35, -half * 0.6, -len * 0.5, flap * 0.3);
    ctx.lineTo(-len * 0.72, -half * 0.9 + flap);
    ctx.lineTo(-len * 0.6, flap * 0.3);
    ctx.lineTo(-len * 0.72, half * 0.9 + flap);
    ctx.lineTo(-len * 0.5, flap * 0.3);
    ctx.quadraticCurveTo(-len * 0.3, half * 0.8, 0, half * 0.9);
    ctx.quadraticCurveTo(len * 0.42, half, len * 0.5, 0);
    ctx.closePath();
  }, 1.4);
  ctx.strokeStyle = alpha(WV.foam, 0.6 * a);
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(len * 0.35 - i * 5 * s, half * 0.35 + i * s);
    ctx.lineTo(-len * 0.05 - i * 5 * s, half * 0.6);
    ctx.stroke();
  }
  ctx.fillStyle = alpha(WV.ink, a);
  ctx.fillRect(len * 0.32, -half * 0.25, 1.5, 1.5);
  for (let i = 0; i < 5; i++) glint(ctx, (rnd(i, 3) - 0.5) * len * 0.7, (rnd(3, i) - 0.5) * half, 1.5 + ((tick + i * 9) % 20) / 10, WV.gold, a * 0.8);
  ctx.restore();
}

/** 물 음표 ♪ */
export function note(ctx: Ctx, x: number, y: number, s: number, a: number): void {
  ctx.fillStyle = alpha(WV.foam, a);
  ctx.strokeStyle = alpha(WV.aqua, a);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(x, y, 2.4 * s, 1.7 * s, -0.4, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 2 * s, y - 0.5 * s);
  ctx.lineTo(x + 2 * s, y - 8 * s);
  ctx.quadraticCurveTo(x + 5 * s, y - 6 * s, x + 5 * s, y - 3 * s);
  ctx.stroke();
}
