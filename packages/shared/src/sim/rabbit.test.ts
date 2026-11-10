import { describe, expect, it } from "vitest";
import { RABBIT_PASSIVES, RABBIT_PERKS as K } from "../itemsRabbit";
import { RABBIT_HAMMER as H, RABBIT_ULT as U } from "../weaponsRabbit";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { classTaken } from "./classTaken";
import { canUlt, slam } from "./rabbit";
import { rabbitUltX } from "./rabbitUlt";
import { timeSlowed } from "./punk";
import { enemy } from "./perkTestUtil";
import { ROOM_MAX_X, ROOM_MIN_X } from "./util";

/** 래빗 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function rb(foes: [number, number, number?][] = [[110, 100]], ...perks: string[]): RunState {
  const s = createRun(7, "rabbit");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.enemies = foes.map(([x, y, hp], i) => ({ ...enemy(i + 1, x, y, hp ?? 99999), rootTicks: 99999, stunTicks: 99999 }));
  return s;
}
const hit = { ...EMPTY_INPUT, attack: true, aimX: 100, aimY: 0 };
const idle = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
};

describe("래빗", () => {
  it("전용 패시브 20개 (모두 효과 아이템)", () => {
    expect(Object.keys(RABBIT_PASSIVES).length).toBe(20);
    expect(Object.values(RABBIT_PASSIVES).every((v) => v.exclusive === "rabbit" && v.effect)).toBe(true);
  });

  it("누르면 앞에 망치를 내리찍어 둘레 적에게 피해 · 다시 찍기까지 기다림", () => {
    const s = rb([[80 + H.reach, 100], [300, 100]]);
    stepSim(s, hit);
    const [a, b] = s.enemies;
    expect(a!.hp).toBeLessThan(99999);
    expect(b!.hp).toBe(99999);
    const after = a!.hp;
    stepSim(s, hit);
    expect(a!.hp).toBe(after);
    expect(s.effects.some((f) => f.kind === "rbSlam")).toBe(true);
  });

  it("땅울림: 땅울림이 다 커진 뒤 앞으로 맵 끝까지 나아가며 먼 적도 때림 · 세 갈래면 파동 셋", () => {
    const s = rb([[ROOM_MAX_X - 20, 100]], "rbQuake");
    stepSim(s, hit);
    expect(s.player.rbWaves!.length).toBe(1);
    idle(s, 160);
    expect(s.enemies[0]!.hp).toBeLessThan(99999);
    expect(s.player.rbWaves!.length).toBe(0);
    const t = rb([], "rbQuake", "rbTriple");
    stepSim(t, hit);
    expect(t.player.rbWaves!.length).toBe(3);
  });

  it("토끼인장: 찍은 자리에 토끼가 나와 잠시 뒤 터짐 (파동에서는 안 나옴)", () => {
    const s = rb([[80 + H.reach, 100]], "rbSeal", "rbQuake");
    stepSim(s, hit);
    expect(s.player.rbMarks!.filter((m) => m.kind === 0).length).toBe(1);
    const hp = s.enemies[0]!.hp;
    idle(s, K.rbSeal.delay + 2);
    expect(s.enemies[0]!.hp).toBeLessThan(hp);
    expect(s.effects.some((f) => f.kind === "rbBunny")).toBe(true);
    expect(s.player.rbMarks!.length).toBe(0);
  });

  it("홈런: 크게 휘둘러 3배로 밀고, 확률로 맵 밖으로 날려 버림 (보스는 안 됨)", () => {
    const s = rb(Array.from({ length: 40 }, (_, i) => [100 + (i % 8) * 4, 90 + Math.floor(i / 8) * 4] as [number, number]), "rbHomerun");
    for (const e of s.enemies) e.stunTicks = e.rootTicks = 0;
    slam(s, 110, 100, { homer: true });
    const flown = s.effects.filter((f) => f.kind === "rbFly").length;
    expect(flown).toBeGreaterThan(0);
    expect(flown).toBeLessThan(40);
    expect(s.enemies.filter((e) => e.hp <= 0).length).toBeGreaterThanOrEqual(flown);
    const kb = s.enemies.find((e) => e.hp > 0)!;
    expect(Math.hypot(kb.kbX ?? 0, kb.kbY ?? 0) * (kb.kbT ?? 0)).toBeGreaterThan(20);
    const b = rb([[110, 100]]);
    b.enemies[0]!.kind = "hulk";
    slam(b, 110, 100, { homer: true });
    expect(b.effects.some((f) => f.kind === "rbFly")).toBe(false);
  });

  it("슈퍼 럭키: 래빗 전용 아이템 7개부터 · 쓰면 30초 쿨타임", () => {
    const ids = Object.keys(RABBIT_PASSIVES).filter((id) => id !== "rbLucky");
    expect(canUlt(rb([], "rbLucky", ...ids.slice(0, 5)))).toBe(false);
    const s = rb([], "rbLucky", ...ids.slice(0, 6));
    expect(canUlt(s)).toBe(true);
    s.player.rbUltCd = K.rbLucky.cd;
    expect(canUlt(s)).toBe(false);
  });

  it("슈퍼 럭키: 왼쪽 밖에서 나와 1/5에서 느려지고 다 가린 뒤 오른쪽 밖으로 · 느린 동안 적이 쉬고 30번 나눠 맞음", () => {
    expect(rabbitUltX(0)).toBeLessThan(ROOM_MIN_X);
    expect(rabbitUltX(U.enter + U.slow)).toBeCloseTo((ROOM_MIN_X + ROOM_MAX_X) / 2);
    expect(rabbitUltX(U.enter + U.slow + U.swing) - (ROOM_MAX_X - ROOM_MIN_X) / 2).toBeGreaterThan(ROOM_MAX_X);
    const s = rb([[200, 100], [260, 120]], "rbLucky");
    s.player.rbUlt = { t: 0, hits: 0, dmg: 10 };
    idle(s, U.enter + 2);
    expect(timeSlowed(s, false)).toBe(true);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    idle(s, U.slow + U.swing);
    expect(s.enemies.every((e) => e.maxHp - e.hp >= 10 * U.hits - 1)).toBe(true);
    expect(s.effects.filter((f) => f.kind === "rbUltHit").length).toBeLessThanOrEqual(U.hits * 2);
    expect(s.player.rbUlt).toBeUndefined();
    expect(timeSlowed(s, false)).toBe(false);
  });

  it("폭신한 솜털: 받는 피해 감소 · 방울: 세 번째마다 둘레 묶음", () => {
    const s = rb([], "rbFluff");
    expect(classTaken(s, 10)).toBeLessThan(classTaken(rb([]), 10));
    const b = rb([[80 + H.reach, 100], [60, 100]], "rbBell");
    for (let i = 0; i < 3; i++) {
      stepSim(b, hit);
      idle(b, H.cd);
    }
    expect(b.effects.some((f) => f.kind === "rbBell") || b.enemies[1]!.hp < 99999).toBe(true);
  });

  it("같은 시드 = 같은 결과 (홈런·별사탕·유령 망치 확률)", () => {
    const go = () => {
      const s = rb([[110, 100], [130, 110], [150, 90]], "rbHomerun", "rbStar", "rbGhost", "rbSeal", "rbQuake");
      for (let i = 0; i < 200; i++) stepSim(s, hit);
      return s.enemies.map((e) => Math.round(e.hp));
    };
    expect(go()).toEqual(go());
  });
});
