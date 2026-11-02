import { describe, expect, it } from "vitest";
import "../balanceTables";
import { DEVIL_PERKS } from "../itemsDevil";
import { AUCTION, GAMBLE, SECRET_KINDS, SECRET_WALL } from "../secretDefs";
import { auctionHere } from "./auction";
import { extraOf } from "./baseStats";
import { devilPact } from "./devil";
import { devilMul } from "./devilPerks";
import { cupState, GAMBLE_OP, gambleDone, gambleNow } from "./gamble";
import { enemy } from "./perkTestUtil";
import { practiceRoom } from "./practiceRoom";
import { continueToLastFloor, startFloor } from "./rooms";
import { menuCode } from "./station";
import { chestOptions, spillRewards } from "./trialRewards";
import { createRun, stepSim } from "./run";
import { crackSpot, rollCrack } from "./vault";
import { EMPTY_INPUT, type RunState } from "./types";
import { AUCTION_OP } from "./auction";

const step = (s: RunState, n = 1, input = EMPTY_INPUT) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};
const menu = (s: RunState, code: number) => stepSim(s, { ...EMPTY_INPUT, menu: code });

/** 연습장처럼 지금 방을 그 비밀의 방으로 */
function inRoom(kind: "devil" | "gamble" | "auction" | "crack", c = "warden" as const): RunState {
  const s = createRun(7, c);
  s.enemies = [];
  practiceRoom(s, kind);
  return s;
}

describe("금 간 벽", () => {
  it("히든 상점이 나오는 판의 전투방에서만, 대략 5%", () => {
    let n = 0;
    let all = 0;
    const kinds = new Set<string>();
    for (let seed = 1; seed < 400; seed++) {
      const s = createRun(seed, "warden");
      s.pilgrim = true;
      startFloor(s, 2);
      for (const r of s.map.rooms.filter((x) => x.type === "combat")) {
        all++;
        rollCrack(s, r.id);
        if (s.crack?.room === r.id) {
          n++;
          kinds.add(s.crack.kind);
        }
      }
      const off = createRun(seed, "warden");
      startFloor(off, 2);
      for (const r of off.map.rooms) rollCrack(off, r.id);
      expect(off.crack).toBeUndefined();
    }
    expect(n / all).toBeGreaterThan(SECRET_WALL.chance * 0.5);
    expect(n / all).toBeLessThan(SECRET_WALL.chance * 1.6);
    expect(kinds.size).toBe(SECRET_KINDS.length);
  });

  it("닿으면 무너지고, 잠시 뒤 문으로 비밀의 방 (출구는 원래 방과 같음)", () => {
    const s = createRun(3, "warden");
    startFloor(s, 1);
    const from = s.roomId;
    s.enemies = [];
    s.crack = { floor: 1, room: from, side: 0, pos: 100, kind: "gamble" };
    const at = crackSpot(s.crack);
    s.player.x = at.x + s.player.r;
    s.player.y = at.y;
    step(s);
    expect(s.crack.broke).toBeDefined();
    step(s, SECRET_WALL.crumble + 2);
    expect(s.map.rooms[s.roomId]!.type).toBe("gamble");
    expect(s.map.rooms[s.roomId]!.layer).toBe(-1);
    expect(s.map.rooms[s.roomId]!.exits).toEqual(s.map.rooms[from]!.exits);
    expect(s.rooms[s.roomId]!.pickups.some((p) => p.kind === "gambler")).toBe(true);
  });
});

describe("악마의 방", () => {
  it("거래: 최대 체력을 바치고 패시브 · 7층은 시작 → 단순 상점 → 보스", () => {
    const s = inRoom("devil");
    const offers = s.rooms[s.roomId]!.pickups.filter((p) => p.kind === "devil");
    expect(offers).toHaveLength(3);
    const pk = offers[0]!;
    const hp = s.player.stats.maxHp;
    s.player.x = pk.x;
    s.player.y = pk.y;
    stepSim(s, { ...EMPTY_INPUT, interact: true });
    expect(s.player.passives).toContain(pk.itemId);
    expect(s.player.stats.maxHp).toBeCloseTo(hp - DEVIL_PERKS[pk.itemId as keyof typeof DEVIL_PERKS].cost);
    expect(devilPact(s)).toBe(true);
    expect(s.player.blindTicks).toBeGreaterThan(0);
    continueToLastFloor(s, "dragon");
    expect(s.map.rooms.map((r) => r.type)).toEqual(["start", "shop", "exit"]);
    expect(s.map.rooms[1]!.heaven).toBeUndefined();
  });

  it("악마의 피 방어력 · 십자가 보스 피해 · 리퍼", () => {
    const s = inRoom("devil");
    const d0 = extraOf(s.player).defense;
    s.player.passives.push("devilBlood", "devilSpots", "whetstone");
    expect(extraOf(s.player).defense).toBeCloseTo(d0 + DEVIL_PERKS.devilBlood.defense + DEVIL_PERKS.devilSpots.defense + DEVIL_PERKS.devilSpots.per * 2); // 숫돌 · 악마의 피
    const e = enemy(1, 100, 100);
    expect(devilMul(s, e)).toBe(1);
    s.player.passives.push("devilReaper");
    expect(devilMul(s, e)).toBeCloseTo(1 + DEVIL_PERKS.devilReaper.taken);
  });
});

describe("도박꾼의 방", () => {
  it("다 섞인 뒤 당첨 상자를 고르면 패시브 5 · 300원 · 능력치 상자 2", () => {
    const s = inRoom("gamble");
    menu(s, menuCode(GAMBLE_OP, 0));
    const g = gambleNow(s)!;
    expect(cupState(g, s.tick).show).toBe(true);
    step(s, gambleDone(g) - s.tick);
    const slot = cupState(g, s.tick).slots[g.prize!]!;
    const before = s.rooms[s.roomId]!.pickups.length;
    s.player.x = 30;
    s.player.y = 30;
    menu(s, menuCode(GAMBLE_OP, slot + 1));
    expect(g.win).toBe(true);
    const got = s.rooms[s.roomId]!.pickups.slice(before);
    expect(got.filter((p) => p.kind === "passive")).toHaveLength(GAMBLE.passives);
    expect(got.filter((p) => p.kind === "coin")[0]!.price).toBe(GAMBLE.gold);
    expect(got.filter((p) => p.kind === "boon" && p.itemId === "ps")).toHaveLength(GAMBLE.picks);
    // 한 번만
    menu(s, menuCode(GAMBLE_OP, 0));
    expect(gambleNow(s)!.at).toBe(g.at);
  });

  it("꽝이면 능력치 둘이 깎임", () => {
    const s = inRoom("gamble");
    menu(s, menuCode(GAMBLE_OP, 0));
    const g = gambleNow(s)!;
    step(s, gambleDone(g) - s.tick);
    const slot = cupState(g, s.tick).slots[g.prize!]!;
    menu(s, menuCode(GAMBLE_OP, ((slot + 1) % 3) + 1));
    expect(g.win).toBe(false);
    expect(s.player.boons?.mods.filter((m) => m.mul === 1 - GAMBLE.down)).toHaveLength(GAMBLE.lose);
  });
});

describe("경매장", () => {
  it("값어치를 넘겨 부르면 낙찰 · 그림자 손님은 값어치를 넘지 않음 · 4번째부터 ???", () => {
    const s = inRoom("auction");
    s.gold = 5000;
    const a = auctionHere(s)!;
    expect(a.lots).toHaveLength(AUCTION.lots);
    menu(s, menuCode(AUCTION_OP, 0));
    let guard = 0;
    while (a.lot === 0 && guard++ < 3000) {
      if (a.lead !== 1) menu(s, menuCode(AUCTION_OP, 1));
      else step(s);
      expect(a.lead !== 2 || a.price <= a.lots[0]!.value).toBe(true);
    }
    const lot = a.lots[0]!;
    expect(lot.won).toBe(1);
    expect(lot.price).toBeGreaterThan(lot.value - AUCTION.step - 1);
    expect(s.gold).toBe(5000 - lot.price!);
    if (lot.kind === "passive") expect(s.player.passives).toContain(lot.id);
    else {
      expect(a.graft).toBe(0);
      menu(s, menuCode(AUCTION_OP, 10));
      expect(s.player.augments?.at(-1)?.skills).toEqual([lot.id]);
    }
    // 그냥 두면 그림자 손님이 가져감
    guard = 0;
    while (a.lot === 1 && guard++ < 3000) step(s);
    expect(a.lots[1]!.won).toBe(2);
    expect(a.lots[1]!.price).toBeLessThanOrEqual(a.lots[1]!.value);
  });
});

describe("경매장 의자", () => {
  it("의자에서 F로 앉으면 경매가 시작되고 움직여도 의자에 붙어 있음 · 다시 F면 일어남", () => {
    const s = inRoom("auction");
    const seat = s.rooms[s.roomId]!.pickups.find((p) => p.kind === "auction")!;
    s.player.x = seat.x;
    s.player.y = seat.y;
    step(s);
    stepSim(s, { ...EMPTY_INPUT, interact: true });
    expect(seat.itemId).toBe("1");
    expect(auctionHere(s)!.lot).toBe(0);
    step(s, 20, { ...EMPTY_INPUT, moveX: 100 });
    expect(s.player.x).toBe(seat.x);
    stepSim(s, { ...EMPTY_INPUT, interact: true });
    expect(seat.itemId).toBe("0");
  });
});

describe("시련 1000점", () => {
  it("비밀의 방 고르기 상자 (히든 상점 포함)", () => {
    const s = createRun(3, "warden");
    startFloor(s, 4);
    spillRewards(s, 1000);
    const chest = s.rooms[s.roomId]!.pickups.find((p) => p.itemId === "sr");
    expect(chest).toBeDefined();
    expect(chestOptions("sr")).toEqual(["devil", "gamble", "auction", "hidden"]);
    spillRewards(s, 900);
    expect(s.rooms[s.roomId]!.pickups.filter((p) => p.itemId === "sr")).toHaveLength(1);
  });
});
