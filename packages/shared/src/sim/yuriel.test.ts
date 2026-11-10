import { describe, expect, it } from "vitest";
import { YURIEL as Y } from "../weaponsYuriel";
import { YURIEL_PERKS as K } from "../itemsYuriel";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import { yrCooldown, yrFoeTaken, yurielTaken } from "./yurielKit";

const IDLE = { ...FIRE, attack: false };

function yuriel(...perks: string[]): RunState {
  const s = createRun(5, "yuriel");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 100;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.yrRoom = `${s.floor}/${s.roomId}`;
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

describe("유리엘", () => {
  it("철퇴 둘 → 사슬 한 바퀴 (뒤쪽 적도 맞고 회복)", () => {
    const s = yuriel();
    s.enemies.push({ ...enemy(2, 70, 100, 99999), rootTicks: 99999 });
    s.player.hp = 50;
    hit(s);
    hit(s);
    expect(s.enemies[1]!.hp).toBe(s.enemies[1]!.maxHp);
    hit(s);
    expect(s.enemies[1]!.hp).toBeLessThan(s.enemies[1]!.maxHp);
    expect(s.player.hp).toBeGreaterThan(50);
    expect(s.effects.map((f) => f.kind)).toContain("yrSpinFx");
  });

  it("단죄가 가득 차면 정화의 빛 (0부터 다시)", () => {
    const s = yuriel();
    for (let i = 0; i < Y.sinMax - 1; i++) hit(s);
    expect(s.enemies[0]!.yrSin).toBe(Y.sinMax - 1);
    hit(s);
    expect(s.enemies[0]!.yrSin).toBe(0);
    expect(s.effects.some((f) => f.kind === "yrPurgeFx")).toBe(true);
  });

  it("스킬: 정화의 빛(회복) · 집행의 철퇴(기절) · 수호 결계 · 성녀의 단죄", () => {
    const s = yuriel();
    s.player.hp = 40;
    key(s, 1);
    expect(s.player.hp).toBeGreaterThan(40);
    expect(lost(s)).toBeGreaterThan(0);
    key(s, 2);
    run(s, Y.maceDelay + 1);
    expect(s.effects.some((f) => f.kind === "yrSlamFx")).toBe(true);
    key(s, 3);
    expect(s.player.yrWard).toBeTruthy();
    expect(yurielTaken(s.player, false)).toBe(Y.wardTaken);
    expect(yrFoeTaken(s, s.enemies[0]!)).toBeGreaterThan(1);
    const before = lost(s);
    key(s, 4);
    run(s, Y.ultDelay + 1);
    expect(lost(s) - before).toBeGreaterThan(s.player.stats.damage * Y.ultMul);
    expect(s.player.yrSaint).toBeGreaterThan(0);
  });

  it("결계 밖에서는 받는 피해 그대로", () => {
    const s = yuriel();
    expect(yurielTaken(s.player, false)).toBe(1);
  });

  it("경건한 기도·성수 수정구: 스킬 대기 감소", () => {
    const s = yuriel("yrPrayer", "yrOrb");
    expect(yrCooldown(s.player, 3)).toBe(Math.round(Y.cooldowns[3]! * K.yrPrayer.cd));
    expect(yrCooldown(s.player, 0)).toBe(Math.round(Y.cooldowns[0]! * K.yrOrb.cd * K.yrPrayer.cd));
  });
});
