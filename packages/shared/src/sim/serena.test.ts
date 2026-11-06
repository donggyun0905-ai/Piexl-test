import { describe, expect, it } from "vitest";
import { SERENA as N } from "../weaponsSerena";
import { SERENA_PERKS as K } from "../itemsSerena";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { critNow } from "./novice";
import { enemy, FIRE } from "./perkTestUtil";
import { orbCount, snCooldown, snOrbAt } from "./serenaKit";

const IDLE = { ...FIRE, attack: false };

function serena(...perks: string[]): RunState {
  const s = createRun(5, "serena");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.snRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 100, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = IDLE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
const key = (s: RunState, n: number) => stepSim(s, { ...IDLE, skill: n });
/** 기본 공격 한 번 (대기 없이) */
function hit(s: RunState): void {
  s.player.attackCooldown = 0;
  stepSim(s, FIRE);
}

describe("세레나", () => {
  it("기본 치명타 25% · 아이템으로 더함", () => {
    expect(critNow(serena()).chance).toBeCloseTo(N.critChance);
    const s = serena("snGrace", "snFatal");
    expect(critNow(s).chance).toBeCloseTo(N.critChance + K.snGrace.crit);
    expect(critNow(s).mul).toBeCloseTo(N.critMul + K.snFatal.critMul);
  });

  it("도는 사슬 채찍 둘이 가만히 있어도 둘레 적을 침 (빛 피해 · 가시)", () => {
    const s = serena();
    s.enemies[0]!.x = 60 + N.orbR;
    run(s, 240);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.enemies[0]!.snThorns ?? 0).toBeGreaterThan(0);
    expect(orbCount(s.player)).toBe(2);
  });

  it("사슬 자리는 시드·틱으로만 정해짐 (같은 틱 같은 자리)", () => {
    const a = serena();
    const b = serena();
    expect(snOrbAt(a.player, 123, 1)).toEqual(snOrbAt(b.player, 123, 1));
  });

  it("3연격: 채찍 둘 → 환혹의 회오리 여러 번", () => {
    const s = serena();
    for (let i = 0; i < 3; i++) hit(s);
    expect(s.effects.filter((f) => f.kind === "snWhipFx").length).toBe(2);
    let whirls = s.effects.filter((f) => f.kind === "snWhirlFx").length;
    for (let i = 0; i < N.whirlGap * (N.whirlN + 1); i++) {
      stepSim(s, IDLE);
      whirls += s.effects.filter((f) => f.kind === "snWhirlFx" && f.ticks === f.maxTicks - 1).length;
    }
    expect(whirls).toBe(N.whirlN);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("가시가 가득 차면 마비 (받는 피해 증가)", () => {
    const s = serena();
    for (let i = 0; i < 9; i++) hit(s);
    expect(s.enemies[0]!.snThorns).toBe(N.thornMax);
    expect(s.enemies[0]!.snNumb ?? 0).toBeGreaterThan(0);
  });

  it("스킬: 스텝(무적 돌진) · 매혹 · 맹독 비수(독) · 환혹의 무도(사슬 여섯)", () => {
    const s = serena();
    key(s, 1);
    expect(s.player.s2Rush).toBeTruthy();
    expect(s.player.snCd![0]).toBeGreaterThan(0);
    let dashes = 1;
    for (let i = 0; i < N.stepTicks * N.stepN + 5; i++) {
      stepSim(s, IDLE);
      dashes += s.effects.filter((f) => f.kind === "snDashFx" && f.ticks === f.maxTicks - 1).length;
    }
    expect(dashes).toBe(N.stepN);
    expect(s.player.s2Rush).toBeFalsy();
    s.player.x = s.player.prevX = 60;
    key(s, 2);
    expect(s.enemies[0]!.snCharm ?? 0).toBeGreaterThan(0);
    const gap = () => Math.hypot(s.enemies[0]!.x - s.player.x, s.enemies[0]!.y - s.player.y);
    const before = gap();
    run(s, 30);
    expect(gap()).toBeLessThan(before);
    s.player.x = 60;
    key(s, 3);
    expect(s.enemies[0]!.poisonTicks ?? 0).toBeGreaterThan(0);
    key(s, 4);
    expect(s.player.snUlt).toBeGreaterThan(0);
    expect(orbCount(s.player)).toBe(N.ultOrbN);
  });

  it("환혹의 무도 중 사슬은 꽃 테두리를 따라 돎 (반지름이 꽃잎 끝과 사이를 오감)", () => {
    const s = serena();
    s.player.snUlt = 100;
    const rs = Array.from({ length: 120 }, (_, t) => {
      const [x, y] = snOrbAt(s.player, t, 0);
      return Math.hypot(x - s.player.x, y - s.player.y);
    });
    expect(Math.max(...rs) / Math.min(...rs)).toBeGreaterThan(1.6);
  });

  it("뮤즈의 축복: 스킬 대기 감소", () => {
    const s = serena("snMuse");
    expect(snCooldown(s.player, 3)).toBe(Math.round(N.cooldowns[3]! * K.snMuse.cd));
  });
});
