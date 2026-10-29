import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, TICK_RATE, type CharacterId } from "../index";
import { SWARM } from "../swarmDefs";
import { createSwarm, stepSwarm } from "./swarm";
import { chooseSwarm, evoPassive, weaponLv } from "./swarmLevel";
import { EMPTY_INPUT, type RunState, type TickInput } from "./types";

/** n틱 진행 (고르는 중이면 첫 후보를 고름, 맞아도 죽지 않게 할 수 있음) */
function play(s: RunState, n: number, god = false): void {
  for (let i = 0; i < n && !s.over; i++) {
    const input: TickInput = { ...EMPTY_INPUT, autoAim: true, moveX: i % 240 < 120 ? 60 : -60, moveY: i % 400 < 200 ? 40 : -40 };
    if (god) s.player.hp = s.player.stats.maxHp;
    if (!stepSwarm(s, input)) chooseSwarm(s, 0);
  }
}

describe("광야의 새벽", () => {
  it("시간이 가면 적·상자가 나오고, 처치하면 보석으로 레벨이 오르고 무기·패시브를 고름", () => {
    const s = createSwarm(7, "drifter");
    play(s, TICK_RATE * 90, true);
    const sw = s.swarm!;
    expect(s.enemies.some((e) => e.svBox)).toBe(true);
    expect(sw.kills).toBeGreaterThan(10);
    expect(sw.lv).toBeGreaterThan(2);
    expect(sw.weapons.length + sw.passives.length).toBeGreaterThan(1);
    expect(sw.weapons.length).toBeLessThanOrEqual(SWARM.maxWeapons);
  });

  it("고르는 동안은 멈춤 · 같은 무기를 고르면 레벨 +1 (최대 5)", () => {
    const s = createSwarm(3, "warden");
    s.swarm!.pending = 1;
    expect(stepSwarm(s, EMPTY_INPUT)).toBe(false);
    const tick = s.tick;
    expect(stepSwarm(s, EMPTY_INPUT)).toBe(false);
    expect(s.tick).toBe(tick);
    s.swarm!.choices = [{ kind: "weapon", id: s.player.weaponId, lv: 2 }];
    chooseSwarm(s, 0);
    expect(weaponLv(s, s.player.weaponId)).toBe(2);
    expect(s.player.svLv).toBe(2);
  });

  it("최대 레벨 무기 + 짝 패시브면 황금 상자로 각성", () => {
    const s = createSwarm(5, "mage");
    const w = s.player.weaponId;
    s.player.svLv = SWARM.maxLevel;
    s.swarm!.choices = [{ kind: "passive", id: evoPassive("mage", w), lv: 1 }];
    chooseSwarm(s, 0);
    const dmg = s.player.stats.damage;
    s.swarm!.drops.push({ id: 999, x: s.player.x, y: s.player.y, kind: "chest" });
    stepSwarm(s, EMPTY_INPUT);
    expect(s.player.svEvo).toBe(true);
    expect(s.player.stats.damage).toBeGreaterThan(dmg * 1.5);
    expect(s.swarm!.reward).toMatchObject({ kind: "evo", id: w });
  });

  it("모든 캐릭터가 무기 여러 개로 2분 동안 문제없이", () => {
    for (const c of CHARACTER_IDS as readonly CharacterId[]) {
      const s = createSwarm(11, c);
      play(s, TICK_RATE * 120, true);
      expect(s.swarm!.lv, c).toBeGreaterThan(1);
    }
  }, 60000);

  it("같은 시드·입력이면 결과가 같음", () => {
    const go = () => {
      const s = createSwarm(21, "beast");
      play(s, TICK_RATE * 40, true);
      return JSON.stringify(s);
    };
    expect(go()).toBe(go());
  });
  it("원 안에서 버티기: 원 안이면 성공, 원 밖에 오래 있으면 실패", () => {
    for (const stay of [true, false]) {
      const s = createSwarm(5, "warden");
      const sw = s.swarm!;
      s.enemies = [];
      sw.nextEvent = 1e9;
      const p = s.player;
      sw.event = { kind: "zone", until: s.tick + SWARM.events.zone.ticks, x: p.x, y: p.y, r: SWARM.events.zone.radius, out: 0 };
      if (!stay) p.x += SWARM.events.zone.radius + 20;
      for (let i = 0; i < SWARM.events.zone.ticks + 5 && sw.event; i++) {
        p.hp = p.stats.maxHp;
        if (!stepSwarm(s, EMPTY_INPUT)) chooseSwarm(s, 0);
      }
      expect(sw.eventEnd?.ok).toBe(stay);
    }
  });
});
