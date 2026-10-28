import { describe, expect, it } from "vitest";
import { SAGE_DISMOUNT } from "./bossSage";
import { BODY_MOVES } from "./sageBody";
import { CLOUD_MOVES } from "./sageCloud";
import { SAGE_MAX_WARN, SAGE_SWEEP, STAFF_MOVES } from "./sageStaff";
import { EMPTY_INPUT, stepSim, type EnemyState, type RunState } from "./index";
import { createPracticeRun, practiceSpawn } from "./practice";

/** 연습장 큰 방에 제천대성 */
function sage(): { run: RunState; e: EnemyState } {
  const run = createPracticeRun("warden");
  practiceSpawn(run, "sage");
  run.enemies = run.enemies.filter((o) => o.kind === "sage");
  return { run, e: run.enemies[0]! };
}

function steps(run: RunState, n: number, safe = true): void {
  for (let i = 0; i < n; i++) {
    stepSim(run, EMPTY_INPUT);
    if (safe) {
      run.player.invulnTicks = 99999;
      run.player.hp = run.player.stats.maxHp;
    }
  }
}

describe("제천대성", () => {
  it("공격이 30가지 (꼬리·주먹 10 · 여의봉 10 · 근두운 10) · 몸과 근두운이 따로 공격 · 오래 돌려도 문제없음", () => {
    expect(BODY_MOVES.length + STAFF_MOVES.length + CLOUD_MOVES.length).toBe(30);
    const { run, e } = sage();
    steps(run, 3000);
    expect(e.count).toBeGreaterThan(10);
    expect(e.sage!.cn).toBeGreaterThan(10);
    expect(e.hp).toBeGreaterThan(0);
  });

  it("체력 10%: 무적으로 근두운에서 내려와 체력이 가득 차 강해지고, 공격이 깜박임", () => {
    const { run, e } = sage();
    steps(run, 2);
    e.hp = e.maxHp * 0.05;
    steps(run, 2);
    expect(e.ultAt).toBeDefined();
    expect(e.immune).toBe(true);
    steps(run, SAGE_DISMOUNT);
    expect(e.sage!.foot).toBe(true);
    expect(e.immune).toBe(false);
    expect(e.hp).toBe(e.maxHp);
    steps(run, 300);
    expect((run.hazards ?? []).length === 0 || run.hazards!.every((h) => h.cue)).toBe(true);
  });

  it("여의봉 벽 + 꼬리 붙잡기: 벽은 지나갈 수 없음", () => {
    const { run, e } = sage();
    e.timer = 9999;
    e.sage = { cx: e.x, cy: e.y, ct: 9999, cn: 0, walls: [] };
    BODY_MOVES[5]!(run, e);
    expect(e.sage.walls).toHaveLength(1);
    const [x0, y0, x1, y1] = e.sage.walls[0]!;
    // 벽 쪽으로 계속 걸어도 벽을 넘지 못함
    const nx = (x0! + x1!) / 2 - run.player.x;
    const ny = (y0! + y1!) / 2 - run.player.y;
    const side = Math.sign((run.player.x - x0!) * (y1! - y0!) - (run.player.y - y0!) * (x1! - x0!));
    for (let i = 0; i < 60; i++) stepSim(run, { ...EMPTY_INPUT, moveX: Math.round((nx / Math.hypot(nx, ny)) * 100), moveY: Math.round((ny / Math.hypot(nx, ny)) * 100) });
    expect(Math.sign((run.player.x - x0!) * (y1! - y0!) - (run.player.y - y0!) * (x1! - x0!))).toBe(side);
  });

  it("맵 전체 휘두르기: 세 번 깜박인 다음 박자에 대시하면 피함", () => {
    const { run, e } = sage();
    e.timer = 9999;
    e.sage = { cx: e.x, cy: e.y, ct: 9999, cn: 0, walls: [] };
    STAFF_MOVES[8]!(run, e);
    const at = run.tick + SAGE_SWEEP.first + 3 * SAGE_SWEEP.blink;
    while (run.tick < at - 2) stepSim(run, EMPTY_INPUT);
    run.player.invulnTicks = 0;
    const hp = run.player.hp;
    stepSim(run, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    for (let i = 0; i < 3; i++) stepSim(run, EMPTY_INPUT);
    expect(run.player.hp).toBe(hp);
    // 대시하지 않으면 맞음
    const b = sage();
    b.e.timer = 9999;
    b.e.sage = { cx: b.e.x, cy: b.e.y, ct: 9999, cn: 0, walls: [] };
    STAFF_MOVES[8]!(b.run, b.e);
    const hp2 = b.run.player.hp;
    for (let i = 0; i < SAGE_SWEEP.first + 3 * SAGE_SWEEP.blink + 3; i++) stepSim(b.run, EMPTY_INPUT);
    expect(b.run.player.hp).toBeLessThan(hp2);
  });

  it("여의봉 최대로: 멀리 있으면 즉사, 몸 가까이 붙으면 삶", () => {
    for (const near of [false, true]) {
      const { run, e } = sage();
      e.timer = 9999;
      e.sage = { cx: e.x, cy: e.y, ct: 9999, cn: 0, walls: [] };
      STAFF_MOVES[9]!(run, e);
      for (let i = 0; i < SAGE_MAX_WARN + 2; i++) {
        if (near) {
          run.player.x = e.x + 10;
          run.player.y = e.y + 10;
        }
        stepSim(run, EMPTY_INPUT);
        if (i < SAGE_MAX_WARN - 2) run.player.hp = run.player.stats.maxHp;
      }
      if (near) expect(run.player.hp).toBeGreaterThan(0);
      else expect(run.player.hp <= 0 || run.over).toBe(true);
    }
  });
});
