import { describe, expect, it } from "vitest";
import { cleanTaboo, TABOO_IDS, TABOO_MAX_POINTS, TABOOS, tabooPoints } from "../taboo";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { goThrough } from "./rooms";
import { damagePlayer, addGold } from "./combat";
import { enemyShot } from "./util";
import type { RunState } from "./types";

/** 첫 전투방으로 들어감 */
function toCombat(s: RunState): RunState {
  s.rooms[s.roomId]!.cleared = true;
  goThrough(s, s.map.rooms[s.roomId]!.exits.findIndex((x) => x >= 0 && s.map.rooms[x]!.type === "combat"));
  return s;
}

describe("금기의 서", () => {
  it("금기 30개 · 점수는 건 수 × 점수 (최대까지만) · 정리", () => {
    expect(TABOO_IDS).toHaveLength(30);
    expect(tabooPoints({ fleshHp: 2, bossHp: 1 })).toBe(2 * TABOOS.fleshHp.pts + TABOOS.bossHp.pts);
    expect(tabooPoints({ deathBurst: 9 })).toBe(TABOOS.deathBurst.pts);
    expect(TABOO_MAX_POINTS).toBeGreaterThan(50);
    expect(cleanTaboo({ fleshHp: 99, nope: 3, horde: 0 })).toEqual({ fleshHp: TABOOS.fleshHp.max });
    expect(cleanTaboo({})).toBeUndefined();
  });

  it("적: 체력 +20%씩 · 수 +1씩 (같은 시드 같은 방과 비교)", () => {
    const a = toCombat(createRun(5, "warden"));
    const b = toCombat(createRun(5, "warden", [], false, false, false, false, { fleshHp: 2, horde: 3 }));
    // 무리로 나오는 적(박쥐 떼 등)은 하나가 여럿이라 3 이상 늘어남
    expect(b.enemies.length).toBeGreaterThanOrEqual(a.enemies.length + 3);
    expect(b.enemies[0]!.maxHp / a.enemies[0]!.maxHp).toBeCloseTo(1.4, 1);
  });

  it("받는 피해 +15%씩 · 적 탄 빨라짐 · 얻는 돈 줄어듦", () => {
    const a = createRun(5, "warden");
    const b = createRun(5, "warden", [], false, false, false, false, { frail: 2, bulletSpeed: 1, poverty: 3 });
    for (const s of [a, b]) {
      s.enemies = [];
      damagePlayer(s, 10);
      addGold(s, 10);
    }
    expect(a.player.stats.maxHp - a.player.hp).toBeCloseTo(10);
    expect(b.player.stats.maxHp - b.player.hp).toBeCloseTo(13);
    expect(b.goldEarned).toBe(4);
    const pr = enemyShot(b, 0, 0, 1, 0, 2, 1);
    expect(pr.vx).toBeCloseTo(2.3);
  });

  it("내 몸: 최대 체력·공격력 줄어듦 (처음부터 가득 찬 체력)", () => {
    const a = createRun(5, "warden");
    const b = createRun(5, "warden", [], false, false, false, false, { weakBody: 5, dullBlade: 2 });
    expect(b.player.stats.maxHp).toBeCloseTo(a.player.stats.maxHp * 0.5);
    expect(b.player.hp).toBe(b.player.stats.maxHp);
    expect(b.player.stats.damage).toBeCloseTo(a.player.stats.damage * 0.8);
  });

  it("방에 들어갈 때마다 체력 -2씩 · 금기 판도 같은 입력이면 결과가 같음", () => {
    const s = createRun(5, "warden", [], false, false, false, false, { bloodToll: 1 });
    const hp = s.player.hp;
    toCombat(s);
    expect(s.player.hp).toBe(hp - 2);
    const t = { haste: 3, fury: 3, deathBurst: 1, fangs: 2 };
    const x = createRun(9, "imugi", [], false, false, false, false, t);
    const y = createRun(9, "imugi", [], false, false, false, false, t);
    for (const r of [x, y]) for (let i = 0; i < 1500; i++) stepSim(r, { ...EMPTY_INPUT, attack: true, autoAim: true, moveY: i % 200 < 100 ? -100 : 50 });
    expect(JSON.stringify(x)).toBe(JSON.stringify(y));
  });
});
