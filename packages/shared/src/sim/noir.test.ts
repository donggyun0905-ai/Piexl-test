import { describe, expect, it } from "vitest";
import { NR_ADAPT as A, NR_BASE as B, NR_EXTRA as X, NR_SKILLS as K } from "../itemsNoir";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { addPickup } from "./loot";
import { NR_UP, nrChance, nrNeed, nrUpgrade } from "./nrAdapt";
import { expToNext } from "./novice";
import { roomLocked, spawnSpecialRoom } from "./specialRooms";
import { extraOf } from "./baseStats";
import { enemy } from "./perkTestUtil";

/** 느아르 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function nr(foes: [number, number][] = [[105, 100]]): RunState {
  const s = createRun(7, "noir");
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
/** 추가 공격 확률을 잠시 바꿔 실행 */
function extraOdds(v: number, fn: () => void): void {
  const old = X.chance;
  X.chance = v;
  try {
    fn();
  } finally {
    X.chance = old;
  }
}

describe("느아르", () => {
  it("무기 하나 · 패시브 없음 · 1단계 칠흑 횡베기는 앞과 옆을 넓게 한 번", () => {
    const s = nr([[100, 100], [80, 130], [20, 100]]);
    expect(s.player.weaponId).toBe("nrBlade");
    expect(s.player.passives.filter((id) => id !== "goddessBlessing")).toEqual([]);
    extraOdds(0, () => stepSim(s, hit));
    expect(lost(s, 0)).toBeGreaterThan(0);
    expect(lost(s, 1)).toBeGreaterThan(0);
    expect(lost(s, 2)).toBe(0);
  });

  it("2단계 무형의 난무: 약한 9타 + 큰 한방 · 3단계 회전참 15타는 점점 세짐", () => {
    const s = nr([[110, 100]]);
    s.player.nrBase = 2;
    extraOdds(0, () => {
      stepSim(s, hit);
      idle(s, 60);
    });
    const d = s.player.stats.damage;
    expect(lost(s)).toBeCloseTo(d * (B.s2.mul * 9 + B.s2.fin), 0);
    const t = nr([[110, 100]]);
    t.player.nrBase = 3;
    extraOdds(0, () => {
      stepSim(t, hit);
      idle(t, 60);
    });
    const sum = Array.from({ length: B.s3.hits }, (_, i) => B.s3.mul + B.s3.ramp * i).reduce((a, b) => a + b, 0);
    expect(lost(t)).toBeCloseTo(t.player.stats.damage * sum, 0);
  });

  it("4단계 절대 단절: 적을 빨아들임 (보스 빼고)", () => {
    const s = nr([[180, 100]]);
    s.enemies[0]!.rootTicks = 0;
    s.player.nrBase = 4;
    extraOdds(0, () => {
      stepSim(s, hit);
      idle(s, 10);
    });
    expect(s.enemies[0]!.x).toBeLessThan(180);
  });

  it("추가 공격: 공허 포식은 30타 뒤 맞은 만큼 한 번 더 · 마력 소멸은 3초 뒤 한 방 더", () => {
    const s = nr([[110, 100], [400, 300]]);
    s.player.nrExtra = 4;
    s.player.nrCd = 999;
    // 기본 공격 없이 추가 공격만 보려고 바로 부름
    extraOdds(1, () => {
      s.player.nrCd = 0;
      stepSim(s, hit);
    });
    const base = lost(s);
    idle(s, X.s4.hits * X.s4.every + 10);
    expect(lost(s)).toBeGreaterThan(base * 1.5);
    const t = nr([[110, 100]]);
    t.player.nrExtra = 3;
    extraOdds(1, () => stepSim(t, hit));
    idle(t, X.s3.ticks + 5);
    const mid = lost(t);
    idle(t, X.s3.later);
    expect(lost(t) - mid).toBeCloseTo(t.player.stats.damage * X.s3.laterMul, 0);
  });

  it("스킬: 공허의 낙인은 잠시 뒤 큰 1타 · 대기 시간 동안 다시 안 나감", () => {
    const s = nr([[150, 100]]);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 2 });
    expect(s.enemies[0]!.nrBrand).toBeGreaterThan(0);
    idle(s, K.brand.delay + 2);
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * K.brand.mul, 0);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 2 });
    expect(s.player.nrLaters?.length ?? 0).toBe(0);
  });

  it("궁극기 흑월 강림: 발밑 한 방 + 충격파가 먼 적까지 · 강화판 태초의 종언은 충격파 3번", () => {
    const s = nr([[100, 100], [600, 400]]);
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
    idle(s, 120);
    expect(lost(s, 0)).toBeGreaterThan(s.player.stats.damage * K.moon.mul);
    expect(lost(s, 1)).toBeCloseTo(s.player.stats.damage * K.moon.waveMul, 0);
    const t = nr([[600, 400]]);
    t.player.nrSkillUp = [false, false, false, true];
    stepSim(t, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
    idle(t, 200);
    expect(lost(t)).toBeCloseTo(t.player.stats.damage * K.end.waveMul * 3, 0);
  });

  it("적응력: 흑이 차면 레벨업 → 공격력+1 · 체력+10 · 재생력+1 · 강화 한 번", () => {
    const s = nr([[100, 100], [105, 95], [105, 105], [110, 100]]);
    const [d0, h0] = [s.player.stats.damage, s.player.stats.maxHp];
    for (const e of s.enemies) e.hp = 1;
    s.player.nrExp = nrNeed(1) - 1;
    extraOdds(0, () => stepSim(s, hit));
    idle(s, 2);
    expect(s.player.nrLv).toBeGreaterThan(1);
    const lv = s.player.nrLv! - 1;
    expect(s.player.stats.damage).toBeCloseTo(d0 + lv * A.lvDmg, 5);
    expect(s.player.stats.maxHp).toBeCloseTo(h0 + lv * A.lvHp, 5);
    expect(extraOf(s.player).defense).toBe(0);
    expect(s.player.nrPts).toBe(lv);
  });

  it("강화 확률: 실패하면 +5% · 성공하면 처음으로 · 대악마는 기본·추가 3단계부터", () => {
    const s = nr();
    const p = s.player;
    expect(nrChance(p, NR_UP.base)).toBe(0.75);
    expect(nrChance(p, NR_UP.skill)).toBe(0.5);
    expect(nrChance(p, NR_UP.rank)).toBe(0.5);
    p.nrPts = 400;
    let fails = 0;
    for (let n = 0; n < 400 && (p.nrBase ?? 1) < 4; n++) {
      const before = p.nrBase ?? 1;
      const c = nrChance(p, NR_UP.base)!;
      nrUpgrade(s, NR_UP.base);
      s.tick++;
      if ((p.nrBase ?? 1) === before) {
        fails++;
        expect(nrChance(p, NR_UP.base)!).toBeCloseTo(Math.min(1, c + A.failAdd), 5);
      } else expect(p.nrFail![0]).toBe(0);
    }
    expect(p.nrBase).toBe(4);
    expect(nrChance(p, NR_UP.base)).toBeNull();
    p.nrRank = 2;
    p.nrExtra = 2;
    expect(nrChance(p, NR_UP.rank)).toBeNull();
    p.nrExtra = 3;
    p.nrFail = [0, 0, 0, 0, 0, 0, 5];
    // 승격은 실패해도 확률이 오르지 않음
    expect(nrChance(p, NR_UP.rank)).toBe(0.1);
    expect(fails).toBeGreaterThanOrEqual(0);
  });

  it("승격: 중위악마 공격력+5 · 체력+40 · 재생력+5 (방어력 없음)", () => {
    const s = nr();
    const [d0, h0, def0] = [s.player.stats.damage, s.player.stats.maxHp, extraOf(s.player).defense];
    s.player.nrRank = 1;
    recalcStats(s);
    expect(s.player.stats.damage).toBeCloseTo(d0 + 5, 5);
    expect(s.player.stats.maxHp).toBeCloseTo(h0 + 40, 5);
    expect(extraOf(s.player).defense).toBe(def0);
    expect(extraOf(s.player).regen).toBeGreaterThan(0);
  });

  it("흑 필요량은 풋내기의 2배 · 성좌의 방은 안 잠김 · 단련의 방은 비어 있음 · 사거리 증가는 공격에 안 들어감", () => {
    expect(nrNeed(3)).toBe(Math.round(expToNext(3) * A.expMul));
    const s = nr();
    s.map.rooms[s.roomId]!.type = "altar";
    expect(roomLocked(s)).toBe(false);
    const before = s.rooms[s.roomId]!.pickups.length;
    spawnSpecialRoom(s, "gym", s.roomId);
    expect(s.rooms[s.roomId]!.pickups.length).toBe(before);
    const t = nr([[130, 100]]);
    t.player.stats.range *= 3;
    extraOdds(0, () => stepSim(t, hit));
    expect(t.effects.find((f) => f.kind === "nrSlash")!.size).toBe(B.s1.r);
  });

  it("제약: 일반 방에는 아이템이 안 놓이고, 비밀방(악마의 방)에는 놓임", () => {
    const s = nr();
    const room = s.roomId;
    s.map.rooms[room]!.type = "treasure";
    const before = s.rooms[room]!.pickups.length;
    addPickup(s, room, "passive", "vigor", 100, 100);
    expect(s.rooms[room]!.pickups.length).toBe(before);
    s.map.rooms[room]!.type = "devil";
    addPickup(s, room, "passive", "vigor", 100, 100);
    expect(s.rooms[room]!.pickups.length).toBe(before + 1);
  });

  it("모든 단계·강화판으로 오래 싸워도 오류 없이 결정적으로 같음", () => {
    const play = () => {
      const t = nr([[150, 100], [200, 160], [60, 200], [300, 120]]);
      Object.assign(t.player, { nrBase: 4, nrExtra: 4, nrSkillUp: [true, true, true, true], nrRank: 3 });
      recalcStats(t);
      for (let i = 0; i < 900; i++) stepSim(t, { ...hit, skill: i % 50 === 0 ? 1 + ((i / 50) % 4) : 0 });
      return t.enemies.map((e) => Math.round(e.hp));
    };
    expect(play()).toEqual(play());
  });
});
