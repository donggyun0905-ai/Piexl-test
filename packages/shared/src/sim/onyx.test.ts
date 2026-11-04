import { describe, expect, it } from "vitest";
import { ONYX_PASSIVES } from "../itemsOnyx";
import { WEAPONS } from "../content";
import { ONYX as O } from "../weaponsOnyx";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { characterWeapons } from "./loot";
import { rollGems } from "./onyxGems";
import { enemy, FIRE } from "./perkTestUtil";

function onyx(...perks: string[]): RunState {
  const s = createRun(7, "onyx");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 220, 40, 99999), rootTicks: 99999 }];
  return s;
}
const IDLE = { ...FIRE, attack: false };
const DASH = { ...IDLE, dash: true };
const RIGHT = { ...IDLE, moveX: 100, moveY: 0 };
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("오닉스", () => {
  it("무기는 칠보 광륜 하나뿐 · 전용 아이템 10", () => {
    expect(characterWeapons("onyx")).toEqual(["oxHalo"]);
    expect(WEAPONS.oxHalo).toMatchObject({ kind: "gem", exclusive: "onyx" });
    expect(Object.keys(ONYX_PASSIVES)).toHaveLength(10);
  });

  it("광륜은 방 끝의 적까지 맞히고, 쏘는 동안 몸을 못 움직임", () => {
    const s = onyx();
    stepSim(s, { ...FIRE, moveX: 100 });
    expect(lost(s)).toBeGreaterThan(0);
    const x = s.player.x;
    stepSim(s, { ...FIRE, moveX: 100 });
    stepSim(s, { ...FIRE, moveX: 100 });
    expect(s.player.x).toBe(x);
  });

  it("대시는 비행을 켜고 끔 (무적 아님, 더 빠름, 손을 떼도 계속 날아감)", () => {
    const walk = onyx();
    for (let i = 0; i < 20; i++) stepSim(walk, RIGHT);
    const fly = onyx();
    stepSim(fly, { ...RIGHT, dash: true });
    expect(fly.player.oxFly).toBe(true);
    expect(fly.player.dashTicks).toBe(0);
    for (let i = 0; i < 19; i++) stepSim(fly, RIGHT);
    expect(fly.player.x - 50).toBeGreaterThan((walk.player.x - 50) * 1.8);
    const x = fly.player.x;
    for (let i = 0; i < 5; i++) stepSim(fly, IDLE);
    expect(fly.player.x).toBeGreaterThan(x);
    const hp = fly.player.hp;
    damagePlayer(fly, 10);
    expect(fly.player.hp).toBeLessThan(hp);
    for (let i = 0; i < O.toggleGap; i++) stepSim(fly, IDLE);
    stepSim(fly, DASH);
    expect(fly.player.oxFly).toBe(false);
  });

  it("맞아도 무적은 아주 짧음 (묵인처럼)", () => {
    const s = onyx();
    damagePlayer(s, 10);
    expect(s.player.invulnTicks).toBeLessThanOrEqual(O.hurtTicks);
  });

  it("비행하면 보석이 저마다 확률로 반응해 공격", () => {
    const s = onyx();
    stepSim(s, DASH);
    for (let i = 0; i < 600; i++) stepSim(s, IDLE);
    expect(s.player.oxGems ?? 0).toBeGreaterThan(3);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("연마된 보석이면 더 자주 반응", () => {
    const count = (perk: string) => {
      const s = onyx(perk);
      let n = 0;
      for (let t = 0; t < 300; t++) {
        s.tick = t;
        n += rollGems(s, "t");
      }
      return n;
    };
    expect(count("oxPolish")).toBeGreaterThan(count("oxCrown"));
  });

  it("공명석: 다섯 개가 함께 반응하면 칠보 공명", () => {
    const s = onyx("oxResonance", "oxPolish");
    for (let t = 0; t < 400 && !s.player.oxResons; t++) {
      s.tick = t;
      rollGems(s, "t");
    }
    expect(s.player.oxResons ?? 0).toBeGreaterThan(0);
  });

  it("광물 갑피: 땅에서는 받는 피해 -", () => {
    const a = onyx();
    const b = onyx("oxBulwark");
    damagePlayer(a, 30);
    damagePlayer(b, 30);
    expect(b.player.hp).toBeGreaterThan(a.player.hp);
  });

  it("낙하 충격: 내려앉으면 둘레에 충격파", () => {
    const s = onyx("oxLanding");
    s.enemies = [{ ...enemy(1, 70, 72, 99999), rootTicks: 99999 }, { ...enemy(2, 300, 40, 99999), rootTicks: 99999 }];
    stepSim(s, DASH);
    for (let i = 0; i < O.toggleGap; i++) stepSim(s, IDLE);
    s.player.x = 50;
    const before = s.enemies[0]!.hp;
    s.enemies[0]!.x = 70;
    s.enemies[0]!.y = s.player.y;
    stepSim(s, DASH);
    expect(s.enemies[0]!.hp).toBeLessThan(before);
  });

  it("같은 시드면 같은 결과", () => {
    const a = onyx("oxTrail", "oxPrism");
    const b = onyx("oxTrail", "oxPrism");
    stepSim(a, DASH);
    stepSim(b, DASH);
    for (let i = 0; i < 300; i++) {
      stepSim(a, FIRE);
      stepSim(b, FIRE);
    }
    expect(lost(a)).toBe(lost(b));
  });
});
