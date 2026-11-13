import { describe, expect, it } from "vitest";
import { RG_BASE as B, RG_EXTRA as X, RG_ROSE as R, RG_SKILLS as K } from "../itemsRouge";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { addPickup } from "./loot";
import { NR_UP, nrUpgrade } from "./nrAdapt";
import { rgPlant } from "./rgRose";
import { enemy } from "./perkTestUtil";

/** 루주 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function rg(foes: [number, number][] = [[105, 100]]): RunState {
  const s = createRun(7, "rouge");
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.enemies = foes.map(([x, y], i) => ({ ...enemy(i + 1, x, y, 99999), rootTicks: 99999 }));
  return s;
}
const hit = { ...EMPTY_INPUT, attack: true, aimX: 100, aimY: 0 };
const idle = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
};
const lost = (s: RunState, i = 0) => 99999 - s.enemies[i]!.hp;
/** 추가 공격·장미 확률을 잠시 바꿔 실행 */
function odds(extra: number, rose: number, fn: () => void): void {
  const [a, b] = [X.chance, R.chance];
  [X.chance, R.chance] = [extra, rose];
  try {
    fn();
  } finally {
    [X.chance, R.chance] = [a, b];
  }
}

describe("루주", () => {
  it("장미쌍검 하나 · 패시브 없음 · 1단계 적장미 쌍검격은 2타 (출혈 없음)", () => {
    const s = rg([[110, 100]]);
    expect(s.player.weaponId).toBe("rgBlades");
    expect(s.player.passives.filter((id) => id !== "goddessBlessing")).toEqual([]);
    odds(0, 0, () => {
      stepSim(s, hit);
      idle(s, 30);
    });
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * B.s1.mul * B.s1.hits, 0);
    expect(s.enemies[0]!.rgBleed ?? 0).toBe(0);
  });

  it("2단계 혈염 난무: 출혈이 붙고 5스택까지 · 루주 출혈은 15틱마다 스택만큼", () => {
    const s = rg([[110, 100]]);
    s.player.nrBase = 2;
    odds(0, 0, () => {
      stepSim(s, hit);
      idle(s, 40);
      stepSim(s, hit);
      idle(s, 2);
    });
    expect(s.enemies[0]!.rgBleed).toBe(R.stacks);
    const before = s.enemies[0]!.hp;
    idle(s, R.tickEvery);
    expect(before - s.enemies[0]!.hp).toBeGreaterThan(0);
  });

  it("4단계 장미 가시 찌르기: 6타 + 터질 때 한 방", () => {
    const s = rg([[130, 100]]);
    s.player.nrBase = 4;
    s.enemies[0]!.immune = false;
    odds(0, 0, () => {
      stepSim(s, hit);
      idle(s, 40);
    });
    const d = s.player.stats.damage;
    const direct = d * (B.s4.muls.reduce((a, b) => a + b, 0) + B.s4.fin);
    expect(lost(s)).toBeGreaterThanOrEqual(direct - 1);
  });

  it("혈장미: 공격하면 장미가 피고, 닿은 적은 고정 피해 1 + 출혈", () => {
    const s = rg([[400, 300]]);
    odds(0, 1, () => stepSim(s, hit));
    expect(s.player.rgRoses?.length).toBe(1);
    const t = rg([[200, 200]]);
    idle(t, 1);
    t.player.rgRoses = [{ x: 200, y: 200, until: t.tick + 999 }];
    idle(t, 1);
    expect(lost(t)).toBeGreaterThanOrEqual(R.dmg);
    expect(t.enemies[0]!.rgBleed).toBe(1);
  });

  it("추가 공격 업화의 장미: 강한 1타 + 출혈 + 화상", () => {
    const s = rg([[140, 100]]);
    s.player.nrExtra = 4;
    odds(1, 0, () => stepSim(s, hit));
    const e = s.enemies[0]!;
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * X.s4.mul - 1);
    expect(e.rgBleed).toBeGreaterThan(0);
    expect(e.burnTicks).toBeGreaterThan(0);
  });

  it("장미 낙인: 잠시 뒤 큰 1타 · 대기 동안 다시 안 나감", () => {
    const s = rg([[150, 100]]);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 2 });
    expect(s.enemies[0]!.rgMark).toBeGreaterThan(0);
    idle(s, K.mark.delay + 2);
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * K.mark.mul - 1);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 2 });
    expect(s.player.nrLaters?.length ?? 0).toBe(0);
  });

  it("진홍의 폭우: 방의 장미를 모두 모으고, 모인 장미가 많을수록 세짐", () => {
    const run = (n: number) => {
      const s = rg([[100, 100]]);
      idle(s, 1);
      odds(0, 0, () => {
        if (n) rgPlant(s, 600, 400, n);
        stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
      });
      expect(s.player.rgRoses?.length ?? 0).toBe(0);
      idle(s, 120);
      return lost(s);
    };
    expect(run(10)).toBeGreaterThan(run(0));
  });

  it("종언의 혈장미: 적을 끌어당기고 터질 때 강한 1타 + 장미 수만큼 타수", () => {
    const s = rg([[100, 100], [200, 100]]);
    s.player.nrSkillUp = [false, false, false, true];
    s.enemies[1]!.rootTicks = 0;
    idle(s, 1);
    rgPlant(s, 600, 400, 5);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
    idle(s, K.end.gather + 30);
    expect(lost(s, 0)).toBeGreaterThanOrEqual(s.player.stats.damage * (K.end.mul + 5 * K.end.roseMul) - 1);
    expect(s.enemies[0]!.burnTicks).toBeGreaterThan(0);
  });

  it("적응력·제약은 느아르와 같음: 강화로 단계가 오르고, 일반 방에는 아이템이 안 놓임", () => {
    const s = rg();
    s.player.nrPts = 30;
    for (let i = 0; i < 30; i++) nrUpgrade(s, NR_UP.base);
    expect(s.player.nrBase).toBeGreaterThan(1);
    const room = s.roomId;
    s.map.rooms[room]!.type = "treasure";
    const before = s.rooms[room]!.pickups.length;
    addPickup(s, room, "passive", "vigor", 100, 100);
    expect(s.rooms[room]!.pickups.length).toBe(before);
  });

  it("모든 단계·강화판으로 오래 싸워도 오류 없이 결정적으로 같음", () => {
    const play = (up: boolean) => {
      const t = rg([[150, 100], [200, 160], [60, 200], [300, 120]]);
      Object.assign(t.player, { nrBase: 4, nrExtra: 4, nrSkillUp: [up, up, up, up], nrRank: 3 });
      recalcStats(t);
      for (let i = 0; i < 900; i++) stepSim(t, { ...hit, skill: i % 50 === 0 ? 1 + ((i / 50) % 4) : 0 });
      return t.enemies.map((e) => Math.round(e.hp));
    };
    expect(play(true)).toEqual(play(true));
    expect(play(false)).toEqual(play(false));
  });
});
