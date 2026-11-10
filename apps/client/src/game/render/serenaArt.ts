// 세레나 코드 그림: 사슬(가운데가 뚫린 작은 고리가 번갈아 이어짐) · 사슬 끝의 빛나는 비수 · 꽃잎
// 날아다니는 비수 사슬(serenaBody)·채찍 휘두르기·환혹의 회오리·환혹의 무도(serenaFx)가 같이 씀
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

/** 세레나 색: 금 · 밝은 빛 · 흰 빛 · 분홍 · 장미 · 맹독 초록 · 에테르 하늘 · 강철 · 어두운 강철 */
export const SN = { gold: "#f2c14e", light: "#ffe68a", white: "#fff8f0", pink: "#ffb0d0", rose: "#e8407a", venom: "#8aff5a", ether: "#b0e8ff", steel: "#c8d0e0", dim: "#6a7088" } as const;

export type Pt = readonly [number, number];

/** 비수: 끝 (x,y) · 바라보는 각 a · 길이 len */
export function dagger(ctx: Ctx, x: number, y: number, a: number, len: number, al: number, core: string = SN.rose): void {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const bx = x - c * len;
  const by = y - s * len;
  const w = len * 0.28;
  ctx.fillStyle = alpha(SN.white, al);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(bx + c * len * 0.35 - s * w, by + s * len * 0.35 + c * w);
  ctx.lineTo(bx, by);
  ctx.lineTo(bx + c * len * 0.35 + s * w, by + s * len * 0.35 - c * w);
  ctx.closePath();
  ctx.fill();
  // 가운데 붉은 홈 · 금빛 코등이 · 사슬을 거는 고리
  ctx.strokeStyle = alpha(core, al);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - c * len * 0.2, y - s * len * 0.2);
  ctx.lineTo(bx + c * len * 0.3, by + s * len * 0.3);
  ctx.stroke();
  ctx.strokeStyle = alpha(SN.gold, al);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx - s * w * 1.2, by + c * w * 1.2);
  ctx.lineTo(bx + s * w * 1.2, by - c * w * 1.2);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(bx - c * 2, by - s * 2, 1.6, 1.6, 0, 0, Math.PI * 2);
  ctx.stroke();
}

/** 사슬: 점들을 따라 고리를 번갈아 이음 (넓은 고리는 가운데가 뚫린 타원 · 사이 고리는 옆에서 본 짧은 막대) · fade: 끝으로 갈수록 옅게 */
export function chainPath(ctx: Ctx, pts: readonly Pt[], al: number, glowC: string = SN.light, fade = false, linkC: string = SN.steel): void {
  if (pts.length < 2) return;
  // 사슬을 따라 번지는 빛
  additive(ctx, () => {
    ctx.strokeStyle = alpha(glowC, 0.3 * al);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (const [x, y] of pts) ctx.lineTo(x, y);
    ctx.stroke();
    ctx.lineCap = "butt";
  });
  // 고리 간격 3.5픽셀로 줄을 따라 걸음
  const step = 3.5;
  let carry = 0;
  let k = 0;
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
  let walked = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]!;
    const [bx, by] = pts[i]!;
    const seg = Math.hypot(bx - ax, by - ay);
    if (seg <= 0) continue;
    const a = Math.atan2(by - ay, bx - ax);
    let d = carry;
    while (d < seg) {
      const x = ax + ((bx - ax) * d) / seg;
      const y = ay + ((by - ay) * d) / seg;
      const la = al * (fade ? 1 - (walked + d) / Math.max(1, total) : 1);
      if (k % 2 === 0) {
        // 넓은 고리: 가운데가 뚫린 타원
        ctx.strokeStyle = alpha(linkC, la);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, y, 2.4, 1.4, a, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = alpha(SN.white, la);
        ctx.fillRect(Math.round(x - Math.sin(a) * 1.4), Math.round(y + Math.cos(a) * 1.4) - 1, 1, 1);
      } else {
        // 사이 고리: 옆에서 본 짧은 막대
        ctx.strokeStyle = alpha(SN.dim, la);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(a) * 1.8, y - Math.sin(a) * 1.8);
        ctx.lineTo(x + Math.cos(a) * 1.8, y + Math.sin(a) * 1.8);
        ctx.stroke();
      }
      k++;
      d += step;
    }
    carry = d - seg;
    walked += seg;
  }
}

/** 사슬 채찍: (ax,ay)에서 조절점 (cx,cy)를 지나 (tx,ty)까지 휘어진 사슬 + 끝에 비수 */
export function chainWhip(ctx: Ctx, ax: number, ay: number, cx: number, cy: number, tx: number, ty: number, al: number, glowC: string = SN.light): void {
  const n = 16;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const v = 1 - u;
    pts.push([v * v * ax + 2 * v * u * cx + u * u * tx, v * v * ay + 2 * v * u * cy + u * u * ty]);
  }
  chainPath(ctx, pts, al, glowC);
  const [lx, ly] = pts[n - 1]!;
  dagger(ctx, tx, ty, Math.atan2(ty - ly, tx - lx), 8, al);
  additive(ctx, () => glow(ctx, tx, ty, 6, glowC, 0.5 * al));
}

/** 날아가는 비수와 뒤따르는 사슬: path[0]이 비수 자리, 뒤로 갈수록 지나온 자리 */
export function flyingChain(ctx: Ctx, path: readonly Pt[], al: number, glowC: string, linkC: string = SN.steel): void {
  if (path.length < 2) return;
  chainPath(ctx, path, al, glowC, true, linkC);
  const [x, y] = path[0]!;
  const [px, py] = path[1]!;
  dagger(ctx, x, y, Math.atan2(y - py, x - px), 9, al);
  additive(ctx, () => glow(ctx, x, y, 7, glowC, 0.55 * al));
}

/** 꽃잎 하나: 가운데 (x,y)에서 각 a로 뻗은 길이 len · 폭 w */
export function petal(ctx: Ctx, x: number, y: number, a: number, len: number, w: number, color: string, al: number): void {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const tx = x + c * len;
  const ty = y + s * len * 0.6;
  const mx = x + c * len * 0.5;
  const my = y + s * len * 0.5 * 0.6;
  ctx.fillStyle = alpha(color, al);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(mx - s * w, my + c * w * 0.6, tx, ty);
  ctx.quadraticCurveTo(mx + s * w, my - c * w * 0.6, x, y);
  ctx.fill();
}

/** 화면용 흩날림 값 (0~1, 그리기 전용 · 게임 결과와 상관없음) */
export const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** 기울어진 회전 고리 위 각 th의 자리 (가운데 x,y · 반지름 r · 납작함 0.3 · tilt: -30° / · 0 - · +30° \\) */
export function onTilt(x: number, y: number, r: number, tilt: number, th: number): Pt {
  const lx = Math.cos(th) * r;
  const ly = Math.sin(th) * r * 0.3;
  return [x + lx * Math.cos(tilt) - ly * Math.sin(tilt), y + lx * Math.sin(tilt) + ly * Math.cos(tilt)];
}

/** 하트 테두리 위 점 (t 0~2π · 가운데 x,y · 크기 r) */
export function heartAt(x: number, y: number, r: number, t: number): Pt {
  const s = Math.sin(t);
  const hx = 16 * s * s * s;
  const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [x + (hx / 16) * r, y - (hy / 16) * r * 0.8];
}
