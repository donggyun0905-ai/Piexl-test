import { describe, expect, it } from "vitest";
import { CHARACTER_IDS, CHARACTERS } from "../content";
import { PASSIVES, type PassiveDef, type PassiveId } from "../items";
import type { WeaponId } from "../content";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { characterWeapons } from "./loot";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

/** 플라이로 시작, 오른쪽에 묶어 둔 적 셋 */
function fly(weapon: WeaponId = "glassClaw", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "fly");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [0, 1, 2].map((i) => ({ ...enemy(i + 1, 70 + i * 12, 72, 99999), rootTicks: 99999 }));
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const swoops = (s: RunState, n: number) => {
  for (let k = 0; k < n; k++) {
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
    for (let i = 0; i < 12; i++) stepSim(s, EMPTY_INPUT);
    s.player.x = s.player.prevX = 50;
  }
  for (let i = 0; i < 40; i++) stepSim(s, EMPTY_INPUT);
};

describe("플라이", () => {
  it("보통 캐릭터 · 발톱 10 · 전용 아이템 10", () => {
    expect(CHARACTER_IDS).toContain("fly");
    expect(CHARACTERS.fly.startWeapon).toBe("glassClaw");
    expect(characterWeapons("fly")).toHaveLength(10);
    expect(Object.values(PASSIVES).filter((p) => (p as PassiveDef).exclusive === "fly")).toHaveLength(10);
  });

  it("급습: 앞으로 날아가며 그동안 무적, 지나간 적이 맞음", () => {
    const s = fly();
    const x0 = s.player.x;
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
    stepSim(s, FIRE);
    expect(s.player.invulnTicks).toBeGreaterThan(0);
    for (let i = 0; i < 8; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.x).toBeGreaterThan(x0 + 20);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("모든 발톱이 피해를 줌", () => {
    for (const w of characterWeapons("fly")) {
      const s = fly(w);
      swoops(s, 3);
      expect(lost(s), w).toBeGreaterThan(0);
    }
  });

  it("날 선 발톱은 피해를 늘림 (급습이 끝나는 자리의 적)", () => {
    const end = (s: RunState) => {
      s.enemies.forEach((e, i) => (e.x = 50 + s.player.stats.range * 2 + 6 + i * 4));
      return s;
    };
    const a = end(fly());
    swoops(a, 3);
    const b = end(fly("glassClaw", "flyKeen"));
    swoops(b, 3);
    expect(lost(b)).toBeGreaterThan(lost(a));
  });

  it("급습 거리는 사거리의 두 배", () => {
    const s = fly();
    s.enemies = [];
    const x0 = s.player.x;
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
    for (let i = 0; i < 12; i++) stepSim(s, EMPTY_INPUT);
    if (!s.player.mRaid) expect(s.player.x - x0).toBeGreaterThan(s.player.stats.range * 1.8);
  });

  it("하늘 습격: 사라져 무적으로 열 번 내리긋고 내려옴", () => {
    let seen = 0;
    for (let seed = 1; seed < 40 && !seen; seed++) {
      const s = fly();
      s.seed = seed;
      for (let i = 0; i < 400 && !s.player.mRaid; i++) stepSim(s, FIRE);
      if (!s.player.mRaid) continue;
      seen++;
      expect(s.player.mRaid.n).toBe(10);
      const hp = lost(s);
      for (let i = 0; i < 30; i++) {
        stepSim(s, EMPTY_INPUT);
        expect(s.player.invulnTicks).toBeGreaterThan(0);
      }
      for (let i = 0; i < 60 && s.player.mRaid; i++) stepSim(s, EMPTY_INPUT);
      expect(s.player.mRaid).toBeUndefined();
      expect(lost(s)).toBeGreaterThan(hp);
    }
    expect(seen).toBe(1);
  });

  it("그림자 발톱: 잠시 뒤 분신이 같은 길을 되짚어 다시 벰", () => {
    const s = fly("shadowClaw");
    const c = s.player.attackCount;
    for (let i = 0; i < 300 && s.player.attackCount === c; i++) stepSim(s, FIRE);
    if (s.player.mRaid) return;
    for (let i = 0; i < 9; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.fShade).toBeDefined();
    const hp = lost(s);
    for (let i = 0; i < 25; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.fShade).toBeUndefined();
    expect(lost(s)).toBeGreaterThan(hp);
  });
});
