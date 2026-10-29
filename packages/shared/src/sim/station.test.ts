import { describe, expect, it } from "vitest";
import { checkProgress, decodeInputs, encodeInputs, summarize } from "../daily";
import { TUNE_SLOTS } from "../trackerParts";
import { afv, BENCH_OP, benchLv, isHidden, isOwn } from "./afBench";
import { createRun } from "./run";
import { spawnShop } from "./shop";
import { menuCode, stationMenu, TUNE_OP } from "./station";
import { tuneVal } from "./trTune";
import { recalcStats } from "./items";
import { EMPTY_INPUT, type RunState } from "./types";

/** 지금 방에 상점을 놓고 돈을 줌 */
function shop(char: "artifacter" | "tracker", floor = 1): RunState {
  const s = createRun(5, char);
  s.floor = floor;
  if (floor === 7) s.lastBoss = "dragon";
  s.rooms[s.roomId]!.pickups = [];
  spawnShop(s, s.roomId);
  s.gold = 5000;
  return s;
}

/** 같은 일을 시드만 바꿔 여러 번: 성공·실패 둘 다 나오는지 */
function tries(n: number, fn: (seed: number) => boolean): boolean[] {
  return Array.from({ length: n }, (_, i) => fn(i + 1));
}

describe("작업대", () => {
  it("아티팩터는 모든 상점이 제작대 하나 · 추적자는 라스트 보스 층만 튜닝소 · 다른 캐릭터는 보통 상점", () => {
    expect(shop("artifacter").rooms[0]!.pickups.map((p) => p.kind)).toEqual(["bench"]);
    expect(shop("artifacter", 7).rooms[0]!.pickups.map((p) => p.kind)).toEqual(["bench"]);
    expect(shop("tracker", 7).rooms[0]!.pickups.map((p) => p.kind)).toEqual(["tune"]);
    expect(shop("tracker").rooms[0]!.pickups.some((p) => p.kind === "passive")).toBe(true);
  });

  it("강화: 50% · 성공하면 단계가 오르고 수치가 커짐 · 돈을 내고 구매 기록에 남음", () => {
    const got = tries(12, (seed) => {
      const s = shop("artifacter");
      s.seed = seed;
      s.player.passives = ["afFocus"];
      stationMenu(s, menuCode(BENCH_OP.up, 0));
      expect(s.gold).toBeLessThan(5000);
      expect(s.buys.at(-1)).toMatchObject({ kind: "bench", itemId: String(BENCH_OP.up) });
      if (benchLv(s.player, "afFocus") === 1) expect(afv(s.player, "afFocus", "mul")).toBeCloseTo(1.375);
      return benchLv(s.player, "afFocus") === 1;
    });
    expect(got).toContain(true);
    expect(got).toContain(false);
  });

  it("합치기: 일반 패시브 둘 → 자기 패시브 하나 · 교체: 자기 → 다른 자기, 일반 → 다른 일반", () => {
    const s = shop("artifacter");
    s.player.passives = ["whetstone", "sturdyHeart", "afFocus"];
    stationMenu(s, menuCode(BENCH_OP.fuse, 0, 1));
    expect(s.player.passives).toHaveLength(2);
    expect(isOwn(s.player.passives[0]!)).toBe(true);
    stationMenu(s, menuCode(BENCH_OP.swap, 1));
    expect(s.player.passives[1]).not.toBe("afFocus");
    expect(isOwn(s.player.passives[1]!)).toBe(true);
    s.player.passives.push("sturdyHeart");
    stationMenu(s, menuCode(BENCH_OP.swap, 2));
    expect(isOwn(s.player.passives[2]!)).toBe(false);
    expect(s.player.passives[2]).not.toBe("sturdyHeart");
  });

  it("튜닝: 성공하면 히든, 실패하면 부서짐", () => {
    const out = tries(12, (seed) => {
      const s = shop("artifacter");
      s.seed = seed;
      s.player.passives = ["afFocus"];
      stationMenu(s, menuCode(BENCH_OP.tune, 0));
      if (s.player.passives.length) expect(isHidden(s.player.passives[0]!)).toBe(true);
      return s.player.passives.length === 1;
    });
    expect(out).toContain(true);
    expect(out).toContain(false);
  });

  it("작업대가 없는 방·돈이 없으면 아무 일도 없음", () => {
    const s = createRun(5, "artifacter");
    s.player.passives = ["afFocus"];
    s.gold = 5000;
    stationMenu(s, menuCode(BENCH_OP.tune, 0));
    expect(s.player.passives).toEqual(["afFocus"]);
    const t = shop("artifacter");
    t.gold = 0;
    t.player.passives = ["afFocus"];
    stationMenu(t, menuCode(BENCH_OP.tune, 0));
    expect(t.player.passives).toEqual(["afFocus"]);
  });

  it("튜닝소: 부품을 갈아 끼우면 능력치가 바뀌고, 강화는 처음 100% · 실패하면 단계가 내려감", () => {
    const s = shop("tracker", 7);
    const range = s.player.stats.range;
    stationMenu(s, menuCode(TUNE_OP.swap, 0, 1));
    expect(s.player.trParts![0]).toBe(1);
    expect(s.player.stats.range).toBeCloseTo(range * 1.12);
    stationMenu(s, menuCode(TUNE_OP.up, 0));
    expect(s.player.trLv![0]).toBe(1);
    expect(tuneVal(s.player, "range")).toBeCloseTo(1 + 0.12 * 1.15);
    // 높은 단계에서는 실패도 나옴 (한 단계 내려감)
    s.player.trLv![0] = 6;
    const before = s.gold;
    const lv = tries(8, () => {
      s.player.trLv![0] = 6;
      stationMenu(s, menuCode(TUNE_OP.up, 0));
      return s.player.trLv![0] === 5;
    });
    expect(lv).toContain(true);
    expect(s.gold).toBeLessThan(before);
    recalcStats(s);
    expect(TUNE_SLOTS).toHaveLength(6);
  });

  it("입력 기록에 작업대 누름이 남고, 일일 도전 진행 기록 검사도 통과", () => {
    const list = [EMPTY_INPUT, { ...EMPTY_INPUT, menu: menuCode(BENCH_OP.fuse, 3, 4) }, EMPTY_INPUT, { ...EMPTY_INPUT, menu: 1, sell: 3 }];
    expect(decodeInputs(encodeInputs(list))).toEqual(list);
    const s = shop("artifacter");
    s.player.passives = ["afFocus"];
    s.gold = 200;
    s.goldEarned = 200;
    stationMenu(s, menuCode(BENCH_OP.up, 0));
    expect(checkProgress(s.seed, summarize(s))).not.toBe("buy");
  });
});
