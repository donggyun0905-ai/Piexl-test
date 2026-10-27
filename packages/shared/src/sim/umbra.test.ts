import { describe, expect, it } from "vitest";
import { ENEMIES } from "../content";
import { damageEnemy } from "./combat";
import { bindInput } from "./bossBinds";
import { EMPTY_INPUT, stepSim, type EnemyState, type RunState } from "./index";
import { createPracticeRun, practiceSpawn } from "./practice";

/** 연습장 큰 방에 검은 잔영 (플레이어는 맞아도 안 쓰러짐) */
function umbraRun(): RunState {
  const run = createPracticeRun("warden");
  practiceSpawn(run, "umbra");
  return run;
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

const find = (run: RunState, kind: string) => run.enemies.find((e) => e.kind === kind && e.hp > 0);

/** 짐승 하나만 (검은 잔영 없이) */
function beast(kind: "sandworm" | "scorpion" | "roc"): { run: RunState; e: EnemyState } {
  const run = umbraRun();
  steps(run, 160);
  const e = find(run, "sandworm")!;
  run.enemies = [e];
  delete e.ward;
  run.projectiles = [];
  e.kind = kind;
  e.phase = "walk";
  e.timer = 5;
  return { run, e };
}

describe("검은 잔영", () => {
  it("맞지 않고, 짐승 셋을 한꺼번에 부르고, 체력은 셋의 합 → 하나씩 쓰러질 때마다 한마디, 셋 다 잡으면 사라짐", () => {
    const run = umbraRun();
    const boss = find(run, "umbra")!;
    steps(run, 2);
    expect(find(run, "sandworm")).toBeUndefined();
    damageEnemy(run, boss, 1000, 0, 0);
    expect(boss.hp).toBe(boss.maxHp);
    steps(run, 160);
    const all = ["sandworm", "scorpion", "roc"].map((k) => find(run, k)!);
    expect(all.every(Boolean)).toBe(true);
    expect(boss.maxHp).toBe(all.reduce((sum, b) => sum + b.maxHp, 0));
    all[0]!.hp -= 500;
    steps(run, 1);
    expect(boss.hp).toBe(boss.maxHp - 500);
    all.forEach((b, i) => {
      b.hp = 0;
      steps(run, 2);
      expect(boss.say).toBe(i + 1);
    });
    steps(run, 220);
    expect(find(run, "umbra")).toBeUndefined();
    expect(run.enemies.filter((e) => e.kind !== "dummy")).toHaveLength(0);
  });

  it("거대 전갈: 체력이 많고 흰 보호막이 먼저 깎임", () => {
    const run = umbraRun();
    steps(run, 160);
    const sc = find(run, "scorpion")!;
    expect(sc.maxHp).toBeGreaterThan(find(run, "roc")!.maxHp);
    const ward = sc.ward!;
    expect(ward).toBeGreaterThan(0);
    sc.immune = false;
    damageEnemy(run, sc, 100, 0, 0);
    expect(sc.hp).toBe(sc.maxHp);
    expect(sc.ward).toBeLessThan(ward);
  });
});

describe("데스웜", () => {
  it("땅속에서는 맞지 않음 → 갑자기 표시 → 솟아오르면 맞고 사방으로 바위 → 3초 뒤 다시 땅속", () => {
    const { run, e } = beast("sandworm");
    steps(run, 1);
    expect(e.immune).toBe(true);
    expect(run.hazards ?? []).toHaveLength(0);
    steps(run, 5);
    expect(e.phase).toBe("windup");
    expect(run.hazards?.length).toBe(1);
    steps(run, 34);
    expect(e.phase).toBe("act");
    expect(e.immune).toBe(false);
    expect(run.projectiles.length).toBeGreaterThanOrEqual(5);
    steps(run, 181);
    expect(e.phase).toBe("walk");
    expect(e.immune).toBe(true);
  });
});

describe("거대 전갈", () => {
  it("돌진에 부딪히면 집게에 붙잡혀 못 움직임", () => {
    const { run, e } = beast("scorpion");
    e.count = 1; // 다음은 돌진
    const p = run.player;
    e.x = p.x;
    e.y = p.y - 120;
    steps(run, 6 + 28);
    expect(e.phase).toBe("charge");
    p.invulnTicks = 0;
    for (let i = 0; i < 120 && (p.pinchTicks ?? 0) === 0; i++) {
      stepSim(run, EMPTY_INPUT);
      p.invulnTicks = 0;
      p.hp = p.stats.maxHp;
    }
    expect(p.pinchTicks).toBeGreaterThan(0);
    const out = bindInput(run, { ...EMPTY_INPUT, moveX: 100, dash: true });
    expect(out.moveX).toBe(0);
    expect(out.dash).toBe(false);
  });
});

describe("거대 매", () => {
  it("내려찍기를 피하면 3초 경직(맞음), 맞으면 곧바로 하늘로", () => {
    const { run, e } = beast("roc");
    steps(run, 7);
    expect(e.phase).toBe("windup");
    // 범위 밖으로 피함
    run.player.x = e.x + 120 < 400 ? e.x + 120 : e.x - 120;
    steps(run, 50);
    expect(e.phase).toBe("act");
    expect(e.immune).toBe(false);
    const hp = e.hp;
    damageEnemy(run, e, 50, 0, 0);
    expect(e.hp).toBeLessThan(hp);
    expect(ENEMIES.roc.boss).toBe(true);

    const b = beast("roc");
    steps(b.run, 7);
    b.run.player.x = b.e.x;
    b.run.player.y = b.e.y;
    b.run.player.invulnTicks = 0;
    for (let i = 0; i < 50 && b.e.phase === "windup"; i++) stepSim(b.run, EMPTY_INPUT);
    expect(b.e.phase).toBe("blink");
    expect(b.e.immune).toBe(true);
  });
});
