import { describe, expect, it } from "vitest";
import { HIDDEN_CHARACTERS } from "../content";
import { hiddenUse } from "./hiddenUse";
import { recalcStats } from "./items";
import { createRun, stepSim } from "./run";
import { startFloor } from "./rooms";
import { makeEnemy } from "./util";
import { extraOf } from "./baseStats";
import { EMPTY_INPUT, type RunState } from "./types";

const run = (n: number, s: RunState) => {
  for (let i = 0; i < n; i++) stepSim(s, EMPTY_INPUT);
};

describe("히든 아이템 셋째 묶음 (동료·변신)", () => {
  it("순례자의 월계선: 무작위 히든 캐릭터 동료가 체력을 갖고 따라옴 · 시드가 같으면 같은 캐릭터", () => {
    const a = createRun(3, "warden");
    const b = createRun(3, "warden");
    hiddenUse(a, "laurelShip", 0);
    hiddenUse(b, "laurelShip", 0);
    const al = a.player.allies![0]!;
    expect(HIDDEN_CHARACTERS).toContain(al.char);
    expect(b.player.allies![0]!.char).toBe(al.char);
    expect(al.hp).toBeGreaterThan(0);
    run(30, a);
    expect(a.player.allies).toHaveLength(1);
  });

  it("거짓된 용사: 얻으면 풋내기 동료 · 처치가 쌓이면 레벨이 오름", () => {
    const s = createRun(5, "warden");
    s.player.passives.push("falseHero");
    run(2, s);
    const hero = s.player.allies!.find((a) => a.kind === "hero")!;
    expect(hero.char).toBe("novice");
    s.kills += 40;
    run(2, s);
    expect(hero.lv).toBeGreaterThan(1);
  });

  it("거짓된 용사: 쓰러지면 다음 층에 쓰러지기 전 레벨로 다시 옴", () => {
    const s = createRun(5, "warden");
    s.player.passives.push("falseHero");
    run(2, s);
    s.kills += 40;
    run(2, s);
    const lv = s.player.allies![0]!.lv!;
    s.player.allies![0]!.hp = 0;
    run(2, s);
    expect(s.player.allies).toHaveLength(0);
    startFloor(s, 2);
    run(2, s);
    const again = s.player.allies!.find((x) => x.kind === "hero")!;
    expect(again.lv).toBe(lv);
    expect(again.hp).toBe(again.maxHp);
  });

  it("동료는 방 밖·벽으로 나가지 않고, 용암에 서 있으면 피해를 받음", () => {
    const s = createRun(9, "warden");
    hiddenUse(s, "laurelShip", 0);
    const a = s.player.allies![0]!;
    s.rooms[s.roomId]!.cleared = false;
    // 허수아비 하나 (방이 정리되지 않게 · 동료는 허수아비를 노리지 않음)
    s.enemies = [makeEnemy(s, "dummy", 40, 40, 100, 999)];
    s.terrain = { room: s.roomId, mud: [], lava: [[a.x - 30, a.y - 30, 60, 60]], water: [], spikes: [] };
    s.player.x = a.x;
    s.player.y = a.y;
    const hp = a.hp;
    run(40, s);
    expect(a.hp).toBeLessThan(hp);
    s.player.x = -500;
    run(200, s);
    expect(a.x).toBeGreaterThan(0);
  });

  it("체력 먹이기: 다친 동료 옆에서 F → 내 포션이 없어지고 동료 체력이 참", () => {
    const s = createRun(7, "warden");
    s.enemies = [];
    hiddenUse(s, "laurelShip", 0);
    const al = s.player.allies![0]!;
    run(1, s);
    al.hp = 10;
    al.x = s.player.x + 4;
    al.y = s.player.y;
    s.player.useSlots[0] = "potion";
    stepSim(s, { ...EMPTY_INPUT, interact: true });
    expect(s.player.useSlots[0]).toBeNull();
    expect(al.hp).toBeGreaterThan(10);
  });

  it("바스러져가는 왕관: 왕의 능력치로 바뀌고 방을 나가면 원래대로", () => {
    const s = createRun(9, "warden");
    const hp = s.player.hp;
    hiddenUse(s, "crumblingCrown", 0);
    expect(s.player.stats.maxHp).toBe(1000);
    expect(s.player.stats.damage).toBe(100);
    expect(extraOf(s.player).critDamage).toBe(3);
    s.roomId = s.roomId + 1;
    run(1, s);
    expect(s.player.kingRoom).toBeUndefined();
    recalcStats(s);
    expect(s.player.stats.maxHp).toBeLessThan(1000);
    expect(s.player.hp).toBeLessThanOrEqual(hp);
  });

  it("큐피트의 정령: 대정령 하나가 곁에 옴", () => {
    const s = createRun(11, "warden");
    hiddenUse(s, "cupidSpirit", 0);
    expect(s.player.cupid).toBeDefined();
  });
});
