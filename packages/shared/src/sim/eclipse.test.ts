import { describe, expect, it } from "vitest";
import { ECLIPSE_PASSIVES } from "../itemsEclipse";
import { WEAPONS } from "../content";
import { ECLIPSE as E } from "../weaponsEclipse";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { extraOf } from "./baseStats";
import { critNow } from "./novice";
import { characterWeapons } from "./loot";
import { enemy, FIRE } from "./perkTestUtil";
import { EMPTY_INPUT as IDLE } from "./inputTypes";

function eclipse(...perks: string[]): RunState {
  const s = createRun(7, "eclipse");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 74, 72, 99999), rootTicks: 99999 }];
  return s;
}
/** 적을 제자리에 두고 n틱 (stop: 그만할 때) */
function hold(s: RunState, n: number, stop = () => false, input = FIRE): void {
  const at = s.enemies.map((e) => [e.x, e.y] as const);
  for (let i = 0; i < n && !stop(); i++) {
    stepSim(s, input);
    s.enemies.forEach((e, k) => ([e.x, e.y] = at[k]!));
  }
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const seen = (s: RunState, n: number) => {
  const k = new Set<string>();
  hold(s, n, () => {
    s.effects.forEach((f) => k.add(f.kind));
    return false;
  });
  return k;
};

describe("이클립스", () => {
  it("무기는 태양의 도끼 하나 · 전용 아이템 10 · 태양 모습으로 시작", () => {
    expect(characterWeapons("eclipse")).toEqual(["ecAxe"]);
    expect(WEAPONS.ecAxe).toMatchObject({ kind: "solar", exclusive: "eclipse" });
    expect(Object.keys(ECLIPSE_PASSIVES)).toHaveLength(10);
    expect(createRun(1, "eclipse").player.ecNight).toBeFalsy();
  });

  it("태양: 누를 때마다 직각 검격 하나 · 맞히고 치명타가 있음 · 게이지가 참", () => {
    const one = eclipse();
    for (let i = 0; i < 80; i++) stepSim(one, { ...FIRE, attack: i < 3 });
    expect(one.player.ecCombo).toBeUndefined();
    expect(one.player.attackCount).toBe(1);
    const s = eclipse();
    expect(extraOf(s.player).critChance).toBeCloseTo(E.sunCrit);
    const k = seen(s, 60);
    expect(k.has("ecSlash")).toBe(true);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.player.ecGauge ?? 0).toBeGreaterThan(0);
  });

  it("게이지가 차면 무적으로 바뀌고 일식이 됨 (치명타 없음) · 다시 차면 태양", () => {
    const s = eclipse();
    s.player.ecGauge = E.gaugeMax;
    hold(s, 1);
    expect(s.player.ecShift).toBeGreaterThan(0);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    hold(s, E.shiftTicks + 1, () => !s.player.ecShift);
    expect(s.player.ecNight).toBe(true);
    expect(s.player.ecGauge).toBe(0);
    expect(critNow(s).chance).toBe(0);
    s.player.ecGauge = E.gaugeMax;
    hold(s, 400, () => !!s.player.ecShift);
    hold(s, E.shiftTicks + 2, () => !s.player.ecShift);
    expect(s.player.ecNight).toBe(false);
  });

  it("일식 6연 콤보: 마지막은 뛰어올라(무적) 내려찍고 블랙홀이 남음 · 태양보다 한 번이 아픔", () => {
    const s = eclipse();
    s.player.ecNight = true;
    const k = seen(s, 140);
    for (const f of ["ecHew", "ecSpin", "ecDash", "ecJump", "ecSlam"]) expect(k.has(f)).toBe(true);
    expect(s.player.ecSlams).toBe(1);
    const sun = eclipse();
    const night = eclipse();
    night.player.ecNight = true;
    expect(night.player.stats.damage * E.nightDmg).toBeGreaterThan(sun.player.stats.damage * E.sunDmg * 2);
  });

  it("블랙홀이 둘레 적을 끌어당김", () => {
    const s = eclipse();
    s.player.ecHoles = [{ x: 50, y: 72, t: 60, max: 60, r: 40, pull: 96, dmg: 1 }];
    s.enemies = [enemy(1, 110, 72, 99999)];
    const x0 = s.enemies[0]!.x;
    for (let i = 0; i < 10; i++) stepSim(s, IDLE);
    expect(s.enemies[0]!.x).toBeLessThan(x0);
  });

  it("영역: 태양은 치유의 빛으로 회복, 일식은 죽음의 영역으로 느리게 함", () => {
    const s = eclipse("ecDawn");
    s.player.hp = 10;
    for (let i = 0; i < 130; i++) stepSim(s, IDLE);
    expect(s.player.hp).toBeGreaterThan(10);
    const n = eclipse();
    n.player.ecNight = true;
    for (let i = 0; i < 25; i++) stepSim(n, IDLE);
    expect(n.enemies[0]!.slowTicks ?? 0).toBeGreaterThan(0);
  });

  it("개기일식: 바뀌는 순간 둘레 적에게 피해 · 헬리오스의 왕관: 바뀐 뒤 공격력 +", () => {
    const s = eclipse("ecTotality", "ecCrown");
    s.player.ecGauge = E.gaugeMax;
    hold(s, E.shiftTicks + 3, () => s.player.ecShifts === 1, IDLE);
    const before = lost(s);
    hold(s, 2, () => false, IDLE);
    expect(s.player.ecShifts).toBe(1);
    expect(before).toBeGreaterThan(0);
    expect(s.player.ecCrownT ?? 0).toBeGreaterThan(0);
  });

  it("같은 시드면 같은 결과", () => {
    const a = eclipse("ecFlare", "ecHorizon");
    const b = eclipse("ecFlare", "ecHorizon");
    hold(a, 400);
    hold(b, 400);
    expect(lost(a)).toBe(lost(b));
    expect(a.player.ecGauge).toBe(b.player.ecGauge);
  });
});
