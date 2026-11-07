// 새벽의 성흔 진영 특징: 성흔(달빛 각성)이 발동하면 맵 아래에서 달빛이 은은하게 올라오고, 화면 가장자리로 흰 깃털이 천천히 흩날림 (각성이 끝나 갈수록 흐려짐)
import type { RunState } from "@pixel-rogue/shared";
import { additive, type Ctx } from "./pwFxBits";

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
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // 밤하늘처럼 살짝 푸르게 어둡게 (가운데는 그대로)
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
  g.addColorStop(0, "rgba(10,16,40,0)");
  g.addColorStop(1, `rgba(10,16,40,${0.35 * k})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  additive(ctx, () => {
    // 맵 아래에서 은은하게 올라오는 달빛 (천천히 숨 쉬듯)
    const breath = 0.85 + 0.15 * Math.sin(t * 0.05);
    const lg = ctx.createLinearGradient(0, H, 0, H * 0.55);
    lg.addColorStop(0, `rgba(200,218,255,${0.26 * k * breath})`);
    lg.addColorStop(1, "rgba(200,218,255,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
    // 아래에서 위로 옅게 피어오르는 달빛 기둥 몇 줄 (좌우로 천천히 흔들림)
    for (let i = 0; i < 5; i++) {
      const bx = W * (0.1 + i * 0.2) + Math.sin(t * 0.02 + i * 1.9) * W * 0.04;
      const w = W * (0.04 + 0.015 * (i % 2));
      const top = H * (0.5 + 0.08 * Math.sin(t * 0.03 + i));
      const cg = ctx.createLinearGradient(0, H, 0, top);
      cg.addColorStop(0, `rgba(220,232,255,${0.16 * k * (0.7 + 0.3 * Math.sin(t * 0.04 + i * 2.3))})`);
      cg.addColorStop(1, "rgba(220,232,255,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(bx - w, top, w * 2, H - top);
    }
  });
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
