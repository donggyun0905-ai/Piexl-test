import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponDef, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { ONI } from "../weaponsOni";
import { damagePlayer } from "./combat";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { equipWeapon, recalcStats } from "./items";
import { passivePool, spawnTreasure, weaponPool } from "./loot";
import { enemy } from "./perkTestUtil";

/** 오니로 시작, 오른쪽에 허수아비 */
function oni(weapon: WeaponId = "thunderClub", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "oni");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 100;
  s.enemies = [{ ...enemy(1, 140, 100, 999999), kind: "dummy" as const, anchor: [140, 100] as [number, number] }];
  return s;
}
const AIM = { ...EMPTY_INPUT, aimX: 100, aimY: 0 };
function hit(s: RunState): void {
  for (let i = 0; i < 400 && s.player.attackCooldown > 0; i++) stepSim(s, AIM);
  stepSim(s, { ...AIM, attack: true });
}
const lost = (s: RunState) => s.enemies[0]!.maxHp - s.enemies[0]!.hp;
const oniWeapons = () => Object.keys(WEAPONS).filter((w) => (WEAPONS[w as WeaponId] as WeaponDef).exclusive === "oni") as WeaponId[];

describe("오니", () => {
  it("전용 방망이 10개 · 명뢰봉으로 시작 · 공격력 36 · 느린 공격", () => {
    expect(oniWeapons()).toHaveLength(10);
    expect(CHARACTERS.oni.startWeapon).toBe("thunderClub");
    const s = oni();
    expect(s.player.stats.damage).toBe(36);
    hit(s);
    expect(lost(s)).toBeGreaterThanOrEqual(36);
    expect(s.player.attackCooldown).toBeGreaterThan(60);
  });

  it("공격력 아이템은 최대 체력으로 · 공격 속도는 재생력으로 · 사거리는 효과 범위로만", () => {
    const base = oni();
    const s = oni("thunderClub", "whetstone", "lightGloves", "longGrip");
    expect(s.player.stats.damage).toBe(36);
    expect(s.player.stats.maxHp).toBe(base.player.stats.maxHp + 3 * ONI.hpPerDamage);
    expect(s.player.oRegen).toBeCloseTo(ONI.regenBase + 15);
    expect(s.player.stats.range).toBe(base.player.stats.range);
    expect(s.player.oReach).toBeCloseTo(1.2);
  });

  it("받는 피해 +30%", () => {
    const s = oni();
    s.player.invulnTicks = 0;
    const hp = s.player.hp;
    damagePlayer(s, 10);
    expect(hp - s.player.hp).toBeCloseTo(13);
  });

  it("25번 휘두르면 30초 신인족 (공격력 +45% · 최대 체력 +50%), 끝나면 돌아옴", () => {
    const s = oni();
    const hp = s.player.stats.maxHp;
    for (let i = 0; i < ONI.gaugeMax; i++) hit(s);
    expect(s.player.oGod).toBeGreaterThan(0);
    expect(s.player.stats.damage).toBeCloseTo(36 * ONI.godDamage);
    expect(s.player.stats.maxHp).toBeCloseTo(hp * ONI.godHp);
    for (let i = 0; i < ONI.godTicks + 5; i++) stepSim(s, AIM);
    expect(s.player.oGod ?? 0).toBe(0);
    expect(s.player.stats.damage).toBe(36);
  });

  it("신인족이면 무기마다 추가 공격이 늘 나가고 속성 피해가 들어감", () => {
    for (const id of oniWeapons()) {
      const s = oni(id);
      s.gold = 100;
      s.player.oGod = 600;
      recalcStats(s);
      hit(s);
      const first = lost(s);
      for (let i = 0; i < 400; i++) stepSim(s, AIM);
      expect(lost(s), id).toBeGreaterThan(Math.min(first, s.player.stats.damage));
      if (id === "goldClub") expect(s.gold).toBeLessThan(100);
    }
  });

  it("흑뢰봉·청전은 한 번 되살아나고 체력 400 / 재생력 60 이상일 때만 나옴", () => {
    const s = oni();
    expect(weaponPool(s)).not.toContain("blackThunder");
    s.player.revived = true;
    s.player.passives.push(...Array<PassiveId>(20).fill("sturdyHeart"), ...Array<PassiveId>(2).fill("lightGloves"));
    recalcStats(s);
    expect(s.player.stats.maxHp).toBeGreaterThanOrEqual(400);
    expect(weaponPool(s)).toContain("blackThunder");
    expect(weaponPool(s)).not.toContain("azureThunder");
    s.player.passives.push(...Array<PassiveId>(6).fill("lightGloves"));
    recalcStats(s);
    expect(s.player.oRegen).toBeGreaterThanOrEqual(60);
    expect(weaponPool(s)).toContain("azureThunder");
  });

  it("금봉: 보물방에 들어가면 체력 가득 + 돈 50", () => {
    const s = oni("goldClub");
    s.player.hp = 10;
    const gold = s.gold;
    spawnTreasure(s, 0);
    expect(s.player.hp).toBe(s.player.stats.maxHp);
    expect(s.gold).toBe(gold + ONI.gold.roomGold);
  });

  it("무기 전용 아이템은 그 무기를 들었을 때만, 행운이 높으면 더 자주", () => {
    const s = oni("thunderClub");
    const pool = passivePool(s);
    expect(pool).toContain("oniJudgment");
    expect(pool).not.toContain("oniGale");
    const count = (p: PassiveId[]) => p.filter((x) => x === "oniJudgment").length;
    s.player.passives.push("goldTooth", "goldTooth");
    recalcStats(s);
    expect(count(passivePool(s))).toBeGreaterThan(count(pool));
    equipWeapon(s, "genesisPillar");
    expect(passivePool(s).some((id) => id.startsWith("oni"))).toBe(false);
  });

  it("금봉: 상점 물건을 못 사고 다른 무기를 못 잡음", () => {
    const s = oni("goldClub");
    const p = s.player;
    s.gold = 999;
    s.rooms[s.roomId]!.pickups.push({ id: 900, kind: "passive", itemId: "whetstone", x: p.x, y: p.y, group: 0, armed: true, price: 10 });
    stepSim(s, { ...EMPTY_INPUT, interact: true });
    expect(p.passives).not.toContain("whetstone");
    s.rooms[s.roomId]!.pickups = [{ id: 901, kind: "weapon", itemId: "frostClub", x: p.x, y: p.y, group: 0, armed: true, price: 0 }];
    stepSim(s, { ...EMPTY_INPUT, interact: true });
    expect(p.weaponId).toBe("goldClub");
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const s = oni("windClub", "oniTwinWind");
      s.player.oGod = 300;
      for (let i = 0; i < 900; i++) stepSim(s, { ...AIM, attack: true });
      return JSON.stringify(s);
    };
    expect(go()).toBe(go());
  });
});
