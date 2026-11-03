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

  it("공격 한 번에 콤보 전체가 짧은 간격으로 이어짐 (기본 검 → 얻은 차례대로), 무기는 빠지지 않음", () => {
    const s = setup(["clIceSword", "clBlueSpear", "clStoneHammer"]);
    expect(collected(s.player)).toEqual(["clIceSword", "clBlueSpear", "clStoneHammer"]);
    const used: string[] = [];
    let first = -1;
    for (let i = 0; i < 60; i++) {
      const before = s.effects.filter((f) => f.kind === "clMove").length;
      stepSim(s, attack);
      const now = s.effects.filter((f) => f.kind === "clMove");
      if (now.length > before) {
        used.push(now.at(-1)!.from ?? "");
        if (first < 0) first = i;
      }
      if (used.length >= 4) {
        // 넷째(망치)까지 간격 3번 = 15틱 안에
        expect(i - first).toBeLessThanOrEqual(COLLECTOR.gap * 3);
        break;
      }
    }
    expect(used).toEqual(["clBlade", "clIceSword", "clBlueSpear", "clStoneHammer"]);
    expect(collected(s.player)).toHaveLength(3);
  });

  it("콤보가 끝나야 공격 대기가 시작되고, 다음 공격에 다시 처음부터", () => {
    const s = setup(["clKatana"]);
    for (let i = 0; i < 3 * COLLECTOR.gap && (s.player.clCombo || i === 0); i++) stepSim(s, attack);
    expect(s.player.clCombo).toBeUndefined();
    expect(s.player.attackCooldown).toBeGreaterThan(0);
    for (let i = 0; i < 200 && !s.player.clCombo; i++) stepSim(s, attack);
    expect(s.player.clCombo?.i).toBe(1);
  });

  it("수집 무기마다 맞히는 방식이 다름 (망치는 노린 적 자리를 내리찍어 피해)", () => {
    const s = setup(["clStoneHammer"]);
    const e = s.enemies[0]!;
    const hp = e.hp;
    for (let i = 0; i < 20; i++) stepSim(s, attack);
    expect(e.hp).toBeLessThan(hp);
    expect(s.effects.some((f) => f.kind === "clMove" && f.from === "clStoneHammer")).toBe(true);
  });
});
