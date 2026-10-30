// 기간토마키아 건물 그리기 (모두 같은 모습): 들판 = 담 위에 지붕(학교 붉은 지붕·깃발 · 아파트 회색 벽·창문 격자 · 집 갈색 지붕) + 문 · 실내 = 나무 바닥 + 문·계단 표시
import { PW_ARENAS, TILE_SIZE, type RunState } from "@pixel-rogue/shared";

type Ctx = CanvasRenderingContext2D;
const T = TILE_SIZE;
const ROOF = { school: ["#a04a3a", "#7a3428"], apt: ["#8a8a96", "#6a6a76"], house: ["#8a5a32", "#6a4224"] } as const;

export function drawGigaBuildings(ctx: Ctx, s: RunState): void {
  const a = PW_ARENAS[s.pvp!.arena];
  for (const b of a.buildings ?? []) {
    const [c, r, w, h] = b.out;
    const [x, y, ww, hh] = [c * T, r * T, w * T, h * T];
    const [main, edge] = ROOF[b.kind];
    ctx.fillStyle = edge;
    ctx.fillRect(x, y, ww, hh);
    ctx.fillStyle = main;
    ctx.fillRect(x + 3, y + 3, ww - 6, hh - 6);
    if (b.kind === "house") {
      // 지붕 마루 줄
      ctx.fillStyle = edge;
      ctx.fillRect(x + 3, y + hh / 2 - 1, ww - 6, 2);
    } else {
      // 창문 격자 (불 켜진 창 몇 개)
      for (let yy = y + 8; yy < y + hh - 10; yy += 12)
        for (let xx = x + 8; xx < x + ww - 8; xx += 12) {
          ctx.fillStyle = (xx * 7 + yy * 3) % 5 === 0 ? "#f0d870" : "#3a4a60";
          ctx.fillRect(xx, yy, 6, 6);
        }
    }
    if (b.kind === "school") {
      // 지붕 위 깃발
      ctx.fillStyle = "#d8d8e0";
      ctx.fillRect(x + ww / 2, y - 14, 2, 16);
      ctx.fillStyle = "#4a8af0";
      ctx.fillRect(x + ww / 2 + 2, y - 14, 10, 6);
    }
  }
  for (const d of a.portals ?? []) {
    const [px, py] = [d.at[0] * T, d.at[1] * T];
    if (d.kind === "in") {
      // 들판 문: 건물 아래 나무 문
      ctx.fillStyle = "#5a3a1a";
      ctx.fillRect(px + 3, py - 4, T - 6, 6);
      ctx.fillStyle = "#e0b040";
      ctx.fillRect(px + T - 6, py - 2, 2, 2);
    } else {
      // 실내 문·계단: 바닥에 표시 (계단은 줄무늬)
      ctx.fillStyle = d.kind === "out" ? "rgba(120, 220, 140, 0.55)" : "rgba(200, 200, 230, 0.5)";
      ctx.fillRect(px + 1, py + 1, T - 2, T - 2);
      if (d.kind !== "out") {
        ctx.fillStyle = "rgba(40, 40, 60, 0.6)";
        for (let k = 0; k < 4; k++) ctx.fillRect(px + 2, py + 2 + k * 4, T - 4, 1);
      }
    }
  }
}

/** 실내 구역: 바탕은 어두운 벽 · 층마다 나무 마루 · 그 위에 칸막이 담 (바닥이 담을 덮지 않게 다시 그림) */
export function drawGigaFloors(ctx: Ctx, s: RunState): void {
  const a = PW_ARENAS[s.pvp!.arena];
  if (!a.outCols) return;
  ctx.fillStyle = "#1e1a24";
  ctx.fillRect(a.outCols * T, 0, (a.cols - a.outCols) * T, a.rows * T);
  const rooms = (a.buildings ?? []).flatMap((b) => b.inside.map((rect) => ({ b, rect })));
  for (const { b, rect: [c, r, w, h] } of rooms) {
    ctx.fillStyle = b.kind === "school" ? "#7a6a52" : "#8a6a48";
    ctx.fillRect(c * T, r * T, w * T, h * T);
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    for (let k = 0; k < h * 2; k++) ctx.fillRect(c * T, r * T + k * 8, w * T, 1);
  }
  const inRoom = ([c, r]: readonly number[]) => rooms.some(({ rect: [x, y, w, h] }) => c! >= x && c! < x + w && r! >= y && r! < y + h);
  for (const [c, r, w, h] of a.walls) {
    if (c < a.outCols || !inRoom([c, r])) continue;
    ctx.fillStyle = "#4a3e52";
    ctx.fillRect(c * T, r * T, w * T, h * T);
    ctx.fillStyle = "#6a5c74";
    ctx.fillRect(c * T, r * T, w * T, 3);
  }
}
