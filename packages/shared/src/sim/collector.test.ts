import { describe, expect, it } from "vitest";
import "../balanceTables";
import { CL_ARM_IDS } from "../itemsCollector";
import { COLLECTOR } from "../weaponsCollector";
import { collected } from "./collector";
import { recalcStats } from "./items";
import { passivePool, weaponPool } from "./loot";
import { createRun, EMPTY_INPUT, stepSim, type RunState } from "./index";
import { makeEnemy } from "./util";

/** 수집가 + 앞에 단단한 허수아비 하나 */
function setup(arms: string[] = []): RunState {
  const s = createRun(3, "collector");
  s.player.passives.push(...(arms as never[]));
  recalcStats(s);
  const e = makeEnemy(s, "crawler", s.player.x + 20, s.player.y - 10, 1, 9999);
  e.hp = e.maxHp = 99999;
  s.enemies = [e];
  s.rooms[s.roomId]!.cleared = false;
  s.player.invulnTicks = 99999;
  return s;
}
const attack = { ...EMPTY_INPUT, attack: true };

describe("수집가", () => {
  it("무기는 기본 검 하나뿐 · 수집 무기 30개가 전용 패시브로 나옴", () => {
    const s = createRun(3, "collector");
    expect(s.player.weaponId).toBe("clBlade");
    expect(weaponPool(s)).toEqual([]);
    expect(CL_ARM_IDS).toHaveLength(30);
    const pool = passivePool(s);
    for (const id of CL_ARM_IDS) expect(pool).toContain(id);
    expect(passivePool(createRun(3, "warden"))).not.toContain("clKatana");
  });

  it("격투가처럼 공격할 때마다 콤보 한 칸: 기본 검 → 얻은 차례대로 → 다시 기본 검", () => {
    const s = setup(["clIceSword", "clBlueSpear", "clStoneHammer"]);
    const used: string[] = [];
    for (let i = 0; i < 400 && used.length < 5; i++) {
      const n = s.player.attackCount;
      stepSim(s, attack);
      if (s.player.attackCount > n) used.push(s.player.clOut ?? "");
    }
    expect(used).toEqual(["clBlade", "clIceSword", "clBlueSpear", "clStoneHammer", "clBlade"]);
    expect(collected(s.player)).toHaveLength(3);
  });

  it("잠깐 쉬면 콤보가 처음부터", () => {
    const s = setup(["clKatana", "clHolySword"]);
    for (let i = 0; i < 200 && (s.player.clStep ?? 0) < 2; i++) stepSim(s, attack);
    expect(s.player.clStep).toBe(2);
    for (let i = 0; i < COLLECTOR.reset + 60; i++) stepSim(s, EMPTY_INPUT);
    expect(s.player.clStep).toBe(0);
  });

  it("무기마다 공격이 다름: 돌 망치는 치켜든 뒤 크게 휘둘러 피해 · 흰 날개 활은 유도 화살 셋", () => {
    const s = setup(["clStoneHammer"]);
    const e = s.enemies[0]!;
    // 기본 검 다음 칸에서 망치 (치켜든 뒤 휘두름)
    for (let i = 0; i < 200 && s.player.clOut !== "clStoneHammer"; i++) stepSim(s, attack);
    const hp = e.hp;
    for (let i = 0; i < 14; i++) stepSim(s, EMPTY_INPUT);
    expect(e.hp).toBeLessThan(hp);
    expect(s.effects.some((f) => f.kind === "clMove" && f.motif === "clStoneHammer")).toBe(true);
    const b = setup(["clWhiteBow"]);
    b.enemies[0]!.x += 90;
    for (let i = 0; i < 200 && b.player.clOut !== "clWhiteBow"; i++) stepSim(b, attack);
    const arrows = b.projectiles.filter((pr) => pr.spirit === "clShot" && pr.tint === "clWhiteBow");
    expect(arrows).toHaveLength(3);
    expect(arrows.every((pr) => pr.homing)).toBe(true);
  });

  it("여러 번 때리는 무기: 얼음 창은 열 번 찌름", () => {
    const s = setup(["clIceSpear"]);
    const seen = new Set<object>();
    for (let i = 0; i < 200; i++) {
      stepSim(s, s.player.clOut === "clIceSpear" ? EMPTY_INPUT : attack);
      for (const f of s.effects) if (f.kind === "clMove" && f.motif === "clIceSpear") seen.add(f);
      if (seen.size >= 10) break;
    }
    expect(seen.size).toBe(10);
  });
});
