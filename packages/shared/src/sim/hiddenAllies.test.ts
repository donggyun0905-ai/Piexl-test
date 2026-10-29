import { describe, expect, it } from "vitest";
import { HIDDEN_CHARACTERS } from "../content";
import { hiddenUse } from "./hiddenUse";
import { recalcStats } from "./items";
import { createRun, stepSim } from "./run";
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
