import { describe, expect, it } from "vitest";
import { BEATRICE as B } from "../weaponsBeatrice";
import { BEATRICE_PERKS as K } from "../itemsBeatrice";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { damagePlayer, healPlayer } from "./combat";
import { enemy, FIRE } from "./perkTestUtil";
import { btRegen, fireCoef } from "./beatriceKit";

const IDLE = { ...FIRE, attack: false };

function bea(...perks: string[]): RunState {
  const s = createRun(5, "beatrice");
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 60;
  s.player.y = s.player.prevY = 100;
  s.player.faceX = 1;
  s.player.faceY = 0;
  s.player.btRoom = `${s.floor}/${s.roomId}`;
  s.enemies = [{ ...enemy(1, 100, 100, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
function run(s: RunState, n: number, input = FIRE): void {
  for (let i = 0; i < n; i++) stepSim(s, input);
}
/** 스킬 키 n (1~4) */
const key = (s: RunState, n: number) => stepSim(s, { ...IDLE, skill: n });
/** 적이 나를 때림 */
function hurt(s: RunState, n = 1): void {
  for (let i = 0; i < n; i++) {
    s.player.invulnTicks = 0;
    damagePlayer(s, 1, "slime");
  }
}

describe("베아트리스", () => {
  it("쌍검 3연격: 왼→오 · 오→왼 베기 → X자 터뜨림", () => {
    const s = bea();
    for (let i = 0; i < 3; i++) {
      s.player.attackCooldown = 0;
      stepSim(s, FIRE);
    }
    expect(s.effects.filter((f) => f.kind === "btSlash").map((f) => f.style)).toEqual([1, -1]);
    expect(s.effects.some((f) => f.kind === "btCross")).toBe(true);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("나를 때린 적에게 악이 쌓이고, 악마다 받는 피해가 늚 · 10이면 처단", () => {
    const s = bea();
    s.enemies[0]!.kind = "slime";
    hurt(s, 3);
    expect(s.enemies[0]!.btEvil).toBe(3);
    hurt(s, 7);
    expect(s.enemies[0]!.btEvil).toBe(0);
    expect(s.player.btExecs?.[0]?.left).toBe(B.execN);
    expect(s.player.btPurged).toBe(B.evilMax);
    const before = s.enemies[0]!.hp;
    run(s, B.execN * B.execGap + 2, IDLE);
    expect(s.effects.filter((f) => f.kind === "btExec").length).toBeGreaterThan(0);
    expect(s.enemies[0]!.hp).toBeLessThan(before);
  });

  it("1·2타 칼선이 겹쳐 X자 · 악이 쌓인 적을 쓰러뜨리면 그 악이 나에게 들어옴", () => {
    const s = bea();
    for (let i = 0; i < 2; i++) {
      s.player.attackCooldown = 0;
      stepSim(s, FIRE);
    }
    const [a, b] = s.effects.filter((f) => f.kind === "btSlash");
    // 두 칼선의 가운데가 같은 자리 (X자의 가운데)
    expect((a!.x + a!.toX!) / 2).toBeCloseTo((b!.x + b!.toX!) / 2, 3);
    expect((a!.y + a!.toY!) / 2).toBeCloseTo((b!.y + b!.toY!) / 2, 3);
    const e = s.enemies[0]!;
    e.kind = "slime";
    hurt(s, 4);
    e.hp = 0;
    stepSim(s, IDLE);
    expect(s.player.btPurged).toBe(4);
    expect(s.effects.some((f) => f.kind === "btSoul")).toBe(true);
  });

  it("처단으로 지운 악 100개면 심판 (방 전체)", () => {
    const s = bea();
    s.enemies[0]!.kind = "slime";
    s.enemies.push({ ...enemy(2, 260, 160, 99999), rootTicks: 99999 });
    s.player.btPurged = B.judgeAt - B.evilMax;
    hurt(s, 10);
    expect(s.player.btJudge).toBe(B.judgeWarn);
    const far = s.enemies[1]!.hp;
    run(s, B.judgeWarn + 1, IDLE);
    expect(s.enemies[1]!.hp).toBeLessThan(far);
    expect(s.player.btPurged).toBe(0);
  });

  it("체력이 적을수록 화염 계수(최대 200%)·재생력(최대 30)이 오름", () => {
    const s = bea();
    const full = fireCoef(s.player);
    expect(btRegen(s.player)).toBe(0);
    s.player.hp = 1;
    expect(fireCoef(s.player)).toBeGreaterThan(full);
    expect(fireCoef(s.player)).toBeLessThanOrEqual(B.fireMax);
    expect(btRegen(s.player)).toBeGreaterThan(B.regenMax * 0.95);
  });

  it("1 태양 검날: 공격이 빨라지고 화상(최대 5겹)", () => {
    const s = bea();
    key(s, 1);
    expect(s.player.btSolar).toBeGreaterThan(0);
    for (let i = 0; i < 12; i++) {
      s.player.attackCooldown = 0;
      stepSim(s, FIRE);
    }
    expect(s.enemies[0]!.btBurn).toBe(B.burnMax);
    expect(s.player.btCd?.[0]).toBeGreaterThan(0);
  });

  it("2 일식의 춤: 앞으로 돌진하며 베고, 다음 공격이 쌍검 2연속", () => {
    const s = bea();
    s.enemies[0]!.x = 120;
    const x0 = s.player.x;
    key(s, 2);
    run(s, B.danceTicks + 1, IDLE);
    expect(s.player.x).toBeGreaterThan(x0 + 60);
    expect(lost(s)).toBeGreaterThan(0);
    expect(s.player.btTwin).toBe(2);
    s.player.attackCooldown = 0;
    run(s, B.twinGap + 2);
    expect(s.effects.filter((f) => f.kind === "btTwin").length).toBe(2);
  });

  it("3 태양의 낙인: 검기가 꿰뚫고 맞은 적마다 악 +2", () => {
    const s = bea();
    s.enemies.push({ ...enemy(2, 160, 100, 99999), rootTicks: 99999 });
    key(s, 3);
    run(s, 30, IDLE);
    expect(s.enemies.map((e) => e.btEvil)).toEqual([2, 2]);
  });

  it("4 자애: 체력 1에서 줄지 않음 · 화염 계수 400% · 끝나면 10초 회복 불가", () => {
    const s = bea();
    key(s, 4);
    expect(s.player.hp).toBe(1);
    expect(fireCoef(s.player)).toBeCloseTo(B.fireUlt, 1);
    hurt(s, 5);
    expect(s.player.hp).toBe(1);
    healPlayer(s, 50);
    expect(s.player.hp).toBe(1);
    run(s, B.graceTicks, IDLE);
    expect(s.player.btGrace).toBeUndefined();
    expect(s.player.btNoHeal).toBeGreaterThan(0);
    healPlayer(s, 50);
    expect(s.player.hp).toBe(1);
    run(s, B.noHealTicks, IDLE);
    healPlayer(s, 50);
    expect(s.player.hp).toBeGreaterThan(1);
  });

  it("아이템: 무한한 자애·성국의 신속 대기 · 은총 회복 불가 짧게", () => {
    const s = bea("btMercy", "btSwift", "btGrace");
    key(s, 4);
    expect(s.player.btCd?.[3]).toBe(Math.round(K.btMercy.cd * K.btSwift.cd));
    run(s, B.graceTicks, IDLE);
    expect(s.player.btNoHeal).toBe(K.btGrace.ticks);
  });

  it("같은 시드면 같은 결과", () => {
    const a = bea("btGrudge");
    const b = bea("btGrudge");
    for (const s of [a, b]) {
      s.enemies[0]!.kind = "slime";
      key(s, 1);
      hurt(s, 6);
      run(s, 200);
    }
    expect(a.enemies[0]!.hp).toBe(b.enemies[0]!.hp);
  });
});
