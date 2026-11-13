import { describe, expect, it } from "vitest";
import { BC_BASE as B, BC_EXTRA as X, BC_LV as L, BC_POSSESS as P0, BC_SKILLS as K } from "../itemsBlanc";
import { keysFor } from "./bcPossess";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { enemy } from "./perkTestUtil";

/** 블랑 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function bn(foes: [number, number][] = [[130, 100]]): RunState {
  const s = createRun(7, "blanc");
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
const MOVE: [number, number][] = [[0, -100], [100, 0], [0, 100], [-100, 0]];
/** 방향 하나 누르고 손 뗌 */
const press = (s: RunState, d: number) => {
  stepSim(s, { ...EMPTY_INPUT, moveX: MOVE[d]![0], moveY: MOVE[d]![1] });
  stepSim(s, EMPTY_INPUT);
};
/** 확률을 잠시 바꿔 실행 (추가 공격) */
function odds(extra: number, fn: () => void): void {
  const was = X.chance;
  X.chance = extra;
  try {
    fn();
  } finally {
    X.chance = was;
  }
}
/** 대시 → 고르기 시작 */
const dash = (s: RunState) => stepSim(s, { ...EMPTY_INPUT, dash: true, aimX: 100 });

describe("블랑", () => {
  it("순백의 부채 하나 · 패시브 없음 · 아슈바르 · 1단계 순백의 부채무: 앞 약한 3타", () => {
    const s = bn();
    expect(s.player.weaponId).toBe("bcFan");
    expect(s.player.passives.filter((id) => id !== "goddessBlessing")).toEqual([]);
    odds(0, () => {
      stepSim(s, hit);
      idle(s, B.s1.every * B.s1.hits);
    });
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * L.weak * B.s1.hits - 0.01);
    expect(s.player.dmgBy?.["k:bcBase1"]).toBeGreaterThan(0);
  });

  it("백무: 대시 → 방향키 → 맞게 누르면 그 적 몸속 (무적) · 10초 뒤 큰 한 방 + 빠져나옴", () => {
    const s = bn();
    dash(s);
    const k = s.player.bcPick!;
    expect(k.cands).toHaveLength(1);
    expect(k.cands[0]![1]).toHaveLength(P0.keys);
    for (const d of k.cands[0]![1]) press(s, d);
    expect(s.player.bcPick).toBeUndefined();
    expect(s.player.bcHost).toBe(1);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    const before = lost(s);
    idle(s, P0.life + 2);
    expect(s.player.bcHost).toBeUndefined();
    expect(lost(s) - before).toBeGreaterThanOrEqual(s.player.stats.damage * P0.exitMul - 0.01);
  });

  it("틀린 방향을 누르면 실패: 그냥 대시 · 다음 빙의까지 10초", () => {
    const s = bn();
    dash(s);
    const want = s.player.bcPick!.cands[0]![1][0]!;
    press(s, (want + 1) % 4);
    expect(s.player.bcPick).toBeUndefined();
    expect(s.player.bcHost).toBeUndefined();
    expect(s.player.bcCd).toBeGreaterThan(P0.cdFail - 10);
  });

  it("몸속에서 공격하면 그 몬스터 공격으로 다른 적을 때림 · 스킬은 못 씀", () => {
    const s = bn([[130, 100], [150, 100]]);
    dash(s);
    const k = s.player.bcPick!;
    const [id, seq] = k.cands.find(([i]) => i === 1) ?? k.cands[0]!;
    for (const d of seq) press(s, d);
    expect(s.player.bcHost).toBe(id);
    const other = s.enemies.findIndex((e) => e.id !== id);
    s.enemies[other]!.x = s.player.x + 20;
    odds(0, () => stepSim(s, hit));
    expect(lost(s, other)).toBeGreaterThan(0);
    stepSim(s, { ...EMPTY_INPUT, skill: 1 });
    expect(s.player.nrSkillCd?.[0] ?? 0).toBe(0);
  });

  it("방향키 수: 영혼의 틈이면 3개 · 날개마다 1개 줄어듦 · 0개면 고르자마자 큰 한 방", () => {
    const s = bn();
    const e = s.enemies[0]!;
    e.bcRift = true;
    expect(keysFor(s.player, e)).toBe(P0.riftKeys);
    e.bcCut = 3;
    expect(keysFor(s.player, e)).toBe(0);
    dash(s);
    expect(s.player.bcPick).toBeUndefined();
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * P0.exitMul - 0.01);
  });

  it("성흔 인형극(3단계): 맞은 적이 같은 종류 적을 때림", () => {
    const s = bn([[130, 100], [145, 100]]);
    s.player.nrBase = 3;
    odds(0, () => {
      stepSim(s, hit);
      idle(s, B.s3.every * B.s3.hits + 2);
    });
    expect(s.enemies[0]!.bcPuppet).toBeGreaterThan(0);
    expect(s.player.dmgBy?.["k:bcBase3"]).toBeGreaterThan(0);
  });

  it("정화의 역설: 맞은 적이 주는 피해 절반", () => {
    const s = bn();
    s.player.nrSkillUp = [false, false, false, false];
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 2 });
    idle(s, K.paradox.every * K.paradox.hits + 2);
    expect(s.enemies[0]!.bcWeak).toBeGreaterThan(0);
  });

  it("종언의 무구한 지배: 방의 모든 적에게 차례로 빙의 · 빠져나올 때마다 큰 한 방", () => {
    const s = bn([[130, 100], [60, 150], [200, 60]]);
    s.player.nrSkillUp = [false, false, false, true];
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
    idle(s, K.dominion.stay * 3 + 4);
    expect(s.player.bcChain).toBeUndefined();
    for (let i = 0; i < 3; i++) expect(lost(s, i)).toBeGreaterThanOrEqual(s.player.stats.damage * P0.exitMul - 0.01);
    expect(s.player.bcLaters?.length).toBe(3);
  });
});
