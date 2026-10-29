import { describe, expect, it } from "vitest";
import { extraOf } from "./baseStats";
import { recalcStats } from "./items";
import { attackSpeedNow } from "./player";
import { createRun, stepSim } from "./run";
import { EMPTY_INPUT } from "./types";

describe("능력치가 바로 바뀜", () => {
  it("떨어진 신의 파편: 얻으면 능력치·추가 스탯에 바로 들어감", () => {
    const seen = new Set<number>();
    for (let seed = 1; seed <= 40; seed++) {
      const s = createRun(seed, "warden");
      const before = JSON.stringify([s.player.stats, extraOf(s.player)]);
      s.player.passives.push("godShard");
      recalcStats(s);
      const after = JSON.stringify([s.player.stats, extraOf(s.player)]);
      seen.add(s.player.shardPick!);
      expect(after).not.toBe(before);
    }
    expect(seen.size).toBeGreaterThan(5);
  });

  it("이터 광분: 먹은 적만큼 공격 속도가 지금 공격 속도에 보임", () => {
    const s = createRun(2, "eater");
    s.player.passives.push("eaFrenzy");
    const a = attackSpeedNow(s.player);
    s.player.eaEaten = 400;
    expect(attackSpeedNow(s.player)).toBeGreaterThan(a);
  });

  it("안전망: 패시브를 넣고 recalcStats를 안 불러도 0.5초 안에 능력치에 들어감", () => {
    const s = createRun(3, "warden");
    const hp = s.player.stats.maxHp;
    s.player.passives.push("sturdyHeart");
    for (let i = 0; i < 31; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.stats.maxHp).toBeGreaterThan(hp);
  });
});
