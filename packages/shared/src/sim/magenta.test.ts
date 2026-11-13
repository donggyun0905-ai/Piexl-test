import { describe, expect, it } from "vitest";
import { MZ_BASE as B, MZ_CHARM as C, MZ_EXTRA as X, MZ_HEX as H, MZ_LV as L, MZ_SCENT as W, MZ_SKILLS as K } from "../itemsMagenta";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { mzBurst, mzHexAdd, mzTaken } from "./mzHex";
import { enemy } from "./perkTestUtil";

/** 마젠타 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function mz(foes: [number, number][] = [[140, 100]]): RunState {
  const s = createRun(7, "magenta");
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
/** 확률을 잠시 바꿔 실행 (추가 공격 · 매혹 · 향기 연기) */
function odds(extra: number, charm: number, scent: number, fn: () => void): void {
  const was = [X.chance, C.chance, W.chance] as const;
  [X.chance, C.chance, W.chance] = [extra, charm, scent];
  try {
    fn();
  } finally {
    [X.chance, C.chance, W.chance] = was;
  }
}

describe("마젠타", () => {
  it("욕망의 부채 하나 · 패시브 없음 · 1단계 자홍 저주비: 마우스 자리 약한 3타 + 저주 3겹", () => {
    const s = mz();
    expect(s.player.weaponId).toBe("mzFan");
    expect(s.player.passives.filter((id) => id !== "goddessBlessing")).toEqual([]);
    odds(0, 0, 0, () => {
      stepSim(s, hit);
      idle(s, B.s1.every * B.s1.hits);
    });
    expect(s.enemies[0]!.mzHex).toBe(B.s1.hits);
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * L.weak * B.s1.hits - 0.01);
    expect(s.player.dmgBy?.["k:mzBase1"]).toBeGreaterThan(0);
  });

  it("저주: 겹 수만큼 간격마다 저주 피해 · 최대 겹 · 맞지 않으면 풀림", () => {
    const s = mz();
    const e = s.enemies[0]!;
    mzHexAdd(s, e, 99);
    expect(e.mzHex).toBe(H.max);
    idle(s, H.every);
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * H.per * H.max, 2);
    idle(s, H.life);
    expect(e.mzHex).toBeUndefined();
  });

  it("저주 터뜨리기: 겹 수 × 배율 피해 · 겹이 사라짐", () => {
    const s = mz();
    const e = s.enemies[0]!;
    mzHexAdd(s, e, 4);
    const d = mzBurst(s, e, 2);
    expect(d).toBeCloseTo(s.player.stats.damage * H.burst * 2 * 4, 2);
    expect(e.mzHex).toBeUndefined();
  });

  it("매료의 향기: 매혹이면 받는 피해 +10% · 매혹 피해(분홍) · 마젠타 쪽으로 끌려옴 · 향기 연기 안이면 +10% 더", () => {
    const s = mz([[200, 100]]);
    odds(0, 1, 0, () => {
      s.player.nrBase = 3;
      s.enemies[0]!.x = 150;
      stepSim(s, hit);
    });
    const e = s.enemies[0]!;
    expect(e.mzCharm).toBeGreaterThan(s.tick);
    expect(mzTaken(s, e)).toBeCloseTo(1 + C.taken, 5);
    const x = e.x;
    idle(s, 30);
    expect(e.x).toBeLessThan(x);
    s.player.mzScents = [{ x: e.x, y: e.y, until: s.tick + 100 }];
    expect(mzTaken(s, e)).toBeCloseTo(1 + C.taken + W.taken, 5);
  });

  it("공격하면 확률로 방에 향기 연기 (최대 수)", () => {
    const s = mz();
    odds(0, 0, 1, () => {
      for (let i = 0; i < W.max + 3; i++) {
        stepSim(s, hit);
        idle(s, B.s1.cd);
      }
    });
    expect(s.player.mzScents?.length).toBe(W.max);
  });

  it("추가 공격 4단계 저주의 낙인: 저주를 새기고 잠시 뒤 터짐", () => {
    const s = mz();
    s.player.nrExtra = 4;
    s.player.nrBase = 3;
    odds(1, 0, 0, () => {
      stepSim(s, hit);
      expect(s.enemies[0]!.mzHex).toBe(B.s3.hex + X.brand.hex);
      idle(s, X.brand.delay + 2);
    });
    expect(s.player.dmgBy?.["k:mzExtra4"]).toBeGreaterThan(0);
  });

  it("스킬 1번 환상의 꽃감옥: 매혹 + 대기 · 강화판 환영 붕괴: 저주를 2배로 터뜨림", () => {
    const s = mz();
    odds(0, 0, 0, () => {
      stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 1 });
    });
    expect(s.enemies[0]!.mzCharm).toBeGreaterThan(s.tick);
    expect(s.player.nrSkillCd?.[0]).toBeGreaterThan(K.prison.cd - 3);
    const t = mz();
    t.player.nrSkillUp = [true, false, false, false];
    mzHexAdd(t, t.enemies[0]!, 5);
    odds(0, 0, 0, () => {
      stepSim(t, { ...EMPTY_INPUT, aimX: 100, skill: 1 });
    });
    expect(t.enemies[0]!.mzHex).toBeUndefined();
    expect(lost(t)).toBeGreaterThan(t.player.stats.damage * H.burst * K.collapse.burstMul * 5);
  });

  it("스킬 4번 강화 종언의 푸시아 성역: 방 전체 저주 가득 → 마지막에 3배로 터짐", () => {
    const s = mz([[140, 100], [300, 200]]);
    s.player.nrSkillUp = [false, false, false, true];
    odds(0, 0, 0, () => {
      stepSim(s, { ...EMPTY_INPUT, aimX: 100, skill: 4 });
      expect(s.enemies[1]!.mzHex).toBe(H.max);
      idle(s, K.end.hits * K.end.every + 4);
    });
    expect(s.player.mzEndAt).toBeUndefined();
    expect(lost(s, 1)).toBeGreaterThan(s.player.stats.damage * H.burst * K.end.burstMul * H.max);
  });

  it("같은 시드면 같은 결과 (결정성)", () => {
    const run = () => {
      const s = mz([[140, 100], [160, 130]]);
      for (let i = 0; i < 900; i++) stepSim(s, { ...hit, attack: i % 3 === 0, skill: i % 50 === 0 ? 1 + ((i / 50) % 4) : 0 });
      return s.enemies.map((e) => e.hp);
    };
    expect(run()).toEqual(run());
  });
});
