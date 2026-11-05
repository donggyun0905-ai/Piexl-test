import { describe, expect, it } from "vitest";
import { HOOK as H } from "../weaponsHook";
import type { WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damageEnemy, damagePlayer } from "./combat";
import { blast } from "./hookShot";
import { enemy, FIRE } from "./perkTestUtil";

const ALL: WeaponId[] = ["hkRusty", "hkKraken", "hkHarpoon", "hkStorm", "hkDragon", "hkUndertow"];
const IDLE = { ...FIRE, attack: false };

function hook(weapon: WeaponId = "hkRusty", ...perks: string[]): RunState {
  const s = createRun(5, "hook");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.hkRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 150, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
/** 한 번 던지고 갈고리가 끝날 때까지 */
function cycle(s: RunState, aimX = 1000): void {
  s.player.attackCooldown = 0;
  stepSim(s, { ...FIRE, aimX });
  for (let i = 0; i < 80 && s.player.hkHook; i++) stepSim(s, { ...IDLE, aimX });
}

describe("훅", () => {
  for (const w of ALL) {
    it(`갈고리 ${w}: 적에게 피해`, () => {
      const s = hook(w);
      run(s, 180);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("갈고리로 적을 끌어와 쏘면 원래 자리 쯤으로 튕겨 날아감", () => {
    const s = hook();
    const e = s.enemies[0]!;
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
    let nearest = 999;
    for (let i = 0; i < 80 && s.player.hkHook; i++) {
      stepSim(s, IDLE);
      nearest = Math.min(nearest, e.x - s.player.x);
    }
    expect(nearest).toBeLessThan(H.holdAt + 4);
    expect(s.effects.some((f) => f.kind === "hkBlast")).toBe(true);
    run(s, H.slideTicks + 2, IDLE);
    expect(e.x).toBeGreaterThan(130);
  });

  it("걸리는 적은 최대 3 (네 갈래 갈고리 +2)", () => {
    const line = (s: RunState) => {
      s.enemies = [0, 1, 2, 3, 4, 5].map((i) => ({ ...enemy(i + 1, 90 + i * 12, 100, 99999), rootTicks: 99999 }));
      s.player.attackCooldown = 0;
      stepSim(s, FIRE);
      let most = 0;
      for (let i = 0; i < 80 && s.player.hkHook; i++) {
        most = Math.max(most, s.player.hkHook.caught.length);
        stepSim(s, IDLE);
      }
      return most;
    };
    expect(line(hook())).toBe(3);
    expect(line(hook("hkRusty", "hkGrapnel"))).toBe(5);
  });

  it("빈 갈고리가 벽에 박히면 밧줄을 타고 벽으로 날아감", () => {
    const s = hook();
    s.enemies = [];
    s.player.faceX = -1;
    s.player.x = s.player.prevX = 90;
    cycle(s, -1000);
    expect(s.player.x).toBeLessThan(60);
    expect(s.effects.some((f) => f.kind === "hkLand")).toBe(true);
  });

  it("벽에 부딪혀 튕긴 적은 난파 (피해 + 기절)", () => {
    const s = hook("hkUndertow");
    const e = s.enemies[0]!;
    // 왼쪽 벽 가까이 적 · 왼쪽으로 쏘면 벽으로 튕겨 부딪힘
    e.x = e.prevX = 32;
    s.player.x = s.player.prevX = 50;
    blast(s, -1, 0, []);
    run(s, H.slideTicks + 2, { ...IDLE, aimX: -1000 });
    expect(s.effects.some((f) => f.kind === "hkWreck")).toBe(true);
    expect(e.stunTicks ?? 0).toBeGreaterThan(0);
  });

  it("방이 바뀌면 갈고리를 거둠", () => {
    const s = hook();
    s.player.attackCooldown = 0;
    stepSim(s, FIRE);
    expect(s.player.hkHook).toBeDefined();
    s.player.hkRoom = "x";
    stepSim(s, IDLE);
    expect(s.player.hkHook).toBeUndefined();
  });

  it("쌍발 연사: 둘째 총열이 한 번 더", () => {
    const s = hook("hkRusty", "hkDoubleTap");
    cycle(s);
    run(s, 12, IDLE);
    expect(s.effects.some((f) => f.kind === "hkTap")).toBe(true);
  });

  it("자유의 돛: 받는 피해 줄어듦", () => {
    const a = hook();
    const b = hook("hkRusty", "hkFreedom");
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(b.player.hp).toBeGreaterThan(a.player.hp);
  });

  it("같은 시드·같은 입력이면 같은 결과", () => {
    const a = hook("hkKraken");
    const b = hook("hkKraken");
    run(a, 300);
    run(b, 300);
    expect(lost(a)).toBe(lost(b));
  });
  it("갈고리에 걸릴 때마다 약화 스택 (최대 5, 스택마다 받는 피해 +5%)", () => {
    const s = hook();
    const e = s.enemies[0]!;
    for (let i = 0; i < 14; i++) {
      e.x = 150;
      e.y = 100;
      cycle(s);
    }
    expect(e.hkMark).toBe(H.markMax);
    const a = { ...enemy(2, 0, 0, 9999) };
    const b = { ...enemy(3, 0, 0, 9999), hkMark: 5 };
    damageEnemy(s, a, 100, 1, 0, false);
    damageEnemy(s, b, 100, 1, 0, false);
    expect((b.maxHp - b.hp) / (a.maxHp - a.hp)).toBeCloseTo(1 + H.markMax * H.markTaken, 2);
  });
});
