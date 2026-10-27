import { describe, expect, it } from "vitest";
import { TRACKER_PERKS as K } from "../itemsTracker";
import { TRACKER as T } from "../weaponsTracker";
import { decodeInputs, encodeInputs } from "../daily";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { trackerGuard } from "./tracker";
import { enemy, FIRE } from "./perkTestUtil";

function tracker(...perks: string[]): RunState {
  const s = createRun(5, "tracker");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 150, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const KEY = (n: number) => ({ ...FIRE, attack: false, skill: n });

describe("추적자", () => {
  it("스킬 키는 입력 기록에 남음", () => {
    expect(decodeInputs(encodeInputs([{ ...EMPTY_INPUT, skill: 3 }]))[0]!.skill).toBe(3);
  });

  it("평소 저격: 멀리 꿰뚫는 한 발", () => {
    const s = tracker();
    for (let i = 0; i < 40; i++) stepSim(s, FIRE);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("1 암습 저격: 무적 · 제자리 · 10발 (한 발 200%) · 끝나면 대기 10초", () => {
    const s = tracker();
    stepSim(s, KEY(1));
    expect(s.player.trAmbush?.shots).toBe(T.ambushShots);
    let shots = 0;
    for (let i = 0; i < T.ambushTicks + 5 && s.player.trAmbush; i++) {
      const before = s.player.trAmbush?.shots ?? 0;
      stepSim(s, FIRE);
      expect(s.player.invulnTicks).toBeGreaterThan(0);
      if ((s.player.trAmbush?.shots ?? 0) < before) shots++;
    }
    expect(shots + 1).toBeGreaterThanOrEqual(T.ambushShots);
    expect(s.player.trAmbush).toBeUndefined();
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * T.ambushMul * 9);
    expect(s.player.trCd?.[0]).toBeGreaterThan(T.cooldowns[0]! - 5);
  });

  it("암습 저격은 10초가 지나면 다 못 쏴도 끝남", () => {
    const s = tracker();
    stepSim(s, KEY(1));
    for (let i = 0; i < T.ambushTicks + 2; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 1000 });
    expect(s.player.trAmbush).toBeUndefined();
  });

  it("2 강력한 한방: 모으는 동안 앞의 벽이 적 탄을 막고, 방을 꿰뚫어 1000% + 최대 체력 20%", () => {
    const s = tracker();
    s.enemies = [{ ...enemy(1, 200, 72, 10000), rootTicks: 99999 }];
    stepSim(s, KEY(2));
    expect(s.player.trCharge).toBeGreaterThan(0);
    s.projectiles.push({ id: 900, fromPlayer: false, x: 66, y: 72, prevX: 66, prevY: 72, r: 2, vx: -0.1, vy: 0, damage: 5, ticksLeft: 60 });
    stepSim(s, { ...EMPTY_INPUT, aimX: 1000 });
    expect(s.projectiles.some((p) => p.id === 900)).toBe(false);
    for (let i = 0; i < T.powerCharge + 2; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 1000 });
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * T.powerMul + 10000 * T.powerHp - 1);
    expect(s.player.trCd?.[1]).toBeGreaterThan(0);
  });

  it("3 연발사격: 10발을 흩뿌림 (확장 탄창 15발) · 대기 3초", () => {
    const s = tracker();
    stepSim(s, KEY(3));
    let shots = 0;
    for (let i = 0; i < 60; i++) {
      const n = s.projectiles.filter((p) => p.spirit === "trBurst").length;
      stepSim(s, { ...EMPTY_INPUT, aimX: 1000 });
      shots += Math.max(0, s.projectiles.filter((p) => p.spirit === "trBurst").length - n);
    }
    expect(shots).toBeGreaterThanOrEqual(T.burstShots - 2);
    const d = tracker("trDrum");
    stepSim(d, KEY(3));
    expect(d.player.trBurst?.left).toBeGreaterThanOrEqual(K.trDrum.shots - 1);
    expect(s.player.trCd?.[2]).toBe(T.cooldowns[2]! - 60);
  });

  it("2 강력한 한방은 한 판에 3번 · 스킬 중에도 움직임 · 위장복은 대시 뒤 받는 피해 감소", () => {
    const s = tracker("trCamo");
    for (let n = 0; n < 4; n++) {
      s.player.trCd = [0, 0, 0];
      stepSim(s, KEY(2));
      expect(!!s.player.trCharge).toBe(n < T.powerUses);
      delete s.player.trCharge;
    }
    stepSim(s, KEY(1));
    const x = s.player.x;
    for (let i = 0; i < 10; i++) stepSim(s, { ...EMPTY_INPUT, moveX: 1 });
    expect(s.player.x).toBeGreaterThan(x);
    s.player.trCamo = 10;
    expect(trackerGuard(s.player)).toBe(K.trCamo.taken);
  });
});
