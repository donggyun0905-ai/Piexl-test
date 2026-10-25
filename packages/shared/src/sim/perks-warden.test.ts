import { describe, expect, it } from "vitest";
import { damagePlayer, removeDead } from "./combat";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { FIRE, enemy, run, hero } from "./perkTestUtil";

describe("파수꾼 전용 아이템", () => {
  it("반격의 방패: 맞으면 주변 적을 밀어내며 피해", () => {
    const s = hero("warden", "counterGuard");
    s.enemies = [enemy(1, s.player.x + 20, s.player.y)];
    const hp = s.enemies[0]!.hp;
    damagePlayer(s, 5);
    expect(s.enemies[0]!.hp).toBeLessThan(hp);
    expect(s.enemies[0]!.x).toBeGreaterThan(s.player.x + 20);
  });

  it("회전 베기: 3번째 공격은 뒤에 있는 적도 맞힘", () => {
    const s = hero("warden", "spinCleave");
    const hits = [];
    for (let k = 0; k < 3; k++) {
      s.player.attackCooldown = 0;
      s.enemies = [enemy(1, s.player.x - 18, s.player.y)];
      stepSim(s, FIRE);
      hits.push(s.enemies[0]!.hp < 9999);
    }
    expect(hits).toEqual([false, false, true]);
  });

  it("검기: 휘두를 때마다 관통하는 탄이 나감", () => {
    const s = hero("warden", "waveSlash");
    stepSim(s, FIRE);
    expect(s.projectiles).toHaveLength(1);
    expect(s.projectiles[0]!.pierce).toBe(3);
  });

  it("처형인의 표식: 체력 25% 이하 적에게 피해 2배", () => {
    const s = hero("warden", "executioner");
    const low = enemy(1, s.player.x + 20, s.player.y, 1000);
    low.hp = 200;
    const high = enemy(2, s.player.x + 22, s.player.y - 3, 1000);
    s.enemies = [low, high];
    stepSim(s, FIRE);
    const dealtLow = 200 - s.enemies.find((e) => e.id === 1)!.hp;
    const dealtHigh = 1000 - s.enemies.find((e) => e.id === 2)!.hp;
    expect(dealtLow).toBeCloseTo(dealtHigh * 2);
  });

  it("생명 흡수: 처치하면 최대 체력의 3% 회복", () => {
    const s = hero("warden", "lifeLeech");
    s.player.hp = 50;
    s.enemies = [enemy(1, 60, 60, 0)];
    removeDead(s);
    expect(s.player.hp).toBeCloseTo(50 + s.player.stats.maxHp * 0.03);
  });

  it("분노: 체력이 낮을수록 공격력 증가", () => {
    const dealt = (hp: number) => {
      const s = hero("warden", "rage");
      s.player.hp = hp;
      s.enemies = [enemy(1, s.player.x + 20, s.player.y)];
      stepSim(s, FIRE);
      return 9999 - s.enemies[0]!.hp;
    };
    const full = createRun(3, "warden").player.stats.maxHp;
    expect(dealt(full * 0.1)).toBeGreaterThan(dealt(full) * 1.4);
  });

  it("돌진 베기: 대시로 지나간 적에게 한 번만 피해", () => {
    const s = hero("warden", "dashSlash");
    s.enemies = [enemy(1, s.player.x + 20, s.player.y)];
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    run(s, 8, { ...EMPTY_INPUT, moveX: 100 });
    const dealt = 9999 - s.enemies[0]!.hp;
    expect(dealt).toBeCloseTo(s.player.stats.damage * 1.5);
  });

  it("대지 흔들기: 대시가 끝나면 주변에 충격파", () => {
    const s = hero("warden", "earthshaker");
    s.enemies = [enemy(1, s.player.x, s.player.y + 60)];
    stepSim(s, { ...EMPTY_INPUT, dash: true, moveX: 100 });
    s.enemies[0]!.x = s.player.x;
    s.enemies[0]!.y = s.player.y + 25;
    run(s, 12);
    expect(s.enemies[0]!.hp).toBeLessThan(9999);
  });

  it("배수의 진: 체력이 낮으면 맞은 뒤 무적 시간 2배", () => {
    const s = hero("warden", "lastStand");
    s.player.hp = s.player.stats.maxHp * 0.2;
    s.player.invulnTicks = 0;
    damagePlayer(s, 1);
    expect(s.player.invulnTicks).toBe(72);
  });

  it("방패 자세: 가만히 서 있으면 받는 피해 절반", () => {
    const s = hero("warden", "bulwarkStance");
    run(s, 40);
    const hp = s.player.hp;
    damagePlayer(s, 10);
    expect(hp - s.player.hp).toBeCloseTo(5);
  });
});
