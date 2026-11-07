import { describe, expect, it } from "vitest";
import { SPIRIT_ALLY, SPIRIT_BUFF, SPIRIT_GROW, SPIRIT_PACK, type SpiritId } from "../spiritDefs";
import { damagePlayer, removeDead } from "./combat";
import { factionDmgMul, factionTaken, factionTick } from "./faction";
import { factionGauge } from "./factionGauge";
import { spiritRoomClear } from "./factionSpirit";
import { passivePool } from "./loot";
import { createRun, type RunState } from "./index";
import { enemy } from "./perkTestUtil";
import { stationMenu } from "./station";

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

  it("처치 수로 자람 (싹 → 꽃)", () => {
    const s = withSpirit("sun");
    for (let i = 0; i < SPIRIT_GROW.grow1; i++) {
      const e = enemy(100 + i, 300, 300, 1);
      e.hp = 0;
      s.enemies = [e];
      removeDead(s);
    }
    expect(factionGauge(s)?.stage).toBe(1);
  });

  it("버프형: 햇살(피해) · 가시(받는 피해 줄임 + 맞으면 가시 폭발) · 꽃(회복)", () => {
    expect(factionDmgMul(withSpirit("sun"))).toBeCloseTo(1 + SPIRIT_BUFF.sunDmg);
    const t = withSpirit("thorn");
    expect(factionTaken(t)).toBeCloseTo(1 - SPIRIT_BUFF.thornTaken);
    const e = enemy(1, 120, 100);
    t.enemies = [e];
    damagePlayer(t, 1);
    expect(e.hp).toBeLessThan(e.maxHp);
    const b = withSpirit("bloom");
    b.player.hp = 10;
    run(b, SPIRIT_BUFF.bloomEvery + 1);
    expect(b.player.hp).toBeGreaterThan(10);
  });

  it("동행형: 늑대는 달려가 물고 · 부엉이는 급강하 · 골렘은 내려찍어 묶음", () => {
    for (const id of ["wolf", "owl", "golem"] as const) {
      const s = withSpirit(id);
      const e = enemy(1, 200, 100);
      e.rootTicks = 0;
      s.enemies = [e];
      run(s, SPIRIT_ALLY.owlEvery + 200);
      expect(e.hp).toBeLessThan(e.maxHp);
      if (id === "golem") expect(s.player.fcCo).toBeDefined();
    }
  });

  it("여우: 방을 끝내면 바꾸기 → 앞의 아이템이 다른 것으로", () => {
    const s = withSpirit("fox");
    for (let i = 0; i < SPIRIT_PACK.foxRooms; i++) spiritRoomClear(s);
    expect(s.player.fcFox).toBe(1);
    const pk = { id: 77, kind: "use" as const, itemId: "potion", x: 100, y: 100, group: 0, armed: true, price: 0 };
    s.rooms[s.roomId]!.pickups.push(pk);
    s.nearPickupId = 77;
    stationMenu(s, 23 * 4096);
    expect(s.player.fcFox).toBe(0);
    expect(`${pk.kind}:${pk.itemId}`).not.toBe("use:potion");
  });

  it("보관 꾸러미: 칸이 차도 넣어 두고 꺼낼 수 있음", () => {
    const s = withSpirit("bag");
    s.player.useSlots = ["potion", "potion"];
    s.rooms[s.roomId]!.pickups.push({ id: 78, kind: "use", itemId: "bomb", x: s.player.x, y: s.player.y, group: 0, armed: true, price: 0 });
    for (let i = 0; i < 80 && !s.player.fcBag?.length; i++) stepPick(s);
    expect(s.player.fcBag).toContain("bomb");
    s.player.useSlots = [null, "potion"];
    stationMenu(s, 21 * 4096);
    expect(s.player.useSlots[0]).toBe("bomb");
  });

  it("상자 꾸러미: 아이템을 모으면 패시브 3개 중 고름 · 먹보: 두고 온 아이템을 먹음", () => {
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
