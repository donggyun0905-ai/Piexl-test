import { afterEach, describe, expect, it } from "vitest";
import { applyBalance } from "../balance";
import { CHARACTERS, EXTRA_DEFAULTS } from "../characters";
import { createRun, stepSim, type RunState } from "./index";
import { damagePlayer } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";
import { recalcStats } from "./items";

function warden(): RunState {
  const s = createRun(3, "warden");
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 64, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);

afterEach(() => applyBalance({}));

describe("공통 추가 기본 스탯", () => {
  it("모든 캐릭터에 처음 값이 들어 있고 관리자 수치로 바꿀 수 있음", () => {
    for (const c of Object.values(CHARACTERS)) for (const k of Object.keys(EXTRA_DEFAULTS)) expect(c, k).toHaveProperty(k);
    applyBalance({ characters: { warden: { defense: 100, critChance: 1 } } });
    expect((CHARACTERS.warden as unknown as { defense: number }).defense).toBe(100);
  });

  it("방어력·피해 감소·회피는 받는 피해를 줄이고, 흡혈·재생력은 회복", () => {
    const s = warden();
    const hp = s.player.hp;
    damagePlayer(s, 20);
    const plain = hp - s.player.hp;
    applyBalance({ characters: { warden: { defense: 100 } } });
    const t = warden();
    damagePlayer(t, 20);
    expect(hp - t.player.hp).toBeCloseTo(plain / 2, 0);
    applyBalance({ characters: { warden: { dodge: 0.9, regen: 100, lifesteal: 0.5 } } });
    const u = warden();
    u.player.hp = 10;
    for (let i = 0; i < 120; i++) stepSim(u, FIRE);
    expect(u.player.hp).toBeGreaterThan(10);
  });

  it("치명타 확률을 주면 치명타가 나고, 예리함은 출혈을 걺", () => {
    applyBalance({ characters: { warden: { critChance: 1, critDamage: 3, sharpness: 1 } } });
    const s = warden();
    for (let i = 0; i < 120; i++) stepSim(s, FIRE);
    expect(s.crits ?? 0).toBeGreaterThan(0);
    expect(s.enemies[0]!.bleedTicks ?? 0).toBeGreaterThan(0);
    expect(lost(s)).toBeGreaterThan(0);
  });
});
