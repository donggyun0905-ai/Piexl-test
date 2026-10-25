import { describe, expect, it } from "vitest";
import { CHARACTERS, WEAPONS, type WeaponId } from "../content";
import type { PassiveId } from "../items";
import { PASSIVES } from "../items";
import { GENERAL, LEGEND_COLORS, SPEAR_COMBOS } from "../weaponsGeneral";
import { createRun, stepSim, type RunState } from "./index";
import { recalcStats } from "./items";
import { weaponPool } from "./loot";
import { enemy, FIRE, run } from "./perkTestUtil";

/** 장수로 시작해 무기·아이템을 가진 채, 적 없는 방 (오른쪽을 봄) */
function general(weapon: WeaponId = "trainingSpear", ...perks: PassiveId[]): RunState {
  const s = createRun(3, "general");
  s.player.weaponId = weapon;
  s.player.passives.push(...perks);
  recalcStats(s);
  s.enemies = [];
  s.player.x = s.player.prevX = 40;
  s.player.y = s.player.prevY = 72;
  return s;
}
/** 공격 한 번 하고, 그 기술 뒤 쉬는 틱(다음 기술까지) */
function attackOnce(s: RunState): number {
  const n = s.player.attackCount;
  for (let i = 0; i < 200 && s.player.attackCount === n; i++) stepSim(s, FIRE);
  return s.player.attackCooldown;
}

describe("장수", () => {
  it("훈련용 창으로 시작, 명장 무기 10개 · 숨겨진 힘 포함 전용 아이템", () => {
    expect(CHARACTERS.general.startWeapon).toBe("trainingSpear");
    const all = weaponPool(general(), true);
    expect(all).toHaveLength(10);
    for (const id of all) expect(WEAPONS[id]).toMatchObject({ exclusive: "general", kind: "spear" });
    expect(PASSIVES.hiddenPower).toMatchObject({ exclusive: "general" });
  });

  it("콤보는 끊기지 않고 이어짐: 찌르기 3 → 휘두르기 2 → 돌진 내리꽂기, 묶음 끝마다 조금 쉼", () => {
    const s = general();
    const kinds: string[] = [];
    const waits: number[] = [];
    for (let i = 0; i < 6; i++) {
      waits.push(attackOnce(s));
      // 이번 틱에 새로 생긴 효과
      const fresh = s.effects.filter((e) => e.ticks >= e.maxTicks - 1);
      kinds.push(fresh.some((e) => e.kind === "thrust") ? (fresh.some((e) => e.kind === "blast") ? "lunge" : "thrust") : "swing");
    }
    expect(kinds).toEqual(["thrust", "thrust", "thrust", "swing", "swing", "lunge"]);
    expect(waits[2]!).toBeGreaterThan(waits[0]!);
    expect(waits[4]!).toBeGreaterThan(waits[3]!);
    // 다시 처음부터 이어짐
    expect(s.player.gStep).toBe(0);
    expect(SPEAR_COMBOS.basic).toHaveLength(6);
  });

  it("찌르기는 근접보다 멀리 닿음 · 돌진은 앞으로 나가며 끝에서 폭발", () => {
    const s = general();
    s.enemies = [enemy(1, 40 + 50, 72, 500)];
    attackOnce(s);
    expect(s.enemies[0]!.hp).toBeLessThan(500);
    const s2 = general();
    s2.player.gStep = 5;
    const x0 = s2.player.x;
    s2.enemies = [enemy(1, 40 + GENERAL.lungeDist + s2.player.stats.range + 10, 72 + 12, 500)];
    attackOnce(s2);
    expect(s2.player.x).toBeGreaterThan(x0);
    expect(s2.enemies[0]!.hp).toBeLessThan(500);
  });

  it("숨겨진 힘: 콤보 마지막에 무기 주인의 필살기", () => {
    const s = general("skyHalberd", "hiddenPower");
    for (let i = 0; i < SPEAR_COMBOS.halberd!.length; i++) attackOnce(s);
    expect(s.effects.some((e) => e.kind === "legend")).toBe(true);
    const plain = general("skyHalberd");
    for (let i = 0; i < SPEAR_COMBOS.halberd!.length; i++) attackOnce(plain);
    expect(plain.effects.some((e) => e.kind === "legend")).toBe(false);
    // 필살기 효과는 그 필살기 색으로
    expect(s.effects.find((e) => e.kind === "legend")!.tint).toBe(LEGEND_COLORS.frenzy);
  });

  it("돌진 내리꽂기는 훈련용 창만, 명장 무기는 저마다 다른 콤보 · 필살기 색도 모두 다름", () => {
    const ends = Object.entries(SPEAR_COMBOS).map(([k, c]) => [k, c!.at(-1)!.kind] as const);
    for (const [k, last] of ends) expect(last === "lunge").toBe(k === "basic");
    // 콤보는 모두 다섯 기술 이상 (필살기까지 너무 빨리 가지 않게)
    for (const c of Object.values(SPEAR_COMBOS)) expect(c!.length).toBeGreaterThanOrEqual(5);
    const shapes = Object.values(SPEAR_COMBOS).map((c) => c!.map((m) => m.kind).join());
    expect(new Set(shapes).size).toBe(shapes.length);
    const colors = Object.values(LEGEND_COLORS);
    expect(new Set(colors).size).toBe(colors.length);
  });

  it("불굴: 체력이 낮으면 묶음 끝에서도 쉬지 않음", () => {
    const s = general("trainingSpear", "unbreakable");
    s.player.hp = 10;
    const a = attackOnce(s);
    attackOnce(s);
    expect(attackOnce(s)).toBe(a);
  });

  it("돌진(내리꽂기·돌진 베기)마다 보호막 10, 2초 뒤 사라짐", () => {
    const s = general("skyHalberd");
    for (let i = 0; i < SPEAR_COMBOS.halberd!.length; i++) attackOnce(s);
    expect(s.player.shieldPts).toBe(GENERAL.dashShield);
    run(s, GENERAL.dashShieldTicks);
    expect(s.player.shieldPts ?? 0).toBe(0);
  });
});
