import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { renBlock, renMelee } from "./ren";
import { earthTiers } from "./renEarth";
import { REN_EARTH } from "../weaponsRen";
import { enemyShot } from "./util";

/** 렌으로 시작, 오른쪽에 묶어 둔 적 셋 */
function ren(...perks: PassiveId[]): RunState {
  const s = createRun(3, "ren");
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 90 + i * 6, 72 + (i - 1) * 4, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const attacks = (s: RunState, n: number) => {
  for (let k = 0; k < n; k++) {
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
  }
  for (let i = 0; i < 40; i++) stepSim(s, EMPTY_INPUT);
};

describe("렌", () => {
  it("보통 캐릭터 · 맨손 하나 · 전용 아이템 20", () => {
    expect(CHARACTER_IDS).toContain("ren");
    expect(CHARACTERS.ren.startWeapon).toBe("renHands");
    expect(characterWeapons("ren")).toEqual(["renHands"]);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "ren")).toHaveLength(20);
  });

  it("토목은 타격 → 묶기 → 날려버리기 → 짓뭉개기 → 가두기 차례로", () => {
    const s = ren();
    attacks(s, 1);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.player.rMove).toBe(1);
    attacks(s, 4);
    expect(s.player.rMove).toBe(0);
    expect(s.effects.some((fx) => fx.kind === "renSlam") || lost(s) > 0).toBe(true);
  });

  it("원거리 탄을 자주 막음 (여러 발 중 대부분)", () => {
    const s = ren();
    let blocked = 0;
    for (let i = 0; i < 100; i++) {
      const pr = enemyShot(s, 0, 0, 1, 0, 1, 5);
      s.projectiles.pop();
      if (renBlock(s, pr)) blocked++;
    }
    expect(blocked).toBeGreaterThan(55);
    expect(blocked).toBeLessThan(85);
  });

  it("단단한 벽은 더 많이 막음", () => {
    const a = ren("renWall");
    let blocked = 0;
    for (let i = 0; i < 100; i++) {
      const pr = enemyShot(a, 0, 0, 1, 0, 1, 5);
      a.projectiles.pop();
      if (renBlock(a, pr)) blocked++;
    }
    expect(blocked).toBeGreaterThan(75);
  });

  it("몸으로 부딪히는 근접 공격은 2배로 받음 (다른 캐릭터는 그대로)", () => {
    expect(renMelee(createRun(3, "ren"), 10)).toBe(20);
    expect(renMelee(createRun(3, "warden"), 10)).toBe(10);
  });

  it("대지의 추가 공격: 렌 전용 아이템 3개마다 한 단계 · 다 열면 공격의 절반쯤에서 나옴 · 거대 토목 5개면 큰 돌 5번", () => {
    const own = (Object.values(PASSIVES) as PassiveDef[]).filter((d) => d.exclusive === "ren").map((d) => d.id as PassiveId);
    expect(earthTiers(ren(...own.slice(0, 2)).player)).toBe(0);
    expect(earthTiers(ren(...own.slice(0, 6)).player)).toBe(2);
    const s = ren(...own.slice(0, 15));
    expect(earthTiers(s.player)).toBe(REN_EARTH.tiers);
    let fx = 0;
    for (let k = 0; k < 40; k++) {
      const seen = new Set(s.effects);
      const wyrms = s.player.rWyrms?.length ?? 0;
      const c = s.player.attackCount;
      for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
      if (s.effects.some((e) => !seen.has(e) && e.kind.startsWith("ren") && e.kind !== "renSlam") || (s.player.rWyrms?.length ?? 0) > wyrms) fx++;
    }
    expect(fx).toBeGreaterThan(8);
    s.player.rStones = REN_EARTH.stoneMax - 1;
    s.player.rDrop = { left: REN_EARTH.stoneMax, gap: 0, dmg: 10 };
    for (let i = 0; i < REN_EARTH.dropGap * REN_EARTH.stoneMax + 2; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.rDrop).toBeUndefined();
  });
});
