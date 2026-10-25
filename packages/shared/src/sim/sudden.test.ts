import { describe, expect, it } from "vitest";
import { ACHIEVEMENT_IDS } from "../achievements";
import { checkProgress, summarize } from "../daily";
import { HEAL_ITEMS } from "../items";
import { damagePlayer } from "./combat";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { onRoomCleared, spawnTreasure } from "./loot";
import { spawnShop } from "./shop";

/** 이 판에서 바닥에 나온 물건 ("종류:id") */
const shown = (s: RunState, roomId: number) => s.rooms[roomId]!.pickups.map((pk) => `${pk.kind}:${pk.itemId}`);

describe("서든데스", () => {
  it("한 대라도 맞으면 바로 끝. 대시·무적 중에는 맞지 않음", () => {
    const run = createRun(3, "warden", [], true);
    run.player.dashTicks = 5;
    damagePlayer(run, 1);
    expect(run.player.hp).toBe(run.player.stats.maxHp);
    run.player.dashTicks = 0;
    damagePlayer(run, 1);
    stepSim(run, EMPTY_INPUT);
    expect(run.over).toBe(true);
    expect(run.player.hp).toBe(0);
  });

  it("두 번째 숨도 되살리지 않음", () => {
    const run = createRun(3, "warden", [], true);
    run.player.passives.push("secondWind");
    damagePlayer(run, 1);
    stepSim(run, EMPTY_INPUT);
    expect(run.over).toBe(true);
  });

  it("체력 회복 아이템은 상점·보물방·방 보상·층 보상에 나오지 않음 (해금을 다 해도)", () => {
    for (const c of ["warden", "drifter", "mage"] as const) {
      for (let seed = 1; seed <= 60; seed++) {
        const s = createRun(seed, c, ACHIEVEMENT_IDS, true);
        const items: string[] = [];
        spawnShop(s, s.roomId);
        spawnTreasure(s, s.roomId);
        items.push(...shown(s, s.roomId));
        for (let id = 0; id < s.map.rooms.length; id++) {
          onRoomCleared(s, id);
          items.push(...shown(s, id));
        }
        expect(items.filter((x) => HEAL_ITEMS.has(x)), `${c} ${seed}`).toEqual([]);
      }
    }
    // 일반 판에는 상점 회복약이 그대로
    const normal = createRun(3, "warden");
    spawnShop(normal, normal.roomId);
    expect(shown(normal, normal.roomId)).toContain("use:potion");
  });

  it("잠긴 출구를 체력을 내고 나갈 수 없음", () => {
    const run = createRun(3, "warden", [], true);
    run.rooms[run.roomId]!.cleared = false;
    run.player.y = 4;
    for (let i = 0; i < 5; i++) stepSim(run, { ...EMPTY_INPUT, moveY: -100, interact: true });
    expect(run.player.hp).toBe(run.player.stats.maxHp);
  });

  it("진행 기록 검사: 서든데스에서 회복약을 산 기록은 거절", () => {
    const run = createRun(3, "warden", [], true);
    run.tick = 100;
    const shop = run.map.rooms.findIndex((r) => r.type === "shop");
    const r = { ...summarize(run), goldEarned: 20, goldSpent: 14, buys: [{ floor: 1, roomId: shop, kind: "use" as const, itemId: "potion", price: 14 }] };
    expect(checkProgress(run.seed, r, false)).toBeNull();
    expect(checkProgress(run.seed, r, true)).toBe("buy");
  });
});
