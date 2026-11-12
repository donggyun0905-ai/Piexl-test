import { describe, expect, it } from "vitest";
import { SHADOW_INK as SD } from "../weaponsShadowing";
import { SHADOWING_PASSIVES, SHADOWING_PERKS as K } from "../itemsShadowing";
import { createRun, EMPTY_INPUT, stepSim, type RunState, type TickInput } from "./index";
import { recalcStats } from "./items";
import { classTaken } from "./classTaken";
import { cornersOf, shapeOf } from "./shadowingShape";
import { enemy } from "./perkTestUtil";

/** 쉐도잉 (80, 100) · 적은 묶어 둠 */
function sd(foes: [number, number][] = [[140, 100]], ...perks: string[]): RunState {
  const s = createRun(7, "shadowing");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 80;
  s.player.y = s.player.prevY = 100;
  s.enemies = foes.map(([x, y], i) => ({ ...enemy(i + 1, x, y, 99999), rootTicks: 99999 }));
  return s;
}
/** 붓 끝을 (x, y)에 두고 누름 */
const at = (s: RunState, x: number, y: number, attack = true): TickInput => ({ ...EMPTY_INPUT, attack, aimX: Math.round(((x - s.player.x) / 12) * 100), aimY: Math.round(((y - s.player.y) / 12) * 100) });
const drawLine = (s: RunState, x1: number, y1: number, x2: number, y2: number, n = 12) => {
  for (let i = 0; i <= n; i++) stepSim(s, at(s, x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n));
};
/** 둘레 24점으로 원 (처음 자리로 돌아옴) · 원 = 가로·세로 같은 비율 (삼각함수 대신 고정 표) */
const RING: [number, number][] = Array.from({ length: 25 }, (_, i) => [Math.cos((i / 24) * Math.PI * 2), Math.sin((i / 24) * Math.PI * 2)]);
const drawCircle = (s: RunState, cx: number, cy: number, r: number) => {
  for (const [c, sn] of RING) stepSim(s, at(s, cx + c * r, cy + sn * r));
};
const release = (s: RunState, n = 1) => {
  for (let i = 0; i < n; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 100 });
};
const strokes = (s: RunState) => s.player.sdStrokes ?? [];

describe("쉐도잉", () => {
  it("누르는 동안 붓 끝을 따라 획이 그려지고 잉크가 닳음 · 획에 닿은 적은 피해", () => {
    const s = sd([[140, 120]]);
    const hp = s.enemies[0]!.hp;
    drawLine(s, 140, 80, 140, 160);
    expect(strokes(s).length).toBe(1);
    expect(strokes(s)[0]!.pts.length).toBeGreaterThan(8);
    expect(s.player.sdInk!).toBeLessThan(SD.ink);
    expect(s.enemies[0]!.hp).toBeLessThan(hp);
  });

  it("손을 떼면 획을 다 그림 · 시간이 지나면 사라짐 · 쉬면 잉크가 다시 참", () => {
    const s = sd([]);
    drawLine(s, 120, 60, 170, 130);
    release(s);
    expect(strokes(s)[0]!.end).toBeGreaterThan(s.tick);
    release(s, SD.life + SD.refillDelay + 200);
    expect(strokes(s).length).toBe(0);
    expect(s.player.sdInk).toBe(SD.ink);
  });

  it("곧은 줄 = 일필 베기 (줄 위 적이 크게 맞음)", () => {
    const s = sd([[140, 100]]);
    const hp = s.enemies[0]!.hp;
    drawLine(s, 110, 100, 190, 100);
    const touch = hp - s.enemies[0]!.hp;
    release(s);
    expect(strokes(s)[0]!.shape).toBe(2);
    expect(hp - s.enemies[0]!.hp - touch).toBeGreaterThanOrEqual(s.player.stats.damage * SD.slashMul - 0.01);
  });

  it("닫힌 원 = 봉인 (안의 적이 크게 맞고 묶임)", () => {
    const s = sd([[150, 100]]);
    drawCircle(s, 150, 100, 30);
    const before = s.enemies[0]!.hp;
    release(s);
    expect(strokes(s)[0]!.shape).toBe(1);
    expect(before - s.enemies[0]!.hp).toBeGreaterThanOrEqual(s.player.stats.damage * SD.sealMul - 0.01);
    expect(s.enemies[0]!.stunTicks).toBeGreaterThan(0);
  });

  it("모양 판정: 원·줄·꺾인 자리", () => {
    expect(shapeOf([0, 0, 30, 0, 60, 0, 90, 0])).toBe(2);
    expect(shapeOf([0, 0, 40, 0, 40, 40, 0, 40, 0, 2])).toBe(1);
    expect(shapeOf([0, 0, 30, 30, 60, 0])).toBe(0);
    expect(cornersOf([0, 0, 10, 0, 20, 0, 30, 0, 30, 10, 30, 20, 30, 30], 0.3, 6).length).toBe(1);
  });

  it("방이 바뀌면 획을 모두 지움", () => {
    const s = sd([]);
    drawLine(s, 120, 60, 170, 130);
    release(s);
    s.roomId += 1;
    release(s);
    expect(strokes(s).length).toBe(0);
  });

  it("전용 패시브 20개 · 모두 새 기술과 능력치", () => {
    const ids = Object.keys(SHADOWING_PASSIVES);
    expect(ids.length).toBe(20);
    for (const id of ids) expect(SHADOWING_PASSIVES[id as keyof typeof SHADOWING_PASSIVES].mods.length).toBeGreaterThan(0);
  });

  it("봉인 기술: 수묵 산수화·연꽃·소용돌이는 바닥 자리 · 황금 문은 안에 있으면 받는 피해 감소", () => {
    const s = sd([[120, 100]], "sdScroll", "sdLotus", "sdVortex", "sdGate");
    drawCircle(s, 90, 100, 40);
    release(s);
    expect((s.player.sdZones ?? []).length).toBe(3);
    expect(classTaken(s, 10)).toBeCloseTo(10 * K.sdGate.taken);
  });

  it("획을 마치면 학 · 다섯째마다 달 · 긴 획은 용", () => {
    const s = sd([[200, 40]], "sdCrane", "sdMoon", "sdDragon");
    drawLine(s, 110, 60, 200, 60, 30);
    drawLine(s, 200, 60, 110, 160, 40);
    drawLine(s, 110, 160, 200, 160, 30);
    release(s);
    const rows = (s.player.sdSpirits ?? []).map((x) => x.row);
    expect(rows).toContain(3);
    expect(rows).toContain(19);
    for (let i = 0; i < 4; i++) {
      release(s, 80);
      drawLine(s, 120, 140, 130, 150, 2);
      release(s);
    }
    expect((s.player.sdZones ?? []).some((z) => z.row === 9)).toBe(true);
  });

  it("피해 출처: 패시브가 그린 그림(학·용)이 나중에 준 피해는 '그림 소환'이 아니라 그 패시브 것", () => {
    const s = sd([[200, 40]], "sdCrane", "sdDragon");
    drawLine(s, 110, 60, 200, 60, 30);
    drawLine(s, 200, 60, 110, 160, 40);
    drawLine(s, 110, 160, 200, 160, 30);
    release(s);
    expect((s.player.sdSpirits ?? []).every((x) => (x as { dsrc?: string }).dsrc)).toBe(true);
    release(s, 200);
    const by = s.player.dmgBy ?? {};
    expect((by.sdCrane ?? 0) + (by.sdDragon ?? 0)).toBeGreaterThan(0);
    expect(by["f:shadowingSpirits"] ?? 0).toBe(0);
  });

  it("날개: 대시한 길을 따라 잉크 없이 획", () => {
    const s = sd([], "sdWings");
    for (let i = 0; i < 10; i++) stepSim(s, { ...EMPTY_INPUT, moveX: 100, dash: i === 0 });
    expect(strokes(s).some((k) => k.wing && k.pts.length >= 4)).toBe(true);
    expect(s.player.sdInk ?? SD.ink).toBe(SD.ink);
  });

  it("자동 조준: 붓이 가까운 적 둘레를 한 바퀴 돌아 봉인 · 누르고 있어도 쉬는 동안 잉크가 참", () => {
    const s = sd([[140, 100]]);
    let sealed = false;
    for (let i = 0; i < 240; i++) {
      stepSim(s, { ...EMPTY_INPUT, autoAim: true });
      sealed ||= strokes(s).some((k) => k.shape === 1);
    }
    expect(sealed).toBe(true);
    expect(s.player.sdDone ?? 0).toBeGreaterThan(1);
  });

  it("같은 입력이면 같은 결과 (모든 패시브)", () => {
    const go = () => {
      const s = sd([[140, 100], [170, 130], [100, 150]], ...Object.keys(SHADOWING_PASSIVES));
      drawCircle(s, 150, 110, 45);
      release(s, 3);
      drawLine(s, 100, 60, 200, 60);
      release(s, 3);
      for (let i = 0; i < 6; i++) stepSim(s, { ...EMPTY_INPUT, moveX: 100, dash: i === 0 });
      release(s, 240);
      return s.enemies.map((e) => e.hp).join(",") + "|" + s.player.hp;
    };
    expect(go()).toBe(go());
  });
});
