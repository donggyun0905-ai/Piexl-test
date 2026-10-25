import { describe, expect, it } from "vitest";
import { ARTIFACTER, AUTOMATA, CHARACTER_IDS, PUNK, RIDER, type WeaponId } from "../content";
import { EMPTY_INPUT } from "./inputTypes";
import { ARTIFACTER_HIDDEN } from "../itemsArtifacter";
import type { CharacterId } from "../characters";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, stepSim, type RunState } from "./index";
import { characterWeapons, passivePool } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { riderSpeedMul } from "./rider";

function run(c: CharacterId, weapon: WeaponId, ...perks: PassiveId[]): RunState {
  const s = createRun(7, c);
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 80 + i * 10, 72, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("테라코어 시즌 2", () => {
  it("오토마타·라이더: 무기 10 · 전용 아이템 10", () => {
    for (const c of ["automata", "rider"] as const) {
      expect(CHARACTER_IDS).toContain(c);
      expect(characterWeapons(c)).toHaveLength(10);
      expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === c)).toHaveLength(10);
    }
  });

  it("모든 무기가 피해를 줌", () => {
    for (const c of ["automata", "rider"] as const) {
      for (const w of characterWeapons(c)) {
        const s = run(c, w);
        for (let i = 0; i < 120; i++) stepSim(s, FIRE);
        expect(lost(s), w).toBeGreaterThan(0);
      }
    }
  });

  it("자매 인형 셋이 곁에서 함께 쏨", () => {
    const s = run("automata", "adSisters");
    for (let i = 0; i < 90; i++) stepSim(s, FIRE);
    expect(s.player.adDolls).toHaveLength(3);
  });

  it("미사일 포드: 등 뒤에서 유도 미사일이 7발 넘게", () => {
    const s = run("automata", "adArsenal");
    let most = 0;
    for (let i = 0; i < 120; i++) {
      stepSim(s, FIRE);
      most = Math.max(most, s.projectiles.filter((p) => p.spirit === "adMissile").length);
    }
    expect(most).toBeGreaterThanOrEqual(7);
    expect(AUTOMATA.missileExtra).toBeGreaterThan(0);
  });

  it("라이더: 달리면 피해가 커지고, 게이지가 차면 펄스", () => {
    const s = run("rider", "rdHammer");
    const still = riderSpeedMul(s.player);
    s.player.prevX = s.player.x - 2;
    expect(riderSpeedMul(s.player)).toBeGreaterThan(still);
    s.player.rdGauge = RIDER.gaugeMax - 1;
    const before = lost(s);
    for (let i = 0; i < 10; i++) stepSim(s, { ...FIRE, attack: false, moveX: 100 });
    expect(lost(s)).toBeGreaterThan(before);
    expect(s.player.rdGauge ?? 0).toBeLessThan(RIDER.gaugeMax);
  });

  it("붐버: 무기 10 · 아이템 10 · 모든 무기가 터져 피해, 잇따라 터지면 예술 연쇄", () => {
    expect(characterWeapons("bomber")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "bomber")).toHaveLength(10);
    for (const w of characterWeapons("bomber")) {
      const s = run("bomber", w);
      // 지뢰는 밟아야 터짐
      if (w === "bmMine") s.enemies[0]!.x = s.enemies[0]!.prevX = 56;
      for (let i = 0; i < 180; i++) stepSim(s, FIRE);
      expect(lost(s), w).toBeGreaterThan(0);
    }
    const s = run("bomber", "bmFirework");
    let art = 0;
    for (let i = 0; i < 180; i++) {
      stepSim(s, FIRE);
      art = Math.max(art, s.player.bmArt ?? 0);
    }
    expect(art).toBeGreaterThan(0);
  });

  it("아티팩터: 리펄스 총 하나 · 아이템 10 + 숨겨진 5 (보상에는 안 나옴) · 쓰러뜨리면 제작", () => {
    expect(characterWeapons("artifacter")).toEqual(["afRepulsor"]);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "artifacter")).toHaveLength(15);
    const s = run("artifacter", "afRepulsor");
    for (const id of ARTIFACTER_HIDDEN) expect(passivePool(s)).not.toContain(id);
    s.enemies = Array.from({ length: ARTIFACTER.craftEvery }, (_, i) => ({ ...enemy(i + 1, 75 + (i % 3) * 3, 72 + ((i % 5) - 2) * 3, 1), rootTicks: 99999 }));
    const n = s.player.passives.length;
    for (let i = 0; i < 400 && s.enemies.some((e) => e.hp > 0); i++) stepSim(s, FIRE);
    expect(s.player.passives.length).toBeGreaterThan(n);
  });

  it("펑크: 무기 10 · 능력 10 · 모든 무기가 피해", () => {
    expect(characterWeapons("punk")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "punk")).toHaveLength(10);
    for (const w of characterWeapons("punk")) {
      const s = run("punk", w);
      for (let i = 0; i < 120; i++) stepSim(s, FIRE);
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });

  it("펑크 신경 가속: 게이지가 가득일 때 대시하면 켜지고 적 탄이 느려짐", () => {
    const s = run("punk", "cyKatana");
    s.player.cyGauge = PUNK.gaugeMax;
    s.projectiles.push({ id: 999, fromPlayer: false, x: 120, y: 72, prevX: 120, prevY: 72, r: 2, vx: -2, vy: 0, damage: 1, ticksLeft: 200 });
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    stepSim(s, EMPTY_INPUT);
    expect(s.player.cyAccel ?? 0).toBeGreaterThan(0);
    expect(Math.abs(s.projectiles.find((p) => p.id === 999)!.vx)).toBeLessThan(2);
  });
});
