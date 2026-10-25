import { describe, expect, it } from "vitest";
import type { PassiveId } from "../items";
import { EMPTY_INPUT, stepSim, type EnemyState, type RunState } from "./index";
import { brawler, lost, nextMove } from "./brawlTestUtil";
import { enemy } from "./perkTestUtil";

describe("격투가 전용 아이템", () => {
  it("능력치: 공방일체·취권", () => {
    const base = brawler().player.stats;
    const b = brawler("fist", "balance").player.stats;
    expect(b.damage).toBeCloseTo(base.damage * 1.1);
    expect(b.maxHp).toBeCloseTo(base.maxHp * 1.1);
    const d = brawler("fist", "drunkenFist").player.stats;
    expect([d.maxHp, d.damage]).toEqual([base.maxHp - 30, base.damage + 7]);
  });

  it("마하: 첫 기술을 바로 끝내고 두 번째부터", () => {
    const s = brawler("fist", "mach");
    s.enemies = [enemy(1, 135, 72)];
    nextMove(s);
    expect(s.player.comboStep).toBe(2);
  });

  it("차력쇼: 콤보를 끝까지 3번 이으면 버프", () => {
    const s = brawler("fist", "strongman");
    s.enemies = [enemy(1, 135, 72)];
    for (let k = 0; k < 9; k++) nextMove(s);
    expect(s.player.buffTicks).toBeGreaterThan(0);
    expect(s.player.shieldPts).toBe(20);
  });

  it("속도는 곧 힘: 이어 갈수록 빨라짐", () => {
    const s = brawler("fist", "speedIsPower");
    nextMove(s);
    nextMove(s);
    const x = s.player.x;
    stepSim(s, { ...EMPTY_INPUT, moveX: 100 });
    expect(s.player.x - x).toBeCloseTo(s.player.stats.moveSpeed * 1.16);
  });

  it("혈마: 체력이 적을수록 세짐", () => {
    const hitAt = (hp: number) => {
      const s = brawler("fist", "bloodDemon");
      s.player.hp = hp;
      const e = enemy(1, 140, 72);
      s.enemies = [e];
      nextMove(s);
      return lost(e);
    };
    expect(hitAt(10)).toBeGreaterThan(hitAt(110) * 1.7);
  });

  it("금강불괴·존·위압·K.O는 가끔 터짐", () => {
    const count = (perk: PassiveId, ok: (s: RunState, e: EnemyState) => boolean) => {
      let n = 0;
      for (let k = 0; k < 200; k++) {
        const s = brawler("fist", perk);
        s.tick = k * 7;
        const e = enemy(1, 140, 72);
        s.enemies = [e];
        nextMove(s);
        if (ok(s, e)) n++;
      }
      return n;
    };
    const iron = count("ironBody", (s) => s.player.invulnTicks > 100);
    expect(iron).toBeGreaterThan(10);
    expect(iron).toBeLessThan(60);
    const fear = count("intimidate", (_, e) => (e.fearTicks ?? 0) > 0);
    expect(fear).toBeGreaterThan(30);
    expect(fear).toBeLessThan(100);
    const ko = count("knockout", (_, e) => (e.stunTicks ?? 0) > 100);
    expect(ko).toBeGreaterThan(2);
    expect(ko).toBeLessThan(30);
    expect(count("zone", (s) => (s.player.zoneLeft ?? 0) > 0)).toBeGreaterThan(10);
  });
});
