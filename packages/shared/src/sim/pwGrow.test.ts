import { describe, expect, it } from "vitest";
import { PW_GROW } from "../pwRules";
import { PW_BASIC, PW_LEGEND, PW_SHOP_IDS } from "../pwShop";
import { spotXY } from "./paewangGrid";
import { allPlayers, useSeat } from "./party";
import { createPvp, stepPvp } from "./pvp";
import { addXp, buyPlan, GROW_MENU, growMenu, homeOf, reward } from "./pwGrow";
import { gearHits } from "./pwGear";
import { EMPTY_INPUT } from "./types";
import { PW_ARENAS } from "../paewangMaps";
import { PW_CONTEST } from "../pwRules";
import { TICK_RATE } from "../constants";
import { capCenter } from "./pwCapture";
import { contestTick, towersLeft } from "./pwContest";

const fresh = () => createPvp(5, "contest", [{ characterId: "warden" }], "gContest");

describe("패왕전 성장 대결 (쟁탈전)", () => {
  it("병사 돈: 막타는 다, 근처 같은 편은 일부 (쟁탈전만)", () => {
    const s = fresh();
    const pv = s.pvp!;
    const ally = pv.seats.findIndex((x, i) => i > 0 && x.team === pv.seats[0]!.team);
    const far = pv.seats.findIndex((x, i) => i > 0 && i !== ally && x.team === pv.seats[0]!.team);
    const ps = allPlayers(s);
    [ps[ally]!.x, ps[ally]!.y] = [s.player.x + 20, s.player.y];
    [ps[far]!.x, ps[far]!.y] = [s.player.x + PW_GROW.near * 3, s.player.y];
    const gold = (i: number) => (useSeat(s, i), s.gold);
    const before = [0, ally, far].map(gold);
    useSeat(s, 0);
    reward(s, 0, "minion", s.player.x, s.player.y, 1 - pv.seats[0]!.team);
    const after = [0, ally, far].map(gold);
    useSeat(s, 0);
    expect(after[0]! - before[0]!).toBe(PW_GROW.gold.minion);
    expect(after[1]! - before[1]!).toBe(Math.round(PW_GROW.gold.minion * PW_GROW.nearGold));
    expect(after[2]).toBe(before[2]);
  });

  it("가운데: 주인이 생긴 뒤로는 상대 포탑이 남아 있어도 다시 빼앗을 수 있음 · 주인만 있으면 상대 점령도가 줄어듦", () => {
    const s = fresh();
    const g = s.pvp!.grow!;
    const [cx, cy] = capCenter(PW_ARENAS[s.pvp!.arena]);
    allPlayers(s).forEach((p, i) => ([p.x, p.y] = i === 0 ? [cx, cy] : homeOf(s, s.pvp!.seats[i]!.team)));
    const me = s.pvp!.seats[0]!.team;
    g.owner = 1 - me;
    expect(towersLeft(s, 1 - me)).toBe(2);
    for (let t = 0; t < (PW_CONTEST.centerSec * TICK_RATE) / 2; t++) contestTick(s);
    const half = g.center[me]!;
    expect(half).toBeGreaterThan(40);
    // 상대(주인)만 가운데에 → 내 점령도가 줄어듦
    allPlayers(s).forEach((p, i) => ([p.x, p.y] = s.pvp!.seats[i]!.team === me ? homeOf(s, me) : [cx, cy]));
    for (let t = 0; t < 60; t++) contestTick(s);
    expect(g.center[me]).toBeLessThan(half - 5);
    allPlayers(s).forEach((p, i) => ([p.x, p.y] = i === 0 ? [cx, cy] : homeOf(s, s.pvp!.seats[i]!.team)));
    for (let t = 0; t < PW_CONTEST.centerSec * TICK_RATE; t++) contestTick(s);
    expect(g.owner).toBe(me);
  });

  it("시작: 모두 1레벨·처음 돈 · 편마다 포탑 둘 · 집 보스", () => {
    const s = fresh();
    for (const p of allPlayers(s)) expect(p.pwLv).toBe(1);
    expect(s.gold).toBe(PW_GROW.goldStart);
    const g = s.pvp!.grow!;
    expect(g.units.filter((u) => u.kind === "tower")).toHaveLength(4);
    expect(g.units.filter((u) => u.kind === "boss")).toHaveLength(2);
  });

  it("레벨: 최대 18 · 오르면 체력·공격력 함께 · 증강 레벨이면 셋 중 고르기", () => {
    const s = fresh();
    const p = s.player;
    const [hp, dmg] = [p.stats.maxHp, p.stats.damage];
    addXp(s, 0, 1e6);
    expect(p.pwLv).toBe(PW_GROW.maxLv);
    expect(p.stats.maxHp).toBeGreaterThan(hp * 2);
    expect(p.stats.damage).toBeGreaterThan(dmg * 1.5);
    expect(p.pwOffer).toHaveLength(3);
    growMenu(s, GROW_MENU.aug + 1);
    expect(p.pwAug).toHaveLength(1);
    expect(p.pwOffer).toBeUndefined();
  });

  it("집 상점: 집에서만 · 기본 장비 · 전설은 재료를 쓰고 모자란 값은 더 냄 · 금기된 아티팩트는 하나만", () => {
    const s = fresh();
    const p = s.player;
    s.gold = 10000;
    const buy = (id: string) => growMenu(s, GROW_MENU.buy + PW_SHOP_IDS.indexOf(id));
    [p.x, p.y] = spotXY([36, 36]);
    buy("whetstone");
    expect(p.pwGear).toEqual([]);
    [p.x, p.y] = homeOf(s, 0);
    const dmg = p.stats.damage;
    buy("whetstone");
    expect(p.pwGear).toEqual(["whetstone"]);
    expect(p.stats.damage).toBeGreaterThan(dmg);
    expect(buyPlan(s, "relicRed")!.cost).toBe(PW_LEGEND.relicRed!.cost + PW_BASIC.whetstone!.cost * 2 + PW_BASIC.furySeal!.cost);
    buy("relicRed");
    expect(p.pwGear).toEqual(["relicRed"]);
    expect(buyPlan(s, "relicBlue")).toBeNull();
    buy("potion");
    expect(p.useSlots).toContain("potion");
  });

  it("중첩: 상대 캐릭터를 때리면 쌓이고 5초 지나면 사라짐", () => {
    const s = fresh();
    s.player.pwGear = ["relicRed"];
    stepPvp(s, [EMPTY_INPUT]);
    gearHits(s, [{ to: 5, by: 0, amt: 10 }, { to: 5, by: 0, amt: 10 }]);
    expect(s.player.pwStk?.relicRed?.[0]).toBe(2);
    for (let i = 0; i < PW_GROW.stackKeep + 200; i++) stepPvp(s, [EMPTY_INPUT]);
    useSeat(s, 0);
    expect(s.player.pwStk?.relicRed).toBeUndefined();
  });

  it("병사 무리가 나와 길을 따라 걷고, AI끼리 경험치·돈을 얻음 · 같은 시드는 같은 결과", () => {
    const play = () => {
      const s = createPvp(9, "contest", [{ characterId: "warden", ai: true }], "gContest");
      for (let i = 0; i < 90 * 60; i++) stepPvp(s, [EMPTY_INPUT]);
      return s;
    };
    const s = play();
    expect(s.pvp!.grow!.units.some((u) => u.kind === "minion")).toBe(true);
    expect(Math.max(...allPlayers(s).map((p) => p.pwLv ?? 1))).toBeGreaterThan(1);
    expect(allPlayers(play()).map((p) => [p.pwLv, p.pwXp, p.x])).toEqual(allPlayers(s).map((p) => [p.pwLv, p.pwXp, p.x]));
  }, 60000);
});
