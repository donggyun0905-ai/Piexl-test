// 새벽의 성흔 진영 특징: 성흔(달빛 각성)이 발동하면 화면 위로 하얀 달이 뜨고 달빛 줄기가 비치며, 화면 가장자리로 흰 깃털이 천천히 흩날림 (각성이 끝나 갈수록 흐려짐)
import type { RunState } from "@pixel-rogue/shared";
import { additive, glow, type Ctx } from "./pwFxBits";

/** 깃털 수 · 픽셀 모양 (1 = 깃대·흰 깃, 2 = 옅은 깃) */
const FEATHERS = 18;
const FEATHER = ["0011000", "0122100", "1221210", "0122100", "0012100", "0001100", "0000100", "0000010"];

/** 깃털마다 같은 자리·흔들림 (그리기 전용이라 tick·번호로만 정함) */
const frac = (n: number) => n - Math.floor(n);
const seed = (i: number, k: number) => frac(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453);

function feather(ctx: Ctx, x: number, y: number, u: number, flip: boolean, a: number): void {
  for (let r = 0; r < FEATHER.length; r++) {
    const row = FEATHER[r]!;
    for (let c = 0; c < row.length; c++) {
      const v = row[c];
      if (v === "0") continue;
      ctx.fillStyle = v === "1" ? `rgba(255,255,255,${a})` : `rgba(214,226,255,${a * 0.7})`;
      ctx.fillRect(Math.round(x + (flip ? 6 - c : c) * u), Math.round(y + r * u), u, u);
    }
  }
}

/** 화면에 붙음 (카메라와 상관없이) · 성흔 각성 중일 때만 */
export function drawDawnSky(ctx: Ctx, s: RunState, scale: number): void {
  const p = s.player;
  const left = p.sgAwake ?? 0;
  if (left <= 0 || s.over) return;
  const max = Math.max(1, p.sgAwakeMax ?? left);
  const k = Math.min(1, (max - left) / 15, left / 30);
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;
  const t = s.tick;
  const u = Math.max(2, Math.round(scale));
  const mx = W * 0.8;
  const my = H * 0.14;
  const mr = Math.min(W, H) * 0.06;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // 밤하늘처럼 살짝 푸르게 어둡게 (가운데는 그대로)
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
  g.addColorStop(0, "rgba(10,16,40,0)");
  g.addColorStop(1, `rgba(10,16,40,${0.45 * k})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  additive(ctx, () => {
    // 달빛 줄기: 달에서 아래 왼쪽으로 비스듬히 퍼짐 (천천히 흔들림)
    for (let i = 0; i < 4; i++) {
      const sway = Math.sin(t * 0.03 + i * 1.7) * W * 0.03;
      const bx = W * (0.15 + i * 0.17) + sway;
      const w = W * (0.05 + 0.02 * (i % 2));
      const lg = ctx.createLinearGradient(mx, my, bx, H);
      lg.addColorStop(0, `rgba(220,232,255,${0.22 * k})`);
      lg.addColorStop(1, "rgba(220,232,255,0)");
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(mx - mr * 0.4, my);
      ctx.lineTo(mx + mr * 0.4, my);
      ctx.lineTo(bx + w, H);
      ctx.lineTo(bx - w, H);
      ctx.closePath();
      ctx.fill();
    }
    // 하얀 달: 둘레 빛 + 맥박
    glow(ctx, mx, my, mr * 3.2, "#c8d8ff", 0.5 * k * (0.85 + 0.15 * Math.sin(t * 0.08)), 0.4);
  });
  ctx.fillStyle = `rgba(250,252,255,${0.95 * k})`;
  ctx.beginPath();
  ctx.arc(mx, my, mr, 0, Math.PI * 2);
  ctx.fill();
  // 달 표면 무늬 (옅은 회청색 얼룩)
  ctx.fillStyle = `rgba(190,202,228,${0.6 * k})`;
  for (const [dx, dy, r] of [[-0.35, -0.2, 0.22], [0.25, 0.3, 0.16], [0.3, -0.35, 0.1]] as const) {
    ctx.beginPath();
    ctx.arc(mx + dx * mr, my + dy * mr, r * mr, 0, Math.PI * 2);
    ctx.fill();
  }
  // 깃털: 화면 가장자리 띠에서 천천히 떨어지며 좌우로 흔들림 (아래로 나가면 위에서 다시)
  const band = Math.min(W, H) * 0.16;
  for (let i = 0; i < FEATHERS; i++) {
    const side = i % 4;
    const speed = 0.25 + seed(i, 1) * 0.35;
    const fall = frac(seed(i, 2) + (t * speed * u) / (H + 40 * u));
    const sw = Math.sin(t * 0.04 + i) * u * 6;
    // 왼쪽·오른쪽 띠는 위에서 아래로, 위·아래 띠는 가로로 퍼져 떨어짐
    const x = side === 0 ? seed(i, 3) * band + sw : side === 1 ? W - seed(i, 3) * band - 7 * u + sw : seed(i, 3) * W + sw;
    const y = side < 2 ? fall * (H + 40 * u) - 20 * u : side === 2 ? fall * band - 10 * u : H - band + fall * band;
    const a = k * (0.55 + 0.35 * Math.sin(t * 0.06 + i * 2)) * (side === 3 ? 1 - fall : 1);
    feather(ctx, x, y, u, Math.sin(t * 0.04 + i) > 0, Math.max(0, a));
  }
  ctx.restore();
}
