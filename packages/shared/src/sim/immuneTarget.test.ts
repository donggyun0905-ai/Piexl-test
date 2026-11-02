import { describe, expect, it } from "vitest";
import { nearest } from "./brawlMoves";
import { createRun, stepSim } from "./run";
import { continueToLastFloor } from "./rooms";
import { EMPTY_INPUT } from "./types";
import { makeEnemy } from "./util";

describe("맞지 않는 적(무적)은 노리지 않음", () => {
  it("적 하나를 고르는 공격은 무적인 적을 건너뜀 (검은 잔영처럼 지켜보기만 하는 보스)", () => {
    const s = createRun(5, "brawler");
    const watcher = Object.assign(makeEnemy(s, "golem", s.player.x, s.player.y - 20, 1, 0), { immune: true });
    const foe = makeEnemy(s, "golem", s.player.x, s.player.y + 60, 1, 0);
    s.enemies = [watcher, foe];
    expect(nearest(s, 999)).toBe(foe);
    foe.hp = 0;
    expect(nearest(s, 999)).toBeNull();
  });

  it("검은 잔영은 자동 조준에 잡히지 않음", () => {
    const s = createRun(5, "warden");
    continueToLastFloor(s, "umbra" as never);
    s.enemies = [];
    const u = makeEnemy(s, "umbra", s.player.x, s.player.y - 30, 1, 0);
    s.enemies = [u];
    for (let i = 0; i < 5; i++) stepSim(s, { ...EMPTY_INPUT, autoAim: true });
    expect(u.immune).toBe(true);
    expect(s.autoTargetId).not.toBe(u.id);
  });
});
