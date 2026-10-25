// 방 바닥에 그리는 것: 들어온 입구 · 출구(다음 방 종류 표시) · 계단 · 상점 깔개 · 보물 상자 · 쉼터 샘 · 라스트 보스 층 여신상 (임시 그림)
import { EXIT_X, ROOM_COLS, ROOM_HEIGHT, ROOM_ROWS, ROOM_WIDTH, TILE_SIZE, type RunState } from "@pixel-rogue/shared";
import { drawGlyph, ROOM_COLORS } from "./minimap";

const C = {
  doorOpen: "#1c1926",
  doorLocked: "#b04050",
  /** 들어온 입구 (닫혀서 되돌아갈 수 없음) */
  entry: "#2c2740",
  entryBar: "#4a4262",
  stairs: "#0d0b12",
  stairsStep: "#4a4262",
  shopMat: "#3a5a3a",
  shopEdge: "#5a8a5a",
  chest: "#a0703a",
  chestLid: "#c89048",
  chestBand: "#f2c14e",
  spring: "#3a7ab0",
  springLight: "#8fd4f2",
  springEdge: "#5a5274",
};

/** 라스트 보스 층 시작 방의 여신상: 받침 · 옷자락 · 머리 · 펼친 날개 · 은은한 빛 (축복은 그 앞 바닥에) */
function drawGoddess(ctx: CanvasRenderingContext2D, s: RunState, x: number, y: number): void {
  const glow = 0.18 + 0.1 * Math.sin(s.tick / 20);
  ctx.fillStyle = `rgba(255, 230, 150, ${glow})`;
  ctx.beginPath();
  ctx.arc(x, y - 4, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#6a6478";
  ctx.fillRect(x - 10, y + 10, 20, 5);
  ctx.fillStyle = "#d8d4e4";
  ctx.fillRect(x - 5, y - 6, 10, 16);
  ctx.fillRect(x - 6, y + 4, 12, 6);
  ctx.fillStyle = "#f0ecf8";
  ctx.fillRect(x - 3, y - 13, 6, 6);
  ctx.fillStyle = "#ffd76a";
  ctx.fillRect(x - 4, y - 15, 8, 1);
  ctx.fillStyle = "#c8c4d8";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(x - 7 - i * 3, y - 8 + i * 2, 3, 8 - i);
    ctx.fillRect(x + 4 + i * 3, y - 8 + i * 2, 3, 8 - i);
  }
}

export function drawRoomFeatures(ctx: CanvasRenderingContext2D, s: RunState): void {
  const room = s.map.rooms[s.roomId];
  if (!room) return;
  const cleared = s.rooms[s.roomId]?.cleared ?? false;
  // 아래쪽 벽 입구: 들어온 길은 닫힘
  if (room.layer > 0) {
    const x = Math.floor(ROOM_COLS / 2) * TILE_SIZE;
    const y = (ROOM_ROWS - 1) * TILE_SIZE;
    ctx.fillStyle = C.entry;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = C.entryBar;
    for (let i = 0; i < 3; i++) ctx.fillRect(x + 2 + i * 5, y + 1, 2, TILE_SIZE - 2);
  }
  // 위쪽 벽 출구: 잠겼으면 빗장, 바로 아래에 다음 방 종류 표시
  room.exits.forEach((next, lane) => {
    if (next < 0) return;
    const x = EXIT_X[lane]! - TILE_SIZE / 2;
    const y = 0;
    ctx.fillStyle = C.doorOpen;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    if (!cleared) {
      ctx.fillStyle = C.doorLocked;
      for (let i = 0; i < 3; i++) ctx.fillRect(x + 1, y + 2 + i * 5, TILE_SIZE - 2, 2);
    }
    const type = s.map.rooms[next]!.type;
    const bx = x + 4;
    const by = TILE_SIZE + 2;
    ctx.fillStyle = "#141018";
    ctx.fillRect(bx - 1, by - 1, 9, 9);
    ctx.fillStyle = ROOM_COLORS[type];
    ctx.fillRect(bx, by, 7, 7);
    drawGlyph(ctx, type, bx + 1, by + 1, "#1a1622");
  });
  const cx = ROOM_WIDTH / 2;
  const cy = ROOM_HEIGHT / 2;
  if (room.type === "exit") {
    ctx.globalAlpha = cleared ? 1 : 0.35;
    ctx.fillStyle = C.stairs;
    ctx.fillRect(cx - 8, cy - 8, 16, 16);
    ctx.fillStyle = C.stairsStep;
    for (let i = 0; i < 4; i++) ctx.fillRect(cx - 7 + i * 2, cy - 6 + i * 3, 14 - i * 4, 2);
    ctx.globalAlpha = 1;
  } else if (room.type === "shop") {
    ctx.fillStyle = C.shopEdge;
    ctx.fillRect(cx - 56, cy - 22, 112, 30);
    ctx.fillStyle = C.shopMat;
    ctx.fillRect(cx - 55, cy - 21, 110, 28);
  } else if (room.type === "treasure") {
    // 열린 상자 (보물은 양옆에 놓임)
    ctx.fillStyle = C.chestLid;
    ctx.fillRect(cx - 7, cy - 9, 14, 4);
    ctx.fillStyle = C.chest;
    ctx.fillRect(cx - 7, cy - 4, 14, 9);
    ctx.fillStyle = C.chestBand;
    ctx.fillRect(cx - 1, cy - 4, 2, 4);
  } else if (room.type === "start" && s.lastBoss) {
    drawGoddess(ctx, s, cx, cy - 14);
  } else if (room.type === "rest") {
    // 샘: 들어오면 체력이 회복됨
    ctx.fillStyle = C.springEdge;
    ctx.fillRect(cx - 12, cy - 8, 24, 16);
    ctx.fillStyle = C.spring;
    ctx.fillRect(cx - 10, cy - 6, 20, 12);
    ctx.fillStyle = C.springLight;
    const shimmer = Math.floor(s.tick / 20) % 3;
    ctx.fillRect(cx - 7 + shimmer * 3, cy - 3, 4, 1);
    ctx.fillRect(cx - 1 - shimmer * 2, cy + 2, 3, 1);
  }
}
