import { describe, expect, it } from "vitest";
import "../balanceTables";
import { HIDDEN_FORT_RULES } from "./hiddenForts";
import { HIDDEN_SEA_RULES } from "./hiddenSea";
import { HIDDEN_FOE_RULES } from "./hiddenFoes";
import { HIDDEN_RULES } from "./hiddenTrial";
import { hiddenDmg } from "./hiddenFoes";
import type { HiddenKind } from "./hiddenTrialTypes";
import { startFloor, warpRoom } from "./rooms";
import { roomLocked } from "./specialRooms";
import { createRun, stepSim } from "./run";
import { EMPTY_INPUT, type RunState } from "./types";

/** 4층 숨은 시련 방에 들어간 판 (종류를 정해서) */
function inHidden(kind: HiddenKind, seed = 3): RunState {
  const s = createRun(seed, "warden");
  startFloor(s, 4);
  s.player.hp = s.player.stats.maxHp = 99999;
  s.hidden!.kind = kind;
  warpRoom(s, s.hidden!.room);
  return s;
}
const step = (s: RunState, n = 1) => {
  for (let i = 0; i < n; i++) {
    s.player.hp = s.player.stats.maxHp;
    stepSim(s, EMPTY_INPUT);
  }
};
const forts = (s: RunState) => s.enemies.filter((e) => e.kind === "fort");

describe("숨은 시련", () => {
  it("3층까지는 없고 4층부터 층마다 보통 전투방 하나", () => {
    for (let seed = 1; seed < 6; seed++) {
      const s = createRun(seed, "warden");
      startFloor(s, 3);
      expect(s.hidden).toBeUndefined();
      startFloor(s, 4);
      expect(s.map.rooms[s.hidden!.room]!.type).toBe("combat");
      expect(s.hidden!.kind).toBeGreaterThanOrEqual(1);
      expect(s.hidden!.kind).toBeLessThanOrEqual(5);
    }
  });

  it("하이오크 부락: 방이 잠기고 3라운드, 마지막은 정예 · 피해 배율 · 깨면 패시브 셋", () => {
    const s = inHidden(1);
    expect(roomLocked(s)).toBe(true);
    expect(s.enemies.every((e) => e.kind === "highorc")).toBe(true);
    expect(hiddenDmg(s, "highorc")).toBe(HIDDEN_FOE_RULES.ORC_DMG);
    for (const round of [2, 3]) {
      s.enemies = [];
      step(s, HIDDEN_RULES.ROUND_GAP + 1);
      expect(s.hidden!.round).toBe(round);
    }
    expect(s.enemies.length).toBe(HIDDEN_RULES.ORC_ELITE);
    expect(s.enemies.every((e) => e.champ)).toBe(true);
    s.enemies = [];
    step(s, 2);
    expect(s.hidden!.done).toBe(true);
    expect(roomLocked(s)).toBe(false);
    expect(s.rooms[s.roomId]!.cleared).toBe(true);
    expect(s.rooms[s.roomId]!.pickups.filter((p) => p.kind === "passive").length).toBeGreaterThanOrEqual(3);
  });

  it("어둠의 세계: 사거리가 단검만큼 · 깜깜함이 가끔 풀림 · 끝나면 사거리 돌아옴", () => {
    const s = createRun(3, "warden");
    const range = s.player.stats.range;
    startFloor(s, 4);
    s.hidden!.kind = 2;
    warpRoom(s, s.hidden!.room);
    expect(s.player.stats.range).toBe(Math.min(range, HIDDEN_FOE_RULES.DARK_RANGE));
    s.player.hp = 99999;
    step(s);
    expect(s.player.blindTicks).toBeGreaterThan(0);
    s.hidden!.round = 3;
    expect(hiddenDmg(s, "lurker")).toBe(HIDDEN_FOE_RULES.DARK_BIG);
    s.enemies = [];
    step(s, 2);
    expect(s.hidden!.done).toBe(true);
    expect(s.player.stats.range).toBe(range);
  });

  it("공성전: 성벽 둘은 조각이 체력 하나 · 아래 벽을 부수면 포격수, 위 벽을 부수면 궁병이 사라짐 · 벽을 못 넘음", () => {
    const s = inHidden(3);
    expect(forts(s).length).toBeGreaterThan(10);
    expect(s.enemies.filter((e) => e.kind === "skelarcher").every((e) => e.immune)).toBe(true);
    s.player.y = 0;
    step(s);
    const low = s.hidden!.forts![0]!;
    expect(s.player.y).toBeGreaterThan(low.xy[0]![1]);
    // 범위 공격이 여러 조각을 맞혀도 한 번만
    const before = low.pool;
    for (const e of forts(s).filter((e) => low.ids.includes(e.id))) e.hp -= 50;
    step(s);
    expect(low.pool).toBe(before - 50);
    for (const e of forts(s).filter((e) => low.ids.includes(e.id))) e.hp = 0;
    step(s);
    expect(low.down).toBe(true);
    expect(s.enemies.some((e) => e.kind === "mortar")).toBe(false);
    expect(s.enemies.some((e) => e.kind === "skelarcher")).toBe(true);
  });

  it("안개숲: 독가스 밖이면 중독 · 살포기를 다 부수면 3초 뒤 걷힘 · 숨은 적은 안 맞음", () => {
    const s = inHidden(4);
    const h = s.hidden!;
    step(s);
    expect(s.player.poison ?? 0).toBe(0);
    s.player.x = s.player.x + 60;
    s.player.y = s.player.y - 60;
    step(s);
    expect(s.player.poison ?? 0).toBeGreaterThan(0);
    for (const e of forts(s)) e.hp = 0;
    step(s);
    expect(h.gasOff).toBeDefined();
    step(s, HIDDEN_FORT_RULES.GAS_FADE + 1);
    expect(s.enemies.filter((e) => e.kind === "spitter").every((e) => !e.immune)).toBe(true);
  });

  it("죽음의 바다: 숨이 줄고 비눗방울에서 다시 참 · 10초 뒤 해적선 · 배가 부서지면 선장", () => {
    const s = inHidden(5);
    const h = s.hidden!;
    step(s, 10);
    expect(h.breath).toBeLessThan(HIDDEN_SEA_RULES.BREATH);
    h.bubbles = [[s.player.x, s.player.y, s.tick + 100]];
    const b = h.breath!;
    step(s);
    expect(h.breath).toBeGreaterThan(b);
    step(s, HIDDEN_SEA_RULES.SHIP_AT);
    expect(h.forts?.[0]?.look).toBe("ship");
    for (const e of forts(s)) e.hp = 0;
    step(s);
    expect(s.enemies.some((e) => e.kind === "captain")).toBe(true);
    expect(h.round).toBe(2);
  });

  it("시드가 같으면 같은 결과", () => {
    const a = inHidden(3, 9);
    const b = inHidden(3, 9);
    step(a, 200);
    step(b, 200);
    expect(JSON.stringify(a.enemies.map((e) => [e.kind, e.x, e.y, e.hp]))).toBe(JSON.stringify(b.enemies.map((e) => [e.kind, e.x, e.y, e.hp])));
  });
});
