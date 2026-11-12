import { describe, expect, it } from "vitest";
import { RAVEN_PASSIVES, RV_PERKS as K } from "../itemsRaven";
import { RV_ATTACK as A, RV_CHECK } from "../weaponsRaven";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy } from "./perkTestUtil";
import { rvSkills } from "./rvSkills";

const HP = 9999999;
/** 레이븐 (80, 100) 오른쪽을 봄 · 적은 묶어 둠 */
function rv(foes: [number, number][] = [[80 + A.slamReach, 100]], ...perks: string[]): RunState {
  const s = createRun(7, "chessRaven");
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
/** 확률 하나를 잠깐 1로 */
function sure(id: keyof typeof K, fn: () => void): void {
  const o = K[id] as { chance: number };
  const old = o.chance;
  o.chance = 1;
  try {
    fn();
  } finally {
    o.chance = old;
  }
}
const lost = (s: RunState, i = 0) => HP - s.enemies[i]!.hp;
const fx = (s: RunState, kind: string) => s.effects.filter((e) => e.kind === kind).length;

describe("레이븐", () => {
  it("전용 패시브 20개 (모두 효과 아이템)", () => {
    expect(Object.keys(RAVEN_PASSIVES).length).toBe(20);
    expect(Object.values(RAVEN_PASSIVES).every((v) => v.exclusive === "chessRaven" && v.effect)).toBe(true);
  });

  it("킹 내려찍기 → 퀸 빛기둥 번갈아 · 킹이 체크를 붙이고 퀸이 터뜨림 (체크메이트)", () => {
    const s = rv([[80 + A.slamReach, 100], [80 + A.pillarReach, 100]]);
    stepSim(s, hit);
    const dmg = s.player.stats.damage;
    expect(fx(s, "rvSlam")).toBe(1);
    expect(lost(s, 0)).toBeCloseTo(dmg * A.slamMul, 3);
    expect(lost(s, 1)).toBe(0);
    expect(s.enemies[0]!.rvCheck).toBeGreaterThan(s.tick + RV_CHECK.ticks - 3);
    // 다음 공격은 퀸: 체크 안 된 먼 적은 빛기둥만
    idle(s, A.cd);
    s.enemies[1]!.rvCheck = s.tick + 100;
    stepSim(s, hit);
    expect(fx(s, "rvPillar")).toBe(1);
    expect(fx(s, "rvMatePop")).toBe(1);
    expect(lost(s, 1)).toBeCloseTo(dmg * (A.pillarMul + RV_CHECK.mul), 3);
    expect(s.enemies[1]!.rvCheck).toBeUndefined();
    // 그다음은 다시 킹
    idle(s, A.cd);
    stepSim(s, hit);
    expect(s.player.rvStep).toBe(1);
  });

  it("폰 진군: 금빛 폰 5~8개가 한 줄로 돌진해 앞의 적을 침", () => {
    const s = rv([[180, 100]], "rvPawn");
    sure("rvPawn", () => stepSim(s, hit));
    const n = s.player.rvUnits!.filter((u) => u.kind === "pawn").length;
    expect(n).toBeGreaterThanOrEqual(K.rvPawn.min);
    expect(n).toBeLessThanOrEqual(K.rvPawn.max);
    idle(s, 40);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("나이트 도약: L자로 뛰어 적 자리를 내려찍음", () => {
    const s = rv([[160, 140]], "rvKnight");
    sure("rvKnight", () => stepSim(s, hit));
    expect(fx(s, "rvKnight")).toBe(1);
    idle(s, K.rvKnight.fly + 1);
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * K.rvKnight.mul, 3);
  });

  it("비숍: 양쪽 대각선 광선 (대각선 위 적만)", () => {
    const s = rv([[140, 160], [200, 100]], "rvBishop");
    sure("rvBishop", () => stepSim(s, hit));
    idle(s, K.rvBishop.delay + 1);
    expect(lost(s, 0)).toBeCloseTo(s.player.stats.damage * K.rvBishop.mul, 3);
    expect(lost(s, 1)).toBe(0);
  });

  it("룩 철벽: 성벽이 돌진하며 적을 밀어냄", () => {
    const s = rv([[130, 100]], "rvRook");
    sure("rvRook", () => stepSim(s, hit));
    idle(s, 20);
    expect(s.enemies[0]!.x).toBeGreaterThan(140);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("퀸 칙령: 8방향 검격", () => {
    const s = rv([[80, 40]], "rvQueen");
    sure("rvQueen", () => stepSim(s, hit));
    idle(s, K.rvQueen.delay + 1);
    expect(s.player.rvUnits!.filter((u) => u.kind === "blade").length).toBe(8);
    idle(s, 20);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("킹 심판: 내려와 짓누름 · 기절", () => {
    const s = rv([[200, 100]], "rvKing");
    s.enemies[0]!.rootTicks = 0;
    sure("rvKing", () => stepSim(s, hit));
    expect(lost(s)).toBe(0);
    idle(s, K.rvKing.fall + 1);
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * K.rvKing.mul, 3);
    expect(s.enemies[0]!.stunTicks).toBeGreaterThan(0);
  });

  it("폰의 승격: 적에게 닿으면 거대한 퀸으로 폭발", () => {
    const s = rv([[150, 100]], "rvPromote");
    sure("rvPromote", () => stepSim(s, hit));
    idle(s, 40);
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * K.rvPromote.mul - 1);
    expect(s.player.rvUnits!.some((u) => u.kind === "promo")).toBe(false);
  });

  it("왕실의 합동 공세: 나이트 → 비숍 → 룩 차례로", () => {
    const s = rv([[180, 100]], "rvAssault");
    sure("rvAssault", () => stepSim(s, hit));
    idle(s, K.rvAssault.knightAt + 1);
    const a = lost(s);
    expect(a).toBeGreaterThan(0);
    idle(s, K.rvAssault.bishopAt - K.rvAssault.knightAt);
    expect(lost(s)).toBeGreaterThan(a);
    idle(s, K.rvAssault.rookAt - K.rvAssault.bishopAt + 1);
    expect(s.player.rvUnits!.some((u) => u.kind === "rook")).toBe(true);
  });

  it("스킬은 전용 패시브를 먹어야 열림", () => {
    expect(rvSkills(rv().player)).toEqual([1, 1, 1, 1]);
    const s = rv([[100, 100]], "rvBoard");
    expect(rvSkills(s.player)[0]).toBe(0);
    idle(s, 1, 1);
    expect(rvSkills(s.player)[0]).toBeGreaterThan(0.9);
  });

  it("왕국의 체스판: 판 안 적은 더 맞음 · 스킬 1이면 고른 칸마다 금빛 기둥", () => {
    const s = rv([[120, 100]], "rvBoard");
    idle(s, 1, 1);
    expect(fx(s, "rvBoardHit")).toBe(K.rvBoard.pillars);
    idle(s, K.rvBoard.delay + 2);
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * K.rvBoard.mul * K.rvBoard.taken, 3);
  });

  it("체크메이트: 기물 8개가 둘러싸 묶고 가운데를 한꺼번에", () => {
    const s = rv([[140, 100]], "rvMate");
    s.enemies[0]!.rootTicks = 0;
    idle(s, 1, 2);
    expect(fx(s, "rvMateRing")).toBe(1);
    expect(s.enemies[0]!.stunTicks).toBeGreaterThan(K.rvMate.hold);
    idle(s, K.rvMate.hold + 22);
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * (K.rvMate.mul * 8 + K.rvMate.final), 3);
  });

  it("캐슬링: 앞으로 자리를 바꾸고 방어막 · 두고 온 룩이 충격파", () => {
    const s = rv([[80, 100]], "rvCastle");
    s.enemies[0]!.y = 130;
    idle(s, 1, 3);
    expect(s.player.x).toBeGreaterThan(80 + K.rvCastle.dist * 0.9);
    expect(s.player.shieldPts).toBeGreaterThan(0);
    idle(s, 8);
    expect(lost(s)).toBeCloseTo(s.player.stats.damage * K.rvCastle.mul, 3);
  });

  it("그랜드 체크메이트: 기물이 차례로 덮치고 끝에 십자 빛", () => {
    const s = rv([[200, 100]], "rvGrand");
    idle(s, 1, 4);
    expect(fx(s, "rvGrand")).toBe(1);
    idle(s, K.rvGrand.cross + 2);
    const dmg = s.player.stats.damage;
    expect(lost(s)).toBeCloseTo(dmg * (K.rvGrand.mul * K.rvGrand.hits + K.rvGrand.crossMul), 2);
  });

  it("갬빗: 처치하면 회복하고 금빛 폰", () => {
    const s = rv([[80 + A.slamReach, 100], [200, 100]], "rvGambit");
    s.enemies[0]!.hp = 1;
    s.player.hp = 10;
    stepSim(s, hit);
    idle(s, 2);
    expect(s.player.hp).toBeGreaterThan(10);
    expect(s.player.rvUnits!.some((u) => u.kind === "gold")).toBe(true);
  });

  it("같은 시드면 같은 결과", () => {
    const all = Object.keys(RAVEN_PASSIVES);
    const run = () => {
      const s = rv([[150, 100], [120, 60], [60, 160]], ...all);
      for (let i = 0; i < 400; i++) stepSim(s, { ...hit, skill: i % 50 === 0 ? 1 + ((i / 50) % 4) : 0 });
      return s.enemies.map((e) => Math.round(e.hp));
    };
    expect(run()).toEqual(run());
  });
});
