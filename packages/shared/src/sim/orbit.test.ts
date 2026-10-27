import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { WEAPONS } from "../content";
import { damagePlayer } from "./combat";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { weaponPool } from "./loot";
import { ORB_TICK, orbBodies, updateOrbit } from "./orbit";
import { ORBIT_ELEMENTS_RULES } from "./orbitElements";
import { CRIT_MUL } from "./orbitBlades";
import { orbitAttack, TRIGGER_MAX, TRIGGER_RELOAD, HAND_TICKS } from "./orbitAttack";
import { enemy, FIRE } from "./perkTestUtil";
import { elem, lost, onOrb } from "./orbitTestUtil";

describe("원소술사 회전체", () => {
  // 이 파일은 맞히는 피해만 셈: 상태이상 피해(orbitNew에서 확인)는 끔
  const dots = { ...ORBIT_ELEMENTS_RULES };
  beforeAll(() => Object.assign(ORBIT_ELEMENTS_RULES, { WEAPON_DOT: 0, ELEMENT_DOT: 0, PLANET_DOT: 0 }));
  afterAll(() => Object.assign(ORBIT_ELEMENTS_RULES, dots));

  it("원소술사는 전용 무기만 얻음", () => {
    for (const id of weaponPool(elem())) expect(WEAPONS[id]).toMatchObject({ exclusive: "elementalist" });
  });

  it("원소구슬: 5개가 반경 위를 돌고, 시간이 지나면 자리가 바뀜", () => {
    const s = elem();
    const a = orbBodies(s.player, 120, 72, 0);
    expect(a).toHaveLength(5);
    for (const b of a) expect(Math.hypot(b.x - 120, b.y - 72)).toBeCloseTo(s.player.stats.range, 3);
    for (let i = 0; i < 30; i++) updateOrbit(s);
    expect(orbBodies(s.player, 120, 72, 30)[0]!.y).not.toBeCloseTo(a[0]!.y, 1);
  });

  it("원소구슬: 불은 불태우고, 물은 느리게, 번개는 피해가 큼", () => {
    const fire = onOrb(elem(), 0);
    expect(fire.burnTicks).toBeGreaterThan(0);
    const water = onOrb(elem(), 1);
    expect(water.slowTicks).toBeGreaterThan(0);
    const s = elem();
    const thunder = onOrb(s, 3);
    // 틱 피해(0.15초분) + 번개 추가 피해 (공격력 80%)
    const tick = (s.player.stats.damage * s.player.stats.attackSpeed * ORB_TICK) / 60;
    expect(lost(thunder)).toBeCloseTo(tick + s.player.stats.damage * 0.8);
  });

  it("닿아 있는 동안 0.15초마다 계속 피해 (초당 피해 = 공격력 × 공격 속도), 효과는 공격 속도 간격마다 한 번", () => {
    const s = elem("lightorb");
    const e = enemy(1, 121, 72);
    s.enemies = [e];
    // 빛 터짐(확률) 없이 틱 피해만 셈
    const burst = ORBIT_ELEMENTS_RULES.LIGHT_BURST;
    ORBIT_ELEMENTS_RULES.LIGHT_BURST = 0;
    let hits = 0;
    let stuns = 0;
    for (let t = 0; t < 120; t++) {
      s.tick = t;
      const before = e.hp;
      const stun = e.stunTicks ?? 0;
      updateOrbit(s);
      if (e.hp < before) hits++;
      if ((e.stunTicks ?? 0) > stun) stuns++;
    }
    // 몸에 붙은 적: 2초 동안 틱 피해 약 13번, 합계는 공격력 × 공격 속도 × 2초
    expect(hits).toBeGreaterThanOrEqual(12);
    expect(lost(e)).toBeCloseTo(s.player.stats.damage * s.player.stats.attackSpeed * (hits * ORB_TICK) / 60);
    // 빛 경직은 공격 속도(3) 간격마다 → 2초에 최대 6번
    expect(stuns).toBeLessThanOrEqual(6);
    ORBIT_ELEMENTS_RULES.LIGHT_BURST = burst;
  });

  it("빛 구슬: 맞은 적 0.5초 경직", () => {
    expect(onOrb(elem("lightorb")).stunTicks).toBe(30);
  });

  it("은하수: 사거리 안 모든 적이 맞음", () => {
    const s = elem("galaxy");
    s.enemies = [enemy(1, 140, 72), enemy(2, 120, 100), enemy(3, 230, 130)];
    updateOrbit(s);
    expect(s.enemies.map((e) => lost(e) > 0)).toEqual([true, true, false]);
  });

  it("행성: 8개, 빙결·보호막 효과", () => {
    const s = elem("planets");
    expect(orbBodies(s.player, 120, 72, 0)).toHaveLength(8);
    expect(onOrb(s, 0).stunTicks).toBe(60);
    onOrb(s, 7);
    expect(s.player.shieldPts).toBeGreaterThan(0);
  });

  it("별똥별: 닿은 회전체가 공격력만큼 때림 · 중력: 들어온 적 탄이 느려짐", () => {
    const s = elem("meteors");
    const e = onOrb(s, 0);
    expect(lost(e)).toBeCloseTo(s.player.stats.damage);
    expect(s.player.stats.damage).toBeCloseTo(5);
    const g = elem("gravity");
    g.projectiles = [{ id: 900, fromPlayer: false, x: 150, y: 72, prevX: 150, prevY: 72, r: 2, vx: -2, vy: 0, damage: 5, ticksLeft: 60 }];
    updateOrbit(g);
    updateOrbit(g);
    expect(g.projectiles[0]!.vx).toBeCloseTo(-1);
  });

  it("중력: 사거리 안 적이 느려지고, 공격하면 모두 맞고 기절", () => {
    const s = elem("gravity");
    s.enemies = [enemy(1, 150, 72), enemy(2, 120, 110)];
    updateOrbit(s);
    expect(s.enemies[0]!.slowTicks).toBeGreaterThan(0);
    orbitAttack(s);
    for (const e of s.enemies) {
      expect(lost(e)).toBeCloseTo(s.player.stats.damage);
      expect(e.stunTicks).toBe(24);
    }
  });

  it("갓 핸드: 가까운 적을 들어 다른 적에게 내려찍음", () => {
    const s = elem("godhand");
    const held = enemy(1, 140, 72);
    const other = enemy(2, 60, 72);
    s.enemies = [held, other];
    orbitAttack(s);
    expect(s.player.handId).toBe(1);
    for (let i = 0; i < HAND_TICKS; i++) updateOrbit(s);
    expect(held.x).toBeCloseTo(other.x);
    expect(lost(other)).toBeGreaterThan(0);
    expect(lost(held)).toBeGreaterThan(0);
  });

  it("별똥별: 안쪽 3 · 가운데 4 · 바깥 5, 바깥은 날아가 때림", () => {
    const s = elem("meteors");
    const bodies = orbBodies(s.player, 120, 72, 0);
    expect([0, 1, 2].map((r) => bodies.filter((b) => b.ring === r).length)).toEqual([3, 4, 5]);
    s.enemies = [enemy(1, 190, 72)];
    for (let t = 0; t <= 10; t++) updateOrbit(s);
    expect(lost(s.enemies[0]!)).toBeGreaterThan(0);
  });

  it("강철 구슬: 적 탄을 막고, 공격하면 총알", () => {
    const s = elem("steelorb");
    const b = orbBodies(s.player, 120, 72, s.tick)[0]!;
    s.projectiles = [{ id: 900, fromPlayer: false, x: b.x, y: b.y, prevX: b.x, prevY: b.y, r: 3, vx: 0, vy: 0, damage: 5, ticksLeft: 60 }];
    updateOrbit(s);
    expect(s.projectiles).toHaveLength(0);
    orbitAttack(s);
    expect(s.projectiles[0]).toMatchObject({ fromPlayer: true, spirit: "steel" });
  });

  it("트리거: 쏠 때마다 줄고 다 쓰면 2초 재장전, 15개면 한 번에 2배", () => {
    const s = elem("trigger");
    let shots = 0;
    for (let i = 0; i < 40 && !s.player.reloadTicks; i++) {
      orbitAttack(s);
      shots++;
    }
    expect(s.player.reloadTicks).toBe(TRIGGER_RELOAD);
    expect(shots).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < TRIGGER_RELOAD; i++) updateOrbit(s);
    expect(s.player.loaded).toBe(5);
    s.player.reloadTicks = TRIGGER_RELOAD;
    s.player.stats.projectileSpeed *= 2; // 회전이 2배 빠르면 재장전도 2배 빠름
    for (let i = 0; i < TRIGGER_RELOAD / 2; i++) updateOrbit(s);
    expect(s.player.reloadTicks).toBe(0);
    s.projectiles = [];
    s.player.loaded = TRIGGER_MAX;
    orbitAttack(s);
    expect(s.projectiles).toHaveLength(TRIGGER_MAX);
    // 15개면 치명타 20% + 10개 × 5% = 70%
    const dmg = s.projectiles.map((pr) => pr.damage / (s.player.stats.damage * 2));
    expect(dmg.every((k) => Math.abs(k - 1) < 1e-6 || Math.abs(k - CRIT_MUL) < 1e-6)).toBe(true);
    expect(s.projectiles.filter((pr) => pr.crit).length).toBeGreaterThan(5);
  });

  it("같은 시드·입력이면 결과가 같음", () => {
    const play = () => {
      const s = createRun(11, "elementalist");
      for (let i = 0; i < 600; i++) stepSim(s, { ...FIRE, autoAim: true, moveX: i % 200 < 100 ? 60 : -60 });
      return [s.player.x, s.player.orbDir, s.kills, s.enemies.map((e) => e.hp)];
    };
    expect(play()).toEqual(play());
  });
});

describe("원소술사 전용 아이템", () => {
  it("천지창조: 회전체 +1, 여러 개 가질 수 있음", () => {
    expect(orbBodies(elem("elemorb", "genesis", "genesis").player, 0, 0, 0)).toHaveLength(7);
  });

  it("능력치: 완벽한 원형·더 크게·아름답게·굳건하게", () => {
    const base = elem().player.stats;
    expect(elem("elemorb", "perfectCircle").player.stats.damage).toBeCloseTo(base.damage + 3);
    expect(elem("elemorb", "bigger").player.stats.range).toBe(base.range + 10);
    expect(elem("elemorb", "beautiful").player.stats.projectileSpeed).toBeCloseTo(base.projectileSpeed * 1.3);
    expect(elem("elemorb", "steadfast").player.stats.maxHp).toBe(base.maxHp + 80);
  });

  it("결벽증: 맞으면 3초 빨라짐", () => {
    const s = elem("elemorb", "cleanFreak");
    damagePlayer(s, 5);
    expect(s.player.rushTicks).toBe(180);
    const x = s.player.x;
    s.player.invulnTicks = 999;
    stepSim(s, { ...EMPTY_INPUT, moveX: 100 });
    expect(s.player.x - x).toBeCloseTo(s.player.stats.moveSpeed * 1.3);
  });

  it("일렉트로닉: 회전체 사이 전깃줄에 닿은 적이 맞음", () => {
    const s = elem("elemorb", "electronic");
    const [a, b] = orbBodies(s.player, 120, 72, s.tick);
    s.enemies = [enemy(1, (a!.x + b!.x) / 2, (a!.y + b!.y) / 2)];
    updateOrbit(s);
    expect(lost(s.enemies[0]!)).toBeGreaterThan(0);
  });

  it("행운: 적 탄 일부(30%)가 튕겨 나감", () => {
    const s = elem("elemorb", "luckyDeflect");
    let back = 0;
    for (let k = 0; k < 100; k++) {
      const b = orbBodies(s.player, s.player.x, s.player.y, s.tick)[0]!;
      s.projectiles = [{ id: 1000 + k, fromPlayer: false, x: b.x, y: b.y, prevX: b.x, prevY: b.y, r: 3, vx: 1, vy: 0, damage: 5, ticksLeft: 60 }];
      updateOrbit(s);
      if (s.projectiles[0]?.fromPlayer) back++;
    }
    expect(back).toBeGreaterThan(15);
    expect(back).toBeLessThan(50);
  });

  it("펫: 1초마다 유도탄", () => {
    const s = elem("elemorb", "pet");
    s.enemies = [enemy(1, 180, 72)];
    updateOrbit(s);
    expect(s.projectiles.find((p) => p.spirit === "pet")).toMatchObject({ homing: true });
  });

  it("화려하게: 가끔 원소 효과가 하나 더", () => {
    const s = elem("lightorb", "flashy");
    const burst = ORBIT_ELEMENTS_RULES.LIGHT_BURST;
    ORBIT_ELEMENTS_RULES.LIGHT_BURST = 0;
    let extra = 0;
    for (let k = 0; k < 100; k++) {
      s.tick = k * 100;
      s.enemies = [];
      s.player.orbCd = [];
      const e = onOrb(s);
      if ((e.burnTicks ?? 0) > 0 || (e.slowTicks ?? 0) > 0 || (e.poisonTicks ?? 0) > 0 || lost(e) > s.player.stats.damage + 0.01) extra++;
    }
    ORBIT_ELEMENTS_RULES.LIGHT_BURST = burst;
    expect(extra).toBeGreaterThan(3);
    expect(extra).toBeLessThan(40);
  });
});
