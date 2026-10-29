// 로비 그리기: 바닥·벽(테마 무늬) → 무대 조명 → 꾸밈·게임기·캐릭터들·펫·나(아래쪽일수록 앞) → 깃발·풍선·색종이
import { drawHallDoor } from "./hallArt";
import { DECOR, LOBBY_COLS, LOBBY_H, LOBBY_ROWS, LOBBY_W, MACHINES, MACHINE_H, MACHINE_W, TILE, WALL_TOP, type GameId, type Machine } from "./lobbyMap";
import { drawDecor, ell, r } from "./lobbyItems";
import { npcDrawers } from "./npcs";
import { drawFloorLights, drawPartyTop } from "./party";
import { petDrawers } from "./pets";
import { THEME_LOOK, type LobbyTheme, type ThemeLook } from "./lobbyThemes";

type Ctx = CanvasRenderingContext2D;

/** 바닥·벽은 테마마다 한 번 그려 둠 */
const roomCache = new Map<LobbyTheme, HTMLCanvasElement>();

function floorTile(ctx: Ctx, L: ThemeLook, c: number, row: number): void {
  const x = c * TILE;
  const y = row * TILE;
  const odd = (c + row) % 2 === 1;
  r(ctx, x, y, TILE, TILE, odd ? L.floorA : L.floorB);
  switch (L.floorDeco) {
    case "carpet":
      if ((c * 3 + row * 5) % 7 === 0) r(ctx, x + 7, y + 7, 2, 2, L.glow);
      break;
    case "sand":
      r(ctx, x + ((c * 5) % 11), y + ((row * 7) % 13), 1, 1, "#d8b870");
      break;
    case "snow":
      if (row === LOBBY_ROWS - 1 || (c + row) % 5 === 0) r(ctx, x + 3, y + 5, 2, 1, "#f8f8ff");
      r(ctx, x, y + 15, TILE, 1, "#6a4428");
      break;
    case "dark":
      if ((c + row * 3) % 6 === 0) r(ctx, x + 4, y + 9, 6, 1, "#3a2a48");
      break;
    case "wood":
    case "ondol":
      r(ctx, x, y + 15, TILE, 1, L.floorDeco === "wood" ? "#a07a50" : "#c8a870");
      if (c % 3 === 0) r(ctx, x, y, 1, TILE, "#a88a60");
      break;
    case "tatami":
      r(ctx, x, y, TILE, 1, "#8a9a58");
      r(ctx, x, y, 1, TILE, "#8a9a58");
      break;
    case "red":
      if (odd) r(ctx, x + 6, y + 6, 4, 4, "#a83a3a");
      break;
    case "checker":
      break;
  }
}

function wall(ctx: Ctx, L: ThemeLook): void {
  r(ctx, 0, 0, LOBBY_W, WALL_TOP, L.wall);
  r(ctx, 0, 0, LOBBY_W, 4, L.wallTop);
  r(ctx, 0, WALL_TOP - 2, LOBBY_W, 2, "rgba(0,0,0,0.35)");
  r(ctx, 0, 0, TILE, LOBBY_H, L.wall);
  r(ctx, LOBBY_W - TILE, 0, TILE, LOBBY_H, L.wall);
  r(ctx, TILE - 2, WALL_TOP, 2, LOBBY_H, "rgba(0,0,0,0.3)");
  r(ctx, LOBBY_W - TILE, WALL_TOP, 2, LOBBY_H, "rgba(0,0,0,0.3)");
  for (let x = 8; x < LOBBY_W - 8; x += 32) {
    switch (L.wallDeco) {
      case "neon":
        r(ctx, x, 10, 20, 2, x % 64 ? L.wallMark : L.glow);
        break;
      case "waves":
        for (let i = 0; i < 16; i++) r(ctx, x + i, 12 + Math.round(Math.sin(i / 2.5) * 2), 1, 1, L.wallMark);
        break;
      case "wreath":
        ell(ctx, x + 10, 14, 5, 5, "#2a9a4a");
        ell(ctx, x + 10, 14, 2, 2, L.wall);
        r(ctx, x + 9, 18, 3, 2, L.wallMark);
        break;
      case "web":
        for (let i = 0; i < 6; i++) r(ctx, x + i * 2, 5 + i, 1, 1, "#c8c8d8");
        r(ctx, x + 18, 16, 6, 1, L.wallMark);
        break;
      case "board":
        if (x > 120 && x < 220) r(ctx, x, 7, 30, 18, L.wallMark);
        else r(ctx, x + 6, 9, 10, 12, "#f4f4f4");
        break;
      case "hanji":
        r(ctx, x, 6, 22, 20, "#8a5a36");
        r(ctx, x + 1, 7, 20, 18, "#fbf6e8");
        r(ctx, x + 10, 7, 1, 18, "#8a5a36");
        break;
      case "shoji":
        r(ctx, x, 6, 24, 22, "#5a4030");
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) r(ctx, x + 1 + i * 8, 7 + j * 7, 7, 6, "#fbf8ee");
        break;
      case "gold":
        r(ctx, x + 4, 8, 14, 14, "#7a1a1a");
        r(ctx, x + 6, 10, 10, 10, L.wallMark);
        r(ctx, x + 9, 13, 4, 4, "#7a1a1a");
        break;
      case "stripes":
        for (let i = 0; i < 4; i++) r(ctx, x, 6 + i * 6, 30, 3, i % 2 ? "#ffffff" : "#c83a3a");
        r(ctx, x + 2, 8, 2, 2, "#ffffff");
        break;
    }
  }
}

function roomCanvas(theme: LobbyTheme): HTMLCanvasElement {
  const hit = roomCache.get(theme);
  if (hit) return hit;
  const cv = document.createElement("canvas");
  cv.width = LOBBY_W;
  cv.height = LOBBY_H;
  const ctx = cv.getContext("2d")!;
  const L = THEME_LOOK[theme];
  for (let row = 0; row < LOBBY_ROWS; row++) for (let c = 0; c < LOBBY_COLS; c++) floorTile(ctx, L, c, row);
  wall(ctx, L);
  // 아래 가운데 들어오는 문
  r(ctx, LOBBY_W / 2 - 16, LOBBY_H - 3, 32, 3, L.glow);
  roomCache.set(theme, cv);
  return cv;
}

/** 게임기 화면 속 작은 그림 */
function screenIcon(ctx: Ctx, g: GameId, x: number, y: number, t: number): void {
  const blink = Math.floor(t * 2) % 2 === 0;
  switch (g) {
    case "blackjack":
      r(ctx, x - 4, y - 3, 4, 6, "#fff");
      r(ctx, x + 1, y - 3, 4, 6, "#fff");
      r(ctx, x - 3, y - 1, 2, 2, "#d8283a");
      r(ctx, x + 2, y - 1, 2, 2, "#222");
      break;
    case "tiles":
      ["#d8283a", "#3a8ad0", "#222", "#e8a020"].forEach((c, i) => r(ctx, x - 5 + i * 3, y - 2, 2, 4, c));
      break;
    case "apples":
      // 별사탕 셋 (분홍·노랑·하늘)
      ell(ctx, x - 3, y, 2, 2, "#ff8ab0");
      ell(ctx, x + 1, y - 1, 2, 2, "#ffe45a");
      ell(ctx, x + 4, y + 1, 2, 2, "#6ab8ff");
      if (blink) r(ctx, x - 5, y - 3, 1, 1, "#fff");
      break;
    case "blocks":
      // 룬 돌 (보라 돌에 빛나는 무늬)
      r(ctx, x - 4, y + 1, 9, 2, "#4a3a6a");
      r(ctx, x - 1, y - 3 + (blink ? 1 : 0), 3, 3, "#2a4a5a");
      r(ctx, x, y - 2 + (blink ? 1 : 0), 1, 1, "#6ae0ff");
      break;
    case "joker":
      ell(ctx, x, y, 3, 3, "#f4f4f4");
      r(ctx, x - 2, y - 1, 1, 1, "#222");
      r(ctx, x + 1, y - 1, 1, 1, "#222");
      r(ctx, x - 1, y + 1, 3, 1, "#d8283a");
      break;
    case "slots":
      for (let i = 0; i < 3; i++) r(ctx, x - 5 + i * 4, y - 2, 3, 4, blink && i === 1 ? "#ffd040" : "#ff4a4a");
      break;
    case "dice":
      r(ctx, x - 5, y - 2, 4, 4, "#fff");
      r(ctx, x + 1, y - 2, 4, 4, "#fff");
      r(ctx, x - 4, y - 1, 1, 1, "#222");
      r(ctx, x + 2, y, 2, 1, "#222");
      break;
    case "pets":
      // 발바닥
      r(ctx, x - 2, y, 5, 3, "#ff9ac8");
      r(ctx, x - 3, y - 3, 2, 2, "#ff9ac8");
      r(ctx, x, y - 4, 2, 2, "#ff9ac8");
      r(ctx, x + 3, y - 3, 2, 2, "#ff9ac8");
      break;
    case "hilo":
      r(ctx, x - 1, y - 3, 3, 1, "#7aff7a");
      r(ctx, x - 2, y - 2, 5, 1, "#7aff7a");
      r(ctx, x - 2, y + 2, 5, 1, "#ff5a6a");
      r(ctx, x - 1, y + 3, 3, 1, "#ff5a6a");
      break;
  }
}

function machine(ctx: Ctx, m: Machine, t: number, near: boolean): void {
  const x = Math.round(m.x);
  const y = Math.round(m.y);
  const w = MACHINE_W;
  const h = MACHINE_H;
  ell(ctx, x, y, w / 2 + 1, 2, "rgba(0,0,0,0.35)");
  r(ctx, x - w / 2, y - h, w, h, "#2a2438");
  r(ctx, x - w / 2 + 1, y - h + 1, w - 2, 5, m.color);
  r(ctx, x - w / 2 + 2, y - h + 7, w - 4, 10, "#0c0a14");
  screenIcon(ctx, m.game, x, y - h + 12, t);
  r(ctx, x - w / 2 + 2, y - 8, w - 4, 3, "#3a3450");
  r(ctx, x - 4, y - 8, 2, 2, "#ff4a4a");
  r(ctx, x + 2, y - 8, 2, 2, "#4aff7a");
  // 위 불빛: 가까이 오면 더 밝게 깜빡임
  const on = near ? Math.floor(t * 6) % 2 === 0 : Math.floor(t * 1.5 + m.x) % 2 === 0;
  r(ctx, x - w / 2 + 2, y - h + 2, w - 4, 1, on ? "#ffffff" : m.color);
  if (near) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - w / 2 - 1.5, y - h - 1.5, w + 3, h + 3);
  }
}

/** 로비 한 장면. people: 사람 그리기 (발 y로 앞뒤 정함) */
export function drawLobby(ctx: Ctx, theme: LobbyTheme, t: number, near: GameId | null, people: { y: number; draw: () => void }[] = []): void {
  ctx.drawImage(roomCanvas(theme), 0, 0);
  drawFloorLights(ctx, t);
  const L = THEME_LOOK[theme];
  const items: { y: number; draw: () => void }[] = [
    // 위 벽 가운데 전시장 문
    { y: 0, draw: () => drawHallDoor(ctx, t) },
    ...DECOR.map((d, i) => ({ y: d.y, draw: () => drawDecor(ctx, L.decor[i % L.decor.length]!, d.x, d.y, t) })),
    ...MACHINES.map((m) => ({ y: m.y, draw: () => machine(ctx, m, t, near === m.game) })),
    ...npcDrawers(ctx, t),
    ...petDrawers(ctx, t),
    ...people,
  ];
  items.sort((a, b) => a.y - b.y);
  for (const it of items) it.draw();
  drawPartyTop(ctx, t);
}
