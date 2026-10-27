import { describe, expect, it } from "vitest";
import { CHARACTERS } from "../characters";
import { FORGOTTEN_PERKS as K } from "../itemsForgotten";
import { FORGOTTEN as F } from "../weaponsForgotten";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { enemy, FIRE } from "./perkTestUtil";
import type { WeaponId } from "../content";

function forgotten(weapon: WeaponId = "fgGrace", ...perks: string[]): RunState {
  const s = createRun(5, "forgotten");
  s.player.weaponId = weapon;
  s.player.passives.push(...(perks as never[]));
  recalcStats(s);
  s.player.x = s.player.prevX = 50;
  s.player.y = s.player.prevY = 72;
  s.enemies = [{ ...enemy(1, 80, 72, 99999), rootTicks: 99999 }];
  return s;
}
const lost = (s: RunState) => s.enemies.reduce((sum, e) => sum + e.maxHp - e.hp, 0);
const IDLE = { ...FIRE, attack: false };

describe("잊혀진 자", () => {
  it("기본: 재생력 20 · 회피 20% · 빠름", () => {
    expect(CHARACTERS.forgotten).toMatchObject({ regen: 20, dodge: 0.2 });
    expect(CHARACTERS.forgotten.moveSpeed).toBeGreaterThan(CHARACTERS.warden.moveSpeed);
  });

  for (const w of ["fgGrace", "fgTathagata", "fgSpear", "fgNova", "fgRain", "fgWing", "fgPrism", "fgHalo", "fgJudge", "fgDawn"] as WeaponId[]) {
    it(`무기 ${w}: 적에게 피해`, () => {
      const s = forgotten(w);
      s.enemies[0]!.x = w === "fgNova" || w === "fgDawn" || w === "fgHalo" ? 75 : 110;
      for (let i = 0; i < 120; i++) stepSim(s, FIRE);
      expect(lost(s)).toBeGreaterThan(0);
    });
  }

  it("여래신장: 십자가는 바로가 아니라 잠시 뒤에 떨어짐", () => {
    const s = forgotten("fgTathagata");
    stepSim(s, FIRE);
    expect(s.player.fgFalls?.length).toBe(3);
    expect(lost(s)).toBe(0);
    for (let i = 0; i < 30; i++) stepSim(s, IDLE);
    expect(lost(s)).toBeGreaterThan(0);
  });

  it("처치로 빛의 고리가 차면 신족: 공격 2배 빠르게 + 빛기둥", () => {
    const s = forgotten();
    stepSim(s, IDLE);
    s.kills += F.ringKills;
    stepSim(s, IDLE);
    expect(s.player.fgGod).toBeGreaterThan(F.godTicks - 5);
    expect(s.player.fgRing).toBe(0);
    for (let i = 0; i < F.pillarGap * 2; i++) stepSim(s, IDLE);
    expect(lost(s)).toBeGreaterThanOrEqual(s.player.stats.damage * F.pillarMul);
    // 공격 간격이 절반
    stepSim(s, FIRE);
    expect(s.player.attackCooldown).toBe(Math.max(1, Math.round(60 / (s.player.stats.attackSpeed * F.godSpeed))));
    for (let i = 0; i < F.godTicks; i++) stepSim(s, IDLE);
    expect(s.player.fgGod).toBe(0);
  });

  it("잊힌 기억·신의 잔향·깨어남: 고리 16 · 15초 · 회복", () => {
    const s = forgotten("fgGrace", "fgMemory", "fgEcho", "fgHeal");
    s.player.hp = 10;
    stepSim(s, IDLE);
    s.kills += K.fgMemory.kills;
    stepSim(s, IDLE);
    expect(s.player.fgGod).toBeGreaterThan(K.fgEcho.ticks - 5);
    expect(s.player.hp).toBeGreaterThan(10 + s.player.stats.maxHp * 0.25);
  });

  it("광휘: 빛 공격 뒤 1초마다 광휘 피해", () => {
    const s = forgotten("fgNova", "fgShine");
    s.enemies[0]!.x = 70;
    stepSim(s, FIRE);
    expect(s.enemies[0]!.fgRad).toBeGreaterThan(0);
    const after = lost(s);
    for (let i = 0; i < 70; i++) stepSim(s, IDLE);
    expect(lost(s)).toBeGreaterThan(after);
  });

  it("같은 시드면 같은 결과", () => {
    const run = () => {
      const s = forgotten("fgRain", "fgCross");
      for (let i = 0; i < 200; i++) stepSim(s, FIRE);
      return lost(s);
    };
    expect(run()).toBe(run());
  });
});
