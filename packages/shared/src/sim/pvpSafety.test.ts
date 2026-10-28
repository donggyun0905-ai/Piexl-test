import { describe, expect, it } from "vitest";
import { PW } from "../paewangDefs";
import { pwLoadoutOk, pwWeapons } from "./paewangKit";
import { allPlayers } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { EMPTY_INPUT, type RunState } from "./types";

/** 사람 둘(가만히)의 1대1 · 0번 자리 쪽에서 1번 자리에 큰 폭발 */
function duel(c: "warden" | "titan"): RunState {
  const s = createPvp(3, "duel", [{ characterId: "warden" }, { characterId: c }]);
  for (const p of allPlayers(s)) p.invulnTicks = 0;
  // 시작 준비(3초 멈춤)는 건너뜀
  s.tick = PW.ready;
  const foe = allPlayers(s)[1]!;
  s.pendingBlasts.push({ tick: s.tick + 1, x: foe.x, y: foe.y, radius: 20, damage: 99999 });
  return s;
}

describe("패왕전 안전장치", () => {
  it("오니 히든 무기(흑뢰봉·청전)는 패왕전에 없음", () => {
    expect(pwWeapons("oni")).not.toContain("blackThunder");
    expect(pwWeapons("oni")).not.toContain("azureThunder");
    expect(pwLoadoutOk("oni", { weapon: "blackThunder", passives: [], uses: [] })).toBe(false);
  });

  it("한 번에 받는 피해는 최대 체력의 일정 비율까지", () => {
    const s = duel("warden");
    const foe = allPlayers(s)[1]!;
    const pool = foe.hp + (foe.shieldPts ?? 0);
    stepPvp(s, [EMPTY_INPUT, EMPTY_INPUT]);
    expect(pool - foe.hp - (foe.shieldPts ?? 0)).toBeGreaterThan(0);
    expect(pool - foe.hp - (foe.shieldPts ?? 0)).toBeLessThanOrEqual((foe.stats.maxHp + PW.shield) * PW.burstCap + 1);
    expect(foe.hp).toBeGreaterThan(0);
  });

  it("받는 피해가 줄어드는 캐릭터(거인)도 남은 체력보다 큰 피해면 쓰러짐", () => {
    const s = duel("titan");
    const foe = allPlayers(s)[1]!;
    foe.hp = 5;
    foe.shieldPts = 0;
    stepPvp(s, [EMPTY_INPUT, EMPTY_INPUT]);
    expect(foe.hp).toBe(0);
    expect(s.pvp!.seats[1]!.on).toBe(false);
  });
});
