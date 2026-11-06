import { describe, expect, it } from "vitest";
import { MICHAELA as M } from "../weaponsMichaela";
import { MICHAELA_PERKS as K } from "../itemsMichaela";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { comboMul, mcCooldown } from "./michaelaKit";

const IDLE = { ...FIRE, attack: false };

function michaela(...perks: string[]): RunState {
  const s = createRun(5, "michaela");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 100;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.mcRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 130, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = IDLE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
const key = (s: RunState, n: number) => stepSim(s, { ...IDLE, skill: n });
function hit(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}

describe("미카엘라", () => {
  it("방에 들어서면 무기가 쏟아져 박힘", () => {
    const s = michaela();
    delete s.player.mcRoom;
    run(s, 60);
    expect((s.player.mcBlades ?? []).length).toBeGreaterThan(0);
  });

  it("베기 둘 → 투척: 박혀 폭발 · 콤보 · 다른 무기를 듦", () => {
    const s = michaela();
    hit(s);
    hit(s);
    expect(s.player.mcCombo ?? 0).toBe(0);
    hit(s);
    expect(s.player.mcCombo).toBe(1);
    expect(s.player.mcHeld).toBe(1);
    expect(s.player.mcBlades?.length).toBe(1);
    expect(s.effects.some((f) => f.kind === "mcBlastFx")).toBe(true);
    expect(comboMul(s.player)).toBeCloseTo(1 + M.comboStep);
  });

  it("몸에 닿으면 바꿔 듦 (콤보 · 폭발)", () => {
    const s = michaela();
    s.player.mcBlades = [{ x: 100, y: 100, k: 1 }];
    run(s, 1);
    expect(s.player.mcHeld).toBe(1);
    expect(s.player.mcBlades.length).toBe(0);
    expect(s.player.mcCombo).toBe(1);
  });

  it("폭발 둘레의 박힌 무기가 연달아 터짐", () => {
    const s = michaela();
    s.player.mcBlades = [{ x: 160, y: 100, k: 0 }];
    hit(s);
    hit(s);
    hit(s);
    run(s, M.chainDelay + 1);
    expect(s.effects.filter((f) => f.kind === "mcBlastFx" && f.dirX === 1).length).toBeGreaterThan(0);
  });

  it("대시하면 범위 안의 박힌 무기로 순간 이동해 바꿔 듦", () => {
    const s = michaela();
    s.player.mcBlades = [{ x: 200, y: 100, k: 1 }];
    stepSim(s, { ...IDLE, dash: true, moveX: 1 });
    expect(s.player.x).toBe(200);
    expect(s.player.mcHeld).toBe(1);
  });

  it("스킬: 무기 비 · 칼날 교대 · 일제 폭파 · 무한의 무기고", () => {
    const s = michaela();
    key(s, 1);
    run(s, M.stormDelay + 3 * M.stormN + 2);
    const n = (s.player.mcBlades ?? []).length;
    expect(n).toBeGreaterThan(0);
    key(s, 2);
    expect((s.player.mcBlades ?? []).length).toBe(n - 1);
    const before = lost(s);
    key(s, 3);
    expect(s.player.mcBlades).toBeUndefined();
    run(s, 4 * n + 4);
    expect(lost(s)).toBeGreaterThan(before);
    key(s, 4);
    expect(s.player.mcUlt).toBeGreaterThan(0);
    const b2 = lost(s);
    run(s, 60);
    expect(lost(s)).toBeGreaterThan(b2);
  });

  it("인도자의 기도: 스킬 대기 감소", () => {
    const s = michaela("mcPrayer");
    expect(mcCooldown(s.player, 3)).toBe(Math.round(M.cooldowns[3]! * K.mcPrayer.cd));
  });
});
