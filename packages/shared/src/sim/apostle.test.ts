import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponId } from "../content";
import { PASSIVES, type PassiveId } from "../items";
import { APOSTLE } from "../weaponsApostle";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

/** 악의 사도로 시작해 무기·아이템을 가진 채, 적 없는 방 (오른쪽을 봄) */
function apostle(weapon: WeaponId = "invertedCross", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "apostle");
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
  for (let i = 0; i < 300 && s.player.attackCount === n; i++) stepSim(s, FIRE);
};
const step = (s: RunState, n: number, input = EMPTY_INPUT) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};
/** 걸어오지 않게 묶어 둔 적 */
const held = (id: number, x: number, y: number, hp?: number) => ({ ...enemy(id, x, y, hp), rootTicks: 99999 });
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("악의 사도", () => {
  it("뒤집힌 십자가 목걸이로 시작, 무기 10개 · 전용 아이템 10개", () => {
    expect(CHARACTERS.apostle.startWeapon).toBe("invertedCross");
    expect(characterWeapons("apostle")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((d) => "exclusive" in d && d.exclusive === "apostle")).toHaveLength(10);
    for (const id of characterWeapons("apostle")) expect(WEAPONS[id].kind).toBe("cross");
  });

  it("십자가가 적 위로 떨어져 잠시 뒤 짓누름", () => {
    const s = apostle();
    s.enemies = [enemy(1, 140, 72)];
    attackOnce(s);
    expect(lost(s)).toBe(0);
    step(s, APOSTLE.drop + 1);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("일곱 죄 십자가는 피해 없이 장판: 분노는 화상 · 탐식은 방어력을 깎음 · 나태는 쌓이면 잠", () => {
    const w = apostle("wrathCross");
    w.enemies = [held(1, 140, 72)];
    attackOnce(w);
    step(w, APOSTLE.drop + 2);
    expect(w.player.apFields).toHaveLength(1);
    step(w, 31);
    expect(w.enemies[0]!.burnTicks).toBeGreaterThan(0);
    const g = apostle("gluttonyCross");
    g.enemies = [held(1, 140, 72)];
    attackOnce(g);
    step(g, APOSTLE.drop + 200);
    expect(g.enemies[0]!.apDef).toBeCloseTo(APOSTLE.gluttony.maxDef);
    const z = apostle("slothCross");
    z.enemies = [held(1, 140, 72)];
    attackOnce(z);
    step(z, APOSTLE.drop + 30 * APOSTLE.sloth.stacks + 2);
    expect(z.enemies[0]!.stunTicks).toBeGreaterThan(0);
  });

  it("회복약은 오히려 피해 · 쓰러진 적의 영혼을 먹으면 최대 체력 10% 회복", () => {
    const s = apostle();
    s.player.useSlots = ["potion", null];
    const hp = s.player.hp;
    stepSim(s, { ...EMPTY_INPUT, useSlot: 1 });
    expect(s.player.hp).toBeLessThan(hp);
    s.enemies = [enemy(1, 140, 72, 1)];
    attackOnce(s);
    step(s, APOSTLE.drop + 2);
    expect(s.player.apSouls).toHaveLength(1);
    const before = s.player.hp;
    const soul = s.player.apSouls![0]!;
    s.player.x = s.player.prevX = soul.x;
    s.player.y = s.player.prevY = soul.y;
    const dmg = s.player.stats.damage;
    step(s, 1);
    expect(s.player.apSouls).toHaveLength(0);
    expect(s.player.hp).toBeCloseTo(before + s.player.stats.maxHp * APOSTLE.soulHeal);
    // 먹은 영혼 하나마다 공격력 +0.01
    expect(s.player.apEaten).toBe(1);
    expect(s.player.stats.damage).toBeCloseTo(dmg + APOSTLE.soulDamage);
  });

  it("사탄의 가면: 근처 적에게 잠시 뒤 죽음 (최대 체력 5% + 공격력 10%)", () => {
    const s = apostle("satanMask");
    s.enemies = [enemy(1, 100, 72, 1000)];
    attackOnce(s);
    step(s, APOSTLE.mask.rise + 1);
    expect(lost(s)).toBeCloseTo(1000 * APOSTLE.mask.pct + s.player.stats.damage * APOSTLE.mask.mul);
    // 먹은 영혼으로 오른 공격력과 같은 비율로 공격 속도도 오름
    const speed = s.player.stats.attackSpeed;
    s.player.apEaten = 10;
    recalcStats(s);
    const k = 1 + (10 * APOSTLE.maskSoulDamage) / CHARACTERS.apostle.damage;
    expect(s.player.stats.attackSpeed).toBeCloseTo(Math.min(10, speed * k));
  });

  it("역천의 베드로: 공격력 + 내 최대 체력의 10%", () => {
    const s = apostle("heresyPeter");
    s.enemies = [enemy(1, 80, 72)];
    attackOnce(s);
    expect(s.enemies[0]!.maxHp - s.enemies[0]!.hp).toBeCloseTo(s.player.stats.damage + s.player.stats.maxHp * APOSTLE.heresy.hpMul);
  });
});
