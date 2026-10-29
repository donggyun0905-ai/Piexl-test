// 로비 전시장 그리기: 대리석 바닥·붉은 융단 · 위 벽(아치 창·보라 깃발·금 띠) · 아래 문(로비로) · 기둥 · 창에서 내려오는 빛
// · 전시물(월계선 shipArt · 영혼 조각: 유리 덮개 안 떠 있는 연두색 빛 조각) · 빈 받침대 · 이름표. 로비 위 벽 전시장 문도 여기서
import type { ExhibitId } from "./exhibits";
import { EMPTY_PLINTHS, EXHIBIT_SPOTS, HALL_COLS, HALL_DOOR, HALL_H, HALL_ROWS, HALL_W, LOBBY_DOOR, PILLARS } from "./hallMap";
import { TILE, WALL_TOP } from "./lobbyMap";
import { drawShip } from "./shipArt";

type Ctx = CanvasRenderingContext2D;

function r(ctx: Ctx, x: number, y: number, w: number, h: number, c: string): void {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

let room: HTMLCanvasElement | null = null;

/** 바닥·벽 (한 번 그려 둠) */
function roomCanvas(): HTMLCanvasElement {
  if (room) return room;
  room = document.createElement("canvas");
  room.width = HALL_W;
  room.height = HALL_H;
  const ctx = room.getContext("2d")!;
  // 대리석 바닥 (두 색 바둑판 + 옅은 결)
  for (let row = 0; row < HALL_ROWS; row++) {
    for (let c = 0; c < HALL_COLS; c++) {
      r(ctx, c * TILE, row * TILE, TILE, TILE, (row + c) % 2 ? "#2c2640" : "#353050");
      r(ctx, c * TILE + ((row * 5 + c * 3) % 11), row * TILE + ((row * 7 + c) % 13), 4, 1, "rgba(255,255,255,0.06)");
      r(ctx, c * TILE, row * TILE, TILE, 1, "rgba(0,0,0,0.18)");
    }
  }
  // 붉은 융단: 아래 문에서 월계선 받침까지 (금 테두리)
  const cw = 3 * TILE;
  const cx = HALL_W / 2 - cw / 2;
  r(ctx, cx - 2, 9 * TILE, cw + 4, HALL_H - 9 * TILE, "#e0b040");
  r(ctx, cx, 9 * TILE, cw, HALL_H - 9 * TILE, "#8a1a2a");
  for (let y = 9 * TILE + 6; y < HALL_H; y += 10) r(ctx, cx + cw / 2 - 2, y, 4, 2, "#c8a040");
  // 위 벽: 짙은 남색 돌 · 아치 창 · 깃발 · 금 띠
  r(ctx, 0, 0, HALL_W, WALL_TOP, "#1c1830");
  for (let y = 4; y < WALL_TOP; y += 8) for (let x = (y / 8) % 2 ? 0 : 8; x < HALL_W; x += 16) r(ctx, x, y, 15, 1, "rgba(0,0,0,0.25)");
  for (let i = 0; i < 6; i++) {
    const x = (2.5 + i * 4.8) * TILE;
    r(ctx, x - 6, 6, 12, 22, "#0c0a18");
    r(ctx, x - 5, 8, 10, 19, "#3a5a9a");
    r(ctx, x - 4, 6, 8, 2, "#3a5a9a");
    r(ctx, x - 1, 8, 2, 19, "#0c0a18");
    r(ctx, x - 5, 17, 10, 1, "#0c0a18");
    r(ctx, x - 4, 9, 3, 6, "#8ab0e8");
  }
  for (let i = 0; i < 5; i++) {
    const x = (4.9 + i * 4.8) * TILE;
    r(ctx, x - 4, 4, 8, 20, "#5a2a8a");
    r(ctx, x - 4, 22, 3, 3, "#5a2a8a");
    r(ctx, x + 1, 22, 3, 3, "#5a2a8a");
    r(ctx, x - 2, 10, 4, 4, "#ffd040");
    r(ctx, x - 4, 4, 8, 1, "#ffd040");
  }
  r(ctx, 0, WALL_TOP - 4, HALL_W, 2, "#e0b040");
  r(ctx, 0, WALL_TOP - 2, HALL_W, 2, "rgba(0,0,0,0.4)");
  // 옆 벽
  r(ctx, 0, WALL_TOP, TILE, HALL_H, "#1c1830");
  r(ctx, HALL_W - TILE, WALL_TOP, TILE, HALL_H, "#1c1830");
  r(ctx, TILE - 2, WALL_TOP, 2, HALL_H, "rgba(0,0,0,0.3)");
  r(ctx, HALL_W - TILE, WALL_TOP, 2, HALL_H, "rgba(0,0,0,0.3)");
  // 아래 문 (로비로): 바닥에 금 문턱 + 아래로 화살표
  r(ctx, HALL_DOOR.x - HALL_DOOR.w / 2, HALL_H - 6, HALL_DOOR.w, 6, "#0c0a18");
  r(ctx, HALL_DOOR.x - HALL_DOOR.w / 2, HALL_H - 7, HALL_DOOR.w, 1, "#e0b040");
  return room;
}

/** 창에서 비스듬히 내려오는 빛 (천천히 숨 쉼) */
function lights(ctx: Ctx, t: number): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 6; i++) {
    const x = (2.5 + i * 4.8) * TILE;
    const a = 0.05 + 0.02 * Math.sin(t * 0.8 + i);
    ctx.fillStyle = `rgba(140, 170, 255, ${a})`;
    ctx.beginPath();
    ctx.moveTo(x - 5, WALL_TOP);
    ctx.lineTo(x + 5, WALL_TOP);
    ctx.lineTo(x + 30, HALL_H * 0.75);
    ctx.lineTo(x + 6, HALL_H * 0.75);
    ctx.fill();
  }
  ctx.restore();
}

function pillar(ctx: Ctx, x: number, y: number): void {
  r(ctx, x - 7, y - 4, 14, 4, "#4a4466");
  r(ctx, x - 5, y - 40, 10, 36, "#8a86a8");
  for (const dx of [-3, 0, 3]) r(ctx, x + dx, y - 38, 1, 33, "#6a6688");
  r(ctx, x - 5, y - 40, 2, 36, "#b0acc8");
  r(ctx, x - 7, y - 44, 14, 4, "#4a4466");
  r(ctx, x - 7, y - 44, 14, 1, "#e0b040");
}

function plinth(ctx: Ctx, x: number, y: number): void {
  r(ctx, x - 11, y - 8, 22, 8, "#4a4466");
  r(ctx, x - 11, y - 8, 22, 2, "#8a86a8");
  r(ctx, x - 4, y - 5, 8, 3, "#2c2640");
}

/** 영혼 조각: 받침대 · 유리 덮개 · 떠서 천천히 도는 연두색 빛 조각 · 빛 알갱이 */
function soulShard(ctx: Ctx, x: number, y: number, t: number): void {
  r(ctx, x - 9, y - 14, 18, 14, "#4a4466");
  r(ctx, x - 9, y - 14, 18, 2, "#e0b040");
  r(ctx, x - 7, y - 11, 14, 1, "#6a6688");
  const bob = Math.sin(t * 2) * 2;
  const cy = y - 28 + bob;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(x, cy, 0, x, cy, 16);
  g.addColorStop(0, "rgba(160, 255, 120, 0.55)");
  g.addColorStop(1, "rgba(160, 255, 120, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(x - 16, cy - 16, 32, 32);
  for (let i = 0; i < 5; i++) {
    const p = (t * 0.6 + i * 0.2) % 1;
    r(ctx, x - 6 + ((i * 5) % 12), cy + 8 - p * 22, 1, 1, `rgba(200, 255, 170, ${1 - p})`);
  }
  ctx.restore();
  // 조각: 뾰족한 결정 (가운데가 밝음)
  const w = Math.round(3 + Math.abs(Math.sin(t * 1.3)) * 1.5);
  for (let j = -6; j <= 6; j++) {
    const hw = Math.round(w * (1 - Math.abs(j) / 7));
    r(ctx, x - hw, cy + j, hw * 2 + 1, 1, Math.abs(j) < 2 ? "#e0ffd0" : "#8aff6a");
  }
  r(ctx, x - 1, cy - 3, 1, 3, "#ffffff");
  // 유리 덮개
  ctx.strokeStyle = "rgba(200, 230, 255, 0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 9, y - 14);
  ctx.lineTo(x - 9, y - 34);
  ctx.arc(x, y - 34, 9, Math.PI, 0);
  ctx.lineTo(x + 9, y - 14);
  ctx.stroke();
  r(ctx, x - 6, y - 38, 2, 8, "rgba(255,255,255,0.35)");
}

/** 이름표 (받침 앞 작은 금 판) */
function plaque(ctx: Ctx, x: number, y: number, text: string): void {
  ctx.font = "bold 5px sans-serif";
  const w = Math.ceil(ctx.measureText(text).width) + 6;
  r(ctx, x - w / 2, y, w, 8, "#3a2a10");
  r(ctx, x - w / 2 + 1, y + 1, w - 2, 6, "#c8a040");
  ctx.fillStyle = "#2a1a08";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y + 6);
  ctx.textAlign = "start";
}

/** 전시장 전체 (people = 사람, 아래로 갈수록 앞) */
export function drawHall(ctx: Ctx, t: number, shown: readonly ExhibitId[], names: Partial<Record<ExhibitId, string>>, people: { y: number; draw: () => void }[]): void {
  ctx.drawImage(roomCanvas(), 0, 0);
  lights(ctx, t);
  const items: { y: number; draw: () => void }[] = [
    ...PILLARS.map((p) => ({ y: p.y, draw: () => pillar(ctx, p.x, p.y) })),
    ...EMPTY_PLINTHS.map((p) => ({ y: p.y, draw: () => plinth(ctx, p.x, p.y) })),
    ...EXHIBIT_SPOTS.map((e) => ({
      y: e.y,
      draw: () => {
        if (e.id === "laurelShip") {
          if (shown.includes(e.id)) drawShip(ctx, e.x, e.y, t);
          else plinth(ctx, e.x, e.y);
        } else if (shown.includes(e.id)) soulShard(ctx, e.x, e.y, t);
        else plinth(ctx, e.x, e.y);
        if (shown.includes(e.id) && names[e.id]) plaque(ctx, e.x, e.y + 2, names[e.id]!);
      },
    })),
    ...people,
  ];
  items.sort((a, b) => a.y - b.y);
  for (const it of items) it.draw();
  // 아래 문 화살표 (깜빡)
  if (Math.floor(t * 2) % 2) {
    r(ctx, HALL_DOOR.x - 1, HALL_H - 16, 3, 5, "#ffe8a0");
    r(ctx, HALL_DOOR.x - 3, HALL_H - 12, 7, 1, "#ffe8a0");
    r(ctx, HALL_DOOR.x - 2, HALL_H - 11, 5, 1, "#ffe8a0");
  }
}

/** 로비 위 벽 가운데 전시장 문: 금 테 아치 · 안쪽 보랏빛 · 위에 월계관 */
export function drawHallDoor(ctx: Ctx, t: number): void {
  const x = LOBBY_DOOR.x;
  const w = LOBBY_DOOR.w;
  r(ctx, x - w / 2 - 2, 6, w + 4, WALL_TOP - 6, "#e0b040");
  r(ctx, x - w / 2, 9, w, WALL_TOP - 9, "#120a24");
  r(ctx, x - w / 2 + 2, 7, w - 4, 2, "#e0b040");
  const a = 0.25 + 0.15 * Math.sin(t * 2);
  r(ctx, x - w / 2 + 2, 12, w - 4, WALL_TOP - 12, `rgba(138, 90, 255, ${a})`);
  for (let i = 0; i < 6; i++) r(ctx, x - 8 + i * 3, 3 + (i % 2), 2, 2, i % 2 ? "#5ab05a" : "#8ad070");
  r(ctx, x - 1, 2, 2, 2, "#ffd040");
}
