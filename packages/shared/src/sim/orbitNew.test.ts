import { describe, expect, it } from "vitest";
import { ORBIT_RULES, orbBodies, updateOrbit } from "./orbit";
import { ORBIT_ELEMENTS_RULES } from "./orbitElements";
import { orbitAttack } from "./orbitAttack";
import { elem, lost, onOrb } from "./orbitTestUtil";
import { enemy } from "./perkTestUtil";

describe("원소술사 새 효과", () => {
  it("웨폰 마스터: 검이 적을 꿰뚫고 지나쳐 크게 돌아 다시 꿰뚫고, 다 하면 제자리로 돌아옴 (불 3번 · 번개 5번)", () => {
    const run = (i: number) => {
      const s = elem("bladelord");
      s.enemies = [enemy(1, 150, 50, 99999)];
      s.player.orbCd = [0, 0, 0, 0, 0].map((_, k) => (k === i ? 0 : 99999));
      const hitAt: number[] = [];
      let far = 0;
      let back = false;
      let last = 0;
      // 처음 날아갔다가 제자리로 돌아올 때까지
      for (let t = 0; t < 400 && !back; t++) {
        s.tick = t;
        const before = s.enemies[0]!.hp;
        updateOrbit(s);
        if (s.enemies[0]!.hp < before) hitAt.push(t);
        const f = s.player.flyers?.[0];
        if (f?.px !== undefined) far = Math.max(far, Math.hypot(f.px - 150, f.py! - 50));
        // 돌아와 다시 날아가면 날아간 틱이 처음부터
        back = t > 0 && (!f || f.t < last);
        last = f?.t ?? 0;
      }
      return { back, hitAt, far };
    };
    const fire = run(0);
    expect(fire.hitAt).toHaveLength(3);
    // 꿰뚫은 뒤 적을 지나쳐 멀리 갔다가 돌아옴 (붙어서 때리지 않음)
    expect(fire.far).toBeGreaterThan(20);
    expect(fire.hitAt[1]! - fire.hitAt[0]!).toBeGreaterThan(10);
    expect(fire.back).toBe(true);
    expect(run(2).hitAt.length).toBeGreaterThanOrEqual(5);
  });

  it("웨폰 마스터: 적이 하나여도 검 3개가 각자 날아감 (차례를 기다리지 않음)", () => {
    const s = elem("bladelord");
    s.enemies = [enemy(1, 170, 72, 5000)];
    updateOrbit(s);
    expect(s.player.flyers).toHaveLength(3);
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
    const burst = ORBIT_ELEMENTS_RULES.LIGHT_BURST;
    ORBIT_ELEMENTS_RULES.LIGHT_BURST = 1;
    const s = elem("lightorb");
    onOrb(s);
    expect(s.effects.some((f) => f.kind === "elLight")).toBe(true);
    ORBIT_ELEMENTS_RULES.LIGHT_BURST = burst;
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

  it("행성·무기마다 상태이상 피해 (색 숫자): 흡혈 행성 독+출혈 · 빛 광휘 · 물 물결", () => {
    const leech = onOrb(elem("planets"), 4);
    expect(leech.poisonTicks ?? 0).toBeGreaterThan(0);
    const kinds = (e: { dotAmt?: object }) => Object.keys(e.dotAmt ?? {});
    expect(kinds(onOrb(elem("planets"), 4))).toContain("bleed");
    expect(kinds(onOrb(elem("lightorb")))).toContain("radiance");
    expect(kinds(onOrb(elem("elemorb"), 1))).toContain("tide");
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
