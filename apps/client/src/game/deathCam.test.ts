import { describe, expect, it } from "vitest";
import { createRun, EMPTY_INPUT, stepSim } from "@pixel-rogue/shared";
import { makeEnemy } from "../../../../packages/shared/src/sim/util";
import { DeathCam } from "./deathCam";

describe("쓰러질 때 연출", () => {
  it("느린 다시 보기도 같은 자리에서 쓰러지고, 쓰러지는 몸이 끝나야 결과 창", () => {
    const run = createRun(7, "warden");
    run.player.hp = 30;
    run.enemies = [0, 1, 2].map((i) => makeEnemy(run, "crawler", run.player.x + 10 + i * 4, run.player.y, 5, 10));
    const cam = new DeathCam(true, () => {});
    for (let i = 0; i < 3000 && !run.over; i++) {
      cam.record(run, EMPTY_INPUT);
      stepSim(run, EMPTY_INPUT);
    }
    expect(run.over).toBe(true);
    expect(cam.ready(run)).toBe(false);
    let ghost = run;
    let n = 0;
    while (!cam.ready(run) && n++ < 2000) ghost = cam.view(run);
    expect(cam.ready(run)).toBe(true);
    expect(ghost).not.toBe(run);
    expect(ghost.tick).toBe(run.tick);
    expect(ghost.player.hp).toBe(run.player.hp);
  });
});
