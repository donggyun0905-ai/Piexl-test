import { describe, expect, it } from "vitest";
import { BU_BASE as B, BU_EXTRA as X, BU_SKILLS as K, BU_SNOW as W } from "../itemsBleu";
import { USE_ITEMS } from "../items";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { addPickup } from "./loot";
import { NR_UP, noirRegenMul, nrUpgrade } from "./nrAdapt";
import { enemy } from "./perkTestUtil";

/** 블뢰 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function bu(foes: [number, number][] = [[105, 100]]): RunState {
  const s = createRun(7, "bleu");
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
/** 추가 공격·눈결정 확률을 잠시 바꿔 실행 */
function odds(extra: number, flake: number, fn: () => void): void {
  const [a, b] = [X.chance, W.chance];
  [X.chance, W.chance] = [extra, flake];
  try {
    fn();
  } finally {
    [X.chance, W.chance] = [a, b];
  }
}

describe("블뢰", () => {
  it("하얀 마도서 하나 · 패시브 없음 · 1단계 서리 결정탄은 날아가 강한 1타 (서리 피해 1.5배)", () => {
    const s = bu([[180, 100]]);
    expect(s.player.weaponId).toBe("buTome");
    expect(s.player.passives.filter((id) => id !== "goddessBlessing")).toEqual([]);
    odds(0, 0, () => {
      stepSim(s, hit);
      expect(s.player.buBolts?.length).toBe(1);
      idle(s, 30);
    });
    expect(s.player.buBolts?.length ?? 0).toBe(0);
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * B.s1.mul * W.frostMul - 1);
  });

  it("2단계 빙결의 파동: 4타 · 적을 얼림 (다시 얼리기까지 쉼)", () => {
    const s = bu([[100, 100]]);
    s.player.nrBase = 2;
    odds(0, 0, () => {
      stepSim(s, hit);
      idle(s, 40);
    });
    const sum = B.s2.muls.reduce((a, b) => a + b, 0);
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * sum * W.frostMul, 0);
    expect(s.enemies[0]!.buIce).toBeGreaterThan(0);
    expect(s.enemies[0]!.buIceOk).toBe(s.enemies[0]!.buIce! + W.refreeze);
  });

  it("3단계 빙정 폭발: 빙결 1타 → 잠시 뒤 강한 1타", () => {
    const s = bu([[100, 100]]);
    s.player.nrBase = 3;
    odds(0, 0, () => {
      stepSim(s, hit);
      idle(s, 2);
      expect(lost(s)).toBeCloseTo(s.player.stats.damage * B.s3.mul * W.frostMul, 0);
      idle(s, B.s3.delay + 4);
    });
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * (B.s3.mul + B.s3.fin) * W.frostMul, 0);
  });

  it("얼음마녀 눈결정: 공격하면 방에 생기고, 닿은 적은 느려짐", () => {
    const s = bu([[400, 300]]);
    s.player.nrBase = 4;
    odds(0, 1, () => stepSim(s, hit));
    expect(s.player.buFlakes?.length).toBe(1);
    const f = s.player.buFlakes![0]!;
    s.enemies[0]!.x = f.x;
    s.enemies[0]!.y = f.y;
    idle(s, 1);
    expect(s.enemies[0]!.slowTicks).toBeGreaterThan(0);
  });

  it("추가 공격 영혼 사슴: 둘레 빙결 + 보호막 15 (겹치지 않음)", () => {
    const s = bu([[120, 100]]);
    s.player.nrExtra = 3;
    s.player.nrBase = 4;
    odds(1, 0, () => {
      stepSim(s, hit);
      idle(s, 70);
      stepSim(s, hit);
    });
    expect(s.player.shieldPts).toBe(X.deer.shield);
  });

  it("추가 공격 영혼 군단: 늑대·매·사슴이 함께", () => {
    const s = bu([[140, 100]]);
    s.player.nrExtra = 4;
    s.player.nrBase = 4;
    odds(1, 0, () => {
      stepSim(s, hit);
      idle(s, 40);
    });
    const d = s.player.stats.damage * W.frostMul;
    expect(lost(s)).toBeGreaterThanOrEqual(d * (X.wolf.mul + X.hawk.mul + X.deer.mul) - 1);
    expect(s.player.shieldPts).toBe(X.deer.shield);
  });

  it("가디언 방패: 빙결도 맞을 때마다 한 칸씩 깨고, 다 깨져야 피해 · 피해 출처는 기술마다", () => {
    const s = bu([[100, 100]]);
    s.player.nrBase = 4;
    s.enemies[0]!.shield = 3;
    odds(0, 0, () => {
      stepSim(s, hit);
      idle(s, 3 * B.s4.every - 1);
      expect(s.enemies[0]!.shield).toBe(0);
      expect(lost(s)).toBe(0);
      idle(s, 60);
    });
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.player.dmgBy?.["k:buBase4"]).toBeCloseTo(lost(s), 3);
    expect(s.player.dmgBy?.["d:frost"] ?? 0).toBe(0);
  });

  it("시간 동결: 얼음 시계(사용 아이템과 같은 길이) + 방 전체 15타", () => {
    const s = bu([[100, 100], [500, 300]]);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 3 });
    expect(s.freezeTicks).toBeGreaterThan(USE_ITEMS.frost.ticks - 3);
    idle(s, K.stop.hits * K.stop.every + 4);
    expect(lost(s, 1)).toBeCloseTo(s.player.stats.damage * K.stop.mul * K.stop.hits * W.frostMul, 0);
  });

  it("영원의 설원: 범위 안 적만 얼음 시계 (멈춤)", () => {
    const s = bu([[120, 100], [600, 400]]);
    s.player.nrSkillUp = [true, false, false, false];
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 1 });
    expect(s.enemies[0]!.stunTicks).toBeGreaterThan(K.field.ticks - 3);
    expect(s.enemies[1]!.stunTicks ?? 0).toBe(0);
  });

  it("종언의 영구동토: 얼음 시계가 끝나면 눈결정 수만큼 더 때림", () => {
    const run = (n: number) => {
      const s = bu([[100, 100]]);
      s.player.nrSkillUp = [false, false, false, true];
      idle(s, 1);
      s.player.buFlakes = Array.from({ length: n }, (_, i) => ({ x: 300 + i, y: 300, until: s.tick + 9999 }));
      stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
      expect(s.player.shieldPts).toBe(K.end.shield);
      idle(s, USE_ITEMS.frost.ticks + n * K.end.every + 10);
      return lost(s);
    };
    const d = createRun(7, "bleu").player.stats.damage;
    expect(run(10) - run(0)).toBeCloseTo(d * K.end.flakeMul * 10 * W.frostMul, 0);
  });

  it("적응력·제약은 느아르와 같음: 강화로 단계가 오르고, 일반 방에는 아이템이 안 놓임", () => {
    const s = bu();
    s.player.nrPts = 30;
    for (let i = 0; i < 30; i++) nrUpgrade(s, NR_UP.base);
    expect(s.player.nrBase).toBeGreaterThan(1);
    const room = s.roomId;
    s.map.rooms[room]!.type = "treasure";
    const before = s.rooms[room]!.pickups.length;
    addPickup(s, room, "passive", "vigor", 100, 100);
    expect(s.rooms[room]!.pickups.length).toBe(before);
    expect(noirRegenMul(s.player)).toBe(1);
  });

  it("모든 단계·강화판으로 오래 싸워도 오류 없이 결정적으로 같음", () => {
    const play = (up: boolean) => {
      const t = bu([[150, 100], [200, 160], [60, 200], [300, 120]]);
      Object.assign(t.player, { nrBase: 4, nrExtra: 4, nrSkillUp: [up, up, up, up], nrRank: 3 });
      recalcStats(t);
      for (let i = 0; i < 900; i++) stepSim(t, { ...hit, skill: i % 50 === 0 ? 1 + ((i / 50) % 4) : 0 });
      return t.enemies.map((e) => Math.round(e.hp));
    };
    expect(play(true)).toEqual(play(true));
    expect(play(false)).toEqual(play(false));
  });
});
