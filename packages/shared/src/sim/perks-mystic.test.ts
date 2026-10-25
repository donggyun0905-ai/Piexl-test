import { describe, expect, it } from "vitest";
import type { PassiveId } from "../items";
import { damagePlayer } from "./combat";
import { EMPTY_INPUT, stepSim, type ProjectileState, type RunState } from "./index";
import { recalcStats } from "./items";
import { charmHit } from "./talisman";
import { FIRE, enemy, hero } from "./perkTestUtil";

function mystic(...perks: PassiveId[]): RunState {
  const s = hero("mystic", ...perks);
  recalcStats(s);
  return s;
}

const charm = (extra: Partial<ProjectileState> = {}): ProjectileState => ({
  id: 999, fromPlayer: true, x: 100, y: 72, prevX: 100, prevY: 72, r: 2, vx: 3, vy: 0, damage: 10, ticksLeft: 60, charm: "spark", ...extra,
});

/** 공격을 n번 하고 나온 탄 */
function attacks(s: RunState, n: number): ProjectileState[] {
  const out: ProjectileState[] = [];
  for (let i = 0; i < n; i++) {
    s.player.attackCooldown = 0;
    s.projectiles = [];
    stepSim(s, FIRE);
    out.push(...s.projectiles);
  }
  return out;
}

describe("음양사 전용 아이템", () => {
  it("마음가짐: 가끔(20%) 유도 부적이 한 장 더", () => {
    const shots = attacks(mystic("resolve"), 200).filter((p) => p.spirit === "seek");
    expect(shots.length).toBeGreaterThan(15);
    expect(shots.length).toBeLessThan(70);
  });

  it("마음의 눈·음기·양기·결계: 능력치", () => {
    const base = mystic().player.stats;
    expect(mystic("mindEye").player.stats.range).toBeCloseTo(base.range * 1.2);
    expect(mystic("yinForce").player.stats.damage).toBeCloseTo(base.damage + 4);
    expect(mystic("yangForce").player.stats.attackSpeed).toBeCloseTo(base.attackSpeed * 1.3);
    expect(mystic("barrier").player.stats.maxHp).toBe(base.maxHp + 20);
  });

  it("결계: 맞은 뒤 3초 무적", () => {
    const s = mystic("barrier");
    damagePlayer(s, 5);
    expect(s.player.invulnTicks).toBe(180);
  });

  it("옥구슬: 공격마다 구슬 한 발 (30% 피해)", () => {
    const shots = attacks(mystic("jadeOrb"), 1);
    const orb = shots.find((p) => p.spirit === "orb")!;
    const main = shots.find((p) => p.charm)!;
    expect(orb.damage).toBeCloseTo(main.damage * 0.3);
  });

  it("사인: 일반 적은 가끔 바로 쓰러지고 보스는 아님", () => {
    const s = mystic("deathSeal");
    let kills = 0;
    let bossDown = 0;
    for (let t = 0; t < 300; t++) {
      s.tick = t;
      const e = enemy(t + 1, 100, 72);
      charmHit(s, charm(), e, 1, 0, []);
      if (e.hp <= 0) kills++;
      const b = { ...enemy(t + 1000, 100, 72), kind: "hulk" as const };
      charmHit(s, charm(), b, 1, 0, []);
      if (b.hp <= 0) bossDown++;
    }
    expect(kills).toBeGreaterThan(10);
    expect(kills).toBeLessThan(60);
    expect(bossDown).toBe(0);
  });

  it("영역: 사거리 안 적이 느려짐", () => {
    const far = (s: RunState) => {
      s.enemies = [enemy(1, s.player.x + 60, s.player.y)];
      const x = s.enemies[0]!.x;
      stepSim(s, EMPTY_INPUT);
      return x - s.enemies[0]!.x;
    };
    expect(far(mystic("domain"))).toBeCloseTo(far(mystic()) * 0.7);
  });

  it("흡생: 추가 효과가 터지면 최대 체력 3% 회복", () => {
    const s = mystic("lifeSiphon");
    s.player.hp = 10;
    const e = enemy(1, 100, 72);
    for (let i = 0; i < 3; i++) charmHit(s, charm(), e, 1, 0, []);
    expect(s.player.hp).toBeCloseTo(10 + s.player.stats.maxHp * 0.03);
  });

  it("반야: 가끔(30%) 첫 장이 바로 추가 효과를 터뜨림", () => {
    const shots = attacks(mystic("prajna"), 200).filter((p) => p.charged);
    expect(shots.length).toBeGreaterThan(30);
    expect(shots.length).toBeLessThan(90);
    const s = mystic();
    const e = enemy(1, 100, 72);
    charmHit(s, charm({ charged: true }), e, 1, 0, []);
    expect(9999 - e.hp).toBe(20);
  });
});
