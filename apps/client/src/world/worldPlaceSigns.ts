// 장소 그림 더하기: 가게 문 위 간판(칼·방패·물약·주머니·망치·침대) · 순간 이동석(푸른 돌기둥, 빛이 숨 쉬듯·위로 오르는 빛 알갱이)
import { shadow } from "./worldArt";
import type { ShopIcon } from "./worldPlaces";

type Ctx = CanvasRenderingContext2D;
const box = (g: Ctx, c: string, x: number, y: number, w: number, h: number) => {
  g.fillStyle = c;
  g.fillRect(x, y, w, h);
};

/** 간판: 문(x, y = 문 앞 발판 가운데) 왼쪽 위 벽에 걸린 나무 판 + 그림 */
export function drawShopIcon(g: Ctx, icon: ShopIcon, x: number, y: number): void {
  const sx = x - 15;
  const sy = y - 24;
  box(g, "#3a2414", sx + 4, sy - 3, 1, 3);
  box(g, "#3a2414", sx + 9, sy - 3, 1, 3);
  box(g, "#3a2414", sx, sy, 14, 11);
  box(g, "#c8945a", sx + 1, sy + 1, 12, 9);
  const c = sx + 7;
  const m = sy + 5;
  switch (icon) {
    case "sword":
      box(g, "#d0d8e4", c - 1, m - 4, 2, 6);
      box(g, "#7a4e2a", c - 3, m + 2, 6, 1);
      box(g, "#7a4e2a", c - 1, m + 3, 2, 2);
      break;
    case "shield":
      box(g, "#3e5e9e", c - 3, m - 3, 6, 5);
      box(g, "#3e5e9e", c - 2, m + 2, 4, 1);
      box(g, "#d8a838", c - 1, m - 2, 2, 4);
      break;
    case "potion":
      box(g, "#f0f0f0", c - 1, m - 4, 2, 2);
      box(g, "#e04848", c - 3, m - 2, 6, 5);
      box(g, "#ff8a8a", c - 2, m - 1, 2, 2);
      break;
    case "bag":
      box(g, "#8e5e34", c - 3, m - 1, 6, 5);
      box(g, "#6a4424", c - 2, m - 3, 4, 2);
      box(g, "#d8a838", c - 1, m + 1, 2, 1);
      break;
    case "hammer":
      box(g, "#6a6278", c - 3, m - 4, 6, 3);
      box(g, "#7a4e2a", c - 1, m - 1, 2, 5);
      break;
    case "bed":
      box(g, "#f0e8d8", c - 4, m - 1, 3, 2);
      box(g, "#3e6aa8", c - 1, m - 1, 5, 3);
      box(g, "#5a3a20", c - 4, m + 1, 8, 2);
      break;
  }
}

/** 순간 이동석 */
export function drawWarp(g: Ctx, x: number, y: number, t: number): void {
  const a = 0.5 + Math.sin(t * 2.5) * 0.2;
  const glow = g.createRadialGradient(x, y - 10, 0, x, y - 10, 22);
  glow.addColorStop(0, `rgba(110,200,255,${a * 0.55})`);
  glow.addColorStop(1, "rgba(110,200,255,0)");
  g.fillStyle = glow;
  g.fillRect(x - 22, y - 32, 44, 44);
  shadow(g, x, y + 4, 9, 3, 0.35);
  box(g, "#6e6680", x - 8, y, 16, 4);
  box(g, "#a49cb2", x - 8, y, 16, 1);
  box(g, "#3e4a78", x - 4, y - 20, 8, 20);
  box(g, "#5a6ab0", x - 4, y - 20, 3, 20);
  box(g, "#3e4a78", x - 2, y - 23, 4, 3);
  box(g, `rgba(170,230,255,${a + 0.2})`, x - 1, y - 16, 2, 10);
  box(g, `rgba(220,245,255,${a})`, x - 2, y - 12, 4, 2);
  // 위로 오르는 빛 알갱이 셋
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.6 + i / 3) % 1;
    box(g, `rgba(200,240,255,${1 - k})`, x - 6 + i * 6, Math.round(y - 4 - k * 26), 1, 2);
  }
}
