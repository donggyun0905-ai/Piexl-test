import { describe, expect, it } from "vitest";
import { createPracticeRun, practiceCanStack, practiceClearEnemies, practiceGive, practiceRemovePassive, practiceRemoveUse, practiceReset, practiceSetFloor, practiceSpawn, practiceToggleDummy } from "./practice";
import { ENEMIES } from "../content";
import { bossHpMul } from "./bosses";
import { EMPTY_INPUT, stepSim } from "./index";

describe("연습장", () => {
  it("출구가 없는 방 하나에서 시작", () => {
    const s = createPracticeRun("mage");
    expect(s.map.rooms[s.roomId]!.exits.every((d) => d < 0)).toBe(true);
  });

  it("무기·패시브·사용 아이템을 마음대로 가짐 (다른 캐릭터 전용도)", () => {
    const s = createPracticeRun("warden");
    practiceGive(s, { kind: "weapon", id: "longbow" });
    expect(s.player.weaponId).toBe("longbow");
    practiceGive(s, { kind: "passive", id: "ricochet" });
    practiceGive(s, { kind: "passive", id: "ricochet" });
    expect(s.player.passives).toEqual(["ricochet"]);
    practiceGive(s, { kind: "use", id: "bomb" });
    practiceGive(s, { kind: "use", id: "potion" });
    practiceGive(s, { kind: "use", id: "ward" });
    expect(s.player.useSlots).toEqual(["ward", "potion"]);
    practiceRemovePassive(s, "ricochet");
    expect(s.player.passives).toEqual([]);
  });

  it("적을 부르고 치우고, 초기화하면 처음 상태", () => {
    const s = createPracticeRun("drifter");
    practiceSpawn(s, "hulk");
    practiceSpawn(s, "crawler");
    stepSim(s, EMPTY_INPUT);
    expect(s.enemies).toHaveLength(3);
    practiceClearEnemies(s);
    expect(s.enemies.map((e) => e.kind)).toEqual(["dummy"]);
    practiceGive(s, { kind: "weapon", id: "heavycrossbow" });
    practiceGive(s, { kind: "passive", id: "chaseSteps" });
    s.player.hp = 1;
    practiceReset(s);
    expect(s.player.weaponId).toBe("crossbow");
    expect(s.player.passives).toEqual([]);
    expect(s.player.hp).toBe(s.player.stats.maxHp);
  });
});

describe("연습장 세기·여러 번 얻기", () => {
  it("세기(층)를 고르면 그 층처럼 체력이 커짐 (보스는 보스 배율)", () => {
    const s = createPracticeRun("warden");
    practiceSetFloor(s, 5);
    practiceSpawn(s, "crawler");
    practiceSpawn(s, "knight");
    expect(s.enemies.find((e) => e.kind === "crawler")!.maxHp).toBe(Math.round(ENEMIES.crawler.hp * 1.6));
    expect(s.enemies.find((e) => e.kind === "knight")!.maxHp).toBe(Math.round(ENEMIES.knight.hp * bossHpMul(5)));
    practiceSetFloor(s, 99);
    expect(s.floor).toBe(7);
  });

  it("능력치 패시브는 겹쳐 가지고, 효과 패시브는 하나만 · 사용 아이템도 하나 빼기", () => {
    const s = createPracticeRun("bedouin");
    expect(practiceCanStack("sturdyHeart")).toBe(true);
    expect(practiceCanStack("duneRush")).toBe(false);
    for (let i = 0; i < 3; i++) practiceGive(s, { kind: "passive", id: "sturdyHeart" });
    practiceGive(s, { kind: "passive", id: "duneRush" });
    practiceGive(s, { kind: "passive", id: "duneRush" });
    expect(s.player.passives.filter((p) => p === "sturdyHeart")).toHaveLength(3);
    expect(s.player.passives.filter((p) => p === "duneRush")).toHaveLength(1);
    practiceGive(s, { kind: "use", id: "potion" });
    practiceRemoveUse(s, "potion");
    expect(s.player.useSlots.every((x) => x === null)).toBe(true);
  });
});

describe("허수아비", () => {
  it("처음부터 서 있고, 움직이지도 공격하지도 않음, 적 치우기·초기화에도 남음", () => {
    const s = createPracticeRun("warden");
    const d = s.enemies.find((e) => e.kind === "dummy")!;
    expect(d).toBeTruthy();
    const { x, y } = d;
    for (let i = 0; i < 60; i++) stepSim(s, EMPTY_INPUT);
    expect([d.x, d.y]).toEqual([x, y]);
    expect(s.player.hp).toBe(s.player.stats.maxHp);
    practiceSpawn(s, "crawler");
    practiceClearEnemies(s);
    expect(s.enemies.map((e) => e.kind)).toEqual(["dummy"]);
    d.hp = 5;
    practiceReset(s);
    expect(s.enemies[0]!.hp).toBe(s.enemies[0]!.maxHp);
  });

  it("켜고 끌 수 있고, 꺼 두면 초기화해도 안 나옴", () => {
    const s = createPracticeRun("mage");
    expect(practiceToggleDummy(s)).toBe(false);
    expect(s.enemies).toHaveLength(0);
    practiceReset(s);
    expect(s.enemies).toHaveLength(0);
    expect(practiceToggleDummy(s)).toBe(true);
    expect(s.enemies.map((e) => e.kind)).toEqual(["dummy"]);
  });
});
