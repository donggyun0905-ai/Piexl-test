import { describe, expect, it } from "vitest";
import "../balanceTables";
import { damageEnemy } from "./combat";
import { lateBossHp, lateDmg, lateHp, FOE_SCALE_RULES as F } from "./foeScale";
import { KNOCK_RULES as K } from "./knock";
import { enemy } from "./perkTestUtil";
import { eliteWave, ROOM_SPAWN_RULES as W } from "./roomSpawn";
import { startFloor } from "./rooms";
import { createRun, stepSim } from "./run";
import { EMPTY_INPUT } from "./types";

describe("밀림 · 엘리트 2라운드 · 후반 강화", () => {
  it("보통 공격은 몇 틱에 걸쳐 밀림 · 짧은 간격으로 또 맞으면(연타) 더 밀지 않음", () => {
    const s = createRun(3, "warden");
    const e = enemy(1, 100, 72, 9999);
    s.enemies = [e];
    damageEnemy(s, e, s.player.stats.damage, 1, 0);
    for (let i = 0; i < K.TICKS; i++) stepSim(s, EMPTY_INPUT);
    expect(e.x).toBeGreaterThan(100 + K.DIST * 0.8);
    const x = e.x;
    damageEnemy(s, e, s.player.stats.damage, 1, 0);
    damageEnemy(s, e, s.player.stats.damage, 1, 0);
    for (let i = 0; i < K.TICKS; i++) stepSim(s, EMPTY_INPUT);
    expect(Math.abs(e.x - x)).toBeLessThan(K.DIST / 2 + 1);
  });

  it("연타 캐릭터(닌자)·작은 조각 피해는 밀지 않음", () => {
    const s = createRun(3, "ninja");
    const e = enemy(1, 100, 72, 9999);
    s.enemies = [e];
    damageEnemy(s, e, s.player.stats.damage, 1, 0);
    expect(e.kbT ?? 0).toBe(0);
    const w = createRun(3, "warden");
    const f = enemy(1, 100, 72, 9999);
    w.enemies = [f];
    damageEnemy(w, f, w.player.stats.damage * 0.2, 1, 0);
    expect(f.kbT ?? 0).toBe(0);
  });

  it("엘리트 방은 첫 무리를 다 잡으면 잠깐 뒤 두 번째 무리 · 그 뒤에야 끝", () => {
    const s = createRun(5, "warden");
    startFloor(s, 3);
    const elite = s.map.rooms.find((r) => r.type === "elite")!;
    s.roomId = elite.id;
    s.enemies = [];
    for (let i = 0; i <= W.WAVE_DELAY; i++) expect(eliteWave(s)).toBe(true);
    expect(s.enemies.length).toBeGreaterThan(0);
    s.enemies = [];
    expect(eliteWave(s)).toBe(false);
  });

  it("4층부터 층마다 몬스터·보스 체력과 피해가 더 오름 (6층까지)", () => {
    expect(lateHp(3)).toBe(1);
    expect(lateHp(6)).toBeCloseTo(1 + 3 * F.HP);
    expect(lateBossHp(9)).toBeCloseTo(1 + F.MAX_STEP * F.BOSS_HP);
    const s = createRun(1, "warden");
    s.floor = 5;
    expect(lateDmg(s)).toBeCloseTo(1 + 2 * F.DMG);
  });
});
