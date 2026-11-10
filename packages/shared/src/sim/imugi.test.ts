import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponId } from "../content";
import { PASSIVES, type PassiveId } from "../items";
import { IMUGI } from "../weaponsImugi";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { addCombo } from "./imugi";
import { imugiCrit } from "./imugiMods";
import { enemy, FIRE } from "./perkTestUtil";

/** 이무기로 시작해 무기·아이템을 가진 채, 적 없는 방 (오른쪽을 봄) */
function imugi(weapon: WeaponId = "imugiSpear", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "imugi");
  s.noFaction = true;
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 72;
  return s;
}
const attackOnce = (s: RunState) => {
  const n = s.player.attackCount;
  for (let i = 0; i < 200 && s.player.attackCount === n; i++) stepSim(s, FIRE);
};
const step = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, EMPTY_INPUT);
};
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("이무기", () => {
  it("창으로 시작, 무기 11개(여의주 포함) · 전용 아이템 10개", () => {
    expect(CHARACTERS.imugi.startWeapon).toBe("imugiSpear");
    expect(characterWeapons("imugi")).toHaveLength(11);
    expect(Object.values(PASSIVES).filter((d) => "exclusive" in d && d.exclusive === "imugi")).toHaveLength(11);
  });

  it("찌르기(멀리 앞)와 휘두르기(옆)가 한 번에 · 맞히면 콤보 +1", () => {
    const s = imugi();
    s.enemies = [enemy(1, 60 + 44, 72), enemy(2, 60 + 20, 72 + 26)];
    attackOnce(s);
    expect(s.enemies.every((e) => e.hp < e.maxHp)).toBe(true);
    expect(s.player.imCombo).toBe(1);
  });

  it("콤보 72: 오라 (공격력·체력·이동·공격 속도, 보호막 20) · 108: 용이 맵 아래에서 위로 지나가며 450% + 8초 동안 더 강한 몸, 콤보 20부터", () => {
    const s = imugi();
    const base = { ...s.player.stats };
    addCombo(s, 71);
    expect(s.player.stats.damage).toBeCloseTo(base.damage);
    addCombo(s, 1);
    expect(s.player.stats.damage).toBeCloseTo(base.damage * IMUGI.auraDamage);
    expect(s.player.stats.maxHp).toBe(base.maxHp + IMUGI.auraHp);
    expect(s.player.shieldPts).toBe(IMUGI.auraShield);
    s.enemies = [enemy(1, 200, 100), enemy(2, 220, 40)];
    addCombo(s, 36);
    expect(s.player.imCombo).toBe(IMUGI.restart);
    // 용이 된 몸: 오라보다 강함, 보호막 40 더
    expect(s.player.stats.damage).toBeCloseTo(base.damage * IMUGI.form.damage);
    expect(s.player.stats.attackSpeed).toBeGreaterThan(base.attackSpeed * IMUGI.auraSpeed);
    // 보호막은 쌓이지 않고 40으로 채워짐
    expect(s.player.shieldPts).toBe(IMUGI.form.shield);
    const formDmg = s.player.stats.damage;
    // 아래쪽 적(y 100)이 먼저, 위쪽 적(y 40)이 나중에 맞음
    for (let i = 0; i < 400 && s.enemies[0]!.hp === s.enemies[0]!.maxHp; i++) step(s, 1);
    expect(s.enemies[1]!.hp).toBe(s.enemies[1]!.maxHp);
    step(s, 200);
    for (const e of s.enemies) expect(e.maxHp - e.hp).toBeCloseTo(formDmg * IMUGI.ultMul + e.maxHp * IMUGI.ultHp, 1);
    expect(s.player.imUlt).toBeUndefined();
    // 8초 뒤 몸 강화가 끝남
    step(s, IMUGI.form.ticks);
    expect(s.player.stats.damage).toBeCloseTo(base.damage);
  });

  it("콤보는 방·층을 넘어가도 이어짐 · 여의주는 방 안 모든 적을 때리지만 콤보에 안 셈", () => {
    const s = imugi("dragonPearl");
    s.player.imCombo = 30;
    s.enemies = [enemy(1, 200, 100), enemy(2, 30, 120)];
    attackOnce(s);
    expect(s.enemies.every((e) => e.hp < e.maxHp)).toBe(true);
    expect(s.player.imCombo).toBe(30);
  });

  it("무기별 추가 공격: 청룡 번개 5번 · 사룡 독이 겹침 · 토룡 보호막", () => {
    const a = imugi("azureDragon");
    a.enemies = [enemy(1, 100, 72)];
    attackOnce(a);
    const first = lost(a);
    step(a, 40);
    expect(lost(a) - first).toBeCloseTo(a.player.stats.damage * IMUGI.azure.mul * IMUGI.azure.bolts, 1);
    const v = imugi("venomDragon");
    v.enemies = [enemy(1, 100, 72)];
    attackOnce(v);
    attackOnce(v);
    expect(v.enemies[0]!.imVenomStacks).toBe(2);
    const e = imugi("earthDragon");
    e.enemies = [enemy(1, 100, 72)];
    attackOnce(e);
    expect(e.player.shieldPts).toBeCloseTo(e.player.stats.damage * IMUGI.earth.shield);
    expect(e.enemies[0]!.sluggish).toBeGreaterThan(0);
    // 토룡 보호막은 최대 10, 공격력 보너스는 토룡 보호막만 셈 (오라·용 보호막은 빼고)
    e.player.shieldPts = 60;
    // 걸어오지 않게 묶어 둔 적 (부딪혀 보호막이 깎이지 않게)
    e.enemies = [{ ...enemy(2, 100, 72, 1e6), rootTicks: 99999 }];
    for (let i = 0; i < 60; i++) {
      // 밀려난 적을 제자리로
      Object.assign(e.enemies[0]!, { x: 100, prevX: 100, y: 72, prevY: 72 });
      attackOnce(e);
    }
    expect(e.player.imEarth).toBeCloseTo(IMUGI.earth.shieldMax);
    // 다른 보호막 위에는 쌓이지 않음
    expect(e.player.shieldPts).toBe(60);
  });

  it("화룡점정: 여의주를 물었을 때만 번개 공격 속도 +45% · 번개마다 적 최대 체력 1.5%", () => {
    const plain = imugi("dragonPearl");
    const eye = imugi("dragonPearl", "dragonEye");
    expect(eye.player.stats.attackSpeed).toBeCloseTo(plain.player.stats.attackSpeed * 1.45);
    expect(imugi("imugiSpear", "dragonEye").player.stats.attackSpeed).toBeCloseTo(imugi().player.stats.attackSpeed);
    for (const s of [plain, eye]) {
      s.enemies = [enemy(1, 200, 100, 1000)];
      attackOnce(s);
      // 화룡점정 번개는 여러 번으로 나눠 빠르게 들어감
      step(s, IMUGI.pearl.hits * IMUGI.pearl.every);
    }
    expect(lost(eye) - lost(plain)).toBeCloseTo(1000 * 0.015);
  });

  it("용을 부를 때마다 영구 치명타 +15% (콤보가 다시 시작해도 남음, 최대 72%)", () => {
    const s = imugi();
    expect(imugiCrit(s.player)).toBe(0);
    addCombo(s, IMUGI.ult);
    expect(imugiCrit(s.player)).toBeCloseTo(0.15);
    for (let i = 0; i < 6; i++) addCombo(s, IMUGI.ult);
    expect(imugiCrit(s.player)).toBeCloseTo(0.72);
    // 치명타가 실제로 터짐 (1.5배) · 지나가는 용·용이 된 몸은 치워 둠
    s.player.imUlt = undefined;
    s.player.imForm = 0;
    recalcStats(s);
    // 걸어오지 않게 묶어 둔 튼튼한 적 (보호막이 쌓이지 않아 부딪히면 쓰러질 수 있음)
    s.enemies = [{ ...enemy(1, 100, 72, 1e6), rootTicks: 99999 }];
    const hits: number[] = [];
    for (let i = 0; i < 20; i++) {
      Object.assign(s.enemies[0]!, { x: 100, prevX: 100, y: 72, prevY: 72, kbT: 0, kbCd: 0 });
      const before = s.enemies[0]!.hp;
      attackOnce(s);
      hits.push(before - s.enemies[0]!.hp);
    }
    expect(Math.max(...hits) / Math.min(...hits)).toBeCloseTo(IMUGI.critMul, 1);
  });

  it("무기는 모두 이무기 전용, 공격 방식 dragon", () => {
    for (const id of characterWeapons("imugi")) expect(WEAPONS[id].kind).toBe("dragon");
  });
});
