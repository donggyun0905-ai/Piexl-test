import { describe, expect, it } from "vitest";
import { BAEKINJANG_PASSIVES, BJ_PERKS as K } from "../itemsBaekinjang";
import { BJ_BLADES as F, BJ_DRONE as D } from "../weaponsBaekinjang";
import { bjSkills } from "./bjSkills";
import { foeTaken } from "./classTaken";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy } from "./perkTestUtil";

const HP = 9999999;
/** 백인장 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 · 드론은 따로 볼 때만 (피해 0) */
function bj(foes: [number, number][] = [[105, 100]], ...perks: string[]): RunState {
  const s = createRun(7, "baekinjang");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.enemies = foes.map(([x, y], i) => ({ ...enemy(i + 1, x, y, HP), rootTicks: 99999 }));
  return s;
}
const hit = { ...EMPTY_INPUT, attack: true, aimX: 100, aimY: 0 };
const idle = (s: RunState, n: number, skill = 0) => {
  for (let i = 0; i < n; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: i === 0 ? skill : 0 });
};
/** 값 몇 개를 잠깐 바꾸고 fn 실행 */
function tune<T extends object>(obj: T, set: Partial<T>, fn: () => void): void {
  const old = { ...obj };
  Object.assign(obj, set);
  try {
    fn();
  } finally {
    Object.assign(obj, old);
  }
}
const noDrone = (fn: () => void) => tune(D, { mul: 0 }, fn);
const lost = (s: RunState, i = 0) => HP - s.enemies[i]!.hp;
const fx = (s: RunState, kind: string) => s.effects.filter((e) => e.kind === kind).length;

describe("백인장", () => {
  it("전용 패시브 11개 (모두 효과 아이템)", () => {
    expect(Object.keys(BAEKINJANG_PASSIVES).length).toBe(11);
    expect(Object.values(BAEKINJANG_PASSIVES).every((v) => v.exclusive === "baekinjang" && v.effect)).toBe(true);
  });

  it("혈월 쌍검격: 앞의 적이 검격 둘에 맞음 · 뒤의 적은 안 맞음", () => {
    const s = bj([[80 + F.reach, 100], [30, 100]]);
    noDrone(() => stepSim(s, hit));
    expect(lost(s, 0)).toBeCloseTo(s.player.stats.damage * F.mul * 2, 3);
    expect(lost(s, 1)).toBe(0);
    expect(fx(s, "bjSlash")).toBe(1);
  });

  it("미니 창 드론 5기: 적을 쫓아가 찌르고 다시 돌아와 찌름", () => {
    const s = bj([[200, 100]]);
    idle(s, 1);
    expect(s.player.bjDrones!.length).toBe(D.n);
    idle(s, 60);
    const first = lost(s);
    expect(first).toBeGreaterThan(0);
    idle(s, 120);
    expect(lost(s)).toBeGreaterThan(first * 2);
  });

  it("콤보: 기본 → 적색 난무 → 선혈 회전참 → 섬광 돌진베기 (없는 기술은 건너뜀)", () => {
    const s = bj([[110, 100]], "bjFlurry", "bjSpin", "bjDash");
    const seen: string[] = [];
    noDrone(() => {
      for (let i = 0; i < 200 && seen.length < 5; i++) {
        const n = s.player.attackCount;
        stepSim(s, hit);
        if (s.player.attackCount > n) seen.push(String((s.player.bjStep! + 3) % 4));
      }
    });
    expect(seen).toEqual(["0", "1", "2", "3", "0"]);
    expect(s.player.x).toBeGreaterThan(80 + K.bjDash.step * 5);
    const t = bj([[110, 100]], "bjSpin");
    noDrone(() => {
      stepSim(t, hit);
      for (let i = 0; i < F.cd + 2; i++) stepSim(t, hit);
    });
    expect(fx(t, "bjSpin")).toBe(1);
  });

  it("확률 기술: 폭우·침격 15타 · 나선창 1타 · 충격파", () => {
    for (const [id, min] of [["bjRain", 14], ["bjNeedle", 14], ["bjSpear", 1], ["bjShock", 1]] as const) {
      const s = bj([[150, 100]], id);
      const hp0 = s.enemies[0]!.hp;
      let hits = 0;
      noDrone(() =>
        tune(K[id], { chance: 1 } as never, () => {
          stepSim(s, hit);
          tune(K[id], { chance: 0 } as never, () => {
            let hp = s.enemies[0]!.hp;
            if (hp < hp0) hits++;
            for (let i = 0; i < 80; i++) {
              stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
              if (s.enemies[0]!.hp < hp) hits++;
              hp = s.enemies[0]!.hp;
            }
          });
        }),
      );
      expect(hits, id).toBeGreaterThanOrEqual(min);
    }
  });

  it("스킬은 전용 패시브가 있어야 열림 · 적안 표식: 받는 피해 증가", () => {
    const s = bj([[150, 100]]);
    noDrone(() => idle(s, 2, 1));
    expect(lost(s)).toBe(0);
    expect(bjSkills(s.player)).toEqual([1, 1, 1, 1]);
    const t = bj([[150, 100]], "bjEye");
    noDrone(() => idle(t, 2, 1));
    expect(lost(t)).toBeGreaterThan(0);
    expect(foeTaken(t, t.enemies[0]!)).toBeCloseTo(1 + K.bjEye.taken, 5);
    expect(bjSkills(t.player)[0]).toBeGreaterThan(0.9);
  });

  it("혈철 감옥: 일반 적은 갇혀 계속 맞음 · 보스는 큰 피해와 출혈", () => {
    const s = bj([[150, 100]], "bjPrison");
    s.enemies[0]!.rootTicks = 0;
    noDrone(() => idle(s, 30, 2));
    expect(s.enemies[0]!.stunTicks).toBeGreaterThan(0);
    const b = bj([[150, 100]], "bjPrison");
    b.enemies[0]!.kind = "hulk";
    noDrone(() => idle(b, 2, 2));
    expect(lost(b)).toBeGreaterThan(b.player.stats.damage * K.bjPrison.bossMul * 0.9);
    expect(b.enemies[0]!.bjBleed).toBeGreaterThan(0);
  });

  it("사신의 팔연참: 죽음 상태이상 (보스는 반감)", () => {
    const s = bj([[150, 100], [160, 110]], "bjReaper");
    s.enemies[1]!.kind = "hulk";
    noDrone(() => idle(s, K.bjReaper.hits * K.bjReaper.every + 4, 3));
    expect(s.enemies[0]!.bjDeathDmg).toBeCloseTo(HP * K.bjReaper.pct, 3);
    expect(s.enemies[1]!.bjDeathDmg).toBeCloseTo((HP * K.bjReaper.pct) / K.bjReaper.bossDiv, 3);
  });

  it("종언의 붉은 날개: 180번 찌르고 살아남은 적에게 쌓인 피해를 한 번 더", () => {
    const s = bj([[150, 100], [60, 160]], "bjEnd");
    noDrone(() => idle(s, K.bjEnd.hits - 1, 4));
    const before = lost(s, 0);
    expect(s.enemies[0]!.bjSum).toBeCloseTo(before, 3);
    noDrone(() => idle(s, 2));
    expect(lost(s, 0)).toBeCloseTo(before * 2 + 0, 0);
    expect(fx(s, "bjCross")).toBe(2);
    expect(s.enemies[0]!.bjSum).toBeUndefined();
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const run = () => {
      const s = bj([[150, 100], [60, 160]], ...Object.keys(BAEKINJANG_PASSIVES));
      for (let i = 0; i < 300; i++) stepSim(s, { ...hit, skill: (i % 50) === 0 ? (i / 50) % 5 : 0 });
      return [s.enemies.map((e) => e.hp), s.player.x, s.player.bjDrones];
    };
    expect(run()).toEqual(run());
  });
});
