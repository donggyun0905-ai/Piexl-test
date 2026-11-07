import { describe, expect, it } from "vitest";
import { MICHAELA as M } from "../weaponsMichaela";
import { MICHAELA_PERKS as K } from "../itemsMichaela";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { comboMul, hold, mcCooldown } from "./michaelaKit";
import { MC_MOVE_IDS } from "../michaelaWeaponMoves";
import { MC_SPEARS, MC_WEAPON_ELEM } from "../michaelaWeaponList";

/** 그 속성의 검 번호 */
const swordOf = (v: number) => MC_WEAPON_ELEM.findIndex((e, i) => i >= MC_SPEARS && e === v);

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

  it("무기마다 다른 3연격 (은적 대검: 내려찍기 → 휘두르기 → 땅 가르기)", () => {
    const s = michaela();
    hold(s.player, 21);
    hit(s);
    hit(s);
    hit(s);
    const moves = s.effects.filter((f) => f.kind === "mcMoveFx").map((f) => MC_MOVE_IDS[Math.floor((f.style ?? 0) / 64)]);
    expect(moves).toEqual(["slam", "sweep", "quake"]);
    expect(s.effects.some((f) => f.kind === "mcBlastFx")).toBe(false);
  });

  it("창 3연격 끝 던지기: 박히고 콤보 · 다른 종류 새 무기를 듦", () => {
    const s = michaela();
    hold(s.player, 0);
    hit(s);
    hit(s);
    hit(s);
    expect(s.player.mcCombo).toBe(1);
    expect(s.player.mcHeld).toBe(0);
    expect(s.player.mcBlades?.[0]?.w).toBe(0);
    expect(comboMul(s.player)).toBeCloseTo(1 + M.comboStep);
  });

  it("몸에 닿으면 바꿔 들고 그 무기 기술 둘이 연달아 (대검: 내려찍기 → 휘두르기)", () => {
    const s = michaela();
    s.player.mcBlades = [{ x: 100, y: 100, w: 21, k: 0 }];
    run(s, 1);
    expect(s.player.mcWeapon).toBe(21);
    expect(s.player.mcBlades.length).toBe(0);
    expect(s.player.mcCombo).toBe(1);
    run(s, M.touchGap + 1);
    const moves = s.effects.filter((f) => f.kind === "mcMoveFx").map((f) => MC_MOVE_IDS[Math.floor((f.style ?? 0) / 64)]);
    expect(moves).toEqual(["slam", "sweep"]);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("회오리는 이어서 더 침", () => {
    const s = michaela();
    hold(s.player, 7);
    hit(s);
    hit(s);
    hit(s);
    expect(s.player.mcQueue?.length).toBe(2);
  });

  it("대시하면 범위 안의 박힌 무기로 순간 이동해 바꿔 듦", () => {
    const s = michaela();
    s.player.mcBlades = [{ x: 200, y: 100, w: 21, k: 0 }];
    stepSim(s, { ...IDLE, dash: true, moveX: 1 });
    expect(s.player.x).toBe(200);
    expect(s.player.mcWeapon).toBe(21);
  });

  it("스킬: 무기 비 · 칼날 교대 · 일제 폭파 · 무한의 무기고", () => {
    const s = michaela();
    key(s, 1);
    run(s, M.stormDelay + 3 * M.stormN + 2);
    const n = (s.player.mcBlades ?? []).length;
    expect(n).toBeGreaterThan(0);
    const near = [...s.player.mcBlades!].sort((a, b) => Math.hypot(a.x - 100, a.y - 100) - Math.hypot(b.x - 100, b.y - 100))[0]!;
    key(s, 2);
    expect(s.player.x).toBe(near.x);
    s.player.mcQueue = [];
    const first = s.player.mcBlades![0]!;
    s.enemies[0]!.x = first.x;
    s.enemies[0]!.y = first.y;
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

  it("속성: 빙결은 느려짐 · 자전은 옆 적에게 번개 · 비취는 독", () => {
    const s = michaela();
    s.enemies[0]!.rootTicks = 0;
    hold(s.player, swordOf(1));
    hit(s);
    expect(s.enemies[0]!.slowTicks ?? 0).toBeGreaterThan(0);
    const t = michaela();
    t.enemies.push({ ...enemy(2, 170, 100, 99999), rootTicks: 99999 });
    hold(t.player, swordOf(5));
    hit(t);
    expect(t.effects.some((f) => f.kind === "mcBoltFx")).toBe(true);
    expect(t.enemies[1]!.hp).toBeLessThan(t.enemies[1]!.maxHp);
    const u = michaela();
    hold(u.player, MC_WEAPON_ELEM.indexOf(6));
    hit(u);
    expect(u.enemies[0]!.poisonTicks ?? 0).toBeGreaterThan(0);
  });

  it("박힌 무기를 바꿔 들면 그 속성을 듦", () => {
    const s = michaela();
    s.player.mcBlades = [{ x: 100, y: 100, w: swordOf(4), k: 0, v: 4 }];
    run(s, 1);
    expect(s.player.mcElem).toBe(4);
    expect(s.player.mcWeapon).toBe(swordOf(4));
  });

  it("인도자의 기도: 스킬 대기 감소", () => {
    const s = michaela("mcPrayer");
    expect(mcCooldown(s.player, 3)).toBe(Math.round(M.cooldowns[3]! * K.mcPrayer.cd));
  });
});
