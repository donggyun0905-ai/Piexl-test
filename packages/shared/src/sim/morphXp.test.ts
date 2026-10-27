import { describe, expect, it } from "vitest";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { passivePool } from "./loot";
import { evolvedAnimals, evoTaken, MORPH_EVO } from "./morphEvo";
import { animalPassives, MORPH_XP_RULES, morphKill, morphXp } from "./morphXp";
import { removeDead } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";

function morph(weapon = "wolfForm", perks: string[] = []): RunState {
  const s = createRun(3, "byeonhui");
  s.player.weaponId = weapon as never;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  s.enemies = [];
  return s;
}

describe("변희 동물 경험치", () => {
  it("동물 전용 능력은 상점·보물방에서 나오지 않음", () => {
    const s = morph();
    for (const id of animalPassives("wolfForm")) expect(passivePool(s)).not.toContain(id);
  });

  it("사냥하면 그 동물 경험치 (일반 3 · 보스 20), 100이면 그 동물 능력 하나", () => {
    const s = morph();
    const kills = Math.ceil(MORPH_XP_RULES.FULL / MORPH_XP_RULES.KILL);
    for (let i = 0; i < kills - 1; i++) morphKill(s, enemy(i + 1, 0, 0));
    expect(morphXp(s.player)!.fill).toBeCloseTo(((kills - 1) * MORPH_XP_RULES.KILL) / MORPH_XP_RULES.FULL);
    expect(morphKill(s, enemy(99, 0, 0))).toBe(true);
    const got = s.player.passives.filter((id) => animalPassives("wolfForm").includes(id));
    expect(got).toHaveLength(1);
    // 보스는 한 번에 20
    const b = morph();
    morphKill(b, { ...enemy(1, 0, 0), kind: "hulk" as const });
    expect(b.player.mXp?.wolf).toBe(MORPH_XP_RULES.BOSS);
  });

  it("실제로 쓰러뜨리면 경험치가 참 (removeDead)", () => {
    const s = morph();
    s.enemies = [{ ...enemy(1, 70, 72, 1), hp: 0 }];
    removeDead(s);
    expect(s.player.mXp?.wolf).toBe(MORPH_XP_RULES.KILL);
  });

  it("각성하면 방어력 20 · 공격 속도 +25%", () => {
    const plain = morph("wolfForm", ["wolfFang"]);
    const evo = morph("wolfForm", animalPassives("wolfForm"));
    expect(evoTaken(evo.player)).toBeCloseTo(1 - MORPH_EVO.def / 100);
    expect(evo.player.stats.attackSpeed).toBeCloseTo(plain.player.stats.attackSpeed * MORPH_EVO.speed);
  });

  it("다른 동물로 바꿔도 얻은 능력과 이전 각성 기술은 그대로", () => {
    const s = morph("wolfForm", animalPassives("wolfForm"));
    s.player.weaponId = "bearForm";
    recalcStats(s);
    expect(evolvedAnimals(s.player)).toEqual(["wolf"]);
    for (const id of animalPassives("wolfForm")) expect(s.player.passives).toContain(id);
  });

  it("각성 불사조: 둘레 열기로 불꽃이 겹겹이 (최대 5)", () => {
    const s = morph("phoenixForm", animalPassives("phoenixForm"));
    s.enemies = [{ ...enemy(1, 80, 72, 99999), rootTicks: 99999 }];
    s.player.mHeat = MORPH_EVO.heatTicks;
    for (let i = 0; i < MORPH_EVO.heatEvery * 6; i++) stepSim(s, { ...FIRE, attack: false });
    expect(s.enemies[0]!.flameN).toBe(5);
    expect(s.enemies[0]!.burnTicks ?? 0).toBeGreaterThan(0);
  });
});
