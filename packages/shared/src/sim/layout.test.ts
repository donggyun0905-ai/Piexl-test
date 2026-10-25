import { describe, expect, it } from "vitest";
import { ROOM_COLS, ROOM_ROWS, SHAPE_DX as DX, SHAPE_DY as DY, TILE_SIZE } from "../constants";
import { createRun, stepSim } from "./run";
import { generateFloor } from "./floor";
import { distanceField, ROOM_SHAPES, shapeGrid, TILE_FLOOR, tileAt } from "./layout";
import { EMPTY_INPUT } from "./types";
import { EXIT_X } from "./util";

const ALL = ROOM_SHAPES.flatMap((_, id) => [false, true].map((flip) => ({ id, flip })));

describe("방 모양", () => {
  it("틀은 모두 13×7", () => {
    for (const rows of ROOM_SHAPES) {
      expect(rows.length).toBe(7);
      for (const r of rows) expect(r.length).toBe(13);
    }
  });

  it("출구·입구·보상 자리는 비어 있고, 바닥은 모두 이어져 있음", () => {
    for (const shape of ALL) {
      const g = shapeGrid(shape)!;
      for (const x of EXIT_X) expect(tileAt(g, Math.floor(x / TILE_SIZE), 1)).toBe(TILE_FLOOR);
      expect(tileAt(g, 7 + DX, 6 + DY)).toBe(TILE_FLOOR);
      expect(tileAt(g, 7 + DX, 7 + DY)).toBe(TILE_FLOOR);
      for (let row = 2; row <= 5; row++) for (let col = 5; col <= 9; col++) expect(tileAt(g, col + DX, row + DY)).toBe(TILE_FLOOR);
      const field = distanceField(g, (7.5 + DX) * TILE_SIZE, (7.5 + DY) * TILE_SIZE);
      for (let row = 0; row < ROOM_ROWS; row++) {
        for (let col = 0; col < ROOM_COLS; col++) {
          if (tileAt(g, col, row) === TILE_FLOOR) expect(field[row * ROOM_COLS + col]).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it("전투방·강한 적 방에만 모양이 들어가고 같은 시드면 같음", () => {
    const a = generateFloor(42, 3);
    const b = generateFloor(42, 3);
    expect(a.rooms.map((r) => r.shape)).toEqual(b.rooms.map((r) => r.shape));
    for (const r of a.rooms) {
      if (r.type === "combat" || r.type === "elite") expect(r.shape.id).toBeGreaterThanOrEqual(0);
      else expect(r.shape.id).toBe(-1);
    }
  });

  it("적과 플레이어가 막힌 칸 안에 들어가지 않음", () => {
    let tested = 0;
    for (let seed = 1; seed <= 20; seed++) {
      const s = createRun(seed, "drifter");
      const exits = s.map.rooms[s.map.startId]!.exits;
      const lane = exits.findIndex((n) => n >= 0);
      // 시작 방에서 출구로 걸어 나가 모양 있는 방으로
      for (let i = 0; i < 400 && s.roomId === s.map.startId; i++) {
        const dx = EXIT_X[lane]! - s.player.x;
        stepSim(s, { ...EMPTY_INPUT, moveX: Math.abs(dx) > 1 ? Math.sign(dx) * 100 : 0, moveY: -100 });
      }
      const room = s.roomId;
      const g = shapeGrid(s.map.rooms[room]!.shape);
      if (!g) continue;
      tested++;
      for (let t = 0; t < 600 && !s.over && s.roomId === room; t++) {
        stepSim(s, { ...EMPTY_INPUT, moveX: t % 120 < 60 ? 100 : -100, moveY: t % 200 < 100 ? -100 : 100, attack: true, dash: t % 50 === 0, autoAim: true });
        if (s.roomId !== room) break;
        for (const b of [s.player, ...s.enemies]) {
          expect(tileAt(g, Math.floor(b.x / TILE_SIZE), Math.floor(b.y / TILE_SIZE))).toBe(TILE_FLOOR);
        }
      }
    }
    expect(tested).toBeGreaterThan(10);
  });
});
