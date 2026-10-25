import { describe, expect, it } from "vitest";
import { damageEnemy } from "./combat";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { spawnEnemies, startFloor } from "./rooms";
import { GNAT_SPEED_MUL, GUARD_SWING_TICKS, SWARM } from "./minions";
import { makeEnemy } from "./util";

/** 적 없는 방 가운데에 선 플레이어 */
function room(): RunState {
  const s = createRun(5, "warden");
  s.enemies = [];
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 72;
  s.player.invulnTicks = 0;
  return s;
}

describe("새 적: 날벌레·가디언", () => {
  it("가디언: 방패 3번을 깨기 전에는 피해가 없음", () => {
    const s = room();
    const e = makeEnemy(s, "guardian", 160, 72, 1, 60);
    expect(e.shield).toBe(3);
    for (let i = 0; i < 3; i++) damageEnemy(s, e, 20, 1, 0);
    expect(e.hp).toBe(e.maxHp);
    expect(e.shield).toBe(0);
    damageEnemy(s, e, 20, 1, 0);
    expect(e.hp).toBe(e.maxHp - 20);
  });

  it("가디언: 다가와 돌진한 뒤 멈춰서 휘두름 (앞에 있으면 맞음)", () => {
    const s = room();
    const e = makeEnemy(s, "guardian", 180, 72, 1, 1);
    s.enemies = [e];
    const phases = new Set<string>();
    const hp = s.player.hp;
    for (let i = 0; i < 200 && s.player.hp === hp; i++) {
      stepSim(s, EMPTY_INPUT);
      phases.add(e.phase);
    }
    expect([...phases]).toEqual(expect.arrayContaining(["windup", "charge", "swing"]));
    expect(s.player.hp).toBeLessThan(hp);
  });

  it("가디언: 휘두르기 직전에 대시하면 피함", () => {
    const s = room();
    const e = makeEnemy(s, "guardian", 140, 72, 1, 1);
    e.phase = "swing";
    e.timer = 2;
    e.dirX = -1;
    e.dirY = 0;
    s.enemies = [e];
    const hp = s.player.hp;
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: -100 });
    for (let i = 0; i < 3; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.hp).toBe(hp);
    expect(GUARD_SWING_TICKS).toBeGreaterThan(10);
  });

  it("날벌레: 플레이어의 절반 빠르기, 무리가 흩어지지 않음", () => {
    const s = room();
    s.player.x = s.player.prevX = 220;
    s.player.y = s.player.prevY = 120;
    s.enemies = SWARM.map(([ox, oy]) => makeEnemy(s, "gnat", 50 + ox, 50 + oy, 1, 30));
    s.player.invulnTicks = 9999;
    const e = s.enemies[0]!;
    const x0 = e.x;
    const y0 = e.y;
    stepSim(s, EMPTY_INPUT);
    expect(Math.hypot(e.x - x0, e.y - y0)).toBeCloseTo(s.player.stats.moveSpeed * GNAT_SPEED_MUL, 1);
    for (let i = 0; i < 40; i++) stepSim(s, EMPTY_INPUT);
    const xs = s.enemies.map((o) => o.x);
    const ys = s.enemies.map((o) => o.y);
    expect(Math.max(...xs) - Math.min(...xs)).toBeLessThan(70);
    expect(Math.max(...ys) - Math.min(...ys)).toBeLessThan(70);
  });

  it("1층부터 가디언·날벌레(6마리 무리)가 나옴", () => {
    let guardians = 0;
    let gnats = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const s = createRun(seed, "drifter");
      startFloor(s, 1 + (seed % 3));
      for (const r of s.map.rooms) {
        if (r.type !== "combat" && r.type !== "elite") continue;
        const list = spawnEnemies(s, r.id, r.type === "elite");
        guardians += list.filter((e) => e.kind === "guardian").length;
        gnats += list.filter((e) => e.kind === "gnat").length;
      }
    }
    expect(guardians).toBeGreaterThan(0);
    expect(gnats % 6).toBe(0);
    expect(gnats).toBeGreaterThan(0);
  });

  it("성기사: 3층부터 던전에 나오고, 다가오며 플레이어 자리에 하늘에서 빛기둥을 하나씩 떨굼", () => {
    let found = 0;
    for (let seed = 1; seed <= 20; seed++) {
      const r = createRun(seed, "warden");
      startFloor(r, 3);
      for (let id = 1; id < r.map.rooms.length; id++) found += spawnEnemies(r, id, false).filter((e) => e.kind === "paladin").length;
      const one = createRun(seed, "warden");
      for (let id = 1; id < one.map.rooms.length; id++) expect(spawnEnemies(one, id, false).some((e) => e.kind === "paladin")).toBe(false);
    }
    expect(found).toBeGreaterThan(0);
    const s = room();
    const pal = makeEnemy(s, "paladin", 60, 72, 1, 5);
    s.enemies = [pal];
    let lights = 0;
    for (let i = 0; i < 400; i++) {
      stepSim(s, EMPTY_INPUT);
      s.player.invulnTicks = 99999;
      lights = Math.max(lights, (s.hazards ?? []).filter((h) => h.fx === "holy").length);
    }
    expect(lights).toBe(1);
    expect(pal.x).toBeGreaterThan(60);
  });
});
