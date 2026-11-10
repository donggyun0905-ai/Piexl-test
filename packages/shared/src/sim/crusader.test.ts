import { describe, expect, it } from "vitest";
import { CRUSADER as C } from "../weaponsCrusader";
import { CRUSADER_PERKS as K } from "../itemsCrusader";
import { STIGMA } from "../weaponsDawn";
import { damagePlayer } from "./combat";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function cr(x = 90, ...perks: string[]): RunState {
  const s = createRun(5, "crusader");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.enemies = [{ ...enemy(1, x, 100, 99999), rootTicks: 99999 }];
  return s;
}
const foe = (s: RunState, i = 0) => s.enemies[i]!;
const run = (s: RunState, n: number, input = FIRE) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};
/** 내려찍기 한 번 할 때까지 (들어 올리기 포함) */
function slam(s: RunState): void {
  const n = s.player.attackCount;
  for (let i = 0; i < 300 && s.player.attackCount === n; i++) stepSim(s, FIRE);
}

describe("크루세이더", () => {
  it("누르면 십자가를 들어 올린 뒤 앞 땅을 내리찍음 (들어 올리는 동안은 안 맞음)", () => {
    const s = cr();
    const hp = foe(s).hp;
    stepSim(s, FIRE);
    expect(s.player.crWind ?? 0).toBeGreaterThan(0);
    expect(foe(s).hp).toBe(hp);
    slam(s);
    expect(foe(s).hp).toBeLessThan(hp);
    expect(s.effects.some((e) => e.kind === "crSlamFx")).toBe(true);
  });

  it("버팀: 들어 올리는 동안 받는 피해가 줄고 느리게 걸음", () => {
    const a = cr(900);
    const b = cr(900);
    stepSim(b, FIRE);
    const ha = a.player.hp;
    const hb = b.player.hp;
    damagePlayer(a, 20);
    damagePlayer(b, 20);
    expect(hb - b.player.hp).toBeLessThan(ha - a.player.hp);
    const m = cr(900);
    const w = cr(900);
    stepSim(w, FIRE);
    run(m, 5, { ...EMPTY_INPUT, moveY: 100 });
    run(w, 5, { ...FIRE, moveY: 100 });
    expect(w.player.y - 100).toBeLessThan(m.player.y - 100);
  });

  it("십자 균열: 찍은 자리에서 앞·양옆으로 마디마다 차례로 갈라져 먼 적도 맞힘", () => {
    const fwd = cr(60 + C.slamFwd + C.segLen * 3);
    const side = cr(900);
    side.enemies.push({ ...enemy(2, 60 + C.slamFwd, 100 + C.segLen * 2, 99999), rootTicks: 99999 });
    const hp = foe(fwd).hp;
    slam(fwd);
    slam(side);
    expect(foe(fwd).hp).toBe(hp);
    run(fwd, C.segGap * C.armLong + 2, EMPTY_INPUT);
    run(side, C.segGap * C.armLong + 2, EMPTY_INPUT);
    expect(foe(fwd).hp).toBeLessThan(hp);
    expect(foe(side, 1).hp).toBeLessThan(99999);
    expect(fwd.effects.some((e) => e.kind === "crSpikeFx")).toBe(true);
  });

  it("사거리가 늘면 찍는 자리·균열도 더 멀리", () => {
    const far = 60 + C.slamFwd + C.segLen * (C.armLong + 1);
    const s = cr(far);
    const t = cr(far, ...Array<string>(7).fill("crRamWide"));
    slam(s);
    slam(t);
    run(s, 20, EMPTY_INPUT);
    run(t, 20, EMPTY_INPUT);
    expect(foe(s).hp).toBe(99999);
    expect(foe(t).hp).toBeLessThan(99999);
  });

  it("속죄의 무게: 맞으면 차고, 가득 차면 내려찍을 때 심판의 십자가가 떨어져 기절", () => {
    const s = cr();
    stepSim(s, EMPTY_INPUT);
    damagePlayer(s, 10);
    stepSim(s, EMPTY_INPUT);
    expect(s.player.crWeight ?? 0).toBeGreaterThan(0);
    const j = cr(60 + C.slamFwd + C.segLen);
    j.player.crWeight = C.weightMax;
    slam(j);
    expect(j.player.crZones?.some((z) => z.k === 2)).toBe(true);
    expect(j.player.crWeight ?? 0).toBeLessThan(C.weightMax);
    run(j, C.judgeFall + 2, EMPTY_INPUT);
    expect(j.effects.some((e) => e.kind === "crJudgeFx")).toBe(true);
    expect(foe(j).stunTicks ?? 0).toBeGreaterThan(0);
  });

  it("성벽 돌진: 앞 적을 밀고 가다 끝에서 들이받음 · 벽에 부딪히면 벽 충돌", () => {
    const s = cr(72);
    foe(s).rootTicks = 0;
    const x0 = foe(s).x;
    stepSim(s, { ...EMPTY_INPUT, moveX: 100, dash: true });
    run(s, 14, EMPTY_INPUT);
    expect(foe(s).x).toBeGreaterThan(x0 + 10);
    expect(foe(s).hp).toBeLessThan(99999);
    expect(s.effects.some((e) => e.kind === "crRamEndFx")).toBe(true);
    const w = cr(28);
    foe(w).rootTicks = 0;
    w.player.x = w.player.prevX = 40;
    stepSim(w, { ...EMPTY_INPUT, moveX: -100, dash: true });
    run(w, 14, EMPTY_INPUT);
    expect(w.effects.some((e) => e.kind === "crWallFx")).toBe(true);
  });

  it("성흔이 가득 차면 성십자가 강림: 받는 피해 감소 · 내려찍을 때마다 심판 · 걸으면 발걸음", () => {
    const s = cr();
    s.player.sgGauge = STIGMA.max - 1;
    slam(s);
    expect(s.player.sgAwake ?? 0).toBeGreaterThan(0);
    expect(s.effects.some((e) => e.kind === "crAwakeFx")).toBe(true);
    slam(s);
    expect(s.player.crZones?.some((z) => z.k === 2)).toBe(true);
    const n = s.effects.filter((e) => e.kind === "crStepFx").length;
    run(s, C.stepEvery * 2 + 2, { ...EMPTY_INPUT, moveY: 100 });
    expect(s.effects.filter((e) => e.kind === "crStepFx").length).toBeGreaterThan(n);
  });

  it("★ 성주 · 여진 · 가시 후광 · 돌진 낙인", () => {
    const p = cr(900, "crPillar");
    slam(p);
    run(p, 20, EMPTY_INPUT);
    expect(p.effects.some((e) => e.kind === "crPillarFx")).toBe(true);
    const a = cr(900, "crAfter");
    slam(a);
    run(a, K.crAfter.delay + 2, EMPTY_INPUT);
    expect(a.effects.some((e) => e.kind === "crAfterFx")).toBe(true);
    const h = cr(140, "crHalo");
    for (let i = 0; i < K.crHalo.every; i++) slam(h);
    expect(h.player.crHalo).toBeDefined();
    run(h, 120, EMPTY_INPUT);
    expect(h.player.crHalo).toBeUndefined();
    const r = cr(900, "crRamSlam");
    stepSim(r, { ...EMPTY_INPUT, moveX: 100, dash: true });
    run(r, 12, EMPTY_INPUT);
    expect(r.effects.some((e) => e.kind === "crSlamFx")).toBe(true);
  });

  it("★ 가시 면류관 · 성묘 · 십자가 비", () => {
    const t = cr(70, "crThorn");
    stepSim(t, FIRE);
    damagePlayer(t, 10);
    expect(t.effects.some((e) => e.kind === "crThornFx")).toBe(true);
    const g = cr(60 + C.slamFwd + C.segLen, "crGrave");
    g.player.crWeight = C.weightMax;
    slam(g);
    run(g, C.judgeFall + 2, EMPTY_INPUT);
    expect(g.player.crZones?.some((z) => z.k === 1)).toBe(true);
    const r = cr(120, "crRain");
    r.player.sgAwake = r.player.sgAwakeMax = 600;
    run(r, K.crRain.every + 2, EMPTY_INPUT);
    expect(r.player.crZones?.some((z) => z.k === 3)).toBe(true);
  });

  it("전용 아이템 20개를 모두 들고 오래 싸워도 문제없음 (각성·돌진 포함)", async () => {
    const { CRUSADER_PASSIVES } = await import("../itemsCrusader");
    const s = cr(90, ...Object.keys(CRUSADER_PASSIVES));
    s.enemies.push({ ...enemy(2, 120, 130, 400) }, { ...enemy(3, 30, 80, 400) });
    for (let i = 0; i < 900; i++) stepSim(s, i % 120 === 60 ? { ...FIRE, moveX: 100, dash: true } : FIRE);
    expect(s.player.attackCount).toBeGreaterThan(8);
    expect(Number.isFinite(s.player.x) && Number.isFinite(s.player.y)).toBe(true);
  });

  it("다시 시작하면 상태가 지워짐", async () => {
    const { resetCrusader } = await import("./crusader");
    const s = cr();
    run(s, 60);
    resetCrusader(s.player);
    expect(s.player.crWind).toBeUndefined();
    expect(s.player.crCracks).toBeUndefined();
  });
});
