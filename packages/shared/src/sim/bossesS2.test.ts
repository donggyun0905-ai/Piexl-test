import { describe, expect, it } from "vitest";
import { BOSS_TIERS, bossForFloor, ENEMIES, type BossKind } from "../content";
import { TERRAIN } from "../terrainDefs";
import { generateFloor } from "./floor";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { shapeGrid } from "./layout";
import { makeTerrain, spikeState } from "./terrain";
import { makeEnemy } from "./util";

const S2: BossKind[] = ["toad", "salamander", "jelly", "captain"];

/** 무적 플레이어 앞에 보스 하나 */
function withBoss(kind: BossKind, seed = 4): RunState {
  const run = createRun(seed, "warden");
  run.player.invulnTicks = 99999;
  const e = makeEnemy(run, kind, run.player.x + 50, run.player.y - 40, 1, 10);
  e.hp = e.maxHp = 5000;
  run.enemies = [e];
  return run;
}

function play(run: RunState, n: number) {
  let hazards = 0;
  let shots = 0;
  let minions = 0;
  for (let i = 0; i < n; i++) {
    stepSim(run, { ...EMPTY_INPUT, moveX: i % 120 < 60 ? 100 : -100 });
    run.player.invulnTicks = 99999;
    hazards = Math.max(hazards, run.hazards?.length ?? 0);
    shots = Math.max(shots, run.projectiles.filter((p) => !p.fromPlayer).length);
    minions = Math.max(minions, run.enemies.filter((e) => e.noGold).length);
  }
  return { hazards, shots, minions };
}

/** 멀리 허수아비 하나: 방이 정리되지 않게 (지형이 작동하는 상태) */
function keepFight(run: RunState): void {
  run.rooms[run.roomId]!.cleared = false;
  run.enemies.push(makeEnemy(run, "dummy", 40, 40, 1, 0));
}

describe("시즌 2 새 보스 · 지형", () => {
  it("단계마다 새 보스가 섞여 나옴", () => {
    expect(BOSS_TIERS[0]).toContain("toad");
    expect(BOSS_TIERS[0]).toContain("salamander");
    expect(BOSS_TIERS[1]).toContain("jelly");
    expect(BOSS_TIERS[2]).toContain("captain");
    expect(S2.every((k) => ENEMIES[k].boss)).toBe(true);
  });

  it("모두 공격함 · 두꺼비는 진흙 · 불도롱뇽은 용암 웅덩이 · 해파리는 물 감전 · 선장은 선원", () => {
    for (const kind of S2) {
      const run = withBoss(kind);
      const w = play(run, 900);
      expect(w.hazards + w.shots, kind).toBeGreaterThan(0);
      if (kind === "toad") expect(run.terrain?.mud.length).toBeGreaterThan(0);
      if (kind === "salamander") expect(run.terrain?.lava.length).toBe(4);
      if (kind === "jelly") expect(run.terrain?.water.length).toBeGreaterThan(0);
      if (kind === "captain") expect(w.minions).toBeGreaterThan(0);
    }
  });

  it("같은 시드면 같은 결과 (화면·서버)", () => {
    for (const kind of S2) {
      const a = withBoss(kind, 9);
      const b = withBoss(kind, 9);
      play(a, 400);
      play(b, 400);
      expect([a.enemies[0]!.x, a.enemies[0]!.y, a.hazards?.length]).toEqual([b.enemies[0]!.x, b.enemies[0]!.y, b.hazards?.length]);
    }
  });

  it("새 보스방은 특별한 벽 배치 · 가운데 길은 비어 있음", () => {
    for (let seed = 1; seed < 300; seed++) {
      const boss = bossForFloor(1, seed);
      const map = generateFloor(seed, 1);
      const exit = map.rooms[map.exitId]!;
      if (!S2.includes(boss)) continue;
      expect(exit.shape.id).toBeGreaterThanOrEqual(1000);
      expect(shapeGrid(exit.shape)).not.toBeNull();
    }
  });

  it("지형: 진흙에서 느려짐 · 가시는 주기적으로 솟음 · 층 보스에 맞게 깔림", () => {
    const run = createRun(1, "warden");
    keepFight(run);
    run.terrain = { room: run.roomId, mud: [[run.player.x - 20, run.player.y - 20, 40, 40]], lava: [], water: [], spikes: [] };
    const x0 = run.player.x;
    stepSim(run, { ...EMPTY_INPUT, moveX: 100 });
    const slow = run.player.x - x0;
    run.terrain = undefined;
    const x1 = run.player.x;
    stepSim(run, { ...EMPTY_INPUT, moveX: 100 });
    expect(slow).toBeLessThan((run.player.x - x1) * (TERRAIN.mudSlow + 0.05));
    const states = new Set(Array.from({ length: TERRAIN.spikeCycle }, (_, t) => spikeState(t, 0)));
    expect([...states].sort()).toEqual([0, 1, 2]);
    let found = false;
    for (let seed = 1; seed < 80 && !found; seed++) {
      const r = createRun(seed, "warden");
      if (bossForFloor(1, seed) !== "salamander") continue;
      const room = r.map.rooms.find((x) => x.type === "combat");
      if (room) found = (makeTerrain(r, room.id)?.lava.length ?? 0) > 0;
    }
    expect(found).toBe(true);
  });

  it("방의 적을 다 잡으면 지형이 멈춤 (용암 피해·진흙 느려짐·독가스 없음)", () => {
    const run = createRun(1, "warden");
    const p = run.player;
    const room = run.rooms[run.roomId]!;
    const area = (): [number, number, number, number] => [p.x - 30, p.y - 30, 60, 60];
    room.cleared = false;
    keepFight(run);
    run.terrain = { room: run.roomId, mud: [], lava: [area()], water: [], spikes: [], gas: [{ x: p.x, y: p.y, r: 20, until: 9999 }] };
    for (let i = 0; i < 60; i++) stepSim(run, EMPTY_INPUT);
    expect(p.hp).toBeLessThan(p.stats.maxHp);
    room.cleared = true;
    run.enemies = [];
    p.hp = p.stats.maxHp;
    // 앞에서 밟은 독가스의 독은 따로 남으므로 지움 (정리된 방의 지형만 봄)
    p.poison = p.corrode = 0;
    run.terrain = { room: run.roomId, mud: [area()], lava: [area()], water: [], spikes: [], gas: [{ x: p.x, y: p.y, r: 20, until: 9999 }] };
    const x0 = p.x;
    stepSim(run, { ...EMPTY_INPUT, moveX: 100 });
    const moved = p.x - x0;
    for (let i = 0; i < 60; i++) stepSim(run, EMPTY_INPUT);
    expect(p.hp).toBe(p.stats.maxHp);
    expect(run.terrain.gas).toBeUndefined();
    run.terrain = undefined;
    const x1 = p.x;
    stepSim(run, { ...EMPTY_INPUT, moveX: 100 });
    expect(moved).toBeCloseTo(p.x - x1, 3);
  });
  it("불도롱뇽: 웅덩이로 가는 길이 막혀도 멈춰 서 있지 않고 그 자리에서 잠수", () => {
    const run = withBoss("salamander");
    const e = run.enemies[0]!;
    // 갈 수 없는 곳(방 밖)을 웅덩이로 노림
    Object.assign(e, { phase: "act", step: 0, auxX: -500, auxY: e.y, timer: 80, aux: 1e9 });
    for (let i = 0; i < 100 && (e.step ?? 0) === 0; i++) stepSim(run, EMPTY_INPUT);
    expect(e.step).toBeGreaterThan(0);
  });

  it("불도롱뇽: 네 가지 패턴을 돌아가며 씀 (용암 분출 포함)", () => {
    const run = withBoss("salamander");
    const r = play(run, 900);
    expect(r.hazards).toBeGreaterThan(2);
    expect(run.enemies[0]!.count).toBeGreaterThanOrEqual(4);
  });
});
