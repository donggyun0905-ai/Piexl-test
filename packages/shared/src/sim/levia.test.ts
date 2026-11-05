import { describe, expect, it } from "vitest";
import { TICK_RATE } from "../constants";
import { LEVIA as L } from "../weaponsLevia";
import type { WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { whaleChance } from "./leviaKit";
import { enemy, FIRE } from "./perkTestUtil";

const ALL: WeaponId[] = ["lvAqua", "lvSapphire", "lvTopaz", "lvCoral", "lvMoon", "lvAbyss", "lvIce", "lvTwin", "lvGale", "lvKing"];

function levia(weapon: WeaponId = "lvAqua", ...perks: string[]): RunState {
  const s = createRun(5, "levia");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 90, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const IDLE = { ...FIRE, attack: false };
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
/** 다음 타를 바로 칠 수 있게 */
function press(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}

describe("리바이어", () => {
  for (const w of ALL) {
    it(`보석 ${w}: 적에게 피해`, () => {
      const s = levia(w);
      run(s, 240);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("4단 콤보: 1타 휘두르기 → 2타 찌르기 → 3타 회전 + 고래 대돌격 → (0.5초 만에) 4타 돌진 뒤 충격파", () => {
    const s = levia();
    press(s);
    expect(s.effects.some((e) => e.kind === "lvSwing")).toBe(true);
    expect(s.player.lvStep).toBe(1);
    press(s);
    expect(s.effects.some((e) => e.kind === "lvThrust")).toBe(true);
    expect(s.player.lvStep).toBe(2);
    press(s);
    expect(s.effects.some((e) => e.kind === "lvSpin")).toBe(true);
    expect(s.player.attackCooldown).toBeLessThanOrEqual(Math.round(TICK_RATE * L.spinToRush));
    expect(s.player.lvWhales?.length).toBeGreaterThan(0);
    const x0 = s.player.x;
    press(s);
    expect(s.player.lvRush).toBeTruthy();
    run(s, L.rushTicks + 1, IDLE);
    expect(s.player.x).toBeGreaterThan(x0 + 20);
    expect(s.effects.some((e) => e.kind === "lvQuake")).toBe(true);
    expect(s.player.lvStep).toBe(0);
  });

  it("멈추면 콤보가 1타부터 다시", () => {
    const s = levia();
    press(s);
    run(s, L.comboGap + 80, IDLE);
    press(s);
    expect(s.player.lvStep).toBe(1);
  });

  it("고래가 안 나올수록 확률이 오르고, 나오면 다시 처음으로", () => {
    const s = levia();
    const base = whaleChance(s.player);
    s.player.lvMiss = 3;
    expect(whaleChance(s.player)).toBeGreaterThan(base);
    let seen = false;
    for (let i = 0; i < 60 && !seen; i++) {
      press(s);
      seen = s.effects.some((e) => e.kind === "lvFin" || e.kind === "lvTailSweep" || e.kind === "lvOrbit") || (s.player.lvRush === 2);
      run(s, 12, IDLE);
    }
    expect(seen).toBe(true);
  });

  it("고래가 반드시 나오면 1타 날개 쓸기가 창보다 멀리 닿음", () => {
    const s = levia("lvAqua", "lvCall");
    s.enemies = [{ ...enemy(1, 50 + L.finReach - 4, 72, 99999), rootTicks: 99999 }];
    s.player.lvMiss = 20;
    press(s);
    expect(s.effects.some((e) => e.kind === "lvFin")).toBe(true);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("닻 없는 배: 대시 뒤 첫 공격이 곧바로 3타 돌진", () => {
    const s = levia("lvAqua", "lvAnchorless");
    s.player.dashTicks = 3;
    run(s, 4, IDLE);
    press(s);
    expect(s.player.lvRush).toBeTruthy();
  });

  it("리바이어던의 눈: 4타 끝에 고래 도약", () => {
    const s = levia("lvKing");
    press(s);
    press(s);
    press(s);
    press(s);
    run(s, L.rushTicks + 1, IDLE);
    expect(s.effects.some((e) => e.kind === "lvBreach")).toBe(true);
  });

  it("같은 시드·입력이면 결과가 같음 (결정성)", () => {
    const a = levia("lvSapphire", "lvPod", "lvCalf", "lvBlowhole", "lvWhite");
    const b = levia("lvSapphire", "lvPod", "lvCalf", "lvBlowhole", "lvWhite");
    run(a, 400);
    run(b, 400);
    expect(lost(a)).toBe(lost(b));
  });

  it("소라 갑옷: 받는 피해 줄어듦", () => {
    const a = levia("lvAqua", "lvShell");
    const b = levia("lvAqua");
    a.player.invulnTicks = b.player.invulnTicks = 0;
    const ha = a.player.hp;
    const hb = b.player.hp;
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(ha - a.player.hp).toBeLessThan(hb - b.player.hp);
  });

  it("허수아비 초당 피해가 지나치지 않음 (보석마다 10~70)", () => {
    for (const w of ALL) {
      const s = levia(w);
      for (let i = 0; i < 600; i++) {
        stepSim(s, FIRE);
        if (!s.player.s2Rush) s.player.x = s.player.prevX = 50;
        s.enemies[0]!.x = 90;
        s.enemies[0]!.y = 72;
      }
      const dps = lost(s) / 10;
      expect(dps, w).toBeGreaterThan(10);
      expect(dps, w).toBeLessThan(70);
    }
  });
});
