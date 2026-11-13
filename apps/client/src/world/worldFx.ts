// 세계 지도 움직이는 꾸밈 (매 장면, 화면에 보이는 칸만): 물 반짝임 · 꽃밭 나비 · 지나가는 구름 그림자 · 화면 가장자리 어둡게
import { hash2 } from "./worldGround";
import { tileAt, WTILE, type WorldMap } from "./worldMap";
import { WT } from "./worldTiles";
import type { View } from "../lobby/walker";

type Ctx = CanvasRenderingContext2D;

function visible(m: WorldMap, v: View, each: (cx: number, cy: number, t: number) => void): void {
  const x0 = Math.max(0, Math.floor(v.x / WTILE));
  const y0 = Math.max(0, Math.floor(v.y / WTILE));
  const x1 = Math.min(m.cols - 1, Math.floor((v.x + v.w) / WTILE));
  const y1 = Math.min(m.rows - 1, Math.floor((v.y + v.h) / WTILE));
  for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) each(cx, cy, tileAt(m, cx, cy));
}

const BUTTERFLY = ["#fff4a0", "#ffb0d8", "#b8d8ff", "#ffffff"];

/** 땅 위 (사람보다 아래): 물 반짝임 */
export function drawWaterFx(ctx: Ctx, m: WorldMap, v: View, t: number): void {
  visible(m, v, (cx, cy, k) => {
    if (k !== WT.water && k !== WT.deep) return;
    const h = hash2(cx + 7, cy + 3);
    // 반짝임: 칸마다 다른 때에 잠깐
    const phase = (t * 0.7 + (h % 100) / 100) % 1;
    if (phase < 0.25) {
      const a = Math.sin((phase / 0.25) * Math.PI);
      const x = cx * WTILE + 3 + (h >>> 4) % 10;
      const y = cy * WTILE + 3 + (h >>> 8) % 10;
      ctx.fillStyle = `rgba(230,246,255,${0.85 * a})`;
      ctx.fillRect(x, y, 2, 1);
      if (a > 0.6) ctx.fillRect(x + 0.5, y - 1, 1, 3);
    }
    // 흐르는 물결 줄
    const w = ((t * 6 + (h % 16)) % 20) - 4;
    ctx.fillStyle = k === WT.water ? "rgba(150,200,250,0.45)" : "rgba(90,130,210,0.45)";
    ctx.fillRect(cx * WTILE + w, cy * WTILE + 6 + (h % 6), 4, 1);
  });
}

/** 사람 위: 꽃밭 나비 */
export function drawButterflies(ctx: Ctx, m: WorldMap, v: View, t: number): void {
  visible(m, v, (cx, cy, k) => {
    if (k !== WT.flower) return;
    const h = hash2(cx * 3, cy * 5);
    if (h % 6 !== 0) return;
    const s = t * (0.6 + (h % 5) * 0.1) + (h % 97);
    const x = (cx + 0.5) * WTILE + Math.sin(s * 1.3) * 10 + Math.sin(s * 3.1) * 3;
    const y = (cy + 0.2) * WTILE + Math.cos(s * 1.7) * 6 - 4;
    const open = Math.sin(t * 18 + h) > 0;
    ctx.fillStyle = "rgba(16,24,20,0.18)";
    ctx.fillRect(Math.round(x) - 1, Math.round(y) + 10, 3, 1);
    ctx.fillStyle = BUTTERFLY[h % BUTTERFLY.length]!;
    if (open) {
      ctx.fillRect(Math.round(x) - 2, Math.round(y) - 1, 2, 2);
      ctx.fillRect(Math.round(x) + 1, Math.round(y) - 1, 2, 2);
    } else ctx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 3, 2);
    ctx.fillStyle = "#3a2a2a";
    ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 2);
  });
}

/** 지나가는 구름 그림자 (지도 좌표, 천천히 오른쪽 아래로) */
export function drawCloudShadows(ctx: Ctx, v: View, t: number): void {
  const span = 900;
  for (let i = 0; i < 4; i++) {
    const h = hash2(i, 99);
    const x = ((t * 7 + (h % span)) % span) - 200 + Math.floor(v.x / span) * span;
    const y = ((t * 2.5 + ((h >>> 10) % 600)) % 600) - 150 + Math.floor(v.y / 600) * 600;
    for (const [ox, oy, r] of [[0, 0, 60], [50, 14, 46], [-44, 18, 40], [12, 30, 44]] as const) {
      const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
      g.addColorStop(0, "rgba(20,30,50,0.09)");
      g.addColorStop(1, "rgba(20,30,50,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x + ox - r, y + oy - r, r * 2, r * 2);
    }
  }
}

/** 화면 좌표로: 따뜻한 빛 · 가장자리 어둡게 */
export function drawVignette(ctx: Ctx, w: number, h: number): void {
  ctx.fillStyle = "rgba(255,214,150,0.05)";
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.hypot(w, h) * 0.62);
  g.addColorStop(0, "rgba(10,8,24,0)");
  g.addColorStop(1, "rgba(10,8,24,0.42)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
