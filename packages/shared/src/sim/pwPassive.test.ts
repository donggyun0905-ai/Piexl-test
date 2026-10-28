import { describe, expect, it } from "vitest";
import { PW_PASSIVE as P } from "../paewangPassive";
import { allPlayers, useSeat } from "./party";
import { createPvp } from "./pvp";
import { syncProxies } from "./pvpWorld";
import { plagueCut, passiveCast, passiveHitMul, passiveTick } from "./pwPassive";

const duel = (a: string, b: string) => {
  const s = createPvp(5, "duel", [{ characterId: a as never }, { characterId: b as never, ai: true }]);
  syncProxies(s);
  useSeat(s, 0);
  return s;
};

describe("패왕전 전용 패시브", () => {
  it("장수: 기본 공격을 이어 맞히면 다음 한 방이 세지고 기절", () => {
    const s = duel("general", "mage");
    const e = s.pvp!.proxies[1]!;
    const t = allPlayers(s)[1]!;
    for (let i = 0; i < P.generalN; i++) expect(passiveHitMul(s, e, 1, t)).toBe(1);
    expect(passiveHitMul(s, e, 1, t)).toBeCloseTo(P.generalMul);
    expect(e.stunTicks).toBe(P.generalStun);
  });

  it("사멸: 다섯 번째 기본 공격마다 3배 · 스킬 피해는 세지 않음", () => {
    const s = duel("samyeol", "mage");
    const e = s.pvp!.proxies[1]!;
    const t = allPlayers(s)[1]!;
    const muls = Array.from({ length: P.samyeolN }, () => passiveHitMul(s, e, 1, t));
    expect(muls.at(-1)).toBeCloseTo(P.samyeolMul);
    s.pvp!.src = 1;
    for (let i = 0; i < P.samyeolN; i++) expect(passiveHitMul(s, e, 1, t)).toBe(1);
  });

  it("역병의사에게 맞으면 3초 동안 회복이 줄어듦", () => {
    const s = duel("plague", "mage");
    const t = allPlayers(s)[1]!;
    passiveHitMul(s, s.pvp!.proxies[1]!, 1, t);
    expect(plagueCut(s, t)).toBeCloseTo(P.plagueHeal);
    s.tick += P.plagueTicks + 1;
    expect(plagueCut(s, t)).toBe(1);
  });

  it("파수꾼: 체력이 반 아래면 한 판에 한 번 보호막", () => {
    const s = duel("warden", "mage");
    const p = s.player;
    p.hp = p.stats.maxHp * 0.3;
    const before = p.shieldPts ?? 0;
    passiveTick(s);
    expect(p.shieldPts).toBeCloseTo(before + p.stats.maxHp * P.wardenShield);
    p.shieldPts = 0;
    passiveTick(s);
    expect(p.shieldPts).toBe(0);
  });

  it("변희: 스킬마다 이동 → 받는 피해 → 공격 속도 버프 순환", () => {
    const s = duel("byeonhui", "mage");
    for (let i = 0; i < 3; i++) passiveCast(s);
    const b = s.player.pwBuffs!;
    expect([b[0]!.move, b[1]!.taken, b[2]!.rate]).toEqual([P.morphMove, P.morphTaken, P.morphRate]);
  });
});
