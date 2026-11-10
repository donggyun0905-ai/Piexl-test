import { describe, expect, it } from "vitest";
import { JOKER_CARD as J, JOKER_DRAW as D } from "../weaponsJoker";
import { JOKER_PERKS as K } from "../itemsJoker";
import { FACTION_GROWTH as G } from "../factionDefs";
import { damagePlayer } from "./combat";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { equipWeapon, recalcStats } from "./items";
import { cardDamage } from "./joker";
import { drawNow } from "./jokerDraw";
import { enemy, FIRE } from "./perkTestUtil";

function jk(x: number | null = 120, ...perks: string[]): RunState {
  const s = createRun(7, "joker");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.enemies = x === null ? [] : [{ ...enemy(1, x, 100, 99999), rootTicks: 99999 }];
  return s;
}
const run = (s: RunState, n: number, input = FIRE) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};
const cards = (s: RunState) => s.player.jkCards ?? [];

describe("조커", () => {
  it("카드 한 장을 던짐 · 피해는 공격력과 상관없이 고정 4", () => {
    const s = jk();
    s.player.stats.damage = 999;
    const hp = s.enemies[0]!.hp;
    stepSim(s, FIRE);
    expect(cards(s).length).toBe(1);
    run(s, 20, EMPTY_INPUT);
    expect(hp - s.enemies[0]!.hp).toBe(J.base);
  });

  it("벽에 튕길 때마다 피해 +4 · 카드는 사라지지 않고 계속 튕김", () => {
    const s = jk(null);
    stepSim(s, FIRE);
    run(s, 600, EMPTY_INPUT);
    const c = cards(s)[0]!;
    expect(c.n).toBeGreaterThanOrEqual(2);
    expect(cardDamage(s.player, c)).toBe(J.base + 4 * Math.min(c.n, J.maxBounce));
    expect(cards(s).length).toBe(1);
  });

  it("튕길 때 느는 피해는 15번까지 (그 뒤로는 그대로)", () => {
    const s = jk(null);
    stepSim(s, FIRE);
    const c = cards(s)[0]!;
    c.n = J.maxBounce + 10;
    expect(cardDamage(s.player, c)).toBe(J.base + 4 * J.maxBounce);
  });

  it("판 위 카드가 15장을 넘으면 가장 먼저 던진 카드가 사라짐 (마술사의 소매면 더 많이)", () => {
    const s = jk(null);
    run(s, 60 * 20);
    expect(cards(s).length).toBe(J.max);
    expect(cards(s)[0]!.id).toBeGreaterThan(1);
    const t = jk(null, "jkSleeve");
    run(t, 60 * 20);
    expect(cards(t).length).toBe(J.max + K.jkSleeve.more);
  });

  it("방이 바뀌면 카드를 거둠", () => {
    const s = jk(null);
    run(s, 30);
    expect(cards(s).length).toBeGreaterThan(0);
    s.roomId += 1;
    stepSim(s, EMPTY_INPUT);
    expect(cards(s).length).toBe(0);
  });

  it("투사체 속도가 빠를수록 카드가 빨리 튕김", () => {
    const slow = jk(null);
    const fast = jk(null, "jkAccel", "jkDraw");
    stepSim(slow, FIRE);
    stepSim(fast, FIRE);
    run(slow, 400, EMPTY_INPUT);
    run(fast, 400, EMPTY_INPUT);
    expect(cards(fast)[0]!.n).toBeGreaterThan(cards(slow)[0]!.n);
  });

  it("무기 셋: 낫은 크고 장난감 총은 튕길 때 느는 피해가 적음", () => {
    const a = jk(null);
    equipWeapon(a, "jkScythe");
    stepSim(a, FIRE);
    expect(cards(a)[0]!.r).toBeGreaterThan(4);
    const b = jk(null);
    equipWeapon(b, "jkToyGun");
    stepSim(b, FIRE);
    run(b, 600, EMPTY_INPUT);
    const c = cards(b)[0]!;
    expect(cardDamage(b.player, c)).toBe(J.base + 3 * Math.min(c.n, J.maxBounce));
  });

  it("실베르 성장: 패시브를 가질 때마다 능력치가 더 오름", () => {
    const a = jk();
    const b = jk(120, "jkEdge", "jkFrost", "jkGuard");
    expect(b.player.stats.maxHp).toBe(a.player.stats.maxHp + 10 + G.hp * 3);
    expect(b.player.stats.moveSpeed).toBeGreaterThan(a.player.stats.moveSpeed + 0.05);
    expect(b.player.stats.projectileSpeed).toBeCloseTo(a.player.stats.projectileSpeed * (1 + G.shot * 3));
  });

  it("카드뽑기: 맞힐 때마다 게이지 → 섞인 뒤 한 장이 뒤집힘 (시드로 같은 결과)", () => {
    const s = jk(100, "jkDraw");
    run(s, 30);
    expect(s.player.jkGauge ?? 0).toBeGreaterThan(0);
    const results: number[] = [];
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const t = jk(null, "jkDraw");
      t.seed = seed;
      drawNow(t);
      expect(t.player.jkFlip?.t).toBe(D.flipTicks);
      results.push(t.player.jkFlip!.card);
      const again = jk(null, "jkDraw");
      again.seed = seed;
      drawNow(again);
      expect(again.player.jkFlip).toEqual(t.player.jkFlip);
    }
    expect(new Set(results).size).toBeGreaterThan(1);
  });

  it("붉은 일식: 받는 피해 +30% · 카드 처음 피해 16 / 세계수: 체력 20 회복", () => {
    const s = jk(null, "jkDraw");
    s.player.jkBuff = { card: 1, t: D.buffTicks, hero: 0 };
    const t = jk(null, "jkDraw");
    s.player.hp = t.player.hp = 60;
    damagePlayer(s, 10);
    damagePlayer(t, 10);
    expect(60 - s.player.hp).toBeCloseTo((60 - t.player.hp) * D.eclipseTaken);
    stepSim(s, FIRE);
    expect(cardDamage(s.player, cards(s)[0]!)).toBe(D.eclipseBase);
    const h = jk(null, "jkDraw");
    h.player.hp = 30;
    h.player.jkFlip = { t: 1, card: 2, hero: 0 };
    stepSim(h, EMPTY_INPUT);
    expect(h.player.hp).toBe(30 + D.treeHeal);
  });

  it("달: 히든 캐릭터의 힘을 10초 동안 (제우스 낙뢰)", () => {
    const s = jk(140, "jkDraw");
    s.player.jkBuff = { card: 0, t: D.buffTicks, hero: 5 };
    const hp = s.enemies[0]!.hp;
    run(s, 50, EMPTY_INPUT);
    expect(s.enemies[0]!.hp).toBeLessThan(hp);
    run(s, D.buffTicks, EMPTY_INPUT);
    expect(s.player.jkBuff).toBeUndefined();
  });

  it("에이스 · 더블 덱", () => {
    const s = jk(null, "jkDouble");
    run(s, 60 * 4);
    expect(cards(s).length).toBeGreaterThan((s.player.jkThrown ?? 0));
    const a = jk(null, "jkAce");
    for (let i = 0; i < 2000 && (a.player.jkThrown ?? 0) < K.jkAce.every; i++) stepSim(a, FIRE);
    expect(cards(a).some((c) => c.ace && c.b === K.jkAce.base)).toBe(true);
  });
});
