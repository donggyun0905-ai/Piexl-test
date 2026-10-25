import { describe, expect, it } from "vitest";
import { CHARACTERS, ENEMIES, WEAPONS } from "../content";
import { PASSIVES } from "../items";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { passivePool, spawnBlessing, weaponPool } from "./loot";
import { damageEnemy } from "./combat";
import { expOf, expToNext, gainExp, noviceCrit, NOVICE_CRIT, NOVICE_CRIT_MUL } from "./novice";
import { enemy } from "./perkTestUtil";

describe("풋내기", () => {
  it("맨손으로 시작, 공용 무기(근접·원거리) 10개와 공용 패시브만", () => {
    const s = createRun(3, "novice");
    expect(CHARACTERS.novice.startWeapon).toBe("fists");
    const weapons = weaponPool(s, true);
    expect(weapons).toHaveLength(10);
    for (const id of weapons) expect(WEAPONS[id]).not.toHaveProperty("exclusive");
    expect(new Set(weapons.map((id) => WEAPONS[id].kind))).toEqual(new Set(["melee", "ranged"]));
    for (const id of passivePool(s)) expect(PASSIVES[id]).not.toHaveProperty("exclusive");
    // 여신의 축복은 던전 보상·상점에는 나오지 않고, 라스트 보스 층 시작 방에만 하나 놓임 (다른 캐릭터와 같음)
    expect(passivePool(s)).not.toContain("goddessBlessing");
    s.rooms[0]!.pickups = [];
    spawnBlessing(s, 0);
    expect(s.rooms[0]!.pickups.map((pk) => pk.itemId)).toEqual(["goddessBlessing"]);
  });

  it("적을 쓰러뜨리면 경험치(기본 체력 ÷ 10), 다 차면 레벨·스탯 포인트", () => {
    const s = createRun(3, "novice");
    const e = enemy(1, 0, 0);
    expect(expOf(e)).toBe(Math.ceil(ENEMIES.crawler.hp / 10));
    const hp = s.player.stats.maxHp;
    const dmg = s.player.stats.damage;
    for (let i = 0; i < 4; i++) gainExp(s, e);
    expect(s.player.lv).toBe(2);
    // 레벨마다 저절로: 최대 체력 +3, 공격력 +2%
    expect(s.player.stats.maxHp).toBe(hp + 3);
    expect(s.player.stats.damage).toBeCloseTo(dmg * 1.02, 5);
    expect(s.player.points).toBe(1);
    expect(s.player.exp).toBe(4 * expOf(e) - expToNext(1));
    // 다른 캐릭터는 경험치를 받지 않음
    const w = createRun(3, "warden");
    gainExp(w, e);
    expect(w.player.lv).toBeUndefined();
  });

  it("스탯 찍기 (입력 statPick): 포인트를 쓰고 능력치가 오름", () => {
    const s = createRun(3, "novice");
    s.enemies = [];
    s.player.points = 2;
    const dmg = s.player.stats.damage;
    const hp = s.player.stats.maxHp;
    stepSim(s, { ...EMPTY_INPUT, statPick: 1 });
    stepSim(s, { ...EMPTY_INPUT, statPick: 3 });
    expect(s.player.points).toBe(0);
    expect(s.player.stats.damage).toBeCloseTo(dmg * 1.06, 5);
    expect(s.player.stats.maxHp).toBe(hp + 12);
    // 포인트가 없으면 아무 일 없음
    stepSim(s, { ...EMPTY_INPUT, statPick: 1 });
    expect(s.player.stats.damage).toBeCloseTo(dmg * 1.06, 5);
  });

  it("치명타 확률·피해: 기본 5%·150%, 찍으면 오르고 피해에 반영 (풋내기만)", () => {
    const s = createRun(3, "novice");
    expect(noviceCrit(s.player)).toEqual({ chance: NOVICE_CRIT, mul: NOVICE_CRIT_MUL });
    s.player.points = 20;
    for (let i = 0; i < 16; i++) stepSim(s, { ...EMPTY_INPUT, statPick: 8 });
    stepSim(s, { ...EMPTY_INPUT, statPick: 9 });
    stepSim(s, { ...EMPTY_INPUT, statPick: 9 });
    expect(noviceCrit(s.player).chance).toBe(1);
    expect(noviceCrit(s.player).mul).toBeCloseTo(1.9, 5);
    const e = enemy(1, 0, 0, 1000);
    damageEnemy(s, e, 10, 0, 0);
    expect(e.maxHp - e.hp).toBeCloseTo(19, 5);
    // 다른 캐릭터는 치명타 없음
    const w = createRun(3, "warden");
    const f = enemy(2, 0, 0, 1000);
    damageEnemy(w, f, 10, 0, 0);
    expect(f.maxHp - f.hp).toBe(10);
  });
});
