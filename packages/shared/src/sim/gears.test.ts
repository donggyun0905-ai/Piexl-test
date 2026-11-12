import { describe, expect, it } from "vitest";
import { GEARS_PASSIVES, GE_PERKS as K } from "../itemsGears";
import { GE_ATTACK as A } from "../weaponsGears";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { classTaken } from "./classTaken";
import { damagePlayer } from "./combat";
import { enemy } from "./perkTestUtil";

/** 기어스 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function ge(foes: [number, number][] = [[105, 100]], ...perks: string[]): RunState {
  const s = createRun(7, "gears");
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
type Chance = "geQuake" | "geThrow" | "geBarrage" | "geGuardian" | "geStorm" | "geMirror" | "geDome" | "geHex";
/** 확률 효과를 늘(1) 또는 안(0) 나오게 하고 fn 실행 */
function odds(set: Partial<Record<Chance, number>>, fn: () => void): void {
  const old = Object.keys(set).map((k) => [k, K[k as Chance].chance] as const);
  for (const [k, v] of Object.entries(set)) K[k as Chance].chance = v!;
  try {
    fn();
  } finally {
    for (const [k, v] of old) K[k as Chance].chance = v;
  }
}
const lost = (s: RunState, i = 0) => 99999 - s.enemies[i]!.hp;

describe("기어스", () => {
  it("전용 패시브 20개 (모두 효과 아이템)", () => {
    expect(Object.keys(GEARS_PASSIVES).length).toBe(20);
    expect(Object.values(GEARS_PASSIVES).every((v) => v.exclusive === "gears" && v.effect)).toBe(true);
  });

  it("쌍방패 강타: 앞 적만 · 두 번 나눠 맞음", () => {
    const s = ge([[80 + A.reach, 100], [300, 100], [30, 100]]);
    stepSim(s, hit);
    const first = lost(s);
    expect(first).toBeGreaterThan(0);
    idle(s, A.gap + 1);
    expect(lost(s)).toBeGreaterThan(first);
    expect(lost(s, 1)).toBe(0);
    expect(lost(s, 2)).toBe(0);
  });

  it("공격력 아이템은 반만 적용 · 방어력: 받는 피해가 줄어듦", () => {
    const s = ge();
    expect(s.player.stats.damage).toBe(5);
    expect(classTaken(s, 10)).toBeCloseTo(10 * A.taken);
    // 대지 분쇄 공격력 ×1.05 · 실베르 성장 ×1.01 → 둘 다 반만
    const r = ge([], "geQuake");
    expect(r.player.stats.damage).toBeCloseTo(5 * (1 + 0.05 * A.dmgItem) * (1 + 0.01 * A.dmgItem));
  });

  it("구체: 대시로 켜고 굴러감 · 무적 없음(피해 감소) · 벽에 튕김 · 다시 누르면 풀림", () => {
    const s = ge([]);
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: -100 });
    expect(s.player.geBall).toBe(true);
    expect(s.player.dashTicks).toBe(0);
    for (let i = 0; i < 80; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.geBallDx).toBeGreaterThan(0);
    const hp = s.player.hp;
    s.player.invulnTicks = 0;
    damagePlayer(s, 10);
    expect(s.player.hp).toBeLessThan(hp);
    expect(hp - s.player.hp).toBeCloseTo(10 * A.taken * 0.7);
    for (let i = 0; i < 12; i++) stepSim(s, EMPTY_INPUT);
    stepSim(s, { ...EMPTY_INPUT, dash: true });
    expect(s.player.geBall).toBe(false);
  });

  it("구체가 적에게 부딪히면 적도 피해", () => {
    const s = ge([[120, 100]]);
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    for (let i = 0; i < 20; i++) stepSim(s, EMPTY_INPUT);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.effects.some((f) => f.kind === "geBump")).toBe(true);
  });

  it("천상의 수호자: 방패에 부딪힌 적이 60번 맞음 (한 대마다 기록)", () => {
    const s = ge([[80 + K.geGuardian.reach, 100]], "geGuardian");
    odds({ geGuardian: 1 }, () => stepSim(s, hit));
    expect(s.player.geGuard).toBeGreaterThan(0);
    let n = 0;
    for (let i = 0; i < 70; i++) {
      stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
      if (s.player.geLogT === s.tick) n += (s.player.geLog ?? []).length;
    }
    expect(n).toBeGreaterThanOrEqual(K.geGuardian.hits);
  });

  it("청뢰 방패 폭풍: 둘레 적이 30번 맞음", () => {
    const s = ge([[80, 150]], "geStorm");
    odds({ geStorm: 1 }, () => stepSim(s, hit));
    let n = 0;
    for (let i = 0; i < 80; i++) {
      stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
      if (s.player.geLogT === s.tick) n += (s.player.geLog ?? []).filter((h) => h.id === 1).length;
    }
    expect(n).toBe(K.geStorm.hits);
  });

  it("맞으면: 보호막 돔(공격 무효) · 육각 방벽(겹치지 않음) · 거울 반격", () => {
    const s = ge([[120, 100]], "geDome", "geHex", "geMirror");
    odds({ geDome: 1, geHex: 1, geMirror: 1 }, () => damagePlayer(s, 10));
    expect(s.player.shieldTicks).toBeGreaterThan(0);
    expect(s.player.shieldPts).toBe(K.geHex.pts);
    expect(lost(s)).toBeGreaterThan(0);
    const hp = s.player.hp;
    s.player.invulnTicks = 0;
    damagePlayer(s, 10);
    expect(s.player.hp).toBe(hp);
  });

  it("방패 던지기 · 대지 분쇄 · 연속 방패타", () => {
    const s = ge([[150, 100], [80 + A.reach, 100]], "geThrow", "geQuake", "geBarrage");
    odds({ geThrow: 1, geQuake: 1, geBarrage: 1 }, () => stepSim(s, hit));
    idle(s, 50);
    expect(lost(s, 0)).toBeGreaterThan(0);
    expect(s.player.dmgBy?.geQuake ?? 0).toBeGreaterThan(0);
    expect(s.player.dmgBy?.geBarrage ?? 0).toBeGreaterThan(0);
    expect(s.player.dmgBy?.geThrow ?? 0).toBeGreaterThan(0);
  });

  it("시드가 같으면 결과가 같음", () => {
    const run = () => {
      const s = ge([[105, 100], [150, 120]], ...Object.keys(GEARS_PASSIVES));
      for (let i = 0; i < 300; i++) stepSim(s, { ...hit, dash: i % 97 === 0 });
      return [s.enemies.map((e) => e.hp), s.player.x, s.player.y];
    };
    expect(run()).toEqual(run());
  });
});
