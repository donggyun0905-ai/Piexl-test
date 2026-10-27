import { describe, expect, it } from "vitest";
import { ORBIT_RULES, orbBodies, updateOrbit } from "./orbit";
import { orbitAttack } from "./orbitAttack";
import { elem, lost, onOrb } from "./orbitTestUtil";
import { enemy } from "./perkTestUtil";

describe("원소술사 새 효과", () => {
  it("웨폰 마스터: 불은 3번 · 번개는 5번 연속으로 때리고 돌아옴, 물은 계속 따라다님 (땅·풀 검은 몸을 지킴)", () => {
    // 검 하나만 적에게 날아가게: 원소마다 따로 시험 (0 불 · 1 물 · 2 번개)
    const hits = (i: number, ticks: number) => {
      const s = elem("bladelord");
      const b = orbBodies(s.player, 120, 72, 0)[i]!;
      s.enemies = [enemy(1, b.x + 40, b.y, 5000), enemy(2, b.x + 52, b.y, 5000)];
      s.player.orbCd = [0, 0, 0, 0, 0].map((_, k) => (k === i ? 0 : 9999));
      const log: number[] = [];
      for (let t = 0; t < ticks; t++) {
        const before = s.enemies[0]!.hp;
        updateOrbit(s);
        if (s.enemies[0]!.hp < before) log.push(t);
      }
      return { s, log };
    };
    expect(hits(0, 40).log).toHaveLength(3);
    const thunder = hits(2, 40);
    expect(thunder.log.length).toBeGreaterThanOrEqual(5);
    expect(thunder.s.player.flyers ?? []).toHaveLength(0);
    const water = hits(1, 200);
    expect(water.log.length).toBeGreaterThanOrEqual(9);
    expect(water.s.player.flyers).toHaveLength(1);
  });

  it("웨폰 마스터: 적이 하나여도 검 3개가 각자 날아감 (차례를 기다리지 않음), 날아가는 길은 휨", () => {
    const s = elem("bladelord");
    s.enemies = [enemy(1, 170, 72, 5000)];
    updateOrbit(s);
    expect(s.player.flyers).toHaveLength(3);
    for (let i = 0; i < 4; i++) updateOrbit(s);
    // 곧게 가면 y가 그대로, 휘면 옆으로 벗어남
    const b = orbBodies(s.player, s.player.x, s.player.y, s.tick)[0]!;
    const home = orbBodies({ ...s.player, flyers: [] }, s.player.x, s.player.y, s.tick)[0]!;
    const straightY = home.y + (72 - home.y) * Math.min(1, 4 / 9);
    expect(Math.abs(b.y - straightY)).toBeGreaterThan(1);
  });

  it("웨폰 마스터: 풀 검은 날아가지 않고 몸 둘레를 돌며 적 탄을 막음", () => {
    const s = elem("bladelord");
    const grass = orbBodies(s.player, 120, 72, 0)[4]!;
    expect(grass).toMatchObject({ tag: "grass", striker: false });
    expect(orbBodies(s.player, 120, 72, 0)[3]).toMatchObject({ tag: "earth", striker: false });
    s.projectiles = [{ id: 900, fromPlayer: false, x: grass.x, y: grass.y, prevX: grass.x, prevY: grass.y, r: 2, vx: 0, vy: 0, damage: 5, ticksLeft: 60 }];
    updateOrbit(s);
    expect(s.projectiles).toHaveLength(0);
  });

  it("원소마다 상태이상: 불 화상 · 물 둔화 · 땅 기절 · 풀 독", () => {
    const s = elem("elemorb");
    const fire = onOrb(s, 0);
    expect(fire.burnTicks ?? 0).toBeGreaterThan(0);
    const water = onOrb(elem("elemorb"), 1);
    expect(water.slowTicks ?? 0).toBeGreaterThan(0);
    const earth = onOrb(elem("elemorb"), 2);
    expect(earth.stunTicks ?? 0).toBeGreaterThan(0);
    const grass = onOrb(elem("elemorb"), 4);
    expect(grass.poisonTicks ?? 0).toBeGreaterThan(0);
  });

  it("빛 구슬: 확률로 빛이 터짐", () => {
    const burst = ORBIT_RULES.LIGHT_BURST;
    ORBIT_RULES.LIGHT_BURST = 1;
    const s = elem("lightorb");
    onOrb(s);
    expect(s.effects.some((f) => f.kind === "elLight")).toBe(true);
    ORBIT_RULES.LIGHT_BURST = burst;
  });

  it("은하수: 안에 있는 동안 스택, 100이면 빅뱅", () => {
    const s = elem("galaxy");
    const e = enemy(1, 130, 72, 999999);
    s.enemies = [e];
    let bang = false;
    for (let t = 0; t < ORBIT_RULES.GALAXY_EVERY * ORBIT_RULES.GALAXY_MAX + 3 && !bang; t++) {
      s.tick = t;
      updateOrbit(s);
      bang = s.effects.some((f) => f.kind === "elBang");
    }
    expect(bang).toBe(true);
    expect(e.galaxy).toBe(0);
    expect(lost(e)).toBeGreaterThan(s.player.stats.damage * ORBIT_RULES.BANG_MUL);
  });

  it("행성에도 상태이상 (흡혈 행성은 독)", () => {
    const leech = onOrb(elem("planets"), 4);
    expect(leech.poisonTicks ?? 0).toBeGreaterThan(0);
  });

  it("중력: 내려찍은 자리에 두 번째 중력이 한 번 더", () => {
    const s = elem("gravity");
    s.enemies = [enemy(1, 140, 72)];
    orbitAttack(s);
    expect(s.pendingBlasts).toHaveLength(1);
    expect(s.pendingBlasts[0]).toMatchObject({ x: 120, y: 72 });
  });

  it("웨폰 마스터 검 끝: 날아가는 검 셋, 지키는 검 둘", () => {
    const b = orbBodies(elem("bladelord").player, 120, 72, 0);
    expect(b.filter((x) => x.striker)).toHaveLength(3);
    expect(b.filter((x) => x.striker === false)).toHaveLength(2);
  });
});
