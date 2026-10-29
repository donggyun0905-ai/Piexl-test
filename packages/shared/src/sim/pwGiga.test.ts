import { describe, expect, it } from "vitest";
import { PW_GIGA } from "../pwRules";
import { PW_LEGEND } from "../pwShop";
import { createPvp, stepPvp } from "./pvp";
import { canCraft, GIGA_MENU, gigaDeath, gigaMenu } from "./pwGiga";
import { EMPTY_INPUT } from "./types";

const fresh = () => {
  const s = createPvp(8, "giganto", [{ characterId: "warden" }], "gGiga", ["oni"]);
  for (let i = 0; i < 200; i++) stepPvp(s, [EMPTY_INPUT]);
  return s;
};

describe("패왕전 기간토마키아", () => {
  it("30명 · 밴된 캐릭터는 AI에 없음 · 뿔 거인 붉은 3·푸른 5·흰 9 · 상자", () => {
    const s = fresh();
    expect(s.pvp!.seats).toHaveLength(30);
    expect(s.party!.some((x) => x.player.characterId === "oni")).toBe(false);
    const u = s.pvp!.grow!.units;
    expect(u.filter((x) => x.kind === "giantRed")).toHaveLength(3);
    expect(u.filter((x) => x.kind === "giantBlue")).toHaveLength(5);
    expect(u.filter((x) => x.kind === "giantWhite")).toHaveLength(9);
    expect(s.pvp!.grow!.loot!.filter((l) => l.chest).length).toBeGreaterThan(PW_GIGA.chests - 10);
  });

  it("상자 열기(F) → 돈은 바로, 물건은 창에서 골라 배낭에 · 가득이면 안 들어감 · 금고는 죽어도 남음 · 나머지는 떨굼", () => {
    const s = fresh();
    const p = s.player;
    const l = s.pvp!.grow!.loot![0]!;
    l.items = ["whetstone", "g:chips"];
    l.gold = 50;
    [p.x, p.y] = [l.x, l.y];
    stepPvp(s, [{ ...EMPTY_INPUT, interact: true }]);
    expect(s.gold).toBe(50);
    expect(p.pwOpen).toBe(l.id);
    expect(p.pwBag).toEqual([]);
    gigaMenu(s, GIGA_MENU.take + 1);
    gigaMenu(s, GIGA_MENU.take);
    expect(p.pwBag).toEqual(["g:chips", "whetstone"]);
    p.pwBag = ["g:chips", "whetstone"];
    expect(p.pwGear).toEqual(["whetstone"]);
    gigaMenu(s, GIGA_MENU.vault);
    expect(p.pwVault).toBe("g:chips");
    const before = s.pvp!.grow!.loot!.length;
    gigaDeath(s);
    expect(p.pwBag).toEqual([]);
    expect(p.pwVault).toBe("g:chips");
    expect(s.pvp!.grow!.loot!.length).toBe(before + 1);
  });

  it("제작: 재료가 배낭에 다 있고 돈이 되면 3초 가만히 → 전설 장비", () => {
    const s = fresh();
    const p = s.player;
    p.pwBag = ["regenCharm", "regenCharm"];
    s.gold = 0;
    expect(canCraft(s, "relicGreen")).toBe(false);
    s.gold = PW_LEGEND.relicGreen!.cost;
    gigaMenu(s, GIGA_MENU.craft + Object.keys(PW_LEGEND).indexOf("relicGreen"));
    for (let i = 0; i < PW_GIGA.craftHold + 2; i++) stepPvp(s, [EMPTY_INPUT]);
    expect(p.pwBag).toEqual(["relicGreen"]);
    expect(s.gold).toBeLessThan(PW_LEGEND.relicGreen!.cost);
  });

  it("같은 시드는 같은 결과 (AI 29명이 한동안 움직여도)", () => {
    const play = () => {
      const s = createPvp(3, "giganto", [{ characterId: "warden", ai: true }], "gGiga");
      for (let i = 0; i < 20 * 60; i++) stepPvp(s, [EMPTY_INPUT]);
      return s.party!.map((x) => [x.player.x, x.player.pwBag?.length]);
    };
    expect(play()).toEqual(play());
  }, 60000);
});
