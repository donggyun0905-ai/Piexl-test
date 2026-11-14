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

/** 기억의 탑: 높은 돌탑 · 층마다 창(빛) · 꼭대기 떠 있는 기억 결정(숨 쉬듯) · 아래 가운데 아치 문 (x, y = 문 앞 칸 가운데) */
export function drawTower(g: Ctx, x: number, y: number, t: number): void {
  const b = y - 2;
  const a = 0.55 + Math.sin(t * 1.8) * 0.2;
  shadow(g, x + 3, b + 2, 20, 5, 0.38);
  // 몸통 (아래 넓고 위로 좁아짐)
  box(g, "#4a4458", x - 15, b - 30, 30, 30);
  box(g, "#5a5468", x - 13, b - 62, 26, 32);
  box(g, "#6a6278", x - 11, b - 88, 22, 26);
  for (const [w, top] of [[15, 30], [13, 62], [11, 88]] as const) {
    box(g, "#8c8498", x - w - 1, b - top - 2, w * 2 + 2, 3);
    box(g, "#a49cb2", x - w - 1, b - top - 2, w * 2 + 2, 1);
  }
  // 돌 줄
  for (let r = 4; r < 88; r += 6) box(g, "rgba(20,16,30,0.25)", x - (r < 30 ? 15 : r < 62 ? 13 : 11), b - r, (r < 30 ? 30 : r < 62 ? 26 : 22), 1);
  box(g, "rgba(255,255,255,0.08)", x - 15, b - 88, 5, 88);
  // 창 (기억의 빛)
  for (const [wx, wy] of [[-6, 44], [5, 44], [0, 74]] as const) {
    box(g, "#1a1424", wx + x - 2, b - wy - 5, 5, 7);
    box(g, `rgba(150,200,255,${a})`, wx + x - 1, b - wy - 4, 3, 5);
  }
  // 지붕 · 꼭대기 결정
  box(g, "#3e4a78", x - 9, b - 96, 18, 8);
  box(g, "#3e4a78", x - 5, b - 102, 10, 6);
  box(g, "#5a6ab0", x - 9, b - 96, 18, 1);
  const fy = Math.round(Math.sin(t * 2) * 2);
  const glow = g.createRadialGradient(x, b - 112 + fy, 0, x, b - 112 + fy, 18);
  glow.addColorStop(0, `rgba(140,210,255,${a * 0.6})`);
  glow.addColorStop(1, "rgba(140,210,255,0)");
  g.fillStyle = glow;
  g.fillRect(x - 18, b - 130 + fy, 36, 36);
  box(g, "#bfe6ff", x - 2, b - 116 + fy, 4, 8);
  box(g, "#ffffff", x - 1, b - 115 + fy, 1, 3);
  // 문 (아치)
  box(g, "#2a2236", x - 6, b - 16, 12, 16);
  box(g, "#2a2236", x - 4, b - 18, 8, 2);
  box(g, `rgba(120,180,255,${a * 0.5})`, x - 5, b - 12, 10, 12);
  box(g, "#a49cb2", x - 7, b - 17, 1, 17);
  box(g, "#a49cb2", x + 6, b - 17, 1, 17);
}
