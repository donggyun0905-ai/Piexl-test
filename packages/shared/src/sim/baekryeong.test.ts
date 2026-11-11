import { describe, expect, it, onTestFinished } from "vitest";
import { BAEK_PASSIVES, BAEK_PERKS as K } from "../itemsBaekryeong";
import { BAEK_BLADE as B, BAEK_SOUL as S } from "../weaponsBaekryeong";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { classTaken } from "./classTaken";
import { addSouls, armScale, maxLv, soulNeed } from "./baekKit";
import { baekKill } from "./baekSoul";
import { soulTick } from "./baekKills";
import { enemy } from "./perkTestUtil";
import { ROOM_MAX_X } from "./util";

/** 백령 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 · lv = 게이지 칸 */
function by(foes: [number, number, number?][] = [[110, 100]], lv = 0, ...perks: string[]): RunState {
  const s = createRun(7, "baekryeong");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.player.byLv = lv;
  s.enemies = foes.map(([x, y, hp], i) => ({ ...enemy(i + 1, x, y, hp ?? 99999), rootTicks: 99999, stunTicks: 99999 }));
  return s;
}
const hit = { ...EMPTY_INPUT, attack: true, aimX: 100, aimY: 0 };
const idle = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
};
/** 확률 효과를 늘 나오게 하고 fn 실행 (끝나면 되돌림) */
function sure(keys: ("byGreat" | "byGreatWhite" | "byTwin")[], fn: () => void): void {
  const old = keys.map((k) => K[k].chance);
  for (const k of keys) K[k].chance = 1;
  try {
    fn();
  } finally {
    keys.forEach((k, i) => (K[k].chance = old[i]!));
  }
}

describe("백령", () => {
  it("전용 패시브 20개 (모두 효과 아이템)", () => {
    expect(Object.keys(BAEK_PASSIVES).length).toBe(20);
    expect(Object.values(BAEK_PASSIVES).every((v) => v.exclusive === "baekryeong" && v.effect)).toBe(true);
  });

  it("누르면 앞 부채꼴을 벰 · 뒤에 있는 적은 안 맞음 · 다시 베기까지 기다림", () => {
    const s = by([[80 + B.reach - 4, 100], [60, 100]]);
    stepSim(s, hit);
    const [a, b] = s.enemies;
    expect(a!.hp).toBeLessThan(99999);
    expect(b!.hp).toBe(99999);
    const after = a!.hp;
    stepSim(s, hit);
    expect(a!.hp).toBe(after);
    expect(s.effects.some((f) => f.kind === "bySlash")).toBe(true);
  });

  it("처치하면 영혼이 쌓여 게이지가 참 · 3칸부터 유령팔 · 칸마다 조금씩 커지고 2배에서 멈춤", () => {
    const s = by([], 0);
    const p = s.player;
    expect(armScale(p)).toBe(0);
    addSouls(p, S.need1 + S.need2 + S.need3 - 1);
    expect(p.byLv).toBe(2);
    expect(armScale(p)).toBe(0);
    addSouls(p, 1);
    expect(p.byLv).toBe(3);
    expect(armScale(p)).toBe(1);
    addSouls(p, S.needAfter);
    expect(armScale(p)).toBeCloseTo(1 + S.grow);
    addSouls(p, 99999);
    expect(p.byLv).toBe(maxLv());
    expect(armScale(p)).toBe(S.maxScale);
    expect(p.bySouls).toBe(0);
    // 보스는 영혼을 많이 줌 · 영혼 포식은 하나 더
    const t = by([], 0, "byFeast");
    baekKill(t, { ...enemy(9, 0, 0), kind: "hulk" } as never);
    soulTick(t);
    expect(t.player.bySouls).toBe(S.boss + K.byFeast.extra);
  });

  it("실제로 처치하면 영혼이 몸에 쌓임", () => {
    const s = by([[80 + B.reach - 4, 100, 1]]);
    stepSim(s, hit);
    idle(s, 2);
    expect(s.player.bySouls).toBe(1);
  });

  it("혼 부름: 필요한 영혼이 줄어듦", () => {
    expect(soulNeed(by([], 0, "byCall").player)).toBe(Math.round(S.need1 * K.byCall.need));
  });

  it("유령팔: 게이지 3칸부터 에너지 참격이 멀리 날아가 기본 베기보다 먼 적도 맞힘", () => {
    const far = 80 + B.reach + 50;
    const s0 = by([[far, 100]], 2);
    stepSim(s0, hit);
    idle(s0, 30);
    expect(s0.enemies[0]!.hp).toBe(99999);
    const s = by([[far, 100]], 3);
    stepSim(s, hit);
    idle(s, 30);
    expect(s.enemies[0]!.hp).toBeLessThan(99999);
  });

  it("혼령참: 확률로 나감 (0%면 안 나감)", () => {
    const old = K.byWraith.chance;
    K.byWraith.chance = 0;
    try {
      const none = by([], 3, "byWraith");
      stepSim(none, hit);
      expect(none.player.byShots!.filter((sh) => sh.kind === 1).length).toBe(0);
    } finally {
      K.byWraith.chance = old;
    }
  });

  it("혼령참 망령 하나 · 삼위령이면 셋 · 위백도는 망령에 닿은 적에게 소용돌이 3번", () => {
    const old = K.byWraith.chance;
    K.byWraith.chance = 1;
    onTestFinished(() => void (K.byWraith.chance = old));
    const one = by([], 3, "byWraith");
    stepSim(one, hit);
    expect(one.player.byShots!.filter((sh) => sh.kind === 1).length).toBe(1);
    const three = by([], 3, "byWraith", "byTrinity");
    stepSim(three, hit);
    expect(three.player.byShots!.filter((sh) => sh.kind === 1).length).toBe(3);
    const w = by([[160, 100]], 3, "byWraith", "byWhirl");
    stepSim(w, hit);
    idle(w, 20);
    expect(w.player.byWhirls!.length + w.effects.filter((f) => f.kind === "byWhirl").length).toBeGreaterThan(0);
    idle(w, 40);
    expect(w.player.byWhirls!.length).toBe(0);
  });

  it("(진)대태도가 떨어져 아래 적에게 피해 · 랑이면 뒤로 맵 끝까지 이어 떨어짐", () => {
    sure(["byGreat"], () => {
      const s = by([[150, 100]], 3, "byGreat");
      stepSim(s, hit);
      expect(s.player.bySwords!.filter((w) => w.kind === 0).length).toBe(1);
      const wolf = by([[150, 100], [ROOM_MAX_X - 10, 100]], 3, "byGreat", "byGreatWolf");
      stepSim(wolf, hit);
      const swords = wolf.player.bySwords!.filter((w) => w.kind === 0);
      expect(swords.length).toBeGreaterThan(3);
      expect(Math.max(...swords.map((w) => w.x))).toBeGreaterThan(ROOM_MAX_X - K.byGreatWolf.gap * 1.5);
      idle(wolf, K.byGreat.delay + K.byGreatWolf.every * K.byGreatWolf.max + 5);
      expect(wolf.enemies[1]!.hp).toBeLessThan(99999);
    });
  });

  it("(진)대태도-백: 범위 끝에 꽂혀 둘레 적에게 번개를 주기적으로", () => {
    sure(["byGreatWhite"], () => {
      const s = by([[80 + B.reach * 1.6, 100]], 3, "byGreatWhite");
      stepSim(s, hit);
      expect(s.player.bySwords!.filter((w) => w.kind === 1).length).toBe(1);
      idle(s, 10);
      const hp = s.enemies[0]!.hp;
      idle(s, K.byGreatWhite.every * 2);
      expect(s.enemies[0]!.hp).toBeLessThan(hp);
    });
  });

  it("(진)대태도-백은 맵에 하나만 · 사라지면 다시 생김", () => {
    sure(["byGreatWhite"], () => {
      const s = by([], 3, "byGreatWhite");
      for (let i = 0; i < 5; i++) {
        stepSim(s, hit);
        idle(s, 40);
      }
      expect(s.player.bySwords!.filter((w) => w.kind === 1).length).toBe(1);
      idle(s, K.byGreatWhite.life);
      expect(s.player.bySwords!.filter((w) => w.kind === 1).length).toBe(0);
      stepSim(s, hit);
      expect(s.player.bySwords!.filter((w) => w.kind === 1).length).toBe(1);
    });
  });

  it("청혼불: 기본 베기·참격 모두 청염 상태이상을 걸고 0.5초마다 피해", () => {
    const s = by([[80 + B.reach - 4, 100], [80 + B.reach + 50, 100]], 3, "byFlame");
    stepSim(s, hit);
    idle(s, 30);
    expect(s.enemies.every((e) => (e.bzFlameT ?? 0) > 0)).toBe(true);
    const hp = s.enemies[1]!.hp;
    idle(s, 31);
    expect(s.enemies[1]!.hp).toBeLessThan(hp);
  });

  it("이연참: 참격이 한 번 더", () => {
    sure(["byTwin"], () => {
      const s = by([], 3, "byTwin");
      stepSim(s, hit);
      expect(s.player.byShots!.filter((sh) => sh.kind === 0).length).toBe(2);
    });
  });

  it("혼의 가호: 받는 피해 감소", () => {
    expect(classTaken(by([], 0, "byGuard"), 100)).toBeLessThan(classTaken(by([], 0), 100));
  });
});
