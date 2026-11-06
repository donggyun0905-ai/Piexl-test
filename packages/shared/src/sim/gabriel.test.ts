import { describe, expect, it } from "vitest";
import { GABRIEL as G } from "../weaponsGabriel";
import { GABRIEL_PERKS as K } from "../itemsGabriel";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";
import { gbCooldown } from "./gabrielKit";

const IDLE = { ...FIRE, attack: false };

function gabriel(...perks: string[]): RunState {
  const s = createRun(5, "gabriel");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.gbRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 90, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
const key = (s: RunState, n: number) => stepSim(s, { ...IDLE, skill: n });
/** 기본 공격 한 번 (대기 없이) */
function hit(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}
/** 맞은 체력 (무적 없이 한 번) */
function hurt(s: RunState, dmg: number): number {
  s.player.invulnTicks = 0;
  const hp = s.player.hp;
  damagePlayer(s, dmg, "slime");
  return hp - s.player.hp;
}

describe("가브리엘", () => {
  it("3연격: 내려찍기 · 휘두르기 → 대지 강타(빛의 망치 · 압박)", () => {
    const s = gabriel();
    for (let i = 0; i < 3; i++) hit(s);
    expect(s.effects.filter((f) => f.kind === "gbSwing").length).toBe(2);
    expect(s.effects.some((f) => f.kind === "gbHammer")).toBe(true);
    expect(s.enemies[0]!.gbPress).toBeGreaterThan(0);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("철옹: 받는 피해가 줄고 강철 판갑이면 더 줄어듦", () => {
    const base = hurt(createRun(5, "warden"), 40);
    const g = hurt(gabriel(), 40);
    const plate = hurt(gabriel("gbPlate"), 40);
    expect(g).toBeLessThan(base);
    expect(plate).toBeLessThan(g);
  });

  it("중력 붕괴: 적을 끌어당기고 늦게 빛의 망치가 떨어짐", () => {
    const s = gabriel();
    const e = s.enemies[0]!;
    e.x = 60 + G.wellAt + 40;
    e.rootTicks = 0;
    key(s, 2);
    expect(e.x).toBeLessThan(60 + G.wellAt + 40);
    expect(lost(s)).toBe(0);
    run(s, G.wellDelay + 1, IDLE);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("성벽: 보호막 · 둘레 진동", () => {
    const s = gabriel();
    key(s, 3);
    expect(s.player.shieldPts ?? 0).toBeGreaterThanOrEqual(s.player.stats.maxHp * G.wallShield - 0.01);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("불멸의 성벽: 보호막 100 · 기본 공격마다 체력 비례 빛의 망치 · 끝나면 보호막이 천천히 줄어듦", () => {
    const s = gabriel();
    key(s, 4);
    expect(s.player.gbUlt).toBeGreaterThan(0);
    expect(s.player.shieldPts ?? 0).toBeGreaterThanOrEqual(G.ultShield);
    run(s, G.dropTicks + 2, IDLE);
    s.enemies[0]!.hp = s.enemies[0]!.maxHp;
    hit(s);
    expect(s.player.gbDrops?.length).toBe(1);
    const before = lost(s);
    run(s, G.dropTicks, IDLE);
    expect(lost(s) - before).toBeGreaterThanOrEqual(Math.floor(s.player.stats.maxHp * G.ultHpMul));
    run(s, G.ultTicks, IDLE);
    expect(s.player.gbUlt).toBeUndefined();
    const sh = s.player.shieldPts ?? 0;
    run(s, 60, IDLE);
    expect(s.player.shieldPts ?? 0).toBeLessThan(sh);
    expect(s.player.shieldPts ?? 0).toBeGreaterThan(sh - G.ultDecay * 61);
  });

  it("스킬 대기 · 굳은 신앙으로 줄어듦", () => {
    const s = gabriel("gbFaith");
    expect(gbCooldown(s.player, 3)).toBe(Math.round(G.cooldowns[3]! * K.gbFaith.cd));
  });

  it("같은 시드면 같은 결과", () => {
    const a = gabriel("gbAfter", "gbOrbit");
    const b = gabriel("gbAfter", "gbOrbit");
    for (const s of [a, b]) {
      key(s, 2);
      run(s, 120);
    }
    expect(lost(a)).toBe(lost(b));
  });
});
