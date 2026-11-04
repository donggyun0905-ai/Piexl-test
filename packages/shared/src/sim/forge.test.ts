import { describe, expect, it } from "vitest";
import "../balanceTables";
import { CHARACTERS } from "../characters";
import { ITEM_TAGS } from "../itemsTags";
import { tagCounts } from "./buildSets";
import { generateFloor } from "./floor";
import { FORGE_OP, FORGE_RULES as R, forgeOf } from "./forge";
import { equipWeapon, recalcStats } from "./items";
import { createRun, stepSim } from "./run";
import { menuCode } from "./station";
import { EMPTY_INPUT, type RunState } from "./types";

const menu = (s: RunState, op: number, a = 0, b = 0) => stepSim(s, { ...EMPTY_INPUT, menu: menuCode(op, a, b) });

/** 대장간 방에 선 판 (돈 넉넉히) */
function inForge(seed = 3): RunState {
  const s = createRun(seed, "warden");
  s.map.rooms[s.roomId]!.type = "forge";
  s.gold = 9999;
  return s;
}

describe("대장간", () => {
  it("2층부터 층마다 확률로 하나", () => {
    let seen = 0;
    for (let seed = 1; seed < 60; seed++) {
      expect(generateFloor(seed, 1).rooms.some((r) => r.type === "forge")).toBe(false);
      const n = generateFloor(seed, 3).rooms.filter((r) => r.type === "forge").length;
      expect(n).toBeLessThanOrEqual(1);
      seen += n;
    }
    expect(seen).toBeGreaterThan(20);
  });

  it("강화: 처음은 반드시 성공 · 단계만큼 피해가 오르고 돈을 냄", () => {
    const s = inForge();
    const dmg = s.player.stats.damage;
    const gold = s.gold;
    menu(s, FORGE_OP.up);
    expect(forgeOf(s.player).lv).toBe(1);
    expect(s.player.stats.damage).toBeCloseTo(dmg * (1 + R.UP_DMG));
    expect(s.gold).toBe(gold - R.UP_COST);
  });

  it("강화는 그 무기에만 남음 (바꿨다 다시 들면 그대로)", () => {
    const s = inForge();
    const first = s.player.weaponId;
    menu(s, FORGE_OP.up);
    const other = Object.keys(CHARACTERS.drifter).length ? CHARACTERS.drifter.startWeapon : first;
    equipWeapon(s, other);
    recalcStats(s);
    expect(forgeOf(s.player).lv).toBeUndefined();
    equipWeapon(s, first);
    expect(forgeOf(s.player).lv).toBe(1);
  });

  it("꼬리표 변환: 대장간마다 처음 1번 무료 · 무기·패시브 꼬리표가 세트에 들어감", () => {
    const s = inForge();
    s.player.passives.push("sturdyHeart");
    const gold = s.gold;
    const fire = ITEM_TAGS.indexOf("fire");
    menu(s, FORGE_OP.tag, 0, fire);
    expect(s.gold).toBe(gold);
    expect(tagCounts(s.player).fire).toBe(1);
    menu(s, FORGE_OP.tag, 1, fire);
    expect(s.gold).toBe(gold - R.TAG_COST);
    expect(tagCounts(s.player).fire).toBe(2);
  });

  it("암흑 강화: 성공하면 암흑 단계 · 실패하면 무기 파괴 (처음 무기로, 기록 지움)", () => {
    let ok = false;
    let broke = false;
    for (let seed = 1; seed < 40 && !(ok && broke); seed++) {
      const s = inForge(seed);
      const w = s.player.weaponId;
      menu(s, FORGE_OP.up);
      menu(s, FORGE_OP.dark);
      if (forgeOf(s.player).dark === 1) ok = true;
      else {
        broke = true;
        expect(s.player.weaponId).toBe(CHARACTERS.warden.startWeapon);
        expect(s.player.forge?.[w]).toBeUndefined();
      }
    }
    expect(ok && broke).toBe(true);
  });

  it("대장간이 아닌 방에서는 아무 일도 없음", () => {
    const s = createRun(3, "warden");
    s.gold = 999;
    menu(s, FORGE_OP.up);
    expect(s.player.forge).toBeUndefined();
    expect(s.gold).toBe(999);
  });
});
