// 전시장 월계선 그림: 마른 독(나무 받침) 위 거대한 나무 방주 · 둥근 선체(판자 줄·금띠·둥근 창) · 뱃머리 월계관 문장 · 고물 선실(불 켜진 창)
// · 돛대 셋(네모 돛 둘씩, 가운데 큰 돛에 월계 잎) · 뱃머리 기움 돛대 · 밧줄. 한 번 그려 두고 깃발만 움직임
type Ctx = CanvasRenderingContext2D;

export const SHIP_W = 264;
export const SHIP_H = 130;
const CX = SHIP_W / 2;
const BASE = SHIP_H - 2;

let cache: HTMLCanvasElement | null = null;

function r(ctx: Ctx, x: number, y: number, w: number, h: number, c: string): void {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/** 갑판 높이 (뱃머리 오른쪽·고물 왼쪽이 올라감) · 용골 높이 */
const deckY = (x: number) => 72 - Math.max(0, x - 214) * 0.55 - Math.max(0, 44 - x) * 0.4;
const keelY = (x: number) => {
  const k = (x - CX) / 116;
  return 110 - 22 * k * k;
};

function hull(ctx: Ctx): void {
  for (let x = 16; x < 248; x++) {
    const top = deckY(x);
    const bot = keelY(x);
    for (let y = Math.floor(top); y < bot; y++) {
      const d = (y - top) / (bot - top);
      let c = d < 0.12 ? "#a8743e" : d < 0.7 ? "#8a5a2e" : "#6a4220";
      if ((y - Math.floor(top)) % 7 === 6) c = "#5a3818";
      if (x === 16 || x === 247 || y === Math.floor(bot) - 1) c = "#3a2410";
      r(ctx, x, y, 1, 1, c);
    }
    // 금띠 · 흘수선 초록 띠
    r(ctx, x, top + 6, 1, 2, "#e0b040");
    r(ctx, x, bot - 7, 1, 2, "#3a7a4a");
  }
  // 둥근 창 (불빛)
  for (let x = 54; x < 214; x += 20) {
    const y = deckY(x) + 16;
    r(ctx, x - 3, y - 3, 6, 6, "#3a2410");
    r(ctx, x - 2, y - 2, 4, 4, "#ffd870");
    r(ctx, x - 2, y - 2, 2, 2, "#fff6c0");
  }
  // 뱃머리 월계관 문장 (초록 잎 고리 + 금 가운데)
  const wx = 228;
  const wy = deckY(wx) + 18;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    r(ctx, wx + Math.cos(a) * 7 - 1, wy + Math.sin(a) * 7 - 1, 3, 2, i % 2 ? "#5ab05a" : "#8ad070");
  }
  r(ctx, wx - 2, wy - 2, 5, 5, "#ffd040");
  r(ctx, wx - 1, wy - 1, 2, 2, "#fff6c0");
  // 난간 · 기둥
  for (let x = 18; x < 246; x++) r(ctx, x, deckY(x) - 4, 1, 1, "#5a3818");
  for (let x = 20; x < 246; x += 9) r(ctx, x, deckY(x) - 4, 1, 4, "#5a3818");
}

function cabin(ctx: Ctx): void {
  r(ctx, 26, 36, 46, 30, "#6a4220");
  r(ctx, 28, 38, 42, 26, "#8a5a2e");
  r(ctx, 22, 32, 54, 5, "#3a2410");
  r(ctx, 24, 30, 50, 3, "#e0b040");
  for (const x of [32, 46, 60]) {
    r(ctx, x, 44, 7, 9, "#3a2410");
    r(ctx, x + 1, 45, 5, 7, "#ffcf60");
    r(ctx, x + 1, 45, 5, 2, "#fff0b0");
    r(ctx, x + 3, 45, 1, 7, "#3a2410");
  }
}

function mast(ctx: Ctx, x: number, top: number, emblem: boolean): void {
  const deck = deckY(x);
  r(ctx, x - 2, top, 4, deck - top, "#5a3818");
  r(ctx, x - 1, top, 1, deck - top, "#8a5a2e");
  // 돛 둘 (위가 작음) · 가로 활대
  const sails: [number, number, number][] = [
    [top + 8, 30, 22],
    [top + 34, 40, 28],
  ];
  for (const [y, w, h] of sails) {
    r(ctx, x - w / 2 - 3, y - 2, w + 6, 2, "#3a2410");
    for (let j = 0; j < h; j++) {
      const bulge = Math.round(Math.sin((j / h) * Math.PI) * 3);
      r(ctx, x - w / 2 - bulge, y + j, w + bulge * 2, 1, j % 6 === 5 ? "#d8ccb0" : "#f2ead6");
    }
    r(ctx, x - w / 2 - 1, y + h, w + 2, 1, "#b8a888");
  }
  if (emblem) {
    // 가운데 큰 돛에 월계 잎 둘 (금 줄기)
    const y = top + 34 + 14;
    r(ctx, x, y - 8, 1, 16, "#c89a30");
    for (let i = 0; i < 5; i++) {
      r(ctx, x - 6 + i, y - 6 + i * 3, 5, 2, "#5ab05a");
      r(ctx, x + 2 - i, y - 6 + i * 3, 5, 2, "#7ac86a");
    }
  }
}

function build(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = SHIP_W;
  c.height = SHIP_H;
  const ctx = c.getContext("2d")!;
  // 마른 독: 나무 받침 넷 · 가로 들보 · 그림자
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(CX, BASE - 2, 124, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const x of [44, 96, 168, 220]) {
    r(ctx, x - 5, keelY(x) - 6, 10, BASE - keelY(x) + 6, "#4a2e16");
    r(ctx, x - 4, keelY(x) - 6, 3, BASE - keelY(x) + 6, "#6a4220");
  }
  r(ctx, 30, BASE - 10, 204, 5, "#3a2410");
  r(ctx, 30, BASE - 10, 204, 1, "#6a4220");
  // 밧줄 (돛대 꼭대기 → 뱃머리·고물)
  ctx.strokeStyle = "rgba(40,24,10,0.8)";
  ctx.lineWidth = 1;
  for (const [mx, my] of [
    [88, 10],
    [136, 2],
    [186, 14],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(30, 34);
    ctx.moveTo(mx, my);
    ctx.lineTo(258, 40);
    ctx.stroke();
  }
  hull(ctx);
  cabin(ctx);
  mast(ctx, 88, 10, false);
  mast(ctx, 136, 2, true);
  mast(ctx, 186, 14, false);
  // 기움 돛대
  ctx.strokeStyle = "#5a3818";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(238, deckY(238));
  ctx.lineTo(262, 38);
  ctx.stroke();
  return c;
}

/** 월계선: (x, y) = 받침 가운데 아래 */
export function drawShip(ctx: Ctx, x: number, y: number, t: number): void {
  cache ??= build();
  const left = Math.round(x - CX);
  const top = Math.round(y - BASE);
  ctx.drawImage(cache, left, top);
  // 돛대 꼭대기 초록 깃발 (펄럭임)
  for (const [mx, my] of [
    [88, 10],
    [136, 2],
    [186, 14],
  ] as const) {
    const wave = Math.round(Math.sin(t * 4 + mx) * 1.5);
    ctx.fillStyle = "#3a8a4a";
    ctx.fillRect(left + mx + 1, top + my - 6 + wave, 9, 3);
    ctx.fillRect(left + mx + 1, top + my - 3, 6, 2);
    ctx.fillStyle = "#ffd040";
    ctx.fillRect(left + mx + 3, top + my - 5 + wave, 2, 1);
    ctx.fillStyle = "#3a2410";
    ctx.fillRect(left + mx, top + my - 7, 1, 8);
  }
}
