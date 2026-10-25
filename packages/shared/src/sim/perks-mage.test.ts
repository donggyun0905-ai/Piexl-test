import { describe, expect, it } from "vitest";
import type { PassiveId } from "../items";
import { removeDead } from "./combat";
import { EMPTY_INPUT, stepSim } from "./index";
import { EXIT_X } from "./util";
import { FIRE, enemy, run, hero } from "./perkTestUtil";

describe("마법사 전용 아이템", () => {
  it("연쇄 폭발: 쓰러진 자리 주변 적에게 피해", () => {
    const s = hero("mage", "chainBurst");
    s.enemies = [enemy(1, 80, 80, 0), enemy(2, 90, 80)];
    removeDead(s);
    expect(s.enemies[0]!.hp).toBeLessThan(9999);
  });

  it("확대 폭발: 범위 +50%, 주변 피해 70%", () => {
    const s = hero("mage", "wideBlast");
    stepSim(s, FIRE);
    const pr = s.projectiles[0]!;
    expect(pr.blast).toBeCloseTo(12 * 1.5);
    expect(pr.splash).toBe(0.7);
  });

  it("마력 방패: 방에 들어갈 때마다 2초 보호막", () => {
    const s = hero("mage", "arcaneShield");
    s.player.shieldTicks = 0;
    // 시작 방에서 다음 칸 방으로
    const lane = s.map.rooms[s.roomId]!.exits.findIndex((n) => n >= 0);
    s.player.x = EXIT_X[lane]!;
    s.player.y = 40;
    const from = s.roomId;
    for (let i = 0; i < 300 && s.roomId === from; i++) stepSim(s, { ...EMPTY_INPUT, moveY: -100 });
    expect(s.roomId).not.toBe(from);
    expect(s.player.shieldTicks).toBeGreaterThan(100);
  });

  it("별똥별: 5번째 공격마다 가까운 적 3명이 폭발에 맞음", () => {
    const s = hero("mage", "starShower");
    s.enemies = [enemy(1, 150, 40), enemy(2, 160, 60), enemy(3, 170, 80), enemy(4, 220, 100)];
    for (let k = 0; k < 5; k++) {
      s.player.attackCooldown = 0;
      stepSim(s, { ...EMPTY_INPUT, aimX: -1000, attack: true });
    }
    expect(s.enemies.slice(0, 3).every((e) => e.hp < 9999)).toBe(true);
    expect(s.enemies[3]!.hp).toBe(9999);
  });

  it("마력 과충전: 가만히 서 있으면 공격이 빨라짐", () => {
    const cooldown = (still: number) => {
      const s = hero("mage", "overcharge");
      run(s, still);
      stepSim(s, FIRE);
      return s.player.attackCooldown;
    };
    expect(cooldown(40)).toBeLessThan(cooldown(0));
  });

  it("점화: 맞은 적이 불타 시간이 지나면 피해", () => {
    const s = hero("mage", "igniteTip");
    s.enemies = [enemy(1, s.player.x + 40, s.player.y)];
    stepSim(s, FIRE);
    run(s, 30);
    const hpAfterHit = s.enemies[0]!.hp;
    expect(s.enemies[0]!.burnTicks).toBeGreaterThan(0);
    s.enemies[0]!.x = s.player.x + 200;
    run(s, 40);
    expect(s.enemies[0]!.hp).toBeLessThan(hpAfterHit);
  });

  it("폭풍의 숨결: 폭발이 주변 적을 크게 밀어냄", () => {
    const withPerk = (perk: PassiveId[]) => {
      const s = hero("mage", ...perk);
      s.player.weaponId = "stormstaff";
      s.enemies = [enemy(1, s.player.x + 40, s.player.y), enemy(2, s.player.x + 40, s.player.y + 12)];
      stepSim(s, FIRE);
      run(s, 25);
      return s.enemies.find((e) => e.id === 2)!.y;
    };
    expect(withPerk(["tempestBreath"])).toBeGreaterThan(withPerk([]) + 8);
  });

  it("메아리 폭발: 1초 뒤 같은 자리가 다시 터짐", () => {
    const s = hero("mage", "echoBolt");
    s.player.weaponId = "stormstaff";
    s.enemies = [enemy(1, s.player.x + 40, s.player.y)];
    stepSim(s, FIRE);
    run(s, 30);
    expect(s.pendingBlasts).toHaveLength(1);
    const before = s.enemies[0]!.hp;
    s.enemies[0]!.x = s.pendingBlasts[0]!.x;
    s.enemies[0]!.y = s.pendingBlasts[0]!.y;
    run(s, 70);
    expect(s.enemies[0]!.hp).toBeLessThan(before);
    expect(s.pendingBlasts).toHaveLength(0);
  });

  it("마력 흡수: 폭발로 3명 이상 맞히면 체력 회복", () => {
    const s = hero("mage", "manaDrain");
    s.player.weaponId = "stormstaff";
    s.player.hp = 40;
    s.enemies = [enemy(1, s.player.x + 40, s.player.y), enemy(2, s.player.x + 44, s.player.y + 6), enemy(3, s.player.x + 44, s.player.y - 6)];
    stepSim(s, FIRE);
    run(s, 25);
    expect(s.player.hp).toBeGreaterThan(40);
  });

  it("관통 마탄: 마법탄이 적을 뚫고 지나감", () => {
    const s = hero("mage", "piercingBolt");
    stepSim(s, FIRE);
    expect(s.projectiles[0]!.pierce).toBe(1);
  });
});
