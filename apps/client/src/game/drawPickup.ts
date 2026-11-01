import { BIG_COIN, type Pickup } from "@pixel-rogue/shared";
import { drawGym } from "./render/gymDraw";
import { iconCanvas, type IconItem } from "./iconArt";
import { drawStation } from "./drawStation";

/** 바닥 아이템 (임시 그림). hold: 서 있어서 가지기까지 찬 정도 (0~1) */
/** gymReady: 단련의 방 기구를 아직 쓸 수 있음 (빛 고리) */
export function drawPickup(ctx: CanvasRenderingContext2D, pk: Pickup, tick: number, near: boolean, hold: number, gymReady = false): void {
  const bob = Math.round(Math.sin((tick + pk.id * 7) / 12) * 1);
  const x = Math.round(pk.x);
  const y = Math.round(pk.y) + bob;
  ctx.globalAlpha = pk.armed ? 1 : 0.55;
  if (near && pk.kind !== "bench" && pk.kind !== "tune" && pk.kind !== "gym") {
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 7.5, y - 7.5, 15, 15);
  }
  if (pk.kind === "coin" && pk.price >= BIG_COIN) return drawBigCoin(ctx, x, y, tick, pk.price);
  if (pk.kind === "coin") {
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 3, y - 3, 6, 6);
    ctx.fillStyle = "#ffd040";
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = "#fff8c0";
    ctx.fillRect(x - 1, y - 2, 1, 1);
    return;
  }
  if (pk.kind === "trash") {
    drawTrash(ctx, x, Math.round(pk.y), pk.itemId === "1");
    ctx.globalAlpha = 1;
    return;
  }
  if (pk.kind === "gym") {
    ctx.globalAlpha = 1;
    drawGym(ctx, pk.group, x, Math.round(pk.y), tick, pk.itemId === "1", gymReady);
    return;
  }
  if (pk.kind === "bench" || pk.kind === "tune") {
    ctx.globalAlpha = 1;
    drawStation(ctx, pk.kind, x, Math.round(pk.y), tick, pk.itemId === "1");
    return;
  }
  if (pk.kind === "reroll") {
    drawReroll(ctx, x, y);
    ctx.globalAlpha = 1;
    return;
  }
  // 아이콘 (그림자를 먼저 깔아 바닥과 구분)
  const icon = iconCanvas({ kind: pk.kind, id: pk.itemId } as IconItem);
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(x - 6, y + 6, 12, 2);
  ctx.drawImage(icon, x - 8, y - 8);
  ctx.globalAlpha = 1;
  if (hold > 0) {
    // 가지기까지 남은 정도 (아래 막대)
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(x - 8, y + 9, 16, 3);
    ctx.fillStyle = "#f2c14e";
    ctx.fillRect(x - 7, y + 10, Math.round(14 * Math.min(1, hold)), 1);
  }
}

/** 상점 새로고침: 돌아가는 화살표 두 개 */
const REROLL_ART = [
  "....######....",
  "..##......#.#.",
  ".#.........##.",
  "#.........###.",
  "#.............",
  "#.............",
  ".............#",
  ".............#",
  ".###.........#",
  ".##.........#.",
  ".#.#......##..",
  "....######....",
];

function drawReroll(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const w = REROLL_ART[0]!.length;
  const h = REROLL_ART.length;
  const left = x - w / 2;
  const top = y - h / 2;
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(x - 6, y + 7, 12, 2);
  // 테두리를 먼저 깔고 위에 밝은 색
  ctx.fillStyle = "#1a1a24";
  REROLL_ART.forEach((row, j) => {
    for (let i = 0; i < w; i++) if (row[i] === "#") ctx.fillRect(left + i - 1, top + j - 1, 3, 3);
  });
  ctx.fillStyle = "#7fd8ff";
  REROLL_ART.forEach((row, j) => {
    for (let i = 0; i < w; i++) if (row[i] === "#") ctx.fillRect(left + i, top + j, 1, 1);
  });
}

/** 상점 휴지통: 철 통 (확인을 기다리면 뚜껑이 열리고 빨갛게) */
function drawTrash(ctx: CanvasRenderingContext2D, x: number, y: number, open: boolean): void {
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(x - 6, y + 7, 12, 2);
  ctx.fillStyle = "#1a1a24";
  ctx.fillRect(x - 6, y - 4, 12, 12);
  ctx.fillRect(x - 7, y - (open ? 9 : 7), 14, 4);
  ctx.fillStyle = open ? "#c85a5a" : "#7a8494";
  ctx.fillRect(x - 5, y - 3, 10, 10);
  ctx.fillStyle = open ? "#e88a7a" : "#a8b2c0";
  ctx.fillRect(x - 6, y - (open ? 8 : 6), 12, 2);
  ctx.fillRect(x - 1, y - (open ? 10 : 8), 2, 2);
  ctx.fillStyle = "#4a5260";
  for (const dx of [-3, 0, 3]) ctx.fillRect(x + dx, y - 1, 1, 7);
}

/** 방을 깨고 바로 얻은 돈: 그 자리에서 동전이 튀어 오르며 사라지고 "+돈"이 떠오름 (fx.size = 얻은 돈) */
export function drawCoinFx(ctx: CanvasRenderingContext2D, x: number, y: number, amount: number, t: number): void {
  const k = 1 - t; // 0 → 1 로 진행
  const n = Math.min(6, 2 + Math.floor(amount / 3));
  ctx.globalAlpha = Math.min(1, t * 2);
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 5;
    const up = 18 * k - 30 * k * k + (i % 2) * 3 * k;
    const cx = x + dx * (0.4 + k);
    const cy = y - up;
    ctx.fillStyle = "#000";
    ctx.fillRect(cx - 2.5, cy - 2.5, 5, 5);
    ctx.fillStyle = "#ffd040";
    ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
    ctx.fillStyle = "#fff8c0";
    ctx.fillRect(cx - 1, cy - 1.5, 1, 1);
  }
  // 반짝임
  ctx.fillStyle = "#fff8c0";
  ctx.globalAlpha = t;
  ctx.fillRect(x - 0.5, y - 6 - 8 * k, 1, 4);
  ctx.fillRect(x - 2, y - 4.5 - 8 * k, 4, 1);
  // +돈
  ctx.globalAlpha = Math.min(1, t * 1.5);
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#1a1622";
  ctx.strokeText(`+${amount}`, x, y - 12 - 14 * k);
  ctx.fillStyle = "#ffd040";
  ctx.fillText(`+${amount}`, x, y - 12 - 14 * k);
  ctx.textAlign = "start";
  ctx.globalAlpha = 1;
}

/** 큰 동전 (황금방 300원): 지름 26의 금화 · 톱니 테두리 · 가운데 별 무늬 · 빛나는 줄 · 위에 금액 */
function drawBigCoin(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number, price: number): void {
  ctx.globalAlpha = 1;
  // 바닥 그림자 · 반짝이는 빛 고리
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.beginPath();
  ctx.ellipse(x, y + 15, 11, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  const glow = 0.25 + 0.15 * Math.sin(tick / 8);
  ctx.fillStyle = `rgba(255,220,90,${glow})`;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
  // 톱니 테두리 (어두운 금) → 몸 → 안쪽 고리
  ctx.fillStyle = "#6a4208";
  ctx.beginPath();
  for (let i = 0; i < 32; i++) {
    const a = (i * Math.PI) / 16;
    const r = i % 2 ? 13 : 14;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.fill();
  ctx.fillStyle = "#f2b630";
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a86c10";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, 9.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#ffd860";
  ctx.beginPath();
  ctx.arc(x, y, 9, Math.PI, Math.PI * 1.5);
  ctx.lineTo(x, y);
  ctx.fill();
  // 가운데 별 무늬
  ctx.fillStyle = "#fff4b0";
  ctx.strokeStyle = "#8a5208";
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 ? 2.6 : 6.2;
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // 지나가는 빛 줄
  const sweep = ((tick % 90) / 90) * 30 - 15;
  if (Math.abs(sweep) < 12) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(x + sweep - 2, y - 12, 3, 24);
    ctx.restore();
  }
  // 위에 금액
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#1a1622";
  ctx.strokeText(String(price), x, y - 17);
  ctx.fillStyle = "#ffe070";
  ctx.fillText(String(price), x, y - 17);
  ctx.textAlign = "left";
}
