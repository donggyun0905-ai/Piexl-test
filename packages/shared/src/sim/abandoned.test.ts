import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponDef, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { ABANDONED, ABANDONED_WEAPONS, TAG_SETS } from "../weaponsAbandoned";
import { stageTokens } from "./abandoned";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { weaponPool } from "./loot";
import { enemy } from "./perkTestUtil";

/** 버려진 자들로 시작해 오른쪽에 허수아비 하나 */
function kids(weapon: WeaponId = "streetKids", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "abandoned");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 100;
  s.enemies = [{ ...enemy(1, 140, 100, 99999), kind: "dummy" as const, anchor: [140, 100] }];
  return s;
}
const AIM = { ...EMPTY_INPUT, aimX: 100, aimY: 0 };
/** 공격 한 번 (쉬는 틱을 기다렸다가) */
function hit(s: RunState): void {
  for (let i = 0; i < 200 && s.player.attackCooldown > 0; i++) stepSim(s, AIM);
  stepSim(s, { ...AIM, attack: true });
}
/** 탭 한 번 */
function tag(s: RunState): void {
  for (let i = 0; i < 200 && (s.player.dashCooldown > 0 || s.player.dashTicks > 0); i++) stepSim(s, AIM);
  stepSim(s, { ...AIM, dash: true });
  // 아이와 자리를 바꿨으니 허수아비 왼쪽으로 되돌림
  s.player.x = s.player.prevX = 120;
  s.player.y = s.player.prevY = 100;
}
/** 이 무기의 단계 순서대로 (특수기가 나오면 true) */
function playStage(s: RunState, stage: number): boolean {
  let fired = false;
  for (const t of stageTokens(TAG_SETS[(WEAPONS[s.player.weaponId] as WeaponDef).tag!]!, stage)) {
    if (t < 0) tag(s);
    else hit(s);
    fired ||= !!s.player.abShow;
  }
  return fired;
}

describe("버려진 자들", () => {
  it("전용 무기 10개만 얻고, 골목 삼남매로 시작", () => {
    expect(CHARACTERS.abandoned.startWeapon).toBe("streetKids");
    const all = weaponPool(kids(), true);
    expect(all).toHaveLength(9);
    for (const id of all) expect(WEAPONS[id]).toMatchObject({ exclusive: "abandoned", kind: "tag" });
  });

  it("무기마다 조합은 단계 3개, 단계마다 셋 다 한 번 이상, 합치면 각자의 콤보 길이 (끊김 없이 이어짐)", () => {
    for (const id of Object.keys(ABANDONED_WEAPONS)) {
      const set = TAG_SETS[(WEAPONS[id as WeaponId] as WeaponDef).tag!]!;
      for (let m = 0; m < 3; m++) {
        expect(set.stages.every((st) => st[m]! >= 1), `${id} P${m + 1}`).toBe(true);
        expect(set.stages.reduce((sum, st) => sum + st[m]!, 0), `${id} P${m + 1}`).toBe(set.moves[m]!.length);
      }
    }
  });

  it("탭: 다음 아이로 교대 · 0.5초 무적 · 아이마다 콤보 순번을 기억", () => {
    const s = kids();
    hit(s);
    expect(s.player.abStep).toEqual([1, 0, 0]);
    tag(s);
    expect(s.player.abM).toBe(1);
    expect(s.player.invulnTicks).toBeGreaterThanOrEqual(ABANDONED.tagInvuln - 2);
    hit(s);
    hit(s);
    tag(s);
    hit(s);
    tag(s);
    expect(s.player.abM).toBe(0);
    expect(s.player.abStage).toBe(1);
    hit(s);
    expect(s.player.abStep![0]).toBe(2);
  });

  it("조합대로 하면 단계마다 특수기 (P3 차례 끝에 곁의 P1·P2가 연출 공격), 세 단계를 돌면 처음으로", () => {
    const s = kids();
    for (let round = 0; round < 2; round++) {
      for (let st = 0; st < 3; st++) {
        if (round > 0 || st > 0) tag(s);
        const before = s.enemies[0]!.hp;
        expect(playStage(s, st), `round ${round} stage ${st}`).toBe(true);
        expect(s.player.abKids!.map((k) => k.m).sort()).toEqual([0, 1]);
        for (let i = 0; i < 80 && s.player.abShow; i++) stepSim(s, AIM);
        expect(s.player.abShow).toBeUndefined();
        expect(before - s.enemies[0]!.hp).toBeGreaterThan(s.player.stats.damage * 2);
      }
    }
    expect(s.player.abStep).toEqual([0, 0, 0]);
  });

  it("무기마다 특수기 세 가지가 모두 끝까지 나감", () => {
    for (const id of Object.keys(ABANDONED_WEAPONS) as WeaponId[]) {
      const s = kids(id);
      for (let st = 0; st < 3; st++) {
        if (st > 0) tag(s);
        expect(playStage(s, st), `${id} ${st}`).toBe(true);
        for (let i = 0; i < 80 && s.player.abShow; i++) stepSim(s, AIM);
        expect(s.player.abShow, `${id} ${st}`).toBeUndefined();
      }
    }
  });

  it("순서를 틀리면 조합·콤보가 모두 처음으로, P1로 강제 교대 (무적 없음) · 다시 하면 특수기", () => {
    const s = kids();
    hit(s);
    tag(s);
    hit(s);
    expect(s.player.abM).toBe(1);
    for (let i = 0; i < 60; i++) stepSim(s, AIM);
    s.player.invulnTicks = 0;
    tag(s);
    expect(s.player.abM).toBe(0);
    expect(s.player.abStage).toBe(0);
    expect(s.player.abPos).toBe(0);
    expect(s.player.abStep).toEqual([0, 0, 0]);
    expect(s.player.abMiss).toBeGreaterThan(0);
    expect(s.player.invulnTicks).toBe(0);
    // 처음 차례에 탭해도 틀림 (그대로 P1)
    tag(s);
    expect(s.player.abM).toBe(0);
    expect(s.player.invulnTicks).toBe(0);
    expect(playStage(s, 0)).toBe(true);
  });

  it("나와 있지 않은 두 아이도 곁에서 따로 싸우고(총은 쏨), 탭하면 내 자리는 그대로 들어온 아이가 서고 나간 아이는 그 아이 자리로", () => {
    const s = kids();
    for (let i = 0; i < 240; i++) stepSim(s, AIM);
    expect(s.enemies[0]!.maxHp - s.enemies[0]!.hp).toBeGreaterThan(0);
    const gun = s.player.abKids!.find((k) => k.m === 1)!;
    expect(gun).toBeDefined();
    hit(s);
    const at = { x: gun.x, y: gun.y };
    const me = { x: s.player.x, y: s.player.y };
    stepSim(s, { ...AIM, dash: true });
    expect(s.player.abM).toBe(1);
    expect(Math.hypot(s.player.x - me.x, s.player.y - me.y)).toBeLessThan(3);
    const out = s.player.abKids!.find((k) => k.m === 0)!;
    expect(Math.hypot(out.x - at.x, out.y - at.y)).toBeLessThan(4);
  });

  it("총 아이가 나와 있으면 자동 공격이 멀리서도 (총알 거리)", () => {
    const s = kids();
    s.player.abM = 1;
    s.enemies[0]!.x = s.player.x + s.player.stats.range * 2;
    s.enemies[0]!.y = s.player.y;
    let shot = false;
    for (let i = 0; i < 60; i++) {
      stepSim(s, { ...EMPTY_INPUT, autoAim: true });
      if (s.player.attackCooldown > 0) shot = true;
    }
    expect(shot).toBe(true);
  });

  it("공격 속도는 아이템으로 오르지 않음", () => {
    const fast = kids("streetKids", "lightGloves", "lightGloves");
    hit(fast);
    expect(fast.player.attackCooldown).toBeGreaterThanOrEqual(Math.round(60 / WEAPONS.streetKids.attackSpeed) - 1);
  });

  it("탭을 누를 수 없는 공격자(타워 등)는 조합대로 스스로 교대해 특수기까지", () => {
    const s = kids();
    s.player.abAuto = true;
    let specials = 0;
    for (let i = 0; i < 1200; i++) {
      stepSim(s, { ...AIM, attack: true });
      if (s.player.abShow?.t === 1) specials++;
    }
    expect(specials).toBeGreaterThanOrEqual(3);
  });

  it("같은 시드·입력이면 같은 결과", () => {
    const go = () => {
      const s = kids("lastPromise");
      for (let i = 0; i < 600; i++) stepSim(s, { ...AIM, attack: true, dash: i % 40 === 0 });
      return JSON.stringify(s);
    };
    expect(go()).toBe(go());
  });
});
