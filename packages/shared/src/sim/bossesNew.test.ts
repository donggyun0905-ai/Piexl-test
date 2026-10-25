import { describe, expect, it } from "vitest";
import { BOSS_TIERS, bossForFloor, ENEMIES, type BossKind } from "../content";
import { damageEnemy } from "./combat";
import { inHazard } from "./hazards";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { makeEnemy } from "./util";

const NEW: BossKind[] = ["knight", "archer", "siren", "centaur", "plant", "reaper", "swordgod", "archangel"];

/** 무적 플레이어 앞에 보스 하나 */
function withBoss(kind: BossKind, hp = 5000, seed = 4): RunState {
  const run = createRun(seed, "warden");
  run.player.invulnTicks = 99999;
  const e = makeEnemy(run, kind, run.player.x + 50, run.player.y - 30, 1, 10);
  e.hp = e.maxHp = hp;
  run.enemies = [e];
  return run;
}

/** n틱 동안 나온 적 탄·위험 표시·부른 적 수 (가장 많았을 때) */
function watch(run: RunState, n: number, move = false) {
  let shots = 0;
  let hazards = 0;
  let minions = 0;
  for (let i = 0; i < n; i++) {
    stepSim(run, move ? { ...EMPTY_INPUT, moveX: i % 120 < 60 ? 100 : -100 } : EMPTY_INPUT);
    run.player.invulnTicks = 99999;
    shots = Math.max(shots, run.projectiles.filter((p) => !p.fromPlayer).length);
    hazards = Math.max(hazards, run.hazards?.length ?? 0);
    minions = Math.max(minions, run.enemies.filter((e) => e.noGold).length);
  }
  return { shots, hazards, minions };
}

describe("새 보스", () => {
  it("단계마다 보스가 시드에 따라 골고루 나옴", () => {
    for (const [floor, tier] of [[1, 0], [4, 1], [6, 2]] as const) {
      const seen = new Set<BossKind>();
      for (let seed = 1; seed < 200; seed++) seen.add(bossForFloor(floor, seed));
      expect([...seen].sort()).toEqual([...BOSS_TIERS[tier]!].sort());
    }
    expect(NEW.every((k) => ENEMIES[k].boss)).toBe(true);
  });

  it("모든 새 보스가 공격함 (탄 또는 예고된 범위 공격)", () => {
    for (const kind of NEW) {
      const w = watch(withBoss(kind), 600, true);
      expect(w.shots + w.hazards, kind).toBeGreaterThan(0);
    }
  });

  it("체력 절반 아래면 더 세짐: 세이렌 음표 2개 · 천사장 성기사 4마리 (가디언은 늘 3마리)", () => {
    const count = (kind: BossKind, hp: number, ticks: number, f: (r: RunState) => number) => {
      const run = withBoss(kind);
      run.enemies[0]!.hp = hp;
      let best = 0;
      for (let i = 0; i < ticks; i++) {
        stepSim(run, EMPTY_INPUT);
        run.player.invulnTicks = 99999;
        best = Math.max(best, f(run));
      }
      return best;
    };
    const notes = (r: RunState) => r.projectiles.filter((p) => p.lure).length;
    expect(count("siren", 5000, 30, notes)).toBe(1);
    expect(count("siren", 2000, 30, notes)).toBe(2);
    const paladins = (r: RunState) => r.enemies.filter((e) => e.kind === "paladin").length;
    const guards = (r: RunState) => r.enemies.filter((e) => e.kind === "guardian").length;
    expect(count("archangel", 5000, 20, paladins)).toBe(2);
    expect(count("archangel", 2000, 20, paladins)).toBe(4);
    expect(count("archangel", 5000, 20, guards)).toBe(3);
    expect(count("archangel", 2000, 20, guards)).toBe(3);
  });

  it("천사장 가디언은 플레이어가 멀면 천사장 곁을 지키고, 성기사는 플레이어를 쫓음", () => {
    const run = withBoss("archangel");
    const angel = run.enemies[0]!;
    angel.x = 170;
    angel.y = 60;
    run.player.x = 70;
    run.player.y = 110;
    for (let i = 0; i < 120; i++) {
      stepSim(run, EMPTY_INPUT);
      run.player.invulnTicks = 99999;
      angel.x = 170;
      angel.y = 60;
    }
    const near = (e: { x: number; y: number }, o: { x: number; y: number }) => Math.hypot(e.x - o.x, e.y - o.y);
    for (const g of run.enemies.filter((e) => e.kind === "guardian")) expect(near(g, angel)).toBeLessThan(40);
    const closest = Math.min(...run.enemies.filter((e) => e.kind === "paladin").map((m) => near(m, run.player)));
    expect(closest).toBeLessThan(near(angel, run.player) - 30);
  });

  it("천사장 탑: 네 모서리에 서고 차례인 탑만 맞음, 다 부수면 소환이 멈추고 빛 구슬", () => {
    const run = withBoss("archangel");
    stepSim(run, EMPTY_INPUT);
    const towers = () => run.enemies.filter((e) => e.kind === "tower");
    expect(towers()).toHaveLength(4);
    stepSim(run, EMPTY_INPUT);
    const [a, b] = towers();
    damageEnemy(run, b!, 10, 0, 0);
    expect(b!.hp).toBe(b!.maxHp);
    damageEnemy(run, a!, 10, 0, 0);
    expect(a!.hp).toBeLessThan(a!.maxHp);
    for (const t of towers()) t.hp = 0;
    run.enemies = run.enemies.filter((e) => e.kind === "archangel");
    const angel = run.enemies[0]!;
    let light = 0;
    for (let i = 0; i < 500; i++) {
      stepSim(run, EMPTY_INPUT);
      run.player.invulnTicks = 99999;
      light = Math.max(light, run.projectiles.filter((p) => p.look === "light").length);
    }
    expect(run.enemies.filter((e) => e.kind === "paladin" || e.kind === "guardian")).toHaveLength(0);
    expect(light).toBeGreaterThan(0);
    expect(angel.hp).toBeGreaterThan(0);
  });

  it("하드플랜트 덩굴은 사방 8줄로 내려찍음", () => {
    const run = withBoss("plant");
    run.enemies[0]!.count = 1;
    run.enemies[0]!.timer = 1;
    stepSim(run, EMPTY_INPUT);
    expect((run.hazards ?? []).filter((h) => h.fx === "vine")).toHaveLength(8);
  });

  it("세이렌 음표에 맞으면 1.5초 동안 세이렌 쪽으로 끌려감", () => {
    const run = withBoss("siren");
    stepSim(run, EMPTY_INPUT);
    const note = run.projectiles.find((p) => p.lure)!;
    note.x = run.player.x;
    note.y = run.player.y;
    note.vx = note.vy = 0;
    run.player.invulnTicks = 0;
    const hp = run.player.hp;
    stepSim(run, EMPTY_INPUT);
    expect(run.player.hp).toBeLessThan(hp);
    expect(run.player.lureTicks).toBeGreaterThan(0);
    const siren = run.enemies[0]!;
    const d0 = Math.hypot(siren.x - run.player.x, siren.y - run.player.y);
    for (let i = 0; i < 30; i++) stepSim(run, { ...EMPTY_INPUT, moveX: run.player.x < siren.x ? -100 : 100 });
    expect(Math.hypot(siren.x - run.player.x, siren.y - run.player.y)).toBeLessThan(d0);
    // 세이렌이 쓰러지면 음표도 사라짐
    siren.hp = 0;
    stepSim(run, EMPTY_INPUT);
    stepSim(run, EMPTY_INPUT);
    expect(run.projectiles.some((p) => p.lure)).toBe(false);
  });

  it("세이렌에게 홀린 동안은 공격·물약을 못 씀 (풀리면 다시 됨)", () => {
    const run = withBoss("siren");
    run.player.lureTicks = 60;
    run.player.lureId = undefined;
    run.player.useSlots[0] = "potion";
    run.player.hp = 50;
    const swings = () => run.effects.filter((e) => e.kind === "swing").length;
    for (let i = 0; i < 20; i++) stepSim(run, { ...EMPTY_INPUT, attack: true, aimX: 100, useSlot: 1 });
    expect(swings()).toBe(0);
    expect(run.player.useSlots[0]).toBe("potion");
    run.player.lureTicks = 0;
    stepSim(run, { ...EMPTY_INPUT, attack: true, aimX: 100, useSlot: 1 });
    expect(swings()).toBeGreaterThan(0);
    expect(run.player.useSlots[0]).toBeNull();
  });

  it("검신 검기 격자에는 빛나지 않는 안전한 칸이 있음", () => {
    const run = withBoss("swordgod");
    for (let i = 0; i < 40 && (run.hazards?.length ?? 0) < 4; i++) stepSim(run, EMPTY_INPUT);
    const grid = run.hazards ?? [];
    expect(grid.length).toBeGreaterThan(4);
    let safe = 0;
    for (let x = 20; x < 220; x += 4) for (let y = 20; y < 124; y += 4) if (!grid.some((h) => inHazard(h, x, y, run.player.r))) safe++;
    expect(safe).toBeGreaterThan(20);
  });

  it("부채꼴 위험 표시는 앞쪽만, 선은 선 근처만 맞음", () => {
    const fanH = { tick: 0, start: 0, x: 100, y: 70, radius: 30, damage: 5, dirX: 1, dirY: 0, arc: 0.25 };
    expect(inHazard(fanH, 120, 70, 3)).toBe(true);
    expect(inHazard(fanH, 80, 70, 3)).toBe(false);
    const line = { tick: 0, start: 0, x: 20, y: 70, radius: 0, damage: 5, toX: 200, toY: 70, width: 4 };
    expect(inHazard(line, 150, 74, 3)).toBe(true);
    expect(inHazard(line, 150, 90, 3)).toBe(false);
  });

  it("새 보스도 같은 시드·입력이면 같은 결과", () => {
    for (const kind of NEW) {
      const go = () => {
        const run = withBoss(kind, 5000, 77);
        watch(run, 500, true);
        return JSON.stringify(run);
      };
      expect(go(), kind).toBe(go());
    }
  });
});
