import { describe, expect, it } from "vitest";
import { lateDmg } from "./foeScale";
import { chainPlayer } from "./bossBinds";
import { closeZones, updateZones, ZONE_DAMAGE, zoneRect } from "./bossZones";
import { damageEnemy } from "./combat";
import { updateHazards } from "./hazards";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { continueToLastFloor } from "./rooms";
import { makeEnemy } from "./util";
import { FINAL_BOSS_HIT_RULES } from "./finalBossHit";

/** 7층 큰 방에 갓이터 하나 (무적 플레이어) */
function hades(hp = 5000): RunState {
  const run = createRun(8, "warden");
  continueToLastFloor(run, "godeater");
  const e = makeEnemy(run, "godeater", 160, 50, 1, 10);
  e.maxHp = 5000;
  e.hp = hp;
  run.enemies = [e];
  return run;
}

function steps(run: RunState, n: number, watch?: (r: RunState) => void): void {
  for (let i = 0; i < n; i++) {
    stepSim(run, EMPTY_INPUT);
    run.player.invulnTicks = 99999;
    watch?.(run);
  }
}

const of = (run: RunState, kind: string) => run.enemies.filter((e) => e.kind === kind && e.hp > 0);

describe("갓이터", () => {
  it("대검 두 자루가 있는 동안은 갓이터가 맞지 않고, 다 부수면 맞음", () => {
    const run = hades();
    steps(run, 2);
    expect(of(run, "ruinblade")).toHaveLength(1);
    expect(of(run, "chaosblade")).toHaveLength(1);
    const boss = run.enemies[0]!;
    damageEnemy(run, boss, 100, 0, 0);
    expect(boss.hp).toBe(5000);
    for (const b of [...of(run, "ruinblade"), ...of(run, "chaosblade")]) b.hp = 0;
    steps(run, 2);
    // 40%는 받아 넘기지만 여러 번 때리면 피해가 들어감
    for (let i = 0; i < 20; i++) damageEnemy(run, boss, 100, 0, 0);
    expect(boss.hp).toBeLessThan(5000);
    expect(boss.hp).toBeGreaterThan(5000 - 2000);
  });

  it("받아 넘기기: 갓이터 약 40% · 대검 약 40%", () => {
    const run = hades();
    steps(run, 2);
    const rate = (e: (typeof run.enemies)[number]) => {
      e.hp = e.maxHp = 1e9;
      let blocked = 0;
      for (let i = 0; i < 1000; i++) {
        const hp = e.hp;
        damageEnemy(run, e, 1, 0, 0);
        if (e.hp === hp) blocked++;
      }
      return blocked / 1000;
    };
    for (const b of [...of(run, "ruinblade"), ...of(run, "chaosblade")]) b.hp = 0;
    steps(run, 2);
    expect(rate(run.enemies[0]!)).toBeCloseTo(0.4, 1);
    const r2 = hades();
    steps(r2, 2);
    expect(rate(r2.enemies.find((e) => e.kind === "ruinblade")!)).toBeCloseTo(0.4, 1);
  });

  it("체력 절반 아래: 날려 버리기(멀리 밀려남) · 봉인의 사슬(W·A·S·D 6개를 순서대로, 틀리거나 늦으면 큰 피해)", () => {
    const run = hades(2000);
    steps(run, 2);
    for (const b of [...of(run, "ruinblade"), ...of(run, "chaosblade")]) b.hp = 0;
    let pushed = 0;
    let chained = false;
    steps(run, 900, (r) => {
      const d = Math.hypot(r.player.x - r.enemies[0]!.x, r.player.y - r.enemies[0]!.y);
      pushed = Math.max(pushed, d);
      chained ||= (r.player.chainTicks ?? 0) > 0;
      if ((r.player.chainTicks ?? 0) > 0) r.player.chainTicks = 0;
    });
    expect(chained).toBe(true);
    // 직접 사슬: 보이는 방향(W·D·S·A)을 순서대로 누르면 끊어지고 피해 없음
    const MOVE: [number, number][] = [[0, -100], [100, 0], [0, 100], [-100, 0]];
    const press = (r: RunState, d: number) => {
      stepSim(r, { ...EMPTY_INPUT, moveX: MOVE[d]![0], moveY: MOVE[d]![1] });
      stepSim(r, EMPTY_INPUT);
    };
    const r2 = hades();
    r2.enemies = [];
    chainPlayer(r2);
    r2.player.invulnTicks = 0;
    const hp0 = r2.player.hp;
    const x = r2.player.x;
    for (const d of [...r2.player.chains!]) press(r2, d);
    expect(r2.player.chainTicks).toBe(0);
    expect(r2.player.hp).toBe(hp0);
    expect(r2.player.x).toBe(x);
    // 틀린 방향을 누르면 · 시간이 다 되면 큰 피해
    for (const wrong of [true, false]) {
      const r3 = hades();
      r3.enemies = [];
      chainPlayer(r3);
      r3.player.invulnTicks = 0;
      const hp = r3.player.hp;
      if (wrong) press(r3, (r3.player.chains![0]! + 1) % 4);
      else for (let i = 0; i < 260; i++) stepSim(r3, EMPTY_INPUT);
      expect(r3.player.hp).toBeLessThan(hp - 20);
      expect(r3.player.chainTicks).toBe(0);
    }
  });

  it("혼자 남으면: 4분할 구역을 하나씩 닫음(갇히면 피해 20 + 깜깜, 대시면 피함) · 벽에 튕기는 거대한 낫 3개", () => {
    const run = hades();
    steps(run, 2);
    for (const b of [...of(run, "ruinblade"), ...of(run, "chaosblade")]) b.hp = 0;
    let zones = 0;
    let reapers = 0;
    steps(run, 1200, (r) => {
      zones = Math.max(zones, r.enemies[0]!.zones?.length ?? 0);
      reapers = Math.max(reapers, r.projectiles.filter((p) => p.look === "reaper").length);
    });
    expect(zones).toBe(3);
    expect(reapers).toBe(3);
    // 낫은 사라지지 않고 계속 (반경 24)
    steps(run, 1200);
    const left = run.projectiles.filter((p) => p.look === "reaper");
    expect(left).toHaveLength(3);
    expect(left.every((p) => p.r === 24)).toBe(true);
    for (const dash of [false, true]) {
      const r = hades();
      const e = r.enemies[0]!;
      closeZones(r, e);
      const z = e.zones![0]!;
      const [l, t, rr, b] = zoneRect(z.q);
      r.tick = z.at;
      r.player.x = (l + rr) / 2;
      r.player.y = (t + b) / 2;
      r.player.invulnTicks = 0;
      r.player.dashTicks = dash ? 5 : 0;
      const hp = r.player.hp;
      updateZones(r, e);
      expect(hp - r.player.hp).toBeCloseTo(dash ? 0 : ZONE_DAMAGE * lateDmg(r) + r.player.stats.maxHp * FINAL_BOSS_HIT_RULES.MAX_HP_PCT);
      expect((r.player.blindTicks ?? 0) > 0).toBe(!dash);
    }
  });

  it("파괴의 검: 찌르기 돌진 뒤 회전 돌진(돌진 중엔 맞지 않음) · 혼돈의 검: 큰 베기 3번 + 찌르기", () => {
    const run = hades();
    let spin = false;
    let guarded = false;
    let slashes = 0;
    let stabs = 0;
    steps(run, 1500, (r) => {
      spin ||= r.enemies.some((e) => e.kind === "ruinblade" && e.phase === "charge" && e.step === 1);
      guarded ||= r.enemies.some((e) => e.kind === "ruinblade" && e.phase === "charge" && e.immune === true);
      const hz = r.hazards ?? [];
      slashes = Math.max(slashes, hz.filter((h) => h.fx === "bslash" && h.radius === 75).length);
      stabs = Math.max(stabs, hz.filter((h) => h.fx === "stab" && h.damage > 0 && h.width === 8).length);
    });
    expect(spin).toBe(true);
    expect(guarded).toBe(true);
    expect(slashes).toBeGreaterThanOrEqual(1);
    expect(stabs).toBeGreaterThanOrEqual(1);
  });

  it("혼돈의 검: 영혼 4개를 다 부숴야 맞음 · 플레이어를 순간이동 · 보라색 거짓 공격은 피해 없음", () => {
    const run = hades();
    let souls = 0;
    let fakes = 0;
    let moved = false;
    const start = { x: run.player.x, y: run.player.y };
    steps(run, 600, (r) => {
      souls = Math.max(souls, of(r, "soul").length);
      fakes = Math.max(fakes, (r.hazards ?? []).filter((h) => h.fx === "fake" && h.damage === 0).length);
      moved ||= Math.hypot(r.player.x - start.x, r.player.y - start.y) > 20;
    });
    expect(souls).toBe(4);
    expect(fakes).toBeGreaterThanOrEqual(6);
    expect(moved).toBe(true);
    const chaos = of(run, "chaosblade")[0]!;
    if (of(run, "soul").length > 0) {
      damageEnemy(run, chaos, 10, 0, 0);
      expect(chaos.hp).toBe(chaos.maxHp);
    }
    for (const sl of of(run, "soul")) sl.hp = 0;
    steps(run, 2);
    damageEnemy(run, chaos, 10, 0, 0);
    expect(chaos.hp).toBeLessThan(chaos.maxHp);
  });

  it("심판: 검정이면 움직이던 사람이, 붉은색이면 가만히 있던 사람이 맞음", () => {
    for (const [still, moving, hurt] of [["black", true, true], ["black", false, false], ["red", true, false], ["red", false, true]] as const) {
      const run = hades();
      run.player.invulnTicks = 0;
      run.player.stillTicks = moving ? 0 : 60;
      run.hazards = [{ tick: run.tick, start: run.tick - 10, x: 100, y: 80, radius: 0, damage: 20, still }];
      const hp = run.player.hp;
      updateHazards(run);
      expect(run.player.hp < hp, `${still} ${moving}`).toBe(hurt);
    }
  });

  it("대검을 다 부수면 떠다니는 거대한 구슬(맞아도 사라지지 않음) · 벽 검기 · 대낫이 더해짐", () => {
    const run = hades();
    steps(run, 2);
    for (const b of [...of(run, "ruinblade"), ...of(run, "chaosblade")]) b.hp = 0;
    let orbs = 0;
    let waves = 0;
    let scythes = 0;
    steps(run, 900, (r) => {
      orbs = Math.max(orbs, r.projectiles.filter((p) => p.look === "orbRuin" || p.look === "orbChaos").length);
      waves = Math.max(waves, r.projectiles.filter((p) => p.look === "bigwave" && p.r >= 9).length);
      scythes = Math.max(scythes, (r.hazards ?? []).filter((h) => h.fx === "scythe").length);
    });
    expect(orbs).toBe(2);
    expect(run.projectiles.filter((p) => p.look === "orbRuin").every((p) => p.r === 33)).toBe(true);
    expect(waves).toBeGreaterThanOrEqual(10);
    expect(scythes).toBeGreaterThanOrEqual(3);
    // 갓이터가 쓰러지면 구슬도 사라짐
    run.enemies[0]!.hp = 0;
    steps(run, 2);
    expect(run.projectiles.filter((p) => p.stay)).toHaveLength(0);
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const run = hades();
      for (let i = 0; i < 700; i++) {
        stepSim(run, { ...EMPTY_INPUT, moveX: i % 120 < 60 ? 100 : -100 });
        run.player.invulnTicks = 99999;
      }
      return JSON.stringify(run);
    };
    expect(go()).toBe(go());
  });
});
