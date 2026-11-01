import { describe, expect, it } from "vitest";
import { generateFloor } from "./floor";
import { GYM_OP, GYM_RULES, GYM_STATS, gymUsed } from "./gym";
import { goThrough, startFloor } from "./rooms";
import { menuCode } from "./station";
import { createRun, stepSim } from "./run";
import { EMPTY_INPUT, type RunState } from "./types";

const menu = (s: RunState, code: number) => stepSim(s, { ...EMPTY_INPUT, menu: code });

describe("단련의 방", () => {
  it("4층부터 층마다 하나 (3층까지는 없음)", () => {
    for (let seed = 1; seed < 6; seed++) {
      for (const f of [1, 2, 3]) expect(generateFloor(seed, f).rooms.filter((r) => r.type === "gym")).toHaveLength(0);
      for (const f of [4, 5, 6]) expect(generateFloor(seed, f).rooms.filter((r) => r.type === "gym")).toHaveLength(1);
    }
  });

  it("들어가면 기구 셋 · 미니게임 점수로 포인트 (셋 중 하나만) · 포인트로 능력치·패시브 강화", () => {
    const s = createRun(5, "warden");
    startFloor(s, 4);
    const gym = s.map.rooms.find((r) => r.type === "gym")!;
    // 바로 앞 칸 방에서 출구로 들어감
    const from = s.map.rooms.find((r) => r.exits.includes(gym.id))!;
    s.roomId = from.id;
    s.rooms[from.id]!.cleared = true;
    goThrough(s, from.exits.indexOf(gym.id));
    expect(s.map.rooms[s.roomId]!.type).toBe("gym");
    expect(s.rooms[s.roomId]!.pickups.filter((p) => p.kind === "gym")).toHaveLength(3);
    // 750점 → 포인트 7
    menu(s, menuCode(GYM_OP.result, 1, 750 / 20));
    expect(gymUsed(s)).toBe(true);
    expect(s.player.gym!.pts).toBe(7);
    // 다른 기구는 못 씀
    menu(s, menuCode(GYM_OP.result, 0, 1000 / 20));
    expect(s.player.gym!.pts).toBe(7);
    // 공격력 2단계 · 체력 1단계
    const dmg = s.player.stats.damage;
    const hp = s.player.stats.maxHp;
    menu(s, menuCode(GYM_OP.up, GYM_STATS.indexOf("damage")));
    menu(s, menuCode(GYM_OP.up, GYM_STATS.indexOf("damage")));
    menu(s, menuCode(GYM_OP.up, GYM_STATS.indexOf("maxHp")));
    expect(s.player.gym!.pts).toBe(4);
    expect(s.player.stats.damage).toBeCloseTo(dmg * (1 + 2 * GYM_RULES.damage));
    expect(s.player.stats.maxHp).toBe(hp + GYM_RULES.maxHp);
    // 패시브: 가진 첫 패시브 (없으면 하나 넣고)
    if (!s.player.passives.length) s.player.passives.push("whetstone");
    menu(s, menuCode(GYM_OP.up, 32));
    expect(s.player.gym!.lv[`p:${s.player.passives[0]}`]).toBe(1);
  });
});
