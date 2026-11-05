import { describe, expect, it } from "vitest";
import { THORKEN as T } from "../weaponsThorken";
import type { WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";

const ALL: WeaponId[] = ["tkIron", "tkTide", "tkVolt", "tkWhirl", "tkUrchin", "tkTwin", "tkGeyser", "tkFloe", "tkKraken", "tkMaelstrom"];

function thor(weapon: WeaponId = "tkIron", ...perks: string[]): RunState {
  const s = createRun(5, "thorken");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 100, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const IDLE = { ...FIRE, attack: false };
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}

describe("토르켄", () => {
  for (const w of ALL) {
    it(`철구공 ${w}: 적에게 피해`, () => {
      const s = thor(w);
      run(s, 240);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("처음 누르면 철구공을 던지고, 떨어지면 천둥 · 그 뒤 사슬 끝에 나가 있음", () => {
    const s = thor();
    stepSim(s, FIRE);
    expect(s.player.tkMode).toBe(1);
    run(s, T.throwTicks + 1, IDLE);
    expect(s.player.tkMode).toBe(2);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.effects.some((e) => e.kind === "tkClap")).toBe(true);
  });

  it("나가 있으면 누를 때마다 닻 + 철구공 휘두르기 (철구공이 나를 돌아 크게 휩씀)", () => {
    const s = thor();
    run(s, 2);
    run(s, 60, IDLE);
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
    expect(s.player.tkSweep).toBeTruthy();
    expect(s.effects.some((e) => e.kind === "tkAnchor")).toBe(true);
    run(s, T.sweepTicks + 1, IDLE);
    expect(s.player.tkSweep).toBeUndefined();
    const d = Math.hypot((s.player.tkBx ?? 0) - s.player.x, (s.player.tkBy ?? 0) - s.player.y);
    expect(d).toBeGreaterThan(T.anchorReach * 0.7);
  });

  it("대시하면 철구공을 감아 들임 → 다시 던질 수 있음", () => {
    const s = thor();
    run(s, 40);
    expect(s.player.tkMode).toBe(2);
    s.player.dashTicks = 5;
    stepSim(s, IDLE);
    expect(s.player.tkMode ?? 0).toBe(0);
  });

  it("폭풍 게이지가 가득이면 다음 휘두르기에 태풍 + 천둥, 태풍이 적을 끌어당김", () => {
    const s = thor();
    s.enemies.push({ ...enemy(2, 50, 140, 99999) });
    run(s, 30);
    s.player.tkGauge = T.gaugeMax;
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
    expect(s.player.tkStorm).toBeTruthy();
    expect(s.player.tkGauge).toBeLessThan(T.gaugeMax);
    expect(s.effects.some((e) => e.kind === "tkBolt")).toBe(true);
  });

  it("방을 정리하지 않아도 같은 시드면 같은 결과 (결정성)", () => {
    const a = thor("tkMaelstrom", "tkPearl", "tkTrident");
    const b = thor("tkMaelstrom", "tkPearl", "tkTrident");
    run(a, 400);
    run(b, 400);
    expect(lost(a)).toBe(lost(b));
  });

  it("산호 갑옷: 철구공이 나가 있으면 받는 피해 줄어듦", () => {
    const a = thor("tkIron", "tkCoral");
    const b = thor("tkIron");
    run(a, 30);
    run(b, 30);
    a.player.invulnTicks = b.player.invulnTicks = 0;
    const ha = a.player.hp;
    const hb = b.player.hp;
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(ha - a.player.hp).toBeLessThan(hb - b.player.hp);
  });

  it("허수아비 초당 피해가 지나치지 않음 (철구공마다 10~60)", () => {
    for (const w of ALL) {
      const s = thor(w);
      for (let i = 0; i < 600; i++) {
        stepSim(s, FIRE);
        s.enemies[0]!.x = 100;
        s.enemies[0]!.y = 72;
      }
      const dps = lost(s) / 10;
      expect(dps, w).toBeGreaterThan(8);
      expect(dps, w).toBeLessThan(70);
    }
  });
});
