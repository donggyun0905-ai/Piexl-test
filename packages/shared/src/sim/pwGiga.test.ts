import { describe, expect, it } from "vitest";
import { PW_GIGA } from "../pwRules";
import { PW_LEGEND } from "../pwShop";
import { createPvp, stepPvp } from "./pvp";
import { canCraft, GIGA_MENU, gigaDeath, gigaInput, gigaMenu } from "./pwGiga";
import { PW_ARENAS } from "../paewangMaps";
import { distanceField } from "./layout";
import { pwGrid, spotXY } from "./paewangGrid";
import { zonePos } from "./pvpZone";
import { buildingAt } from "./pwGigaRooms";
import { EMPTY_INPUT } from "./types";

const fresh = () => {
  const s = createPvp(8, "giganto", [{ characterId: "warden" }], "gGiga", ["oni"]);
  for (let i = 0; i < 200; i++) stepPvp(s, [EMPTY_INPUT]);
  return s;
};

describe("패왕전 기간토마키아", () => {
  it("30명 · 밴된 캐릭터는 AI에 없음 · 뿔 거인 수 · 상자", () => {
    const s = fresh();
    expect(s.pvp!.seats).toHaveLength(30);
    expect(s.party!.some((x) => x.player.characterId === "oni")).toBe(false);
    const u = s.pvp!.grow!.units;
    for (const k of ["giantRed", "giantBlue", "giantWhite"] as const) expect(u.filter((x) => x.kind === k)).toHaveLength(PW_GIGA.giants[k]);
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

  it("건물: 문 앞 F → 실내 · 실내 문 F → 밖 · 아파트 계단 · 실내 상자 · 들판에서 모든 문에 걸어서 닿음 · 실내는 문 자리로 자기장", () => {
    const s = fresh();
    const a = PW_ARENAS.gGiga;
    expect(a.buildings!.length).toBe(14);
    const field = distanceField(pwGrid("gGiga"), ...spotXY(a.spots[0]!));
    for (const d of a.portals!.filter((x) => x.kind === "in")) expect(field[d.at[1] * a.cols + d.at[0]], String(d.at)).toBeGreaterThanOrEqual(0);
    // 모든 실내 상자는 그 건물 1층에서 걸어서 닿음 (계단 쪽 층은 계단 자리에서)
    for (const d of a.portals!.filter((x) => x.kind === "in" || x.kind === "up")) {
      const f = distanceField(pwGrid("gGiga"), ...spotXY(d.to));
      const b = a.buildings![d.b]!;
      const floor = b.inside.find(([x0, y0, w, h]) => d.to[0] >= x0 && d.to[0] < x0 + w && d.to[1] >= y0 && d.to[1] < y0 + h)!;
      for (const c of b.chests.filter(([x, y]) => x >= floor[0] && x < floor[0] + floor[2] && y >= floor[1] && y < floor[1] + floor[3])) expect(f[c[1] * a.cols + c[0]], `${d.b} ${c}`).toBeGreaterThanOrEqual(0);
    }
    const p = s.player;
    const door = a.portals!.find((x) => x.kind === "in")!;
    [p.x, p.y] = spotXY(door.at);
    gigaInput(s, { ...EMPTY_INPUT, interact: true });
    expect(buildingAt(s, p.x, p.y)).toBe(door.b);
    expect(zonePos(s, p.x, p.y)[0]).toBeLessThan(a.outCols! * 16);
    expect(s.pvp!.grow!.loot!.filter((l) => buildingAt(s, l.x, l.y) === door.b).length).toBeGreaterThan(0);
    const out = a.portals!.find((x) => x.kind === "out" && x.b === door.b)!;
    [p.x, p.y] = spotXY(out.at);
    gigaInput(s, { ...EMPTY_INPUT, interact: true });
    expect(buildingAt(s, p.x, p.y)).toBe(-1);
  });
});
