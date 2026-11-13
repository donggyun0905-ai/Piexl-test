import { describe, expect, it } from "vitest";
import { JN_BASE as B, JN_EXTRA as X, JN_LV as L, JN_SKILLS as K, JN_ZAP as Z } from "../itemsJaune";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { addPickup } from "./loot";
import { NR_UP, noirRegenMul, nrUpgrade } from "./nrAdapt";
import { enemy } from "./perkTestUtil";
import { practiceAshLevel } from "./practiceFaction";

/** 존 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function jn(foes: [number, number][] = [[105, 100]]): RunState {
  const s = createRun(7, "jaune");
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
/** 황금 번개까지 합친 배율 (한 대 + 추가 타격 3번) */
const ALL = 1 + Z.muls.reduce((a, b) => a + b, 0);
/** 추가 공격 확률을 잠시 바꿔 실행 */
function odds(extra: number, fn: () => void): void {
  const a = X.chance;
  X.chance = extra;
  try {
    fn();
  } finally {
    X.chance = a;
  }
}

describe("존", () => {
  it("금빛 손아귀 하나 · 패시브 없음 · 1단계 황뢰 할퀴기: 약한 번개 1타 + 황금 번개 추가 타격 3번 (100·70·30%)", () => {
    const s = jn();
    expect(s.player.weaponId).toBe("jnGrip");
    expect(s.player.passives.filter((id) => id !== "goddessBlessing")).toEqual([]);
    odds(0, () => {
      stepSim(s, hit);
      const one = lost(s);
      expect(one).toBeGreaterThan(0);
      expect(s.player.jnZaps?.length).toBe(Z.muls.length);
      idle(s, Z.gap * Z.muls.length + 2);
      expect(lost(s)).toBeCloseTo(one * ALL, 1);
    });
    expect(s.player.dmgBy?.["k:jnBase1"]).toBeCloseTo(lost(s), 3);
  });

  it("2단계 벽력일섬: 앞 직선 관통 3타 (뒤 적은 안 맞음)", () => {
    const s = jn([[200, 100], [20, 100]]);
    s.player.nrBase = 2;
    odds(0, () => {
      stepSim(s, hit);
      idle(s, 60);
    });
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * L.weak * B.s2.hits * ALL, 0);
    expect(lost(s, 1)).toBe(0);
  });

  it("추가 공격 뇌전 구속: 마우스 자리 묶고 3타 → 강한 1타", () => {
    const s = jn([[150, 100]]);
    s.player.nrExtra = 4;
    s.enemies[0]!.rootTicks = 0;
    odds(1, () => {
      stepSim(s, { ...hit, aimX: 70, aimY: 0 });
      expect(s.enemies[0]!.rootTicks).toBeGreaterThan(X.bind.root - 3);
      idle(s, 80);
    });
    expect(s.player.dmgBy?.["k:jnExtra4"]).toBeCloseTo(s.player.stats.damage * (L.weak * X.bind.hits + L.strong) * ALL, 0);
  });

  it("가디언 방패: 번개도 맞을 때마다 한 칸씩 깨고, 막힌 번개는 추가 타격도 없음", () => {
    const s = jn([[100, 100]]);
    s.player.nrBase = 4;
    s.enemies[0]!.shield = 2;
    odds(0, () => {
      stepSim(s, hit);
      idle(s, B.s4.every * 2 + Z.gap * 3 + 4);
    });
    expect(s.enemies[0]!.shield).toBe(0);
    expect(lost(s)).toBe(0);
  });

  it("황금 뇌구: 구체가 앞으로 날아가며 둘레를 때림", () => {
    const s = jn([[200, 100]]);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 1 });
    const v = s.player.nrVolleys?.find((o) => o.kind === "jnOrb");
    expect(v).toBeDefined();
    idle(s, 20);
    expect(v!.x).toBeGreaterThan(110);
    idle(s, (K.orb.hits + K.orb.tail) * K.orb.every + 30);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("천둥의 발자취: 이펙트의 지그재그 길을 따라 돌진 (옆으로 꺾이며 앞으로 · 그동안 무적)", () => {
    const s = jn([[300, 30]]);
    s.player.x = s.player.prevX = 60;
    s.player.y = s.player.prevY = 110;
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    const ys: number[] = [];
    for (let i = 0; i < 40; i++) {
      idle(s, 1);
      ys.push(s.player.y);
    }
    expect(s.player.nrRush).toBeUndefined();
    expect(s.player.x).toBeGreaterThan(60 + K.step.size * 0.5);
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(K.step.size * 0.3);
  });

  it("종언의 황천뢰: 구체가 처음 닿은 적 자리에서 이어서 때림 · 닿지 않으면 사라짐", () => {
    const s = jn([[200, 100]]);
    s.player.nrSkillUp = [false, false, false, true];
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
    expect(s.player.jnBolts?.length).toBe(1);
    idle(s, 30);
    expect(s.player.jnBolts?.length ?? 0).toBe(0);
    expect(s.player.nrVolleys?.filter((v) => v.kind === "jnEnd").length).toBe(2);
    idle(s, 120);
    expect(lost(s)).toBeGreaterThan(0);
    const t = jn([[200, 400]]);
    t.player.nrSkillUp = [false, false, false, true];
    stepSim(t, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
    idle(t, 80);
    expect(t.player.nrVolleys?.some((v) => v.kind === "jnEnd") ?? false).toBe(false);
  });

  it("적응력·제약은 느아르와 같음: 강화로 단계가 오르고, 일반 방에는 아이템이 안 놓임", () => {
    const s = jn();
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

  it("연습장 레벨업: 누를 때마다 레벨 +1 · 강화 횟수 +1 · 공격력 오름 (아슈바르가 아니면 아무것도 안 함)", () => {
    const s = jn();
    const d = s.player.stats.damage;
    practiceAshLevel(s);
    practiceAshLevel(s);
    expect(s.player.nrLv).toBe(3);
    expect(s.player.nrPts).toBe(2);
    expect(s.player.stats.damage).toBeGreaterThan(d);
    const m = createRun(7, "mage");
    practiceAshLevel(m);
    expect(m.player.nrLv).toBeUndefined();
  });

  it("모든 단계·강화판으로 오래 싸워도 오류 없이 결정적으로 같음", () => {
    const play = (up: boolean) => {
      const t = jn([[150, 100], [200, 160], [60, 200], [300, 120]]);
      Object.assign(t.player, { nrBase: 4, nrExtra: 4, nrSkillUp: [up, up, up, up], nrRank: 3 });
      recalcStats(t);
      for (let i = 0; i < 900; i++) stepSim(t, { ...hit, skill: i % 50 === 0 ? 1 + ((i / 50) % 4) : 0 });
      expect(t.player.jnZaps!.length).toBeLessThanOrEqual(Z.max);
      return t.enemies.map((e) => Math.round(e.hp));
    };
    expect(play(true)).toEqual(play(true));
    expect(play(false)).toEqual(play(false));
  });
});
