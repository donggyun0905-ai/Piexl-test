import { describe, expect, it } from "vitest";
import { CHARACTERS } from "../content";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { addPickup } from "./loot";
import { EMPTY_HANDS, spawnShop } from "./shop";

describe("상점 휴지통", () => {
  it("F 한 번은 확인만, 한 번 더 누르면 무기를 버리고 빈손으로 · 돈을 조금 돌려받음 · 다음 무기를 주우면 빈손은 남지 않음", () => {
    const run = createRun(5, "warden");
    const p = run.player;
    run.rooms[run.roomId]!.pickups = [];
    spawnShop(run, run.roomId);
    const trash = run.rooms[run.roomId]!.pickups.find((x) => x.kind === "trash")!;
    p.weaponId = "shortsword";
    p.x = p.prevX = trash.x;
    p.y = p.prevY = trash.y;
    stepSim(run, EMPTY_INPUT);
    expect(run.prompt).toMatchObject({ kind: "trash", confirm: false });
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(p.weaponId).toBe("shortsword");
    stepSim(run, EMPTY_INPUT);
    expect(run.prompt).toMatchObject({ kind: "trash", confirm: true });
    const gold = run.gold;
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(p.weaponId).toBe(EMPTY_HANDS);
    expect(run.gold).toBe(gold + trash.price);
    // 빈손은 버릴 것이 없어 안내도 없음
    stepSim(run, EMPTY_INPUT);
    expect(run.prompt.kind).toBe("none");
    // 바닥 무기를 주우면 빈손은 내려놓지 않음
    const room = run.rooms[run.roomId]!;
    room.pickups = [];
    addPickup(run, run.roomId, "weapon", CHARACTERS.warden.startWeapon, p.x, p.y, 0);
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(p.weaponId).toBe(CHARACTERS.warden.startWeapon);
    expect(room.pickups.some((x) => x.kind === "weapon")).toBe(false);
  });

  it("산 물건과 바꿔 내려놓은 무기는 진열 자리를 가리지 않음", () => {
    const run = createRun(5, "warden");
    const p = run.player;
    run.rooms[run.roomId]!.pickups = [];
    spawnShop(run, run.roomId);
    const weapon = run.rooms[run.roomId]!.pickups.find((x) => x.kind === "weapon")!;
    const shelfY = weapon.y;
    run.gold = 999;
    p.x = p.prevX = weapon.x;
    p.y = p.prevY = weapon.y;
    stepSim(run, { ...EMPTY_INPUT, interact: true });
    expect(weapon.price).toBe(0);
    expect(weapon.y).toBeGreaterThan(shelfY);
  });
});

describe("돈주머니", () => {
  it("쓰면 돈 + 50", () => {
    const run = createRun(5, "warden");
    run.player.useSlots[0] = "moneyBag";
    const gold = run.gold;
    stepSim(run, { ...EMPTY_INPUT, useSlot: 1 });
    expect(run.gold).toBe(gold + 50);
    expect(run.player.useSlots[0]).toBe(null);
  });
});
