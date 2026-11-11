import { describe, expect, it } from "vitest";
import type { CharacterId } from "../characters";
import { FACTION_CORE, FACTION_HEAT, FACTION_OATH, FACTION_TAINT, FACTION_TIDE } from "../factionDefs";
import { damageEnemy, damagePlayer, removeDead } from "./combat";
import { factionDmgMul, factionHit, factionHurt, factionTick, tideMul, traitOf } from "./faction";
import { beamHit } from "./laser";
import { medicHit } from "./medicWeapons";
import { factionGauge } from "./factionGauge";
import { foeNoAttack } from "./foeStatus";
import { createRun, type RunState } from "./index";
import { enemy } from "./perkTestUtil";

function start(c: CharacterId): RunState {
  const s = createRun(7, c);
  s.enemies = [];
  s.player.x = s.player.prevX = 100;
  s.player.y = s.player.prevY = 100;
  return s;
}
const hurt = (s: RunState) => {
  s.player.invulnTicks = 0;
  damagePlayer(s, 1);
};
function kill(s: RunState, n: number): void {
  for (let i = 0; i < n; i++) {
    const e = enemy(1000 + i, 300, 300, 1);
    s.enemies.push(e);
    e.hp = 0;
    removeDead(s);
  }
}

describe("진영 특징", () => {
  it("패왕전·대결에서는 꺼짐 · 소속 없는 캐릭터도 없음", () => {
    const s = start("thorken");
    expect(traitOf(s)).toBe("thalassia");
    s.pvp = {} as never;
    expect(traitOf(s)).toBeNull();
    expect(traitOf(start("blast"))).toBeNull();
  });

  it("탈라시아: 맞힌 틱마다 콤보 +1 (한 틱에 여럿은 1) → 물 피해 증가 · 맞으면 0", () => {
    const s = start("thorken");
    const e = enemy(1, 120, 100);
    s.enemies = [e];
    for (let i = 0; i < 25; i++) {
      s.tick += 6;
      factionHit(s, e);
      factionHit(s, e);
    }
    expect(s.player.fcCombo).toBe(25);
    expect(tideMul(s)).toBeCloseTo(1 + 2 * FACTION_TIDE.perStep);
    hurt(s);
    expect(s.player.fcCombo).toBeUndefined();
    expect(tideMul(s)).toBe(1);
  });

  it("탈라시아 매드퀸: 콤보가 높으면 맞힐 때 작은 물 피해가 같이", () => {
    const s = start("madQueen");
    const e = enemy(1, 120, 100);
    s.enemies = [e];
    s.player.fcCombo = FACTION_TIDE.splashFrom;
    s.tick += 6;
    factionHit(s, e);
    expect(e.hp).toBeLessThan(e.maxHp);
  });

  it("헬리오스: 처치마다 타락 +1 · 가득이면 폭주 · 맞으면 -1 · 피해 주고받기 증가", () => {
    const s = start("ninja");
    kill(s, 10);
    expect(s.player.fcTaint).toBe(10);
    expect(factionDmgMul(s)).toBeCloseTo(1 + 10 * FACTION_TAINT.dmg);
    hurt(s);
    expect(s.player.fcTaint).toBe(10 - FACTION_TAINT.hurtLoss);
    kill(s, FACTION_TAINT.max);
    expect(s.player.fcRampage).toBe(FACTION_TAINT.rampageTicks);
    for (let i = 0; i < FACTION_TAINT.rampageTicks; i++) factionTick(s);
    expect(s.player.fcRampage).toBeUndefined();
    expect(s.player.fcTaint).toBe(FACTION_TAINT.after);
  });

  it("헬리오스 학살자: 피의 학살 중에는 폭주를 미루고, 폭주 중에는 피의 학살을 미룸", () => {
    const s = start("slayer");
    s.player.slRage = 100;
    kill(s, FACTION_TAINT.max);
    expect(s.player.fcRampage).toBeUndefined();
    delete s.player.slRage;
    factionTick(s);
    expect(s.player.fcRampage).toBe(FACTION_TAINT.rampageTicks);
  });

  it("테라코어: 피해를 주거나 맞으면 에너지 · 저절로 안 빠짐 · 가득 차면 저절로 터짐", () => {
    const s = start("gunner");
    const e = enemy(1, 120, 100);
    s.enemies = [e];
    for (let i = 0; i < 10; i++) {
      s.tick += 6;
      factionHit(s, e);
    }
    expect(s.player.fcHeat).toBeCloseTo(10 * FACTION_HEAT.gain);
    factionHurt(s);
    expect(s.player.fcHeat).toBeCloseTo(10 * FACTION_HEAT.gain + FACTION_HEAT.hurtGain);
    expect(foeNoAttack(s.player)).toBe(false);
    factionTick(s);
    expect(e.hp).toBe(e.maxHp);
    s.player.fcHeat = FACTION_HEAT.max;
    factionTick(s);
    expect(s.player.fcHeat).toBe(0);
    expect(e.hp).toBeLessThan(e.maxHp);
  });

  it("테라코어: 의사·기계공학자도 공격하면 에너지가 쌓임", () => {
    for (const c of ["doctor", "engineer"] as const) {
      const s = start(c);
      const e = enemy(1, 120, 100);
      s.enemies = [e];
      s.tick += 6;
      if (c === "doctor") medicHit(s, e, 5);
      else beamHit(s, e, 5, 1);
      expect(s.player.fcHeat).toBeCloseTo(FACTION_HEAT.gain);
    }
  });

  it("아스칼론: 적이 있는 방에서 맹세 → 지키고 끝내면 영광 +1", () => {
    const s = start("warden");
    s.enemies = [enemy(1, 120, 100)];
    s.rooms[s.roomId]!.cleared = false;
    factionTick(s);
    const o = s.player.fcOath!;
    expect(o).toBeDefined();
    expect(o.intro).toBeGreaterThan(0);
    for (let i = 0; i < 200; i++) factionTick(s);
    expect(o.intro).toBe(0);
    o.kind = "swift";
    s.enemies = [];
    s.rooms[s.roomId]!.cleared = true;
    factionTick(s);
    expect(s.player.fcGlory).toBe(1);
    expect(factionDmgMul(s)).toBeCloseTo(1 + FACTION_OATH.gloryDmg);
    expect(factionGauge(s)?.oathState).toBe("kept");
  });

  it("아스칼론: 맹세를 어기면 그 방에서만 약해짐", () => {
    const s = start("warden");
    s.enemies = [enemy(1, 120, 100)];
    s.rooms[s.roomId]!.cleared = false;
    for (let i = 0; i < 200; i++) factionTick(s);
    s.player.fcOath!.kind = "unhit";
    for (let i = 0; i <= FACTION_OATH.hits; i++) hurt(s);
    expect(s.player.fcOath!.broken).toBe(true);
    expect(factionDmgMul(s)).toBeCloseTo(FACTION_OATH.brokenDmg);
  });

  it("성국: 스킬을 정한 횟수만큼 쓰면 핵심 스킬 각성 → 쓰면 피해 증가", () => {
    const s = start("beatrice");
    factionTick(s);
    for (let i = 0; i < FACTION_CORE.uses; i++) {
      s.player.btCd = [0, 0, 0, 0];
      factionTick(s);
      s.player.btCd = [99999, 0, 0, 0];
      factionTick(s);
    }
    expect(factionGauge(s)?.on).toBe(true);
    s.player.btCd = [0, 0, 0, 0];
    factionTick(s);
    s.player.btCd = [0, 0, 0, 99999];
    s.enemies = [enemy(1, 130, 100)];
    factionTick(s);
    expect(factionDmgMul(s)).toBeCloseTo(FACTION_CORE.dmg);
    // 한 번 쓰면 각성이 끝나고 다시 셈 · 추가 공격이 맞음
    expect(factionGauge(s)?.on).toBe(false);
    expect(s.player.fcUses).toBe(0);
    expect(s.enemies[0]!.hp).toBeLessThan(s.enemies[0]!.maxHp);
  });

  it("공용 피해 경로: 헬리오스 타락이 있으면 damageEnemy 피해가 늘어남", () => {
    const a = start("brawler");
    const b = start("brawler");
    b.player.fcTaint = FACTION_TAINT.max - 1;
    const ea = enemy(1, 120, 100);
    const eb = enemy(1, 120, 100);
    a.enemies = [ea];
    b.enemies = [eb];
    damageEnemy(a, ea, 10, 1, 0, false);
    damageEnemy(b, eb, 10, 1, 0, false);
    expect(eb.maxHp - eb.hp).toBeGreaterThan(ea.maxHp - ea.hp);
  });
});
