import { describe, expect, it } from "vitest";
import { HIDDEN_CHARACTERS } from "../characters";
import type { WeaponId } from "../content";
import { MINER as M } from "../weaponsMiner";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { caveNeed, gainOre, groundTick } from "./minerGround";
import { enemy, FIRE } from "./perkTestUtil";

function miner(weapon: WeaponId = "mnPick", ...perks: string[]): RunState {
  const s = createRun(5, "miner");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 70, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const IDLE = { ...FIRE, attack: false };

describe("에테르 광부", () => {
  it("히든 캐릭터 · 맞힐 때마다 원석", () => {
    expect(HIDDEN_CHARACTERS).toContain("miner");
    const s = miner();
    for (let i = 0; i < 60; i++) stepSim(s, FIRE);
    expect(s.player.mnTotal).toBeGreaterThan(0);
  });

  for (const w of ["mnPick", "mnDrill", "mnSledge", "mnTnt", "mnCart", "mnPit", "mnMagnet", "mnGem", "mnThrow", "mnEther"] as WeaponId[]) {
    it(`곡괭이 ${w}: 적에게 피해`, () => {
      const s = miner(w);
      for (let i = 0; i < 150; i++) stepSim(s, FIRE);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("쓰러진 보통 적은 에테르 결정 · 곡괭이로 깨면 파편과 원석", () => {
    const s = miner();
    s.enemies = [enemy(1, 70, 72, 1)];
    for (let i = 0; i < 40 && !s.player.mnNodes?.length; i++) stepSim(s, FIRE);
    expect(s.player.mnNodes?.length).toBe(1);
    const ore = s.player.mnTotal ?? 0;
    s.player.mnNodes![0]!.x = s.player.x + 15;
    s.player.mnNodes![0]!.y = s.player.y;
    s.enemies = [{ ...enemy(2, 75, 72, 99999), rootTicks: 99999 }];
    for (let i = 0; i < 60 && s.player.mnNodes?.length; i++) stepSim(s, FIRE);
    expect(s.player.mnNodes?.length ?? 0).toBe(0);
    expect(s.player.mnTotal).toBeGreaterThan(ore + M.nodeOre - 1);
  });

  it("원석이 다 모이면 광산 붕괴 (바위가 떨어짐) · 붕괴 전문가는 절반", () => {
    const s = miner();
    gainOre(s, caveNeed(s));
    expect(s.player.mnRocks?.length).toBeGreaterThan(0);
    expect(s.player.mnOre).toBe(0);
    const before = lost(s);
    s.player.mnRocks!.forEach((r) => {
      r.x = s.enemies[0]!.x;
      r.y = s.enemies[0]!.y;
    });
    for (let i = 0; i < 80; i++) groundTick(s);
    expect(lost(s)).toBeGreaterThan(before);
    expect(caveNeed(miner("mnPick", "mnExpert"))).toBe(M.caveNeed / 2);
  });

  it("구덩이: 빠진 보통 적은 그대로 끝", () => {
    const s = miner("mnPit");
    s.player.mnPits = [{ x: 70, y: 72, t: 99 }];
    groundTick(s);
    expect(s.enemies[0]!.hp).toBeLessThanOrEqual(0);
  });

  it("땅굴: 대시하는 동안 무적, 나오며 둘레를 터뜨림", () => {
    const s = miner();
    s.player.dashTicks = 3;
    stepSim(s, IDLE);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    for (let i = 0; i < 6; i++) stepSim(s, IDLE);
    expect(s.player.mnBurrow).toBe(false);
    expect(lost(s)).toBeGreaterThan(0);
  });
});
