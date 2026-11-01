import { describe, expect, it } from "vitest";
import { DARK_DEATH, memoryLines } from "./bossPrimeval";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { continueToLastFloor } from "./rooms";
import { EXIT_X, makeEnemy, roomGrid } from "./util";

/** 7층 큰 방에 빛과 어둠 (무적 플레이어) */
function pair(light = 5000, dark = 5000): RunState {
  const run = createRun(9, "warden");
  continueToLastFloor(run, "plight");
  const l = makeEnemy(run, "plight", 120, 50, 1, 10);
  const d = makeEnemy(run, "pdark", 200, 50, 1, 10);
  l.maxHp = d.maxHp = 5000;
  l.hp = light;
  d.hp = dark;
  run.enemies = [l, d];
  return run;
}

function steps(run: RunState, n: number, watch?: (r: RunState) => void): void {
  for (let i = 0; i < n; i++) {
    stepSim(run, EMPTY_INPUT);
    run.player.invulnTicks = 99999;
    watch?.(run);
  }
}

/** 보스방까지 걸어감 (시작 방 → 여신의 선물 → 천상의 상점 → 보스방) */
function toBossRoom(run: RunState): void {
  for (let k = 0; k < 3; k++) {
    const from = run.roomId;
    run.rooms[from]!.cleared = true;
    run.enemies = [];
    run.rooms[from]!.enemies = [];
    run.player.x = EXIT_X[1]!;
    run.player.y = 40;
    for (let i = 0; i < 300 && run.roomId === from; i++) stepSim(run, { ...EMPTY_INPUT, moveY: -100 });
  }
}

describe("태초의 빛과 어둠", () => {
  it("고르면 큰 방에 둘이 같이 나오고, 방에는 상자 벽 6개", () => {
    const run = createRun(9, "warden");
    continueToLastFloor(run, "plight");
    toBossRoom(run);
    expect(run.enemies.map((e) => e.kind).sort()).toEqual(["pdark", "plight"]);
    expect(run.arena).toHaveLength(12);
    expect(roomGrid(run)).not.toBeNull();
    expect(run.enemies[0]!.x).not.toBe(run.enemies[1]!.x);
  });

  it("상자 벽은 가운데(계단 자리)를 막지 않음 (여러 시드)", () => {
    for (let seed = 1; seed <= 40; seed++) {
      const run = createRun(seed, "warden");
      continueToLastFloor(run, "plight");
      toBossRoom(run);
      const g = roomGrid(run)!;
      const cols = run.roomCols!;
      const midC = Math.floor(cols / 2);
      const midR = Math.floor(run.roomRows! / 2);
      for (let r = midR - 1; r <= midR + 1; r++) for (let c = midC - 1; c <= midC + 1; c++) expect(g[r * cols + c], `seed ${seed}`).toBe(g[cols + 1]);
    }
  });

  it("체력 합이 절반이 되면 더 많은 쪽만 남아 체력이 2배로 늘어 다 차고 강해짐", () => {
    const run = pair(3000, 2100);
    steps(run, 1);
    expect(run.enemies.filter((e) => e.kind === "plight" || e.kind === "pdark")).toHaveLength(2);
    run.enemies[1]!.hp = 1900;
    steps(run, 2);
    const left = run.enemies.filter((e) => e.kind === "plight" || e.kind === "pdark");
    expect(left).toHaveLength(1);
    expect(left[0]!.kind).toBe("plight");
    expect(left[0]!.hp).toBe(10000);
    expect(left[0]!.maxHp).toBe(10000);
    expect(left[0]!.step).toBe(2);
  });

  it("빛 혼자: 그물에 걸리면 방향 5개를 맞게 눌러야 풀리고, 틀리면 3초 못 움직임 · 네 방향 빔", () => {
    const run = pair(5000, 0);
    let netted = false;
    let beams = false;
    steps(run, 700, (r) => {
      netted ||= (r.player.netSeq?.length ?? 0) > 0;
      beams ||= (r.enemies[0]!.beamTicks ?? 0) > 0;
      if ((r.player.netSeq?.length ?? 0) > 0) r.player.netSeq = [];
    });
    expect(beams).toBe(true);
    expect(netted).toBe(true);
    // 직접 걸어 보기: 맞게 누르면 풀림
    const p = run.player;
    p.netSeq = [0, 1, 2, 3, 0];
    p.netLast = -1;
    const press = (mx: number, my: number) => {
      stepSim(run, { ...EMPTY_INPUT, moveX: mx, moveY: my });
      stepSim(run, EMPTY_INPUT);
    };
    const x = p.x;
    press(0, -100);
    press(100, 0);
    expect(p.x).toBe(x);
    press(0, 100);
    press(-100, 0);
    press(0, -100);
    expect(p.netSeq).toHaveLength(0);
    // 틀리면 3초 못 움직임
    p.netSeq = [1, 1, 1, 1, 1];
    press(-100, 0);
    expect(p.netStun).toBeGreaterThan(150);
  });

  it("어둠 혼자: 유령 4마리 · 닿을 때마다 어둠이 짙어지고 5번이면 쓰러짐 · 다크 오라 선", () => {
    const run = pair(0, 5000);
    let ghosts = 0;
    let sweeps = 0;
    steps(run, 900, (r) => {
      ghosts = Math.max(ghosts, r.enemies.filter((e) => e.kind === "ghost").length);
      sweeps = Math.max(sweeps, r.enemies.find((e) => e.kind === "pdark")?.sweeps?.length ?? 0);
    });
    expect(ghosts).toBe(4);
    expect(sweeps).toBe(2);
    const p = run.player;
    p.darkStacks = DARK_DEATH - 1;
    p.darkTicks = 200;
    const g = makeEnemy(run, "ghost", p.x, p.y, 1, 999);
    run.enemies.push(g);
    stepSim(run, EMPTY_INPUT);
    expect(run.over).toBe(true);
  });

  it("둘이 있을 때 빛·어둠 화살 15발 난사(벽에 튕김) · 빛 혼자 남으면 검신 소환(한 번에 하나)", () => {
    const run = pair();
    let light = 0;
    let dark = 0;
    steps(run, 600, (r) => {
      light = Math.max(light, r.projectiles.filter((p) => p.look === "larrow" && (p.bounces ?? 0) > 0).length);
      dark = Math.max(dark, r.projectiles.filter((p) => p.look === "darrow").length);
    });
    expect(light).toBeGreaterThanOrEqual(8);
    expect(dark).toBeGreaterThanOrEqual(7);
    const l = pair(5000, 0);
    let gods = 0;
    steps(l, 1500, (r) => (gods = Math.max(gods, r.enemies.filter((e) => e.kind === "swordgod").length)));
    expect(gods).toBe(1);
  });

  it("기억력: 흰 선이 차례로 깔리고, 마지막에 깔린 선부터 거꾸로 터짐", () => {
    const run = pair();
    memoryLines(run, run.enemies[0]!);
    const lines = (run.hazards ?? []).filter((h) => h.fx === "memory");
    expect(lines).toHaveLength(6);
    for (let i = 1; i < lines.length; i++) {
      expect(lines[i]!.start).toBeGreaterThan(lines[i - 1]!.start);
      expect(lines[i]!.tick).toBeLessThan(lines[i - 1]!.tick);
    }
    expect(Math.min(...lines.map((h) => h.tick))).toBeGreaterThan(Math.max(...lines.map((h) => h.start)));
  });

  it("어둠 혼자: 한 번 깔린 어둠은 걷히지 않음 · 빛 혼자: 거울(이동 방향 반대)", () => {
    const run = pair(0, 5000);
    let veil = 0;
    steps(run, 1500, (r) => (veil = r.enemies.find((e) => e.kind === "pdark")?.veil ?? 0));
    expect(veil).toBeGreaterThan(0);
    const l = pair(5000, 0);
    let mirrored = false;
    steps(l, 1500, (r) => (mirrored ||= (r.player.mirrorTicks ?? 0) > 0));
    expect(mirrored).toBe(true);
    l.player.mirrorTicks = 100;
    l.player.netSeq = [];
    l.player.netStun = 0;
    l.player.lureTicks = 0;
    const x = l.player.x;
    stepSim(l, { ...EMPTY_INPUT, moveX: 100 });
    expect(l.player.x).toBeLessThan(x);
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const run = pair(2400, 2400);
      for (let i = 0; i < 700; i++) {
        stepSim(run, { ...EMPTY_INPUT, moveX: i % 120 < 60 ? 100 : -100 });
        run.player.invulnTicks = 99999;
      }
      return JSON.stringify(run);
    };
    expect(go()).toBe(go());
  });
});
