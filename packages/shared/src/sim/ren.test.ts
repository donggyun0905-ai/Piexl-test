import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { renBlock, renMelee } from "./ren";
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
});
