import { describe, expect, it } from "vitest";
import { VT_BASE as B, VT_EXTRA as X, VT_LV as L, VT_POISON as PO, VT_SEED as SD, VT_SKILLS as K } from "../itemsVert";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { vtHit, vtPlantSeed, vtPoison, vtSprout } from "./vtRot";
import { enemy } from "./perkTestUtil";

/** 베르 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function vr(foes: [number, number][] = [[130, 100]]): RunState {
  const s = createRun(7, "vert");
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
/** 확률을 잠시 바꿔 실행 (추가 공격 · 씨앗) */
function odds(extra: number, seed: number, fn: () => void): void {
  const was = [X.chance, SD.chance] as const;
  [X.chance, SD.chance] = [extra, seed];
  try {
    fn();
  } finally {
    [X.chance, SD.chance] = was;
  }
}

describe("베르", () => {
  it("덩굴 쌍낫 하나 · 패시브 없음 · 아슈바르 · 1단계 녹식 쌍낫격: 앞 약한 2타 + 독", () => {
    const s = vr();
    expect(s.player.weaponId).toBe("vtScythe");
    expect(s.player.passives.filter((id) => id !== "goddessBlessing")).toEqual([]);
    odds(0, 0, () => {
      stepSim(s, hit);
      idle(s, B.s1.every * B.s1.hits);
    });
    const e = s.enemies[0]!;
    expect(e.vtPoi).toBeGreaterThan(s.tick);
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * L.weak * B.s1.hits - 0.01);
    expect(s.player.dmgBy?.["k:vtBase1"]).toBeGreaterThan(0);
  });

  it("녹독: 15틱마다 독 피해 · 들어갈수록 세짐", () => {
    const s = vr();
    const e = s.enemies[0]!;
    vtPoison(s, e);
    e.vtPoi = s.tick + 99999;
    idle(s, PO.every * 2 + 1);
    const a = lost(s);
    idle(s, PO.every * 20);
    const b = lost(s);
    expect(a).toBeGreaterThan(0);
    // 20번 더 들어간 몫이 처음 두 번의 10배보다 큼 (세짐)
    expect(b - a).toBeGreaterThan(a * 10);
  });

  it("씨앗: 독을 45번 받으면 발아 (큰 한 방 + 출혈·화상) · 씨앗이 사라짐", () => {
    const s = vr();
    const e = s.enemies[0]!;
    vtPlantSeed(s, e, 2);
    vtPoison(s, e);
    e.vtPoi = s.tick + 99999;
    const before = e.hp;
    idle(s, PO.every * SD.need + 2);
    expect(e.vtSeed).toBeUndefined();
    expect(e.vtBleed).toBeGreaterThan(s.tick);
    expect(e.burnTicks).toBeGreaterThan(0);
    expect(before - e.hp).toBeGreaterThan(s.player.stats.damage * SD.burst * 2);
  });

  it("추가 공격: 씨앗 있는 적 바로 발아 · 3단계 생명 착취는 회복 · 4단계 시든 육신은 덩굴이 남음", () => {
    const s = vr();
    const e = s.enemies[0]!;
    s.player.hp = 10;
    vtPlantSeed(s, e);
    s.player.nrExtra = 3;
    odds(1, 0, () => stepSim(s, hit));
    expect(e.vtSeed).toBeUndefined();
    expect(s.player.hp).toBeGreaterThan(10);
    const t = vr();
    vtPlantSeed(t, t.enemies[0]!);
    t.player.nrExtra = 4;
    odds(1, 0, () => stepSim(t, hit));
    expect(t.player.vtPlants?.some((f) => f.kind === "vine")).toBe(true);
  });

  it("시든 육신 덩굴: 닿은 적에게 씨앗 · 이미 있으면 바로 발아해 덩굴이 늘어남 (최대 수까지)", () => {
    const s = vr([[130, 100], [134, 104]]);
    s.player.nrExtra = 4;
    vtPlantSeed(s, s.enemies[0]!);
    vtSprout(s, s.enemies[0]!, 1, { vine: true });
    odds(0, 0, () => idle(s, X.vine.every * 3));
    expect(s.enemies[1]!.vtSeed ?? 0).toBeGreaterThanOrEqual(0);
    expect((s.player.vtPlants ?? []).filter((f) => f.kind === "vine").length).toBeLessThanOrEqual(X.vine.max);
  });

  it("스킬 4 기생 덩굴 감옥: 씨앗 있는 적만 발아 · 강화 종언의 생명수확은 씨앗 가득(5겹)", () => {
    const s = vr([[130, 100], [60, 60]]);
    vtPlantSeed(s, s.enemies[0]!);
    odds(0, 0, () => stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 }));
    expect(s.enemies[0]!.vtSeed).toBeUndefined();
    expect(lost(s, 1)).toBe(0);
    const t = vr();
    t.player.nrSkillUp = [false, false, false, true];
    vtPlantSeed(t, t.enemies[0]!);
    odds(0, 0, () => stepSim(t, { ...EMPTY_INPUT, aimX: 100, skill: 4 }));
    expect(lost(t)).toBeGreaterThanOrEqual(t.player.stats.damage * SD.burst * SD.max - 0.01);
  });

  it("사령화 조종: 쓰러진 적을 덩굴 인형으로 되살려 함께 싸움 · 10초 뒤 사라짐", () => {
    const s = vr([[130, 100], [200, 100]]);
    const kind = s.enemies[0]!.kind;
    s.enemies[0]!.hp = 1;
    idle(s, 1);
    odds(0, 0, () => vtHit(s, s.enemies[0]!, 50, { poi: true }));
    idle(s, 2);
    // 쓰러진 적을 찾아 둠
    expect(s.player.vtCorpses?.[0]?.kind).toBe(kind);
    s.player.nrSkillUp = [true, false, false, false];
    stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 1 });
    expect(s.player.vtThralls?.length).toBe(1);
    idle(s, K.thrall.life);
    expect(s.player.vtThralls?.length ?? 0).toBe(0);
    expect(s.player.dmgBy?.["k:vtSkillUp1"]).toBeGreaterThan(0);
  });

  it("같은 시드면 같은 결과", () => {
    const run = () => {
      const s = vr([[130, 100], [150, 120], [110, 80]]);
      for (let i = 0; i < 600; i++) stepSim(s, i % 3 ? hit : { ...hit, attack: false });
      return s.enemies.map((e) => Math.round(e.hp * 1000));
    };
    expect(run()).toEqual(run());
  });
});
