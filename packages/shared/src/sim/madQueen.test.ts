import { describe, expect, it } from "vitest";
import { MADQUEEN as Q } from "../weaponsMadQueen";
import type { WeaponId } from "../content";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { cannonCount } from "./madQueenKit";
import { enemy, FIRE } from "./perkTestUtil";

const ALL: WeaponId[] = ["mqTide", "mqCrimson", "mqBeacon", "mqCoral"];

function queen(weapon: WeaponId = "mqTide", ...perks: string[]): RunState {
  const s = createRun(5, "madQueen");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.enemies = [{ ...enemy(1, 130, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
function press(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}

describe("매드퀸", () => {
  for (const w of ALL) {
    it(`함대 ${w}: 포탄이 터져 적에게 피해`, () => {
      const s = queen(w);
      run(s, 180);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("누를 때마다 대포 1문이 한 발 (레이저가 아님)", () => {
    const s = queen();
    press(s);
    expect(s.player.mqShells?.filter((w) => w.src === 0).length).toBe(1);
  });

  it("대포 아이템 셋을 모으면 대포 4문 · 넷째부터는 늘지 않음", () => {
    expect(cannonCount(queen().player)).toBe(1);
    expect(cannonCount(queen("mqTide", "mqTwin").player)).toBe(2);
    const s = queen("mqTide", "mqTwin", "mqBroadside", "mqFlagship");
    expect(cannonCount(s.player)).toBe(4);
    press(s);
    expect(s.player.mqShells?.filter((w) => w.src === 0).length).toBe(4);
  });

  it("터렛·날개는 확률로 나오고 각각 최대 4", () => {
    const s = queen();
    let turrets = 0;
    let wings = 0;
    for (let i = 0; i < 400 && !s.player.mqSalvo; i++) {
      press(s);
      turrets = Math.max(turrets, s.player.mqTurrets?.length ?? 0);
      wings = Math.max(wings, s.player.mqWings ?? 0);
      expect(s.player.mqTurrets?.length ?? 0).toBeLessThanOrEqual(Q.turretMax);
      expect(s.player.mqWings ?? 0).toBeLessThanOrEqual(Q.wingMax);
    }
    expect(turrets).toBeGreaterThan(0);
    expect(wings).toBeGreaterThan(0);
  });

  it("터렛 4 + 날개 4 → 전탄 일제사격: 맵에 포탄이 떨어지고 대포만 남음", () => {
    const s = queen();
    let fired = false;
    for (let i = 0; i < 600 && !fired; i++) {
      press(s);
      fired = (s.player.mqSalvo ?? 0) > 0;
    }
    expect(fired).toBe(true);
    expect(s.player.mqTurrets).toBeUndefined();
    expect(s.player.mqWings).toBeUndefined();
    const drops = s.player.mqShells?.filter((w) => w.src === 2) ?? [];
    expect(drops.length).toBeGreaterThanOrEqual(Q.salvoShots);
    const before = lost(s);
    run(s, Q.salvoFall + Q.salvoSpread + 5, { ...FIRE, attack: false });
    expect(lost(s)).toBeGreaterThan(before);
  });

  it("터렛은 사거리 안 적을 저절로 쏨 (누르지 않아도)", () => {
    const s = queen();
    s.player.mqRoom = `${s.floor}/${s.roomId}`;
    s.player.mqTurrets = [{ x: 110, y: 90, cd: 0, a: 0, age: 20 }];
    run(s, 60, { ...FIRE, attack: false });
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("날개는 쏠 때 같이 레이저 (꿰뚫음)", () => {
    const s = queen();
    s.player.mqRoom = `${s.floor}/${s.roomId}`;
    s.player.mqWings = 2;
    s.enemies.push({ ...enemy(2, 160, 63, 99999), rootTicks: 99999 });
    press(s);
    expect(s.effects.filter((e) => e.kind === "mqBeam").length).toBe(2);
  });

  it("방이 바뀌면 터렛·날개가 사라짐", () => {
    const s = queen();
    s.player.mqRoom = "x";
    s.player.mqTurrets = [{ x: 110, y: 90, cd: 0, a: 0, age: 20 }];
    s.player.mqWings = 3;
    run(s, 1, { ...FIRE, attack: false });
    expect(s.player.mqTurrets).toBeUndefined();
    expect(s.player.mqWings).toBeUndefined();
  });

  it("자유의 바다: 받는 피해 줄어듦", () => {
    const a = queen();
    const b = queen("mqTide", "mqFreedom");
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(b.player.hp).toBeGreaterThan(a.player.hp);
  });

  it("같은 시드·같은 입력이면 같은 결과", () => {
    const a = queen("mqCoral");
    const b = queen("mqCoral");
    run(a, 300);
    run(b, 300);
    expect(lost(a)).toBe(lost(b));
    expect(a.player.mqTurrets).toEqual(b.player.mqTurrets);
  });
});
