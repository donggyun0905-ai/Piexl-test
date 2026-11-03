import { describe, expect, it } from "vitest";
import { HIDDEN_CHARACTERS } from "../characters";
import { WEAPONS, type WeaponId } from "../content";
import { PILGRIM_PASSIVES } from "../itemsPilgrim";
import { PILGRIM as P } from "../weaponsPilgrim";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { PG_IDS } from "./pgBag";
import { enemy, FIRE } from "./perkTestUtil";

function pilgrim(weapon: WeaponId = "pgStaff", ...perks: string[]): RunState {
  const s = createRun(9, "pilgrim");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [
    { ...enemy(1, 80, 72, 999999), rootTicks: 999999 },
    { ...enemy(2, 100, 80, 999999), rootTicks: 999999 },
  ];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

describe("차원의 순례자", () => {
  it("히든 캐릭터 · 무기 20 · 패시브 20", () => {
    expect(HIDDEN_CHARACTERS).toContain("pilgrim");
    expect(PG_IDS).toHaveLength(20);
    expect(Object.keys(PILGRIM_PASSIVES)).toHaveLength(20);
  });

  for (const w of PG_IDS) {
    it(`무기 ${w}: 적에게 피해 · 도감에 적힘`, () => {
      const s = pilgrim(w);
      for (let i = 0; i < 300; i++) stepSim(s, FIRE);
      expect(lost(s)).toBeGreaterThan(0);
      expect(s.player.pgBook).toContain(w);
      expect((WEAPONS[w] as { exclusive?: string }).exclusive).toBe("pilgrim");
    });
  }

  it("도감이 많을수록 세고, 배낭에서 다른 수집품을 꺼내 씀", () => {
    const a = pilgrim("pgKey");
    const b = pilgrim("pgKey");
    b.player.pgBook = [...PG_IDS];
    let pulled = 0;
    for (let i = 0; i < 600; i++) {
      stepSim(a, FIRE);
      stepSim(b, FIRE);
      if (b.effects.some((f) => f.kind === "pgBag")) pulled++;
    }
    expect(lost(b)).toBeGreaterThan(lost(a));
    expect(b.player.attackCount).toBeGreaterThanOrEqual(P.bagEvery);
    expect(pulled).toBeGreaterThan(0);
  });

  it("도감 한 칸마다 공격력 · 사거리가 % 로 오름", () => {
    const a = pilgrim("pgBlade");
    const b = pilgrim("pgBlade");
    b.player.pgBook = [...PG_IDS];
    recalcStats(b);
    expect(b.player.stats.damage / a.player.stats.damage).toBeCloseTo(1 + 20 * P.bookDmg, 2);
    expect(b.player.stats.range).toBeGreaterThan(a.player.stats.range * 1.4);
  });

  it("우산을 들면 받는 피해가 줄어듦", async () => {
    const { pilgrimTaken } = await import("./pgBag");
    const s = pilgrim("pgUmbrella");
    expect(pilgrimTaken(s.player)).toBeCloseTo(P.umbrellaTaken);
  });

  it("같은 시드면 같은 결과", () => {
    const a = pilgrim("pgCrane", "pgEcho", "pgDoubleBag");
    const b = pilgrim("pgCrane", "pgEcho", "pgDoubleBag");
    a.player.pgBook = b.player.pgBook = [...PG_IDS];
    for (let i = 0; i < 240; i++) {
      stepSim(a, FIRE);
      stepSim(b, FIRE);
    }
    expect(lost(a)).toBe(lost(b));
  });
});
