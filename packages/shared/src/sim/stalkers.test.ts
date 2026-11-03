import { describe, expect, it } from "vitest";
import type { CharacterId, EnemyKind } from "../content";
import { TERRAIN } from "../terrainDefs";
import { heal } from "./heal";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { dopRanged, stalkerKinds } from "./stalkers";
import { makeEnemy } from "./util";

/** 무적 플레이어 근처에 새 몬스터 하나 */
function withOne(kind: EnemyKind, who: CharacterId = "warden", seed = 4): RunState {
  const run = createRun(seed, who);
  run.player.invulnTicks = 99999;
  const e = makeEnemy(run, kind, run.player.x + 40, run.player.y - 30, 1, 10);
  e.hp = e.maxHp = 5000;
  run.enemies = [e];
  // 시작 방은 이미 정리돼 있음: 싸우는 방으로 (정리된 방은 지형이 멈춤)
  run.rooms[run.roomId]!.cleared = false;
  return run;
}

function play(run: RunState, n: number, each?: (i: number) => void): void {
  for (let i = 0; i < n; i++) {
    stepSim(run, { ...EMPTY_INPUT, moveX: i % 120 < 60 ? 60 : -60 });
    run.player.invulnTicks = 99999;
    each?.(i);
  }
}

describe("시즌 2 새 몬스터", () => {
  it("2층부터 베놈·땅 물고기, 3층부터 도플갱어·그림자", () => {
    expect(stalkerKinds(1)).toEqual([]);
    expect(stalkerKinds(2)).toEqual(["venom", "landfish", "bombbug", "skelarcher"]);
    expect(stalkerKinds(4)).toContain("doppel");
    expect(stalkerKinds(4)).toContain("lurker");
  });

  it("도플갱어: 멀리 쏘는 캐릭터면 탄을 쏘고, 근접이면 다가와 벰", () => {
    const far = withOne("doppel", "drifter");
    expect(dopRanged(far)).toBe(true);
    let shots = 0;
    play(far, 400, () => (shots = Math.max(shots, far.projectiles.filter((p) => !p.fromPlayer).length)));
    expect(shots).toBeGreaterThan(0);

    const near = withOne("doppel", "warden");
    expect(dopRanged(near)).toBe(false);
    let slashes = 0;
    play(near, 400, () => (slashes = Math.max(slashes, near.hazards?.length ?? 0)));
    expect(slashes).toBeGreaterThan(0);
  });

  it("베놈: 독가스가 퍼지고, 가스 안에 있으면 부식독으로 회복 40% 감소", () => {
    const run = withOne("venom");
    play(run, 300);
    const gas = run.terrain?.gas ?? [];
    expect(gas.length).toBeGreaterThan(0);
    // 가스 안에 세우면 부식독
    run.player.x = run.player.prevX = gas[0]!.x;
    run.player.y = run.player.prevY = gas[0]!.y;
    stepSim(run, EMPTY_INPUT);
    expect(run.player.corrode ?? 0).toBeGreaterThan(0);
    // 밟으면 독 3초: 가스를 나가도 남아 0.5초마다 피해
    expect(run.player.poison).toBe(TERRAIN.poisonTicks);
    const hp0 = run.player.hp;
    run.player.invulnTicks = 0;
    for (let i = 0; i < 80; i++) {
      stepSim(run, { ...EMPTY_INPUT, moveX: 100 });
      run.player.invulnTicks = 0;
    }
    expect(run.player.hp).toBeLessThan(hp0);
    run.player.hp = 10;
    heal(run, 10);
    expect(run.player.hp).toBeCloseTo(10 + 10 * (1 - TERRAIN.corrodeCut));
    // 시간이 지나면 풀림
    run.enemies = [];
    run.terrain = undefined;
    play(run, TERRAIN.corrodeTicks + 2);
    expect(run.player.corrode ?? 0).toBe(0);
    expect(run.player.poison ?? 0).toBe(0);
  });

  it("땅 물고기: 땅속에선 맞지 않고, 솟구쳐 뛰어오를 때 맞을 수 있음 · 자리가 터짐", () => {
    const run = withOne("landfish");
    let under = false;
    let up = false;
    let hazards = 0;
    play(run, 500, () => {
      const e = run.enemies[0]!;
      if (e.air && e.immune) under = true;
      if (!e.air && !e.immune && e.phase === "act") up = true;
      hazards = Math.max(hazards, run.hazards?.length ?? 0);
    });
    expect(under).toBe(true);
    expect(up).toBe(true);
    expect(hazards).toBeGreaterThan(0);
  });

  it("땅 물고기: 땅속에 있으면 기절·화상 등 아무것도 받지 않음", () => {
    const run = withOne("landfish");
    play(run, 5, () => {});
    const e = run.enemies[0]!;
    expect(e.immune).toBe(true);
    Object.assign(e, { stunTicks: 120, burnTicks: 120, slowTicks: 120 });
    play(run, 1, () => {});
    expect([e.stunTicks, e.burnTicks, e.slowTicks]).toEqual([0, 0, 0]);
  });

  it("땅 물고기: 기절해 늦어지면 예고만 남고, 실제로 땅에 닿을 때 그 자리에서 터짐", () => {
    const run = withOne("landfish");
    // 뛰어오르기 시작할 때까지
    play(run, 400, () => {});
    const e = run.enemies[0]!;
    while (e.step !== 2) play(run, 1);
    const warn = run.hazards!.find((h) => h.owner === e.id && h.hold)!;
    expect(warn.damage).toBe(0);
    // 오래 기절: 예고 때가 지나도 터지지 않음
    e.stunTicks = 160;
    play(run, 140);
    expect(run.hazards!.some((h) => h.damage > 0 && h.by === "landfish")).toBe(false);
    expect(run.hazards!.some((h) => h.owner === e.id && h.hold)).toBe(true);
    // 기절이 풀리고 땅에 닿으면 그 자리에서 터짐 (예고는 사라짐)
    let hit = false;
    play(run, 200, () => {
      if (run.effects.some((f) => f.kind === "pillar")) hit = true;
    });
    expect(hit).toBe(true);
  });

  it("그림자: 등 뒤로 돌아가 큰 한 방", () => {
    const run = withOne("lurker");
    run.player.faceX = 1;
    run.player.faceY = 0;
    let dmg = 0;
    let behind = false;
    for (let i = 0; i < 600 && !dmg; i++) {
      stepSim(run, EMPTY_INPUT);
      run.player.invulnTicks = 99999;
      const h = run.hazards?.find((z) => z.damage > 0);
      if (h) {
        dmg = h.damage;
        behind = h.x < run.player.x;
      }
    }
    expect(dmg).toBeGreaterThanOrEqual(20);
    expect(behind).toBe(true);
  });

  it("같은 시드면 같은 결과 (화면·서버)", () => {
    for (const kind of ["doppel", "venom", "landfish", "lurker"] as EnemyKind[]) {
      const a = withOne(kind, "drifter", 9);
      const b = withOne(kind, "drifter", 9);
      play(a, 300);
      play(b, 300);
      expect(JSON.stringify(a.enemies)).toBe(JSON.stringify(b.enemies));
    }
  });
});
