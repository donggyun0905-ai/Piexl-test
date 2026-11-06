// 라파엘 코드 그림: 빛의 화살(빛나는 살대 · 금빛 깃 · 다이아 촉) · 화살을 감아 도는 바람 리본 · 십자 섬광 · 흩날리는 빛 깃털
// 화살·저격·화살비·천공의 빛 화살(rafaelFx)·표적·화살비 구름(rafaelBody)이 같이 씀
import { additive, alpha, glow, type Ctx } from "./pwFxBits";

/** 라파엘 색: 하늘 · 에테르 · 밝은 빛 · 흰 빛 · 금 · 폭풍 · 짙은 폭풍 · 붉은 과녁 */
export const RF = { sky: "#b0e8ff", ether: "#6ac8ff", light: "#fff6c0", white: "#ffffff", gold: "#f2c14e", storm: "#6a88b8", deep: "#2a3a5a", red: "#ff5a6a" } as const;

/** 화면용 흩날림 값 (0~1, 그리기 전용 · 게임 결과와 상관없음) */
export const hash = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** 빛의 화살: 촉 끝 (x,y) · 방향 a · 길이 len · 굵기 w (살대 빛 · 다이아 촉 · 뒤 금빛 깃 세 쌍) */
export function lightArrow(ctx: Ctx, x: number, y: number, a: number, len: number, w: number, al: number, core: string = RF.sky): void {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const bx = x - c * len;
  const by = y - s * len;
  additive(ctx, () => {
    ctx.lineCap = "round";
    for (const [k, col, o] of [[3, core, 0.25], [1.6, core, 0.55], [0.7, RF.white, 0.95]] as const) {
      ctx.strokeStyle = alpha(col, o * al);
      ctx.lineWidth = Math.max(1, w * k);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(x - c * w * 2, y - s * w * 2);
      ctx.stroke();
    }
    ctx.lineCap = "butt";
    glow(ctx, x - c * w, y - s * w, w * 3, core, 0.6 * al);
  });
  // 다이아 촉
  const h = w * 3.2;
  ctx.fillStyle = alpha(RF.white, al);
  ctx.beginPath();
  ctx.moveTo(x + c * h * 0.4, y + s * h * 0.4);
  ctx.lineTo(x - c * h * 0.5 - s * w * 1.4, y - s * h * 0.5 + c * w * 1.4);
  ctx.lineTo(x - c * h, y - s * h);
  ctx.lineTo(x - c * h * 0.5 + s * w * 1.4, y - s * h * 0.5 - c * w * 1.4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = alpha(RF.gold, al);
  ctx.fillRect(Math.round(x - c * h - 1), Math.round(y - s * h - 1), 2, 2);
  // 금빛 깃 세 쌍 (뒤로 비스듬히)
  ctx.strokeStyle = alpha(RF.gold, al);
  ctx.lineWidth = Math.max(1, w * 0.5);
  for (let i = 0; i < 3; i++) {
    const fx = bx + c * (i * w * 1.3);
    const fy = by + s * (i * w * 1.3);
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx - c * w * 2 + side * -s * w * 2, fy - s * w * 2 + side * c * w * 2);
      ctx.stroke();
    }
  }
}

/** 바람 리본: (x,y)→(tx,ty) 줄을 감아 도는 두 가닥 나선 (phase로 흐름 · amp 폭 · 원근으로 납작) */
export function windHelix(ctx: Ctx, x: number, y: number, tx: number, ty: number, amp: number, phase: number, al: number, c: string = RF.sky): void {
  const len = Math.hypot(tx - x, ty - y);
  if (len < 4) return;
  const ux = (tx - x) / len;
  const uy = (ty - y) / len;
  const n = Math.max(8, Math.round(len / 4));
  additive(ctx, () => {
    for (const off of [0, Math.PI]) {
      ctx.strokeStyle = alpha(off ? RF.white : c, 0.55 * al);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        const ph = u * len * 0.18 - phase + off;
        const sw = Math.sin(ph) * amp * Math.sin(u * Math.PI);
        ctx.lineTo(x + ux * len * u - uy * sw, y + uy * len * u + ux * sw * 0.6);
      }
      ctx.stroke();
    }
  });
}

/** 십자 섬광: 가운데 (x,y) · 크기 r (가로 길고 세로 짧은 빛살 + 대각 작은 빛살) */
export function starFlare(ctx: Ctx, x: number, y: number, r: number, c: string, al: number): void {
  additive(ctx, () => {
    glow(ctx, x, y, r * 0.5, c, al, 0.6);
    ctx.fillStyle = alpha(RF.white, al);
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x, y - r * 0.08);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r * 0.08);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y - r * 0.6);
    ctx.lineTo(x + r * 0.06, y);
    ctx.lineTo(x, y + r * 0.6);
    ctx.lineTo(x - r * 0.06, y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = alpha(c, 0.6 * al);
    ctx.lineWidth = 1;
    for (const [dx, dy] of [[1, 1], [1, -1]] as const) {
      ctx.beginPath();
      ctx.moveTo(x - dx * r * 0.35, y - dy * r * 0.35);
      ctx.lineTo(x + dx * r * 0.35, y + dy * r * 0.35);
      ctx.stroke();
    }
  });
}

/** 빛 깃털: (x,y)에 각 a로 놓인 작은 깃 (길이 len) */
export function feather(ctx: Ctx, x: number, y: number, a: number, len: number, c: string, al: number): void {
  const cs = Math.cos(a);
  const sn = Math.sin(a);
  ctx.strokeStyle = alpha(c, al);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - cs * len, y - sn * len);
  ctx.lineTo(x + cs * len, y + sn * len);
  ctx.stroke();
  for (let i = -1; i <= 1; i++) {
    const px = x + cs * len * 0.4 * i;
    const py = y + sn * len * 0.4 * i;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - cs * 2 - sn * 2, py - sn * 2 + cs * 2);
    ctx.stroke();
  }
}
