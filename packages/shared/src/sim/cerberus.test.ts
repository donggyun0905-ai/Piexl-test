import { describe, expect, it } from "vitest";
import { damageEnemy } from "./combat";
import { BOSS_CERB_KIT_RULES as K, cellRect, exposed, fallTick, FLOOR_COLS, FLOOR_ROWS, startBreath, startFloor } from "./cerbKit";
import { startPull } from "./bossCerbTrio";
import { EMPTY_INPUT, stepSim, type EnemyState, type RunState } from "./index";
import { createPracticeRun, practiceSpawn } from "./practice";
import { TILE_SIZE } from "../constants";

/** 연습장 큰 방에 켈베로스 (기둥 방) */
function cerbRun(): RunState {
  const run = createPracticeRun("warden");
  practiceSpawn(run, "cerberus");
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

/** 쉴드를 다 깎아 세 사람으로 갈라지게 */
function split(run: RunState): EnemyState {
  const boss = find(run, "cerberus")!;
  steps(run, 2);
  damageEnemy(run, boss, (boss.ward ?? 0) + 10, 0, 0);
  steps(run, 200);
  return boss;
}

/** 기둥 (0번) 바로 뒤 자리 (켈베로스 머리 반대쪽) */
function behindPillar(run: RunState, boss: EnemyState): [number, number] {
  const cx = (run.arena![0]! + 1) * TILE_SIZE;
  const cy = (run.arena![1]! + 1) * TILE_SIZE;
  const dx = cx - boss.x;
  const dy = cy - boss.y;
  const len = Math.hypot(dx, dy);
  return [cx + (dx / len) * 26, cy + (dy / len) * 26];
}

describe("켈베로스", () => {
  it("기둥 6개 방 · 묶여 움직이지 않음 · 흰 쉴드만 깎이고 진짜 체력은 그대로", () => {
    const run = cerbRun();
    const boss = find(run, "cerberus")!;
    expect(run.arena!.length).toBe(12);
    steps(run, 2);
    const [x, y] = [boss.x, boss.y];
    const ward = boss.ward!;
    expect(ward).toBeGreaterThan(0);
    damageEnemy(run, boss, 300, 1, 0);
    steps(run, 30);
    expect(boss.ward).toBe(ward - 300);
    expect(boss.hp).toBe(boss.maxHp);
    expect([boss.x, boss.y]).toEqual([x, y]);
  });

  it("지옥불 브레스: 기둥 뒤면 안 맞고, 밖이면 대시 중이어도 맞음", () => {
    for (const hide of [true, false]) {
      const run = cerbRun();
      const boss = find(run, "cerberus")!;
      steps(run, 2);
      const p = run.player;
      [p.x, p.y] = hide ? behindPillar(run, boss) : [boss.x, boss.y + 120];
      expect(exposed(run, boss.x, boss.y - 6)).toBe(!hide);
      startBreath(run, boss);
      steps(run, K.BREATH_WARN - 1);
      [p.x, p.y] = hide ? behindPillar(run, boss) : [boss.x, boss.y + 120];
      p.invulnTicks = 0;
      p.dashTicks = 5;
      const hp = (p.hp = p.stats.maxHp);
      for (let i = 0; i < 4; i++) {
        stepSim(run, EMPTY_INPUT);
        [p.x, p.y] = hide ? behindPillar(run, boss) : [boss.x, boss.y + 120];
      }
      if (hide) expect(p.hp).toBe(hp);
      else expect(p.hp).toBeLessThan(hp);
    }
  });

  it("쉴드가 깨지면 사슬이 끊기고 세 사람(체력 각각)으로 갈라짐 · 셋을 다 쓰러뜨려야 끝", () => {
    const run = cerbRun();
    const boss = split(run);
    expect(boss.cbPhase).toBe(2);
    const trio = ["cerbfist", "cerbflame", "cerbblade"].map((k) => find(run, k)!);
    expect(trio.every(Boolean)).toBe(true);
    expect(boss.hp).toBe(trio.reduce((sum, t) => sum + t.hp, 0));
    trio[0]!.hp = 0;
    trio[1]!.hp = 0;
    steps(run, 2);
    expect(find(run, "cerberus")).toBeDefined();
    trio[2]!.hp = 0;
    steps(run, 3);
    expect(find(run, "cerberus")).toBeUndefined();
  });

  it("무너지는 바닥: 한 구역만 남고, 떨어지면 피해 20 + 남은 구역으로", () => {
    const run = cerbRun();
    const boss = split(run);
    startFloor(run, boss, 0);
    const f = boss.cbFloor!;
    const left = Array.from({ length: FLOOR_COLS * FLOOR_ROWS }, (_, i) => i).filter((i) => fallTick(boss, i) === Infinity);
    expect(left).toEqual([f.safe]);
    const other = f.order[0]!;
    steps(run, fallTick(boss, other) - run.tick);
    const p = run.player;
    const [l, t, r, b] = cellRect(other);
    [p.x, p.y] = [(l + r) / 2, (t + b) / 2];
    p.invulnTicks = 0;
    const hp = (p.hp = p.stats.maxHp);
    stepSim(run, EMPTY_INPUT);
    expect(p.hp).toBeLessThanOrEqual(hp - K.FALL_DMG + 0.01);
  });

  it("염희 빨아들이기: 걷지 않아도 염희 쪽으로 끌려감", () => {
    const run = cerbRun();
    split(run);
    const flame = find(run, "cerbflame")!;
    for (const e of run.enemies) if (e !== flame && e.kind !== "cerberus") e.timer = 9999;
    const p = run.player;
    [p.x, p.y] = [flame.x, flame.y + 150];
    startPull(run, flame);
    steps(run, 70);
    const y0 = p.y;
    steps(run, 20);
    expect(p.y).toBeLessThan(y0);
  });

  it("페이즈 1·2를 오래 돌려도 오류 없이 패턴이 모두 나옴", () => {
    const run = cerbRun();
    steps(run, 3500);
    const boss = find(run, "cerberus")!;
    expect(boss.cbErupts ?? 0).toBe(0);
    damageEnemy(run, boss, boss.ward! * 0.7, 0, 0);
    steps(run, 1500);
    expect(boss.cbErupts).toBe(2);
    split(run);
    let floor = false;
    let pull = false;
    for (let i = 0; i < 5000; i++) {
      steps(run, 1);
      floor ||= !!boss.cbFloor;
      pull ||= (run.player.lureTicks ?? 0) > 0;
    }
    expect(floor && pull).toBe(true);
    expect(find(run, "cerbblade")).toBeDefined();
  });

  it("같은 시드면 같은 결과", () => {
    const a = cerbRun();
    const b = cerbRun();
    steps(a, 900);
    steps(b, 900);
    expect(a.hazards!.map((h) => [h.x, h.y, h.tick])).toEqual(b.hazards!.map((h) => [h.x, h.y, h.tick]));
    expect(a.projectiles.length).toBe(b.projectiles.length);
  });
});
