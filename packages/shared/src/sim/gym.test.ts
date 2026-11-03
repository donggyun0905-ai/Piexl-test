import { describe, expect, it } from "vitest";
import { generateFloor } from "./floor";
import "../balanceTables";
import { PERKS } from "../perks";
import { DEVIL_PASSIVES } from "../itemsDevil";
import { HIDDEN_PASSIVES } from "../itemsHidden";
import { GYM_OFF, GYM_OP, GYM_RULES, GYM_STATS, gymBlocked, gymPassives, gymPassiveStep, gymUsed } from "./gym";
import { fxKeys, GYM_FX_RULES, withGymFx } from "./gymPerks";
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
    // 흡혈은 목록에서 뺌 (눌러도 안 오름)
    menu(s, menuCode(GYM_OP.up, GYM_STATS.indexOf("lifesteal")));
    expect(s.player.gym!.lv.lifesteal).toBeUndefined();
    expect(s.player.gym!.pts).toBe(4);
    expect(s.player.stats.damage).toBeCloseTo(dmg * (1 + 2 * GYM_RULES.damage));
    expect(s.player.stats.maxHp).toBe(hp + GYM_RULES.maxHp);
    // 패시브: 가진 첫 패시브 (없으면 하나 넣고)
    if (!s.player.passives.length) s.player.passives.push("whetstone");
    menu(s, menuCode(GYM_OP.up, 32));
    expect(s.player.gym!.lv[`p:${s.player.passives[0]}`]).toBe(1);
  });

  it("4·5·6층 단련의 방마다 다시 포인트 (바로 다 써도 다음 층에서 또 받음, 3층 합 30)", () => {
    const s = createRun(5, "warden");
    let total = 0;
    for (const f of [4, 5, 6]) {
      startFloor(s, f);
      const gym = s.map.rooms.find((r) => r.type === "gym")!;
      const from = s.map.rooms.find((r) => r.exits.includes(gym.id))!;
      s.roomId = from.id;
      s.rooms[from.id]!.cleared = true;
      goThrough(s, from.exits.indexOf(gym.id));
      expect(gymUsed(s)).toBe(false);
      menu(s, menuCode(GYM_OP.result, f % 3, 1000 / 20));
      total += s.player.gym!.pts;
      const on = GYM_STATS.map((_, i) => i).filter((i) => !GYM_OFF.includes(GYM_STATS[i]!));
      for (let i = 0; i < 10; i++) menu(s, menuCode(GYM_OP.up, on[(f + i) % on.length]!));
      expect(s.player.gym!.pts).toBe(0);
    }
    expect(total).toBe(30);
  });

  it("패시브 강화는 좋은 몫만 키움 (무거운 갑옷: 체력만 오르고 이동 속도 −는 그대로) · 능력치 없는 패시브는 공격력", () => {
    expect(gymPassiveStep("heavyPlate")).toEqual([{ stat: "maxHp", add: 40 * GYM_RULES.passiveBoost }]);
    expect(gymPassiveStep("ricochet")).toEqual([]);
  });

  it("악마의 거래·히든 아이템은 단련 목록에 안 나옴", () => {
    const s = createRun(5, "warden");
    const hidden = Object.keys(HIDDEN_PASSIVES)[0]! as (typeof s.player.passives)[number];
    s.player.passives.push("devilReaper", "devilScream", hidden, "chainBurst");
    const list = gymPassives(s.player) as string[];
    expect(list).toContain("chainBurst");
    expect(list.filter((id) => id in DEVIL_PASSIVES || id in HIDDEN_PASSIVES)).toEqual([]);
  });

  it("효과 패시브는 그 효과 수치를 단계마다 키움 (그 사람에게만, 게임 한 틱 동안) · 올릴 수치가 없으면 단련 목록에 안 나옴", () => {
    const s = createRun(5, "warden");
    s.player.passives.push("chainBurst", "pet");
    s.player.gym = { pts: 0, lv: { "p:chainBurst": 5 }, rooms: [] };
    const raw = PERKS.chainBurst.radius;
    let seen = 0;
    withGymFx(s, () => (seen = PERKS.chainBurst.radius));
    expect(seen).toBeCloseTo(raw * (1 + 5 * GYM_FX_RULES.perLv));
    // 틱 밖(화면·관리자)에서는 원래 값
    expect(PERKS.chainBurst.radius).toBe(raw);
    // 단련 안 한 사람은 원래 값
    s.player.gym.lv = {};
    withGymFx(s, () => (seen = PERKS.chainBurst.radius));
    expect(seen).toBe(raw);
    const ids = gymPassives(s.player);
    expect(ids).toContain("chainBurst");
    expect(ids).not.toContain("pet");
    expect(fxKeys("chainBurst").map(([k]) => k)).toEqual(expect.arrayContaining(["radius", "damage"]));
  });

  it("효과가 없는 캐릭터는 막음: 거너 최대 체력(고정) · 버려진 자들 공격 속도(무기 고정) · 기계공학자 치명타(광선은 치명타 없음)", () => {
    for (const [c, k] of [["gunner", "maxHp"], ["abandoned", "attackSpeed"], ["engineer", "critChance"]] as const) {
      const s = createRun(5, c);
      s.player.gym = { pts: 3, lv: {}, rooms: [] };
      expect(gymBlocked(s.player, k)).toBe(true);
      menu(s, menuCode(GYM_OP.up, GYM_STATS.indexOf(k)));
      expect(s.player.gym.pts).toBe(3);
      expect(gymBlocked(s.player, "damage")).toBe(false);
    }
  });
});

