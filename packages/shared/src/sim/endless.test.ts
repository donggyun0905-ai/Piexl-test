import { describe, expect, it } from "vitest";
import { TICK_RATE } from "../constants";
import { ENEMIES, LAST_BOSSES } from "../content";
import { endlessPow } from "./endless";
import { BIG_COLS, BIG_ROWS, goThrough, startFloor } from "./rooms";
import { createRun, stepSim } from "./run";
import { EMPTY_INPUT, type RunState } from "./types";

/** 무한 모드 판을 floor층 보스방에 넣음 */
function bossRoom(floor: number, seed = 3): RunState {
  const s = createRun(seed, "warden", [], false, true);
  startFloor(s, floor);
  const from = s.map.rooms.find((r) => r.exits.includes(s.map.exitId))!;
  s.roomId = from.id;
  s.rooms[from.id] = { visited: true, cleared: true, pickups: [], enemies: [] };
  goThrough(s, from.exits.indexOf(s.map.exitId));
  return s;
}

const bosses = (s: RunState) => s.enemies.filter((e) => ENEMIES[e.kind].boss);
const lastCount = (s: RunState) => s.enemies.filter((e) => (LAST_BOSSES as readonly string[]).includes(e.kind)).length;

describe("무한 모드 보스방 단계", () => {
  it("6층까지 보스 1마리 · 7~10층 2마리 · 11~13층 라스트 보스(큰 방)", () => {
    expect(bosses(bossRoom(6))).toHaveLength(1);
    expect(bosses(bossRoom(8))).toHaveLength(2);
    const s = bossRoom(12);
    expect(lastCount(s)).toBe(1);
    expect([s.roomCols, s.roomRows]).toEqual([BIG_COLS, BIG_ROWS]);
  });

  it("14~16층 라스트 보스 + 보스 (3마리) · 17층부터 라스트 보스 3종(2배 방)", () => {
    for (const seed of [1, 2, 3, 4]) {
      const s = bossRoom(15, seed);
      expect(bosses(s), String(seed)).toHaveLength(3);
      expect(lastCount(s)).toBe(1);
    }
    const t = bossRoom(18);
    expect(lastCount(t)).toBe(3);
    expect([t.roomCols, t.roomRows]).toEqual([BIG_COLS * 2, BIG_ROWS * 2]);
  });

  it("7층부터 층마다 세짐 (보통 판·6층까지는 그대로)", () => {
    expect(endlessPow(bossRoom(6))).toBe(1);
    expect(endlessPow(bossRoom(12))).toBeGreaterThan(endlessPow(bossRoom(8)));
    expect(endlessPow(createRun(1, "warden"))).toBe(1);
  });

  it("17층부터 끝까지 라스트 보스 3종 (AI 대결 없음)", () => {
    for (const floor of [20, 25, 40]) {
      const s = bossRoom(floor);
      expect(s.pw, String(floor)).toBeUndefined();
      expect(lastCount(s), String(floor)).toBe(3);
      expect([s.roomCols, s.roomRows]).toEqual([BIG_COLS * 2, BIG_ROWS * 2]);
    }
  });

  it("라스트 보스 단계가 10초 동안 문제없이 · 같은 시드면 같은 결과", () => {
    for (const floor of [9, 12, 15, 18, 21]) {
      const run = () => {
        const s = bossRoom(floor, 7);
        for (let i = 0; i < TICK_RATE * 10 && !s.over; i++) {
          s.player.hp = s.player.stats.maxHp;
          stepSim(s, { ...EMPTY_INPUT, autoAim: true, attack: true, moveX: i % 120 < 60 ? 60 : -60 });
        }
        return JSON.stringify([s.tick, s.enemies.map((e) => [e.kind, Math.round(e.hp)]), s.player.hp]);
      };
      expect(run(), String(floor)).toBe(run());
    }
  }, 60000);
});
