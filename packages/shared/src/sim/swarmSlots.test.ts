import { describe, expect, it } from "vitest";
import { PASSIVE_IDS } from "../items";
import { SWARM } from "../swarmDefs";
import { createSwarm } from "./swarm";
import { makeChoices, passiveSlotOpen, weaponSlotOpen } from "./swarmLevel";

describe("광야의 새벽 칸 늘리기", () => {
  it("패시브 칸이 다 차도 모두 최대 레벨이면 한 칸 더 열림", () => {
    const s = createSwarm(5, "warden");
    const sw = s.swarm!;
    sw.passives = PASSIVE_IDS.slice(0, SWARM.maxPassives).map((id) => ({ id, lv: SWARM.maxLevel - 1 }));
    expect(passiveSlotOpen(s)).toBe(false);
    for (const p of sw.passives) p.lv = SWARM.maxLevel;
    expect(passiveSlotOpen(s)).toBe(true);
    expect(makeChoices(s).length).toBeGreaterThan(0);
  });

  it("무기 칸도 같음 (처음 무기 하나뿐이면 열려 있음)", () => {
    const s = createSwarm(5, "warden");
    expect(weaponSlotOpen(s)).toBe(true);
  });
});
