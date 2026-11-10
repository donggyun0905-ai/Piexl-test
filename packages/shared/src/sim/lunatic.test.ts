import { describe, expect, it } from "vitest";
import { LUNATIC as L } from "../weaponsLunatic";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

function ln(x = 90, ...perks: string[]): RunState {
  const s = createRun(5, "lunatic");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.enemies = [{ ...enemy(1, x, 100, 99999), rootTicks: 99999 }];
  return s;
}
const foe = (s: RunState) => s.enemies[0]!;
const run = (s: RunState, n: number, input = FIRE) => {
  for (let i = 0; i < n; i++) stepSim(s, input);
};

describe("루나틱", () => {
  it("찌르기가 앞 적을 맞히고 앞으로 약간 돌진", () => {
    const s = ln(100);
    const hp = foe(s).hp;
    const x = s.player.x;
    stepSim(s, FIRE);
    expect(foe(s).hp).toBeLessThan(hp);
    expect(s.player.x).toBeGreaterThan(x);
  });

  it("공격이 매우 빠름 (1초에 세 번 넘게 찌름)", () => {
    const s = ln();
    run(s, 60);
    expect(s.player.attackCount).toBeGreaterThan(3);
  });

  it("달빛이 없어도 약점 공격이 터짐", () => {
    // 표적이 안 뜨게 해서 달빛 베기 없이: 달빛 스택은 0인데 약점(달빛 색 피해)이 기록됨
    const t = ln();
    stepSim(t, EMPTY_INPUT);
    t.player.lnMarkT = 99999;
    let weak = false;
    for (let i = 0; i < 300; i++) {
      stepSim(t, FIRE);
      weak ||= (foe(t).dotAmt?.moon ?? 0) > 0;
    }
    expect(foe(t).moon ?? 0).toBe(0);
    expect(weak).toBe(true);
  });

  it("월광 표적이 뜨고, 표적에 약점이 터지면 달빛 베기(달빛 스택)", () => {
    const s = ln();
    run(s, L.markFirst + 1, EMPTY_INPUT);
    expect(foe(s).lnMark ?? 0).toBeGreaterThan(0);
    let slashed = false;
    for (let i = 0; i < 400 && !slashed; i++) {
      foe(s).lnMark ||= L.markTicks; // 그냥 공격에 사라져도 다시 띄워 약점이 터질 때까지
      stepSim(s, FIRE);
      slashed = (foe(s).moon ?? 0) > 0 || s.effects.some((f) => f.kind === "lnSlashFx");
    }
    expect(slashed).toBe(true);
  });

  it("표적을 약점이 아닌 그냥 공격으로 맞히면 표적이 사라짐 (달빛 베기 없음)", () => {
    const s = ln();
    let gone = false;
    for (let i = 0; i < 200 && !gone; i++) {
      foe(s).lnMark = L.markTicks;
      const hp = foe(s).hp;
      stepSim(s, FIRE);
      const hit = foe(s).hp < hp;
      const weak = (foe(s).dotAmt?.moon ?? 0) > 0 && foe(s).dotTick === s.tick - 1;
      if (hit && !weak) {
        gone = !foe(s).lnMark;
        expect(s.player.lnStrikes?.some((b) => b.k === 0) ?? false).toBe(false);
      } else s.player.lnStrikes = undefined;
    }
    expect(gone).toBe(true);
  });

  it("대시하면 지나가는 길의 적을 찌름", () => {
    const s = ln(85);
    const hp = foe(s).hp;
    s.player.dashTicks = 8;
    run(s, 2, EMPTY_INPUT);
    expect(foe(s).hp).toBeLessThan(hp);
  });

  it("성흔이 가득 차면 만월 각성 (모든 적이 표적)", () => {
    const s = ln();
    s.player.sgGauge = 99.5;
    run(s, 10);
    expect(s.player.sgAwake ?? 0).toBeGreaterThan(0);
    let slashed = false;
    for (let i = 0; i < 200 && !slashed; i++) {
      stepSim(s, FIRE);
      slashed = s.effects.some((f) => f.kind === "lnSlashFx");
    }
    expect(slashed).toBe(true);
  });

  it("월광 검기(전용 아이템)는 멀리 있는 적도 꿰뚫음", () => {
    const s = ln(210, "lnWave");
    const hp = foe(s).hp;
    run(s, 40);
    expect(foe(s).hp).toBeLessThan(hp);
  });

  it("같은 시드면 결과가 같음", () => {
    const a = ln();
    const b = ln();
    run(a, 200);
    run(b, 200);
    expect(foe(a).hp).toBe(foe(b).hp);
  });
});
