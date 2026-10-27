import { describe, expect, it } from "vitest";
import { decodeInputs, encodeInputs } from "../daily";
import { createRun, EMPTY_INPUT, stepSim } from "./index";
import { recalcStats } from "./items";
import { sellPrice } from "./shop";
import { enemy } from "./perkTestUtil";

/** 상점 방에 서 있는 판 */
function inShop() {
  const s = createRun(3, "drifter");
  s.roomId = s.map.rooms.findIndex((r) => r.type === "shop");
  s.enemies = [];
  return s;
}

describe("상점 팔기 · 한 번만 먹는 패시브 · 보스가 부른 적", () => {
  it("상점에서만 사용 아이템·패시브를 1/4 값에 팖 (패시브는 능력치도 빠짐)", () => {
    const s = inShop();
    s.player.useSlots = ["potion", null];
    s.player.passives.push("whetstone");
    recalcStats(s);
    const gold = s.gold;
    const price = sellPrice(s, 1);
    expect(price).toBeGreaterThan(0);
    stepSim(s, { ...EMPTY_INPUT, sell: 1 });
    expect(s.player.useSlots[0]).toBeNull();
    expect(s.gold).toBe(gold + price);
    stepSim(s, { ...EMPTY_INPUT, sell: 3 });
    expect(s.player.passives).toHaveLength(0);
    const out = createRun(3, "drifter");
    out.player.useSlots = ["potion", null];
    expect(sellPrice(out, 1)).toBe(0);
  });

  it("팔기 입력은 기록·다시 돌리기에 그대로 남음", () => {
    const inputs = [EMPTY_INPUT, { ...EMPTY_INPUT, sell: 4 }, EMPTY_INPUT, EMPTY_INPUT];
    expect(decodeInputs(encodeInputs(inputs)).map((i) => i.sell ?? 0)).toEqual([0, 4, 0, 0]);
  });

  it("보스가 부른 적은 처치 수에 들어가지 않음", () => {
    const s = inShop();
    s.enemies = [{ ...enemy(1, s.player.x + 8, s.player.y, 1), noGold: true }];
    for (let i = 0; i < 30; i++) stepSim(s, { ...EMPTY_INPUT, aimX: 1000, attack: true });
    expect(s.enemies).toHaveLength(0);
    expect(s.kills).toBe(0);
  });
});
