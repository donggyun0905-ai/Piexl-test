import { describe, expect, it } from "vitest";
import { damageEnemy } from "./combat";
import { startCombo } from "./bossDemigod";
import { spiritSlam } from "./demigodUlts";
import { EMPTY_INPUT, stepSim, type EnemyState, type RunState } from "./index";
import { createPracticeRun, practiceSpawn } from "./practice";

/** 연습장 큰 방에 괴력난신 (플레이어는 안 쓰러짐) */
function god(): { run: RunState; e: EnemyState } {
  const run = createPracticeRun("warden");
  practiceSpawn(run, "demigod");
  run.enemies = run.enemies.filter((o) => o.kind === "demigod");
  return { run, e: run.enemies[0]! };
}

function steps(run: RunState, n: number): void {
  for (let i = 0; i < n; i++) {
    stepSim(run, EMPTY_INPUT);
    run.player.invulnTicks = 99999;
    run.player.hp = run.player.stats.maxHp;
  }
}

describe("괴력난신", () => {
  it("넓은 공격을 차례로 쓰고, 기 주먹 난사 동안은 2초 무적으로 100발", () => {
    const { run, e } = god();
    let volley = false;
    let shots = 0;
    for (let i = 0; i < 1200 && !volley; i++) {
      steps(run, 1);
      if (e.phase === "volley") volley = true;
    }
    expect(volley).toBe(true);
    expect(e.immune).toBe(true);
    const hp = e.hp;
    damageEnemy(run, e, 500, 0, 0);
    expect(e.hp).toBe(hp);
    run.projectiles = [];
    for (let i = 0; i < 125; i++) {
      steps(run, 1);
      shots = Math.max(shots, run.projectiles.filter((p) => p.look === "kifist").length);
    }
    expect(shots).toBeGreaterThan(60);
    expect(e.phase).not.toBe("volley");
  });

  it("근접 콤보는 앞으로만 (플레이어가 뒤로 가도 정한 방향으로 나아감)", () => {
    const { run, e } = god();
    e.timer = 9999;
    startCombo(e, [1, 0], 1);
    const x0 = e.x;
    run.player.x = e.x - 60;
    steps(run, 70);
    expect(e.x).toBeGreaterThan(x0 + 20);
  });

  it("70%: 플레이어 등 뒤로 순간이동해 무적 콤보 · 50%: 무적으로 빠르게 쫓아옴", () => {
    const { run, e } = god();
    const p = run.player;
    p.faceX = 1;
    p.faceY = 0;
    e.hp = e.maxHp * 0.65;
    steps(run, 1);
    expect(e.gUlt).toBe(1);
    expect(e.immune).toBe(true);
    expect(e.x).toBeLessThan(p.x);
    for (let i = 0; i < 300 && e.gUlt === 1; i++) steps(run, 1);
    expect(e.gUlt).toBeUndefined();
    e.hp = e.maxHp * 0.45;
    steps(run, 1);
    expect(e.gUlt).toBe(2);
    expect(e.immune).toBe(true);
  });

  it("10%: 원기옥 세 번을 박자에 맞춰 대시로 다 피하면 3초 그로기, 안 피하면 큰 피해", () => {
    const { run, e } = god();
    e.gDone = 3;
    e.hp = e.maxHp * 0.05;
    steps(run, 1);
    expect(e.gUlt).toBe(3);
    for (let k = 0; k < 3; k++) {
      while (run.tick - e.ultAt! < spiritSlam(k) - 2) steps(run, 1);
      // 내리꽂기 2틱 전에 대시
      stepSim(run, { ...EMPTY_INPUT, dash: true, moveX: 100 });
      steps(run, 2);
    }
    expect(e.gDodge).toBe(3);
    steps(run, 25);
    expect(e.gUlt).toBeUndefined();
    expect(e.stunTicks).toBeGreaterThan(0);
    expect(e.immune).toBe(false);

    const b = god();
    b.e.gDone = 3;
    b.e.hp = b.e.maxHp * 0.05;
    steps(b.run, 1);
    b.run.player.invulnTicks = 0;
    const hp = b.run.player.hp;
    while (b.run.tick - b.e.ultAt! <= spiritSlam(0) + 1) stepSim(b.run, EMPTY_INPUT);
    expect(b.run.player.hp).toBeLessThan(hp);
  });
});
