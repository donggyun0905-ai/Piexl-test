import { describe, expect, it } from "vitest";
import { SPIRIT_ALLY, SPIRIT_BUFF, SPIRIT_COIN, SPIRIT_GROW, SPIRIT_PACK, type SpiritId } from "../spiritDefs";
import { damagePlayer, removeDead } from "./combat";
import { factionDmgMul, factionTaken, factionTick } from "./faction";
import { factionGauge } from "./factionGauge";
import { spiritRoomClear } from "./factionSpirit";
import { passivePool } from "./loot";
import { createRun, type RunState } from "./index";
import { enemy } from "./perkTestUtil";
import { stationMenu } from "./station";

/** 처치 수를 채움 */
function grown(s: RunState, kills: number): RunState {
  s.player.fcSpKills = kills;
  return s;
}

/** 비르디아(야수)로 시작해 정령을 고른 채 */
function withSpirit(id: SpiritId): RunState {
  const s = createRun(7, "beast");
  s.enemies = [];
  s.player.x = s.player.prevX = 100;
  s.player.y = s.player.prevY = 100;
  factionTick(s);
  s.player.fcSpPick = [id, "sun", "bloom"];
  stationMenu(s, 20 * 4096);
  return s;
}
const run = (s: RunState, n: number) => {
  for (let i = 0; i < n; i++) {
    s.tick++;
    factionTick(s);
  }
};

describe("비르디아 공생 정령", () => {
  it("처음엔 시드로 서로 다른 카드 3장 → 하나 고르면 그 정령", () => {
    const s = createRun(7, "beast");
    factionTick(s);
    const pick = s.player.fcSpPick!;
    expect(new Set(pick).size).toBe(3);
    stationMenu(s, 20 * 4096 + 1 * 64);
    expect(s.player.fcSp).toBe(pick[1]);
    expect(s.player.fcSpPick).toBeUndefined();
  });

  it("처치 수로 자람 (유년기 → 성장기) · 도박형·꾸러미형은 처음부터 궁극체", () => {
    expect(factionGauge(withSpirit("fox"))?.stage).toBe(3);
    const s = withSpirit("sun");
    for (let i = 0; i < SPIRIT_GROW.grow1; i++) {
      const e = enemy(100 + i, 300, 300, 1);
      e.hp = 0;
      s.enemies = [e];
      removeDead(s);
    }
    expect(factionGauge(s)?.stage).toBe(1);
  });

  it("버프형: 유년기는 효과 없음 · 20초마다 10초 켜짐 · 햇살(피해) · 가시(받는 피해 줄임 + 궁극체는 가시 폭발) · 꽃(회복)", () => {
    expect(factionDmgMul(withSpirit("sun"))).toBe(1);
    const sun = grown(withSpirit("sun"), SPIRIT_GROW.grow2);
    expect(factionDmgMul(sun)).toBeCloseTo(1 + SPIRIT_BUFF.sunDmg2);
    run(sun, SPIRIT_BUFF.active + 5);
    expect(factionDmgMul(sun)).toBe(1);
    run(sun, SPIRIT_BUFF.cycle - SPIRIT_BUFF.active);
    expect(factionDmgMul(sun)).toBeCloseTo(1 + SPIRIT_BUFF.sunDmg2);
    const t = grown(withSpirit("thorn"), SPIRIT_GROW.grow3);
    expect(factionTaken(t)).toBeCloseTo(1 - SPIRIT_BUFF.thornTaken2);
    const e = enemy(1, 120, 100);
    t.enemies = [e];
    damagePlayer(t, 1);
    expect(e.hp).toBeLessThan(e.maxHp);
    const b = grown(withSpirit("bloom"), SPIRIT_GROW.grow1);
    b.player.hp = 10;
    run(b, SPIRIT_BUFF.bloomEvery1 + 1);
    expect(b.player.hp).toBeGreaterThan(10);
  });

  it("동행형: 유년기는 고정 피해 1 · 궁극체 늑대는 물고 · 부엉이는 급강하 · 골렘은 내려찍어 묶음", () => {
    const kid = withSpirit("wolf");
    const k = enemy(1, 120, 100, 999);
    kid.enemies = [k];
    run(kid, SPIRIT_ALLY.wolfEvery1 + 60);
    expect(k.maxHp - k.hp).toBe(SPIRIT_ALLY.fixed * Math.round((k.maxHp - k.hp) / SPIRIT_ALLY.fixed));
    for (const id of ["wolf", "owl", "golem"] as const) {
      const s = grown(withSpirit(id), SPIRIT_GROW.grow3);
      const e = enemy(1, 200, 100);
      e.rootTicks = 0;
      s.enemies = [e];
      run(s, SPIRIT_ALLY.owlEvery3 + 200);
      expect(e.hp).toBeLessThan(e.maxHp - 5);
      if (id === "golem") expect(s.player.fcCo).toBeDefined();
    }
  });

  it("구미호: 방을 끝내면 바꾸기 → 이 방 아이템 전부 다른 것으로 (가격 그대로)", () => {
    const s = withSpirit("fox");
    for (let i = 0; i < SPIRIT_PACK.foxRooms; i++) spiritRoomClear(s);
    expect(s.player.fcFox).toBe(1);
    const pk = { id: 77, kind: "use" as const, itemId: "potion", x: 100, y: 100, group: 0, armed: true, price: 0 };
    const shop = { ...pk, id: 78, price: 30 };
    s.rooms[s.roomId]!.pickups.push(pk, shop);
    stationMenu(s, 23 * 4096);
    expect(s.player.fcFox).toBe(0);
    expect(`${pk.kind}:${pk.itemId}`).not.toBe("use:potion");
    expect(`${shop.kind}:${shop.itemId}`).not.toBe("use:potion");
    expect(shop.price).toBe(30);
  });

  it("코인 정령: 주우려는 아이템을 먹고 점수 → 5번 키로 단계 점수를 쓰고 상자", () => {
    const s = withSpirit("coin");
    s.rooms[s.roomId]!.pickups.push({ id: 90, kind: "use", itemId: "bomb", x: s.player.x, y: s.player.y, group: 0, armed: true, price: 0 });
    for (let i = 0; i < 5; i++) stepPick(s);
    expect(s.player.useSlots.includes("bomb" as never)).toBe(false);
    expect(s.player.fcCoin).toBeGreaterThanOrEqual(SPIRIT_COIN.use);
    s.player.fcCoin = SPIRIT_COIN.tier3 + 5;
    const before = s.rooms[s.roomId]!.pickups.length;
    stationMenu(s, 24 * 4096);
    expect(s.player.fcCoin).toBe(5);
    expect(s.rooms[s.roomId]!.pickups.length - before).toBe(SPIRIT_COIN.own3 + SPIRIT_COIN.com3 + SPIRIT_COIN.item3);
  });

  it("보따리: 칸이 차도 넣어 두고 꺼낼 수 있음", () => {
    const s = withSpirit("bag");
    s.player.useSlots = ["potion", "potion"];
    s.rooms[s.roomId]!.pickups.push({ id: 78, kind: "use", itemId: "bomb", x: s.player.x, y: s.player.y, group: 0, armed: true, price: 0 });
    for (let i = 0; i < 80 && !s.player.fcBag?.length; i++) stepPick(s);
    expect(s.player.fcBag).toContain("bomb");
    s.player.useSlots = [null, "potion"];
    stationMenu(s, 21 * 4096);
    expect(s.player.useSlots[0]).toBe("bomb");
  });

  it("미믹: 아이템을 모으면 패시브 3개 중 고름 · 돼지: 두고 온 아이템을 먹음", () => {
    const s = withSpirit("chest");
    s.tick++;
    factionTick(s);
    s.player.passives.push(...passivePool(s).filter((id, i, a) => a.indexOf(id) === i).slice(0, 4));
    factionTick(s);
    expect(s.player.fcChest?.length).toBe(3);
    const n = s.player.passives.length;
    stationMenu(s, 22 * 4096);
    expect(s.player.passives.length).toBe(n + 1);
    const g = withSpirit("glutton");
    factionTick(g);
    g.rooms[g.roomId]!.pickups.push({ id: 79, kind: "use", itemId: "potion", x: 0, y: 0, group: 0, armed: true, price: 0 });
    const was = g.roomId;
    g.roomId = g.map.rooms.find((r) => r.id !== was)!.id;
    factionTick(g);
    expect(g.player.fcGlut).toBe(1);
    expect(g.rooms[was]!.pickups.some((p) => p.id === 79)).toBe(false);
  });
});

import { stepSim, EMPTY_INPUT } from "./index";
/** 아이템 줍기 한 틱 (F를 누르고 있지 않아도 사용 아이템은 닿으면 주움 · 아니면 F) */
function stepPick(s: RunState): void {
  stepSim(s, { ...EMPTY_INPUT, interact: true });
}
