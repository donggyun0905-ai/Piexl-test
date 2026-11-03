import { describe, expect, it } from "vitest";
import { USE_ITEMS } from "../items";
import { createRun, EMPTY_INPUT, PICKUP_HOLD_TICKS, stepSim, type Pickup, type RunState } from "./index";
import { WEAPONS } from "../content";

function place(run: RunState, pk: Omit<Pickup, "id" | "armed" | "group" | "price"> & { group?: number; price?: number }): Pickup {
  const full: Pickup = { id: run.nextId++, armed: true, group: 0, price: 0, ...pk };
  run.rooms[run.roomId]!.pickups.push(full);
  return full;
}

const at = (run: RunState) => ({ x: run.player.x, y: run.player.y });
const PICK = { ...EMPTY_INPUT, interact: true };
/** 바꾸기·고르기 아이템 위에 잠깐 서 있기 */
const stand = (run: RunState) => {
  for (let i = 0; i < PICKUP_HOLD_TICKS; i++) stepSim(run, EMPTY_INPUT);
};

describe("아이템", () => {
  it("패시브를 주우면 능력치가 바뀌고, 같은 패시브는 중첩", () => {
    const run = createRun(1, "warden");
    const base = run.player.stats.damage;
    place(run, { kind: "passive", itemId: "whetstone", ...at(run) });
    stepSim(run, PICK);
    expect(run.player.stats.damage).toBe(base + 3);
    run.player.x += 40;
    place(run, { kind: "passive", itemId: "whetstone", ...at(run) });
    stepSim(run, PICK);
    expect(run.player.stats.damage).toBe(base + 6);
  });

  it("패시브는 스치기만 하면 안 가져가고, 잠깐 서 있으면 가짐 (상호작용은 바로)", () => {
    const run = createRun(1, "warden");
    place(run, { kind: "passive", itemId: "whetstone", ...at(run) });
    for (let i = 0; i < PICKUP_HOLD_TICKS - 1; i++) stepSim(run, EMPTY_INPUT);
    expect(run.player.passives).toEqual([]);
    expect(run.prompt.kind).toBe("pick");
    expect(run.holdTicks).toBe(PICKUP_HOLD_TICKS - 1);
    stepSim(run, EMPTY_INPUT);
    expect(run.player.passives).toEqual(["whetstone"]);
    // 중간에 떨어지면 처음부터 다시
    run.player.x += 40;
    place(run, { kind: "passive", itemId: "whetstone", ...at(run) });
    for (let i = 0; i < 10; i++) stepSim(run, EMPTY_INPUT);
    run.player.x += 40;
    stepSim(run, EMPTY_INPUT);
    expect(run.holdTicks).toBe(0);
    run.player.x -= 40;
    for (let i = 0; i < PICKUP_HOLD_TICKS - 1; i++) stepSim(run, EMPTY_INPUT);
    expect(run.player.passives).toHaveLength(1);
    stepSim(run, PICK);
    expect(run.player.passives).toHaveLength(2);
  });

  it("최대 체력이 늘면 체력도 늘어남", () => {
    const run = createRun(1, "warden");
    const hp = run.player.hp;
    place(run, { kind: "passive", itemId: "sturdyHeart", ...at(run) });
    stepSim(run, PICK);
    expect(run.player.stats.maxHp).toBe(140);
    expect(run.player.hp).toBe(hp + 20);
  });

  it("보상 묶음은 하나만 고를 수 있음", () => {
    const run = createRun(1, "warden");
    place(run, { kind: "passive", itemId: "whetstone", group: 1, ...at(run) });
    place(run, { kind: "passive", itemId: "windBoots", group: 1, x: 30, y: 30 });
    stepSim(run, PICK);
    expect(run.player.passives).toEqual(["whetstone"]);
    expect(run.rooms[run.roomId]!.pickups).toHaveLength(0);
  });

  it("층 보상은 서 있기로는 안 고르고, 클릭(번호)으로 거리 상관없이 고름", () => {
    const run = createRun(1, "warden");
    place(run, { kind: "passive", itemId: "whetstone", group: 1, ...at(run) });
    place(run, { kind: "passive", itemId: "windBoots", group: 1, x: 30, y: 30 });
    place(run, { kind: "passive", itemId: "longGrip", group: 1, x: 60, y: 30 });
    stand(run);
    stepSim(run, EMPTY_INPUT);
    expect(run.player.passives).toEqual([]);
    expect(run.prompt.kind).toBe("pick");
    stepSim(run, { ...EMPTY_INPUT, pickChoice: 3 });
    expect(run.player.passives).toEqual(["longGrip"]);
    expect(run.rooms[run.roomId]!.pickups).toHaveLength(0);
  });

  it("무기는 서 있어도 안 바뀌고 F로만 바꿈, 옛 무기는 그 자리에. 떨어졌다가 다시 F로 또 바뀜", () => {
    const run = createRun(1, "warden");
    const pk = place(run, { kind: "weapon", itemId: "spear", ...at(run) });
    stand(run);
    stepSim(run, EMPTY_INPUT);
    expect(run.player.weaponId).toBe("greatblade");
    expect(run.prompt.kind).toBe("pick");
    stepSim(run, PICK);
    expect(run.player.weaponId).toBe("spear");
    expect(pk.itemId).toBe("greatblade");
    // 닿아 있는 동안은 F를 눌러도 다시 안 바뀜 (한 번 떨어졌다 와야 함)
    stepSim(run, PICK);
    expect(run.player.weaponId).toBe("spear");
    // 떨어졌다가 다시
    run.player.x += 40;
    stepSim(run, EMPTY_INPUT);
    run.player.x -= 40;
    stepSim(run, EMPTY_INPUT);
    stepSim(run, PICK);
    expect(run.player.weaponId).toBe("greatblade");
    expect(run.player.stats.range).toBe(WEAPONS.greatblade.range);
  });

  it("사용 아이템: 빈 칸에 줍고, 꽉 차면 먼저 얻은 아이템과 바꿈", () => {
    const run = createRun(1, "warden");
    const p = run.player;
    // 방 가운데에서 (시작 자리는 아래쪽 벽 옆)
    p.y = p.prevY = 72;
    place(run, { kind: "use", itemId: "potion", ...at(run) });
    stepSim(run, EMPTY_INPUT);
    p.x += 40;
    place(run, { kind: "use", itemId: "bomb", ...at(run) });
    stepSim(run, EMPTY_INPUT);
    expect(p.useSlots).toEqual(["potion", "bomb"]);
    p.x += 40;
    const pk = place(run, { kind: "use", itemId: "ward", ...at(run) });
    stepSim(run, EMPTY_INPUT);
    expect(p.useSlots).toEqual(["potion", "bomb"]);
    stand(run);
    expect(p.useSlots).toEqual(["ward", "bomb"]);
    expect(pk.itemId).toBe("potion");
    // 다음은 더 오래된 폭탄 칸 (벽에 막히지 않게 반대쪽으로)
    p.x -= 120;
    place(run, { kind: "use", itemId: "potion", ...at(run) });
    stepSim(run, PICK);
    expect(p.useSlots).toEqual(["ward", "potion"]);
  });

  it("회복약·폭탄·보호막", () => {
    const run = createRun(1, "warden");
    const p = run.player;
    p.useSlots = ["potion", "bomb"];
    p.hp = 10;
    // 빈 칸을 누르면 아무 일 없음
    p.useSlots = [null, "potion"];
    stepSim(run, { ...EMPTY_INPUT, useSlot: 1 });
    expect(p.hp).toBe(10);
    p.useSlots = ["potion", "bomb"];
    stepSim(run, { ...EMPTY_INPUT, useSlot: 1 });
    expect(p.hp).toBeCloseTo(10 + USE_ITEMS.potion.heal);
    run.enemies = [{ id: 77, kind: "crawler", x: p.x + 20, y: p.y, prevX: 0, prevY: 0, r: 5, hp: 40, maxHp: 40, timer: 0, phase: "walk", dirX: 0, dirY: 0, hitFlash: 0, count: 0, noGold: false }];
    stepSim(run, { ...EMPTY_INPUT, useSlot: 2 });
    expect(run.enemies).toHaveLength(0);
    expect(p.useSlots).toEqual([null, null]);
    p.useSlots = ["ward", null];
    stepSim(run, { ...EMPTY_INPUT, useSlot: 1 });
    expect(p.shieldTicks).toBeGreaterThan(0);
  });

  it("계단방을 정리하면 층 보상 패시브 3개가 나옴", () => {
    const run = createRun(4, "drifter");
    run.roomId = run.map.exitId;
    run.rooms[run.roomId]!.cleared = false;
    run.enemies = [];
    stepSim(run, EMPTY_INPUT);
    const pks = run.rooms[run.roomId]!.pickups;
    expect(pks).toHaveLength(3);
    expect(new Set(pks.map((x) => x.itemId)).size).toBe(3);
  });
});
