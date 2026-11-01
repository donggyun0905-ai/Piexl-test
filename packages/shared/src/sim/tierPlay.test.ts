import { describe, expect, it } from "vitest";
import { checkDeath, createRun } from "./run";

describe("관리자 티어 플레잉 판", () => {
  it("로그에서는 쓰러져도 체력 가득으로 되살아나고 횟수만 셈 · 라스트 보스에서는 쓰러지면 끝", () => {
    const s = createRun(3, "warden");
    s.tierPlay = { deaths: 0 };
    s.player.hp = 0;
    expect(checkDeath(s)).toBe(false);
    expect(s.player.hp).toBe(s.player.stats.maxHp);
    expect(s.tierPlay.deaths).toBe(1);
    s.lastBoss = "dragon";
    s.player.hp = 0;
    expect(checkDeath(s)).toBe(true);
    expect(s.tierPlay.deaths).toBe(1);
  });

  it("보통 판은 그대로 끝남", () => {
    const s = createRun(3, "warden");
    s.player.hp = 0;
    expect(checkDeath(s)).toBe(true);
  });
});
