import { describe, expect, it } from "vitest";
import "../balanceTables";
import { CL_ARM_IDS } from "../itemsCollector";
import { COLLECTOR } from "../weaponsCollector";
import { armsOnBack, collected } from "./collector";
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

  it("얻은 차례로 콤보가 늘고, 쓴 무기는 방에 박혀 등 뒤에서 빠짐", () => {
    const s = setup(["clIceSword", "clBlueSpear"]);
    expect(collected(s.player)).toEqual(["clIceSword", "clBlueSpear"]);
    const used: string[] = [];
    for (let i = 0; i < 200 && used.length < 3; i++) {
      const before = s.player.attackCount;
      stepSim(s, attack);
      if (s.player.attackCount > before) used.push(s.effects.filter((f) => f.kind === "clArm").at(-1)?.from ?? "");
    }
    expect(used).toEqual(["clBlade", "clIceSword", "clBlueSpear"]);
    expect(s.player.clStuck?.map((w) => w.id)).toEqual(["clIceSword", "clBlueSpear"]);
    expect(armsOnBack(s.player)).toEqual([]);
    // 박힌 자리는 방 안
    for (const w of s.player.clStuck!) expect(Math.hypot(w.x - s.player.x, w.y - s.player.y)).toBeGreaterThanOrEqual(COLLECTOR.stickMin - 30);
  });

  it("박힌 무기에 닿으면 그 기술이 발동하고 등 뒤로 돌아옴", () => {
    const s = setup(["clStoneHammer"]);
    for (let i = 0; i < 200 && !s.player.clStuck?.length; i++) stepSim(s, attack);
    const w = s.player.clStuck![0]!;
    for (let i = 0; i < COLLECTOR.rest; i++) stepSim(s, EMPTY_INPUT);
    const e = s.enemies[0]!;
    e.x = w.x + 10;
    e.y = w.y;
    const hp = e.hp;
    s.player.x = s.player.prevX = w.x;
    s.player.y = s.player.prevY = w.y;
    stepSim(s, EMPTY_INPUT);
    expect(s.player.clStuck).toEqual([]);
    expect(armsOnBack(s.player)).toEqual(["clStoneHammer"]);
    expect(e.hp).toBeLessThan(hp);
  });

  it("방을 나가면 박힌 무기는 저절로 돌아옴", () => {
    const s = setup(["clKatana"]);
    for (let i = 0; i < 200 && !s.player.clStuck?.length; i++) stepSim(s, attack);
    expect(armsOnBack(s.player)).toEqual([]);
    s.roomId = (s.roomId + 1) % s.map.rooms.length;
    stepSim(s, EMPTY_INPUT);
    expect(armsOnBack(s.player)).toEqual(["clKatana"]);
  });
});
