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

  it("중력 붕괴: 나에게 끌어모으는 동안 보호막 유지 → 보호막을 터뜨려 보호막만큼 큰 피해", () => {
    const s = gabriel();
    const e = s.enemies[0]!;
    e.x = 60 + 90;
    e.rootTicks = 0;
    s.player.shieldPts = 40;
    s.player.invulnTicks = 99999;
    key(s, 2);
    run(s, G.wellTicks - 4, IDLE);
    expect(e.x).toBeLessThan(150);
    expect(s.player.shieldPts).toBe(40);
    expect(lost(s)).toBe(0);
    run(s, 6, IDLE);
    expect(s.player.shieldPts).toBe(0);
    expect(lost(s)).toBeGreaterThanOrEqual(40 * G.wellShieldMul);
    expect(s.effects.some((f) => f.kind === "gbBurst")).toBe(true);
  });

  it("성벽: 보호막은 쌓이지 않음 · 둘레 진동 · 미니 망치가 돌다가 보호막이 사라지면 같이 사라짐", () => {
    const s = gabriel();
    const amt = s.player.stats.maxHp * G.wallShield;
    key(s, 3);
    expect(s.player.shieldPts).toBeCloseTo(amt);
    expect(lost(s)).toBeGreaterThan(0);
    s.player.gbCd![2] = 0;
    key(s, 3);
    expect(s.player.shieldPts).toBeCloseTo(amt);
    expect(s.player.gbMini).toBeDefined();
    const e = s.enemies[0]!;
    e.hp = e.maxHp;
    e.x = s.player.x + G.miniR;
    e.y = s.player.y;
    s.player.invulnTicks = 99999;
    run(s, 80, IDLE);
    expect(e.hp).toBeLessThan(e.maxHp);
    s.player.shieldPts = 0;
    run(s, 1, IDLE);
    expect(s.player.gbMini).toBeUndefined();
  });

  it("불멸의 성벽 보호막도 쌓이지 않음 (성벽 뒤에 써도 100)", () => {
    const s = gabriel();
    key(s, 3);
    key(s, 4);
    expect(s.player.shieldPts).toBeCloseTo(G.ultShield);
    s.player.gbCd![2] = 0;
    key(s, 3);
    expect(s.player.shieldPts).toBeCloseTo(G.ultShield);
  });

  it("불멸의 성벽: 보호막 100 · 기본 공격마다 체력 비례 빛의 망치 휘두르기 · 끝나면 보호막이 천천히 줄어듦", () => {
    const s = gabriel();
    key(s, 4);
    expect(s.player.gbUlt).toBeGreaterThan(0);
    expect(s.player.shieldPts ?? 0).toBeGreaterThanOrEqual(G.ultShield);
    run(s, G.dropTicks + 2, IDLE);
    s.enemies[0]!.hp = s.enemies[0]!.maxHp;
    hit(s);
    expect(s.effects.some((f) => f.kind === "gbLightSwing")).toBe(true);
    expect(lost(s)).toBeGreaterThanOrEqual(Math.floor(s.player.stats.maxHp * G.ultHpMul));
    run(s, G.ultTicks, IDLE);
    expect(s.player.gbUlt).toBeUndefined();
    const sh = s.player.shieldPts ?? 0;
    run(s, 60, IDLE);
    expect(s.player.shieldPts ?? 0).toBeLessThan(sh);
    expect(s.player.shieldPts ?? 0).toBeGreaterThan(sh - G.ultDecay * 61);
  });

  it("공격력은 18에서 멈추고 넘는 만큼 최대 체력 · 맞아도 깜빡이는 무적이 거의 없음", () => {
    const s = gabriel();
    expect(s.player.stats.damage).toBe(G.damageCap);
    const hp = s.player.stats.maxHp;
    const t = gabriel("gbForge", "gbAegis");
    expect(t.player.stats.damage).toBe(G.damageCap);
    expect(t.player.stats.maxHp).toBe(hp + 2 * G.hpPerDamage);
    hurt(s, 10);
    expect(s.player.invulnTicks).toBeLessThanOrEqual(G.hurtTicks);
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
