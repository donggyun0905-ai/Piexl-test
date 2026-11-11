import { describe, expect, it } from "vitest";
import { ASURA_PASSIVES, ASURA_PERKS as K } from "../itemsAsura";
import { ASURA_AWAKE as A, ASURA_FIST as F } from "../weaponsAsura";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { classTaken, foeTaken } from "./classTaken";
import { startAwake } from "./asAwake";
import { enemy } from "./perkTestUtil";

/** 아수라 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function as(foes: [number, number][] = [[105, 100]], ...perks: string[]): RunState {
  const s = createRun(7, "asura");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.enemies = foes.map(([x, y], i) => ({ ...enemy(i + 1, x, y, 99999), rootTicks: 99999 }));
  return s;
}
const hit = { ...EMPTY_INPUT, attack: true, aimX: 100, aimY: 0 };
const idle = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
};
/** 확률 효과를 늘(1) 또는 안(0) 나오게 하고 fn 실행 */
function odds(set: Partial<Record<"asRapid" | "asDemon" | "asUlt", number>>, fn: () => void): void {
  const old = Object.keys(set).map((k) => [k, K[k as "asRapid"].chance] as const);
  for (const [k, v] of Object.entries(set)) K[k as "asRapid"].chance = v!;
  try {
    fn();
  } finally {
    for (const [k, v] of old) K[k as "asRapid"].chance = v;
  }
}
const lost = (s: RunState, i = 0) => 99999 - s.enemies[i]!.hp;

describe("아수라", () => {
  it("전용 패시브 20개 (모두 효과 아이템)", () => {
    expect(Object.keys(ASURA_PASSIVES).length).toBe(20);
    expect(Object.values(ASURA_PASSIVES).every((v) => v.exclusive === "asura" && v.effect)).toBe(true);
  });

  it("누르면 앞을 넓게 침 · 먼 적·뒤의 적은 안 맞음 · 다시 치기까지 기다림", () => {
    const s = as([[80 + F.reach, 100 + F.r - 4], [300, 100], [40, 100]]);
    odds({ asUlt: 0 }, () => stepSim(s, hit));
    expect(lost(s, 0)).toBeGreaterThan(0);
    expect(lost(s, 1)).toBe(0);
    expect(lost(s, 2)).toBe(0);
    const after = lost(s, 0);
    stepSim(s, hit);
    expect(lost(s, 0)).toBe(after);
    expect(s.effects.some((f) => f.kind === "asPunch")).toBe(true);
  });

  it("분쇄: 피해를 6번으로 나눠 한 틱에 한 번씩 · 합은 같음", () => {
    const a = as();
    stepSim(a, hit);
    const whole = lost(a);
    const b = as(undefined, "asCrush");
    stepSim(b, hit);
    const first = lost(b);
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(whole);
    idle(b, K.asCrush.n);
    expect(lost(b) / whole).toBeCloseTo(ASURA_PASSIVES.asCrush.mods[0]!.mul!, 1);
  });

  it("귀진: 영역 안 적에게 표식 · 받는 피해 증가 (밖의 적은 그대로)", () => {
    const s = as([[100, 100], [300, 100]], "asField");
    idle(s, 1);
    expect(foeTaken(s, s.enemies[0]!)).toBeCloseTo(1 + K.asField.taken);
    expect(foeTaken(s, s.enemies[1]!)).toBe(1);
  });

  it("파동: 공격 끝에 앞 부채꼴 (주먹이 안 닿는 거리도)", () => {
    const s = as([[80 + K.asWave.r - 4, 100]], "asWave");
    odds({ asUlt: 0 }, () => {
      stepSim(s, hit);
      expect(lost(s)).toBe(0);
      idle(s, K.asWave.delay + 1);
    });
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.effects.some((f) => f.kind === "asWave")).toBe(true);
  });

  it("연발: 한 틱에 한 번씩 15번 · 악귀는 한 대마다 붉게 터짐", () => {
    const s = as(undefined, "asRapid", "asDemon");
    odds({ asRapid: 1, asDemon: 1 }, () => {
      stepSim(s, hit);
      expect(s.player.asRapids!.length).toBe(1);
      idle(s, K.asRapid.hits);
    });
    expect(s.player.asRapids!.length).toBe(0);
    expect(s.effects.filter((f) => f.kind === "asDemon").length).toBeGreaterThan(K.asRapid.hits / 2);
  });

  it("아수라 각성: 1·2타 → 1·2타 → 3타(바닥 3번) → 4타(기절) 차례로 · 10초 뒤 끝", () => {
    const s = as([[100, 100]], "asUlt");
    s.enemies[0]!.rootTicks = 0;
    startAwake(s);
    const kinds: string[] = [];
    const seen = new Set<object>();
    for (let i = 0; i < 90; i++) {
      stepSim(s, hit);
      for (const f of s.effects) {
        if (!f.kind.startsWith("asAwk") || seen.has(f)) continue;
        seen.add(f);
        kinds.push(f.kind);
      }
    }
    expect(kinds.slice(0, 6)).toEqual(["asAwk12", "asAwk12", "asAwk3", "asAwk3", "asAwk3", "asAwk4"]);
    expect(s.enemies[0]!.stunTicks ?? 0).toBeGreaterThan(0);
    s.enemies = [];
    idle(s, A.ticks);
    expect(s.player.asAwake).toBe(0);
  });

  it("육비 난무: 가까운 적에게 귀신 주먹이 날아가 때림", () => {
    const s = as([[180, 100]], "asFlying");
    odds({ asUlt: 0 }, () => {
      stepSim(s, hit);
      expect(s.player.asFists!.length).toBe(1);
      idle(s, 30);
    });
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("귀신 걸음: 대시 뒤 다음 주먹이 넓게 · 귀갑: 받는 피해 줄어듦", () => {
    const s = as([[80 + F.reach * 2, 100 + F.r * 1.6]], "asStep");
    s.player.asDash = true;
    idle(s, 1);
    expect(s.player.asStepBig).toBe(true);
    odds({ asUlt: 0 }, () => stepSim(s, hit));
    expect(lost(s)).toBeGreaterThan(0);
    const g = as(undefined, "asShell");
    expect(classTaken(g, 10)).toBeLessThan(classTaken(as(), 10));
  });
});
