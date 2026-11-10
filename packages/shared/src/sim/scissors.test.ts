import { describe, expect, it } from "vitest";
import { SCISSORS as X } from "../weaponsScissors";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";

const IDLE = { ...FIRE, attack: false };

function scissors(...perks: string[]): RunState {
  const s = createRun(5, "scissors");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.sxRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 90, 100, 99999), rootTicks: 99999 }];
  return s;
}
/** 가위질 한 번 (대기 없이 · 적 자리 그대로) */
function snip(s: RunState): void {
  s.player.attackCooldown = 0;
  for (const e of s.enemies) e.x = 90;
  stepSim(s, FIRE);
}
const foe = (s: RunState) => s.enemies[0]!;

describe("시저스", () => {
  it("열기 → 닫기 두 박자 · 닫기에 맞은 적에게 운명의 실", () => {
    const s = scissors();
    snip(s);
    expect(s.player.sxThreads).toBeUndefined();
    snip(s);
    expect(s.player.sxThreads?.map((t) => t.id)).toEqual([1]);
    expect(s.player.sxStep).toBe(0);
  });

  it("대시하면 실을 끊어 벰 · 멀수록(팽팽할수록) 셈", () => {
    const hurt = (far: number) => {
      const s = scissors();
      s.player.sxThreads = [{ id: 1, t: 999 }];
      foe(s).x = 60 + far;
      const hp = foe(s).hp;
      stepSim(s, { ...IDLE, dash: true, moveX: -1 });
      expect(s.player.sxThreads).toBeUndefined();
      return hp - foe(s).hp;
    };
    const near = hurt(40);
    const far = hurt(200);
    expect(near).toBeGreaterThan(0);
    expect(far).toBeGreaterThan(near * 2);
  });

  it("끊기는 실이 지나는 다른 적도 벰", () => {
    const s = scissors();
    s.enemies.push({ ...enemy(2, 130, 100, 99999), rootTicks: 99999 });
    foe(s).x = 220;
    s.player.sxThreads = [{ id: 1, t: 999 }];
    const hp = s.enemies[1]!.hp;
    stepSim(s, { ...IDLE, dash: true, moveX: -1 });
    expect(s.enemies[1]!.hp).toBeLessThan(hp);
  });

  it("단죄: 체력이 적은 보통 적은 목을 잘라 바로 처치", () => {
    const s = scissors();
    foe(s).hp = foe(s).maxHp * (X.execAt - 0.01);
    snip(s);
    // 쓰러진 적은 방에서 빠짐
    expect(s.enemies.filter((e) => e.hp > 0)).toHaveLength(0);
  });

  it("맞힐수록 성흔이 차고 가득 차면 달빛 각성 · 각성 중에는 실을 저절로 끊음", () => {
    const s = scissors();
    for (let i = 0; i < 80 && !(s.player.sgAwake ?? 0); i++) snip(s);
    expect(s.player.sgAwake ?? 0).toBeGreaterThan(0);
    s.player.sxThreads = [{ id: 1, t: 999 }];
    for (let i = 0; i < X.awakeSnip + 2; i++) stepSim(s, IDLE);
    expect(s.player.sxThreads).toBeUndefined();
  });
});
