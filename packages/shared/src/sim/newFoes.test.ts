import { describe, expect, it } from "vitest";
import "../balanceTables";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { NEW_FOES_RULES as R } from "./newFoes";
import { makeEnemy } from "./util";

/** 싸우는 방에 새 몬스터 하나 (플레이어 체력 넉넉히) */
function withOne(kind: "bombbug" | "skelarcher", dx = 40, dy = -30): RunState {
  const run = createRun(4, "warden");
  run.player.hp = run.player.stats.maxHp;
  run.player.invulnTicks = 0;
  run.enemies = [makeEnemy(run, kind, run.player.x + dx, run.player.y + dy, 1, 0)];
  run.rooms[run.roomId]!.cleared = false;
  return run;
}

describe("시즌 3 새 몬스터", () => {
  it("폭발풍뎅이: 달라붙어도 피해 없음 → 1.5초 뒤 폭발 (큰 피해 + 화상)", () => {
    const run = withOne("bombbug");
    const hp0 = run.player.hp;
    let stuck = -1;
    for (let i = 0; i < 200 && run.enemies.length > 0; i++) {
      stepSim(run, EMPTY_INPUT);
      if (stuck < 0 && run.enemies[0]?.phase === "act") {
        stuck = i;
        expect(run.player.hp).toBe(hp0);
      }
    }
    expect(stuck).toBeGreaterThanOrEqual(0);
    expect(run.enemies).toHaveLength(0);
    expect(run.player.hp).toBeLessThan(hp0 - R.BUG_DMG / 2);
    expect(run.player.dbBurn ?? 0).toBeGreaterThan(0);
  });

  it("폭발풍뎅이: 대시하면 떨어져 나가 피함", () => {
    const run = withOne("bombbug");
    const hp0 = run.player.hp;
    for (let i = 0; i < 200 && run.enemies[0]?.phase !== "act"; i++) stepSim(run, EMPTY_INPUT);
    stepSim(run, { ...EMPTY_INPUT, moveX: 100, dash: true });
    for (let i = 0; i < 120 && run.enemies.length > 0; i++) stepSim(run, { ...EMPTY_INPUT, moveX: 100 });
    expect(run.enemies).toHaveLength(0);
    expect(run.player.hp).toBe(hp0);
  });

  it("스켈레톤 궁병: 겨눈 선 위에 있으면 큰 피해, 깜빡일 때 비키면 안 맞음", () => {
    const hit = withOne("skelarcher", 0, -100);
    const hp0 = hit.player.hp;
    for (let i = 0; i < R.ARCH_AIM + R.ARCH_LOCK + 5; i++) stepSim(hit, EMPTY_INPUT);
    expect(hit.player.hp).toBeLessThan(hp0 - R.ARCH_DMG / 2);

    const miss = withOne("skelarcher", 0, -100);
    for (let i = 0; i < R.ARCH_AIM + 2; i++) stepSim(miss, EMPTY_INPUT);
    for (let i = 0; i < R.ARCH_LOCK + 5; i++) stepSim(miss, { ...EMPTY_INPUT, moveX: 100 });
    expect(miss.player.hp).toBe(hp0);
  });
});
